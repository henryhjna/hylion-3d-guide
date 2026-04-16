export const GLOSSARY = {
  // ──────────────────────────────────────────────
  // Robot / Mecha
  // ──────────────────────────────────────────────
  "URDF": {
    full: "Unified Robot Description Format",
    definition: "로봇의 링크, 조인트, 질량, 관성 등을 XML로 기술하는 표준 포맷. ROS 생태계에서 시뮬레이션과 시각화의 기본 입력으로 사용된다.",
    related: ["USD", "MJCF"],
    links: [{ label: "ROS URDF 문서", url: "https://wiki.ros.org/urdf" }],
  },
  "USD": {
    full: "Universal Scene Description",
    definition: "Pixar가 개발한 3D 장면 기술 포맷. NVIDIA Isaac 생태계에서 시뮬레이션 씬의 표준 포맷으로 사용되며, URDF를 USD로 변환하여 IsaacLab에 로드한다.",
    related: ["URDF", "IsaacLab"],
  },
  "MJCF": {
    full: "MuJoCo XML Format",
    definition: "MuJoCo 물리 엔진 전용 로봇/환경 기술 포맷. Sim2sim 검증 시 IsaacLab(USD) 결과를 MuJoCo(MJCF)에서 재현하여 교차 검증한다.",
    related: ["MuJoCo", "URDF", "Sim2sim"],
  },
  "사이클로이드 기어박스": {
    definition: "사이클로이드 곡선을 이용한 감속 기어 메커니즘. BHL 다리 액추에이터에 3D 프린트로 제작하여 사용하며, 높은 감속비와 백드라이버빌리티를 동시에 제공한다.",
    related: ["백드라이버블", "BHL"],
  },
  "백드라이버블": {
    definition: "외부 힘으로 관절을 밀면 모터가 따라 돌아가는 특성. 전원 차단 시 관절이 풀리며 로봇이 안전하게 주저앉으므로 안전 설계의 핵심이다.",
    related: ["사이클로이드 기어박스"],
  },
  "CAN 버스": {
    full: "Controller Area Network Bus",
    definition: "자동차·산업용 실시간 직렬 통신 프로토콜. BHL 다리는 CAN-USB 어댑터 2개로 2개 CAN 버스 (다리당 1)를 구성하여 12개 액추에이터를 1Mbps, 250Hz로 제어한다.",
    related: ["NUC", "CAN-USB"],
  },
  "DOF": {
    full: "Degrees of Freedom (자유도)",
    definition: "로봇 관절이 독립적으로 움직일 수 있는 축의 수. BHL 다리는 6DOF x 2 = 12DOF, SO-ARM은 6DOF x 2 = 12DOF이다.",
  },
  "그리퍼": {
    definition: "로봇 팔 끝에 달린 물체 파지 장치. SO-ARM101 그리퍼의 jaw 간격은 약 5~6cm이며, 필요 시 고무 패드를 부착하여 그립력을 보강한다.",
    related: ["jaw", "SO-ARM"],
  },
  "jaw": {
    definition: "그리퍼의 물체를 집는 손가락 부분. SO-ARM101의 jaw 간격은 약 5~6cm으로, 컵이나 텀블러 같은 물체를 잡을 수 있다.",
    related: ["그리퍼"],
  },
  "토크": {
    definition: "회전력. 서보 모터가 관절을 돌리는 힘의 크기를 나타내며, 안전을 위해 SO-ARM 서보의 토크를 60%로 제한한다.",
  },
  "퀵릴리즈": {
    definition: "공구 없이 빠르게 분리/결합 가능한 체결 구조. 토르소와 BHL hip을 퀵릴리즈 핀으로 연결하여 운송 시 분리, 현장에서 10분 내 조립할 수 있다.",
  },
  "히트인서트": {
    definition: "열을 가해 3D 프린트 플라스틱에 박아 넣는 금속 나사산 인서트. 반복 체결에도 나사산이 손상되지 않아 조립/분해가 잦은 부분에 사용한다.",
  },
  "리밍": {
    definition: "리머(reamer) 공구로 구멍의 내경을 정밀하게 다듬는 후가공 공정. 3D 프린트된 기어박스의 베어링 시트를 리밍하여 정확한 끼워맞춤을 확보한다.",
    related: ["서포트 제거"],
  },
  "서포트 제거": {
    definition: "3D 프린트 시 오버행 구조를 받쳐주는 서포트 재료를 출력 후 제거하는 공정. 기어박스 후가공의 첫 단계이다.",
    related: ["리밍"],
  },

  // ──────────────────────────────────────────────
  // AI / ML
  // ──────────────────────────────────────────────
  "SmolVLA": {
    full: "Small Vision-Language-Action Model",
    definition: "HuggingFace의 경량 VLA 모델 (450M 파라미터). 카메라 이미지와 언어 명령을 입력받아 로봇 관절 동작을 직접 출력한다. 하이리온에서는 LeRobot 프레임워크(PyTorch) 기반으로 물체 집기(pick-place)에 사용하며, Orin에서 TensorRT 변환 후 비동기 추론한다.",
    related: ["VLA", "LeRobot", "TensorRT", "파인튜닝"],
    links: [{ label: "SmolVLA 블로그", url: "https://huggingface.co/blog/smolvla" }],
  },
  "VLA": {
    full: "Vision-Language-Action Model",
    definition: "시각(Vision), 언어(Language), 행동(Action)을 하나의 모델로 통합한 AI 아키텍처. 카메라 영상과 자연어 명령으로부터 로봇 동작을 직접 생성한다.",
    related: ["SmolVLA"],
  },
  "TensorRT": {
    definition: "NVIDIA의 딥러닝 추론 최적화 엔진. SmolVLA 모델을 TensorRT로 변환하여 Orin에서 실시간 추론 속도(5Hz 이상 목표)를 확보한다.",
    related: ["Orin", "SmolVLA", "CUDA"],
    links: [{ label: "TensorRT 공식", url: "https://developer.nvidia.com/tensorrt" }],
  },
  "IsaacLab": {
    definition: "NVIDIA의 로봇 시뮬레이션 프레임워크. USD 기반 물리 시뮬레이션 환경에서 Walking RL 학습과 sim-to-real 전이를 수행한다. BHL 환경이 이미 검증되어 있다.",
    related: ["USD", "sim-to-real", "domain randomization", "Newton"],
    links: [{ label: "IsaacLab GitHub", url: "https://github.com/isaac-sim/IsaacLab" }],
  },
  "Newton": {
    definition: "Isaac Lab 3.0 beta(develop 브랜치)에서 제공되는 대안 물리 백엔드. DGX Spark(SM 12.1 Blackwell)에서 PhysX GPU가 지원되지 않으므로, GPU 가속 RL 훈련을 위해 Newton을 사용한다. BHL의 공식 스택은 Isaac Lab 2.1.0 + PhysX이므로 Newton 사용을 위해 Isaac Lab 3.0 마이그레이션이 필요하다. 첫 실행 시 JIT 컴파일에 약 1시간 소요 (~42커널, ~436MB 캐시).",
    related: ["IsaacLab", "Walking RL", "sim-to-real", "PhysX"],
  },
  "sim-to-real": {
    definition: "시뮬레이션에서 학습한 정책(policy)을 실제 로봇에 적용하는 전이 기법. 시뮬레이션과 현실의 차이(gap)를 줄이는 것이 핵심 과제이다.",
    related: ["Sim2sim", "domain randomization", "IsaacLab"],
  },
  "Sim2sim": {
    definition: "서로 다른 시뮬레이터 간 교차 검증. IsaacLab에서 학습한 Walking RL 정책을 MuJoCo에서 재실행하여 시뮬레이터 간 일관성을 확인한다.",
    related: ["sim-to-real", "MuJoCo", "IsaacLab"],
  },
  "domain randomization": {
    definition: "시뮬레이션 학습 시 물리 파라미터(질량, 마찰, 관성 등)를 의도적으로 랜덤하게 변형하여, 현실 환경에 강건한 정책을 학습시키는 기법. 하이리온에서는 DR ±20%를 적용한다.",
    related: ["sim-to-real", "IsaacLab"],
  },
  "Walking RL": {
    definition: "강화학습(Reinforcement Learning)을 이용한 이족보행 학습. DGX에서 IsaacLab 환경으로 학습하고, 학습된 정책을 NUC에서 실행하여 BHL 다리를 제어한다.",
    related: ["보상 함수", "policy", "IsaacLab"],
  },
  "파인튜닝": {
    definition: "사전 학습된 모델을 특정 태스크 데이터로 추가 학습하는 기법. SmolVLA를 LeRobot Hub 공개 데이터(Stage 1)와 자체 600 에피소드(Stage 2)로 2단계 파인튜닝한다.",
    related: ["SmolVLA", "LeRobot"],
  },
  "LeRobot": {
    definition: "HuggingFace의 로봇 학습 프레임워크. SmolVLA 학습·수집·배포에 사용하며, LeRobot Hub에서 공개 데이터셋을 활용하여 Stage 1 파인튜닝을 진행한다.",
    related: ["SmolVLA", "파인튜닝"],
    links: [{ label: "LeRobot Hub", url: "https://huggingface.co/lerobot" }],
  },
  "ablation": {
    definition: "모델이나 학습 파이프라인에서 구성 요소를 하나씩 제거/변경하며 각 요소의 기여도를 분석하는 실험 방법. SmolVLA 데이터 조합 최적화에 활용한다.",
    related: ["SmolVLA", "파인튜닝"],
  },
  "에피소드": {
    definition: "로봇 학습에서 하나의 태스크 수행 전체(시작~완료)를 기록한 데이터 단위. 하이리온은 물체 3종 x 200개 = 총 600 에피소드를 수집한다.",
    related: ["텔레오퍼레이션", "모방학습"],
  },
  "텔레오퍼레이션": {
    definition: "사람이 리더 로봇을 조작하면 팔로워 로봇이 동일 동작을 수행하는 원격 조종 방식. 데이터 수집 시 리더-팔로워 텔레오퍼레이션으로 에피소드를 기록한다.",
    related: ["에피소드", "모방학습"],
  },
  "policy": {
    definition: "관측(observation)을 입력받아 행동(action)을 출력하는 학습된 정책. Walking RL policy는 NUC에서, SmolVLA policy는 Orin에서 실행한다.",
    related: ["Walking RL", "SmolVLA"],
  },
  "보상 함수": {
    definition: "강화학습에서 에이전트의 행동이 얼마나 좋은지를 수치로 평가하는 함수. Walking RL의 보상 함수를 조정하여 보행 안정성과 속도를 최적화한다.",
    related: ["Walking RL", "policy"],
  },
  "MuJoCo": {
    full: "Multi-Joint dynamics with Contact",
    definition: "고정밀 접촉 역학 물리 시뮬레이터. Sim2sim 검증에서 IsaacLab 결과를 MuJoCo에서 재현하여 교차 검증한다.",
    related: ["Sim2sim", "MJCF", "IsaacLab"],
    links: [{ label: "MuJoCo 공식", url: "https://mujoco.org/" }],
  },
  "모방학습": {
    definition: "사람의 시범(demonstration) 데이터를 학습하여 로봇이 동일한 행동을 재현하는 학습 방식. SmolVLA는 텔레오퍼레이션으로 수집한 에피소드 데이터로 모방학습을 수행한다.",
    related: ["텔레오퍼레이션", "에피소드", "SmolVLA"],
  },

  // ──────────────────────────────────────────────
  // Computing
  // ──────────────────────────────────────────────
  "Orin": {
    full: "NVIDIA Jetson Orin Nano Super",
    definition: "NVIDIA의 엣지 AI 컴퓨팅 보드. Whisper STT(local), Cloud LLM API(Gemini Flash/GPT-4o mini), Local LLM fallback(Qwen 2.5 0.5B Q4, Ollama), Piper TTS(local), SmolVLA 450M(LeRobot/PyTorch/TensorRT), 명령 매핑(YAML), Jetson.GPIO(입 서보 PWM), OpenCV(카메라). TDP 25W.",
    related: ["JetPack", "TensorRT", "CUDA"],
    links: [{ label: "Jetson Orin 공식", url: "https://developer.nvidia.com/embedded/jetson-orin" }],
  },
  "JetPack": {
    definition: "NVIDIA Jetson 보드용 SDK. OS 이미지, CUDA, cuDNN, TensorRT 등을 포함하며, Orin 초기 셋업 시 가장 먼저 설치한다.",
    related: ["Orin", "CUDA", "cuDNN", "TensorRT"],
    links: [{ label: "JetPack 공식", url: "https://developer.nvidia.com/embedded/jetpack" }],
  },
  "CUDA": {
    full: "Compute Unified Device Architecture",
    definition: "NVIDIA GPU에서 범용 병렬 연산을 수행하기 위한 플랫폼 및 프로그래밍 모델. TensorRT, SmolVLA 추론 등 모든 GPU 연산의 기반이다.",
    related: ["cuDNN", "TensorRT", "Orin"],
  },
  "cuDNN": {
    full: "CUDA Deep Neural Network Library",
    definition: "NVIDIA의 딥러닝 기본 연산(합성곱, 풀링 등) 가속 라이브러리. JetPack에 포함되어 TensorRT와 함께 추론 성능을 최적화한다.",
    related: ["CUDA", "TensorRT"],
  },
  "NUC": {
    full: "Next Unit of Computing (BeeLink N95)",
    definition: "초소형 PC. C언어 메인 컨트롤러로 Walking RL policy(ONNX Runtime C API, MLP 250Hz, Isaac Gym 모델) 실행, SocketCAN으로 USB-CAN ×2 제어, Arduino USB Serial로 BNO085 IMU 수신. UDP Server(udp_joystick.py 호환)로 Orin에서 보행 명령 수신. xanmod RT 커널.",
    related: ["xanmod", "RT 커널", "CAN 버스"],
  },
  "xanmod": {
    definition: "일반 사용자용 Linux 커스텀 커널. 낮은 지연 시간(low latency)에 최적화되어 있으며, RT(Real-Time) 패치를 적용하여 NUC에서 250Hz CAN 제어의 실시간성을 보장한다.",
    related: ["RT 커널", "NUC"],
  },
  "RT 커널": {
    full: "Real-Time Kernel",
    definition: "실시간 처리를 보장하는 Linux 커널 변형. 스케줄링 지연을 최소화하여 BHL 다리 모터 제어의 250Hz 루프가 안정적으로 동작하도록 한다.",
    related: ["xanmod", "NUC"],
  },
  "GPIO": {
    full: "General Purpose Input/Output",
    definition: "범용 디지털 입출력 핀. Orin에서 입 서보(SG90) PWM 제어에 사용한다.",
    related: ["PWM"],
  },
  "PWM": {
    full: "Pulse Width Modulation",
    definition: "펄스 폭 변조. 디지털 신호의 듀티 사이클(ON/OFF 비율)을 조절하여 서보 모터(입 서보 SG90)나 LED 밝기를 제어한다.",
    related: ["GPIO"],
  },
  "I2C": {
    full: "Inter-Integrated Circuit",
    definition: "2선식 직렬 통신 프로토콜. AS5600 인코더↔ESC, BNO085 IMU↔Arduino 등에 사용한다.",
    related: ["SPI"],
  },
  "SPI": {
    full: "Serial Peripheral Interface",
    definition: "고속 직렬 통신 프로토콜. I2C보다 빠르며, 일부 센서나 디스플레이 연결에 사용할 수 있다.",
    related: ["I2C"],
  },
  "MOSFET": {
    full: "Metal-Oxide-Semiconductor Field-Effect Transistor",
    definition: "전자 스위치로 사용되는 반도체 소자. B-G431B-ESC1 내부의 3-phase MOSFET 드라이버가 BLDC 모터를 구동한다.",
    related: ["ESC", "FOC", "BLDC"],
  },
  "ISR": {
    full: "Interrupt Service Routine",
    definition: "하드웨어 인터럽트 발생 시 즉시 실행되는 핸들러 함수. ESC의 FOC 루프에서 사용된다.",
    related: ["HW 인터럽트", "ESC"],
  },
  "HW 인터럽트": {
    full: "Hardware Interrupt (하드웨어 인터럽트)",
    definition: "외부 하드웨어 이벤트(센서 신호 등)가 발생하면 CPU에 즉시 알리는 메커니즘. 소프트웨어 폴링보다 지연이 짧아 안전 차단에 적합하다.",
    related: ["ISR"],
  },
  "DGX": {
    full: "DGX Spark",
    definition: "NVIDIA의 고성능 AI 학습 서버. SmolVLA 파인튜닝과 Walking RL 학습을 DGX에서 수행한 뒤, 학습 완료 모델을 Orin/NUC로 배포한다.",
    related: ["SmolVLA", "Walking RL"],
  },

  // ──────────────────────────────────────────────
  // Communication
  // ──────────────────────────────────────────────
  "Ethernet": {
    definition: "유선 네트워크 통신 규격. Orin과 NUC를 Ethernet 직결로 연결하여 Ethernet UDP로 vx vy wz 보행 명령을 전달한다.",
    related: ["NUC", "Orin"],
  },
  "USB-C": {
    definition: "범용 직렬 버스(USB) Type-C 커넥터. 카메라, 오디오 장치 등을 Orin에 연결하는 데 사용한다.",
  },
  "TTL": {
    full: "Transistor-Transistor Logic",
    definition: "디지털 신호 전압 규격(0V/5V 또는 0V/3.3V). STS3215 서보의 기본 통신 전기 규격이며, BusLinker가 USB-TTL 변환을 담당한다.",
    related: ["RS-485"],
  },
  "RS-485": {
    definition: "장거리 차동 신호 직렬 통신 규격. TTL보다 노이즈에 강하고 전송 거리가 길어, 다수의 서보를 데이지체인 연결할 때 사용할 수 있다.",
    related: ["TTL"],
  },
  "보레이트": {
    full: "Baud Rate",
    definition: "직렬 통신의 초당 심볼 전송 속도(bps). STS3215 서보는 1Mbps(1,000,000bps)로 설정하여 고속 통신을 수행한다.",
    related: ["TTL"],
  },
  "CAN-USB": {
    definition: "CAN 버스와 USB를 변환하는 어댑터. BHL 다리 제어에서 NUC와 모터 드라이버(ESC) 간 CAN 통신 인터페이스로 사용한다. 하이리온은 2개 사용.",
    related: ["CAN 버스", "NUC"],
  },

  // ──────────────────────────────────────────────
  // Audio / Vision
  // ──────────────────────────────────────────────
  "손목 카메라": {
    full: "Wrist Camera (hand-eye view)",
    definition: "SO-ARM 그리퍼 부근에 장착하는 USB 카메라. SmolVLA 매니퓰레이션 추론의 입력으로 사용된다. 머리 카메라(대화용)와 용도가 구분되며, Week 1에서 위치·각도를 확정한 후 변경하지 않는다.",
    related: ["SmolVLA", "머리 카메라"],
  },
  "lip sync": {
    definition: "TTS 재생 중 입 서보(SG90)를 open, 묵음 시 close하는 단순 동작. 정밀 립싱크가 아닌 open/close 방식. 선택적으로 오디오 볼륨 threshold 기반으로 자연스럽게 구현 가능.",
    related: ["TTS"],
  },
  "STT": {
    full: "Speech-to-Text (음성 인식)",
    definition: "음성을 텍스트로 변환하는 기술. 하이리온에서는 Whisper를 Orin에서 로컬 실행한다. 항상 로컬이므로 네트워크 불필요.",
    related: ["TTS", "LLM", "Whisper"],
  },
  "TTS": {
    full: "Text-to-Speech (음성 합성)",
    definition: "텍스트를 음성으로 변환하는 기술. 하이리온에서는 Piper TTS를 Orin에서 로컬 실행한다. ALSA 또는 PulseAudio로 PCM 출력.",
    related: ["STT", "lip sync", "Piper TTS"],
  },
  "LLM": {
    full: "Large Language Model (대규모 언어 모델)",
    definition: "대규모 텍스트 데이터로 학습된 자연어 처리 모델. 하이리온에서는 클라우드 LLM(Gemini Flash 또는 GPT-4o mini)을 WiFi API로 호출하여 대화 생성+명령 분류를 수행한다. WiFi 끊김 시 Qwen 2.5 0.5B Q4(Ollama, 350MB VRAM, 35 t/s)로 자동 전환.",
    related: ["STT", "TTS"],
  },
  "VAD": {
    full: "Voice Activity Detection (음성 활동 감지)",
    definition: "오디오 스트림에서 사람의 음성이 있는 구간만 감지하는 기술. TTS 재생 중 비활성화하여 불필요한 음성 인식 트리거를 방지한다.",
    related: ["STT"],
  },
  "에코 캔슬링": {
    full: "Acoustic Echo Cancellation (AEC)",
    definition: "스피커에서 나온 TTS 음성이 마이크에 재입력되는 것을 제거하는 기술. 로봇이 말하면서 동시에 듣기 위해 필요하며, Week 1에서 필요 여부를 테스트한다.",
    related: ["STT", "TTS"],
  },

  // ──────────────────────────────────────────────
  // Power
  // ──────────────────────────────────────────────
  "LiPo 알람": {
    full: "LiPo Battery Alarm",
    definition: "LiPo 배터리 셀 전압이 설정값 이하로 떨어지면 경고음을 울리는 저가 모니터링 장치. BMS 없이 과방전을 방지하는 간이 솔루션으로, 배터리 1(6S)과 배터리 2(4S) 각각에 장착한다.",
    related: ["SOC", "DC-DC"],
  },
  "DC-DC": {
    full: "DC-DC Converter (직류 변환기)",
    definition: "직류 전압을 다른 직류 전압으로 변환하는 장치. 배터리 2(4S 14.8V)에서 DC-DC로 12V(NUC, 팔 서보), 5V(USB Hub 등)를 생성한다.",
    related: ["벅 컨버터"],
  },
  "SOC": {
    full: "State of Charge (충전 상태)",
    definition: "배터리의 현재 충전량을 백분율로 나타낸 값. LiPo 알람으로 과방전을 방지한다.",
    related: ["LiPo 알람"],
  },
  "NC": {
    full: "Normally Closed (상시 폐합)",
    definition: "평상시 닫혀 있다가 작동 시 열리는 스위치/릴레이 방식. 비상정지 회로에서 NC 차단을 사용하여, 배선 단선 시에도 안전하게 차단되도록 한다.",
  },
  "6S": {
    definition: "LiPo 배터리 셀 구성 표기. 6직렬(6S, 22.2V). 배터리 1(다리 전용, 4000mAh)에 사용한다.",
    related: ["4S", "LiPo 알람"],
  },
  "4S": {
    definition: "LiPo 배터리 셀 구성 표기. 4직렬(4S, 14.8V). 배터리 2(컴퓨트+팔+주변장치, 8000mAh)에 사용한다.",
    related: ["6S", "LiPo 알람"],
  },
  "벅 컨버터": {
    full: "Buck Converter",
    definition: "입력 전압보다 낮은 출력 전압을 만드는 DC-DC 변환기. 배터리 전압을 5V/12V로 강압하여 각 부품에 공급한다.",
    related: ["DC-DC"],
  },

  // ──────────────────────────────────────────────
  // Process
  // ──────────────────────────────────────────────
  "게이트": {
    definition: "프로젝트 진행 가부를 판단하는 체크포인트. 각 게이트(Phase 1/2/3, 합류 등)의 필수 조건을 통과해야 다음 단계로 진행할 수 있다.",
    related: ["체크포인트", "크리티컬 패스"],
  },
  "체크포인트": {
    definition: "프로젝트 내 중간 검증 시점. 예: Week 2 직립 체크포인트에서 IsaacLab 상부 mass 직립을 확인하고, 미달 시 배터리 재배치나 경량화를 결정한다.",
    related: ["게이트"],
  },
  "크리티컬 패스": {
    full: "Critical Path",
    definition: "프로젝트 완료까지 가장 긴 시간이 걸리는 작업 경로. 이 경로의 지연은 전체 일정에 직접 영향을 준다.",
    related: ["게이트", "듀얼 트랙"],
  },
  "듀얼 트랙": {
    definition: "상체(Track A)와 하체(Track B)를 병렬로 개발하는 구조. 각 트랙에 리드가 있고, Week 8에 합류하여 상하체를 결합한다.",
    related: ["크리티컬 패스"],
  },
  "인수인계": {
    definition: "한 담당자가 작업 결과물과 노하우를 다른 담당자에게 넘기는 과정. 예: delta1이 작성한 조립 기준서를 delta2에게 인수인계하여 다리 조립에 활용한다.",
  },

  // ──────────────────────────────────────────────
  // General / Metrics
  // ──────────────────────────────────────────────
  "TTFT": {
    full: "Time To First Token",
    definition: "사용자 입력 후 첫 번째 응답 토큰이 생성되기까지의 시간. 대화 파이프라인의 반응 속도 지표로, Phase 2 게이트에서 500ms 미만을 요구한다.",
    related: ["latency", "LLM"],
  },
  "latency": {
    definition: "요청과 응답 사이의 지연 시간. STT->LLM->TTS 라운드트립 latency를 측정하여 대화 품질을 평가한다.",
    related: ["TTFT", "throughput"],
  },
  "throughput": {
    definition: "단위 시간당 처리할 수 있는 데이터 또는 요청의 양. SmolVLA 추론의 Hz(초당 프레임)가 조작 성능을 결정한다.",
    related: ["FPS", "Hz"],
  },
  "FPS": {
    full: "Frames Per Second",
    definition: "초당 처리/렌더링되는 프레임 수. SmolVLA 추론 속도(5Hz 이상 목표)를 나타낸다.",
    related: ["Hz", "throughput"],
  },
  "Hz": {
    full: "Hertz (헤르츠)",
    definition: "초당 반복 횟수의 단위. BHL CAN 제어 루프 250Hz, SmolVLA 추론 5Hz 등 시스템 각 부분의 제어 주기를 나타낸다.",
    related: ["FPS"],
  },
  "draco": {
    definition: "Google이 개발한 3D 메시 압축 라이브러리. glTF 모델의 용량을 줄여 웹에서 빠르게 로드할 수 있게 한다.",
    related: ["glTF"],
  },
  "glTF": {
    full: "GL Transmission Format",
    definition: "Khronos Group의 3D 모델 전송 표준 포맷. 웹 3D 시각화에서 로봇 모델을 표시하는 데 사용하며, draco 압축을 지원한다.",
    related: ["draco", "STL"],
  },
  "STL": {
    full: "Stereolithography",
    definition: "3D 모델의 표면을 삼각형 메시로 표현하는 파일 포맷. 3D 프린팅 입력 파일과 CNC 외주 발주에 사용한다.",
    related: ["glTF"],
  },

  // ──────────────────────────────────────────────
  // Additional terms from docs
  // ──────────────────────────────────────────────
  "SO-ARM": {
    full: "SO-ARM101",
    definition: "TheRobotStudio의 오픈소스 6DOF 로봇 팔. 하이리온은 SO-ARM101 2개(좌우)를 상체에 장착하여 물체 집기(pick-place)와 제스처를 수행한다.",
    related: ["그리퍼"],
    links: [{ label: "SO-ARM101 GitHub", url: "https://github.com/TheRobotStudio/SO-ARM100" }],
  },
  "BHL": {
    full: "Berkeley Humanoid Lite",
    definition: "UC Berkeley HybridRobotics Lab의 오픈소스 이족보행 로봇 플랫폼. 6DOF x 2 다리, 사이클로이드 기어박스, CAN 통신 기반이며, 하이리온의 하반신으로 사용한다.",
    related: ["사이클로이드 기어박스", "Walking RL", "CAN 버스"],
    links: [
      { label: "BHL 공식 사이트", url: "https://lite.berkeley-humanoid.org" },
      { label: "BHL GitHub", url: "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite" },
      { label: "BHL Docs", url: "https://berkeley-humanoid-lite.gitbook.io/docs" },
    ],
  },
  "BLDC": {
    full: "Brushless DC Motor",
    definition: "브러시리스 직류 모터. BHL 다리 액추에이터에 MAD M6C12(허벅지/무릎)과 5010(발목) BLDC 모터를 사용한다.",
    related: ["사이클로이드 기어박스", "ESC"],
  },
  "ESC": {
    full: "Electronic Speed Controller",
    definition: "BLDC 모터의 속도와 방향을 제어하는 전자 장치. BHL은 B-G431B-ESC1(STM32G431CB) 12개를 사용하며, Recoil-Motor-Controller-BESC 펌웨어(C언어)로 FOC+PD 위치 제어+CAN 프로토콜+AS5600 I2C 드라이버를 구동한다.",
    related: ["BLDC", "CAN 버스"],
  },
  "CoM": {
    full: "Center of Mass (질량 중심)",
    definition: "물체의 질량 분포 중심점. 이족보행 로봇에서 CoM 위치가 직립 안정성을 결정하며, 시뮬레이션의 mass/CoM/inertia를 정확히 반영해야 sim-to-real이 성공한다.",
    related: ["sim-to-real"],
  },
  "PID": {
    full: "Proportional-Integral-Derivative (비례-적분-미분 제어)",
    definition: "가장 널리 쓰이는 피드백 제어 알고리즘. 목표값과 현재값의 오차를 비례·적분·미분 항으로 보정하여 정밀한 위치/속도 제어를 수행한다.",
  },
  "HOVER": {
    definition: "NVlabs의 오픈소스 humanoid locomotion 프레임워크. reward 함수, 도메인 랜덤화, sim2sim MuJoCo 파이프라인을 제공한다. BHL Walking RL에서 reward 구조를 이식하여 사용.",
    related: ["Walking RL", "BONES-SEED", "MuJoCo"],
    links: [{ label: "HOVER GitHub", url: "https://github.com/NVlabs/HOVER" }],
  },
  "BONES-SEED": {
    definition: "NVlabs의 reference motion 데이터셋. 142K+ 모션, ~288시간 분량. standing·walking reference motion을 Walking RL 학습에 활용.",
    related: ["HOVER", "AMASS", "Walking RL"],
  },
  "AMASS": {
    definition: "대규모 인체 모션 캡처 데이터셋. 연구용 무료 라이선스, 신청 후 승인까지 수일 소요. BONES-SEED 보충용 추가 reference motion.",
    related: ["BONES-SEED", "Walking RL"],
    links: [{ label: "AMASS 공식", url: "https://amass.is.tue.mpg.de/" }],
  },
  "smolvla_base": {
    definition: "HuggingFace의 사전학습된 SmolVLA 모델 (450M 파라미터, 487 datasets, ~1천만 프레임). Stage 1 사전학습을 대체.",
    related: ["SmolVLA", "LeRobot", "파인튜닝"],
    links: [{ label: "smolvla_base (HuggingFace)", url: "https://huggingface.co/lerobot/smolvla_base" }],
  },
  "Teacher-Student": {
    definition: "RL 학습 구조. Teacher는 privileged observation으로 학습하고, Student는 실제 센서 기반으로 distillation. Walking RL에서 선택적 사용.",
    related: ["Walking RL", "policy"],
  },
};
