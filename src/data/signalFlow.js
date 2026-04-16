// HYlion Signal Flow — 전체 신호 흐름 구조화 데이터

export const SIGNAL_FLOW_CHAINS = [
  {
    id: 'voice',
    label: '음성 대화',
    color: '#00f0ff',
    steps: [
      { id: 'S0', label: 'User', detail: '음성 명령' },
      { id: 'S1', label: 'USB Mic', detail: 'PCM 오디오', wire: 'USB' },
      { id: 'S3a', label: 'STT', detail: 'Whisper, local', wire: '텍스트', host: 'Orin' },
      { id: 'S3b', label: 'Cloud LLM', detail: 'Gemini Flash / GPT-4o mini, 응답+명령 분류', wire: 'intent + 응답', host: 'Orin' },
      { id: 'S3f', label: '오케스트레이터', detail: 'Python FSM, 상태 전환 + FETCH 시퀀서', wire: '응답 텍스트', host: 'Orin' },
      { id: 'S3c', label: 'TTS', detail: 'Piper TTS, local', wire: 'USB 오디오', host: 'Orin' },
      { id: 'M1', label: 'USB Speaker', detail: '음성 출력' },
    ],
    branch: { afterStep: 'S3c', target: 'M2', label: 'Mouth Servo', detail: 'GPIO PWM, lip sync' },
  },
  {
    id: 'arm',
    label: '팔 조작 (SmolVLA)',
    color: '#c8ff00',
    steps: [
      { id: 'S3f_arm', label: '오케스트레이터', detail: '팔 명령 라우팅', host: 'Orin' },
      { id: 'S3e', label: 'VLA (SmolVLA)', detail: 'SmolVLA 450M, LeRobot/PyTorch, 비동기 추론', wire: 'USB Serial ×2', host: 'Orin' },
      { id: 'A1', label: 'BusLinker ×2', detail: 'USB Serial 어댑터, 팔당 1개', wire: 'TTL Bus' },
      { id: 'A2', label: 'STS3215 ×12', detail: '30kg 토크, 인코더 내장', wire: '출력축' },
      { id: 'A3', label: 'Arm Joint ×12', detail: '6DOF × 2팔' },
    ],
    input: { id: 'S2', label: 'USB Camera ×3', detail: '좌그리퍼+우그리퍼+외부', target: 'S3e', wire: 'USB RGB ×3' },
    feedback: '서보 위치 피드백: STS3215 → TTL → BusLinker → USB → VLA',
  },
  {
    id: 'leg',
    label: '다리 보행 (Walking RL)',
    color: '#ff00aa',
    steps: [
      { id: 'S3d', label: '명령 매핑', detail: '명령 테이블 → vx vy wz', wire: 'Ethernet UDP', host: 'Orin' },
      { id: 'L1', label: 'NUC (N95)', detail: 'ONNX Runtime C API, MLP 250Hz, Isaac Gym 모델', wire: 'USB 목표 각도', host: 'NUC' },
      { id: 'L2', label: 'USB-CAN ×2', detail: '다리당 1개', wire: 'CAN 2.0' },
      { id: 'L3', label: 'CAN Bus ×2', detail: '1Mbps, 다리당 1', wire: 'CAN ID 매칭' },
      { id: 'L4', label: 'ESC ×12', detail: 'B-G431B, FOC 수kHz', wire: '3-phase PWM' },
      { id: 'L5', label: 'BLDC ×12', detail: 'M6C12×8+5010×4', wire: '고속 저토크' },
      { id: 'L6', label: '기어박스 ×12', detail: '사이클로이드, 3D프린트', wire: '저속 고토크' },
      { id: 'L7', label: 'Leg Joint ×12', detail: '6DOF × 2다리' },
    ],
    feedback: 'AS5600 인코더(I2C→ESC→CAN→NUC) + BNO085 IMU(Arduino USB→NUC) + NUC→Orin UDP(보행 상태+IMU stable)',
  },
];

