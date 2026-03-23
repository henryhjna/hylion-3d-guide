import React, { useState, useEffect, useCallback, useRef } from 'react';
import { startDrone, playWhoosh, playPing, playStartupChime, playReady, closeAudio } from '../hooks/useCinematicAudio';

/* ------------------------------------------------------------------ */
/*  Section definitions                                                */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  {
    id: 0,
    duration: 10000,
    cameraPreset: 'overview',
    title: 'HYLION PHYSICAL AI',
    subtitle: '10주 안에 만드는 쇼형 이족보행 로봇',
    effect: 'rotate',
  },
  {
    id: 1,
    duration: 5000,
    cameraPreset: 'head',
    title: '하이리온 캐릭터 머리',
    subtitle: '시선 추적, 감정 표현, 음성 대화',
    effect: 'led-blink',
  },
  {
    id: 2,
    duration: 5000,
    cameraPreset: 'arms',
    title: 'SO-ARM101 x2',
    subtitle: 'SmolVLA로 물체를 집고 전달',
    effect: null,
  },
  {
    id: 3,
    duration: 10000,
    cameraPreset: 'xray',
    title: 'Orin + NUC + 배터리',
    subtitle: '두뇌와 심장',
    effect: 'pulse',
  },
  {
    id: 4,
    duration: 10000,
    cameraPreset: 'legs',
    title: 'BHL 이족보행',
    subtitle: '10개 액추에이터, Walking RL',
    effect: null,
  },
  {
    id: 5,
    duration: 15000,
    cameraPreset: 'overview',
    title: '시나리오 데모',
    subtitle: null,
    effect: 'scenario',
  },
  {
    id: 6,
    duration: 5000,
    cameraPreset: 'overview',
    title: null,
    subtitle: null,
    effect: 'finish',
  },
];

const TOTAL_DURATION = SECTIONS.reduce((sum, s) => sum + s.duration, 0);

const TEAM_MEMBERS = [
  { id: 'delta1', label: '\u03B41' },
  { id: 'delta2', label: '\u03B42' },
  { id: 'delta3', label: '\u03B43' },
  { id: 'epsilon1', label: '\u03B51' },
  { id: 'epsilon2', label: '\u03B52' },
];

