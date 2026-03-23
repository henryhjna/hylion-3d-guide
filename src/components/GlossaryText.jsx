import { useState, useRef, useEffect, useMemo } from 'react';
import { GLOSSARY as _glossaryData } from '../data/glossary';

let _glossary = null;
let _regex = null;

function initGlossary() {
  if (_glossary) return;
  if (_glossaryData) {
    _glossary = _glossaryData;
    const terms = Object.keys(_glossary).sort((a, b) => b.length - a.length);
    const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    _regex = new RegExp(`(${escaped.join('|')})`, 'g');
  }
}

export default function GlossaryText({ text, enabled = true }) {
  initGlossary();

  if (!enabled || !text || typeof text !== 'string' || !_glossary || !_regex) {
    return <>{text}</>;
  }

  const parts = text.split(_regex);
  const seen = new Set();

  return (
    <>
      {parts.map((part, i) => {
        if (_glossary[part] && !seen.has(part)) {
          seen.add(part);
          return <GlossaryTerm key={i} term={part} data={_glossary[part]} />;
        }
        return part;
      })}
    </>
  );
}

function GlossaryTerm({ term, data }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const termRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    if (termRef.current) {
      const rect = termRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.bottom + 4 });
    }
    setShow(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  return (
    <>
      <span
        ref={termRef}
        className="glossary-term"
        style={{
          borderBottom: '1px dashed #6a709060',
          cursor: 'help',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {term}
      </span>
      {show && (
        <GlossaryTooltip
          data={data}
          term={term}
          position={pos}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleLeave}
        />
      )}
    </>
  );
}

function GlossaryTooltip({ data, term, position, onMouseEnter, onMouseLeave }) {
  const tooltipRef = useRef(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = position.x;
      let y = position.y;
      if (x + rect.width > vw - 12) x = vw - rect.width - 12;
      if (y + rect.height > vh - 12) y = position.y - rect.height - 30;
      if (x < 12) x = 12;
      setAdjustedPos({ x, y });
    }
  }, [position]);

  return (
    <div
      ref={tooltipRef}
      className="glass-panel p-3 slide-in-up"
      style={{
        position: 'fixed',
        left: adjustedPos.x,
        top: adjustedPos.y,
        zIndex: 60,
        width: 280,
        maxHeight: 200,
        overflow: 'auto',
        borderColor: '#4466ff40',
        pointerEvents: 'auto',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-xs font-bold mb-2" style={{ color: '#4466ff', fontFamily: 'Orbitron' }}>
        {term}
        {data.full && <span className="text-xs text-[#6a7090] font-normal ml-1.5">({data.full})</span>}
      </div>
      <p className="text-sm text-[#e0e8ff] leading-relaxed mb-2.5">{data.definition}</p>
      {data.related?.length > 0 && (
        <div className="text-xs text-[#6a7090] mb-2">
          관련: {data.related.join(', ')}
        </div>
      )}
      {data.links?.length > 0 && (
        <div className="space-y-2">
          {data.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-[#4466ff] hover:text-[#6688ff]"
            >
              🔗 {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
