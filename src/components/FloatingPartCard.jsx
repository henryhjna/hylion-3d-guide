import { useEffect, useRef, useCallback } from 'react';
import { PARTS } from '../data/parts';

const CARD_WIDTH = 280;
const CARD_MARGIN = 12;

function clampPosition(x, y) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = x + CARD_MARGIN;
  let top = y + CARD_MARGIN;
  if (left + CARD_WIDTH > vw - CARD_MARGIN) left = x - CARD_WIDTH - CARD_MARGIN;
  if (top + 200 > vh - CARD_MARGIN) top = Math.max(CARD_MARGIN, vh - 220);
  if (left < CARD_MARGIN) left = CARD_MARGIN;
  if (top < CARD_MARGIN) top = CARD_MARGIN;
  return { left, top };
}

export default function FloatingPartCard({ partId, position, onClose, onExplore }) {
  const cardRef = useRef(null);

  const handleClickOutside = useCallback((e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const part = PARTS[partId];
  if (!part || !position) return null;

  const clamped = clampPosition(position.x, position.y);
  const specs = (part.specs || []).slice(0, 3);
  const color = part.color || '#00f0ff';

  return (
    <div
      ref={cardRef}
      className="slide-in-up fixed w-[280px] z-[15]"
      style={{
        left: clamped.left,
        top: clamped.top,
      }}
    >
      <div
        className="glass-panel p-5"
        style={{ borderColor: color + '50', boxShadow: `0 0 24px ${color}25, 0 8px 32px rgba(0,0,0,0.4)` }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold" style={{ color,  }}>
            {part.label}
          </span>
        </div>

        {/* Subtitle */}
        {part.subtitle && (
          <div className="text-sm text-[#9aa0b8] mb-3">{part.subtitle}</div>
        )}

        {/* Owners */}
        {part.owners && (
          <div className="text-sm text-[#aab0cc] mb-3">
            {part.owners.join(' + ')}
            {part.ownerRoles && Object.values(part.ownerRoles).length > 0 && (
              <span className="text-[#9aa0b8] ml-1.5">
                ({Object.values(part.ownerRoles).join(', ')})
              </span>
            )}
          </div>
        )}

        {/* Specs */}
        {specs.length > 0 && (
          <div className="border-t border-[#ffffff08] pt-3 mb-4 space-y-2.5.5">
            {specs.map((spec, i) => (
              <div key={i} className="text-sm text-[#ccd0e4]">
                <span className="text-[#9aa0b8]">{spec.label}: </span>
                {spec.value}
              </div>
            ))}
          </div>
        )}

        {/* Explore button */}
        <button
          onClick={() => onExplore(partId)}
          className="w-full py-1.5 rounded-md text-sm font-bold transition-all border bg-transparent hover:bg-opacity-100"
          style={{
            color,
            borderColor: color + '60',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.color = '#0a0a0f'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = color; }}
        >
          더 보기 →
        </button>
      </div>
    </div>
  );
}
