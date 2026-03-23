import { useState } from 'react';
import { PARTS } from '../data/parts';
import { TEAM } from '../data/team';
import GlossaryText from './GlossaryText';
import { COMPONENTS } from '../data/components';

function getComponentsForPart(partId) {
  if (!COMPONENTS) return [];
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.usage?.parts?.includes(partId))
    .map(([id, c]) => ({ id, ...c }));
}

export default function PartInfoPanel({ partId, onClose }) {
  const part = PARTS[partId];
  if (!part) return null;

  return (
    <div className="h-full glass-panel rounded-l-2xl border-r-0 rounded-r-none p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h2
            className="text-xl font-bold tracking-wide mb-2.5"
            style={{ color: part.color }}
          >
            {part.label}
          </h2>
          <p className="text-sm text-[#6a7090]">{part.subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-[#ffffff08] hover:bg-[#ffffff15] flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] transition-colors text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Track badge */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className="tag"
          style={{
            backgroundColor: part.track === 'A' ? '#00f0ff15' : '#ff00aa15',
            color: part.track === 'A' ? '#00f0ff' : '#ff00aa',
            border: `1px solid ${part.track === 'A' ? '#00f0ff30' : '#ff00aa30'}`,
          }}
        >
          Track {part.track}
        </span>
        {part.weeks.map(w => (
          <span key={w} className="tag bg-[#ffffff08] text-[#6a7090] border border-[#ffffff10]">
            W{w}
          </span>
        ))}
      </div>

      {/* Owners */}
      <Section title="담당자">
        <div className="flex flex-wrap gap-2">
          {part.owners.map(ownerId => {
            const member = Object.values(TEAM).find(m => m.name === ownerId);
            return (
              <div
                key={ownerId}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: (member?.color || '#ffffff') + '10', border: `1px solid ${(member?.color || '#ffffff')}20` }}
              >
                <span className="text-sm font-bold" style={{ color: member?.color || '#e0e8ff' }}>
                  {ownerId}
                </span>
                {part.ownerRoles[ownerId] && (
                  <span className="text-sm text-[#6a7090]">{part.ownerRoles[ownerId]}</span>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Specs */}
      <Section title="스펙">
        <div className="space-y-2.5.5">
          {part.specs.map((spec, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-sm text-[#6a7090] min-w-[80px] shrink-0">{spec.label}</span>
              <span className="text-sm text-[#e0e8ff]">{spec.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Internal layout (torso) */}
      {part.internalLayout && (
        <Section title="내부 배치 (아래→위)">
          <div className="space-y-2.5">
            {part.internalLayout.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#ffffff08] flex items-center justify-center text-sm text-[#6a7090]">
                  {i + 1}
                </span>
                <span className="text-sm text-[#e0e8ff]">{item}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Assembly steps (torso) */}
      {part.assemblySteps && (
        <Section title="조립 순서">
          <div className="space-y-2.5">
            {part.assemblySteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: part.color + '15', color: part.color }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-[#e0e8ff]">{step}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Manufacturing paths (head) */}
      {part.manufacturingPaths && (
        <Section title="제작 경로">
          <div className="space-y-2">
            {part.manufacturingPaths.map((path, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#ffffff05] border border-[#ffffff08]">
                <span className="text-sm font-bold text-[#e0e8ff]">{path.label}</span>
                <p className="text-sm text-[#6a7090] mt-1.5">{path.desc}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SmolVLA (right arm) */}
      {part.smolvla && (
        <Section title="SmolVLA 태스크">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {part.smolvla.objects.map((obj, i) => (
                <div key={i} className="px-2 py-1 rounded bg-[#c8ff0010] border border-[#c8ff0020]">
                  <span className="text-sm text-[#c8ff00]">{obj.name}</span>
                  <span className="text-sm text-[#6a7090] ml-1">×{obj.episodes}</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-[#6a7090]">
              총 {part.smolvla.totalEpisodes} 에피소드
            </div>
            <div className="text-sm text-[#e0e8ff]">{part.smolvla.training}</div>
            <div className="text-sm text-[#6a7090]">{part.smolvla.pipeline}</div>
          </div>
        </Section>
      )}

      {/* Walking RL (legs) */}
      {part.walkingRL && (
        <Section title="Walking RL">
          <div className="space-y-2.5">
            <Row label="시뮬" value={part.walkingRL.sim} />
            <Row label="Sim2sim" value={part.walkingRL.sim2sim} />
            <Row label="보행" value={part.walkingRL.gait} />
          </div>
        </Section>
      )}

      {/* Safety */}
      {part.safety && (
        <Section title="안전">
          <span className="text-sm text-[#ff8800]">{part.safety}</span>
        </Section>
      )}

      {/* Components for this part */}
      <PartComponents partId={partId} />

      {/* Timeline */}
      <Section title="타임라인">
        <p className="text-sm text-[#e0e8ff] leading-relaxed"><GlossaryText text={part.timeline} /></p>
      </Section>

      {/* Risks */}
      {part.risks.length > 0 && (
        <Section title="리스크">
          <div className="space-y-2.5">
            {part.risks.map((risk, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-[#ff8800]">⚡</span>
                <span className="text-[#ff8800]">{risk}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-7">
      <h3 className="text-sm font-bold text-[#6a7090] uppercase tracking-wider mb-2.5">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-sm text-[#6a7090] min-w-[70px] shrink-0">{label}</span>
      <span className="text-sm text-[#e0e8ff]"><GlossaryText text={value} /></span>
    </div>
  );
}

function PartComponents({ partId }) {
  const [expanded, setExpanded] = useState(null);
  const comps = getComponentsForPart(partId);
  if (comps.length === 0) return null;

  return (
    <Section title="부품">
      <div className="space-y-2.5">
        {comps.map((comp) => (
          <div key={comp.id}>
            <button
              onClick={() => setExpanded(expanded === comp.id ? null : comp.id)}
              className="w-full text-left flex items-center gap-3 p-3.5 rounded-lg hover:bg-[#ffffff08] transition-colors cursor-pointer"
            >
              <span className="text-sm">📦</span>
              <span className="text-sm text-[#e0e8ff] flex-1">{comp.name}</span>
              <span className="text-sm text-[#6a7090]">×{comp.usage?.quantity || '?'}</span>
              <span className="text-sm text-[#6a7090]">{expanded === comp.id ? '▴' : '▾'}</span>
            </button>
            {expanded === comp.id && (
              <div className="ml-6 mb-2 p-3 rounded bg-[#ffffff04] border border-[#ffffff08] text-sm">
                <p className="text-[#aab0cc] mb-2"><GlossaryText text={comp.usage?.description || ''} /></p>
                {comp.specs && (
                  <div className="space-y-2 mb-2">
                    {Object.entries(comp.specs).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-[#6a7090] min-w-[50px]">{k}</span>
                        <span className="text-[#e0e8ff]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {comp.links?.length > 0 && (
                  <div className="space-y-2">
                    {comp.links.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="block text-[#4466ff] hover:text-[#6688ff]">
                        🔗 {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
