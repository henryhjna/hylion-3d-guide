import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { TECH_TREE } from '../data/techTree';

// ── Layout constants ──────────────────────────────────────────────────────────
const WEEK_WIDTH = 260;
const NODE_W = 180;
const NODE_H = 48;
const GATE_SIZE = 64;
const CHECKPOINT_SIZE = 48;
const TRACK_GAP = 32;
const TOP_PADDING = 80;
const LEFT_PADDING = 60;

// ── Color palette ─────────────────────────────────────────────────────────────
const COLORS = {
  A: '#00f0ff',
  B: '#ff00aa',
  both: '#c8ff00',
  gate: '#c8ff00',
  criticalPath: '#ff2244',
  bg: '#0a0a0f',
  grid: '#1a1a2e',
  text: '#e0e0f0',
  dimText: '#9aa0b8',
};

// ── SVG shape helpers ─────────────────────────────────────────────────────────
function RoundedRect({ x, y, w, h, borderColor, filled, dimmed, pulse }) {
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={10}
      ry={10}
      fill={filled ? `${borderColor}18` : '#12121e'}
      stroke={borderColor}
      strokeWidth={filled ? 2.5 : 1.5}
      opacity={dimmed ? 0.3 : 1}
      filter={filled ? `drop-shadow(0 0 6px ${borderColor})` : undefined}
    >
      {pulse && (
        <animate attributeName="stroke-opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
      )}
    </rect>
  );
}

function DiamondShape({ x, y, size, borderColor, filled, dimmed }) {
  const half = size / 2;
  const points = `${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`;
  return (
    <polygon
      points={points}
      fill={filled ? `${borderColor}18` : '#12121e'}
      stroke={borderColor}
      strokeWidth={filled ? 2.5 : 1.5}
      opacity={dimmed ? 0.3 : 1}
      filter={filled ? `drop-shadow(0 0 6px ${borderColor})` : undefined}
    />
  );
}

function HexagonShape({ x, y, size, borderColor, dimmed }) {
  const r = size / 2;
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    pts.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
  }
  return (
    <polygon
      points={pts.join(' ')}
      fill={`${borderColor}22`}
      stroke={borderColor}
      strokeWidth={2.5}
      opacity={dimmed ? 0.3 : 1}
      filter={`drop-shadow(0 0 10px ${borderColor})`}
    />
  );
}