const SCENARIO_STEPS = [
  { icon: '\uD83D\uDC65', label: '관객 등장' },
  { icon: '\uD83D\uDCE1', label: '로봇 인식' },
  { icon: '\uD83D\uDEB6', label: '이동' },
  { icon: '\uD83E\uDD1A', label: '물체 집기' },
  { icon: '\uD83D\uDD04', label: '복귀' },
  { icon: '\uD83E\uDD1D', label: '전달' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OnboardingCinematic({ isActive, onComplete, onCameraPreset }) {
  const [currentSection, setCurrentSection] = useState(0);
  const [fade, setFade] = useState('in');            // 'in' | 'out'
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [showStart, setShowStart] = useState(false);
  const intervalRef = useRef(null);
  const sectionTimerRef = useRef(null);

  /* ---- auto-skip on revisit ---- */
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  useEffect(() => {
    if (isActive && localStorage.getItem('hylion_intro_seen') === 'true') {
      onCompleteRef.current?.();
    }
  }, [isActive]);

  /* ---- audio: start drone on mount, play sounds on section change ---- */
  const droneRef = useRef(null);
  useEffect(() => {
    if (!isActive) return;
    // Start background drone + startup chime
    try {
      droneRef.current = startDrone();
      playStartupChime();
    } catch {}
    return () => {
      droneRef.current?.stop(1);
      closeAudio();
    };
  }, [isActive]);

  /* ---- send camera preset + audio when section changes ---- */
  useEffect(() => {
    if (!isActive) return;
    const section = SECTIONS[currentSection];
    if (section) {
      onCameraPreset?.(section.cameraPreset);
      // Audio feedback per section
      try {
        if (currentSection > 0 && currentSection < SECTIONS.length - 1) {
          playWhoosh();
          setTimeout(() => playPing(800 + currentSection * 100), 200);
        }
        if (currentSection === SECTIONS.length - 1) {
          playReady();
        }
      } catch {}
    }
  }, [currentSection, isActive, onCameraPreset]);

  /* ---- master tick (60 fps-ish progress) ---- */
  useEffect(() => {
    if (!isActive) return;

    const TICK = 50; // ms
    intervalRef.current = setInterval(() => {
      setTotalElapsed((prev) => prev + TICK);
    }, TICK);

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  /* ---- auto-advance sections ---- */
  useEffect(() => {
    if (!isActive) return;
    const section = SECTIONS[currentSection];
    if (!section) return;

    setFade('in');

    sectionTimerRef.current = setTimeout(() => {
      if (currentSection < SECTIONS.length - 1) {
        setFade('out');
        setTimeout(() => {
          setCurrentSection((s) => s + 1);
        }, 400); // fade-out duration
      }
    }, section.duration);

    return () => clearTimeout(sectionTimerRef.current);
  }, [currentSection, isActive]);

  /* ---- scenario step animation ---- */
  useEffect(() => {
    if (!isActive || SECTIONS[currentSection]?.effect !== 'scenario') return;
    setScenarioStep(0);
    const stepDuration = 15000 / SCENARIO_STEPS.length;
    const timer = setInterval(() => {
      setScenarioStep((prev) => {
        if (prev >= SCENARIO_STEPS.length - 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);
    return () => clearInterval(timer);
  }, [currentSection, isActive]);

  /* ---- show start button on final section ---- */
  useEffect(() => {
    if (currentSection === 6) {
      const t = setTimeout(() => setShowStart(true), 800);
      return () => clearTimeout(t);
    }
    setShowStart(false);
  }, [currentSection]);

  /* ---- completion handler ---- */
  const handleComplete = useCallback(() => {
    localStorage.setItem('hylion_intro_seen', 'true');
    clearInterval(intervalRef.current);
    clearTimeout(sectionTimerRef.current);
    droneRef.current?.stop(0.5);
    onComplete?.();
  }, [onComplete]);

  /* ---- early exit ---- */
  if (!isActive) return null;

  const section = SECTIONS[currentSection];
  const progressPct = Math.min((totalElapsed / TOTAL_DURATION) * 100, 100);

  return (
    <div style={styles.overlay} className="hylion-cinematic">
      <style>{cssAnimations}</style>

      {/* ---- Skip button ---- */}
      <button
        style={styles.skipBtn}
        onClick={handleComplete}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,255,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
      >
        SKIP &raquo;
      </button>

      {/* ---- Content area ---- */}
      <div
        style={{
          ...styles.contentWrap,
          animation: fade === 'in' ? 'hylionFadeUp 0.8s ease-out forwards' : 'hylionFadeOut 0.4s ease-in forwards',
        }}
        key={currentSection}
      >
        {/* Section 0-4 : title + subtitle */}
        {section.title && section.effect !== 'scenario' && section.effect !== 'finish' && (
          <div style={styles.textBlock}>
            <h1 style={styles.title}>{section.title}</h1>
            {section.subtitle && <p style={styles.subtitle}>{section.subtitle}</p>}
          </div>
        )}

        {/* LED blink effect (section 1) */}
        {section.effect === 'led-blink' && (
          <div style={styles.ledRow}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="hylion-led" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}

        {/* Pulse effect (section 3) */}
        {section.effect === 'pulse' && (
          <div style={styles.pulseWrap}>
            <span className="hylion-pulse-ring" />
            <span className="hylion-pulse-ring" style={{ animationDelay: '0.6s' }} />
            <span className="hylion-pulse-core" />
          </div>
        )}

        {/* Scenario flow (section 5) */}
        {section.effect === 'scenario' && (
          <div style={styles.scenarioWrap}>
            <h2 style={styles.scenarioTitle}>{section.title}</h2>
            <div style={styles.scenarioTrack}>
              {SCENARIO_STEPS.map((step, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.scenarioNode,
                    opacity: i <= scenarioStep ? 1 : 0.25,
                    transform: i <= scenarioStep ? 'scale(1)' : 'scale(0.7)',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <span style={styles.scenarioIcon}>{step.icon}</span>
                  <span style={styles.scenarioLabel}>{step.label}</span>
                  {i < SCENARIO_STEPS.length - 1 && (
                    <span
                      style={{
                        ...styles.scenarioArrow,
                        color: i < scenarioStep ? '#0ff' : '#334',
                      }}
                    >
                      &#x2192;
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finish section (section 6) */}
        {section.effect === 'finish' && (
          <div style={styles.finishWrap}>
            <div style={styles.avatarRow}>
              {TEAM_MEMBERS.map((m) => (
                <div key={m.id} className="hylion-avatar" style={styles.avatar}>
                  <span style={styles.avatarLabel}>{m.label}</span>
                </div>
              ))}
            </div>
            {showStart && (
              <button
                style={styles.startBtn}
                className="hylion-start-btn"
                onClick={handleComplete}
              >
                시작하기
              </button>
            )}
          </div>
        )}
      </div>

      {/* ---- Progress bar ---- */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${progressPct}%` }} />
      </div>

      {/* ---- Progress dots ---- */}
      <div style={styles.dotsRow}>
        {SECTIONS.map((s, i) => (
          <span
            key={i}
            style={{
              ...styles.dot,
              background: i === currentSection ? '#0ff' : i < currentSection ? '#ff00ff' : '#335',
              boxShadow: i === currentSection ? '0 0 8px #0ff, 0 0 16px #0ff' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CSS keyframes (injected via <style>)                               */
/* ------------------------------------------------------------------ */

const cssAnimations = `
/* Orbitron font already loaded via globals.css */

@keyframes hylionFadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hylionFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-20px); }
}
@keyframes hylionLedBlink {
  0%, 100% { opacity: 0.2; box-shadow: 0 0 4px #0ff; }
  50%      { opacity: 1;   box-shadow: 0 0 18px #0ff, 0 0 36px #0ff; }
}
@keyframes hylionPulseRing {
  0%   { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes hylionPulseCore {
  0%, 100% { transform: scale(1);   box-shadow: 0 0 20px #ff00ff; }
  50%      { transform: scale(1.3); box-shadow: 0 0 40px #ff00ff, 0 0 80px #ff00ff; }
}
@keyframes hylionGlow {
  0%, 100% { text-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #00aaff; }
  50%      { text-shadow: 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #00aaff, 0 0 120px #0ff; }
}
@keyframes hylionStartPulse {
  0%, 100% { box-shadow: 0 0 15px #0ff, 0 0 30px rgba(0,255,255,0.3); }
  50%      { box-shadow: 0 0 25px #0ff, 0 0 50px rgba(0,255,255,0.5), 0 0 80px rgba(0,255,255,0.2); }
}
@keyframes hylionAvatarFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.hylion-led {
  display: inline-block;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #0ff;
  margin: 0 10px;
  animation: hylionLedBlink 0.6s ease-in-out infinite;
}
.hylion-pulse-ring {
  position: absolute;
  width: 80px; height: 80px;
  border: 2px solid #ff00ff;
  border-radius: 50%;
  animation: hylionPulseRing 1.5s ease-out infinite;
}
.hylion-pulse-core {
  position: absolute;
  width: 24px; height: 24px;
  background: #ff00ff;
  border-radius: 50%;
  animation: hylionPulseCore 1.5s ease-in-out infinite;
}
.hylion-avatar {
  animation: hylionAvatarFloat 2s ease-in-out infinite;
}
.hylion-avatar:nth-child(2) { animation-delay: 0.3s; }
.hylion-avatar:nth-child(3) { animation-delay: 0.6s; }
.hylion-avatar:nth-child(4) { animation-delay: 0.9s; }
.hylion-avatar:nth-child(5) { animation-delay: 1.2s; }
.hylion-start-btn {
  animation: hylionFadeUp 0.6s ease-out forwards, hylionStartPulse 2s ease-in-out infinite 0.6s;
}
`;

/* ------------------------------------------------------------------ */
/*  Inline styles                                                      */
/* ------------------------------------------------------------------ */

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'radial-gradient(ellipse at center, rgba(10,0,30,0.85) 0%, rgba(0,0,0,0.95) 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Orbitron', sans-serif",
    overflow: 'hidden',
  },

  /* Skip */
  skipBtn: {
    position: 'absolute',
    top: 24,
    right: 28,
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(0,255,255,0.35)',
    color: '#0ff',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 13,
    padding: '8px 20px',
    cursor: 'pointer',
    letterSpacing: 2,
    borderRadius: 4,
    transition: 'background 0.2s',
    zIndex: 10,
  },

  /* Content */
  contentWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: 800,
    padding: '0 32px',
  },

  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },

  title: {
    fontSize: 'clamp(28px, 5vw, 56px)',
    fontWeight: 900,
    color: '#0ff',
    margin: 0,
    letterSpacing: 4,
    animation: 'hylionGlow 3s ease-in-out infinite',
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: 'clamp(14px, 2.5vw, 22px)',
    fontWeight: 400,
    color: '#ff00ff',
    margin: 0,
    letterSpacing: 1,
    textShadow: '0 0 10px rgba(255,0,255,0.6)',
    lineHeight: 1.6,
  },

  /* LED */
  ledRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 32,
  },

  /* Pulse */
  pulseWrap: {
    position: 'relative',
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },

  /* Scenario */
  scenarioWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  },

  scenarioTitle: {
    fontSize: 'clamp(20px, 3vw, 32px)',
    fontWeight: 700,
    color: '#0ff',
    margin: 0,
    letterSpacing: 3,
    animation: 'hylionGlow 3s ease-in-out infinite',
  },

  scenarioTrack: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  scenarioNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },

  scenarioIcon: {
    fontSize: 36,
    display: 'block',
  },

  scenarioLabel: {
    fontSize: 12,
    color: '#0ff',
    letterSpacing: 1,
    whiteSpace: 'nowrap',
  },

  scenarioArrow: {
    position: 'absolute',
    right: -24,
    top: 14,
    fontSize: 22,
    fontWeight: 700,
    transition: 'color 0.5s',
  },

  /* Finish */
  finishWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
  },

  avatarRow: {
    display: 'flex',
    gap: 20,
    justifyContent: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ff 0%, #ff00ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 16px rgba(0,255,255,0.4)',
  },

  avatarLabel: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0a0020',
    fontFamily: "'Orbitron', sans-serif",
  },

  startBtn: {
    background: 'transparent',
    border: '2px solid #0ff',
    color: '#0ff',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 'clamp(16px, 2.5vw, 24px)',
    fontWeight: 700,
    padding: '16px 48px',
    cursor: 'pointer',
    letterSpacing: 4,
    borderRadius: 8,
    transition: 'background 0.3s, color 0.3s',
  },

  /* Progress bar */
  progressBarOuter: {
    position: 'absolute',
    bottom: 48,
    left: '10%',
    width: '80%',
    height: 3,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
  },

  progressBarInner: {
    height: '100%',
    background: 'linear-gradient(90deg, #0ff 0%, #ff00ff 100%)',
    borderRadius: 2,
    transition: 'width 0.15s linear',
    boxShadow: '0 0 8px #0ff',
  },

  /* Dots */
  dotsRow: {
    position: 'absolute',
    bottom: 24,
    display: 'flex',
    gap: 12,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
};
