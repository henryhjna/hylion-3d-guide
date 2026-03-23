import { useState, useCallback, useRef } from 'react';

export function useAICopilot({ rawDocs, currentWeek, currentView, selectedPart, selectedMember }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKeyVersion, setApiKeyVersion] = useState(0);
  const abortRef = useRef(null);

  const getApiKey = () => localStorage.getItem('hylion_api_key');
  // Force re-check after settings modal saves
  const refreshApiKey = useCallback(() => setApiKeyVersion(v => v + 1), []);

  const buildSystemPrompt = useCallback(() => {
    const plan = rawDocs?.plan || '';
    const guide = rawDocs?.guide || '';

    return `당신은 HYlion Physical AI 로봇 프로젝트의 AI 어시스턴트입니다.

## 프로젝트 문서

### 기획서
${plan}

### 실행가이드
${guide}

## 현재 컨텍스트
- 현재 주차: Week ${currentWeek ?? '미정'}
- 선택된 뷰: ${currentView || '로봇 탐색'}
- 선택된 파트: ${selectedPart || '없음'}
- 선택된 멤버: ${selectedMember || '없음'}

## 행동 지침
- 질문에 대해 기획서/실행가이드의 구체적 섹션을 근거로 답변하라.
- 가능하면 "기획서 7.2절에 따르면..." 식으로 출처를 밝혀라.
- 학생의 현재 맥락(주차, 파트, 역할)을 고려하여 답변하라.
- 기술적 질문에는 정확하게, 동기부여가 필요한 질문에는 따뜻하게.
- "이번 주 뭐 해야 해?"류에는 실행가이드에서 해당 멤버의 체크리스트를 뽑아라.
- "왜 이렇게 설계했어?"류에는 기획서의 설계 원칙(2절)과 해당 섹션의 맥락을 설명하라.
- 답변은 간결하되 핵심을 놓치지 마라. 마크다운 포맷 사용.`;
  }, [rawDocs, currentWeek, currentView, selectedPart, selectedMember]);

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
          system: buildSystemPrompt(),
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
      const assistantMessage = data.content[0].text;

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
  }, [messages, buildSystemPrompt]);

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
