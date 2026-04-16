export const COMPUTING_NODES = [
  {
    id: 'dgx',
    label: 'DGX Spark',
    subtitle: '원격, 학습 전용',
    color: '#c8ff00',
    position: { x: -200, y: 50 },
    tasks: [
      'SmolVLA 파인튜닝 (낮 슬롯)',
      'Walking RL 학습 (밤 슬롯)',
    ],
    scheduling: '낮: SmolVLA / 밤: Walking RL — 동시 실행 불가, 슬롯 분리',
    connections: ['orin', 'nuc'],
  },
  {
    id: 'orin',
    label: 'Orin Nano Super',
    subtitle: '토르소 내부, 메인 브레인',
    color: '#00f0ff',
    position: { x: 0, y: 0 },
    tasks: [
      'STT (Whisper, local) — 음성→텍스트',
      'Cloud LLM API (Gemini Flash / GPT-4o mini, WiFi) — 응답+명령 분류',
      'Local LLM fallback (Qwen 2.5 0.5B Q4, Ollama) — WiFi 끊김 시',
      'Piper TTS (local) — 텍스트→음성',
      '명령 매핑 (YAML/JSON 테이블) — 다리 명령 → vx vy wz',
      'SmolVLA 450M (LeRobot, PyTorch, TensorRT, GPU) — 카메라+텍스트→관절 액션',
      'MediaPipe 시선 추적 (CPU)',
      'LED + 입 서보 (Jetson.GPIO PWM)',
      'USB Hub A(센서) + Hub B(제어) 경유 전 장치',
    ],
    connections: ['nuc'],
  },
  {
    id: 'nuc',
    label: 'NUC BeeLink N95',
    subtitle: '토르소 내부, 보행 전용',
    color: '#4466ff',
    position: { x: 200, y: 0 },
    tasks: [
      'Walking RL policy (ONNX Runtime C API, MLP, 250Hz, Isaac Gym 모델)',
      'SocketCAN → USB-CAN ×2 → CAN 버스 2개, ESC 12개',
      'BNO085 IMU (Arduino USB Serial 경유)',
      'UDP Server — Orin에서 vx vy wz 수신 (udp_joystick.py 호환)',
    ],
    connections: ['orin'],
  },
];

export const STATE_RESOURCES = {
  IDLE: {
    label: 'IDLE',
    color: '#4466ff',
    orin_gpu: '비어있음',
    orin_cpu: 'MediaPipe 10fps',
    nuc: '대기',
    network: '없음',
  },
  TALKING: {
    label: 'TALKING',
    color: '#00f0ff',
    orin_gpu: '없음',
    orin_cpu: 'STT(Whisper)+Piper TTS+LED',
    nuc: '대기',
    network: '클라우드 LLM (Gemini Flash / GPT-4o mini)',
  },
  MANIPULATING: {
    label: 'MANIPULATING',
    color: '#c8ff00',
    orin_gpu: 'SmolVLA TensorRT',
    orin_cpu: 'MediaPipe 2~3fps',
    nuc: '대기',
    network: 'LLM 대기',
  },
  WALKING: {
    label: 'WALKING',
    color: '#ff00aa',
    orin_gpu: '없음',
    orin_cpu: 'MediaPipe+LED',
    nuc: 'Walking policy+CAN',
    network: '대화 시 STT+LLM',
  },
  FETCH: {
    label: 'FETCH',
    color: '#ff8800',
    orin_gpu: 'SmolVLA (전환)',
    orin_cpu: '상태 머신+시퀀서',
    nuc: 'Walking (전환)',
    network: '클라우드 API',
  },
  LOW_BATTERY: {
    label: 'LOW_BATTERY',
    color: '#ff6600',
    orin_gpu: '없음',
    orin_cpu: '안전 자세',
    nuc: '정지',
    network: '대화만',
  },
  EMERGENCY: {
    label: 'EMERGENCY',
    color: '#ff0044',
    orin_gpu: '없음',
    orin_cpu: '로그 유지',
    nuc: '전원 차단',
    network: '없음',
  },
};

export const STATE_TRANSITIONS = [
  { from: 'IDLE', to: 'TALKING', trigger: '음성 감지' },
  { from: 'IDLE', to: 'WALKING', trigger: '보행 명령' },
  { from: 'TALKING', to: 'FETCH', trigger: 'fetch 명령' },
  { from: 'TALKING', to: 'IDLE', trigger: '대화 종료' },
  { from: 'TALKING', to: 'MANIPULATING', trigger: '조작 명령' },
  { from: 'FETCH', to: 'WALKING', trigger: '이동 시작' },
  { from: 'FETCH', to: 'MANIPULATING', trigger: '조작 시작' },
  { from: 'FETCH', to: 'IDLE', trigger: '시퀀스 완료' },
  { from: 'MANIPULATING', to: 'IDLE', trigger: '완료' },
  { from: 'MANIPULATING', to: 'TALKING', trigger: '완료+대화' },
  { from: 'WALKING', to: 'IDLE', trigger: '정지 명령' },
  { from: '*', to: 'EMERGENCY', trigger: '비상' },
  { from: '*', to: 'LOW_BATTERY', trigger: 'SOC ≤20%' },
  // 실패 경로
  { from: 'MANIPULATING', to: 'IDLE', trigger: 'SmolVLA pick 실패 (재시도 한도 초과)', isFailure: true },
  { from: 'FETCH', to: 'IDLE', trigger: 'stable 대기 타임아웃', isFailure: true },
  { from: 'WALKING', to: 'MANIPULATING', trigger: '팔 안전 자세 복귀 후 전환', isFailure: false, note: '전환 시 팔 먼저 복귀' },
  { from: 'TALKING', to: 'TALKING', trigger: '클라우드 API 장애 → 로컬 폴백 전환', isFailure: true },
];

export const POWER_SYSTEM = [
  {
    id: 'battery_1',
    label: '배터리 1',
    spec: '6S LiPo 4000mAh',
    targets: 'BHL 다리 BLDC ×12 (ESC 직결 24V)',
    location: '다리 프레임',
    color: '#ff00aa',
  },
  {
    id: 'battery_2',
    label: '배터리 2',
    spec: '4S LiPo 8000mAh',
    targets: 'Orin(직결) + NUC(DC-DC 12V) + 팔 서보(DC-DC 12V) + USB Hub(DC-DC 5V)',
    location: '토르소',
    color: '#c084fc',
  },
];

export const NETWORK = {
  primary: { label: '1차: 5GHz 핫스팟', target: '클라우드 LLM (Gemini Flash / GPT-4o mini)' },
  secondary: { label: '2차: 시설 WiFi', target: '핫스팟 장애 시' },
  survival: { label: '서바이벌: 로컬', target: 'Qwen 2.5 0.5B Q4 (Ollama) + 키워드 매칭 + Piper TTS' },
};
