import { useState, useEffect, useMemo, useCallback } from 'react';
import { TEAM } from '../data/team';
import { TIMELINE } from '../data/timeline';
import { TASK_HINTS } from '../data/taskHints';
import { HANDOFFS } from '../data/handoffs';
import { WEEK_KEYS, WEEK_LABELS, getWeekData, getNextWeekKey, getWeekProgress } from '../data/weekHelpers';

/* ── Gate definitions (timeline.js의 gates 배열에서 자동 추출) ───── */
const GATES = TIMELINE.reduce((acc, entry) => {
  if (entry.gates && entry.gates.length > 0) {
    acc[entry.weekKey] = {
      name: entry.title,
      items: entry.gates,
    };
  }
  return acc;
}, {});

/* ── Week-based progress estimate (weekKey 기반) ───────────────── */
// 누적 통합 모델: W-6 토르소+mouth → W-5 +arm → W-4 +leg → W-3 +머리 → W-2/W-1 sim2real
const PROGRESS_MAP = {
  'W-6': { head: 5, torso: 30, mouth: 30, arms: 50, legs: 25, integration: 0 },
  'W-5': { head: 5, torso: 60, mouth: 60, arms: 75, legs: 35, integration: 10 },
  'W-4': { head: 10, torso: 70, mouth: 70, arms: 80, legs: 70, integration: 30 },
  'W-3': { head: 80, torso: 90, mouth: 90, arms: 90, legs: 85, integration: 70 },
  'W-2': { head: 95, torso: 95, mouth: 95, arms: 95, legs: 90, integration: 85 },
  'W-1': { head: 100, torso: 100, mouth: 100, arms: 100, legs: 95, integration: 95 },
  'final': { head: 100, torso: 100, mouth: 100, arms: 100, legs: 100, integration: 100 },
};

const getProgress = (weekKey) => {
  const p = PROGRESS_MAP[weekKey] || PROGRESS_MAP['W-6'];
  return { total: getWeekProgress(weekKey), ...p };
};

/* ── Part display config ──────────────────────────────────────── */
const PART_META = {
  head:        { label: '머리',   color: '#00f0ff' },
  torso:       { label: '토르소', color: '#00f0ff' },
  mouth:       { label: '입',     color: '#00ff88' },
  arms:        { label: '양팔',   color: '#00f0ff' },
  legs:        { label: '다리',   color: '#ff00aa' },
  integration: { label: '통합',   color: '#c8ff00' },
};

/* ── Member-based highlights (TIMELINE.members에서 추출) ───────── */
function getWeekHighlights(weekKey) {
  const entry = getWeekData(weekKey);
  if (!entry || !entry.members) return null;
  return { focus: entry.focus, description: entry.description, members: entry.members };
}

/* ── Dependency flow (this week → next week) ──────────────────── */
function getDependencyFlow(weekKey) {
  const current = getWeekData(weekKey);
  const nextKey = getNextWeekKey(weekKey);
  const next = nextKey ? getWeekData(nextKey) : null;
  if (!current) return null;
  const items = [];
  if (current.key) items.push({ label: `${WEEK_LABELS[weekKey]} 핵심`, text: current.key });
  if (next?.key) items.push({ label: `${WEEK_LABELS[nextKey]} 핵심`, text: next.key });
  return items.length > 0 ? items : null;
}

