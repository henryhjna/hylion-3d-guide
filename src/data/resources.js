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
  "bhl_paper": {
    label: "BHL 논문 (arXiv)",
    url: "https://arxiv.org/abs/2504.17249",
    category: "하체",
    tags: ["BHL", "논문", "arXiv", "humanoid"],
  },
  "bhl_releases": {
    label: "BHL CAD/STL Releases (GitHub)",
    url: "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite/releases",
    category: "하체",
    tags: ["BHL", "CAD", "STL", "3D 프린트", "Releases"],
  },
  "bhl_onshape": {
    label: "BHL Onshape CAD (팀 공유 — 편집/뷰어) ⭐",
    url: "https://cad.onshape.com/documents/fc6443b1d89dcba950e85b60/w/94a26479973a4098a5884426/e/be3fe37849edbeadc95b9bf8?configuration=default&renderMode=0&uiState=67d7e630bb752737e88992d7",
    category: "하체",
    tags: ["BHL", "Onshape", "CAD", "편집 가능", "뷰어", "팀 공유"],
  },
  "bhl_youtube_playlist": {
    label: "BHL YouTube 재생목록 (공식)",
    url: "https://www.youtube.com/watch?v=5qgEJpEf3pQ&list=PLkKPImegJQxMdfrARhSdNrf62fLh3uQC-",
    category: "하체",
    tags: ["BHL", "YouTube", "튜토리얼", "조립"],
  },

  // BHL 공식 튜토리얼 페이지 (GitBook 서브)
  "bhl_doc_bom": {
    label: "BHL 공식: Bill of Materials (BOM)",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/materials-and-parts-bom",
    category: "하체",
    tags: ["BHL", "BOM", "부품 리스트", "조달"],
  },
  "bhl_doc_tools": {
    label: "BHL 공식: 준비할 도구 (Preparing the Tools)",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/preparing-the-tools",
    category: "하체",
    tags: ["BHL", "도구", "납땜 인두", "Bambu X1C", "hex wrench"],
  },
  "bhl_doc_3dprint": {
    label: "BHL 공식: 3D Printing Instructions",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/3d-printing-instructions",
    category: "하체",
    tags: ["BHL", "3D 프린트", "Bambu X1C", "슬라이싱", "사이클로이드"],
  },
  "bhl_doc_actuator": {
    label: "BHL 공식: Building the Actuator",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/building-the-actuator",
    category: "하체",
    tags: ["BHL", "액추에이터", "조립", "AS5600", "MAD", "솔더링"],
  },
  "bhl_doc_flashing": {
    label: "BHL 공식: Flashing the Motor Controllers",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/flashing-the-motor-controllers",
    category: "하체",
    tags: ["BHL", "ESC 플래싱", "STM32CubeIDE", "Recoil", "CAN ID"],
  },
  "bhl_doc_robot": {
    label: "BHL 공식: Building the Robot",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-hardware/building-the-robot",
    category: "하체",
    tags: ["BHL", "로봇 조립", "배선", "XT60", "WAGO"],
  },
  "bhl_doc_onboard": {
    label: "BHL 공식: On-Board Computer (Ubuntu 22.04 + SocketCAN)",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-software/the-on-board-computer",
    category: "하체",
    tags: ["BHL", "NUC", "Ubuntu", "SocketCAN", "udp_joystick"],
  },
  "bhl_doc_mocap": {
    label: "BHL 공식: Motion Capture System (SteamVR + Vive Pro)",
    url: "https://berkeley-humanoid-lite.gitbook.io/docs/getting-started-with-software/motion-capture-system",
    category: "하체",
    tags: ["BHL", "mocap", "SteamVR", "HTC Vive Pro", "UDP"],
  },

  // BHL 공식 YouTube 튜토리얼 (학생 시청용)
  "bhl_video_actuator": {
    label: "[영상] 액추에이터 조립 (BHL 공식)",
    url: "https://youtu.be/CHPVXL-SsSo",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "액추에이터", "조립"],
  },
  "bhl_video_flashing": {
    label: "[영상] ESC 펌웨어 플래싱 (BHL 공식)",
    url: "https://youtu.be/hUxj4s9o3TY",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "ESC", "플래싱", "STM32"],
  },
  "bhl_video_calibration": {
    label: "[영상] 모터 전기 offset 캘리브레이션 (BHL 공식)",
    url: "https://youtu.be/NbDtOXiBMt0",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "캘리브레이션", "모터"],
  },
  "bhl_video_motion": {
    label: "[영상] 단일 액추에이터 동작 테스트 (BHL 공식)",
    url: "https://youtu.be/wnrsmn_R_LM",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "동작 테스트", "move_actuator"],
  },
  "bhl_video_arm": {
    label: "[영상] 팔 조립 (BHL 공식, 상체 참고)",
    url: "https://youtu.be/zsb3M3H1sr4",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "팔 조립"],
  },
  "bhl_video_leg": {
    label: "[영상] 다리 조립 (BHL 공식) ⭐",
    url: "https://youtu.be/aRtWpbteiNA",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "다리 조립", "hip", "knee", "ankle"],
  },
  "bhl_video_fullrobot": {
    label: "[영상] 전체 로봇 조립 (BHL 공식)",
    url: "https://youtu.be/SIGD8I-hwG8",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "전체 조립", "통합"],
  },
  "bhl_video_demo": {
    label: "[영상] BHL 데모 (논문 영상)",
    url: "https://youtu.be/5qgEJpEf3pQ",
    category: "하체",
    kind: "video",
    tags: ["BHL", "YouTube", "데모", "논문"],
  },

  // BHL 관련 도구/부속 리포지토리
  "recoil_besc": {
    label: "Recoil-Motor-Controller-BESC (펌웨어 리포)",
    url: "https://github.com/T-K-233/Recoil-Motor-Controller-BESC",
    category: "하체",
    tags: ["BESC", "STM32", "FOC", "Recoil", "T-K-233"],
  },
  "as5600_mod": {
    label: "AS5600 자석 인코더 수정 가이드 (저항 스왑)",
    url: "https://notes.tk233.xyz/electrical/as5600-modification",
    category: "하체",
    tags: ["AS5600", "인코더", "수정", "저항"],
  },
  "steamvr_bridge": {
    label: "SteamVR-Bridge (텔레옵 / mocap)",
    url: "https://github.com/ucb-bar/SteamVR-Bridge.git",
    category: "하체",
    tags: ["SteamVR", "Vive Pro", "UDP", "텔레옵"],
  },
  "stm32_cubeide": {
    label: "STM32CubeIDE (ESC 플래싱 필수)",
    url: "https://www.st.com/en/development-tools/stm32cubeide.html",
    category: "하체",
    tags: ["STM32CubeIDE", "ST", "IDE", "플래싱"],
  },
  "bambu_x1c": {
    label: "Bambu Lab X1C (BHL 권장 3D 프린터)",
    url: "https://bambulab.com/en/x1",
    category: "하체",
    tags: ["Bambu", "X1C", "3D 프린터", "BHL 권장"],
  },
  "hipnuc_im10a": {
    label: "HiPNUC IM10A 9축 IMU (USB 직결, BHL 권장)",
    url: "https://www.hipnuc.com/",
    category: "하체",
    tags: ["IM10A", "IMU", "HiPNUC", "USB", "BHL 권장"],
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