// ── Signal Cables ──
export const CABLE_TOPOLOGY = [
  {
    id: 'orin',
    label: 'Jetson Orin Nano',
    color: '#00f0ff',
    ports: [
      { port: 'USB 1', target: 'USB Hub A (센서)', devices: ['Mic', 'Camera ×3'], cable: 'USB-A' },
      { port: 'USB 2', target: 'USB Hub B (제어)', devices: ['Speaker', 'BusLinker ×2'], cable: 'USB-A' },
      { port: 'Ethernet', target: 'NUC N95', detail: 'UDP vx vy wz', cable: 'CAT6' },
      { port: 'GPIO', target: 'Mouth Servo (SG90)', detail: 'PWM + 5V + GND', cable: '3선' },
    ],
  },
  {
    id: 'nuc',
    label: 'NUC N95',
    color: '#4466ff',
    ports: [
      { port: 'USB 1', target: 'USB-CAN 좌다리', detail: '→ ESC #1~#6 데이지', cable: 'USB' },
      { port: 'USB 2', target: 'USB-CAN 우다리', detail: '→ ESC #7~#12 데이지', cable: 'USB' },
      { port: 'USB 3', target: 'Arduino', detail: '← BNO085 IMU (I2C 4선)', cable: 'USB' },
      { port: 'Ethernet', target: 'Orin', detail: 'UDP 수신', cable: 'CAT6' },
    ],
  },
];

// ── Power Cables ──
export const POWER_TOPOLOGY = [
  {
    id: 'batt1',
    label: '배터리 1',
    spec: '6S LiPo 4000mAh, 22.2V',
    color: '#ff00aa',
    outputs: [
      { target: 'ESC ×6 좌다리', voltage: '24V 직결', cable: 'XT60', detail: '데이지 체인' },
      { target: 'ESC ×6 우다리', voltage: '24V 직결', cable: 'XT60 분기', detail: '데이지 체인' },
    ],
  },
  {
    id: 'batt2',
    label: '배터리 2',
    spec: '4S LiPo 8000mAh, 14.8V',
    color: '#c084fc',
    outputs: [
      { target: 'Orin', voltage: '14.8V 직결', cable: 'XT60', detail: '9-20V 허용' },
      { target: 'DC-DC #1 → NUC', voltage: '12V 3A', cable: 'XT60 분기', detail: 'buck-boost, DC 배럴잭' },
      { target: 'DC-DC #2 → 팔 서보', voltage: '12V 15A', cable: 'XT60 분기 14AWG+', detail: 'buck-boost, BusLinker ×2' },
      { target: 'DC-DC #3 → USB Hub', voltage: '5V 3A', cable: 'XT60 분기', detail: 'Hub A + Hub B' },
    ],
  },
];

// ── Software Architecture ──
export const SOFTWARE_STACK = [
  {
    id: 'orin_sw',
    label: 'Jetson Orin (JetPack Ubuntu)',
    color: '#00f0ff',
    groups: [
      { name: '입력', items: ['OpenCV — Camera ×3 캡처', 'Whisper — STT, local'] },
      { name: '두뇌', items: ['Cloud LLM (Gemini Flash / GPT-4o mini)', 'Local fallback (Qwen 2.5 0.5B Q4, Ollama)', '명령 매핑 (YAML/JSON → vx vy wz)', 'SmolVLA 450M (LeRobot/PyTorch)'] },
      { name: '출력', items: ['Piper TTS — 음성 합성', 'UDP Client — NUC로 vx vy wz', 'LeRobot ServoControl — BusLinker USB', 'Jetson.GPIO — 입 서보 PWM', 'ALSA/PulseAudio — Speaker'] },
    ],
  },
  {
    id: 'nuc_sw',
    label: 'NUC N95 (Ubuntu)',
    color: '#4466ff',
    groups: [
      { name: '메인 (C)', items: ['UDP Server (udp_joystick.py 호환)', 'ONNX Runtime C API — MLP 250Hz', 'SocketCAN — CAN 프레임 송수신', 'USB Serial — Arduino IMU 수신'] },
      { name: '유틸 (Python)', items: ['calibrate_joints.py'] },
    ],
  },
  {
    id: 'esc_fw',
    label: 'ESC ×12 (Recoil-BESC, C)',
    color: '#ff8800',
    groups: [
      { name: '펌웨어', items: ['FOC 수kHz (Clarke/Park/PI)', 'PD 위치 제어기', 'CAN 프로토콜 핸들러', 'I2C — AS5600 인코더'] },
    ],
  },
  {
    id: 'arduino_fw',
    label: 'Arduino (IMU 브릿지)',
    color: '#c8ff00',
    groups: [
      { name: '펌웨어', items: ['BNO085 I2C/SPI 드라이버', 'USB Serial → NUC'] },
    ],
  },
];
