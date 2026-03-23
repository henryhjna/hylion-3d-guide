const TOGGLE_DEFS = [
  {
    key: 'xray',
    label: '\uD83D\uDC41 \uB0B4\uBD80',
    propActive: 'xrayMode',
    propToggle: 'onToggleXray',
    colorOn: '#00f0ff',
  },
  {
    key: 'scenario',
    label: '\uD83C\uDFAC \uC2DC\uB098',
    propActive: 'scenarioMode',
    propToggle: 'onToggleScenario',
    colorOn: '#ff00ff',
  },
];

export default function ExploreToggles({
  xrayMode,
  scenarioMode,
  onToggleXray,
  onToggleScenario,
}) {
  const states = { xrayMode, scenarioMode };
  const handlers = { onToggleXray, onToggleScenario };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 15,
        display: 'flex',
        gap: 8,
        background: 'rgba(10, 12, 20, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 28,
        padding: '6px 8px',
      }}
    >
      {TOGGLE_DEFS.map((def) => {
        const isOn = states[def.propActive];
        const color = def.colorOn;

        return (
          <button
            key={def.key}
            onClick={handlers[def.propToggle]}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: 20,
              border: `1.5px solid ${isOn ? color : 'rgba(255,255,255,0.15)'}`,
              background: isOn ? `${color}18` : 'transparent',
              color: isOn ? color : '#666',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isOn ? `0 0 12px ${color}55, inset 0 0 8px ${color}22` : 'none',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isOn) {
                e.currentTarget.style.borderColor = `${color}88`;
                e.currentTarget.style.color = `${color}bb`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isOn) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#666';
              }
            }}
          >
            {/* Status dot */}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isOn ? color : '#444',
                boxShadow: isOn ? `0 0 6px ${color}` : 'none',
                transition: 'all 0.2s ease',
              }}
            />
            {def.label}
          </button>
        );
      })}
    </div>
  );
}
