import { useState, useEffect, useMemo, useCallback } from 'react';
import { TEAM } from '../data/team';
import { TIMELINE } from '../data/timeline';
import { TASK_HINTS } from '../data/taskHints';
import { HANDOFFS } from '../data/handoffs';

/* ── Gate definitions ─────────────────────────────────────────── */
const GATES = {
  3: { name: 'Phase 1', items: ['토르소 완성', 'SmolVLA v1 동작', 'ESP32 MOSFET', 'Sim2sim 완료', '수집 600개'] },
  5: { name: 'Phase 2', items: ['TTFT<500ms', '시선추적+표정5종', '공중보행', 'ablation', '머리+바디'] },
  7: { name: 'Phase 3', items: ['머리 통합', 'SmolVLA v2', 'Walking RL 최종', '외장 완성'] },
  8: { name: '합류', items: ['상하체 결합', '실체 보행', 'MOSFET 차단', '풀 시나리오 1차'] },
};

/* ── Week-based progress estimate ─────────────────────────────── */
const getProgress = (week) => ({
  total: Math.min(100, Math.round((week / 10) * 100)),
  head:        week < 2 ? 0 : week < 4 ? 20 : week < 5 ? 40 : week < 7 ? 65 : week < 8 ? 85 : 100,
  torso:       week < 2 ? 0 : week < 3 ? 70 : 85,
  arms:        week < 1 ? 0 : week < 3 ? 50 : week < 4 ? 80 : 100,
  legs:        week < 2 ? 0 : week < 4 ? 20 : week < 5 ? 40 : week < 6 ? 50 : week < 7 ? 70 : week < 8 ? 85 : 100,
  integration: week < 6 ? 0 : week < 8 ? 30 : week < 9 ? 60 : week < 10 ? 80 : 100,
});

/* ── Part display config ──────────────────────────────────────── */
const PART_META = {
  head:        { label: '머리',   color: '#00f0ff' },
  torso:       { label: '토르소', color: '#00f0ff' },
  arms:        { label: '양팔',   color: '#00f0ff' },
  legs:        { label: '다리',   color: '#ff00aa' },
  integration: { label: '통합',   color: '#c8ff00' },
};

/* ── Track highlights builder ─────────────────────────────────── */
function getTrackHighlights(week) {
  const entry = TIMELINE.find((t) => t.week === week);
  if (!entry) return null;
  return { trackA: entry.trackA, trackB: entry.trackB };
}

/* ── Dependency flow (this week -> next week) ─────────────────── */
function getDependencyFlow(week) {
  const current = TIMELINE.find((t) => t.week === week);
  const next = TIMELINE.find((t) => t.week === week + 1);
  if (!current) return null;
  const items = [];
  if (current.key) items.push({ label: `Week ${week} 핵심`, text: current.key });
  if (current.extra) items.push({ label: `Week ${week} 추가`, text: current.extra });
  if (next?.key) items.push({ label: `Week ${week + 1} 핵심`, text: next.key });
  return items.length > 0 ? items : null;
}

/* ── Hint / Handoff matching helpers ──────────────────────────── */
function findHintForTask(taskText, weekNum) {
  const taskLower = taskText.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  for (const [id, hint] of Object.entries(TASK_HINTS)) {
    if (!id.startsWith(`w${weekNum}_`)) continue;
    const words = hint.summary.toLowerCase().split(/\s+/);
    let score = 0;
    for (const word of words) {
      if (word.length > 2 && taskLower.includes(word)) score++;
    }
    if (score > bestScore) { bestScore = score; bestMatch = { id, ...hint }; }
  }
  return bestScore >= 2 ? bestMatch : null;
}

function findHandoff(depText, memberId) {
  for (const [, h] of Object.entries(HANDOFFS)) {
    if (h.from === memberId || h.to === memberId) {
      if (depText.toLowerCase().includes(h.what.slice(0, 10).toLowerCase())) return h;
    }
  }
  return null;
}

