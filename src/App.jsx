import { useState, useCallback, useEffect, useMemo, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Scene3D from './components/Scene3D';
import DashboardPanel from './components/DashboardPanel';
import FloatingPartCard from './components/FloatingPartCard';
import PartInfoPanel from './components/PartInfoPanel';
import ArchitectureView from './components/ArchitectureView';
import ScenarioFlow from './components/ScenarioFlow';
import ExploreToggles from './components/ExploreToggles';
import DocsSearch from './components/DocsSearch';
import DocsReader from './components/DocsReader';
import AICopilot from './components/AICopilot';
import SettingsModal from './components/SettingsModal';
import DataBackup from './components/DataBackup';
import Loading3D from './components/Loading3D';
import { useDocsSearch } from './hooks/useDocsSearch';
import { useAICopilot } from './hooks/useAICopilot';
import { MEMBERS } from './data/members';
import { TIMELINE } from './data/timeline';

const TechTree = lazy(() => import('./components/TechTree'));
const OnboardingCinematic = lazy(() => import('./components/OnboardingCinematic'));

const MODES = { WORK: 'work', EXPLORE: 'explore' };

function getCurrentWeek() {
  const projectStart = new Date('2026-03-23');
  const now = new Date();
  const diffDays = Math.floor((now - projectStart) / (1000 * 60 * 60 * 24));
  return Math.max(0, Math.min(10, Math.floor(diffDays / 7)));
}

export default function App() {
  // Core state
  const [mode, setMode] = useState(MODES.WORK);
  const [selectedWeek, setSelectedWeek] = useState(() => getCurrentWeek());
  const [selectedMember, setSelectedMember] = useState(() => localStorage.getItem('hylion_member') || null);
  const [selectedPart, setSelectedPart] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [floatingCard, setFloatingCard] = useState(null); // { partId, x, y }

  // Explore mode toggles
  const [xrayMode, setXrayMode] = useState(false);
  const [scenarioMode, setScenarioMode] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);

  // Dashboard
  const [dashCollapsed, setDashCollapsed] = useState(false);

  // Modals/overlays
  const [showDocsSearch, setShowDocsSearch] = useState(false);
  const [showDocsReader, setShowDocsReader] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTechTree, setShowTechTree] = useState(false);
  const [copilotPrefill, setCopilotPrefill] = useState('');
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('hylion_intro_seen'));

  // Docs + copilot hooks
  const { rawDocs, search: docsSearch, getRelatedParts } = useDocsSearch();
  const copilot = useAICopilot({
    rawDocs,
    currentWeek: selectedWeek,
    currentView: mode,
    selectedPart: mode === MODES.EXPLORE ? selectedPart : null,
    selectedMember,
  });

  // Auto-dismiss 3D loading after reasonable timeout
  useEffect(() => {
    const timer = setTimeout(() => setModelLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Persist member selection
  useEffect(() => {
    if (selectedMember) localStorage.setItem('hylion_member', selectedMember);
    else localStorage.removeItem('hylion_member');
  }, [selectedMember]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'k') { e.preventDefault(); setShowDocsSearch(s => !s); }
      if (mod && e.key === 'b') { e.preventDefault(); setShowDocsReader(s => !s); }
      if (mod && e.key === 't') { e.preventDefault(); setShowTechTree(s => !s); }
      if (mod && e.key === '1') { e.preventDefault(); setMode(MODES.WORK); }
      if (mod && e.key === '2') { e.preventDefault(); setMode(MODES.EXPLORE); }
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) { setDashCollapsed(c => !c); }
      if (e.key === 'Escape') {
        if (showDocsSearch) setShowDocsSearch(false);
        else if (showTechTree) setShowTechTree(false);
        else if (showDocsReader) setShowDocsReader(false);
        else if (showSettings) setShowSettings(false);
        else if (floatingCard) setFloatingCard(null);
        else if (selectedPart && mode === MODES.EXPLORE) setSelectedPart(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showDocsSearch, showTechTree, showDocsReader, showSettings, floatingCard, selectedPart, mode]);

  // Derived data
  const memberData = useMemo(() => {
    if (!selectedMember || !MEMBERS) return null;
    return MEMBERS[selectedMember] || null;
  }, [selectedMember]);

  const weekData = useMemo(() => {
    return TIMELINE.find(w => w.week === selectedWeek);
  }, [selectedWeek]);

  const weekTitle = weekData?.title || '';

  // Handlers
  const handlePartClick = useCallback((partId, event) => {
    if (mode === MODES.WORK) {
      // Floating card in work mode — R3F event has nativeEvent with clientX/Y
      const native = event?.nativeEvent || event;
      const x = native?.clientX ?? window.innerWidth / 2;
      const y = native?.clientY ?? window.innerHeight / 2;
      setFloatingCard({ partId, x, y });
    } else {
      // Full detail in explore mode
      setSelectedPart(partId);
    }
  }, [mode]);

  const handlePartHover = useCallback((partId) => {
    setHoveredPart(partId);
  }, []);

  const handleExploreFromCard = useCallback((partId) => {
    setFloatingCard(null);
    setMode(MODES.EXPLORE);
    setSelectedPart(partId);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedPart(null);
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setSelectedPart(null);
    setFloatingCard(null);
    if (newMode === MODES.WORK) {
      setXrayMode(false);
      setScenarioMode(false);
    }
  }, []);

  const handleSearchResult = useCallback((entry) => {
    const parts = getRelatedParts(entry);
    if (parts.length > 0) {
      setMode(MODES.EXPLORE);
      setSelectedPart(parts[0]);
    }
  }, [getRelatedParts]);

  const handleAskCopilotFromDocs = useCallback((entry) => {
    setShowDocsSearch(false);
    setShowDocsReader(false);
    setCopilotPrefill(`[${entry.fileName} ${entry.sectionTitle}] 에 대해 질문: `);
  }, []);

  // 3D background click
  const handleBackgroundClick = useCallback(() => {
    if (mode === MODES.WORK) {
      setFloatingCard(null);
    } else {
      setSelectedPart(null);
    }
  }, [mode]);

  const isWorkMode = mode === MODES.WORK;
  const isExploreMode = mode === MODES.EXPLORE;

  return (
    <div className="relative w-full h-screen overflow-hidden grid-bg">
      {/* ── Top bar ── */}
      <Navigation
        mode={mode}
        onModeChange={handleModeChange}
        selectedWeek={selectedWeek}
        weekTitle={weekTitle}
        onWeekChange={setSelectedWeek}
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
        onOpenSearch={() => setShowDocsSearch(true)}
        onOpenDocs={() => setShowDocsReader(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* ── Main area (below top bar, full height) ── */}
      <div className="absolute top-16 left-0 right-0 bottom-0">

        {/* 3D Scene — ALWAYS rendered as background (z-0) */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            left: isWorkMode && !dashCollapsed ? '420px' : isWorkMode && dashCollapsed ? '48px' : '0',
            right: isExploreMode && selectedPart ? '380px' : '0',
          }}
        >
          <Scene3D
            selectedPart={isExploreMode ? selectedPart : null}
            hoveredPart={hoveredPart}
            onPartClick={handlePartClick}
            onPartHover={handlePartHover}
            onBackground={handleBackgroundClick}
            xrayMode={xrayMode}
            selectedWeek={selectedWeek}
            teamFilter={selectedMember}
            trackFilter={null}
          />
          {/* 3D loading overlay */}
          <Loading3D isLoading={modelLoading} />
        </div>

        {/* ── WORK MODE: Left dashboard (z-10) ── */}
        {isWorkMode && (
          <DashboardPanel
            memberId={selectedMember}
            memberData={memberData}
            currentWeek={selectedWeek}
            weekTitle={weekTitle}
            isCollapsed={dashCollapsed}
            onToggleCollapse={() => setDashCollapsed(c => !c)}
            onOpenTechTree={() => setShowTechTree(true)}
            onPartClick={(partId) => handleExploreFromCard(partId)}
          />
        )}

        {/* ── WORK MODE: Floating part card (z-15) ── */}
        {isWorkMode && floatingCard && (
          <FloatingPartCard
            partId={floatingCard.partId}
            position={{ x: floatingCard.x, y: floatingCard.y }}
            onClose={() => setFloatingCard(null)}
            onExplore={handleExploreFromCard}
          />
        )}

        {/* ── EXPLORE MODE: Right panel (z-10) ── */}
        {isExploreMode && selectedPart && (
          <div className="absolute top-0 right-0 w-[380px] h-full z-10 slide-in-right">
            <PartInfoPanel partId={selectedPart} onClose={handleBack} />
          </div>
        )}

        {/* ── EXPLORE MODE: Floating toggles (z-15) ── */}
        {isExploreMode && (
          <ExploreToggles
            xrayMode={xrayMode}
            scenarioMode={scenarioMode}
            onToggleXray={() => setXrayMode(x => !x)}
            onToggleScenario={() => setScenarioMode(s => !s)}
          />
        )}

        {/* ── EXPLORE MODE: Architecture overlay (when xray ON) ── */}
        {isExploreMode && xrayMode && <ArchitectureView />}

        {/* ── EXPLORE MODE: Scenario overlay (when scenario ON) ── */}
        {isExploreMode && scenarioMode && (
          <div className="absolute bottom-0 left-0 right-0 h-[45%] z-10">
            <ScenarioFlow />
          </div>
        )}
      </div>

      {/* ── Overlays — mode independent ── */}

      {/* AI Copilot (z-30, always available) */}
      <AICopilot
        messages={copilot.messages}
        isLoading={copilot.isLoading}
        error={copilot.error}
        onSend={copilot.sendMessage}
        onClear={copilot.clearMessages}
        hasApiKey={copilot.hasApiKey}
        onOpenSettings={() => setShowSettings(true)}
        prefill={copilotPrefill}
      />

      {/* Docs search modal (z-40) */}
      <DocsSearch
        isOpen={showDocsSearch}
        onClose={() => setShowDocsSearch(false)}
        onSearch={docsSearch}
        onSelectResult={handleSearchResult}
        onAskCopilot={handleAskCopilotFromDocs}
      />

      {/* TechTree fullscreen modal (z-40) */}
      {showTechTree && (
        <div className="fixed inset-0 z-40" onClick={() => setShowTechTree(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute inset-4" style={{ zIndex: 41 }} onClick={e => e.stopPropagation()}>
            <div className="relative w-full h-full glass-panel overflow-hidden">
              <button
                onClick={() => setShowTechTree(false)}
                className="absolute top-3 right-3 z-50 w-8 h-8 rounded-lg bg-[#ffffff10] hover:bg-[#ffffff20] flex items-center justify-center text-[#6a7090] hover:text-[#e0e8ff] text-sm"
              >
                ✕
              </button>
              <Suspense fallback={<div className="flex items-center justify-center h-full text-[#6a7090]">테크트리 로딩 중...</div>}>
                <TechTree
                  teamFilter={selectedMember}
                  trackFilter={null}
                  selectedWeek={selectedWeek}
                  onNodeClick={() => {}}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Docs reader modal (z-50) */}
      <DocsReader
        isOpen={showDocsReader}
        onClose={() => setShowDocsReader(false)}
        onAskCopilot={handleAskCopilotFromDocs}
      />

      {/* Settings modal (z-50) */}
      <SettingsModal isOpen={showSettings} onClose={() => { setShowSettings(false); copilot.refreshApiKey(); }} />

      {/* Onboarding cinematic (z-[100]) */}
      {showIntro && (
        <Suspense fallback={null}>
          <OnboardingCinematic
            isActive={showIntro}
            onComplete={() => { setShowIntro(false); localStorage.setItem('hylion_intro_seen', 'true'); }}
            onCameraPreset={() => {}}
          />
        </Suspense>
      )}
    </div>
  );
}
