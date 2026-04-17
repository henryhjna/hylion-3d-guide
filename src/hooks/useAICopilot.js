import { useState, useCallback, useRef } from 'react';
import { WEEK_LABELS, getWeekData } from '../data/weekHelpers';

export function useAICopilot({ searchDocs, currentWeek, currentView, selectedPart, selectedMember }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeyVersion, setApiKeyVersion] = useState(0);
  const abortRef = useRef(null);

  const getApiKey = () => localStorage.getItem('hylion_api_key');
  const refreshApiKey = useCallback(() => setApiKeyVersion(v => v + 1), []);

  // Member ID → 실명 매핑
  const memberNames = { delta1: '인혁', delta2: '승민', delta3: '희승', epsilon1: '성래', epsilon2: '상윤' };
  const memberRoles = { delta1: '하드웨어·외장 오너 (Track A 리드)', delta2: '보행 시스템 오너 (Track B 리드)', delta3: 'AI 인프라 오너 (A+B)', epsilon1: '배포·통합 오너 (Track A)', epsilon2: '캐릭터·검증·외장 오너 (A+B)' };

  const buildSystemPrompt = useCallback((retrievedContext) => {
    const memberName = selectedMember ? (memberNames[selectedMember] || selectedMember) : '없음';
    const memberRole = selectedMember ? (memberRoles[selectedMember] || '') : '';
    const weekLabel = currentWeek ? (WEEK_LABELS[currentWeek] || currentWeek) : '미정';
    const weekTitle = currentWeek ? (getWeekData(currentWeek)?.title || '') : '';

    return `당신은 HYlion Physical AI 로봇 프로젝트의 AI 어시스턴트입니다.
팀원 5명(인혁/δ1, 승민/δ2, 희승/δ3, 성래/ε1, 상윤/ε2)이 2026-06-01 최종발표를 향해 6주 카운트다운(W-6~W-1)으로 이족보행 로봇을 만듭니다.
누적 통합 순서: torso+mouth(W-6) → +arm(W-5) → +bhl leg(W-4) → +머리/실내 sim2real(W-3) → 실외+공연장 sim2real(W-2) → 공연장 리허설(W-1) → 발표.

## 현재 컨텍스트
- 현재 주차: ${weekLabel}${weekTitle ? ' — ' + weekTitle : ''}
- 선택된 뷰: ${currentView || '작업'}
- 선택된 파트: ${selectedPart || '없음'}
- 선택된 멤버: ${memberName}${memberRole ? ' (' + memberRole + ')' : ''}

## 관련 문서 (질문 기반 검색 결과)
${retrievedContext || '(검색 결과 없음)'}

## 행동 지침
- 질문에 대해 위 검색된 문서 섹션을 근거로 답변하라.
- 가능하면 "기획서 7.2절에 따르면..." 식으로 출처를 밝혀라.
- 학생의 현재 맥락(주차, 파트, 역할)을 고려하여 답변하라.
- 멤버를 부를 때는 실명을 사용하라 (인혁, 승민 등).
- 기술적 질문에는 정확하게, 동기부여가 필요한 질문에는 따뜻하게.
- "이번 주 뭐 해야 해?"류에는 해당 멤버의 체크리스트를 뽑아라.
- "왜 이렇게 설계했어?"류에는 설계 원칙과 해당 섹션의 맥락을 설명하라.
- 검색 결과에 답이 없으면 솔직히 "문서에서 해당 내용을 찾지 못했습니다"라고 하라.
- 답변은 간결하되 핵심을 놓치지 마라. 마크다운 포맷 사용.`;
  }, [currentWeek, currentView, selectedPart, selectedMember]);

  // RAG: 질문 + 대화 맥락에서 검색 키워드 추출 → 관련 섹션 검색
  const retrieveContext = useCallback((userMessage) => {
    if (!searchDocs) return '';

    // 검색 쿼리: 유저 메시지 + 현재 컨텍스트 키워드
    const weekLabel = currentWeek ? (WEEK_LABELS[currentWeek] || currentWeek) : null;
    const contextKeywords = [
      selectedPart,
      selectedMember ? memberNames[selectedMember] : null,
      weekLabel,
    ].filter(Boolean).join(' ');

    const query = userMessage + ' ' + contextKeywords;

    // 핵심 키워드로 1차 검색
    const results = searchDocs(query);

    // 유저 메시지 단어별 추가 검색 (짧은 질문 보완)
    const words = userMessage.split(/\s+/).filter(w => w.length >= 2);
    const extraResults = [];
    for (const word of words.slice(0, 3)) {
      const hits = searchDocs(word);
      for (const hit of hits) {
        if (!results.find(r => r.sectionTitle === hit.sectionTitle && r.fileId === hit.fileId)) {
          extraResults.push(hit);
        }
      }
    }

    // 상위 5개 섹션 선택 (1차 결과 우선, 나머지 보충)
    const topResults = [...results.slice(0, 4), ...extraResults.slice(0, 2)].slice(0, 5);

    if (topResults.length === 0) return '';

    return topResults.map((r, i) => {
      const source = r.fileName || r.fileId;
      const section = r.sectionTitle;
      // 내용은 2000자로 제한 (긴 섹션 잘라내기)
      const content = (r.content || '').slice(0, 2000);
      return `### [${i + 1}] ${source} — ${section}\n${content}`;
    }).join('\n\n');
  }, [searchDocs, selectedPart, selectedMember, currentWeek]);

  const sendMessage = useCallback(async (userMessage) => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setError('API_KEY_MISSING');
      return null;
    }

    setIsLoading(true);
    setError(null);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      abortRef.current = new AbortController();

      // RAG: 질문 기반으로 관련 문서 섹션만 검색
      const retrievedContext = retrieveContext(userMessage);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: buildSystemPrompt(retrievedContext),
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      });

      if (response.status === 401) {
        setError('API_KEY_INVALID');
        setIsLoading(false);
        return null;
      }

      if (!response.ok) {
        setError('API_ERROR');
        setIsLoading(false);
        return null;
      }

      const data = await response.json();
      const assistantMessage = data.content?.[0]?.text || '응답을 받지 못했습니다.';

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      setIsLoading(false);
      return assistantMessage;
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError('NETWORK_ERROR');
      }
      setIsLoading(false);
      return null;
    }
  }, [messages, buildSystemPrompt, retrieveContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    cancel,
    hasApiKey: !!getApiKey(),
    refreshApiKey,
  };
}
