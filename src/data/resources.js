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
    tags: ["BHL", "문서", "조립", "sim-to-real", "lowlevel"],
  },

  // ──────────────────────────────────────────────
  // 상체 (SO-ARM101 STS3215)
  // ──────────────────────────────────────────────
  "so_arm_github": {
    label: "SO-ARM101 GitHub 리포지토리",
    url: "https://github.com/TheRobotStudio/SO-ARM100",
    category: "상체",
    tags: ["SO-ARM", "로봇 팔", "오픈소스", "6DOF", "조립"],
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
    tags: ["LeRobot", "데이터셋", "모방학습", "SO-100/SO-101"],
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
  "feetech_sts3215": {
    label: "Feetech STS3215 서보",
    url: "https://www.feetechrc.com/",
    category: "상체",
    tags: ["Feetech", "STS3215", "서보", "SO-ARM", "TTL"],
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
    tags: ["MuJoCo", "물리 시뮬레이션", "sim-to-real", "MJCF"],
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
  // 대화 (STT / LLM / TTS)
  // ──────────────────────────────────────────────
  "whisper_github": {
    label: "OpenAI Whisper GitHub",
    url: "https://github.com/openai/whisper",
    category: "대화",
    tags: ["Whisper", "STT", "음성 인식", "오프라인", "서바이벌"],
  },

  // ──────────────────────────────────────────────
  // 소프트웨어
  // ──────────────────────────────────────────────
  "urdf_wiki": {
    label: "ROS URDF 튜토리얼",
    url: "https://wiki.ros.org/urdf/Tutorials",
    category: "소프트웨어",
    tags: ["URDF", "로봇 모델", "ROS", "시뮬레이션"],
  },

  // ──────────────────────────────────────────────
  // 안전
  // ──────────────────────────────────────────────
  "bg431_esc": {
    label: "B-G431B-ESC1 모터 드라이버 (ST)",
    url: "https://www.st.com/en/evaluation-tools/b-g431b-esc1.html",
    category: "하체",
    tags: ["ESC", "BLDC", "모터 드라이버", "CAN", "ST"],
  },
  "hover_github": {
    label: "HOVER GitHub",
    url: "https://github.com/NVlabs/HOVER",
    category: "AI",
    tags: ["HOVER", "humanoid", "reward", "locomotion", "NVlabs"],
  },
  "bones_seed": {
    label: "BONES-SEED",
    url: "https://github.com/NVlabs/HOVER",
    category: "AI",
    tags: ["BONES-SEED", "reference motion", "walking", "standing"],
  },
  "amass": {
    label: "AMASS Motion Dataset",
    url: "https://amass.is.tue.mpg.de/",
    category: "AI",
    tags: ["AMASS", "모션 캡처", "reference motion"],
  },
  "rsl_rl": {
    label: "RSL-RL GitHub",
    url: "https://github.com/leggedrobotics/rsl_rl",
    category: "AI",
    tags: ["RSL-RL", "PPO", "RL", "학습"],
  },
  "smolvla_base_hf": {
    label: "smolvla_base (HuggingFace)",
    url: "https://huggingface.co/lerobot/smolvla_base",
    category: "AI",
    tags: ["SmolVLA", "사전학습", "VLA", "450M"],
  },
};
