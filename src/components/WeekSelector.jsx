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
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Badge trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 14px',
          background: 'rgba(10, 12, 20, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1px solid ${ACCENT}66`,
          borderRadius: 8,
          color: ACCENT,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = ACCENT)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${ACCENT}66`)}
      >
        <span style={{ color: '#fff', fontWeight: 700 }}>Week {currentWeek}</span>
        {displayTitle && (
          <span style={{ color: '#aaa', fontWeight: 400, fontSize: 12 }}>{displayTitle}</span>
        )}
        <span
          style={{
            fontSize: 10,
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: 260,
            maxHeight: 360,
            overflowY: 'auto',
            zIndex: 50,
            background: 'rgba(8, 10, 18, 0.95)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1px solid ${ACCENT}44`,
            borderRadius: 10,
            padding: '6px 0',
            boxShadow: `0 0 20px ${ACCENT}22, 0 8px 32px rgba(0,0,0,0.6)`,
            animation: 'weekDropIn 120ms ease-out forwards',
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '8px 16px',
                  background: isActive ? `${ACCENT}18` : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? `3px solid ${ACCENT}` : '3px solid transparent',
                  color: isActive ? ACCENT : '#ccc',
                  fontSize: 13,
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: 10,
                  transition: 'background 0.12s',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontWeight: 700, minWidth: 52 }}>Week {w}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: isActive ? `${ACCENT}bb` : '#777',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </span>
                {isCurrent && (
                  <span
                    style={{
                      fontSize: 11,
                      color: '#0f0',
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                  >
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
