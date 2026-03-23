// =============================================================================
// HYlion Robot — 부품/하드웨어 데이터베이스 (components.js)
// 기획서 v12 + 실행가이드 v12 기반 전수 추출
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
    name: 'NVIDIA Jetson Orin Nano Super',
    category: 'compute',
    specs: {
      gpu: 'Ampere (1024 CUDA cores)',
      cpu: '6-core Arm Cortex-A78AE',
      memory: '8GB LPDDR5',
      tdp: '25W (기본)',
      ai_performance: '67 TOPS (INT8)',
      storage: 'NVMe SSD (별도)',
      os: 'JetPack 6.x (Ubuntu 22.04)',
      interfaces: 'USB 3.2, Ethernet, GPIO, PWM, I2C, SPI, CSI',
    },
    usage: {
      description:
        'SmolVLA 추론(TensorRT), MediaPipe(CPU), ROS2 마스터, 상태 머신, TTS 재생, LED/입 서보 제어, SO-ARM Dynamixel 제어. 로봇 두뇌 역할',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'NVIDIA Jetson Orin Nano', url: 'https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/' },
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
      tdp: '15W',
      os: 'Ubuntu 22.04 + xanmod RT 커널',
      interfaces: 'USB 3.0, Ethernet, HDMI',
      can_support: 'CAN-USB ×2 → 4 CAN 버스',
    },
    usage: {
      description:
        'BHL lowlevel C 코드 실행, Walking RL policy 추론, CAN 버스 통신으로 10개 액추에이터 250Hz 제어. Orin과 Ethernet 직결(ROS2)',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
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

  esp32: {
    name: 'ESP32 개발 보드',
    category: 'compute',
    specs: {
      cpu: 'Xtensa LX6 듀얼코어 240MHz',
      memory: '520KB SRAM',
      flash: '4MB',
      interfaces: 'I2C, SPI, UART, GPIO, ADC',
      wifi: '802.11 b/g/n',
      bluetooth: 'BLE 4.2',
      voltage: '3.3V (5V USB 입력)',
    },
    usage: {
      description:
        'MPU6050 IMU로 낙상 감지 → 하드웨어 인터럽트(ISR) → N-channel MOSFET으로 배터리 C 전원 즉시 차단. 안전 전용 마이크로컨트롤러',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'ESP32 Datasheet', url: 'https://www.espressif.com/en/products/socs/esp32' },
    ],
    location3D: { part: 'torso', position: 'lower_mid', internalId: 'esp32' },
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
      owner: 'delta3',
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
      type: 'Brushless DC (outrunner)',
      kv: '150 KV',
      application: 'BHL 다리 — 고토크 관절 (hip, knee)',
      weight: '~120g',
      shaft: '6mm',
      voltage: '3S~6S LiPo',
      max_current: '~30A (burst)',
    },
    usage: {
      description:
        'BHL 이족보행 다리의 대형 관절(hip roll/pitch/yaw, knee)용 BLDC 모터. 사이클로이드 기어박스와 결합하여 액추에이터 구성',
      parts: ['left_leg', 'right_leg'],
      quantity: 6,
      spares: 0,
      owner: 'delta2',
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
    name: 'MAD 5010 110KV',
    category: 'motor_bldc',
    specs: {
      type: 'Brushless DC (outrunner)',
      kv: '110 KV',
      application: 'BHL 다리 — 발목 관절',
      weight: '~80g',
      shaft: '5mm',
      voltage: '3S~4S LiPo',
      max_current: '~20A (burst)',
    },
    usage: {
      description:
        'BHL 이족보행 다리의 발목 관절(ankle roll/pitch)용 BLDC 모터. M6C12보다 소형이며 발목에 최적화',
      parts: ['left_leg', 'right_leg'],
      quantity: 4,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'MAD Components', url: 'https://www.mad-motor.com/' },
    ],
    location3D: { part: 'left_leg', position: 'ankle', internalId: 'bldc_5010' },
  },

  // ===========================================================================
  // 서보 모터
  // ===========================================================================
  xl430_w250_t: {
    name: 'Dynamixel XL430-W250-T',
    category: 'motor_servo',
    specs: {
      type: 'Smart Servo (Dynamixel Protocol 2.0)',
      stall_torque: '1.0 N·m (12V)',
      no_load_speed: '57 RPM (12V)',
      resolution: '4096 (0.088°)',
      voltage: '6.5~12V',
      communication: 'TTL (데이지체인)',
      weight: '57.2g',
      feedback: '위치, 속도, 전류, 온도',
    },
    usage: {
      description:
        '목(neck) pan/tilt 서보. 토르소 상단에 배치되며, MediaPipe 얼굴 인식 → PID 제어로 시선 추적 수행. U2D2 #2 버스에 연결 (ID 13~14)',
      parts: ['torso'],
      quantity: 2,
      spares: 0,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'Dynamixel XL430', url: 'https://www.robotis.com/shop/item.php?it_id=902-0135-000' },
    ],
    location3D: { part: 'torso', position: 'top', internalId: 'neck_servo' },
  },

  so_arm_servo: {
    name: 'SO-ARM101 Dynamixel 서보 (STS3215)',
    category: 'motor_servo',
    specs: {
      type: 'Serial Bus Servo (Feetech STS3215)',
      stall_torque: '~15 kg·cm',
      no_load_speed: '~60 RPM',
      resolution: '4096',
      voltage: '6~12V',
      communication: 'TTL Half-Duplex (데이지체인)',
      weight: '~60g',
      feedback: '위치, 속도, 부하, 온도',
      dof_per_arm: '6 (base, shoulder, elbow, wrist_flex, wrist_rotate, gripper)',
    },
    usage: {
      description:
        'SO-ARM101 양팔 로봇팔 관절 구동. 좌팔 6개(ID 1~6) + 우팔 6개(ID 7~12), 총 12개. U2D2 #1(좌팔), U2D2 #2(우팔+목)에 연결. Protocol 2.0 sync read/write 200Hz 제어',
      parts: ['left_arm', 'right_arm'],
      quantity: 12,
      spares: 0,
      owner: 'delta1',
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

  mg90s: {
    name: 'MG90S 마이크로 서보',
    category: 'motor_servo',
    specs: {
      type: 'Analog Micro Servo',
      stall_torque: '2.2 kg·cm (6V)',
      no_load_speed: '0.08 sec/60° (6V)',
      voltage: '4.8~6V',
      signal: 'PWM',
      weight: '13.4g',
      gear: '메탈 기어',
    },
    usage: {
      description:
        '머리 내부 입(lip) 서보. TTS 오디오 타이밍에 맞춰 lip sync 구현. Orin PWM 핀으로 직접 제어',
      parts: ['head'],
      quantity: 1,
      spares: 1,
      owner: 'epsilon2',
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
    name: 'B-G431B-ESC1 (STM32 ESC)',
    category: 'motor_driver',
    specs: {
      mcu: 'STM32G431CB',
      driver: '3-phase MOSFET 드라이버',
      voltage: '6~28V',
      continuous_current: '15A',
      peak_current: '40A',
      communication: 'CAN 2.0B',
      firmware: 'BHL 커스텀 FOC',
      size: '30×15mm',
    },
    usage: {
      description:
        'BHL 다리 BLDC 모터 개별 제어용 ESC. 10개 액추에이터에 각 1개씩, CAN 버스로 NUC에 연결. 250Hz FOC 제어. 사이클로이드 기어박스 내부에 장착',
      parts: ['left_leg', 'right_leg'],
      quantity: 10,
      spares: 2,
      owner: 'delta2',
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

  motor_control_board_waveshare: {
    name: 'Waveshare Motor Control Board',
    category: 'motor_driver',
    specs: {
      type: 'Servo/Motor Control HAT',
      channels: '16-channel PWM',
      communication: 'I2C',
      voltage: '3.3~5V logic',
    },
    usage: {
      description:
        '서보/모터 다채널 PWM 제어 보조. MG90S 입 서보 등 PWM 서보 제어 확장용',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '한국',
      status: 'pending',
      estimatedArrival: 'Week 1',
    },
    links: [
      { label: 'Waveshare', url: 'https://www.waveshare.com/' },
    ],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'motor_ctrl' },
  },

  // ===========================================================================
  // 통신 인터페이스
  // ===========================================================================
  u2d2: {
    name: 'ROBOTIS U2D2',
    category: 'communication',
    specs: {
      type: 'USB ↔ Dynamixel TTL/RS485 변환기',
      protocol: 'Dynamixel Protocol 2.0',
      baudrate: '최대 4.5Mbps (1Mbps 사용)',
      interface: 'USB 2.0',
      connector: 'JST 3-pin (TTL)',
    },
    usage: {
      description:
        'Orin USB → Dynamixel 서보 통신. U2D2 #1: 좌팔 SO-ARM 6개(ID 1~6). U2D2 #2: 우팔 SO-ARM 6개(ID 7~12) + 목 XL430 2개(ID 13~14). 데이지체인 연결',
      parts: ['torso'],
      quantity: 2,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'ROBOTIS U2D2', url: 'https://www.robotis.com/shop/item.php?it_id=902-0132-000' },
    ],
    location3D: { part: 'torso', position: 'upper_mid', internalId: 'u2d2' },
  },

  can_usb: {
    name: 'CAN-USB 어댑터',
    category: 'communication',
    specs: {
      type: 'USB ↔ CAN 2.0B 변환기',
      baudrate: '1Mbps',
      interface: 'USB 2.0',
      channels: '2개 USB → 4 CAN 버스 (각 어댑터 2 버스)',
    },
    usage: {
      description:
        'NUC USB → BHL 다리 CAN 버스 통신. 2개 어댑터로 4개 CAN 버스 구성, 10개 ESC와 250Hz 통신',
      parts: ['torso'],
      quantity: 2,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'mid', internalId: 'can_usb' },
  },

  // ===========================================================================
  // 센서
  // ===========================================================================
  usb_camera: {
    name: 'USB 카메라',
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
        'SmolVLA 추론 입력 + MediaPipe 얼굴 인식(시선 추적). 머리 내부 정면 장착. Week 1에서 위치/각도 확정 후 변경 금지 (수집/추론 동일 조건 보장). /camera/image_raw ROS2 토픽으로 공유',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '한국',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'head', position: 'front_center', internalId: 'camera' },
  },

  mpu6050: {
    name: 'MPU6050 6축 IMU',
    category: 'sensor',
    specs: {
      type: '6-DOF IMU (3축 가속도 + 3축 자이로)',
      accelerometer: '±2/4/8/16g',
      gyroscope: '±250/500/1000/2000°/s',
      communication: 'I2C (400kHz)',
      voltage: '3.3~5V',
      size: '~20×16mm',
    },
    usage: {
      description:
        '낙상 감지용 IMU (ESP32 I2C 연결 → 기울기 임계값 초과 시 하드웨어 인터럽트 → MOSFET 차단). NUC용 policy IMU와 별도 운용 가능',
      parts: ['torso'],
      quantity: 2,
      spares: 1,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'MPU6050 Datasheet', url: 'https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/' },
    ],
    location3D: { part: 'torso', position: 'center', internalId: 'imu' },
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
        '음성 입력 캡처. Orin USB 오디오로 연결. Groq STT(온라인) 또는 Whisper tiny(서바이벌 모드)에 입력. 스피커와 에코 캔슬링 테스트 필요',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'head', position: 'front_lower', internalId: 'mic' },
  },

  // ===========================================================================
  // 입출력 장치
  // ===========================================================================
  speaker: {
    name: '소형 스피커',
    category: 'io_device',
    specs: {
      type: 'USB 또는 3.5mm 소형 스피커',
      power: '3~5W',
      interface: 'USB Audio / 3.5mm',
    },
    usage: {
      description:
        'TTS 음성 출력. Orin USB 오디오로 연결. Groq TTS(온라인) 또는 Piper TTS(서바이벌 오프라인). 인사/대화 음성 재생, lip sync 타이밍 기준 제공',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon1',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'upper_front', internalId: 'speaker' },
  },

  neopixel_led: {
    name: 'NeoPixel LED (WS2812B)',
    category: 'io_device',
    specs: {
      type: 'Addressable RGB LED',
      voltage: '5V',
      communication: '단선 직렬 (Orin GPIO)',
      colors: '16.7M (24-bit RGB)',
      brightness: '~20mA per color per LED',
    },
    usage: {
      description:
        '머리 눈 LED. 감정 5종 표현 (중립/기쁨/놀람/슬픔/분노). 반투명 디퓨저(아크릴/실리콘) 뒤에 장착. Orin GPIO로 직접 제어. Week 5에서 5종 확장',
      parts: ['head'],
      quantity: 2,
      spares: 2,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'NeoPixel Guide', url: 'https://learn.adafruit.com/adafruit-neopixel-uberguide' },
    ],
    location3D: { part: 'head', position: 'eyes', internalId: 'led_eyes' },
  },

  // ===========================================================================
  // 전원 시스템
  // ===========================================================================
  battery_a: {
    name: '배터리 A (컴퓨팅/IO)',
    category: 'power',
    specs: {
      config: '3S2P (11.1V nominal)',
      capacity: '~5000mAh',
      chemistry: 'Li-ion / LiPo',
      discharge: '5~10C',
      voltage_range: '9.0~12.6V',
      loads: 'Orin(25W), NUC(15W), LED, 입 서보, 스피커',
    },
    usage: {
      description:
        '컴퓨팅 보드(Orin, NUC) + IO 장치(LED, 스피커, 입 서보) 전원. 비상정지 시에도 A는 유지하여 Orin 로그 보존. DC-DC 통해 5V/12V/19V 공급',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'bottom', internalId: 'battery_a' },
  },

  battery_b: {
    name: '배터리 B (서보)',
    category: 'power',
    specs: {
      config: '3S3P (11.1V nominal)',
      capacity: '~7500mAh',
      chemistry: 'Li-ion / LiPo',
      discharge: '5~10C',
      voltage_range: '9.0~12.6V',
      loads: 'SO-ARM Dynamixel ×12, 목 XL430 ×2',
    },
    usage: {
      description:
        'SO-ARM 양팔 12개 서보 + 목 2개 서보 전원. 비상정지 시 NC 스위치로 차단. 토르소 최하단 배치 (CoM 낮추기)',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'bottom', internalId: 'battery_b' },
  },

  battery_c: {
    name: '배터리 C (BHL 다리)',
    category: 'power',
    specs: {
      config: 'BHL 원본 사양',
      chemistry: 'LiPo',
      loads: 'BHL BLDC ×10, ESP32',
      note: 'BHL 공식 문서 권장 사양 준수',
    },
    usage: {
      description:
        'BHL 다리 BLDC 모터 10개 + ESP32 전원. 다리 프레임에 장착. ESP32 MOSFET으로 긴급 차단 가능. 비상정지 NC 스위치로도 차단',
      parts: ['left_leg', 'right_leg'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [
      { label: 'BHL Docs', url: 'https://berkeley-humanoid-lite.gitbook.io/docs' },
    ],
    location3D: { part: 'left_leg', position: 'hip_frame', internalId: 'battery_c' },
  },

  bms: {
    name: 'BMS (Battery Management System)',
    category: 'power',
    specs: {
      type: '3S 리튬 배터리 보호 회로',
      protection: '과충전, 과방전, 과전류, 단락 보호',
      balance: '셀 밸런싱',
      quantity_note: '배터리 A/B/C 각각 1개씩 총 3개',
    },
    usage: {
      description:
        '배터리 A, B, C 각각에 BMS 1개씩 장착. 셀 밸런싱 + 과충전/과방전/과전류 보호. 기성품 사용',
      parts: ['torso', 'left_leg'],
      quantity: 3,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'bottom', internalId: 'bms' },
  },

  pdb: {
    name: 'PDB (Power Distribution Board)',
    category: 'power',
    specs: {
      type: '드론용 전원 분배 보드',
      input: 'XT60 (배터리 입력)',
      output: '다중 XT30/패드',
      current: '최대 120A+',
      features: '전압 분배, 퓨즈 패드',
    },
    usage: {
      description:
        '배터리 전원을 각 서브시스템으로 분배. 기성 드론용 PDB 사용. DC-DC 컨버터와 연동하여 5V/12V/19V 생성',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'lower_mid', internalId: 'pdb' },
  },

  dc_dc_converter: {
    name: 'DC-DC 벅 컨버터',
    category: 'power',
    specs: {
      type: '강압형(Buck) DC-DC 컨버터',
      input: '9~30V',
      output_options: '5V, 12V, 19V (별도 모듈)',
      efficiency: '>90%',
      current: '3~5A per module',
    },
    usage: {
      description:
        '배터리 전압(11.1V nominal)을 Orin(19V), NUC(12V), 서보(12V), LED/로직(5V) 등 각 전압으로 변환. 복수 모듈 사용',
      parts: ['torso'],
      quantity: 3,
      spares: 1,
      owner: 'delta2',
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
  mosfet_n_channel: {
    name: 'N-channel MOSFET',
    category: 'safety',
    specs: {
      type: 'N-channel Power MOSFET',
      vds: '30~60V',
      ids: '30~60A',
      rds_on: '<10mOhm',
      gate_driver: 'ESP32 GPIO 3.3V (게이트 드라이버 또는 레벨 시프터 사용)',
    },
    usage: {
      description:
        'ESP32 낙상 감지 시 배터리 C(다리 BLDC) 전원 즉시 차단. MPU6050 → ESP32 ISR → MOSFET OFF. BHL 다리가 백드라이버블이므로 전원 차단 시 관절이 풀려 안전하게 주저앉음',
      parts: ['torso'],
      quantity: 1,
      spares: 2,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '심천',
      status: 'confirmed',
      estimatedArrival: 'Week 0',
    },
    links: [],
    location3D: { part: 'torso', position: 'lower_mid', internalId: 'mosfet' },
  },

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
        '물리 비상정지. 배터리 B+C 양극 직렬 NC 차단. 누르면 서보 + 다리 BLDC 전원 동시 차단. 배터리 A(컴퓨팅)는 유지하여 Orin 로그 보존',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: 'delta2',
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
      owner: 'delta1',
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
      voltage: '5V or 12V',
      rpm: '5000~7000',
      airflow: '~5 CFM',
      noise: '<25dB',
      connector: '2-pin',
    },
    usage: {
      description:
        'Orin 방열판 위 배기 팬. 토르소 밀폐 시 써멀 스로틀링 방지. 상단 배기구 + 하단 흡기구 구조로 대류 유도',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: 'delta1',
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
    name: '베어링 (사이클로이드 기어박스용)',
    category: 'structure',
    specs: {
      type: '볼 베어링 (다양한 사이즈)',
      material: '크롬강 / 스테인리스',
      application: 'BHL 사이클로이드 기어박스 조립',
    },
    usage: {
      description:
        'BHL 액추에이터 사이클로이드 기어박스 내부 베어링. 기어박스 10세트에 필요한 수량 일괄 구매',
      parts: ['left_leg', 'right_leg'],
      quantity: 30,
      spares: 5,
      owner: 'delta2',
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
      sizes: 'M2, M2.5, M3',
      application: '3D 프린트 부품에 금속 나사산 생성',
    },
    usage: {
      description:
        '3D 프린트 기어박스, 브래킷, 마운트에 열압입하여 볼트 체결점 확보. 반복 분해/조립 가능',
      parts: ['left_leg', 'right_leg', 'torso'],
      quantity: 100,
      spares: 20,
      owner: 'delta1',
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
    name: '배선 부자재',
    category: 'structure',
    specs: {
      items: 'AWG 실리콘 와이어, XT60/XT30 커넥터, JST 커넥터, 수축 튜브, 케이블 타이, 납땜 용품',
    },
    usage: {
      description:
        '전원 배선(배터리→PDB→DC-DC→각 보드), 신호선(CAN, I2C, GPIO), 커넥터 일체 등 전체 배선 부자재',
      parts: ['torso', 'left_leg', 'right_leg', 'head'],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
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
      purpose: 'Orin↔NUC ROS2 직결 통신',
    },
    usage: {
      description:
        'Orin과 NUC 사이 Ethernet 직결. ROS2 토픽 통신: /gait/cmd (Orin→NUC), /gait/status (NUC→Orin)',
      parts: ['torso'],
      quantity: 1,
      spares: 1,
      owner: 'delta2',
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
      reduction_ratio: '~25:1',
      post_processing: '서포트 제거, 리밍, 베어링 시트 정밀 가공',
      print_time: '프린터 2대 병렬, Week 0부터 시작',
    },
    usage: {
      description:
        'BHL 다리 각 관절 액추에이터용 감속기. BLDC 모터(MAD) + ESC + 기어박스 → 1개 액추에이터. 10개 관절에 각 1개씩. 후가공(Week 2 δ2)이 품질에 결정적',
      parts: ['left_leg', 'right_leg'],
      quantity: 10,
      spares: 2,
      owner: 'delta2',
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
      owner: 'delta2',
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
    name: 'SO-ARM101 프레임 (3D 프린트)',
    category: 'printed',
    specs: {
      type: 'SO-ARM101 로봇팔 링크 / 브래킷',
      material: 'PLA',
      dof: '6-DOF per arm',
      parts_list: '베이스, 어깨, 상완, 전완, 손목, 그리퍼 jaw',
      gripper_jaw: '~5~6cm (Week 1 그립 테스트 후 고무 패드 추가 가능)',
    },
    usage: {
      description:
        'SO-ARM101 양팔 로봇팔 프레임. 오픈소스 STL 출력. 좌팔/우팔 각 1세트. Week 0 SO-ARM 커리큘럼에서 조립 시작',
      parts: ['left_arm', 'right_arm'],
      quantity: 2,
      spares: 0,
      owner: 'delta1',
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
      owner: 'delta1',
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
      note: 'Week 1 위치/각도 확정 후 변경 금지',
    },
    usage: {
      description:
        '머리 내부 카메라 고정 마운트. Week 1에서 SO-ARM 작업 공간 실측 후 위치/각도 확정. 수집과 추론에서 동일 카메라 조건 보장이 핵심',
      parts: ['head'],
      quantity: 1,
      spares: 1,
      owner: 'delta1',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 1',
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
        'Week 5 공중 보행 테스트용 지그. BHL 하반신을 공중에 매달아 Walking RL policy 동작 검증. 지면 보행 전 안전한 사전 테스트',
      parts: [],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
    },
    procurement: {
      channel: '3D프린트',
      status: 'confirmed',
      estimatedArrival: 'Week 3',
    },
    links: [],
    location3D: null,
  },

  led_diffuser: {
    name: 'LED 눈 디퓨저',
    category: 'printed',
    specs: {
      type: '반투명 아크릴 또는 실리콘 몰드',
      purpose: 'NeoPixel LED 빛을 균일하게 확산하여 눈 표현',
      manufacturing: '레이저 커팅 또는 실리콘 성형',
    },
    usage: {
      description:
        '머리 눈 부분에 NeoPixel LED 앞에 장착. 빛을 부드럽게 확산하여 캐릭터 눈 표현. Week 5에서 δ1 제작',
      parts: ['head'],
      quantity: 2,
      spares: 1,
      owner: 'delta1',
    },
    procurement: {
      channel: '3D프린트',
      status: 'pending',
      estimatedArrival: 'Week 5',
    },
    links: [],
    location3D: { part: 'head', position: 'eyes', internalId: 'diffuser' },
  },

  foot_cover: {
    name: '발 커버',
    category: 'printed',
    specs: {
      type: 'EVA 폼 또는 3D 프린트',
      purpose: '캐릭터 신발 느낌 + 바닥 그립/보호',
      material: 'EVA 또는 TPU/PLA',
    },
    usage: {
      description:
        'BHL 다리 발 부분 외장 커버. 캐릭터 신발 디자인 + 바닥 마찰 확보. Week 7에서 δ1 제작',
      parts: ['left_leg', 'right_leg'],
      quantity: 2,
      spares: 0,
      owner: 'delta1',
    },
    procurement: {
      channel: '3D프린트',
      status: 'pending',
      estimatedArrival: 'Week 7',
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
      openings: '카메라 개구부, LED 눈 개구부, 입 서보 개구부, 배선 통로(목)',
      plan_b: '외주 납기 지연 시 스티로폼 수작업 (열선 커터 + 칼 + 사포)',
    },
    usage: {
      description:
        '하이리온 캐릭터 머리 외형. 내부에 카메라, NeoPixel LED ×2, MG90S 입 서보 장착. 전체 머리 무게 ≤700g(외주 ≤300g + 전자부품 ≤400g). Week 1 발주 → Week 5~6 도착 목표',
      parts: ['head'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '외주 CNC',
      status: 'pending',
      estimatedArrival: 'Week 5~6',
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
        '토르소 외장 커버. 알루미늄 프로파일 프레임 위에 하이리온 컬러 천을 벨크로로 고정. 환기구 메쉬 처리. Week 4~5 ε2 제작',
      parts: ['torso'],
      quantity: 1,
      spares: 0,
      owner: 'epsilon2',
    },
    procurement: {
      channel: '한국',
      status: 'pending',
      estimatedArrival: 'Week 4',
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
      owner: 'delta1',
    },
    procurement: {
      channel: '한국',
      status: 'pending',
      estimatedArrival: 'Week 4',
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
      purpose: '상하체 합류(Week 8) 전 하체 보행 테스트용 상체 무게 모사',
    },
    usage: {
      description:
        'Week 6 더미 지면 보행 테스트에서 상체 무게를 모사. δ1 상체 실측값 기반으로 δ2가 100g 단위로 조절. Week 8 실체 합류 전까지 사용',
      parts: [],
      quantity: 1,
      spares: 0,
      owner: 'delta2',
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
