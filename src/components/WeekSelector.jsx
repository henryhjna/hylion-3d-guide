import { useState, useRef, useEffect, useCallback } from 'react';
import { TIMELINE } from '../data/timeline';

const ACCENT = '#00f0ff';
const WEEKS = Array.from({ length: 11 }, (_, i) => i); // 0-10

function detectCurrentWeek() {
  // Use same logic as App.jsx: project starts 2026-03-23
  const projectStart = new Date('2026-03-23');
  const now = new Date();
  const diffDays = Math.floor((now - projectStart) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(10, Math.floor(diffDays / 7)));
}

export default function WeekSelector({ currentWeek, onWeekChange, weekTitle }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const autoWeek = useRef(detectCurrentWeek());

  const handleClickOutside = useCallback((e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, handleClickOutside]);

  const selectWeek = (w) => {
    onWeekChange(w);
    setOpen(false);
  };

  const getTitle = (w) => {
    if (TIMELINE && TIMELINE[w]?.title) return TIMELINE[w].title;
    return '';
  };

  const displayTitle = weekTitle || getTitle(currentWeek);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Badge trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-[rgba(10,12,20,0.8)] backdrop-blur-[8px] rounded-lg text-[#00f0ff] text-[13px] font-semibold cursor-pointer transition-[border-color] duration-200 outline-none border border-[#00f0ff66]"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${ACCENT}66`)}
      >
        <span className="text-white font-bold">Week {currentWeek}</span>
        {displayTitle && (
          <span className="text-[#aaa] font-normal text-xs">{displayTitle}</span>
        )}
        <span
          className={`text-[10px] transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 min-w-[260px] max-h-[360px] overflow-y-auto z-50 bg-[rgba(8,10,18,0.95)] backdrop-blur-[14px] rounded-[10px] py-1.5 border border-[#00f0ff44] animate-[weekDropIn_120ms_ease-out_forwards]"
          style={{
            boxShadow: `0 0 20px ${ACCENT}22, 0 8px 32px rgba(0,0,0,0.6)`,
          }}
        >
          {WEEKS.map((w) => {
            const isActive = w === currentWeek;
            const isCurrent = w === autoWeek.current;
            const title = getTitle(w);

            return (
              <button
                key={w}
                onClick={() => selectWeek(w)}
                className="flex items-center w-full px-4 py-2 border-none text-[13px] cursor-pointer text-left gap-2.5 transition-[background] duration-100 outline-none border-l-[3px]"
                style={{
                  background: isActive ? `${ACCENT}18` : 'transparent',
                  borderLeftColor: isActive ? ACCENT : 'transparent',
                  color: isActive ? ACCENT : '#ccc',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="font-bold min-w-[52px]">Week {w}</span>
                <span
                  className="flex-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: isActive ? `${ACCENT}bb` : '#777' }}
                >
                  {title}
                </span>
                {isCurrent && (
                  <span className="text-[11px] text-[#0f0] ml-auto shrink-0">
                    ● 현재
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes weekDropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
