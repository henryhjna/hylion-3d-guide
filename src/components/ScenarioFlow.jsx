import { useState, useEffect, useRef } from 'react';

const STEPS = [
  {
    id: 1,
    title: '관객 다가옴',
    description: '시선 추적 (MediaPipe → 목 PID)',
    state: 'IDLE',
    color: '#4466ff',
    systems: ['MediaPipe', '목 XL430 PID'],
    activeParts: ['head'],
    robotPos: 50,
  },
  {
    id: 2,
    title: '인사',
    description: '"안녕하세요" TTS + 손 흔들기 + 감정 happy + LED + 입 서보',
    state: 'TALKING',
    color: '#00f0ff',
    systems: ['Groq TTS', 'LED', 'MG90S 입', 'Precoded 팔'],
    activeParts: ['head', 'left_arm', 'right_arm'],
    robotPos: 50,
  },
  {
    id: 3,
    title: 'FETCH — ① 테이블로 이동',
    description: 'WALKING: 테이블 방향 전진 (타이머 T1초)',
    state: 'WALKING',
    color: '#ff00aa',
    systems: ['Walking RL', 'NUC CAN', 'ESP32 낙상감지'],
    activeParts: ['left_leg', 'right_leg'],
    robotPos: 75,
  },
  {
    id: 4,
    title: 'FETCH — ② 물체 집기',
    description: '정지 → SmolVLA pick (TensorRT)',
    state: 'MANIPULATING',
    color: '#c8ff00',
    systems: ['SmolVLA TensorRT', 'Orin GPU', 'U2D2'],
    activeParts: ['left_arm', 'right_arm', 'torso'],
    robotPos: 85,
  },
  {
    id: 5,
    title: 'FETCH — ③ 홈으로 복귀',
    description: '180° 회전 + 홈 방향 전진 (타이머 T2초)',
    state: 'WALKING',
    color: '#ff00aa',
    systems: ['Walking RL', 'NUC CAN'],
    activeParts: ['left_leg', 'right_leg'],
    robotPos: 50,
  },
  {
    id: 6,
    title: 'FETCH — ④ 전달',
    description: '정지 → 팔 뻗기 (precoded handover)',
    state: 'MANIPULATING',
    color: '#c8ff00',
    systems: ['Precoded 팔', 'U2D2'],
    activeParts: ['left_arm', 'right_arm'],
    robotPos: 50,
  },
  {
    id: 7,
    title: '자유 보행',
    description: '보행 + precoded 팔 스윙 + 대화 가능',
    state: 'WALKING',
    color: '#ff00aa',
    systems: ['Walking RL', 'Groq 대화', 'Precoded 팔'],
    activeParts: ['left_leg', 'right_leg', 'left_arm', 'right_arm'],
    robotPos: 35,
  },
];

const LEVELS = [
  { level: 'A', label: '풀', desc: '걸어가서 집고 돌아와서 전달', color: '#00ff88', steps: [1,2,3,4,5,6,7] },
  { level: 'B', label: '보행 없이', desc: '제자리 pick-place + 별도 보행 시연', color: '#c8ff00', steps: [1,2,4,6] },
  { level: 'C', label: '받침대', desc: '받침대 고정 + pick-place', color: '#ff8800', steps: [1,2,4,6] },
];

