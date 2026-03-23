export const RESOURCES = {
  // ──────────────────────────────────────────────
  // 하체 (BHL)
  // ──────────────────────────────────────────────
  "bhl_site": {
    label: "Berkeley Humanoid Lite 공식 사이트",
    url: "https://lite.berkeley-humanoid.org",
    category: "하체",
    tags: ["BHL", "이족보행", "오픈소스", "로봇 플랫폼"],
  },
  "bhl_github": {
    label: "BHL GitHub 리포지토리",
    url: "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite",
    category: "하체",
    tags: ["BHL", "코드", "lowlevel", "CAN", "URDF"],
  },
  "bhl_docs": {
    label: "BHL GitBook 문서",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs",
    category: "하체",
    tags: ["BHL", "문서", "조립", "Sim2sim", "lowlevel"],
  },

  // ──────────────────────────────────────────────
  // 상체 (SO-ARM / Dynamixel)
  // ──────────────────────────────────────────────
  "so_arm_github": {
    label: "SO-ARM100 GitHub 리포지토리",
    url: "https://github.com/TheRobotStudio/SO-ARM100",
    category: "상체",
    tags: ["SO-ARM", "로봇 팔", "오픈소스", "6DOF", "조립"],
  },
  "dynamixel_docs": {
    label: "Dynamixel e-Manual",
    url: "https://emanual.robotis.com/docs/en/dxl/",
    category: "상체",
    tags: ["Dynamixel", "서보", "XL430", "Protocol 2.0", "ROBOTIS"],
  },
  "dynamixel_xl430": {
    label: "Dynamixel XL430-W250 매뉴얼",
    url: "https://emanual.robotis.com/docs/en/dxl/x/xl430-w250/",
    category: "상체",
    tags: ["XL430", "서보", "스펙시트", "목 서보"],
  },
  "u2d2_manual": {
    label: "U2D2 통신 어댑터 매뉴얼",
    url: "https://emanual.robotis.com/docs/en/parts/interface/u2d2/",
    category: "상체",
    tags: ["U2D2", "USB", "TTL", "RS-485", "Dynamixel"],
  },
  "dynamixel_sdk": {
    label: "Dynamixel SDK GitHub",
    url: "https://github.com/ROBOTIS-GIT/DynamixelSDK",
    category: "소프트웨어",
    tags: ["Dynamixel", "SDK", "Protocol 2.0", "Python", "C"],
  },

  // ──────────────────────────────────────────────
  // AI (SmolVLA / LeRobot / RL)
  // ──────────────────────────────────────────────
  "smolvla_blog": {
    label: "SmolVLA 소개 블로그 (HuggingFace)",
    url: "https://huggingface.co/blog/smolvla",
    category: "AI",
    tags: ["SmolVLA", "VLA", "모방학습", "HuggingFace"],
  },
  "smolvla_model": {
    label: "SmolVLA 모델 (HuggingFace Hub)",
    url: "https://huggingface.co/HuggingFaceTB/SmolVLA-base",
    category: "AI",
    tags: ["SmolVLA", "모델", "파인튜닝", "weights"],
  },
  "lerobot_hub": {
    label: "LeRobot Hub (데이터셋 + 모델)",
    url: "https://huggingface.co/lerobot",
    category: "AI",
    tags: ["LeRobot", "데이터셋", "모방학습", "SO-100"],
  },
  "lerobot_github": {
    label: "LeRobot GitHub 리포지토리",
    url: "https://github.com/huggingface/lerobot",
    category: "AI",
    tags: ["LeRobot", "프레임워크", "학습", "수집", "배포"],
  },
  "isaaclab_github": {
    label: "IsaacLab GitHub 리포지토리",
    url: "https://github.com/isaac-sim/IsaacLab",
    category: "AI",
    tags: ["IsaacLab", "시뮬레이션", "USD", "Walking RL", "NVIDIA"],
  },
  "isaaclab_docs": {
    label: "IsaacLab 공식 문서",
    url: "https://isaac-sim.github.io/IsaacLab/",
    category: "AI",
    tags: ["IsaacLab", "문서", "환경 설정", "domain randomization"],
  },
  "mujoco_site": {
    label: "MuJoCo 공식 사이트",
    url: "https://mujoco.org/",
    category: "AI",
    tags: ["MuJoCo", "물리 시뮬레이션", "Sim2sim", "MJCF"],
  },

  // ──────────────────────────────────────────────
  // 컴퓨팅 (NVIDIA / NUC)
  // ──────────────────────────────────────────────
  "jetson_orin": {
    label: "NVIDIA Jetson Orin 개발자 페이지",
    url: "https://developer.nvidia.com/embedded/jetson-orin",
    category: "컴퓨팅",
    tags: ["Orin", "Jetson", "엣지 AI", "NVIDIA"],
  },
  "jetpack_sdk": {
    label: "NVIDIA JetPack SDK",
    url: "https://developer.nvidia.com/embedded/jetpack",
    category: "컴퓨팅",
    tags: ["JetPack", "CUDA", "cuDNN", "TensorRT", "OS 이미지"],
  },
  "tensorrt_docs": {
    label: "NVIDIA TensorRT 공식 문서",
    url: "https://developer.nvidia.com/tensorrt",
    category: "컴퓨팅",
    tags: ["TensorRT", "추론 최적화", "INT8", "FP16", "NVIDIA"],
  },
  "tensorrt_github": {
    label: "TensorRT GitHub (오픈소스 파서/플러그인)",
    url: "https://github.com/NVIDIA/TensorRT",
    category: "컴퓨팅",
    tags: ["TensorRT", "GitHub", "ONNX", "변환"],
  },
  "xanmod_kernel": {
    label: "XanMod Linux 커널",
    url: "https://xanmod.org/",
    category: "컴퓨팅",
    tags: ["xanmod", "RT 커널", "NUC", "실시간", "리눅스"],
  },

  // ──────────────────────────────────────────────
  // 대화 (Groq / STT / TTS)
  // ──────────────────────────────────────────────
  "groq_console": {
    label: "Groq 개발자 콘솔",
    url: "https://console.groq.com",
    category: "대화",
    tags: ["Groq", "LLM", "STT", "TTS", "API", "클라우드"],
  },
  "groq_docs": {
    label: "Groq API 문서",
    url: "https://console.groq.com/docs",
    category: "대화",
    tags: ["Groq", "API", "Whisper", "스트리밍"],
  },
  "whisper_github": {
    label: "OpenAI Whisper GitHub",
    url: "https://github.com/openai/whisper",
    category: "대화",
    tags: ["Whisper", "STT", "음성 인식", "오프라인", "서바이벌"],
  },
  "piper_github": {
    label: "Piper TTS GitHub",
    url: "https://github.com/rhasspy/piper",
    category: "대화",
    tags: ["Piper", "TTS", "음성 합성", "오프라인", "경량"],
  },
  "gemini_dev": {
    label: "Google Gemini 개발자 페이지",
    url: "https://ai.google.dev",
    category: "대화",
    tags: ["Gemini", "LLM", "폴백", "멀티모달"],
  },

  // ──────────────────────────────────────────────
  // 비전 (MediaPipe)
  // ──────────────────────────────────────────────
  "mediapipe_guide": {
    label: "MediaPipe Solutions 가이드",
    url: "https://ai.google.dev/edge/mediapipe/solutions/guide",
    category: "비전",
    tags: ["MediaPipe", "얼굴 감지", "시선 추적", "CPU"],
  },
  "mediapipe_github": {
    label: "MediaPipe GitHub 리포지토리",
    url: "https://github.com/google-ai-edge/mediapipe",
    category: "비전",
    tags: ["MediaPipe", "GitHub", "비전 AI", "블렌드셰이프"],
  },

  // ──────────────────────────────────────────────
  // 소프트웨어 (ROS2 등)
  // ──────────────────────────────────────────────
  "ros2_docs": {
    label: "ROS2 공식 문서",
    url: "https://docs.ros.org/en/rolling/",
    category: "소프트웨어",
    tags: ["ROS2", "토픽", "노드", "미들웨어"],
  },
  "ros2_humble": {
    label: "ROS2 Humble (LTS) 설치 가이드",
    url: "https://docs.ros.org/en/humble/Installation.html",
    category: "소프트웨어",
    tags: ["ROS2", "설치", "Ubuntu", "Humble"],
  },
  "urdf_wiki": {
    label: "ROS URDF 튜토리얼",
    url: "https://wiki.ros.org/urdf/Tutorials",
    category: "소프트웨어",
    tags: ["URDF", "로봇 모델", "ROS", "시뮬레이션"],
  },
  "neopixel_guide": {
    label: "Adafruit NeoPixel 가이드",
    url: "https://learn.adafruit.com/adafruit-neopixel-uberguide",
    category: "소프트웨어",
    tags: ["NeoPixel", "LED", "WS2812B", "GPIO"],
  },

  // ──────────────────────────────────────────────
  // 안전
  // ──────────────────────────────────────────────
  "esp32_docs": {
    label: "ESP32 공식 문서 (Espressif)",
    url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/",
    category: "안전",
    tags: ["ESP32", "낙상 감지", "ISR", "MOSFET", "GPIO"],
  },
  "mpu6050_datasheet": {
    label: "MPU6050 데이터시트 (InvenSense)",
    url: "https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/",
    category: "안전",
    tags: ["MPU6050", "IMU", "가속도", "자이로", "I2C"],
  },
  "bg431_esc": {
    label: "B-G431B-ESC1 모터 드라이버 (ST)",
    url: "https://www.st.com/en/evaluation-tools/b-g431b-esc1.html",
    category: "하체",
    tags: ["ESC", "BLDC", "모터 드라이버", "CAN", "ST"],
  },
};