/* ── Hint / Handoff matching helpers ──────────────────────────── */
function findHintForTask(taskText, weekKey) {
  const taskLower = taskText.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  // 새 weekKey 형태 (w6_, w5_) + 옛 (w0_~w10_) 양쪽 시도
  const weekIdx = WEEK_KEYS.indexOf(weekKey);
  const candidatePrefixes = [
    `${weekKey.toLowerCase().replace('-', '')}_`, // w6_, w5_
    weekIdx >= 0 ? `w${weekIdx}_` : null,
  ].filter(Boolean);
  for (const [id, hint] of Object.entries(TASK_HINTS)) {
    if (!candidatePrefixes.some(p => id.startsWith(p))) continue;
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
function ExpandableTask({ task, weekKey, isChecked, onToggle, memberColor }) {
  const [expanded, setExpanded] = useState(false);
  const hint = useMemo(() => findHintForTask(task, weekKey), [task, weekKey]);

  return (
    <div className="mb-6">
      <label className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[#ffffff06] ${isChecked ? 'opacity-45' : ''}`}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="mt-1.5 flex-shrink-0"
          style={{ accentColor: memberColor }}
        />
        <span
          className={`text-sm leading-relaxed flex-1 transition-[color,text-decoration] duration-200 ${isChecked ? 'text-[#9aa0b8] line-through' : 'text-[#e0e8ff]'}`}
        >
          {task}
        </span>
        {hint && (
          <button
            onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
            className="text-sm text-[#9aa0b8] hover:text-[#e0e8ff] shrink-0 ml-1"
          >
            {expanded ? '\u25B4' : '\u25BE'}
          </button>
        )}
      </label>
      {expanded && hint && (
        <div className="ml-7 mt-1 mb-6 p-5 rounded-lg text-sm bg-white/[0.015] border border-white/[0.03]">
          <p className="text-[#aab0cc] mb-6">{hint.summary}</p>
          {hint.steps?.length > 0 && (
            <ol className="list-decimal ml-4 mb-6 space-y-3 text-[#e0e8ff]">
              {hint.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          {hint.resources?.length > 0 && (
            <div className="mb-6 space-y-3">
              {hint.resources.map((r, i) => (
                <a key={i} href={r.url || '#'} target={r.type === 'internal' ? undefined : '_blank'} rel="noopener noreferrer"
                  className="block text-[#4466ff] hover:text-[#6688ff]">
                  {'\uD83D\uDD17'} {r.label}
                </a>
              ))}
            </div>
          )}
          {hint.estimatedHours && (
            <div className="text-[#9aa0b8]">{'\u23F1'} 예상 소요: ~{hint.estimatedHours}시간</div>
          )}
          {hint.components?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {hint.components.map((c, i) => (
                <span key={i} className="text-sm px-2.5 py-1.5 rounded bg-[#00f0ff10] text-[#00f0ff] border border-[#00f0ff20]">
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
    <div className="mb-6">
      <div
        className={`text-sm text-[#e0e8ff] ml-4 leading-relaxed flex items-start gap-1 ${handoff ? 'cursor-pointer hover:text-[#ffffff]' : ''}`}
        onClick={() => handoff && setExpanded(!expanded)}
      >
        <span>{'\u2022'} {dep}</span>
        {handoff && (
          <span className="text-sm text-[#9aa0b8] shrink-0 mt-1.5">
            {expanded ? '\u25B4' : '\u25BE'}
          </span>
        )}
      </div>
      {expanded && handoff && (
        <div className="ml-7 mt-1 mb-6 p-5 rounded-lg text-sm bg-white/[0.015] border border-white/[0.03]">
          <div className="text-[#aab0cc] mb-6"><span className="text-[#9aa0b8]">전달물:</span> {handoff.what}</div>
          {handoff.format && <div className="text-[#aab0cc] mb-6"><span className="text-[#9aa0b8]">포맷:</span> {handoff.format}</div>}
          {handoff.location && <div className="text-[#aab0cc] mb-6"><span className="text-[#9aa0b8]">위치:</span> {handoff.location}</div>}
          {handoff.deadline && <div className="text-[#aab0cc] mb-6"><span className="text-[#9aa0b8]">기한:</span> {handoff.deadline}</div>}
          {handoff.verification && <div className="text-[#aab0cc]"><span className="text-[#9aa0b8]">검증:</span> {handoff.verification}</div>}
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
  onPartClick,
}) {
  const member = memberId ? TEAM[memberId] : null;
  const weekKey = currentWeek || 'W-6';
  const weekLabel = WEEK_LABELS[weekKey] || weekKey;
  const gate = GATES[weekKey] || null;
  const weekEntry = getWeekData(weekKey);
  const weekTitle = weekTitleProp || weekEntry?.title || weekLabel;
  const progress = useMemo(() => getProgress(weekKey), [weekKey]);
  const nextKey = getNextWeekKey(weekKey);

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
    const key = `${weekKey}_t${idx}`;
    setCheckedTasks((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(`hylion_tasks_${memberId}`, JSON.stringify(updated));
      return updated;
    });
  }, [memberId, weekKey]);

  const isChecked = (idx) => !!checkedTasks[`${weekKey}_t${idx}`];

  /* ── Dependency flow section state ───────────────────────────── */
  const [flowOpen, setFlowOpen] = useState(false);

  /* ── Derived data ────────────────────────────────────────────── */
  const weekData = memberData?.weeklyTasks?.[weekKey];
  const nextWeekData = nextKey ? memberData?.weeklyTasks?.[nextKey] : null;
  const completedCount = weekData?.tasks?.filter((_, i) => isChecked(i)).length || 0;
  const totalCount = weekData?.tasks?.length || 0;
  const weekHighlights = useMemo(() => getWeekHighlights(weekKey), [weekKey]);
  const depFlow = useMemo(() => getDependencyFlow(weekKey), [weekKey]);

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
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col items-center pt-6 pb-4 gap-3 w-12 glass-panel rounded-none border-y-0 border-l-0 z-10 transition-all duration-300"
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9aa0b8] hover:text-[#e0e8ff] hover:bg-[#ffffff10] transition-colors text-sm"
          title="패널 펼치기"
        >
          {'\u25B6'}
        </button>

        {/* Member avatar or project icon */}
        {member ? (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              backgroundColor: member.color + '20',
              color: member.color,
              border: `2px solid ${member.color}50`,
            }}
          >
            {member.name}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-[#ffffff08] text-[#9aa0b8] border border-[#ffffff10]">
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
            className="transition-[stroke-dasharray] duration-700 ease-in-out"
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
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] flex flex-col w-[420px] glass-panel rounded-none border-y-0 border-l-0 z-10 transition-all duration-300"
    >
      {/* ── Top bar: collapse toggle ─────────────────────────────── */}
      <div className="flex items-center justify-end px-3 pt-3 pb-1">
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[#9aa0b8] hover:text-[#e0e8ff] hover:bg-[#ffffff10] transition-colors text-sm"
          title="패널 접기"
        >
          {'\u25C0'}
        </button>
      </div>

      {/* ── Scrollable content ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5" style={{ scrollbarGutter: 'stable', padding: '20px 24px 28px 24px' }}>
        {/* ── Gate card ───────────────────────────────────────────── */}
        {gate && <GateCard gate={gate} weekKey={weekKey} weekLabel={weekLabel} checkedTasks={checkedTasks} memberId={memberId} onToggleGateItem={toggleKey} />}

        {/* ── Member selected vs overall view ────────────────────── */}
        {member && memberData ? (
          <MemberView
            member={member}
            memberData={memberData}
            weekKey={weekKey}
            weekLabel={weekLabel}
            weekTitle={weekTitle}
            weekData={weekData}
            nextWeekData={nextWeekData}
            nextKey={nextKey}
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
            weekKey={weekKey}
            weekLabel={weekLabel}
            weekTitle={weekTitle}
            progress={progress}
            weekHighlights={weekHighlights}
            depFlow={depFlow}
            flowOpen={flowOpen}
            setFlowOpen={setFlowOpen}
            onPartClick={onPartClick}
          />
        )}

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════════ */

/* ── Gate card ─────────────────────────────────────────────────── */
function GateCard({ gate, weekKey, weekLabel, checkedTasks, memberId, onToggleGateItem }) {
  const completedGateItems = gate.items.filter((_, i) => {
    const key = memberId ? `gate_${weekKey}_${i}` : `gate_all_${weekKey}_${i}`;
    return !!checkedTasks[key];
  }).length;

  return (
    <div
      className="rounded-xl p-6 relative overflow-hidden bg-[rgba(200,255,0,0.03)] border border-[rgba(200,255,0,0.25)] shadow-[0_0_20px_rgba(200,255,0,0.06),inset_0_0_20px_rgba(200,255,0,0.02)]"
    >
      {/* Pulse accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-[linear-gradient(90deg,transparent,#c8ff00,transparent)] animate-[pulse-neon_2s_ease-in-out_infinite]"
      />
      <div className="flex items-center gap-4 mb-5">
        <span
          className="text-sm font-bold uppercase tracking-widest text-[#c8ff00]"
        >
          GATE
        </span>
        <span
          className="text-sm font-bold text-[#c8ff00]"
        >
          {gate.name}
        </span>
        <span className="text-sm text-[#9aa0b8] ml-auto">
          {weekLabel} 말
        </span>
      </div>
      <div className="space-y-3">
        {gate.items.map((item, i) => {
          const key = memberId ? `gate_${weekKey}_${i}` : `gate_all_${weekKey}_${i}`;
          const checked = !!checkedTasks[key];
          return (
            <label key={i} className="flex items-center gap-4 text-sm cursor-pointer hover:bg-[#c8ff0008] rounded px-1 -mx-1">
              <span
                onClick={() => onToggleGateItem?.(key)}
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-sm flex-shrink-0 cursor-pointer text-[#c8ff00] ${checked ? 'border-[#c8ff00] bg-[rgba(200,255,0,0.15)]' : 'border-[rgba(200,255,0,0.3)] bg-transparent'}`}
              >
                {checked ? '\u2713' : ''}
              </span>
              <span className={`${checked ? 'line-through text-[#9aa0b8]' : 'text-[#e0e8ff]'}`}>{item}</span>
            </label>
          );
        })}
      </div>
      {/* Progress text */}
      <div className="mt-3 text-sm text-[#9aa0b8]">
        체크리스트 진행: {completedGateItems}/{gate.items.length}
      </div>
    </div>
  );
}

/* ── Member selected view ──────────────────────────────────────── */
function MemberView({
  member,
  memberData,
  weekKey,
  weekLabel,
  weekTitle,
  weekData,
  nextWeekData,
  nextKey,
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
      {/* ── Member header card ── */}
      <div className="rounded-xl p-5" style={{ background: member.color + '08', border: `1px solid ${member.color}20` }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0"
            style={{ backgroundColor: member.color + '20', color: member.color, border: `2px solid ${member.color}50` }}
          >
            {member.name}
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide" style={{ color: member.color }}>
              {member.name}
            </div>
            <div className="text-sm text-[#8890aa]">
              {memberData.identity} · {memberData.track}
            </div>
          </div>
        </div>
      </div>

      {/* Current week title + focus */}
      {weekData && (
        <div>
          {/* ── Week header ── */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-5">
              <h3 className="text-xl font-bold tracking-wide" style={{ color: accentColor, textShadow: `0 0 20px ${accentColor}40` }}>
                {weekLabel}
              </h3>
              <span className="text-sm text-[#8890aa] font-mono">
                {completedCount}/{totalCount}
              </span>
            </div>
            <p className="text-base text-[#c0c8e0] mb-6">{weekTitle}</p>

            {/* Focus card */}
            <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${accentColor}0c, ${accentColor}04)`, border: `1px solid ${accentColor}30`, boxShadow: `0 0 30px ${accentColor}08` }}>
              <div className="text-xs text-[#9aa0b8] uppercase tracking-widest mb-6 font-mono">핵심 목표</div>
              <div className="text-lg font-bold leading-snug" style={{ color: accentColor, textShadow: `0 0 12px ${accentColor}30` }}>
                {weekData.focus}
              </div>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="mb-6">
            <div className="h-2.5 rounded-full bg-[#ffffff0a] border border-[#ffffff06] overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
                  boxShadow: `0 0 12px ${accentColor}60, 0 0 4px ${accentColor}`,
                }}
              />
            </div>
          </div>

          {/* ── Checklist ── */}
          <div className="text-xs text-[#9aa0b8] uppercase tracking-[0.2em] font-mono mb-5 pb-2 border-b border-[#ffffff08]">할 일</div>
          <div className="space-y-1.5">
            {weekData.tasks.map((task, i) => (
              <ExpandableTask
                key={i}
                task={task}
                weekKey={weekKey}
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
          className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
        >
          <div className="text-sm text-[#9aa0b8] mb-6">
            다음 주 미리보기 ({WEEK_LABELS[nextKey]})
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

const PART_ID_MAP = { arms: 'left_arm', legs: 'left_leg', integration: 'torso' };

/* ── Overall project view (no member) ──────────────────────────── */
function OverallView({
  weekKey,
  weekLabel,
  weekTitle,
  progress,
  weekHighlights,
  depFlow,
  flowOpen,
  setFlowOpen,
  onPartClick,
}) {
  return (
    <>
      {/* Project header */}
      <div style={{ marginBottom: 0 }}>
        <h2 className="text-2xl font-bold tracking-wider text-[#e0e8ff]" style={{ marginBottom: 4, textShadow: '0 0 20px rgba(224,232,255,0.15)' }}>
          전체 프로젝트
        </h2>
        <div className="text-base text-[#9aa0b8]">HYlion Physical AI · 발표 2026-06-01</div>
      </div>

      {/* Week title */}
      <div>
        <h3 className="text-xl font-bold tracking-wide text-[#00ff88]" style={{ marginBottom: 12, textShadow: '0 0 16px rgba(0,255,136,0.3)' }}>
          {weekLabel} — {weekTitle}
        </h3>

        {/* Overall progress */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-2.5 rounded-full bg-[#ffffff0a] border border-[#ffffff06] overflow-hidden">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#00ff88,#00f0ff)] shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-[width] duration-700"
              style={{
                width: `${progress.total}%`,
              }}
            />
          </div>
          <span
            className="text-sm font-bold w-10 text-right text-[#00ff88]"
          >
            {progress.total}%
          </span>
        </div>

        {/* Per-part progress bars */}
        <div className="space-y-3">
          {Object.entries(PART_META).map(([key, meta]) => {
            const val = progress[key];
            return (
              <button
                key={key}
                className="w-full flex items-center gap-4 group cursor-pointer hover:bg-[#ffffff04] rounded-md px-3 py-2.5 transition-colors"
                onClick={() => onPartClick?.(PART_ID_MAP[key] || key)}
              >
                <span className="text-base w-14 text-left text-[#8890aa]">
                  {meta.label}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#ffffff0a] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{
                      width: `${val}%`,
                      backgroundColor: meta.color,
                      boxShadow: `0 0 6px ${meta.color}40`,
                    }}
                  />
                </div>
                <span className="text-sm w-8 text-right text-[#9aa0b8]">
                  {val}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* This week highlights — by member */}
      {weekHighlights && (
        <div className="space-y-3">
          <h4
            className="text-sm uppercase tracking-widest text-[#9aa0b8]"
          >
            이번 주 멤버별 담당
          </h4>
          {weekHighlights.focus && (
            <div className="text-sm text-[#e0e8ff] leading-relaxed mb-2">
              {weekHighlights.focus}
            </div>
          )}
          {Object.entries(weekHighlights.members).map(([mid, mdata]) => {
            const teamMember = TEAM[mid];
            if (!teamMember || !mdata.items?.length) return null;
            return (
              <div key={mid} className="p-4 rounded-lg" style={{ background: teamMember.color + '08', border: `1px solid ${teamMember.color}20` }}>
                <div className="text-sm font-bold mb-2" style={{ color: teamMember.color }}>
                  {teamMember.name} {mdata.lead ? '(리드)' : ''}
                </div>
                <ul className="text-xs text-[#e0e8ff] leading-relaxed space-y-1">
                  {mdata.items.map((it, i) => <li key={i}>• {it}</li>)}
                </ul>
              </div>
            );
          })}
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
        className="text-sm uppercase tracking-widest mb-5 text-[#9aa0b8]"
      >
        작업 의존성
      </h4>

      {hasReceives && (
        <div className="mb-5">
          <div className="text-sm mb-6 text-[#ff8800]">
            {'\u2190'} 받는 것
          </div>
          {receives.map((dep, i) => (
            <ExpandableDep key={i} dep={dep} memberId={memberId} />
          ))}
        </div>
      )}

      {hasGives && (
        <div>
          <div className="text-sm mb-6 text-[#00ff88]">
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
      className="rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02]"
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[#ffffff04]"
        onClick={() => setFlowOpen((o) => !o)}
      >
        <span
          className="text-sm uppercase tracking-widest text-[#9aa0b8]"
        >
          의존성 흐름
        </span>
        <span
          className={`text-sm text-[#9aa0b8] transition-transform duration-200 ${flowOpen ? 'rotate-90' : 'rotate-0'}`}
        >
          {'\u25B6'}
        </span>
      </button>

      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300"
        style={{
          maxHeight: flowOpen ? 300 : 0,
          opacity: flowOpen ? 1 : 0,
        }}
      >
        <div className="px-3 pb-2.5 space-y-3.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <span
                className="text-sm uppercase tracking-wider flex-shrink-0 mt-1.5 px-2.5 py-1.5 rounded text-[#c8ff00] bg-[rgba(200,255,0,0.08)]"
              >
                {item.label}
              </span>
              <span className="text-sm text-[#e0e8ff] leading-relaxed">
                {item.text}
              </span>
            </div>
          ))}
          {items.length > 1 && (
            <div className="flex items-center gap-1 pt-1">
              {items.map((_, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#c8ff00]"
                  />
                  {i < items.length - 1 && (
                    <span
                      className="w-6 h-[1px] bg-[rgba(200,255,0,0.2)]"
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