// ── Tiny icons (checkmark, lock, spinner) ─────────────────────────────────────
function CheckmarkIcon({ x, y }) {
  return (
    <g transform={`translate(${x - 6}, ${y - 6})`}>
      <polyline points="2,7 5,10 10,3" fill="none" stroke="#00ff88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function LockIcon({ x, y }) {
  return (
    <g transform={`translate(${x - 5}, ${y - 7})`} opacity={0.5}>
      <rect x={1} y={6} width={8} height={6} rx={1} fill="#9aa0b8" />
      <path d="M3,6 V4 a2,2 0 0 1 4,0 V6" fill="none" stroke="#9aa0b8" strokeWidth={1.2} />
    </g>
  );
}

function SpinnerIcon({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={5} fill="none" stroke="#9aa0b8" strokeWidth={1.5} strokeDasharray="6 8" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// ── Curved edge with arrowhead ────────────────────────────────────────────────
function CurvedEdge({ x1, y1, x2, y2, highlighted, critical, dimmed }) {
  const midX = (x1 + x2) / 2;
  const dx = x2 - x1;
  const cpOffset = Math.min(Math.abs(dx) * 0.4, 80);
  const d = `M${x1},${y1} C${x1 + cpOffset},${y1} ${x2 - cpOffset},${y2} ${x2},${y2}`;
  const color = critical ? COLORS.criticalPath : highlighted ? '#ffffff' : '#3a3a5e';
  const width = critical ? 2.5 : highlighted ? 2 : 1;

  // Arrowhead angle — use tangent at Bezier endpoint (last control point → end)
  const arrowLen = 8;
  const tangentX = x2 - (x2 - cpOffset);  // = cpOffset
  const tangentY = y2 - y2;               // = 0 (horizontal arrival)
  const angle = Math.atan2(tangentY, tangentX);
  const a1x = x2 - arrowLen * Math.cos(angle - 0.35);
  const a1y = y2 - arrowLen * Math.sin(angle - 0.35);
  const a2x = x2 - arrowLen * Math.cos(angle + 0.35);
  const a2y = y2 - arrowLen * Math.sin(angle + 0.35);

  return (
    <g opacity={dimmed ? 0.12 : 1}>
      <path d={d} fill="none" stroke={color} strokeWidth={width}
        filter={critical ? `drop-shadow(0 0 4px ${COLORS.criticalPath})` : undefined} />
      <polygon points={`${x2},${y2} ${a1x},${a1y} ${a2x},${a2y}`} fill={color} />
    </g>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ node, x, y }) {
  if (!node) return null;
  const w = 280;
  const lineHeight = 16;
  const descLines = wrapText(node.description || '', 38);
  const h = 68 + descLines.length * lineHeight + (node.members?.length ? 20 : 0);
  // Adjust so tooltip stays in view
  const tx = x + w > 3000 ? x - w - 16 : x + 16;
  const ty = y - h / 2;

  return (
    <g>
      <rect x={tx} y={ty} width={w} height={h} rx={8} fill="#14142af0" stroke="#3a3a5e" strokeWidth={1}
        filter="drop-shadow(0 4px 16px rgba(0,0,0,0.6))" />
      <text x={tx + 12} y={ty + 22} fill={COLORS.text} fontSize={12} fontFamily="Orbitron, sans-serif" fontWeight={700}>
        {node.label}
      </text>
      <text x={tx + 12} y={ty + 38} fill={COLORS.dimText} fontSize={10} fontFamily="JetBrains Mono, monospace">
        Week {node.week} | Track {node.track.toUpperCase()} | {node.status}
      </text>
      {descLines.map((line, i) => (
        <text key={i} x={tx + 12} y={ty + 56 + i * lineHeight} fill="#b0b0c8" fontSize={10}
          fontFamily="JetBrains Mono, monospace">
          {line}
        </text>
      ))}
      {node.members?.length > 0 && (
        <text x={tx + 12} y={ty + 56 + descLines.length * lineHeight + 4} fill="#8888aa" fontSize={9}
          fontFamily="JetBrains Mono, monospace">
          Members: {node.members.join(', ')}
        </text>
      )}
    </g>
  );
}

function wrapText(text, maxLen) {
  if (!text) return [];
  const lines = [];
  let cur = '';
  // Split into tokens: spaces/punctuation as break points, keep Korean chars flowing
  const tokens = text.match(/[a-zA-Z0-9]+|[^\s]|\s/g) || [];
  for (const token of tokens) {
    if (cur.length + token.length > maxLen && cur.length > 0) {
      lines.push(cur.trimEnd());
      cur = token === ' ' ? '' : token;
    } else {
      cur += token;
    }
  }
  if (cur.trim()) lines.push(cur.trimEnd());
  return lines;
}

// ── Critical path (longest path to final presentation) ───────────────────────
function computeCriticalPath(nodes) {
  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Build adjacency (reverse: from dependency to dependent)
  const forward = new Map(); // dep -> [dependents]
  nodes.forEach((n) => {
    n.dependencies.forEach((depId) => {
      if (!forward.has(depId)) forward.set(depId, []);
      forward.get(depId).push(n.id);
    });
  });

  // Find terminal node
  const terminal = 'w10_final_presentation';
  if (!nodeMap.has(terminal)) return new Set();

  // BFS backwards from terminal to find longest path of non-completed nodes
  // Use dynamic programming: longest path to each node in DAG
  const memo = new Map();

  function longestTo(id) {
    if (memo.has(id)) return memo.get(id);
    const node = nodeMap.get(id);
    if (!node) { memo.set(id, { len: 0, path: [] }); return memo.get(id); }

    const deps = node.dependencies.filter((d) => nodeMap.has(d));
    if (deps.length === 0) {
      const res = { len: node.status !== 'completed' ? 1 : 0, path: [id] };
      memo.set(id, res);
      return res;
    }

    let best = { len: 0, path: [] };
    for (const dep of deps) {
      const sub = longestTo(dep);
      if (sub.len > best.len) best = sub;
    }

    const myWeight = node.status !== 'completed' ? 1 : 0;
    const res = { len: best.len + myWeight, path: [...best.path, id] };
    memo.set(id, res);
    return res;
  }

  const result = longestTo(terminal);
  return new Set(result.path);
}

// ── Dependency chain (highlight on click) ─────────────────────────────────────
function collectDependencyChain(nodeId, nodes) {
  const nodeMap = new Map();
  nodes.forEach((n) => nodeMap.set(n.id, n));
  const chain = new Set();

  // Upstream
  function walkUp(id) {
    if (chain.has(id)) return;
    chain.add(id);
    const n = nodeMap.get(id);
    if (n) n.dependencies.forEach(walkUp);
  }

  // Downstream
  const reverseMap = new Map();
  nodes.forEach((n) => {
    n.dependencies.forEach((d) => {
      if (!reverseMap.has(d)) reverseMap.set(d, []);
      reverseMap.get(d).push(n.id);
    });
  });

  function walkDown(id) {
    if (chain.has(id)) return;
    chain.add(id);
    (reverseMap.get(id) || []).forEach(walkDown);
  }

  walkUp(nodeId);
  chain.delete(nodeId); // re-add after walkDown to avoid early stop
  walkDown(nodeId);
  chain.add(nodeId);
  return chain;
}

// ── Main layout calculation ──────────────────────────────────────────────────
function computeLayout(nodes) {
  // Group by week and track
  const weekBuckets = new Map(); // week -> { A: [], B: [], both: [] }
  nodes.forEach((node) => {
    if (!weekBuckets.has(node.week)) weekBuckets.set(node.week, { A: [], B: [], both: [] });
    const bucket = weekBuckets.get(node.week);
    const track = node.track === 'A' || node.track === 'B' ? node.track : 'both';
    bucket[track].push(node.id);
  });

  const positions = new Map();
  const maxWeek = Math.max(...nodes.map((n) => n.week));
  const midY = 420; // vertical center

  weekBuckets.forEach((tracks, week) => {
    const x = LEFT_PADDING + week * WEEK_WIDTH + WEEK_WIDTH / 2;

    // Track A: above midY
    tracks.A.forEach((id, i) => {
      const slotCount = tracks.A.length;
      const totalHeight = slotCount * (NODE_H + 12);
      const startY = midY - TRACK_GAP - totalHeight;
      positions.set(id, { x, y: startY + i * (NODE_H + 12) + NODE_H / 2 });
    });

    // Track B: below midY
    tracks.B.forEach((id, i) => {
      const slotCount = tracks.B.length;
      const startY = midY + TRACK_GAP;
      positions.set(id, { x, y: startY + i * (NODE_H + 12) + NODE_H / 2 });
    });

    // Both: centered around midY
    tracks.both.forEach((id, i) => {
      const slotCount = tracks.both.length;
      const totalHeight = slotCount * (NODE_H + 12);
      const startY = midY - totalHeight / 2;
      positions.set(id, { x, y: startY + i * (NODE_H + 12) + NODE_H / 2 });
    });
  });

  return { positions, maxWeek };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TechTree({ teamFilter, trackFilter, selectedWeek, onNodeClick }) {
  const nodes = TECH_TREE.nodes;
  const svgRef = useRef(null);

  // Pan / zoom state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  // Interaction state
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Layout
  const { positions, maxWeek } = useMemo(() => computeLayout(nodes), [nodes]);

  // Critical path
  const criticalPath = useMemo(() => computeCriticalPath(nodes), [nodes]);

  // Dependency chain for selected node
  const depChain = useMemo(
    () => (selectedNodeId ? collectDependencyChain(selectedNodeId, nodes) : null),
    [selectedNodeId, nodes],
  );

  // Node map for quick lookup
  const nodeMap = useMemo(() => {
    const m = new Map();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  // SVG dimensions
  const svgWidth = LEFT_PADDING + (maxWeek + 1) * WEEK_WIDTH + LEFT_PADDING;
  const svgHeight = 900;

  // ── Determine dimming ─────────────────────────────────────────────────────
  const isNodeDimmed = useCallback(
    (node) => {
      if (teamFilter && (!node.members || !node.members.includes(teamFilter))) return true;
      if (trackFilter && node.track !== trackFilter && node.track !== 'both') return true;
      if (selectedWeek !== null && selectedWeek !== undefined && node.week !== selectedWeek) return true;
      if (depChain && !depChain.has(node.id)) return true;
      return false;
    },
    [teamFilter, trackFilter, selectedWeek, depChain],
  );

  // ── Edges data ────────────────────────────────────────────────────────────
  const edges = useMemo(() => {
    const result = [];
    nodes.forEach((node) => {
      const toPos = positions.get(node.id);
      if (!toPos) return;
      node.dependencies.forEach((depId) => {
        const fromPos = positions.get(depId);
        if (!fromPos) return;
        const fromNode = nodeMap.get(depId);
        const toNode = node;
        const isCritical = criticalPath.has(depId) && criticalPath.has(node.id);
        const isHighlighted = depChain ? depChain.has(depId) && depChain.has(node.id) : false;
        const isDimmed = isNodeDimmed(fromNode) && isNodeDimmed(toNode);
        // Use correct width for gate/checkpoint nodes
        const fromHalfW = fromNode?.isGate ? GATE_SIZE / 2 : NODE_W / 2;
        const toHalfW = toNode?.isGate ? GATE_SIZE / 2 : NODE_W / 2;
        result.push({
          key: `${depId}->${node.id}`,
          x1: fromPos.x + fromHalfW,
          y1: fromPos.y,
          x2: toPos.x - toHalfW,
          y2: toPos.y,
          highlighted: isHighlighted,
          critical: isCritical && !isHighlighted,
          dimmed: isDimmed,
        });
      });
    });
    return result;
  }, [nodes, positions, criticalPath, depChain, nodeMap, isNodeDimmed]);

  // ── Pan handlers ──────────────────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, tx: transform.x, ty: transform.y };
    },
    [transform],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPanning) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setTransform((prev) => ({ ...prev, x: panStart.current.tx + dx, y: panStart.current.ty + dy }));
    },
    [isPanning],
  );

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setTransform((prev) => {
      const newScale = Math.max(0.15, Math.min(3, prev.scale * delta));
      return { ...prev, scale: newScale };
    });
  }, []);

  // Attach wheel listener with passive:false
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ── Click handler ─────────────────────────────────────────────────────────
  const handleNodeClick = useCallback(
    (nodeId, e) => {
      e.stopPropagation();
      setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
      onNodeClick?.(nodeId);
    },
    [onNodeClick],
  );

  const handleBgClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // ── Hovered node data ─────────────────────────────────────────────────────
  const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null;
  const hoveredPos = hoveredNodeId ? positions.get(hoveredNodeId) : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'grab',
        position: 'relative',
      }}
    >
      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          gap: 16,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          color: COLORS.dimText,
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: COLORS.A }}>--- Track A</span>
        <span style={{ color: COLORS.B }}>--- Track B</span>
        <span style={{ color: COLORS.both }}>--- Both</span>
        <span style={{ color: COLORS.criticalPath }}>--- Critical Path</span>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleBgClick}
        style={{ display: 'block' }}
      >
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* ── Week column separators ───────────────────────────────── */}
          {Array.from({ length: maxWeek + 1 }, (_, w) => {
            const x = LEFT_PADDING + w * WEEK_WIDTH;
            return (
              <g key={`week-${w}`}>
                <line x1={x} y1={0} x2={x} y2={svgHeight} stroke={COLORS.grid} strokeWidth={1} strokeDasharray="4 4" />
                <text
                  x={x + WEEK_WIDTH / 2}
                  y={28}
                  textAnchor="middle"
                  fill={selectedWeek === w ? '#ffffff' : COLORS.dimText}
                  fontSize={13}
                  fontFamily="Orbitron, sans-serif"
                  fontWeight={selectedWeek === w ? 700 : 400}
                >
                  Week {w}
                </text>
              </g>
            );
          })}
          {/* Final column line */}
          <line
            x1={LEFT_PADDING + (maxWeek + 1) * WEEK_WIDTH}
            y1={0}
            x2={LEFT_PADDING + (maxWeek + 1) * WEEK_WIDTH}
            y2={svgHeight}
            stroke={COLORS.grid}
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* ── Track labels ─────────────────────────────────────────── */}
          <text x={16} y={200} fill={COLORS.A} fontSize={11} fontFamily="Orbitron, sans-serif" fontWeight={700}
            transform="rotate(-90, 16, 200)" textAnchor="middle">
            TRACK A
          </text>
          <text x={16} y={640} fill={COLORS.B} fontSize={11} fontFamily="Orbitron, sans-serif" fontWeight={700}
            transform="rotate(-90, 16, 640)" textAnchor="middle">
            TRACK B
          </text>

          {/* ── Edges ────────────────────────────────────────────────── */}
          {edges.map((edge) => (
            <CurvedEdge
              key={edge.key}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              highlighted={edge.highlighted}
              critical={edge.critical}
              dimmed={edge.dimmed}
            />
          ))}

          {/* ── Nodes ────────────────────────────────────────────────── */}
          {nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;

            const borderColor = node.isGate
              ? COLORS.gate
              : COLORS[node.track] || COLORS.both;
            const dimmed = isNodeDimmed(node);
            const isSelected = selectedNodeId === node.id;
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const isLocked = node.status === 'locked';
            const isCritical = criticalPath.has(node.id) && !depChain;

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Critical path glow ring */}
                {isCritical && !dimmed && (
                  <rect
                    x={pos.x - NODE_W / 2 - 4}
                    y={pos.y - NODE_H / 2 - 4}
                    width={NODE_W + 8}
                    height={NODE_H + 8}
                    rx={14}
                    fill="none"
                    stroke={COLORS.criticalPath}
                    strokeWidth={1.5}
                    opacity={0.5}
                    filter={`drop-shadow(0 0 6px ${COLORS.criticalPath})`}
                  >
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                  </rect>
                )}

                {/* Selection highlight */}
                {isSelected && (
                  <rect
                    x={pos.x - NODE_W / 2 - 6}
                    y={pos.y - NODE_H / 2 - 6}
                    width={NODE_W + 12}
                    height={NODE_H + 12}
                    rx={16}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={0.7}
                  >
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.4s" repeatCount="indefinite" />
                  </rect>
                )}

                {/* Shape */}
                {node.isGate ? (
                  <HexagonShape
                    x={pos.x}
                    y={pos.y}
                    size={GATE_SIZE}
                    borderColor={borderColor}
                    dimmed={dimmed}
                  />
                ) : node.isCheckpoint ? (
                  <DiamondShape
                    x={pos.x}
                    y={pos.y}
                    size={CHECKPOINT_SIZE}
                    borderColor={COLORS.both}
                    filled={isCompleted}
                    dimmed={dimmed}
                  />
                ) : (
                  <RoundedRect
                    x={pos.x}
                    y={pos.y}
                    w={NODE_W}
                    h={NODE_H}
                    borderColor={borderColor}
                    filled={isCompleted}
                    dimmed={dimmed}
                    pulse={isInProgress}
                  />
                )}

                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + (node.isGate || node.isCheckpoint ? -2 : 1)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={dimmed ? '#4a4a6a' : COLORS.text}
                  fontSize={node.isGate ? 9 : node.isCheckpoint ? 8 : 10}
                  fontFamily="Orbitron, sans-serif"
                  fontWeight={600}
                  style={{ pointerEvents: 'none' }}
                >
                  {truncate(node.label, node.isGate ? 12 : node.isCheckpoint ? 10 : 18)}
                </text>

                {/* Week / track sub-label for standard nodes */}
                {!node.isGate && !node.isCheckpoint && (
                  <text
                    x={pos.x}
                    y={pos.y + 14}
                    textAnchor="middle"
                    fill={dimmed ? '#3a3a5a' : COLORS.dimText}
                    fontSize={8}
                    fontFamily="JetBrains Mono, monospace"
                    style={{ pointerEvents: 'none' }}
                  >
                    W{node.week} | {node.members?.length || 0} members
                  </text>
                )}

                {/* Status icon */}
                {isCompleted && !dimmed && (
                  <CheckmarkIcon
                    x={pos.x + (node.isGate ? GATE_SIZE / 2 - 4 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 4 : NODE_W / 2 - 8)}
                    y={pos.y - (node.isGate ? GATE_SIZE / 2 - 8 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 4 : NODE_H / 2 - 6)}
                  />
                )}
                {isInProgress && !dimmed && (
                  <SpinnerIcon
                    x={pos.x + (node.isGate ? GATE_SIZE / 2 - 6 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 6 : NODE_W / 2 - 10)}
                    y={pos.y - (node.isGate ? GATE_SIZE / 2 - 8 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 8 : NODE_H / 2 - 10)}
                  />
                )}
                {isLocked && !dimmed && (
                  <LockIcon
                    x={pos.x + (node.isGate ? GATE_SIZE / 2 - 2 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 2 : NODE_W / 2 - 8)}
                    y={pos.y - (node.isGate ? GATE_SIZE / 2 - 8 : node.isCheckpoint ? CHECKPOINT_SIZE / 2 - 4 : NODE_H / 2 - 6)}
                  />
                )}
              </g>
            );
          })}

          {/* ── Tooltip ──────────────────────────────────────────────── */}
          {hoveredNode && hoveredPos && (
            <Tooltip node={hoveredNode} x={hoveredPos.x + NODE_W / 2 + 4} y={hoveredPos.y} />
          )}
        </g>
      </svg>
    </div>
  );
}

function truncate(str, max) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '\u2026' : str;
}
