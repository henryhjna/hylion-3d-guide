import { useEffect, useState, useRef, useCallback } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#0a0c14',
    primaryColor: '#1e1040',
    primaryTextColor: '#e0ddd5',
    primaryBorderColor: '#c084fc',
    lineColor: '#6e8efb',
    secondaryColor: '#0d2a28',
    tertiaryColor: '#2a1f10',
    fontFamily: 'ui-monospace, monospace',
    fontSize: '12px',
  },
});

let idCounter = 0;

export default function MermaidBlock({ code }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!code) return;
    const id = `mermaid-${++idCounter}`;
    mermaid.render(id, code)
      .then(({ svg: rendered }) => { setSvg(rendered); setError(null); })
      .catch((err) => { console.warn('MermaidBlock render failed:', err); setError(true); });
    return () => {
      const orphan = document.getElementById(id);
      if (orphan) orphan.remove();
    };
  }, [code]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setScale(s => Math.min(4, Math.max(0.3, s - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const resetView = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }); }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  if (error) {
    return (
      <pre className="text-xs text-[#9aa0b8] bg-[#ffffff05] p-3 rounded overflow-x-auto">
        {code}
      </pre>
    );
  }

  return (
    <div className="my-4 relative group">
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setScale(s => Math.min(4, s + 0.3))} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center">+</button>
        <button onClick={() => setScale(s => Math.max(0.3, s - 0.3))} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center">-</button>
        <button onClick={resetView} className="px-2 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#9aa0b8] text-xs flex items-center justify-center">Reset</button>
        <span className="px-2 h-7 rounded bg-[#ffffff08] text-[#666] text-xs flex items-center">{Math.round(scale * 100)}%</span>
      </div>
      {/* Viewport */}
      <div
        ref={containerRef}
        className="overflow-hidden bg-[#0a0c14] rounded-lg border border-[#ffffff08]"
        style={{ height: Math.min(600, 400 * scale), cursor: dragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: '0 0', transition: dragging ? 'none' : 'transform 0.15s ease-out' }}
          className="p-4"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}
