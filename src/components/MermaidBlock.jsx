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

const BOX_HEIGHT = 520;          // 고정 높이 (줌 변경해도 박스 크기 유지)
const FULLSCREEN_HEIGHT = '92vh'; // 전체화면 모드 높이
const MIN_SCALE = 0.3;
const MAX_SCALE = 6;

export default function MermaidBlock({ code }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const fullscreenRef = useRef(null);

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

  // 휠 줌 (박스 안에서만 반응 — 페이지 스크롤로 전파 안 됨)
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // 포인터 위치 기준 줌 (마우스 아래 지점을 중심으로 확대)
    const container = (fullscreen ? fullscreenRef.current : containerRef.current);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setScale(prev => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev - e.deltaY * 0.0015 * prev));
      const k = next / prev;
      // 팬 보정: 마우스 아래 점이 같은 위치에 남도록
      setPan(p => ({ x: px - k * (px - p.x), y: py - k * (py - p.y) }));
      return next;
    });
  }, [fullscreen]);

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

  const zoomIn = useCallback(() => setScale(s => Math.min(MAX_SCALE, s + 0.3)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(MIN_SCALE, s - 0.3)), []);

  const toggleFullscreen = useCallback(() => {
    setFullscreen(f => !f);
    resetView();
  }, [resetView]);

  // Non-passive wheel listener (preventDefault 가능하려면 passive:false 필요)
  useEffect(() => {
    const el = fullscreen ? fullscreenRef.current : containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel, fullscreen]);

  // Fullscreen: ESC 키로 닫기, 키보드 단축키
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e) => {
      if (e.key === 'Escape') { setFullscreen(false); resetView(); }
      else if (e.key === '+' || e.key === '=') zoomIn();
      else if (e.key === '-' || e.key === '_') zoomOut();
      else if (e.key === '0' || e.key === 'r' || e.key === 'R') resetView();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen, zoomIn, zoomOut, resetView]);

  if (error) {
    return (
      <pre className="text-xs text-[#9aa0b8] bg-[#ffffff05] p-3 rounded overflow-x-auto">
        {code}
      </pre>
    );
  }

  // 공통 컨텐츠 (viewport + SVG)
  const Viewport = ({ boxHeight, innerRef }) => (
    <div
      ref={innerRef}
      className="overflow-hidden bg-[#0a0c14] rounded-lg border border-[#ffffff08] relative"
      style={{ height: boxHeight, cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={resetView}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: dragging ? 'none' : 'transform 0.12s ease-out',
        }}
        className="p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {/* 하단 힌트 (호버 시 노출) */}
      <div className="absolute bottom-2 left-2 text-[11px] text-[#6a7090] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
        휠: 줌 · 드래그: 이동 · 더블클릭: 리셋 {fullscreen ? '· ESC: 닫기 · +/-/0: 줌·리셋' : ''}
      </div>
    </div>
  );

  const Controls = ({ extraButton }) => (
    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
      <button onClick={zoomIn} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center" title="확대 (+)">+</button>
      <button onClick={zoomOut} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center" title="축소 (-)">−</button>
      <button onClick={resetView} className="px-2 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#9aa0b8] text-xs flex items-center justify-center" title="원상복귀 (더블클릭 또는 R)">Reset</button>
      <span className="px-2 h-7 rounded bg-[#ffffff08] text-[#9aa0b8] text-xs flex items-center tabular-nums">{Math.round(scale * 100)}%</span>
      {extraButton}
    </div>
  );

  return (
    <>
      <div className="my-4 relative group">
        <Controls
          extraButton={
            <button
              onClick={toggleFullscreen}
              className="w-7 h-7 rounded bg-[#00f0ff20] hover:bg-[#00f0ff35] text-[#00f0ff] text-sm flex items-center justify-center"
              title="전체화면 (대화형 큰 화면)"
            >
              ⛶
            </button>
          }
        />
        <Viewport boxHeight={BOX_HEIGHT} innerRef={containerRef} />
      </div>

      {/* 전체화면 모달 */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div
            className="relative w-full h-full max-w-[1800px] flex flex-col group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-sm text-[#9aa0b8]">Mermaid 다이어그램 · 전체화면</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6a7090]">휠 줌 · 드래그 이동 · 더블클릭 리셋 · ESC 닫기</span>
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-base flex items-center justify-center"
                  title="닫기 (ESC)"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              <Controls />
              <Viewport boxHeight={FULLSCREEN_HEIGHT} innerRef={fullscreenRef} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