export default function ScenarioFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const currentLevel = LEVELS.find(l => l.level === selectedLevel);
  const visibleSteps = STEPS.filter(s => currentLevel.steps.includes(s.id));

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= visibleSteps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, visibleSteps.length]);

  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(false);
  }, [selectedLevel]);

  const currentStep = visibleSteps[activeStep] || visibleSteps[0];

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* 3D Layout visualization */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-full max-w-[700px] px-8">
          {/* Layout bar */}
          <div className="relative h-32 flex items-center">
            {/* Floor line */}
            <div className="absolute left-0 right-0 bottom-8 h-px bg-[#ffffff15]" />

            {/* Audience */}
            <div className="absolute left-[5%] bottom-4 text-center" style={{ transition: 'all 0.8s ease' }}>
              <div className="w-12 h-12 rounded-lg bg-[#4466ff15] border border-[#4466ff30] flex items-center justify-center text-xl mx-auto">
                👤
              </div>
              <div className="text-xs text-[#6a7090] mt-1">관객</div>
            </div>

            {/* Distance markers */}
            <div className="absolute left-[20%] bottom-2 text-sm text-[#6a7090]">←~1.5m→</div>
            <div className="absolute left-[65%] bottom-2 text-sm text-[#6a7090]">←~1.5m→</div>

            {/* Robot */}
            <div
              className="absolute bottom-4 text-center transition-all duration-1000 ease-in-out"
              style={{ left: `${currentStep?.robotPos || 50}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl mx-auto border-2 transition-all duration-500"
                style={{
                  backgroundColor: currentStep?.color + '15',
                  borderColor: currentStep?.color + '60',
                  boxShadow: `0 0 20px ${currentStep?.color}30`,
                }}
              >
                🤖
              </div>
              <div className="text-xs mt-1 font-bold" style={{ color: currentStep?.color, fontFamily: 'Orbitron' }}>
                {currentStep?.state}
              </div>
              {selectedLevel === 'C' && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-sm text-[#ff8800]">
                  [받침대]
                </div>
              )}
            </div>

            {/* Home marker */}
            <div className="absolute left-[50%] -translate-x-1/2 bottom-0 text-sm text-[#6a7090]">
              ▲ 홈
            </div>

            {/* Table */}
            <div className="absolute right-[5%] bottom-4 text-center">
              <div className="w-16 h-10 rounded-lg bg-[#c8ff0015] border border-[#c8ff0030] flex items-center justify-center gap-1 mx-auto">
                <span className="text-xs">☕</span>
                <span className="text-xs">🥤</span>
                <span className="text-xs">🧸</span>
              </div>
              <div className="text-xs text-[#6a7090] mt-1">물체 테이블</div>
            </div>
          </div>

          {/* Active parts indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs text-[#6a7090]">활성 파트:</span>
            {currentStep?.activeParts?.map(p => (
              <span
                key={p}
                className="tag text-sm"
                style={{
                  backgroundColor: (p.includes('leg') ? '#ff00aa' : '#00f0ff') + '15',
                  color: p.includes('leg') ? '#ff00aa' : '#00f0ff',
                  border: `1px solid ${p.includes('leg') ? '#ff00aa' : '#00f0ff'}30`,
                }}
              >
                {p.replaceAll('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Control panel */}
      <div className="glass-panel border-x-0 border-b-0 rounded-none p-4">
        {/* Level selector */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ fontFamily: 'Orbitron', color: '#ff8800' }}>
              시나리오 레벨
            </span>
            <div className="flex gap-1">
              {LEVELS.map(lvl => (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevel(lvl.level)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all border ${
                    selectedLevel === lvl.level ? '' : 'opacity-40 hover:opacity-70'
                  }`}
                  style={{
                    color: lvl.color,
                    borderColor: selectedLevel === lvl.level ? lvl.color + '60' : 'transparent',
                    backgroundColor: selectedLevel === lvl.level ? lvl.color + '15' : 'transparent',
                  }}
                >
                  {lvl.level}: {lvl.label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all border"
            style={{
              color: isPlaying ? '#ff0044' : '#00ff88',
              borderColor: isPlaying ? '#ff004440' : '#00ff8840',
              backgroundColor: isPlaying ? '#ff004410' : '#00ff8810',
            }}
          >
            {isPlaying ? '■ 정지' : '▶ 재생'}
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1">
          {visibleSteps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              className={`flex-1 p-2 rounded-lg transition-all border text-left ${
                activeStep === i ? '' : 'opacity-40 hover:opacity-70'
              }`}
              style={{
                backgroundColor: activeStep === i ? step.color + '10' : 'transparent',
                borderColor: activeStep === i ? step.color + '40' : '#ffffff08',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: step.color + '20', color: step.color }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-bold truncate" style={{ color: step.color }}>
                  {step.title}
                </span>
              </div>
              {activeStep === i && (
                <>
                  <p className="text-xs text-[#e0e8ff] ml-5 mb-1">{step.description}</p>
                  <div className="flex flex-wrap gap-0.5 ml-5">
                    {step.systems.map((sys, j) => (
                      <span key={j} className="text-xs px-1 py-0.5 rounded bg-[#ffffff08] text-[#6a7090]">
                        {sys}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
