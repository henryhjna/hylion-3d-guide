import { TEAM } from '../data/team';
import WeekSelector from './WeekSelector';

export default function Navigation({
  mode,
  onModeChange,
  selectedWeek,
  weekTitle,
  onWeekChange,
  selectedMember,
  onMemberChange,
  onOpenSearch,
  onOpenDocs,
  onOpenSettings,
}) {
  return (
    <nav className="absolute top-0 left-0 right-0 h-16 z-50 glass-panel rounded-none border-t-0 border-x-0 flex items-center justify-between px-6">
      {/* Left: Logo + Mode tabs */}
      <div className="flex items-center gap-4">
        <h1 className="text-base font-bold tracking-widest glow-cyan" style={{ fontFamily: 'Orbitron', color: '#00f0ff' }}>
          HYlion
        </h1>

        <div className="flex items-center gap-1 bg-[#ffffff06] rounded-lg p-0.5">
          <button
            onClick={() => onModeChange('work')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'work'
                ? 'bg-[#00f0ff12] text-[#00f0ff] shadow-sm'
                : 'text-[#6a7090] hover:text-[#e0e8ff]'
            }`}
            style={{ fontFamily: 'Orbitron' }}
          >
            📋 작업
          </button>
          <button
            onClick={() => onModeChange('explore')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === 'explore'
                ? 'bg-[#00f0ff12] text-[#00f0ff] shadow-sm'
                : 'text-[#6a7090] hover:text-[#e0e8ff]'
            }`}
            style={{ fontFamily: 'Orbitron' }}
          >
            🤖 탐색
          </button>
        </div>
      </div>

      {/* Center: Week badge */}
      <WeekSelector
        currentWeek={selectedWeek}
        weekTitle={weekTitle}
        onWeekChange={onWeekChange}
      />

      {/* Right: Member select + Tools */}
      <div className="flex items-center gap-2">
        {/* Member buttons */}
        <div className="flex items-center gap-2">
          {/* "All" button */}
          <button
            onClick={() => onMemberChange(null)}
            className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all flex items-center justify-center ${
              !selectedMember ? 'outline outline-2 outline-[#e0e8ff]' : 'opacity-40 hover:opacity-70'
            }`}
            style={{ backgroundColor: '#ffffff10', color: '#e0e8ff' }}
            title="전체 보기"
          >
            All
          </button>
          {Object.values(TEAM).map(member => (
            <button
              key={member.id}
              onClick={() => onMemberChange(selectedMember === member.id ? null : member.id)}
              className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all flex items-center justify-center ${
                selectedMember === member.id ? 'outline outline-2' : 'opacity-40 hover:opacity-70'
              }`}
              style={{
                color: member.color,
                backgroundColor: member.color + '15',
                outlineColor: selectedMember === member.id ? member.color : 'transparent',
              }}
              title={`${member.name} — ${member.role}`}
            >
              {member.name}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[#ffffff10] mx-1" />

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff08] transition-all"
          title="문서 검색 (Ctrl+K)"
        >
          🔍
          <kbd className="text-[8px] bg-[#ffffff08] px-1 py-0.5 rounded border border-[#ffffff10]">⌘K</kbd>
        </button>

        {/* Docs */}
        <button
          onClick={onOpenDocs}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff08] transition-all text-xs"
          title="문서 리더 (Ctrl+B)"
        >
          📖
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] hover:bg-[#ffffff08] transition-all text-xs"
          title="설정"
        >
          ⚙️
        </button>
      </div>
    </nav>
  );
}
