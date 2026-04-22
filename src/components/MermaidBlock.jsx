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

const BOX_HEIGHT_PX = 520;       // 고정 (줌 변경해도 박스 크기 불변)
const MIN_SCALE = 0.3;
const MAX_SCALE = 6;
const WHEEL_SENSITIVITY = 0.0012; // 휠 1 tick당 줌 강도

export default function MermaidBlock({ code }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const inlineBoxRef = useRef(null);
  const fullscreenBoxRef = useRef(null);

  // 최신 scale/pan 값을 listener에서 참조하기 위한 ref
  const scaleRef = useRef(scale);
  const panRef = useRef(pan);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { panRef.current = pan; }, [pan]);

  /* ── Mermaid 렌더 ───────────────────────────────────────── */
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

  /* ── 줌/팬 함수 ─────────────────────────────────────────── */
  const zoomAt = useCallback((deltaY, mouseX, mouseY) => {
    const prev = scaleRef.current;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * Math.exp(-deltaY * WHEEL_SENSITIVITY)));
    const k = next / prev;
    // 포인터 고정점 보정 — 마우스 아래가 같은 SVG 좌표를 가리키도록
    const curPan = panRef.current;
    const newPan = { x: mouseX - k * (mouseX - curPan.x), y: mouseY - k * (mouseY - curPan.y) };
    setScale(next);
    setPan(newPan);
  }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(MAX_SCALE, s * 1.25)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(MIN_SCALE, s / 1.25)), []);
  const resetView = useCallback(() => { setScale(1); setPan({ x: 0, y: 0 }); }, []);
  const toggleFullscreen = useCallback(() => {
    setFullscreen(f => !f);
    setScale(1); setPan({ x: 0, y: 0 });
  }, []);

  /* ── 휠 이벤트 (non-passive, passive:false 필수) ───────── */
  // 실제 활성 박스 ref (fullscreen 여부에 따라)
  useEffect(() => {
    const el = fullscreen ? fullscreenBoxRef.current : inlineBoxRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();   // 페이지 스크롤 방지
      e.stopPropagation();  // 부모 모달 스크롤 전파 차단
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      zoomAt(e.deltaY, mx, my);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [fullscreen, zoomAt, svg]); // svg 로드 후에도 다시 붙도록

  /* ── 드래그 팬 ──────────────────────────────────────────── */
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
  }, []);
  const onMouseMove = useCallback((e) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  }, [dragging]);
  const onMouseUp = useCallback(() => setDragging(false), []);

  /* ── 키보드 (전체화면) ──────────────────────────────────── */
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

  const scalePct = Math.round(scale * 100);
  const transformStyle = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
    transformOrigin: '0 0',
    transition: dragging ? 'none' : 'transform 0.1s ease-out',
    willChange: 'transform',
  };

  return (
    <>
      {/* ─────────────── 인라인 박스 ─────────────── */}
      <div className="my-4 relative group">
        {/* Controls */}
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button onClick={zoomIn} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center" title="확대 (+)">+</button>
          <button onClick={zoomOut} className="w-7 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-sm flex items-center justify-center" title="축소 (−)">−</button>
          <button onClick={resetView} className="px-2 h-7 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#9aa0b8] text-xs flex items-center justify-center" title="리셋 (더블클릭)">Reset</button>
          <span className="px-2 h-7 rounded bg-[#ffffff08] text-[#9aa0b8] text-xs flex items-center tabular-nums">{scalePct}%</span>
          <button
            onClick={toggleFullscreen}
            className="w-7 h-7 rounded bg-[#00f0ff20] hover:bg-[#00f0ff35] text-[#00f0ff] text-sm flex items-center justify-center"
            title="전체화면"
          >
            ⛶
          </button>
        </div>

        {/* Viewport (fullscreen이 아닌 상태에서만 활성 wheel listener) */}
        <div
          ref={fullscreen ? null : inlineBoxRef}
          className="overflow-hidden bg-[#0a0c14] rounded-lg border border-[#ffffff10] relative"
          style={{
            height: BOX_HEIGHT_PX,
            cursor: dragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            overscrollBehavior: 'contain',
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onDoubleClick={resetView}
        >
          <div style={transformStyle} className="p-4" dangerouslySetInnerHTML={{ __html: svg }} />
          <div className="absolute bottom-2 left-2 text-[11px] text-[#6a7090] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
            휠: 줌 · 드래그: 이동 · 더블클릭: 리셋 · ⛶: 전체화면
          </div>
        </div>
      </div>

      {/* ─────────────── 전체화면 모달 ─────────────── */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={toggleFullscreen}
        >
          <div
            className="relative w-full h-full max-w-[1800px] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="text-sm text-[#9aa0b8]">Mermaid 다이어그램 · 전체화면</div>
              <div className="flex items-center gap-2 text-[11px] text-[#6a7090]">
                <span>휠: 줌 · 드래그: 이동 · 더블클릭: 리셋 · ESC: 닫기</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-10 right-2 z-10 flex gap-1">
              <button onClick={zoomIn} className="w-8 h-8 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-base flex items-center justify-center" title="+">+</button>
              <button onClick={zoomOut} className="w-8 h-8 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-base flex items-center justify-center" title="−">−</button>
              <button onClick={resetView} className="px-2 h-8 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#9aa0b8] text-sm flex items-center justify-center">Reset</button>
              <span className="px-2 h-8 rounded bg-[#ffffff08] text-[#9aa0b8] text-sm flex items-center tabular-nums">{scalePct}%</span>
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded bg-[#ffffff15] hover:bg-[#ffffff25] text-[#e0e8ff] text-base flex items-center justify-center"
                title="닫기 (ESC)"
              >
                ✕
              </button>
            </div>

            {/* Viewport (fullscreen wheel listener) */}
            <div
              ref={fullscreenBoxRef}
              className="flex-1 overflow-hidden bg-[#0a0c14] rounded-lg border border-[#ffffff10] relative"
              style={{
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                overscrollBehavior: 'contain',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onDoubleClick={resetView}
            >
              <div style={transformStyle} className="p-4" dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
