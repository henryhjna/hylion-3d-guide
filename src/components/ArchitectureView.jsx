import { useState } from 'react';
import { COMPUTING_NODES, STATE_RESOURCES, POWER_SYSTEM, NETWORK } from '../data/architecture';
import { SIGNAL_FLOW_CHAINS, CABLE_TOPOLOGY, POWER_TOPOLOGY, SOFTWARE_STACK } from '../data/signalFlow';

export default function ArchitectureView() {
  const [selectedState, setSelectedState] = useState('IDLE');
  const [selectedNode, setSelectedNode] = useState(null);
  const [showSignalFlow, setShowSignalFlow] = useState(true);
  const [showCables, setShowCables] = useState(false);
  const [showPower, setShowPower] = useState(false);
  const [showSoftware, setShowSoftware] = useState(false);
  const resources = STATE_RESOURCES[selectedState];

  return (
    <div className="absolute top-2 right-2 w-[380px] max-h-[calc(100%-16px)] overflow-y-auto glass-panel p-4 slide-in-right z-30">
      <h2 className="text-sm font-bold tracking-wide mb-3 glow-cyan text-[#00f0ff]">
        시스템 아키텍처
      </h2>

      {/* Signal Flow */}
      <div className="mb-4">
        <button
          onClick={() => setShowSignalFlow(!showSignalFlow)}
          className="flex items-center gap-2 text-sm font-bold text-[#c8ff00] mb-2 cursor-pointer hover:brightness-125 transition-all"
        >
          <span className={`text-[10px] transition-transform duration-200 ${showSignalFlow ? 'rotate-90' : ''}`}>▶</span>
          Signal Flow
        </button>
        {showSignalFlow && (
          <div className="space-y-3">
            {SIGNAL_FLOW_CHAINS.map(chain => (
              <div key={chain.id} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
                <div className="text-sm font-bold mb-2" style={{ color: chain.color }}>{chain.label}</div>
                {chain.input && (
                  <div className="flex items-center gap-1.5 text-sm mb-1.5 pl-2 border-l-2" style={{ borderColor: chain.color + '40' }}>
                    <span className="text-[#9aa0b8]">{chain.input.label}</span>
                    <span style={{ color: chain.color }}>→</span>
                    <span className="text-[#666]">{chain.input.wire}</span>
                  </div>
                )}
                <div className="space-y-0">
                  {chain.steps.map((step, i) => (
                    <div key={step.id}>
                      <div className="flex items-start gap-2 text-sm py-0.5">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: chain.color }} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[#e0e8ff] font-medium">{step.label}</span>
                          {step.host && <span className="text-[#666] text-xs ml-1">({step.host})</span>}
                          <span className="text-[#9aa0b8] text-xs block">{step.detail}</span>
                        </div>
                      </div>
                      {i < chain.steps.length - 1 && step.wire && (
                        <div className="text-[10px] pl-5 py-0" style={{ color: chain.color + '80' }}>↓ {chain.steps[i + 1]?.wire || ''}</div>
                      )}
                    </div>
                  ))}
                </div>
                {chain.feedback && (
                  <div className="text-xs text-[#9aa0b8] mt-2 pt-1.5 border-t border-[#ffffff08]">
                    <span style={{ color: chain.color }}>↩</span> {chain.feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signal Cables */}
      <div className="mb-4">
        <button
          onClick={() => setShowCables(!showCables)}
          className="flex items-center gap-2 text-sm font-bold text-[#6e8efb] mb-2 cursor-pointer hover:brightness-125 transition-all"
        >
          <span className={`text-[10px] transition-transform duration-200 ${showCables ? 'rotate-90' : ''}`}>▶</span>
          Signal Cables
        </button>
        {showCables && (
          <div className="space-y-3">
            {CABLE_TOPOLOGY.map(board => (
              <div key={board.id} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
                <div className="text-sm font-bold mb-2" style={{ color: board.color }}>{board.label}</div>
                <div className="space-y-1.5">
                  {board.ports.map((p, i) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span className="shrink-0 text-[#9aa0b8] min-w-[52px]">{p.port}</span>
                      <div className="flex-1">
                        <span className="text-[#e0e8ff]">{p.target}</span>
                        <span className="text-[#666] text-xs ml-1">({p.cable})</span>
                        {p.detail && <span className="text-[#9aa0b8] text-xs block">{p.detail}</span>}
                        {p.devices && <span className="text-[#9aa0b8] text-xs block">{p.devices.join(', ')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Power Cables */}
      <div className="mb-4">
        <button
          onClick={() => setShowPower(!showPower)}
          className="flex items-center gap-2 text-sm font-bold text-[#e85d75] mb-2 cursor-pointer hover:brightness-125 transition-all"
        >
          <span className={`text-[10px] transition-transform duration-200 ${showPower ? 'rotate-90' : ''}`}>▶</span>
          Power Cables
        </button>
        {showPower && (
          <div className="space-y-3">
            {POWER_TOPOLOGY.map(batt => (
              <div key={batt.id} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold" style={{ color: batt.color }}>{batt.label}</span>
                  <span className="text-xs text-[#9aa0b8]">{batt.spec}</span>
                </div>
                <div className="space-y-1.5">
                  {batt.outputs.map((o, i) => (
                    <div key={i} className="text-sm flex items-start gap-2">
                      <span style={{ color: batt.color }}>→</span>
                      <div className="flex-1">
                        <span className="text-[#e0e8ff]">{o.target}</span>
                        <span className="text-xs text-[#9aa0b8] ml-1">{o.voltage}</span>
                        <span className="text-xs text-[#666] block">{o.cable} — {o.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Software Architecture */}
      <div className="mb-4">
        <button
          onClick={() => setShowSoftware(!showSoftware)}
          className="flex items-center gap-2 text-sm font-bold text-[#c084fc] mb-2 cursor-pointer hover:brightness-125 transition-all"
        >
          <span className={`text-[10px] transition-transform duration-200 ${showSoftware ? 'rotate-90' : ''}`}>▶</span>
          Software Architecture
        </button>
        {showSoftware && (
          <div className="space-y-3">
            {SOFTWARE_STACK.map(board => (
              <div key={board.id} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
                <div className="text-sm font-bold mb-2" style={{ color: board.color }}>{board.label}</div>
                {board.groups.map((g, gi) => (
                  <div key={gi} className="mb-2">
                    <div className="text-xs text-[#9aa0b8] uppercase tracking-wider mb-1">{g.name}</div>
                    {g.items.map((item, ii) => (
                      <div key={ii} className="text-sm text-[#e0e8ff] flex items-start gap-2 py-0.5">
                        <span style={{ color: board.color }}>▸</span>
                        {item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* State selector */}
      <div className="mb-4">
        <label className="text-sm text-[#9aa0b8] uppercase tracking-wider mb-2 block">
          상태별 리소스
        </label>
        <div className="flex flex-wrap gap-1">
          {Object.entries(STATE_RESOURCES).map(([state, data]) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-2 py-1 rounded text-sm font-bold transition-all ${
                selectedState === state ? 'border' : 'opacity-50 hover:opacity-80'
              }`}
              style={{
                color: data.color,
                borderColor: selectedState === state ? data.color + '60' : 'transparent',
                backgroundColor: selectedState === state ? data.color + '15' : 'transparent',
              }}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Resource mapping for selected state */}
      {resources && (
        <div className="mb-4 p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
          <div className="text-sm font-bold mb-2" style={{ color: resources.color,  }}>
            {resources.label}
          </div>
          <div className="space-y-2.5 text-sm">
            <ResourceRow label="Orin GPU" value={resources.orin_gpu} active={resources.orin_gpu !== '없음' && resources.orin_gpu !== '비어있음'} />
            <ResourceRow label="Orin CPU" value={resources.orin_cpu} active={resources.orin_cpu !== '로그 유지'} />
            <ResourceRow label="NUC" value={resources.nuc} active={resources.nuc !== '대기' && resources.nuc !== '정지' && resources.nuc !== '전원 차단'} />
            <ResourceRow label="네트워크" value={resources.network} active={resources.network !== '없음'} />
          </div>
        </div>
      )}

      {/* Computing Nodes */}
      <div className="mb-4">
        <label className="text-sm text-[#9aa0b8] uppercase tracking-wider mb-2 block">
          컴퓨팅 노드
        </label>
        <div className="space-y-2">
          {COMPUTING_NODES.map(node => (
            <button
              key={node.id}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              className="w-full text-left p-3.5 rounded-lg transition-all border"
              style={{
                backgroundColor: selectedNode === node.id ? node.color + '10' : '#ffffff05',
                borderColor: selectedNode === node.id ? node.color + '40' : '#ffffff08',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: node.color,  }}>
                  {node.label}
                </span>
                <span className="text-sm text-[#9aa0b8]">{node.subtitle}</span>
              </div>
              {selectedNode === node.id && (
                <div className="mt-2 space-y-2">
                  {node.tasks.map((task, i) => (
                    <div key={i} className="text-sm text-[#e0e8ff] flex items-start gap-2.5">
                      <span style={{ color: node.color }}>▸</span>
                      {task}
                    </div>
                  ))}
                  {node.connections.length > 0 && (
                    <div className="text-sm text-[#9aa0b8] mt-1 pt-1 border-t border-[#ffffff08]">
                      연결: {node.connections.map(c => {
                        const target = COMPUTING_NODES.find(n => n.id === c);
                        return target?.label;
                      }).join(', ')}
                    </div>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Power System */}
      <div className="mb-4">
        <label className="text-sm text-[#9aa0b8] uppercase tracking-wider mb-2 block">
          전원 시스템
        </label>
        <div className="space-y-2.5">
          {POWER_SYSTEM.map(bat => (
            <div key={bat.id} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: bat.color }}>{bat.label}</span>
                <span className="text-sm text-[#9aa0b8]">{bat.spec}</span>
              </div>
              <div className="text-sm text-[#e0e8ff] mt-1.5">{bat.targets}</div>
              <div className="text-sm text-[#9aa0b8]">{bat.location}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-3 rounded bg-[#ff880010] border border-[#ff880020] text-sm">
          <span className="text-[#ff8800] font-bold">투입:</span>
          <span className="text-[#e0e8ff] ml-1">배터리 2 ON → Orin/NUC 부팅 → 배터리 1 ON → BHL 캘리브</span>
        </div>
        <div className="mt-1 p-3 rounded bg-[#ff004410] border border-[#ff004420] text-sm">
          <span className="text-[#ff0044] font-bold">비상정지:</span>
          <span className="text-[#e0e8ff] ml-1">배터리 1+2 NC 동시 차단</span>
        </div>
      </div>

      {/* Network */}
      <div className="mb-2">
        <label className="text-sm text-[#9aa0b8] uppercase tracking-wider mb-2 block">
          네트워크
        </label>
        <div className="space-y-2.5">
          {Object.values(NETWORK).map((net, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm">
              <span className="text-[#9aa0b8] min-w-[100px]">{net.label}</span>
              <span className="text-[#e0e8ff]">{net.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResourceRow({ label, value, active }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-[#00ff88]' : 'bg-[#9aa0b8]'}`} />
      <span className="text-[#9aa0b8] min-w-[60px]">{label}</span>
      <span className={active ? 'text-[#e0e8ff]' : 'text-[#9aa0b8]'}>{value}</span>
    </div>
  );
}