/* ── Expandable task item ────────────────────────────────────── */
function ExpandableTask({ task, index, weekNum, isChecked, onToggle, memberColor }) {
  const [expanded, setExpanded] = useState(false);
  const hint = useMemo(() => findHintForTask(task, weekNum), [task, weekNum]);

  return (
    <div className="mb-2">
      <label className={`flex items-start gap-2 px-2 py-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-[#ffffff06] ${isChecked ? 'opacity-45' : ''}`}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-0.5 flex-shrink-0"
          style={{ accentColor: memberColor }}
        />
        <span
          className="text-sm leading-relaxed flex-1"
          style={{
            color: isChecked ? '#6a7090' : '#e0e8ff',
            textDecoration: isChecked ? 'line-through' : 'none',
            transition: 'color 0.2s, text-decoration 0.2s',
          }}
        >
          {task}
        </span>
        {hint && (
          <button
            onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
            className="text-sm text-[#6a7090] hover:text-[#e0e8ff] shrink-0 ml-1"
          >
            {expanded ? '\u25B4' : '\u25BE'}
          </button>
        )}
      </label>
      {expanded && hint && (
        <div className="ml-7 mt-1 mb-2 p-3 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <p className="text-[#aab0cc] mb-1.5">{hint.summary}</p>
          {hint.steps?.length > 0 && (
            <ol className="list-decimal ml-4 mb-1.5 space-y-0.5 text-[#e0e8ff]">
              {hint.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          {hint.resources?.length > 0 && (
            <div className="mb-1 space-y-0.5">
              {hint.resources.map((r, i) => (
                <a key={i} href={r.url || '#'} target={r.type === 'internal' ? undefined : '_blank'} rel="noopener noreferrer"
                  className="block text-[#4466ff] hover:text-[#6688ff]">
                  {'\uD83D\uDD17'} {r.label}
                </a>
              ))}
            </div>
          )}
          {hint.estimatedHours && (
            <div className="text-[#6a7090]">{'\u23F1'} 예상 소요: ~{hint.estimatedHours}시간</div>
          )}
          {hint.components?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {hint.components.map((c, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#00f0ff10', color: '#00f0ff', border: '1px solid #00f0ff20' }}>
                  {'\uD83D\uDCE6'} {c}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Expandable dependency item ──────────────────────────────── */
function ExpandableDep({ dep, memberId }) {
  const [expanded, setExpanded] = useState(false);
  const handoff = useMemo(() => findHandoff(dep, memberId), [dep, memberId]);

  return (
    <div className="mb-0.5">
      <div
        className={`text-xs text-[#e0e8ff] ml-4 leading-relaxed flex items-start gap-1 ${handoff ? 'cursor-pointer hover:text-[#ffffff]' : ''}`}
        onClick={() => handoff && setExpanded(!expanded)}
      >
        <span>{'\u2022'} {dep}</span>
        {handoff && (
          <span className="text-xs text-[#6a7090] shrink-0 mt-0.5">
            {expanded ? '\u25B4' : '\u25BE'}
          </span>
        )}
      </div>
      {expanded && handoff && (
        <div className="ml-7 mt-1 mb-1.5 p-3 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
          <div className="text-[#aab0cc] mb-1"><span className="text-[#6a7090]">전달물:</span> {handoff.what}</div>
          {handoff.format && <div className="text-[#aab0cc] mb-0.5"><span className="text-[#6a7090]">포맷:</span> {handoff.format}</div>}
          {handoff.location && <div className="text-[#aab0cc] mb-0.5"><span className="text-[#6a7090]">위치:</span> {handoff.location}</div>}
          {handoff.deadline && <div className="text-[#aab0cc] mb-0.5"><span className="text-[#6a7090]">기한:</span> {handoff.deadline}</div>}
          {handoff.verification && <div className="text-[#aab0cc]"><span className="text-[#6a7090]">검증:</span> {handoff.verification}</div>}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DashboardPanel
   ══════════════════════════════════════════════════════════════════ */
export default function DashboardPanel({
  memberId,
  memberData,
  currentWeek,
  weekTitle: weekTitleProp,
  isCollapsed,
  onToggleCollapse,
  onOpenTechTree,
  onPartClick,
}) {
  const member = memberId ? TEAM[memberId] : null;
  const weekNum = currentWeek ?? 0;
  const gate = GATES[weekNum] || null;
  const weekEntry = TIMELINE.find((t) => t.week === weekNum);
  const weekTitle = weekTitleProp || weekEntry?.title || `Week ${weekNum}`;
  const progress = useMemo(() => getProgress(weekNum), [weekNum]);

  /* ── Checklist state (localStorage) ──────────────────────────── */
  const [checkedTasks, setCheckedTasks] = useState({});

  useEffect(() => {
    if (!memberId) { setCheckedTasks({}); return; }
    try {
      const stored = JSON.parse(localStorage.getItem(`hylion_tasks_${memberId}`) || '{}');
      setCheckedTasks(stored);
    } catch { setCheckedTasks({}); }
  }, [memberId]);

  const toggleKey = useCallback((key) => {
    const storageId = memberId || '_all';
    setCheckedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`hylion_tasks_${storageId}`, JSON.stringify(updated));
      return updated;
    });
  }, [memberId]);

  const toggleTask = useCallback((idx) => {
    if (!memberId) return;
    const key = `w${weekNum}_t${idx}`;
    setCheckedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`hylion_tasks_${memberId}`, JSON.stringify(updated));
      return updated;
    });
  }, [memberId, weekNum]);

  const isChecked = (idx) => !!checkedTasks[`w${weekNum}_t${idx}`];

  /* ── Dependency flow section state ───────────────────────────── */
  const [flowOpen, setFlowOpen] = useState(false);

  /* ── Derived data ────────────────────────────────────────────── */
  const weekData = memberData?.weeklyTasks?.[weekNum];
  const nextWeekData = memberData?.weeklyTasks?.[weekNum + 1];
  const completedCount = weekData?.tasks?.filter((_, i) => isChecked(i)).length || 0;
  const totalCount = weekData?.tasks?.length || 0;
  const trackHighlights = useMemo(() => getTrackHighlights(weekNum), [weekNum]);
  const depFlow = useMemo(() => getDependencyFlow(weekNum), [weekNum]);

  /* ── Member-specific dependency flow (from memberData) ───────── */
  const memberDepFlow = useMemo(() => {
    if (!weekData?.dependencies || !nextWeekData) return null;
    const items = [];
    if (weekData.focus) items.push({ label: `이번 주`, text: weekData.focus });
    if (nextWeekData.focus) items.push({ label: `다음 주`, text: nextWeekData.focus });
    weekData.dependencies.gives?.forEach((g) => items.push({ label: '전달', text: g }));
    return items.length > 0 ? items : null;
  }, [weekData, nextWeekData]);

  /* ════════════════════════════════════════════════════════════════
     Collapsed state — minimal sidebar
     ════════════════════════════════════════════════════════════════ */
  if (isCollapsed) {
    return (
      <div
        className="fixed top-0 left-0 h-full flex flex-col items-center pt-16 pb-4 gap-3"
        style={{
          width: 48,
          background: 'rgba(18, 18, 26, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          zIndex: 10,
          transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff10] transition-colors text-xs"
          title="패널 펼치기"
        >
          {'\u25B6'}
        </button>

        {/* Member avatar or project icon */}
        {member ? (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: member.color + '20',
              color: member.color,
              border: `2px solid ${member.color}50`,
            }}
          >
            {member.name}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-[#ffffff08] text-[#6a7090] border border-[#ffffff10]">
            ALL
          </div>
        )}

        {/* Mini progress circle */}
        <svg width="36" height="36" viewBox="0 0 36 36" className="mt-1">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#ffffff10" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none"
            stroke={member ? member.color : '#00ff88'}
            strokeWidth="3"
            strokeDasharray={`${(2 * Math.PI * 15 * progress.total) / 100} ${2 * Math.PI * 15}`}
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
            style={{ transition: 'stroke-dasharray 0.7s ease' }}
          />
          <text
            x="18" y="19.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={member ? member.color : '#00ff88'}
            fontSize="8"
            fontFamily="Orbitron"
            fontWeight="700"
          >
            {progress.total}%
          </text>
        </svg>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     Expanded state
     ════════════════════════════════════════════════════════════════ */
  const accentColor = member?.color || '#00ff88';

  return (
    <div
      className="fixed top-0 left-0 h-full flex flex-col"
      style={{
        width: 420,
        background: 'rgba(18, 18, 26, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 10,
        transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {/* ── Top bar: collapse toggle ─────────────────────────────── */}
      <div className="flex items-center justify-end px-3 pt-3 pb-1">
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff10] transition-colors text-xs"
          title="패널 접기"
        >
          {'\u25C0'}
        </button>
      </div>

      {/* ── Scrollable content ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4" style={{ scrollbarGutter: 'stable' }}>
        {/* ── Gate card ───────────────────────────────────────────── */}
        {gate && <GateCard gate={gate} weekNum={weekNum} checkedTasks={checkedTasks} memberId={memberId} onToggleGateItem={toggleKey} />}

        {/* ── Member selected vs overall view ────────────────────── */}
        {member && memberData ? (
          <MemberView
            member={member}
            memberData={memberData}
            weekNum={weekNum}
            weekTitle={weekTitle}
            weekData={weekData}
            nextWeekData={nextWeekData}
            completedCount={completedCount}
            totalCount={totalCount}
            isChecked={isChecked}
            toggleTask={toggleTask}
            accentColor={accentColor}
            depFlow={memberDepFlow}
            flowOpen={flowOpen}
            setFlowOpen={setFlowOpen}
          />
        ) : (
          <OverallView
            weekNum={weekNum}
            weekTitle={weekTitle}
            progress={progress}
            trackHighlights={trackHighlights}
            depFlow={depFlow}
            flowOpen={flowOpen}
            setFlowOpen={setFlowOpen}
            onPartClick={onPartClick}
          />
        )}

        {/* ── Tech tree button ───────────────────────────────────── */}
        <button
          onClick={onOpenTechTree}
          className="w-full py-2.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: 'Orbitron',
            color: '#c8ff00',
            background: 'rgba(200, 255, 0, 0.06)',
            border: '1px solid rgba(200, 255, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200, 255, 0, 0.12)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(200, 255, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(200, 255, 0, 0.06)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {'\u25B8'} {'\u00A0'}전체 테크트리 보기
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════════ */

/* ── Gate card ─────────────────────────────────────────────────── */
function GateCard({ gate, weekNum, checkedTasks, memberId, onToggleGateItem }) {
  const completedGateItems = gate.items.filter((_, i) => {
    const key = memberId ? `gate_${weekNum}_${i}` : `gate_all_${weekNum}_${i}`;
    return !!checkedTasks[key];
  }).length;

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(200, 255, 0, 0.03)',
        border: '1px solid rgba(200, 255, 0, 0.25)',
        boxShadow: '0 0 20px rgba(200, 255, 0, 0.06), inset 0 0 20px rgba(200, 255, 0, 0.02)',
      }}
    >
      {/* Pulse accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #c8ff00, transparent)',
          animation: 'pulse-neon 2s ease-in-out infinite',
        }}
      />
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ fontFamily: 'Orbitron', color: '#c8ff00' }}
        >
          GATE
        </span>
        <span
          className="text-sm font-bold"
          style={{ fontFamily: 'Orbitron', color: '#c8ff00' }}
        >
          {gate.name}
        </span>
        <span className="text-xs text-[#6a7090] ml-auto">
          Week {weekNum} 말
        </span>
      </div>
      <div className="space-y-2">
        {gate.items.map((item, i) => {
          const key = memberId ? `gate_${weekNum}_${i}` : `gate_all_${weekNum}_${i}`;
          const checked = !!checkedTasks[key];
          return (
            <label key={i} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[#c8ff0008] rounded px-1 -mx-1">
              <span
                onClick={() => onToggleGateItem?.(key)}
                className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-xs flex-shrink-0 cursor-pointer"
                style={{
                  borderColor: checked ? '#c8ff00' : 'rgba(200, 255, 0, 0.3)',
                  backgroundColor: checked ? 'rgba(200, 255, 0, 0.15)' : 'transparent',
                  color: '#c8ff00',
                }}
              >
                {checked ? '\u2713' : ''}
              </span>
              <span className={`${checked ? 'line-through text-[#6a7090]' : 'text-[#e0e8ff]'}`}>{item}</span>
            </label>
          );
        })}
      </div>
      {/* Progress text */}
      <div className="mt-3 text-xs text-[#6a7090]">
        체크리스트 진행: {completedGateItems}/{gate.items.length}
      </div>
    </div>
  );
}

/* ── Member selected view ──────────────────────────────────────── */
function MemberView({
  member,
  memberData,
  weekNum,
  weekTitle,
  weekData,
  nextWeekData,
  completedCount,
  totalCount,
  isChecked,
  toggleTask,
  accentColor,
  depFlow,
  flowOpen,
  setFlowOpen,
}) {
  return (
    <>
      {/* Member info (single line) */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            backgroundColor: member.color + '18',
            color: member.color,
            border: `2px solid ${member.color}40`,
          }}
        >
          {member.name}
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-bold" style={{ color: member.color, fontFamily: 'Orbitron' }}>
            {member.name}
          </span>
          <span className="text-xs text-[#6a7090] mx-1.5">{memberData.identity}</span>
          <span className="text-xs text-[#6a7090]">{memberData.track}</span>
        </div>
      </div>

      {/* Current week title + focus */}
      {weekData && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3
              className="text-xs font-bold tracking-wide"
              style={{ fontFamily: 'Orbitron', color: accentColor }}
            >
              Week {weekNum} — {weekTitle}
            </h3>
            <span className="text-xs text-[#6a7090]">
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Focus box */}
          <div
            className="p-3 rounded-lg mb-4"
            style={{
              background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}06)`,
              border: `1px solid ${accentColor}25`,
            }}
          >
            <div className="text-xs text-[#6a7090] mb-0.5" style={{ fontFamily: 'Orbitron' }}>
              핵심 목표
            </div>
            <div className="text-sm font-bold" style={{ color: accentColor }}>
              {weekData.focus}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-[#ffffff08] mb-4 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}60`,
                transition: 'width 0.5s cubic-bezier(.4,0,.2,1)',
              }}
            />
          </div>

          {/* Checklist */}
          <div className="space-y-0.5">
            {weekData.tasks.map((task, i) => (
              <ExpandableTask
                key={i}
                task={task}
                index={i}
                weekNum={weekNum}
                isChecked={isChecked(i)}
                onToggle={() => toggleTask(i)}
                memberColor={accentColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {weekData?.dependencies && (
        <DependenciesSection
          receives={weekData.dependencies.receives}
          gives={weekData.dependencies.gives}
          memberId={member.id}
        />
      )}

      {/* Next week preview */}
      {nextWeekData && (
        <div
          className="p-3 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="text-xs text-[#6a7090] mb-0.5">
            다음 주 미리보기 (Week {weekNum + 1})
          </div>
          <div className="text-sm" style={{ color: accentColor }}>
            {nextWeekData.focus}
          </div>
        </div>
      )}

      {/* Dependency flow (collapsible) */}
      {depFlow && (
        <CollapsibleFlow
          items={depFlow}
          flowOpen={flowOpen}
          setFlowOpen={setFlowOpen}
        />
      )}
    </>
  );
}

/* ── Overall project view (no member) ──────────────────────────── */
function OverallView({
  weekNum,
  weekTitle,
  progress,
  trackHighlights,
  depFlow,
  flowOpen,
  setFlowOpen,
  onPartClick,
}) {
  return (
    <>
      {/* Header */}
      <div>
        <h2
          className="text-sm font-bold tracking-wide mb-0.5"
          style={{ fontFamily: 'Orbitron', color: '#e0e8ff' }}
        >
          전체 프로젝트
        </h2>
        <div className="text-xs text-[#6a7090]">HYlion Physical AI</div>
      </div>

      {/* Current week title */}
      <div>
        <h3
          className="text-xs font-bold tracking-wide mb-4"
          style={{ fontFamily: 'Orbitron', color: '#00ff88' }}
        >
          Week {weekNum} — {weekTitle}
        </h3>

        {/* Overall progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 rounded-full bg-[#ffffff08] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress.total}%`,
                background: 'linear-gradient(90deg, #00ff88, #00f0ff)',
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                transition: 'width 0.7s cubic-bezier(.4,0,.2,1)',
              }}
            />
          </div>
          <span
            className="text-xs font-bold w-10 text-right"
            style={{ fontFamily: 'Orbitron', color: '#00ff88' }}
          >
            {progress.total}%
          </span>
        </div>

        {/* Per-part progress bars */}
        <div className="space-y-2">
          {Object.entries(PART_META).map(([key, meta]) => {
            const val = progress[key];
            return (
              <button
                key={key}
                className="w-full flex items-center gap-2 group cursor-pointer hover:bg-[#ffffff04] rounded-md px-1 py-0.5 transition-colors"
                onClick={() => onPartClick?.(key)}
              >
                <span className="text-xs w-12 text-left" style={{ color: '#6a7090' }}>
                  {meta.label}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-[#ffffff08] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${val}%`,
                      backgroundColor: meta.color,
                      boxShadow: `0 0 6px ${meta.color}40`,
                      transition: 'width 0.7s cubic-bezier(.4,0,.2,1)',
                    }}
                  />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: '#6a7090' }}>
                  {val}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* This week highlights by track */}
      {trackHighlights && (
        <div className="space-y-2">
          <h4
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'Orbitron', color: '#6a7090' }}
          >
            이번 주 하이라이트
          </h4>

          {trackHighlights.trackA && (
            <div className="p-3 rounded-lg" style={{ background: 'rgba(0, 240, 255, 0.04)', border: '1px solid rgba(0, 240, 255, 0.12)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#00f0ff', fontFamily: 'Orbitron' }}>
                Track A (상체)
              </div>
              <div className="text-sm text-[#e0e8ff] leading-relaxed">
                {trackHighlights.trackA}
              </div>
            </div>
          )}

          {trackHighlights.trackB && (
            <div className="p-3 rounded-lg" style={{ background: 'rgba(255, 0, 170, 0.04)', border: '1px solid rgba(255, 0, 170, 0.12)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#ff00aa', fontFamily: 'Orbitron' }}>
                Track B (하체)
              </div>
              <div className="text-sm text-[#e0e8ff] leading-relaxed">
                {trackHighlights.trackB}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dependency flow (collapsible) */}
      {depFlow && (
        <CollapsibleFlow
          items={depFlow}
          flowOpen={flowOpen}
          setFlowOpen={setFlowOpen}
        />
      )}
    </>
  );
}

/* ── Dependencies section ──────────────────────────────────────── */
function DependenciesSection({ receives, gives, memberId }) {
  const hasReceives = receives && receives.length > 0;
  const hasGives = gives && gives.length > 0;
  if (!hasReceives && !hasGives) return null;

  return (
    <div>
      <h4
        className="text-xs uppercase tracking-widest mb-3"
        style={{ fontFamily: 'Orbitron', color: '#6a7090' }}
      >
        작업 의존성
      </h4>

      {hasReceives && (
        <div className="mb-3">
          <div className="text-xs mb-1" style={{ color: '#ff8800' }}>
            {'\u2190'} 받는 것
          </div>
          {receives.map((dep, i) => (
            <ExpandableDep key={i} dep={dep} memberId={memberId} />
          ))}
        </div>
      )}

      {hasGives && (
        <div>
          <div className="text-xs mb-1" style={{ color: '#00ff88' }}>
            {'\u2192'} 주는 것
          </div>
          {gives.map((dep, i) => (
            <ExpandableDep key={i} dep={dep} memberId={memberId} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Collapsible dependency flow section ───────────────────────── */
function CollapsibleFlow({ items, flowOpen, setFlowOpen }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <button
        className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-[#ffffff04]"
        onClick={() => setFlowOpen((o) => !o)}
      >
        <span
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'Orbitron', color: '#6a7090' }}
        >
          의존성 흐름
        </span>
        <span
          className="text-xs text-[#6a7090] transition-transform duration-200"
          style={{ transform: flowOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          {'\u25B6'}
        </span>
      </button>

      <div
        style={{
          maxHeight: flowOpen ? 300 : 0,
          opacity: flowOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(.4,0,.2,1), opacity 0.2s ease',
        }}
      >
        <div className="px-3 pb-2.5 space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-sm uppercase tracking-wider flex-shrink-0 mt-0.5 px-1.5 py-0.5 rounded"
                style={{
                  fontFamily: 'Orbitron',
                  color: '#c8ff00',
                  background: 'rgba(200, 255, 0, 0.08)',
                }}
              >
                {item.label}
              </span>
              <span className="text-xs text-[#e0e8ff] leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
          {items.length > 1 && (
            <div className="flex items-center gap-1 pt-1">
              {items.map((_, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#c8ff00' }}
                  />
                  {i < items.length - 1 && (
                    <span
                      className="w-6 h-[1px]"
                      style={{ backgroundColor: 'rgba(200, 255, 0, 0.2)' }}
                    />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
