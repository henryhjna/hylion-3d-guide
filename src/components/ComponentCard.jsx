// NOTE: This component is built but not yet wired into the UI.
// Future use: floating popover for component details from search results,
// checklist hint component tags, or X-ray mode internal component clicks.
import { useEffect, useRef } from 'react';

export default function ComponentCard({ component, position, onClose, onShowIn3D }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) onClose();
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 50);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!component) return null;

  const statusColors = {
    confirmed: { bg: '#00ff8815', border: '#00ff8830', text: '#00ff88', label: '확보' },
    ordered: { bg: '#ff880015', border: '#ff880030', text: '#ff8800', label: '주문됨' },
    pending: { bg: '#c8ff0015', border: '#c8ff0030', text: '#c8ff00', label: '대기' },
    risk: { bg: '#ff004415', border: '#ff004430', text: '#ff0044', label: '위험' },
  };
  const status = statusColors[component.procurement?.status] || statusColors.pending;

  // Clamp position
  const x = Math.min(Math.max(12, (position?.x || 300) + 12), window.innerWidth - 340);
  const y = Math.min(Math.max(12, (position?.y || 200) + 12), window.innerHeight - 400);

  return (
    <div
      ref={cardRef}
      className="glass-panel p-4 slide-in-up"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: 320,
        maxHeight: '70vh',
        overflow: 'auto',
        zIndex: 35,
        borderColor: '#00f0ff40',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-sm font-bold text-[#00f0ff]">
            {component.name}
          </div>
          <div className="text-xs text-[#6a7090]">{component.category}</div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff10] text-xs"
        >
          ✕
        </button>
      </div>

      {/* Specs */}
      {component.specs && (
        <Section title="스펙">
          {Object.entries(component.specs).map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-2 text-sm">
              <span className="text-[#6a7090] min-w-[60px] shrink-0">{k}</span>
              <span className="text-[#e0e8ff]">{v}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Project usage */}
      {component.usage && (
        <Section title="프로젝트 내 용도">
          <p className="text-sm text-[#e0e8ff] mb-2">{component.usage.description}</p>
          <div className="flex gap-2 text-xs text-[#6a7090]">
            {component.usage.quantity && <span>수량: {component.usage.quantity}개</span>}
            {component.usage.spares > 0 && <span>(+예비 {component.usage.spares})</span>}
            {component.usage.owner && <span>담당: {component.usage.owner}</span>}
          </div>
          {component.usage.parts?.length > 0 && (
            <div className="flex gap-1 mt-1">
              {component.usage.parts.map(p => (
                <span key={p} className="tag text-sm" style={{ backgroundColor: '#00f0ff10', color: '#00f0ff', border: '1px solid #00f0ff20' }}>
                  {p.replaceAll('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Procurement */}
      {component.procurement && (
        <Section title="조달">
          <div className="flex items-center gap-2 text-sm">
            <span
              className="tag text-xs"
              style={{ backgroundColor: status.bg, color: status.text, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
            <span className="text-[#6a7090]">{component.procurement.channel}</span>
            {component.procurement.estimatedArrival && (
              <span className="text-[#ff8800]">{component.procurement.estimatedArrival}</span>
            )}
          </div>
        </Section>
      )}

      {/* Links */}
      {component.links?.length > 0 && (
        <Section title="링크">
          {component.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-[#4466ff] hover:text-[#6688ff] mb-2"
            >
              🔗 {link.label}
            </a>
          ))}
        </Section>
      )}

      {/* 3D location */}
      {component.location3D && onShowIn3D && (
        <button
          onClick={() => onShowIn3D(component.location3D)}
          className="w-full mt-2 py-1.5 rounded-md text-sm font-bold text-[#00f0ff] border border-[#00f0ff30] hover:bg-[#00f0ff10] transition-colors"
        >
          3D에서 위치 보기
        </button>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-3">
      <div className="text-xs text-[#6a7090] uppercase tracking-wider mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}
