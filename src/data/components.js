// =============================================================================
// HYlion Robot — 부품/하드웨어 데이터베이스 (components.js)
// 기획서 v13 + 실행가이드 v13 기반 전수 추출
// =============================================================================

export const COMPONENT_CATEGORIES = {
  compute: '컴퓨팅 보드',
  motor_bldc: 'BLDC 모터',
  motor_servo: '서보 모터',
  motor_driver: '모터 드라이버/ESC',
  communication: '통신 인터페이스',
  sensor: '센서',
  io_device: '입출력 장치',
  power: '전원 시스템',
  safety: '안전 장치',
  structure: '구조 부품',
  printed: '3D 프린트 부품',
  exterior: '외장/조형',
};

export const COMPONENTS = {
  // ===========================================================================
  // 컴퓨팅 보드
  // ===========================================================================
  orin_nano_super: {
    name: 'NVIDIA Jetson Orin Nano Super Developer Kit',
    category: 'compute',
    specs: {
      gpu: 'Ampere, 1024 CUDA cores + 32 Tensor cores',
      cpu: '6-core Arm Cortex-A78AE v8.2 (1.5MB L2 + 4MB L3)',
      memory: '8GB LPDDR5 128-bit, 102 GB/s bandwidth',
      power_modes: '7W / 15W / **25W** (Super의 핵심 차별점 — 25W 모드 가능)',
      tdp_default: '실제 기본 25W MAXN SUPER 모드 권장 (SmolVLA 추론 성능 최대화)',
      voltage: '9~20V 허용 (14.8V 직결 from Battery 2)',
      ai_performance: '67 SPARSE INT8 TOPS',
      storage: 'SD 카드 슬롯 + NVMe SSD (M.2 Key M)',
      os: 'JetPack 6.x (Ubuntu 22.04)',
      interfaces: 'USB 3.2, Ethernet, GPIO, PWM, I2C, SPI, CSI',
      thermal_note: '⚠️ 25W 모드에서는 40mm 팬 + 배기 설계 필수. 15W 대비 발열 약 1.7배',
    },
    usage: {
      description:
        'Whisper STT(local), Cloud LLM API(Gemini Flash/GPT-4o mini), Piper TTS(local), SmolVLA 450M(LeRobot/PyTorch 비동기 추론), 명령 매핑(YAML), Jetson.GPIO(입 서보 PWM), OpenCV(카메라 캡처). USB Hub A(센서)+Hub B(제어) 경유',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'NVIDIA Jetson Orin Nano Super', url: 'https://developer.nvidia.com/embedded/jetson-orin' },
    ],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'orin' },
  },

  nuc_beelink_n95: {
    name: 'BeeLink N95 Mini PC (NUC)',
    category: 'compute',
    specs: {
      cpu: 'Intel Alder Lake N95 (4C/4T, up to 3.4GHz)',
      memory: '16GB DDR4',
      storage: '500GB SSD',
      tdp: '15-20W',
      power: '12V (DC-DC #1 from Battery 2)',
      os: 'Ubuntu 22.04 + xanmod RT 커널',
      interfaces: 'USB 3.0, Ethernet, HDMI',
      can_support: 'USB-CAN ×2 → 2 CAN 버스 (다리당 1)',
    },
    usage: {
      description:
        'Walking RL policy (ONNX Runtime C API, MLP policy 25Hz — BHL 논문 기준, IsaacLab에서 훈련한 ONNX), SocketCAN으로 USB-CAN ×2 제어 (CAN 버스 250Hz로 12개 ESC 통신), IM10A IMU USB 직결 수신 (250Hz). UDP Server로 Orin에서 보행 명령 수신 (udp_joystick.py 호환)',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'BeeLink Official', url: 'https://www.bee-link.com/' },
    ],
    location3D: { part: 'torso', position: 'mid', internalId: 'nuc' },
  },

  dgx_spark: {
    name: 'NVIDIA DGX Spark',
    category: 'compute',
    specs: {
      gpu: 'NVIDIA Grace Blackwell',
      memory: '128GB unified',
      performance: '1000 TOPS AI',
      use_case: '학습 전용 (온보드 탑재 안 함)',
    },
    usage: {
      description:
        'SmolVLA 파인튜닝(Stage 1+2) + Walking RL 학습(IsaacLab). 랩 서버로 사용하며 로봇에 탑재하지 않음. 학습 완료 모델을 Orin/NUC에 배포',
      parts: [],
      quantity: 1,
      spares: 0,
      owner: '희승',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [
      { label: 'NVIDIA DGX', url: 'https://www.nvidia.com/en-us/data-center/dgx-spark/' },
    ],
    location3D: null,
  },

  // ===========================================================================
  // BLDC 모터 (BHL 다리용)
  // ===========================================================================
  mad_m6c12_150kv: {
    name: 'MAD M6C12 150KV',
    category: 'motor_bldc',
    specs: {
      type: 'Brushless DC (outrunner, delta winding)',
      kv: '150 KV',
      application: 'BHL 다리 — 고토크 관절 (hip roll/yaw/pitch, knee)',
      rotor_diameter: '68 mm',
      rotor_mass: '86 g',
      pole_pairs: '14 (BHL 공식)',
      phase_resistance: '0.1886 Ω (BHL 공식)',
      torque_constant: '0.0919 Nm/A (BHL 공식)',
      reflected_inertia_output: '0.0224 kg·m² (감속비 15:1 기어박스 반영, BHL 공식)',
      gearbox_ratio: '15:1 (사이클로이드)',
      voltage: '3S~6S LiPo (운용 24V — BHL 논문 기준)',
      max_current: '~30A (burst)',
      pattern_motor_profile: 'MOTORPROFILE_MAD_M6C12_150KV (Recoil 펌웨어 define)',
    },
    usage: {
      description:
        'BHL 이족보행 다리의 대형 관절(hip roll/yaw/pitch, knee)용 BLDC 모터. 사이클로이드 기어박스와 결합하여 액추에이터 구성. 다리당 4개',
      parts: ['left_leg', 'right_leg'],
      quantity: 8,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'MAD Components', url: 'https://www.mad-motor.com/' },
    ],
    location3D: { part: 'left_leg', position: 'hip_knee', internalId: 'bldc_m6c12' },
  },

  mad_5010_110kv: {
    name: 'MAD 5010 (110/310/370 KV variant)',
    category: 'motor_bldc',
    specs: {
      type: 'Brushless DC (outrunner, delta winding)',
      kv: 'Recoil 펌웨어 프로파일: 110KV / 310KV / 370KV 중 선택',
      kv_default: '110 KV (기본 발주 기준, BHL 공식 BOM 최종 확인 후 확정)',
      application: 'BHL 다리 — 발목 관절 (ankle pitch/roll)',
      rotor_diameter: '53 mm',
      rotor_mass: '47 g',
      pole_pairs: '14 (BHL 공식)',
      phase_resistance: '0.6193 Ω (110KV 기준, BHL 공식)',
      torque_constant: '0.1176 Nm/A (110KV 기준, BHL 공식)',
      reflected_inertia_output: '0.00743 kg·m² (감속비 15:1 반영, BHL 공식)',
      gearbox_ratio: '15:1 (사이클로이드)',
      voltage: '3S~6S LiPo (운용 24V — BHL 논문 기준)',
      max_current: '~20A (burst)',
      pattern_motor_profile: 'MOTORPROFILE_MAD_5010_{110,310,370}KV 중 선택',
    },
    usage: {
      description:
        'BHL 이족보행 다리의 발목 관절(ankle pitch/roll)용 BLDC 모터. M6C12보다 소형이며 발목에 최적화. 다리당 2개',
      parts: ['left_leg', 'right_leg'],
      quantity: 4,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'W2 발주 → W4 입고',
      note: '⚠️ MAD 5010 110KV 재고 불안정 — Amazon 품절 시 MAD 직구 (배송 1주+)',
    },
    links: [
      { label: 'MAD Components', url: 'https://www.mad-motor.com/' },
    ],
    location3D: { part: 'left_leg', position: 'ankle', internalId: 'bldc_5010' },
  },

  // ===========================================================================
  // 서보 모터
  // ===========================================================================
  so_arm_servo: {
    name: 'SO-ARM101 Follower 서보 (Feetech STS3215 Pro, 12V)',
    category: 'motor_servo',
    specs: {
      type: 'Serial Bus Servo (Feetech STS3215 Pro 12V, SO-ARM101 Follower용)',
      variant: 'STS3215 Pro 12V 명시적 선택 (기획서 §7.6). LeRobot 커뮤니티 기본은 7.4V지만 우리는 고토크 12V Pro 채택',
      stall_torque: '30 kg·cm @ 12V (12V Pro variant)',
      no_load_speed: '~50 RPM @ 12V',
      resolution: '4096 (12-bit 자석 인코더 내장)',
      voltage: '12V (DC-DC #2 전용 15A — STS3215 Pro 12V 정격)',
      communication: 'Feetech SCServo (SMS/STS 시리즈) Half-Duplex TTL, 1 Mbps',
      gear_ratio: '1/345 (Follower arm 6개 관절 전부 동일, LeRobot 공식)',
      weight: '~60 g',
      feedback: '위치, 속도, 부하, 온도',
      dof_per_arm: '6 관절 (shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper)',
      lerobot_naming: 'lerobot-setup-motors --robot.type=so101_follower',
    },
    usage: {
      description:
        'SO-ARM101 Follower 양팔 관절 구동 (로봇 본체 쪽). 좌팔 6개(ID 1~6) + 우팔 6개(ID 7~12), 총 12개. BusLinker #1(좌), #2(우) TTL 데이지체인. LeRobot `lerobot-setup-motors`로 ID·baudrate 설정. 텔레옵 수집 시에는 별도의 Leader arm(so_arm_leader_servo 항목 참조)과 짝 맞춤',
      parts: ['left_arm', 'right_arm'],
      quantity: 12,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [
      { label: 'SO-ARM101 GitHub', url: 'https://github.com/TheRobotStudio/SO-ARM100' },
      { label: 'Feetech STS3215', url: 'https://www.feetechrc.com/' },
    ],
    location3D: { part: 'left_arm', position: 'joints', internalId: 'so_arm_servo' },
  },

  buslinker_leader: {
    name: 'Bus Servo 어댑터 (Leader arm 수집용)',
    category: 'communication',
    specs: {
      type: 'USB ↔ TTL Feetech SCServo 어댑터 (Follower와 동일 보드)',
      location: '개발 PC (로봇 토르소에 탑재 안 함)',
      protocol: 'Feetech SCServo Half-Duplex TTL 1 Mbps',
    },
    usage: {
      description:
        'Leader arm (텔레옵 조종봉) ×2 연결용 BusLinker ×2. 수집 시 개발 PC USB에 연결 → Leader 관절 각도 읽어서 Follower로 전송. 발표 시에는 사용 안 함 — 로봇 온보드가 아닌 수집 장비로 분리 관리',
      parts: [],
      quantity: 2,
      spares: 0,
      owner: '인혁',
      note: '텔레옵 수집 완료 상태라면 이미 보유 중. 신규 발주 시 Follower용 BusLinker와 동일 보드로 2개 추가',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [
      { label: 'LeRobot SO-101 Leader 연결', url: 'https://huggingface.co/docs/lerobot/so101' },
    ],
    location3D: null,
  },

  so_arm_leader_servo: {
    name: 'SO-ARM101 Leader 서보 세트 (STS3215, 혼합 기어비)',
    category: 'motor_servo',
    specs: {
      type: 'Feetech STS3215 (Leader arm — 텔레옵 조종봉)',
      purpose: '텔레옵 데이터 수집용 Leader arm. 사람이 Leader를 움직이면 Follower가 따라감 → SmolVLA 학습 에피소드 기록',
      gear_ratios: 'LeRobot 공식: shoulder_pan 1/191, shoulder_lift 1/345, elbow_flex 1/191, wrist_flex 1/147, wrist_roll 1/147, gripper 1/147 (관절마다 다른 기어비)',
      note: 'Follower의 1/345 단일 기어비와 구성이 다름 — Leader가 자중을 버티면서 큰 힘 없이 움직일 수 있도록 설계',
      dof_per_arm: '6 관절 (Follower와 동일 관절 구조)',
      voltage: '12V (Follower와 동일 DC-DC #2 공유 또는 별도 12V 공급)',
      lerobot_naming: 'lerobot-setup-motors --teleop.type=so101_leader',
    },
    usage: {
      description:
        'Leader 좌팔 6개 + 우팔 6개 = 12개. 텔레옵 수집 시 사용. LeRobot `so101_leader` 타입. BusLinker Leader용 어댑터 ×2 필요 (Follower용과 별도). W-5 양팔 수집 본격 가동 시 필수',
      parts: ['left_arm', 'right_arm'],
      quantity: 12,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
      note: '⚠️ 팀 실물 보유 확인 필요 — 수집 이미 진행 중이면 보유 확실. 신규 발주 시 Leader용 기어비 혼합 세트 별도 주문',
    },
    links: [
      { label: 'LeRobot SO-101 가이드 (Leader/Follower 기어비 표)', url: 'https://huggingface.co/docs/lerobot/so101' },
    ],
    location3D: null,
  },

  sg90_servo: {
    name: 'SG90급 마이크로 서보',
    category: 'motor_servo',
    specs: {
      type: 'Analog Micro Servo',
      stall_torque: '~1.8 kg·cm (5V)',
      no_load_speed: '0.08 sec/60° (5V)',
      voltage: '5V (Jetson GPIO)',
      signal: 'PWM (Jetson GPIO 핀)',
      weight: '~9g',
      gear: '플라스틱 기어',
    },
    usage: {
      description:
        '머리 내부 입(lip) 서보. TTS 오디오 타이밍에 맞춰 lip sync 구현. Jetson GPIO 5V 전원 + PWM 핀으로 직접 제어',
      parts: ['head'],
      quantity: 1,
      spares: 1,
      owner: '상윤',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'head', position: 'mouth', internalId: 'lip_servo' },
  },

  // ===========================================================================
  // 모터 드라이버 / ESC
  // ===========================================================================
  b_g431b_esc1: {
    name: 'B-G431B-ESC1 (STM32 ESC — BHL BESC 명칭)',
    category: 'motor_driver',
    specs: {
      mcu: 'STM32G431CB (ARM Cortex-M4F @ 170 MHz, FOC 연산 + 내장 OP-amp로 전류 센싱 증폭)',
      gate_driver: 'L6387 ×3 (3상용, 각 상 하프브리지 게이트드라이버 1개)',
      power_mosfet: 'STL180N6F7 ×6 (3상 × 하이·로우 사이드 = MOSFET 3쌍, BHL 공식)',
      current_sensing: '3-shunt 레지스터 + STM32G431 내장 OP-amp (3상 전류 실시간 센싱 → FOC 정밀도)',
      can_interface: 'FDCAN (Flexible Data-rate CAN, STM32G431 내장 peripheral) + 온보드 CAN 트랜시버 + 120Ω 종단 펌웨어 제어',
      encoder_interface: 'I2C — AS5600 직결 (주소 0x36, 권장 핀 PB8=SCL, PB7=SDA)',
      programmer: 'ST-LINK 도터보드 내장 (Micro USB 플래시)',
      voltage: '6~28V (BHL 운용 24V 기준, 6S 정격 25.2V max)',
      continuous_current: '15A',
      peak_current: '40A',
      communication: 'CAN 2.0B (1 Mbps, 다리당 1버스 데이지체인)',
      firmware: 'T-K-233/Recoil-Motor-Controller-BESC (C, MIT 라이선스; FOC 수 kHz + PD 위치 제어 + CAN 프로토콜 + AS5600 I2C)',
      flash_tool: 'STM32CubeIDE (Run ×4 절차)',
      can_port_warning: '⚠️ CAN 솔더 패드 매우 약함 — FR4 층에서 떨어지기 쉬움',
      control_rates: 'FOC 전류 루프 수 kHz (ESC 내부), CAN 통신 250 Hz (NUC↔ESC, BHL 논문)',
      size: '30×15mm',
      per_joint_structure: '관절 1개당 이 보드 1개 = 총 12개 (BESC + AS5600 + 자석 + BLDC 모터 + 사이클로이드 기어박스가 관절당 1세트)',
    },
    usage: {
      description:
        'BHL 다리 BLDC 모터 개별 제어용 ESC. 12개 관절에 각 1개씩 (다리당 6개, 좌 CAN ID 1/3/5/7/11/13 + 우 2/4/6/8/12/14). CAN 버스로 NUC에 데이지체인 연결. FOC 수kHz (보드 내부), CAN 통신 250Hz (NUC↔ESC). 사이클로이드 기어박스 내부에 장착',
      parts: ['left_leg', 'right_leg'],
      quantity: 12,
      spares: 2,
      owner: '승민',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'ST B-G431B-ESC1', url: 'https://www.st.com/en/evaluation-tools/b-g431b-esc1.html' },
    ],
    location3D: { part: 'left_leg', position: 'actuator_internal', internalId: 'esc' },
  },

  // ===========================================================================
  // 통신 인터페이스
  // ===========================================================================
  can_usb: {
    name: 'USB-CAN 어댑터',
    category: 'communication',
    specs: {
      type: 'USB ↔ CAN 2.0B 변환기',
      baudrate: '1Mbps',
      interface: 'USB 2.0',
      channels: '2개 USB → 2 CAN 버스 (다리당 1)',
    },
    usage: {
      description:
        'NUC USB → BHL 다리 CAN 버스 통신. 2개 어댑터로 2개 CAN 버스 구성 (다리당 1), 12개 ESC와 250Hz 통신',
      parts: ['torso'],
      quantity: 2,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'mid', internalId: 'can_usb' },
  },

  buslinker_controller: {
    name: 'Bus Servo 어댑터 (SO-ARM Follower 온보드용)',
    category: 'communication',
    specs: {
      type: 'USB ↔ TTL Feetech SCServo 어댑터 (BusLinker 또는 Waveshare/Feetech FE-URT-1 등)',
      protocol: 'Feetech SCServo Half-Duplex TTL (SMS/STS 시리즈) — Dynamixel Protocol 2.0과 다름',
      baudrate: '1 Mbps (STS3215 기본)',
      interface: 'USB (Micro-B 또는 USB-C, 보드에 따라 상이)',
      connector: 'TTL 3-pin 데이지체인 (VCC/GND/Signal)',
      jumper_note: 'Waveshare 보드의 경우 B 채널(USB) 점퍼 설정 필수',
    },
    usage: {
      description:
        '로봇 토르소 온보드 Follower 전용. #1(좌 Follower ID 1~6), #2(우 Follower ID 7~12). Orin USB Hub B 경유. 텔레옵 수집 시 Leader용 어댑터 2개는 buslinker_leader 항목 참조 (개발 PC 연결, 로봇 탑재 안 함)',
      parts: ['left_arm', 'right_arm'],
      quantity: 2,
      spares: 0,
      owner: '인혁',
      note: '⚠️ "BusLinker"는 제품명 — 팀 실물은 Feetech FE-URT-1 또는 Waveshare 호환품일 수 있음. 기능은 동일',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [
      { label: 'SO-ARM101 GitHub', url: 'https://github.com/TheRobotStudio/SO-ARM100' },
    ],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'buslinker' },
  },

  // ===========================================================================
  // 센서
  // ===========================================================================
  head_camera: {
    name: '머리 카메라 (USB)',
    category: 'sensor',
    specs: {
      type: 'USB UVC 카메라',
      resolution: '1080p',
      fps: '30fps',
      fov: '~90° (광각)',
      interface: 'USB 2.0/3.0',
      mount: '머리 내부 정면 고정',
    },
    usage: {
      description:
        'SmolVLA external view (3대 카메라 중 외부). 머리 내부 정면 장착',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'head', position: 'front_center', internalId: 'camera' },
  },

  wrist_camera: {
    name: '손목 카메라 (USB)',
    category: 'sensor',
    specs: {
      type: 'USB UVC 카메라',
      resolution: '1080p',
      fps: '30fps',
      fov: '~90° (광각)',
      interface: 'USB 2.0/3.0',
      mount: 'SO-ARM 그리퍼 부근 고정',
    },
    usage: {
      description:
        'SmolVLA 매니퓰레이션 추론 입력 (hand-eye view). SO-ARM 양팔 그리퍼 근처 마운트, Orin USB 연결. Week 1에서 위치/각도 확정 후 변경 금지 (수집/추론 동일 조건 보장)',
      parts: ['left_arm', 'right_arm'],
      quantity: 2,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 1',
      note: 'W1 Blender 스펙시트 이후 스펙 확정, 즉시 발주',
    },
    links: [],
    location3D: { part: 'right_arm', position: 'gripper', internalId: 'wrist_camera' },
  },

  microphone: {
    name: 'USB 마이크',
    category: 'sensor',
    specs: {
      type: 'USB 콘덴서 마이크',
      pattern: '무지향성 또는 단일지향성',
      sample_rate: '16kHz+',
      interface: 'USB Audio Class',
      aec: '에코 캔슬링 필요 여부 Week 1 테스트',
    },
    usage: {
      description:
        '음성 입력 캡처. Orin USB 오디오로 연결. Whisper STT (local)에 입력. 스피커와 에코 캔슬링 테스트 필요',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'head', position: 'front_lower', internalId: 'mic' },
  },

  as5600_encoder: {
    name: 'AS5600 자석 인코더 (BHL 필수 수정품)',
    category: 'sensor',
    specs: {
      type: '12-bit 자석 로터리 인코더',
      resolution: '4096 positions (0.088°)',
      communication: 'I2C (주소 0x36 고정)',
      i2c_pins: 'STM32G431CB 권장: PB8 = SCL, PB7 = SDA',
      voltage: '3.3~5V',
      mount: 'BLDC 모터 축 끝단 (자석은 모터축 위, AS5600 보드는 고정)',
      magnet_type: '⚠️ 엔코더 동봉 자석만 사용 — **직경 방향(diametric) 자화**. 원기둥의 지름을 가로질러 N/S 분리. 일반 축방향(axial) 자석은 작동 안 함',
      required_mod: 'BHL 공식 수정 필수: (1) R1 제거 — VCC 5V 사용용, (2) R4 제거 — PGO 정상화, (3) DIR→VDD 묶기 — CCW 회전 지원',
      mod_reference: 'https://notes.tk233.xyz/electrical/as5600-modification',
    },
    usage: {
      description:
        'BHL 다리 BLDC 모터 축 각도 측정. 각 ESC(B-G431B)에 I2C로 연결되어 FOC 제어의 위치 피드백 제공. 12개 모터에 각 1개씩. 반드시 BHL 공식 3단계 수정(R1/R4/DIR) 후 사용. 매 전원 사이클마다 calibrate_joints.py로 영점 재설정 필요',
      parts: ['left_leg', 'right_leg'],
      quantity: 12,
      spares: 2,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'left_leg', position: 'actuator_internal', internalId: 'encoder' },
  },

  im10a_imu: {
    name: 'HiPNUC IM10A 9축 IMU',
    category: 'sensor',
    specs: {
      type: '9-DOF IMU (가속도 + 자이로 + 지자기)',
      communication: 'USB 직결 (NUC)',
      interface: 'USB Serial (가상 COM)',
      static_drift: '±20~40 mg (BHL 문서 기준, BNO085의 ±150 mg 대비 우수)',
      note: 'BHL 공식 권장 IMU — BNO085+Arduino 브릿지 대안 (납땜 불필요)',
    },
    usage: {
      description:
        'Walking RL policy용 몸체 기울기/각속도 측정. NUC에 USB 직결 (Arduino 브릿지 불필요). 낙상 감지 겸용: IMU 임계치 초과 시 NUC가 모터 토크 해제',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'BHL IMU 권장 (공식 docs)', url: 'https://berkeley-humanoid-lite.gitbook.io/docs' },
    ],
    location3D: { part: 'torso', position: 'center', internalId: 'policy_imu' },
  },

  // ===========================================================================
  // 입출력 장치
  // ===========================================================================
  speaker: {
    name: '소형 스피커',
    category: 'io_device',
    specs: {
      type: 'USB 소형 스피커',
      power: '3~5W',
      interface: 'USB Audio',
    },
    usage: {
      description:
        'Piper TTS 합성 음성 출력. ALSA 또는 PulseAudio로 PCM 출력. Orin USB 오디오로 연결. 인사/대화 음성 재생, lip sync 타이밍 기준 제공',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'upper_front', internalId: 'speaker' },
  },

  usb_hub_a: {
    name: 'USB Hub A (센서/입력)',
    category: 'io_device',
    specs: {
      type: '유전원 USB Hub',
      ports: '4포트 이상',
      power: '5V (DC-DC #3)',
    },
    usage: {
      description:
        'Orin USB1에 연결. USB Mic + 카메라 ×3 연결. 유전원으로 카메라 안정 공급',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'usb_hub_a' },
  },

  usb_hub_b: {
    name: 'USB Hub B (출력/제어)',
    category: 'io_device',
    specs: {
      type: '유전원 USB Hub',
      ports: '4포트 이상',
      power: '5V (DC-DC #3)',
    },
    usage: {
      description:
        'Orin USB2에 연결. USB Speaker + BusLinker ×2 (USB-C) 연결',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '성래',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'usb_hub_b' },
  },

  // ===========================================================================
  // 전원 시스템
  // ===========================================================================
  battery_1: {
    name: '배터리 1 (다리 전용, BHL 공식 동일 스펙)',
    category: 'power',
    specs: {
      config: '6S LiPo',
      capacity: '4000mAh',
      voltage_nom: '22.2V',
      voltage_max: '25.2V',
      chemistry: 'LiPo',
      discharge: '25C+',
      safety: 'LiPo 저전압 알람 장착',
      runtime: '~30분 연속 동작 (BHL 논문 §IV)',
    },
    usage: {
      description:
        'BHL 다리 BLDC ×12 전용. XT60으로 ESC 데이지 체인에 직결 (24V). 다리 프레임에 장착. BHL 공식 스펙과 동일: 6S LiPo 4000mAh로 약 30분 연속 동작',
      parts: ['left_leg', 'right_leg'],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'left_leg', position: 'hip_frame', internalId: 'battery_1' },
  },

  battery_2: {
    name: '배터리 2 (연산+팔+주변기기)',
    category: 'power',
    specs: {
      config: '4S LiPo',
      capacity: '8000mAh',
      voltage_nom: '14.8V',
      voltage_max: '16.8V',
      chemistry: 'LiPo',
      discharge: '10C+',
      safety: 'LiPo 저전압 알람 장착, 14.0V 컷오프',
    },
    usage: {
      description:
        'Orin(14.8V 직결) + DC-DC #1→NUC(12V) + DC-DC #2→팔 서보(12V) + DC-DC #3→USB Hub(5V). 토르소에 장착',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'bottom', internalId: 'battery_2' },
  },

  dc_dc_converter: {
    name: 'DC-DC 벅-부스트 컨버터',
    category: 'power',
    specs: {
      type: '벅-부스트(Buck-Boost) DC-DC 컨버터',
      input: '14.8V (Battery 2)',
      output_options: '12V (NUC), 12V (팔 서보), 5V (USB Hub)',
      efficiency: '>90%',
      current: '#1: 3A, #2: 15A, #3: 3A',
    },
    usage: {
      description:
        'DC-DC #1: 14.8V→12V 3A buck-boost (NUC 전용), DC-DC #2: 14.8V→12V 15A buck-boost (팔 서보 전용), DC-DC #3: 14.8V→5V 3A (USB Hub 전원)',
      parts: ['torso'],
      quantity: 3,
      spares: 1,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'lower_mid', internalId: 'dcdc' },
  },

  // ===========================================================================
  // 안전 장치
  // ===========================================================================
  nc_emergency_stop: {
    name: 'NC 비상정지 스위치',
    category: 'safety',
    specs: {
      type: 'NC (Normally Closed) 비상정지 버튼',
      action: '누르면 회로 차단 (NC → Open)',
      rating: '10A+ DC',
      color: '적색',
    },
    usage: {
      description:
        '물리 비상정지. Battery 1 양극 NC 차단 (Battery 2 유지, Orin 로그 보존)',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'rear_accessible', internalId: 'estop' },
  },

  // ===========================================================================
  // 구조 부품
  // ===========================================================================
  aluminum_profile_2020: {
    name: '2020 알루미늄 프로파일',
    category: 'structure',
    specs: {
      type: '2020 V-슬롯 알루미늄 프로파일',
      cross_section: '20×20mm',
      material: '6063-T5 알루미늄',
      finish: '양극 산화 (아노다이징)',
      connection: 'T-너트 + 볼트',
      lengths: '프레임 설계에 따라 절단 (토르소 ~25cm 높이)',
    },
    usage: {
      description:
        '토르소 프레임 골격. 배터리 슬롯(최하단), Orin/NUC 마운트, SO-ARM 어깨 마운트, 목 마운트 등 모든 내부 부품의 장착 기준 프레임',
      parts: ['torso'],
      quantity: 8,
      spares: 2,
      owner: '인혁',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'frame', internalId: 'alu_profile' },
  },

  fan_40mm: {
    name: '40mm 냉각 팬',
    category: 'structure',
    specs: {
      type: '40×40×10mm DC 팬',
      voltage: '5V (USB Hub 라인과 공유) — 권장. 12V 모델은 DC-DC #1 공유 필요',
      rpm: '5000~7000',
      airflow: '~5 CFM',
      noise: '<25dB',
      connector: '2-pin (JST)',
    },
    usage: {
      description:
        'Orin 방열판 위 배기 팬 (25W 모드 운용 대응). 토르소 밀폐 시 써멀 스로틀링 방지. 상단 배기구 + 하단 흡기구로 대류 유도. 25W에서 부족하면 2개 병렬 또는 60mm로 업그레이드 검토',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: '인혁',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'upper_rear', internalId: 'fan' },
  },

  bearings: {
    name: '베어링 (사이클로이드 기어박스용) — 6811ZZ 중심',
    category: 'structure',
    specs: {
      primary: '6811ZZ 볼 베어링 (BHL 6512 액추에이터 기준 사이즈, 공식 명시)',
      other_sizes: '소형 보조 베어링 (기어박스 내부 축용, BHL CAD 확인)',
      material: '크롬강 / 스테인리스',
      seal: 'ZZ (금속 실) — 장시간 매끄러운 회전에 유리',
      application: 'BHL 사이클로이드 기어박스 12세트 + 축 지지',
    },
    usage: {
      description:
        'BHL 액추에이터 사이클로이드 기어박스 내부 베어링. 기어박스 12세트에 필요한 수량 일괄 구매',
      parts: ['left_leg', 'right_leg'],
      quantity: 30,
      spares: 5,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'left_leg', position: 'actuator_internal', internalId: 'bearings' },
  },

  heat_inserts: {
    name: '히트 인서트 (열압입 너트)',
    category: 'structure',
    specs: {
      type: '황동 열압입 인서트',
      sizes: 'M2, M3 (주력) + M4/M6 (BHL 일부 대형 체결부). M2.5는 사용처 확인 후 발주 (불필요 가능)',
      bolt_usage: 'SO-ARM101: M2×6 (모터 고정), M3×6 (호른/프레임) / BHL 6512 액추에이터: M3 기반 + M4/M6 대형부',
      application: '3D 프린트 부품에 금속 나사산 생성 (반복 분해/조립 가능)',
    },
    usage: {
      description:
        '3D 프린트 기어박스, 브래킷, 마운트에 열압입하여 볼트 체결점 확보. 반복 분해/조립 가능',
      parts: ['left_leg', 'right_leg', 'torso'],
      quantity: 100,
      spares: 20,
      owner: '인혁',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'various', internalId: 'heat_inserts' },
  },

  wiring_misc: {
    name: '배선 부자재 (BHL 공식 규격)',
    category: 'structure',
    specs: {
      power_wire: '14 AWG stranded 실리콘 와이어 (white/red = 양극, black = 접지, BHL 공식)',
      can_wire: '30 AWG stranded 실리콘 와이어 (yellow = CAN-H/SDA, green = CAN-L/SCL, BHL 공식)',
      connectors: 'XT60 (배터리 본관), XT30 (액추에이터 분기), WAGO 2/3/5 포트 (임시 빌드 허용)',
      others: '수축 튜브, 케이블 타이, 플럭스, 납땜 용품 (CAN 패드 납땜 시 플럭스 필수)',
    },
    usage: {
      description:
        '전원 배선(배터리→DC-DC→각 보드, XT60 분기), 신호선(CAN, I2C, GPIO), 커넥터 일체 등 전체 배선 부자재',
      parts: ['torso', 'left_leg', 'right_leg', 'head'],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: null,
  },

  ethernet_cable: {
    name: 'Ethernet 케이블 (Orin↔NUC)',
    category: 'communication',
    specs: {
      type: 'CAT6 Ethernet',
      length: '~30cm (토르소 내부)',
      speed: '1Gbps',
      purpose: 'Orin↔NUC UDP 직결 통신 (vx vy wz)',
    },
    usage: {
      description:
        'Orin과 NUC 사이 Ethernet UDP 직결. Orin→NUC: vx vy wz 보행 명령, NUC→Orin: 보행 상태',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: '승민',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [],
    location3D: { part: 'torso', position: 'mid', internalId: 'ethernet' },
  },

  // ===========================================================================
  // 3D 프린트 부품
  // ===========================================================================
  cycloidal_gearbox: {
    name: '사이클로이드 기어박스 (3D 프린트)',
    category: 'printed',
    specs: {
      type: 'BHL 사이클로이드 감속기',
      material: 'PLA / PETG',
      reduction_ratio: '15:1 (BHL 공식 스펙)',
      post_processing: '서포트 제거, 리밍, 베어링 시트 정밀 가공',
      print_time: '프린터 2대 병렬, Week 0부터 시작',
    },
    usage: {
      description:
        'BHL 다리 각 관절 액추에이터용 감속기. BLDC 모터(MAD) + ESC + 기어박스 → 1개 액추에이터. 12개 관절에 각 1개씩 (다리당 6). 후가공(Week 2 δ2)이 품질에 결정적',
      parts: ['left_leg', 'right_leg'],
      quantity: 12,
      spares: 2,
      owner: '승민',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 0~2',
    },
    links: [
      { label: 'BHL GitHub', url: 'https://github.com/HybridRobotics/Berkeley-Humanoid-Lite' },
    ],
    location3D: { part: 'left_leg', position: 'joints', internalId: 'gearbox' },
  },

  leg_structure_printed: {
    name: 'BHL 다리 구조물 (3D 프린트)',
    category: 'printed',
    specs: {
      type: 'BHL 다리 프레임 / 링크',
      material: 'PLA / PETG',
      parts_list: 'hip 프레임, 허벅지 링크, 종아리 링크, 발 플레이트',
      print_time: '프린터 2대 병렬',
    },
    usage: {
      description:
        'BHL 이족보행 다리 골격 구조물. 오픈소스 STL 그대로 출력. 기어박스와 함께 Week 0부터 프린트 시작',
      parts: ['left_leg', 'right_leg'],
      quantity: 2,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 0~2',
    },
    links: [
      { label: 'BHL GitHub', url: 'https://github.com/HybridRobotics/Berkeley-Humanoid-Lite' },
    ],
    location3D: { part: 'left_leg', position: 'full', internalId: 'leg_frame' },
  },

  so_arm_printed: {
    name: 'SO-ARM101 Follower 프레임 (3D 프린트)',
    category: 'printed',
    specs: {
      type: 'SO-ARM101 Follower 로봇팔 링크 / 브래킷 (로봇 본체 탑재)',
      material: 'PLA',
      dof: '6-DOF per arm (shoulder_pan/lift + elbow_flex + wrist_flex/roll + gripper)',
      parts_list: '베이스, 어깨, 상완, 전완, 손목, 그리퍼 jaw',
      gripper_jaw: '~5~6cm (SmolVLA 수집 시점에 확정, 이후 변경 금지)',
      note: 'Leader arm 프레임은 별도 — 수집 완료된 기보유 장비로 로봇 탑재 안 함',
    },
    usage: {
      description:
        'SO-ARM101 Follower 양팔 프레임. 오픈소스 STL 출력. 좌팔/우팔 각 1세트 = 2세트. Leader arm 프레임은 SmolVLA 수집 용도로 별도 보유 (로봇 탑재 안 됨)',
      parts: ['left_arm', 'right_arm'],
      quantity: 2,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'SO-ARM101 GitHub', url: 'https://github.com/TheRobotStudio/SO-ARM100' },
    ],
    location3D: { part: 'left_arm', position: 'full', internalId: 'so_arm_frame' },
  },

  torso_brackets: {
    name: '토르소 브래킷 (3D 프린트)',
    category: 'printed',
    specs: {
      type: '커스텀 마운트 브래킷',
      material: 'PLA / PETG',
      items: 'SO-ARM 어깨 마운트, Orin/NUC 마운트, 배터리 슬롯, 머리 목 마운트, BHL hip 연결부',
    },
    usage: {
      description:
        '토르소 알루미늄 프로파일에 각종 부품을 장착하는 커스텀 브래킷. δ1이 CAD 설계 → 3D 프린트. 퀵릴리즈 hip 연결부 포함',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 1~2',
    },
    links: [],
    location3D: { part: 'torso', position: 'various', internalId: 'brackets' },
  },

  camera_mount: {
    name: '카메라 마운트 (3D 프린트)',
    category: 'printed',
    specs: {
      type: '카메라 고정 브래킷',
      material: 'PLA',
      note: '수집 이미 완료 → 위치/각도 확정 상태, 변경 금지 (수집·추론 동일 조건 보장)',
    },
    usage: {
      description:
        '머리 내부 카메라 고정 마운트. 수집 초기에 SO-ARM 작업 공간 실측 후 위치/각도 확정. 수집과 추론에서 동일 카메라 조건 보장이 핵심',
      parts: ['head'],
      quantity: 1,
      spares: 1,
      owner: '인혁',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: '완료',
    },
    links: [],
    location3D: { part: 'head', position: 'front_center', internalId: 'cam_mount' },
  },

  air_test_jig: {
    name: '공중 테스트 지그 (3D 프린트)',
    category: 'printed',
    specs: {
      type: '보행 테스트용 매달기 지그',
      material: 'PLA / PETG',
      purpose: '공중에서 다리 보행 동작 검증 (지면 접촉 없이)',
    },
    usage: {
      description:
        'W-4 공중 보행 테스트용 지그. BHL 하반신을 공중에 매달아 Walking RL policy 동작 검증. 지면 보행 전 안전한 사전 테스트',
      parts: [],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '3D프린트',
      status: 'pending',
      estimatedArrival: 'W-5',
    },
    links: [],
    location3D: null,
  },

  foot_cover: {
    name: '발 커버',
    category: 'exterior',
    specs: {
      type: '외장 커버 (TPU 3D 프린트 우선, EVA 폼 대체 가능)',
      purpose: '캐릭터 신발 느낌 + 바닥 그립/보호',
      material: 'TPU (3D 프린트, 유연) 권장. EVA 폼은 시트 컷팅으로 대체 가능 (3D 프린트 아님)',
    },
    usage: {
      description:
        'BHL 다리 발 부분 외장 커버. 캐릭터 신발 디자인 + 바닥 마찰 확보. W-2 마무리 단계 인혁 제작 (이전 Week 7 모델 → W-2~W-1로 이동)',
      parts: ['left_leg', 'right_leg'],
      quantity: 2,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '3D프린트/한국',
      status: 'pending',
      estimatedArrival: 'W-2',
    },
    links: [],
    location3D: { part: 'left_leg', position: 'foot', internalId: 'foot_cover' },
  },

  // ===========================================================================
  // 외장/조형
  // ===========================================================================
  head_shell_styrofoam: {
    name: '머리 외주 스티로폼 CNC 조형물',
    category: 'exterior',
    specs: {
      type: '스티로폼 CNC 절삭 조형물',
      weight: '≤300g',
      height: '~25cm',
      process: 'ε2 3D 모델링(Blender/Fusion360) → STL → 외주 CNC 절삭',
      surface_finish: '사포(#200→#400) → 서피서 2회 → 수성 도료 도장',
      openings: '카메라 개구부, 입 서보 개구부, 배선 통로(목)',
      plan_b: '외주 납기 지연 시 스티로폼 수작업 (열선 커터 + 칼 + 사포)',
    },
    usage: {
      description:
        '하이리온 캐릭터 머리 외형. 내부에 카메라, SG90급 입 서보 장착. 전체 머리 무게 ≤700g(외주 ≤300g + 전자부품 ≤400g). 현재(W-6) 기준 외주 제작 중 → W-3 입고 + 전자부품 통합 + 상하체 결합',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: '상윤',
    },
    procurement: {
      channel: '외주 CNC',
      status: 'in_progress',
      estimatedArrival: 'W-3',
    },
    links: [],
    location3D: { part: 'head', position: 'shell', internalId: 'head_shell' },
  },

  body_fabric_cover: {
    name: '바디 천 커버 (토르소 외장)',
    category: 'exterior',
    specs: {
      type: '하이리온 캐릭터 컬러 천/펠트',
      attachment: '벨크로 (탈착 가능, 유지보수 용이)',
      ventilation: '배기구/흡기구 부분 메쉬 소재',
      structure: '프로파일 프레임 위에 씌우는 방식',
    },
    usage: {
      description:
        '토르소 외장 커버. 알루미늄 프로파일 프레임 위에 하이리온 컬러 천을 벨크로로 고정. 환기구 메쉬 처리. W-4 상체 외장/마감 단계 상윤 제작',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: '상윤',
    },
    procurement: {
      channel: '한국',
      status: 'pending',
      estimatedArrival: 'W-4',
    },
    links: [],
    location3D: { part: 'torso', position: 'exterior', internalId: 'body_cover' },
  },

  eva_protection: {
    name: 'EVA 보호대',
    category: 'exterior',
    specs: {
      type: 'EVA 폼 보호 패드',
      purpose: '보행 중 낙상 시 외부 충격 완화',
    },
    usage: {
      description:
        '다리 외부 충격 완화용 EVA 보호대. 보행 테스트 시 낙상 대비',
      parts: ['left_leg', 'right_leg'],
      quantity: 2,
      spares: 0,
      owner: '인혁',
    },
    procurement: {
      channel: '한국',
      status: 'pending',
      estimatedArrival: 'W-4',
    },
    links: [],
    location3D: { part: 'left_leg', position: 'exterior', internalId: 'eva_pad' },
  },

  dummy_weight: {
    name: '더미 웨이트 (상체 시뮬레이션용)',
    category: 'structure',
    specs: {
      type: '조절식 더미 웨이트',
      adjustment: '100g 단위 조절 가능',
      purpose: 'W-3 상하체 결합 전 하체 공중/지면 보행 테스트용 상체 무게 모사',
    },
    usage: {
      description:
        'W-4 공중 지그 + 지면 보행 테스트에서 상체 무게를 모사. δ1 상체 실측값 기반으로 δ2가 100g 단위로 조절. W-3 실체 상하체 결합 전까지 사용',
      parts: [],
      quantity: 1,
      spares: 0,
      owner: '승민',
    },
    procurement: {
      channel: '기보유',
      status: 'confirmed',
      estimatedArrival: null,
    },
    links: [],
    location3D: null,
  },
};

// =============================================================================
// 유틸리티: 카테고리별 필터, 부품별 필터, 소유자별 필터
// =============================================================================

export function getComponentsByCategory(category) {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.category === category)
    .map(([id, c]) => ({ id, ...c }));
}

export function getComponentsByPart(partId) {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.usage.parts.includes(partId))
    .map(([id, c]) => ({ id, ...c }));
}

export function getComponentsByOwner(ownerId) {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.usage.owner === ownerId)
    .map(([id, c]) => ({ id, ...c }));
}

export function getComponentsByStatus(status) {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.procurement.status === status)
    .map(([id, c]) => ({ id, ...c }));
}

export function getComponentsByChannel(channel) {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.procurement.channel === channel)
    .map(([id, c]) => ({ id, ...c }));
}

export function getTotalComponentCount() {
  return Object.values(COMPONENTS).reduce((sum, c) => sum + c.usage.quantity, 0);
}

export function getComponentsWithSpares() {
  return Object.entries(COMPONENTS)
    .filter(([, c]) => c.usage.spares > 0)
    .map(([id, c]) => ({ id, ...c }));
}
