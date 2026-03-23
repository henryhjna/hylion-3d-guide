import { useState } from 'react';
import { COMPUTING_NODES, STATE_RESOURCES, POWER_SYSTEM, NETWORK } from '../data/architecture';

export default function ArchitectureView() {
  const [selectedState, setSelectedState] = useState('IDLE');
  const [selectedNode, setSelectedNode] = useState(null);
  const resources = STATE_RESOURCES[selectedState];

  return (
    <div className="absolute top-2 right-2 w-[380px] max-h-[calc(100%-16px)] overflow-y-auto glass-panel p-4 slide-in-right z-30">
      <h2 className="text-sm font-bold tracking-wide mb-3 glow-cyan text-[#00f0ff]">
        시스템 아키텍처
      </h2>

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
          <div className="space-y-2.5.5 text-sm">
            <ResourceRow label="Orin GPU" value={resources.orin_gpu} active={resources.orin_gpu !== '없음' && resources.orin_gpu !== '비어있음'} />
            <ResourceRow label="Orin CPU" value={resources.orin_cpu} active={resources.orin_cpu !== '로그 유지'} />
            <ResourceRow label="NUC" value={resources.nuc} active={resources.nuc !== '대기' && resources.nuc !== '정지' && resources.nuc !== '전원 차단'} />
            <ResourceRow label="ESP32" value={resources.esp32} active={resources.esp32 !== '모니터링'} />
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
        <div className="space-y-2.5.5">
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
          <span className="text-[#e0e8ff] ml-1">A ON → Orin/NUC 부팅 → B ON → Dynamixel → C ON → BHL 캘</span>
        </div>
        <div className="mt-1 p-3 rounded bg-[#ff004410] border border-[#ff004420] text-sm">
          <span className="text-[#ff0044] font-bold">비상정지:</span>
          <span className="text-[#e0e8ff] ml-1">B+C 양극 NC 차단 + ESP32 MOSFET C (A 유지)</span>
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
