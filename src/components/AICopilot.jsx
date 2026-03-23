import { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';

export default function AICopilot({ messages, isLoading, error, onSend, onClear, hasApiKey, onOpenSettings, prefill }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (prefill) {
      setInput(prefill);
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [prefill]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    if (!hasApiKey) {
      onOpenSettings();
      return;
    }
    onSend(input.trim());
    setInput('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #4466ff20, #00f0ff20)',
          border: '1px solid #4466ff40',
          boxShadow: '0 0 20px #4466ff20',
        }}
        title="AI 코파일럿"
      >
        🤖
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-28 right-4 z-50 w-[380px] h-[500px] glass-panel flex flex-col slide-in-up"
      style={{ borderColor: '#4466ff30' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#ffffff10]">
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="text-xs font-bold" style={{ fontFamily: 'Orbitron', color: '#4466ff' }}>
            AI 코파일럿
          </span>
          {!hasApiKey && (
            <span className="text-xs text-[#ff8800] bg-[#ff880015] px-2.5 py-1.5 rounded">
              API 키 필요
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff10]"
            title="대화 초기화"
          >
            🗑
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-6 h-6 rounded flex items-center justify-center text-xs text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff10]"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm text-[#6a7090] mb-3">
              프로젝트에 대해 무엇이든 질문하세요
            </p>
            <div className="space-y-2.5">
              {['이번 주 뭐 해야 해?', '배터리를 왜 최하단에 놓아?', 'SmolVLA 추론 속도는?'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="block w-full text-left text-xs text-[#4466ff] hover:text-[#6688ff] px-2 py-1 rounded hover:bg-[#4466ff08]"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#4466ff20] text-[#e0e8ff] border border-[#4466ff20]'
                  : 'bg-[#ffffff08] text-[#e0e8ff] border border-[#ffffff08]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <Markdown components={{
                  p: ({children}) => <p className="mb-2.5 last:mb-0">{children}</p>,
                  strong: ({children}) => <strong className="text-[#e0e8ff] font-bold">{children}</strong>,
                  code: ({children, className}) => className
                    ? <pre className="bg-[#0a0a0f] rounded p-3.5 my-1 overflow-x-auto"><code className="text-xs text-[#00ff88]">{children}</code></pre>
                    : <code className="bg-[#ffffff10] px-1 rounded text-xs text-[#ff8800]">{children}</code>,
                  li: ({children}) => <li className="ml-3 list-disc">{children}</li>,
                }}>{msg.content}</Markdown>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg bg-[#ffffff08] border border-[#ffffff08]">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4466ff] animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#4466ff] animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#4466ff] animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-xs text-[#ff8800] bg-[#ff880010] px-3 py-2 rounded-lg border border-[#ff880020]">
            {error === 'API_KEY_MISSING' && (
              <span>API 키가 설정되지 않았습니다. <button onClick={onOpenSettings} className="underline text-[#4466ff]">설정</button></span>
            )}
            {error === 'API_KEY_INVALID' && 'API 키가 유효하지 않습니다.'}
            {error === 'API_ERROR' && 'API 호출 중 오류가 발생했습니다.'}
            {error === 'NETWORK_ERROR' && '네트워크 연결을 확인해주세요.'}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#ffffff10]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={hasApiKey ? '질문을 입력하세요...' : 'API 키를 먼저 설정하세요'}
            className="flex-1 px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#ffffff15] text-sm text-[#e0e8ff] placeholder-[#6a7090] focus:border-[#4466ff40] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-[#4466ff20] text-[#4466ff] border border-[#4466ff30] hover:bg-[#4466ff30] disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
