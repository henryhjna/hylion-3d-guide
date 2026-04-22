import { useState, useEffect, useMemo, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GlossaryText from './GlossaryText';
import MermaidBlock from './MermaidBlock';

const DOC_LIST = [
  {
    id: 'plan',
    name: '기획서 v13',
    emoji: '📋',
    category: 'plan',
    summary: '프로젝트 설계의 원본. 왜 이렇게 만드는지 전체 방향·아키텍처·리스크 정의.',
    audience: '처음 합류했거나 전체 그림이 필요할 때',
    tags: ['전체 기획', '아키텍처', '리스크'],
    path: `${import.meta.env.BASE_URL}assets/docs/기획서_v13.md`,
  },
  {
    id: 'guide',
    name: '실행가이드 v14',
    emoji: '🗓',
    category: 'plan',
    summary: 'W-6~W-1 주간 단위 할 일·게이트·담당자. 현재 진행 중인 작업을 여기서 확인.',
    audience: '매일·매주 할 일을 체크할 때',
    tags: ['주간 계획', '체크리스트', '담당자'],
    path: `${import.meta.env.BASE_URL}assets/docs/실행가이드_v14.md`,
  },
  {
    id: 'bhl_guide',
    name: 'BHL 하체 빌드 가이드',
    emoji: '🦿',
    category: 'plan',
    summary: '하이리온 하체(토르소+다리 12 DoF) 전용. BHL 공식 기준 BESC 구성·플래시·AS5600 수정·캘리브레이션 전 과정.',
    audience: '승민·희승 (하체 조립·플래싱), 전원 검증',
    tags: ['BHL', 'BESC', 'AS5600', 'IM10A', '25Hz policy', '250Hz CAN', 'Recoil'],
    path: `${import.meta.env.BASE_URL}assets/docs/bhl_하체_가이드.md`,
  },
  {
    id: 'signal_flow',
    name: 'Signal Flow',
    emoji: '🔀',
    category: 'diagram',
    summary: '로봇 센서 입력 → 판단 → 액추에이터 출력까지 전체 신호 흐름.',
    audience: '"음성 명령이 어떻게 다리까지 전달되지?" 같은 질문',
    tags: ['Orin', 'NUC', 'Whisper', 'SmolVLA', '다리', '팔'],
    path: `${import.meta.env.BASE_URL}assets/docs/signal_flow.md`,
  },
  {
    id: 'signal_cables',
    name: '신호 케이블',
    emoji: '🔌',
    category: 'diagram',
    summary: 'Orin/NUC 물리 포트 배정. USB Hub, CAN 데이지체인, TTL 데이지체인.',
    audience: '물리 케이블 꽂을 때·포트 충돌 체크',
    tags: ['USB', 'Hub', 'CAN', 'Ethernet'],
    path: `${import.meta.env.BASE_URL}assets/docs/signal_cables.md`,
  },
  {
    id: 'power',
    name: '전원 배선',
    emoji: '🔋',
    category: 'diagram',
    summary: '배터리 ×2 → DC-DC ×3 → 모든 부하로의 전원 분배. XT60 분기 구성.',
    audience: '전원 조립·비상정지 이해·전류 산정',
    tags: ['Battery', 'DC-DC', 'XT60', 'ESC 24V'],
    path: `${import.meta.env.BASE_URL}assets/docs/power_cables.md`,
  },
  {
    id: 'software',
    name: '소프트웨어 아키텍처',
    emoji: '⚙️',
    category: 'diagram',
    summary: 'Orin/NUC/ESC/IMU 각 보드에서 돌아가는 프로세스와 데이터 흐름.',
    audience: '소프트웨어 구현 담당자 (성래·승민·상윤·희승)',
    tags: ['Orin SW', 'NUC SW', 'ESC FW', 'ONNX'],
    path: `${import.meta.env.BASE_URL}assets/docs/software_architecture.md`,
  },
  {
    id: 'state_machine',
    name: 'State Machine',
    emoji: '🔁',
    category: 'diagram',
    summary: 'IDLE / TALKING / MANIPULATING / WALKING / FETCH / EMERGENCY 전환 규칙.',
    audience: '오케스트레이터 구현·시나리오 설계',
    tags: ['FSM', 'IDLE', 'FETCH', 'EMERGENCY'],
    path: `${import.meta.env.BASE_URL}assets/docs/state_machine.md`,
  },
  {
    id: 'dgx',
    name: 'DGX Spark 가이드',
    emoji: '🖥',
    category: 'infra',
    summary: 'DGX Spark 원격 접속·학습 슬롯 배분·체크포인트 관리.',
    audience: '희승(RL) + 상윤(SmolVLA) 학습 담당',
    tags: ['DGX', 'SmolVLA', 'Walking RL', '원격'],
    path: `${import.meta.env.BASE_URL}assets/docs/DGX_Spark_가이드.md`,
  },
];

const CATEGORIES = [
  { id: 'plan', label: '📋 계획·가이드', desc: '프로젝트 방향·주간 계획' },
  { id: 'diagram', label: '⚡ 시스템 다이어그램', desc: '신호·케이블·전원·소프트웨어' },
  { id: 'infra', label: '🖥 인프라', desc: '학습 서버·원격 환경' },
];

const HOME_ID = '__home__';

/* ── 읽기 테마 ─────────────────────────────────────────────
   paper: 밝은 종이 배경 + 어두운 글자 (긴 문서에 최적, 기본값)
   sepia: 따뜻한 크림 (장시간 / 실내 조명)
   dark : 기존 다크 + 네온 (저조도 환경)
   ────────────────────────────────────────────────────────── */
const READ_THEMES = {
  paper: {
    label: '📄 종이',
    bg: '#fafaf5',
    pageBorder: '#e5e2d8',
    text: '#1f1f24',
    muted: '#5a5a66',
    h1: '#0a3d6b',
    h2: '#1b4f86',
    h3: '#6a7a1f',
    strong: '#000000',
    link: '#0052a0',
    codeBg: '#f0ecda',
    codeText: '#8c4a10',
    inlineCodeBg: '#fff1de',
    inlineCodeText: '#a85413',
    tableHead: '#5a5a66',
    tableBorder: '#d8d4c6',
    tableRowBorder: '#e8e4d6',
    hr: '#dcd6c5',
    blockquoteBorder: '#4466ff',
    blockquoteText: '#4a4a55',
    headerBg: '#f4efe0',
    headerBorder: '#e5e2d8',
    tagBg: '#e5e2d8',
    tagText: '#5a5a66',
  },
  sepia: {
    label: '☕ 세피아',
    bg: '#f4ecd8',
    pageBorder: '#dccdaa',
    text: '#3d3a2e',
    muted: '#6b6655',
    h1: '#8b4513',
    h2: '#a0522d',
    h3: '#6b7a1f',
    strong: '#2a2a2a',
    link: '#6b4020',
    codeBg: '#e5dcbe',
    codeText: '#703d10',
    inlineCodeBg: '#f0e4c2',
    inlineCodeText: '#8c4a10',
    tableHead: '#6b6655',
    tableBorder: '#c8bb9a',
    tableRowBorder: '#d8cfb0',
    hr: '#c8bb9a',
    blockquoteBorder: '#8b5a2b',
    blockquoteText: '#5c5543',
    headerBg: '#ebe1c8',
    headerBorder: '#dccdaa',
    tagBg: '#dccdaa',
    tagText: '#6b6655',
  },
  dark: {
    label: '🌙 다크',
    bg: 'transparent',
    pageBorder: 'transparent',
    text: '#e0e8ff',
    muted: '#aab0cc',
    h1: '#00f0ff',
    h2: '#4466ff',
    h3: '#c8ff00',
    strong: '#e0e8ff',
    link: '#4466ff',
    codeBg: '#0a0a0f',
    codeText: '#00ff88',
    inlineCodeBg: '#ffffff10',
    inlineCodeText: '#ff8800',
    tableHead: '#9aa0b8',
    tableBorder: '#ffffff15',
    tableRowBorder: '#ffffff08',
    hr: '#ffffff10',
    blockquoteBorder: '#4466ff',
    blockquoteText: '#9aa0b8',
    headerBg: 'transparent',
    headerBorder: '#ffffff10',
    tagBg: '#ffffff06',
    tagText: '#9aa0b8',
  },
};

export default function DocsReader({ isOpen, onClose, onAskCopilot, initialDocId, initialSearch }) {
  // null 또는 HOME_ID → 홈 카드 그리드 표시. 문자열 id이면 해당 문서 렌더.
  const [selectedDoc, setSelectedDoc] = useState(initialDocId || HOME_ID);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [activeHeading, setActiveHeading] = useState(null);
  const [readTheme, setReadTheme] = useState(() => localStorage.getItem('hylion_docs_theme') || 'paper');
  const contentScrollRef = useRef(null);
  const theme = READ_THEMES[readTheme] || READ_THEMES.paper;
  const isDarkTheme = readTheme === 'dark';

  useEffect(() => {
    localStorage.setItem('hylion_docs_theme', readTheme);
  }, [readTheme]);

  useEffect(() => {
    if (isOpen) {
      setSelectedDoc(initialDocId || HOME_ID);
    }
  }, [initialDocId, isOpen]);

  useEffect(() => {
    if (!isOpen || selectedDoc === HOME_ID) { setContent(''); return; }
    setIsLoading(true);
    const doc = DOC_LIST.find(d => d.id === selectedDoc);
    if (doc) {
      fetch(doc.path)
        .then(r => r.text())
        .then(text => { setContent(text); setIsLoading(false); })
        .catch(() => { setContent('문서를 불러올 수 없습니다.'); setIsLoading(false); });
      // 문서 전환 시 스크롤 맨 위
      requestAnimationFrame(() => {
        contentScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
      });
      setActiveHeading(null);
    }
  }, [selectedDoc, isOpen]);

  // TOC
  const toc = useMemo(() => {
    if (!content) return [];
    return content.split('\n')
      .filter(line => /^#{1,3}\s/.test(line))
      .map((line, i) => {
        const level = line.match(/^(#+)/)[1].length;
        const title = line.replace(/^#+\s*/, '');
        return { level, title, id: `heading-${i}` };
      });
  }, [content]);

  // 현재 문서 위치 (prev/next 계산)
  const docIndex = useMemo(() => DOC_LIST.findIndex(d => d.id === selectedDoc), [selectedDoc]);
  const prevDoc = docIndex > 0 ? DOC_LIST[docIndex - 1] : null;
  const nextDoc = docIndex >= 0 && docIndex < DOC_LIST.length - 1 ? DOC_LIST[docIndex + 1] : null;
  const currentDoc = docIndex >= 0 ? DOC_LIST[docIndex] : null;

  // 스크롤 observer로 현재 섹션 TOC 하이라이트
  useEffect(() => {
    if (selectedDoc === HOME_ID || !toc.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveHeading(visible[0].target.id);
        }
      },
      { root: contentScrollRef.current, rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    const timer = setTimeout(() => {
      toc.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 200);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [toc, selectedDoc]);

  if (!isOpen) return null;

  const isHome = selectedDoc === HOME_ID;

  return (
    <div className="fixed inset-0 z-[80] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative flex w-[96vw] max-w-[1600px] h-[92vh] mx-auto my-auto glass-panel overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Left sidebar ── */}
        <div className="w-[260px] border-r border-[#ffffff10] flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button
              onClick={() => setSelectedDoc(HOME_ID)}
              className={`text-sm font-bold transition-colors ${isHome ? 'text-[#00f0ff]' : 'text-[#4466ff] hover:text-[#6688ff]'}`}
              title="문서 홈"
            >
              📖 문서 홈
            </button>
            <button onClick={onClose} className="text-sm text-[#9aa0b8] hover:text-[#e0e8ff]">✕</button>
          </div>

          {/* 문서 목록 (카테고리별 그룹) */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {CATEGORIES.map(cat => {
              const docs = DOC_LIST.filter(d => d.category === cat.id);
              if (!docs.length) return null;
              return (
                <div key={cat.id} className="mt-4">
                  <div className="text-sm font-bold text-[#9aa0b8] px-2 mb-2 tracking-wide">{cat.label}</div>
                  <div className="space-y-1">
                    {docs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc.id)}
                        className={`w-full text-left px-2 py-2 rounded transition-colors ${
                          selectedDoc === doc.id
                            ? 'bg-[#4466ff20] text-[#e0e8ff] border border-[#4466ff40]'
                            : 'text-[#9aa0b8] hover:text-[#e0e8ff] hover:bg-[#ffffff08] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <span>{doc.emoji}</span>
                          <span>{doc.name}</span>
                        </div>
                        <div className="text-sm text-[#6a7090] mt-1 leading-snug line-clamp-2">
                          {doc.summary}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 현재 문서 검색 (홈 아닐 때만) */}
          {!isHome && (
            <div className="border-t border-[#ffffff10] p-3 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      const mark = document.querySelector('.docs-content mark');
                      mark?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  placeholder="이 문서에서 찾기..."
                  className="w-full px-2 py-1.5 rounded bg-[#0a0a0f] border border-[#ffffff10] text-sm text-[#e0e8ff] focus:outline-none focus:border-[#4466ff40]"
                />
                {searchQuery.trim() && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#9aa0b8]">
                    {(content.toLowerCase().match(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length}건
                  </span>
                )}
              </div>

              {/* TOC */}
              {toc.length > 0 && (
                <div className="max-h-[40vh] overflow-y-auto pt-2 border-t border-[#ffffff08]">
                  <div className="text-sm font-bold text-[#9aa0b8] px-1 mb-2">목차</div>
                  <div className="space-y-0.5">
                    {toc.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className={`block w-full text-left text-sm py-1 px-2 rounded truncate transition-colors ${
                          activeHeading === item.id
                            ? 'bg-[#00f0ff15] text-[#00f0ff] border-l-2 border-[#00f0ff]'
                            : 'text-[#9aa0b8] hover:text-[#e0e8ff] hover:bg-[#ffffff05] border-l-2 border-transparent'
                        }`}
                        style={{ paddingLeft: `${(item.level - 1) * 10 + 8}px` }}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: content ── */}
        <div
          ref={contentScrollRef}
          className="flex-1 overflow-y-auto"
          style={{ background: theme.bg }}
        >
          {isHome ? (
            <HomeView docs={DOC_LIST} categories={CATEGORIES} onSelect={setSelectedDoc} theme={theme} />
          ) : (
            <>
              {/* 읽기 테마 토글 — sticky 상단 */}
              <div
                className="sticky top-0 z-10 flex items-center justify-end gap-1.5 px-6 py-2 backdrop-blur"
                style={{
                  background: isDarkTheme ? 'rgba(10,12,20,0.85)' : `${theme.bg}f0`,
                  borderBottom: `1px solid ${theme.headerBorder}`,
                }}
              >
                <span className="text-sm mr-2" style={{ color: theme.muted }}>읽기 모드</span>
                {Object.entries(READ_THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setReadTheme(key)}
                    className="px-2.5 py-1 rounded text-sm transition-all"
                    style={{
                      background: readTheme === key ? (isDarkTheme ? '#4466ff25' : '#00000012') : 'transparent',
                      color: readTheme === key ? theme.h2 : theme.muted,
                      border: `1px solid ${readTheme === key ? theme.h2 + '50' : 'transparent'}`,
                      fontWeight: readTheme === key ? 600 : 400,
                    }}
                    title={`${t.label} 읽기 모드`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="max-w-[1100px] mx-auto px-8 py-6">
                {/* 문서 헤더 */}
                {currentDoc && (
                  <div
                    className="mb-6 pb-4 rounded-lg px-4 py-4"
                    style={{
                      background: theme.headerBg,
                      border: `1px solid ${theme.headerBorder}`,
                      borderBottom: `2px solid ${theme.h1}40`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base">{currentDoc.emoji}</span>
                      <h1 className="text-xl font-bold" style={{ color: theme.h1 }}>{currentDoc.name}</h1>
                    </div>
                    <p className="text-sm" style={{ color: theme.text }}>{currentDoc.summary}</p>
                    <p className="text-sm mt-1" style={{ color: theme.muted }}>
                      <span style={{ color: theme.muted, fontWeight: 600 }}>언제 봐야 하나:</span> {currentDoc.audience}
                    </p>
                    {currentDoc.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {currentDoc.tags.map(t => (
                          <span
                            key={t}
                            className="text-sm px-2 py-0.5 rounded"
                            style={{ background: theme.tagBg, color: theme.tagText }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex items-center justify-center h-[40vh]" style={{ color: theme.muted }}>로딩 중...</div>
                ) : (
                  <div className="docs-content" style={{ color: theme.text, fontSize: '15px', lineHeight: 1.75 }}>
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children, ...props }) => <h1 id={findTocId(children, toc, 1)} className="font-bold mt-8 mb-4" style={{ color: theme.h1, fontSize: '22px' }} {...props}>{children}</h1>,
                        h2: ({ children, ...props }) => <h2 id={findTocId(children, toc, 2)} className="font-bold mt-7 mb-3" style={{ color: theme.h2, fontSize: '18px' }} {...props}>{children}</h2>,
                        h3: ({ children, ...props }) => <h3 id={findTocId(children, toc, 3)} className="font-bold mt-5 mb-2.5" style={{ color: theme.h3, fontSize: '16px' }} {...props}>{children}</h3>,
                        p: ({ children }) => <p className="mb-3" style={{ color: theme.text, lineHeight: 1.75 }}>{searchQuery ? highlightNode(children, searchQuery) : typeof children === 'string' ? <GlossaryText text={children} /> : children}</p>,
                        li: ({ children }) => <li className="ml-5 mb-2 list-disc" style={{ color: theme.text, lineHeight: 1.7 }}>{searchQuery ? highlightNode(children, searchQuery) : typeof children === 'string' ? <GlossaryText text={children} /> : children}</li>,
                        pre: ({ children }) => {
                          if (children?.props?.className === 'language-mermaid') {
                            return <MermaidBlock code={String(children.props.children).trim()} />;
                          }
                          return (
                            <pre
                              className="rounded-lg p-3 mb-3 overflow-x-auto"
                              style={{ background: theme.codeBg, border: `1px solid ${theme.tableBorder}` }}
                            >
                              {children}
                            </pre>
                          );
                        },
                        code: ({ children, className }) => {
                          if (className === 'language-mermaid') return <code>{children}</code>;
                          if (className) return <code style={{ color: theme.codeText, fontSize: '13px' }}>{children}</code>;
                          return (
                            <code
                              className="px-1.5 py-0.5 rounded"
                              style={{ background: theme.inlineCodeBg, color: theme.inlineCodeText, fontSize: '13px' }}
                            >
                              {children}
                            </code>
                          );
                        },
                        table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse" style={{ fontSize: '14px' }}>{children}</table></div>,
                        th: ({ children }) => <th className="text-left px-2 py-1.5 font-bold" style={{ borderBottom: `2px solid ${theme.tableBorder}`, color: theme.tableHead }}>{children}</th>,
                        td: ({ children }) => <td className="px-2 py-1.5" style={{ borderBottom: `1px solid ${theme.tableRowBorder}`, color: theme.text }}>{children}</td>,
                        strong: ({ children }) => <strong style={{ color: theme.strong, fontWeight: 700 }}>{children}</strong>,
                        a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: theme.link }}>{children}</a>,
                        hr: () => <hr className="my-5" style={{ borderColor: theme.hr }} />,
                        blockquote: ({ children }) => <blockquote className="pl-3 my-3" style={{ borderLeft: `3px solid ${theme.blockquoteBorder}`, color: theme.blockquoteText }}>{children}</blockquote>,
                      }}
                    >
                      {content}
                    </Markdown>
                  </div>
                )}

                {/* 문서 끝 — Prev/Next + 코파일럿 */}
                {!isLoading && (
                  <div
                    className="mt-8 pt-5 space-y-4"
                    style={{ borderTop: `1px solid ${theme.hr}` }}
                  >
                    {onAskCopilot && currentDoc && (
                      <button
                        onClick={() => onAskCopilot({ fileName: currentDoc.name, sectionTitle: '전체' })}
                        className="px-4 py-2 rounded-lg text-sm font-bold"
                        style={{
                          background: `${theme.link}15`,
                          color: theme.link,
                          border: `1px solid ${theme.link}40`,
                        }}
                      >
                        🤖 이 문서에 대해 코파일럿에게 질문하기
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {prevDoc ? (
                        <button
                          onClick={() => setSelectedDoc(prevDoc.id)}
                          className="text-left p-4 rounded-lg transition-all hover:-translate-y-0.5"
                          style={{
                            background: theme.headerBg,
                            border: `1px solid ${theme.pageBorder}`,
                          }}
                        >
                          <div className="text-sm mb-1" style={{ color: theme.muted }}>◀ 이전 문서</div>
                          <div className="text-sm font-medium" style={{ color: theme.text }}>{prevDoc.emoji} {prevDoc.name}</div>
                          <div className="text-sm mt-1 line-clamp-1" style={{ color: theme.muted }}>{prevDoc.summary}</div>
                        </button>
                      ) : <div />}
                      {nextDoc ? (
                        <button
                          onClick={() => setSelectedDoc(nextDoc.id)}
                          className="text-right p-4 rounded-lg transition-all hover:-translate-y-0.5"
                          style={{
                            background: theme.headerBg,
                            border: `1px solid ${theme.pageBorder}`,
                          }}
                        >
                          <div className="text-sm mb-1" style={{ color: theme.muted }}>다음 문서 ▶</div>
                          <div className="text-sm font-medium" style={{ color: theme.text }}>{nextDoc.emoji} {nextDoc.name}</div>
                          <div className="text-sm mt-1 line-clamp-1" style={{ color: theme.muted }}>{nextDoc.summary}</div>
                        </button>
                      ) : <div />}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 문서 홈 (카드 그리드) ─────────────────────────────────────── */
function HomeView({ docs, categories, onSelect, theme }) {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2" style={{ color: theme.h1 }}>📖 프로젝트 문서</h1>
        <p className="text-sm" style={{ color: theme.text }}>
          카테고리별 문서 카탈로그. 각 카드를 클릭해 열거나, 왼쪽 사이드바에서 직접 선택.
        </p>
      </div>

      {categories.map(cat => {
        const catDocs = docs.filter(d => d.category === cat.id);
        if (!catDocs.length) return null;
        return (
          <section key={cat.id} className="mb-8">
            <div className="mb-3">
              <h2 className="text-base font-bold" style={{ color: theme.h2 }}>{cat.label}</h2>
              <p className="text-sm" style={{ color: theme.muted }}>{cat.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catDocs.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => onSelect(doc.id)}
                  className="text-left p-4 rounded-lg transition-all hover:-translate-y-0.5 group"
                  style={{
                    background: theme.headerBg,
                    border: `1px solid ${theme.pageBorder}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{doc.emoji}</span>
                    <h3 className="text-sm font-bold transition-colors" style={{ color: theme.text }}>
                      {doc.name}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: theme.text }}>
                    {doc.summary}
                  </p>
                  <div className="text-sm mb-3" style={{ color: theme.muted }}>
                    <span style={{ fontWeight: 600 }}>언제 봐야 하나:</span> {doc.audience}
                  </div>
                  {doc.tags && (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.slice(0, 5).map(t => (
                        <span
                          key={t}
                          className="text-sm px-2 py-0.5 rounded"
                          style={{ background: theme.tagBg, color: theme.tagText }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ── 유틸 ─────────────────────────────────────────────────── */

function highlightNode(children, query) {
  if (!query?.trim()) return children;
  if (typeof children === 'string') {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = children.split(new RegExp(`(${escaped})`, 'gi'));
    if (parts.length <= 1) return children;
    return parts.map((part, i) =>
      i % 2 === 1
        ? <mark key={i} className="bg-[#c8ff0030] text-[#c8ff00] rounded px-0.5">{part}</mark>
        : part
    );
  }
  return children;
}

function extractText(node) {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node?.props?.children) return extractText(node.props.children);
  return '';
}

function findTocId(children, toc, level) {
  const text = extractText(children);
  if (!text) return undefined;
  const match = toc.find(t => t.level === level && t.title.includes(text.slice(0, 20)));
  return match?.id || undefined;
}
