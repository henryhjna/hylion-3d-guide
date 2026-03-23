import { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GlossaryText from './GlossaryText';

const DOC_LIST = [
  { id: 'plan', name: '기획서 v12', path: `${import.meta.env.BASE_URL}assets/docs/기획서_v12.md` },
  { id: 'guide', name: '실행가이드 v12', path: `${import.meta.env.BASE_URL}assets/docs/실행가이드_v12.md` },
  { id: 'dgx', name: 'DGX Spark', path: `${import.meta.env.BASE_URL}assets/docs/DGX_Spark_가이드.md` },
];

export default function DocsReader({ isOpen, onClose, onAskCopilot, initialDocId, initialSearch }) {
  const [selectedDoc, setSelectedDoc] = useState(initialDocId || 'plan');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');

  useEffect(() => {
    if (initialDocId && isOpen) setSelectedDoc(initialDocId);
  }, [initialDocId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    const doc = DOC_LIST.find(d => d.id === selectedDoc);
    if (doc) {
      fetch(doc.path)
        .then(r => r.text())
        .then(text => { setContent(text); setIsLoading(false); })
        .catch(() => { setContent('문서를 불러올 수 없습니다.'); setIsLoading(false); });
    }
  }, [selectedDoc, isOpen]);

  // Build TOC from headings
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative flex w-full max-w-[1100px] mx-auto my-4 glass-panel overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* TOC sidebar */}
        <div className="w-[240px] border-r border-[#ffffff10] p-3 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#4466ff]">📖 문서</span>
            <button onClick={onClose} className="text-sm text-[#9aa0b8] hover:text-[#e0e8ff]">✕</button>
          </div>

          {/* Doc selector */}
          <div className="flex gap-1 mb-3">
            {DOC_LIST.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={`flex-1 text-sm py-1.5 rounded transition-all ${
                  selectedDoc === doc.id
                    ? 'bg-[#4466ff15] text-[#4466ff] border border-[#4466ff30]'
                    : 'text-[#9aa0b8] hover:text-[#e0e8ff] bg-[#ffffff05]'
                }`}
              >
                {doc.name}
              </button>
            ))}
          </div>

          {/* Search in doc */}
          <div className="relative mb-3">
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
              placeholder="검색... (Enter로 이동)"
              className="w-full px-2 py-1 rounded bg-[#0a0a0f] border border-[#ffffff10] text-sm text-[#e0e8ff] focus:outline-none focus:border-[#4466ff30]"
            />
            {searchQuery.trim() && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#9aa0b8]">
                {(content.toLowerCase().match(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length}건
              </span>
            )}
          </div>

          {/* TOC */}
          <div className="space-y-2">
            {toc.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left text-sm text-[#9aa0b8] hover:text-[#e0e8ff] py-1.5 transition-colors truncate"
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-[#9aa0b8]">로딩 중...</div>
          ) : (
            <div className="docs-content">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => <h1 id={findTocId(children, toc, 1)} className="text-lg font-bold mt-6 mb-3 text-[#00f0ff]" {...props}>{children}</h1>,
                  h2: ({ children, ...props }) => <h2 id={findTocId(children, toc, 2)} className="text-sm font-bold mt-5 mb-2 text-[#4466ff]" {...props}>{children}</h2>,
                  h3: ({ children, ...props }) => <h3 id={findTocId(children, toc, 3)} className="text-sm font-bold mt-4 mb-2.5 text-[#c8ff00]" {...props}>{children}</h3>,
                  p: ({ children }) => <p className="text-sm text-[#e0e8ff] leading-relaxed mb-2">{searchQuery ? highlightNode(children, searchQuery) : typeof children === 'string' ? <GlossaryText text={children} /> : children}</p>,
                  li: ({ children }) => <li className="text-sm text-[#e0e8ff] ml-4 mb-2 list-disc">{searchQuery ? highlightNode(children, searchQuery) : typeof children === 'string' ? <GlossaryText text={children} /> : children}</li>,
                  code: ({ children, className }) => className ? (
                    <pre className="bg-[#0a0a0f] border border-[#ffffff10] rounded-lg p-3 mb-3 overflow-x-auto">
                      <code className="text-sm text-[#00ff88]">{children}</code>
                    </pre>
                  ) : (
                    <code className="bg-[#ffffff10] px-1 py-1.5 rounded text-sm text-[#ff8800]">{children}</code>
                  ),
                  table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-sm border-collapse">{children}</table></div>,
                  th: ({ children }) => <th className="text-left px-2 py-1 border-b border-[#ffffff15] text-[#9aa0b8] font-bold">{children}</th>,
                  td: ({ children }) => <td className="px-2 py-1 border-b border-[#ffffff08] text-[#e0e8ff]">{children}</td>,
                  strong: ({ children }) => <strong className="text-[#e0e8ff] font-bold">{children}</strong>,
                  a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#4466ff] hover:text-[#6688ff] underline">{children}</a>,
                  hr: () => <hr className="border-[#ffffff10] my-4" />,
                  blockquote: ({ children }) => <blockquote className="border-l-2 border-[#4466ff] pl-3 my-2 text-[#9aa0b8]">{children}</blockquote>,
                }}
              >
                {content}
              </Markdown>
            </div>
          )}

          {/* Ask copilot button */}
          {onAskCopilot && (
            <div className="mt-6 pt-4 border-t border-[#ffffff10]">
              <button
                onClick={() => onAskCopilot({ fileName: DOC_LIST.find(d => d.id === selectedDoc)?.name, sectionTitle: '전체' })}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-[#4466ff15] text-[#4466ff] border border-[#4466ff30] hover:bg-[#4466ff25]"
              >
                🤖 이 문서에 대해 코파일럿에게 질문하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
