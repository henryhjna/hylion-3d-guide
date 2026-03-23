import { useState, useEffect } from 'react';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('hylion_api_key') || '';
      setApiKey(stored);
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('hylion_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('hylion_api_key');
    }
    setSaved(true);
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative glass-panel p-6 w-[400px] slide-in-up border-[#4466ff30]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold tracking-wide text-[#4466ff]">
            설정
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff15] flex items-center justify-center text-[#9aa0b8] text-xs"
          >
            ✕
          </button>
        </div>

        {/* API Key */}
        <div className="mb-4">
          <label className="text-xs text-[#9aa0b8] uppercase tracking-wider mb-2 block">
            Anthropic API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#ffffff15] text-xs text-[#e0e8ff] placeholder-[#9aa0b8] focus:border-[#4466ff40] focus:outline-none"
             
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#9aa0b8] hover:text-[#e0e8ff]"
            >
              {showKey ? '숨기기' : '보기'}
            </button>
          </div>
          <p className="text-xs text-[#9aa0b8] mt-2">
            키는 브라우저에만 저장됩니다. 서버로 전송되지 않습니다.
          </p>
        </div>

        {/* Help */}
        <div className="mb-5 p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
          <p className="text-xs text-[#9aa0b8]">
            API 키가 없으면?
          </p>
          <a
            href="https://console.anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4466ff] hover:text-[#6688ff] underline"
          >
            console.anthropic.com에서 발급
          </a>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-[#9aa0b8] hover:text-[#e0e8ff] bg-[#ffffff08] hover:bg-[#ffffff15]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              saved
                ? 'bg-[#00ff8820] text-[#00ff88] border border-[#00ff8840]'
                : 'bg-[#4466ff20] text-[#4466ff] border border-[#4466ff40] hover:bg-[#4466ff30]'
            }`}
          >
            {saved ? '저장됨 ✓' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
