import { useState, useEffect, useRef, useCallback } from 'react';

export default function DocsSearch({ isOpen, onClose, onSearch, onSelectResult, onAskCopilot }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewingEntry, setViewingEntry] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIdx(0);
      setViewingEntry(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 0) {
      const r = onSearch(query);
      setResults(r);
      setSelectedIdx(0);
    } else {
      setResults([]);
    }
  }, [query, onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (viewingEntry) setViewingEntry(null);
      else onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      const entry = results[selectedIdx];
      if (entry.type === 'resource' && entry.url) {
        window.open(entry.url, '_blank');
      } else {
        setViewingEntry(entry);
        onSelectResult?.(entry);
      }
    }
  }, [results, selectedIdx, viewingEntry, onClose, onSelectResult]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative glass-panel w-[600px] max-h-[70vh] overflow-hidden flex flex-col border-[#4466ff30]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-[#ffffff10]">
          <span className="text-[#4466ff] text-sm">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setViewingEntry(null); }}
            placeholder="문서 검색... (기획서, 실행가이드)"
            className="flex-1 bg-transparent text-sm text-[#e0e8ff] placeholder-[#6a7090] focus:outline-none"
           
          />
          <kbd className="text-sm text-[#6a7090] bg-[#ffffff08] px-2.5 py-1.5 rounded border border-[#ffffff10]">
            ESC
          </kbd>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {viewingEntry ? (
            /* Document reader */
            <div className="p-4">
              <button
                onClick={() => setViewingEntry(null)}
                className="text-sm text-[#4466ff] hover:text-[#6688ff] mb-3 flex items-center gap-1"
              >
                ← 검색 결과
              </button>
              <div className="text-sm text-[#6a7090] mb-2">{viewingEntry.fileName}</div>
              <h3 className="text-sm font-bold text-[#e0e8ff] mb-3">
                {viewingEntry.sectionTitle}
              </h3>
              <div className="text-sm text-[#e0e8ff] leading-relaxed whitespace-pre-wrap">
                {renderHighlightedContent(viewingEntry.content, query)}
              </div>
              {onAskCopilot && (
                <button
                  onClick={() => onAskCopilot(viewingEntry)}
                  className="mt-4 px-3 py-1.5 rounded-lg text-sm font-bold bg-[#4466ff15] text-[#4466ff] border border-[#4466ff30] hover:bg-[#4466ff25]"
                >
                  🤖 이 내용에 대해 코파일럿에게 질문하기
                </button>
              )}
            </div>
          ) : results.length > 0 ? (
            /* Search results */
            <div className="py-1">
              {results.slice(0, 10).map((entry, i) => (
                <button
                  key={`${entry.fileId}-${i}`}
                  onClick={() => {
                    if (entry.type === 'resource' && entry.url) {
                      window.open(entry.url, '_blank');
                    } else {
                      setViewingEntry(entry);
                      onSelectResult?.(entry);
                    }
                  }}
                  className={`w-full text-left px-4 py-2.5 flex flex-col gap-1.5 transition-colors ${
                    i === selectedIdx ? 'bg-[#4466ff10]' : 'hover:bg-[#ffffff05]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6a7090]">{entry.icon || '📄'}</span>
                    <span className="text-sm text-[#6a7090]">{entry.fileName}</span>
                    <span className="text-sm text-[#e0e8ff] font-medium">{entry.sectionTitle}</span>
                  </div>
                  <div className="text-sm text-[#6a7090] ml-5 truncate">
                    {entry.preview}
                  </div>
                </button>
              ))}
              {results.length > 10 && (
                <div className="px-4 py-2 text-sm text-[#6a7090] text-center">
                  {results.length}개 결과 중 10개 표시
                </div>
              )}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-sm text-[#6a7090]">
              검색 결과 없음
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[#6a7090]">
              키워드를 입력하세요<br />
              예: SmolVLA, 배터리, FETCH, 직립
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#ffffff10] text-sm text-[#6a7090]">
          <span>↑↓ 탐색</span>
          <span>Enter 열기</span>
          <span>Esc 닫기</span>
        </div>
      </div>
    </div>
  );
}

function renderHighlightedContent(content, query) {
  if (!query.trim()) return content;
  const terms = query.split(/\s+/).filter(Boolean);
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const segments = content.split(regex);

  return segments.map((seg, i) => {
    if (i % 2 === 1) {
      return <mark key={i} className="bg-[#c8ff0030] text-[#c8ff00] rounded px-0.5">{seg}</mark>;
    }
    return seg;
  });
}
