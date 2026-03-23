// taskHints.js — 각 techTree 노드의 실행 힌트, 리소스, 예상 시간
// 기획서 v12 + 실행가이드 v12 기반

export const TASK_HINTS = {
  // =======================================================================
  // WEEK 0 — SO-ARM 커리큘럼 + 킥오프 (4일)
  // =======================================================================

  w0_soarm_assembly: {
    summary: "SO-ARM 키트를 조립하고 Dynamixel 서보 ID 설정 + 캘리브레이션 진행",
    steps: [
      "SO-ARM 키트 구성품 확인 및 누락 체크",
      "서보모터(XL430) 조립 및 프레임 결합",
      "Dynamixel Wizard2로 ID 할당 (좌팔 1~6, 우팔 7~12)",
      "각 관절 캘리브레이션 (중립 위치 설정)",
      "전체 동작 테스트 (토크 ON/OFF, 관절 구동 확인)",
    ],
    resources: [
      { label: "SO-ARM101 공식 GitHub", url: "https://github.com/TheRobotStudio/SO-ARM100" },
      { label: "Dynamixel Wizard2", url: "https://emanual.robotis.com/docs/en/software/dynamixel/dynamixel_wizard2/" },
      { label: "기획서 7.2절 (토르소/SO-ARM)", type: "internal", section: "7.2" },
    ],
    components: ["xl430", "u2d2"],
    estimatedHours: 4,
  },

  w0_assembly_doc_draft: {
    summary: "조립 과정에서 나사 토크, 그리스, 주의사항을 기록하여 조립 기준서 초안 작성",
    resources: [
      { label: "기획서 6.2절 (협업 구조)", type: "internal", section: "6.2" },
    ],
    components: ["xl430"],
    estimatedHours: 2,
  },

  w0_head_spec_discuss: {
    summary: "epsilon2 레퍼런스+스케치, delta1 전자부품 치수 기반으로 머리 외주 사양 논의",
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo", "xl430"],
    estimatedHours: 2,
  },

  w0_kr_parts_order: {
    summary: "한국 온라인에서 Orin, NUC, XL430, U2D2, 카메라, ESC, 프로파일 주문",
    resources: [
      { label: "기획서 9.1절 (조달 채널)", type: "internal", section: "9.1" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "u2d2", "camera_usb", "esc_b_g431b"],
    estimatedHours: 2,
  },

  w0_3dprint_start: {
    summary: "랩 프린터 2대로 BHL 기어박스 10세트 + 다리 구조물 프린트 시작",
    resources: [
      { label: "BHL 공식 GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010"],
    estimatedHours: 8,
  },

  w0_soarm_sim: {
    summary: "SO-ARM URDF 정의 후 RViz + Gazebo에서 시뮬레이션 확인",
    steps: [
      "SO-ARM URDF 파일 작성/수정",
      "RViz에서 joint 구동 확인",
      "Gazebo에서 물리 시뮬레이션 실행",
    ],
    resources: [
      { label: "ROS2 URDF 튜토리얼", url: "https://docs.ros.org/en/humble/Tutorials.html" },
    ],
    components: ["xl430"],
    estimatedHours: 4,
  },

  w0_isaaclab_load: {
    summary: "BHL 리포지토리 클론 후 IsaacLab에서 환경 로드 성공 여부 확인 (체크포인트)",
    steps: [
      "BHL 리포지토리 클론",
      "IsaacLab 설치 및 의존성 확인",
      "BHL 환경 로드 + 직립 확인",
      "체크포인트 기록",
    ],
    resources: [
      { label: "IsaacLab 공식 문서", url: "https://isaac-sim.github.io/IsaacLab/" },
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
      { label: "기획서 8절 (Sim->Real 파이프라인)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w0_battery_calc: {
    summary: "Orin 25W + NUC 15W + SO-ARM + BHL BLDC 소비전류 합산하여 30분 구동 가능 확인",
    resources: [
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "mad_m6c12", "battery_a", "battery_b", "battery_c"],
    estimatedHours: 2,
  },

  w0_weight_estimate: {
    summary: "스펙시트 기반으로 상체 무게 사전 적산 (Week 2 직립 테스트와 대조 예정)",
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "camera_usb", "battery_a", "battery_b"],
    estimatedHours: 2,
  },

  w0_llm_latency_test: {
    summary: "Groq API 100회 호출로 JSON 안정성 + STT->LLM->TTS 라운드트립 latency 측정",
    steps: [
      "Groq API 키 설정 + 100회 호출 테스트",
      "JSON 파싱 실패율 측정",
      "STT->LLM->TTS 전체 파이프라인 라운드트립 시간 측정",
      "JSON 액션 스키마 초안 작성",
    ],
    resources: [
      { label: "Groq API 문서", url: "https://console.groq.com/docs" },
      { label: "기획서 5.4절 (네트워크)", type: "internal", section: "5.4" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 3,
  },

  w0_bhl_urdf_study: {
    summary: "BHL URDF 파일 구조를 문서 수준에서 파악 (Week 1 본격 셋업 대비)",
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w0_teleop: {
    summary: "Leader-Follower 텔레오퍼레이션 셋업 + 카메라 스트리밍 확인",
    resources: [
      { label: "LeRobot 텔레오퍼레이션 가이드", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 4,
  },

  w0_bhl_actuator_doc: {
    summary: "BHL 액추에이터 파라미터(KV, 기어비 등)를 문서화하고 ROS2 토픽 리스트 초안 작성",
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 3,
  },

  w0_bhl_lowlevel_reading: {
    summary: "BHL 문서를 정독하고 lowlevel C 코드를 리딩하여 제어 구조 파악",
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: ["nuc"],
    estimatedHours: 4,
  },

  w0_head_spec_final: {
    summary: "머리 외주 사양서를 마무리 (외형 + 내부 치수 + 개구부 + 300g 이하)",
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo"],
    estimatedHours: 3,
  },

  w0_state_machine_eval: {
    summary: "상태별 프로세스-리소스 매핑표 초안 작성 + smach/FlexBE 비교 평가 후 프레임워크 선정",
    steps: [
      "상태별 프로세스-리소스 매핑표 초안 작성",
      "smach와 FlexBE 각각 설치 + 간단한 예제 실행",
      "팀 요구사항에 맞춰 비교 분석",
      "프레임워크 최종 선정",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
      { label: "smach GitHub", url: "https://github.com/ros/executive_smach" },
      { label: "FlexBE", url: "https://github.com/FlexBE" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w0_imitation_learning: {
    summary: "SO-ARM으로 데이터 수집 -> 모방학습 -> 자율 동작 -> 종합 미션 실행",
    resources: [
      { label: "LeRobot 프레임워크", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 4,
  },

  w0_smolvla_data_prep: {
    summary: "SmolVLA 수집 기준 문서 초안 작성 + LeRobot 데이터 포맷 사전 조사",
    resources: [
      { label: "SmolVLA (HuggingFace)", url: "https://huggingface.co/HuggingFaceTB/SmolVLA-base" },
      { label: "LeRobot 데이터 포맷", url: "https://github.com/huggingface/lerobot/blob/main/lerobot/common/datasets/README.md" },
      { label: "기획서 4절 (SmolVLA 태스크 정의)", type: "internal", section: "4" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w0_isaaclab_checkpoint: {
    summary: "IsaacLab 체크포인트 결과를 정리하고 Week 1 직립 테스트 계획 수립",
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 2,
  },

  w0_sim2sim_study: {
    summary: "BHL 문서에서 Sim2sim(IsaacLab->MuJoCo) 절차를 파악하고 코드 리딩 계속",
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
      { label: "MuJoCo 공식 문서", url: "https://mujoco.readthedocs.io/" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w0_esp32_fall_research: {
    summary: "ESP32 + MPU6050 기반 낙상 감지 사전 조사 + 평가 지표 구상",
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050"],
    estimatedHours: 3,
  },

  w0_shenzhen_procurement: {
    summary: "심천에서 MAD 모터 수령 + 화창베이 부품 일괄 구매 + 배터리/BMS/PDB 조달",
    steps: [
      "MAD Components에 사전 연락 (M6C12 150KV x6, 5010 110KV x4)",
      "BHL BOM 최신 릴리즈 + 전체 부품 리스트 정리",
      "화창베이 구매 리스트 (부품명 + 중국어 + 수량) 준비",
      "현지에서 MAD 모터 수령",
      "화창베이 일괄 구매 (ESP32, MPU6050, CAN-USB, MOSFET 등)",
      "배터리 A+B+C + BMS x3 + PDB 구매",
    ],
    resources: [
      { label: "기획서 9.1절 (조달 채널)", type: "internal", section: "9.1" },
      { label: "기획서 9.2절 (예산)", type: "internal", section: "9.2" },
    ],
    components: ["mad_m6c12", "mad_5010", "esp32", "mpu6050", "can_usb", "mosfet", "battery_a", "battery_b", "battery_c", "bms", "pdb"],
    estimatedHours: 16,
  },

  // =======================================================================
  // WEEK 1 — 설계 확정 + 트랙 분기
  // =======================================================================

  w1_kickoff_meeting: {
    summary: "전체 합의 미팅: 인터페이스, 리소스 할당, 무게, 배터리, 상태 머신 등 확정",
    steps: [
      "인터페이스 + 리소스 할당 확정",
      "상체 무게 적산값 공유 (delta2)",
      "배터리 배치 방향 결정 (토르소 vs hip)",
      "상태 머신 프레임워크 공유 (epsilon1 선정 결과)",
      "전원 시퀀싱 확정",
      "U2D2 버스 분배 (좌팔 6 / 우팔 6+목 2)",
      "카메라 마운트 위치/각도 확정",
    ],
    resources: [
      { label: "기획서 5.6절 (인터페이스 명세)", type: "internal", section: "5.6" },
      { label: "기획서 5.7절 (U2D2 버스 분배)", type: "internal", section: "5.7" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_workspace_camera: {
    summary: "SO-ARM 작업 공간을 실측하고 카메라 위치/각도 확정 (이후 변경 금지)",
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["xl430", "camera_usb"],
    estimatedHours: 2,
  },

  w1_grip_test: {
    summary: "실물체 3개(컵, 텀블러, 인형)로 그립 테스트 — jaw 부족 시 고무 패드/물체 교체",
    resources: [
      { label: "기획서 7.10절 (그리퍼 검증)", type: "internal", section: "7.10" },
    ],
    components: ["xl430"],
    estimatedHours: 2,
  },

  w1_teleop_env: {
    summary: "Leader + Follower + 녹화 환경을 구축하여 텔레오퍼레이션 워크플로 완성",
    resources: [
      { label: "LeRobot 텔레오퍼레이션", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 3,
  },

  w1_torso_cad: {
    summary: "토르소 프레임 CAD 설계 — 환기 구조 + 퀵릴리즈 hip 결합부 포함",
    resources: [
      { label: "기획서 7.2절 (토르소)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020"],
    estimatedHours: 6,
  },

  w1_actuator_trial_assembly: {
    summary: "BHL 액추에이터 3개를 시험 조립하고 조립 기준서를 작성하여 delta2에 인계",
    steps: [
      "3D프린트 기어박스 + BLDC 모터 결합",
      "조립 순서/토크/주의사항 기록",
      "조립 기준서 문서화",
      "delta2에 인수인계",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
      { label: "기획서 6.2절 (협업 구조 — 조립 노트 인계)", type: "internal", section: "6.2" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w1_orin_setup: {
    summary: "Orin에 JetPack + TensorRT + ROS2 + 카메라 드라이버를 초기 셋업",
    steps: [
      "JetPack SDK 설치 (L4T + CUDA + cuDNN + TensorRT)",
      "ROS2 Humble 설치",
      "카메라 드라이버(v4l2/USB) 설정",
      "기본 동작 확인",
    ],
    resources: [
      { label: "JetPack 설치 가이드", url: "https://developer.nvidia.com/embedded/jetpack" },
      { label: "기획서 5.3절 (컴퓨팅 분배)", type: "internal", section: "5.3" },
    ],
    components: ["orin_nano_super", "camera_usb"],
    estimatedHours: 6,
  },

  w1_echo_cancel_test: {
    summary: "에코 캔슬링 테스트 수행 후 AEC 필요 여부 판단 + Orin USB 오디오/스피커 테스트",
    resources: [
      { label: "기획서 11절 (리스크 — 에코 캔슬링)", type: "internal", section: "11" },
    ],
    components: ["orin_nano_super", "speaker", "microphone"],
    estimatedHours: 3,
  },

  w1_state_machine_design: {
    summary: "상태 머신 설계를 확정하고 SmolVLA 수집 기준 문서를 delta1과 합의",
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
      { label: "기획서 5.2절 (상태별 프로세스-리소스)", type: "internal", section: "5.2" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w1_head_order: {
    summary: "머리 외주 사양서를 최종 확인하고 외주 발주 (납기 목표 Week 5~6)",
    resources: [
      { label: "기획서 7.3절 (머리 제작 타임라인)", type: "internal", section: "7.3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w1_body_exterior_direction: {
    summary: "바디 외장 컬러/소재 확정 + SmolVLA 평가 지표 및 스크립트 초안 작성",
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_nuc_rt_kernel: {
    summary: "NUC(BeeLink N95)에 Ubuntu 22.04 + xanmod RT 커널 + CAN 드라이버 설치",
    steps: [
      "Ubuntu 22.04 설치",
      "xanmod RT 커널 빌드/설치",
      "CAN 드라이버 활성화 + socketcan 설정",
      "실시간성 latency 테스트",
    ],
    resources: [
      { label: "xanmod 커널", url: "https://xanmod.org/" },
      { label: "기획서 5.3절 (NUC 역할)", type: "internal", section: "5.3" },
    ],
    components: ["nuc", "can_usb"],
    estimatedHours: 6,
  },

  w1_bhl_lowlevel_build: {
    summary: "BHL lowlevel C 코드를 NUC에서 빌드하고 더미 CAN 루프로 숙달",
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: ["nuc", "can_usb"],
    estimatedHours: 6,
  },

  w1_power_assembly: {
    summary: "PDB + BMS + DC-DC 컨버터 조립/배선 + 전원 시퀀싱 문서화",
    steps: [
      "PDB에 배터리 A, B 연결 포인트 배선",
      "BMS 연결 및 전압 확인",
      "DC-DC 벅 컨버터(5V/12V/19V) 셋업",
      "전원 시퀀싱 절차 문서화",
    ],
    resources: [
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
    ],
    components: ["pdb", "bms", "dc_dc_converter", "battery_a", "battery_b"],
    estimatedHours: 5,
  },

  w1_sim2sim_setup: {
    summary: "Sim2sim(IsaacLab->MuJoCo) 환경 셋업 + Orin<->NUC Ethernet ROS2 통신 확인",
    resources: [
      { label: "MuJoCo 공식 문서", url: "https://mujoco.readthedocs.io/" },
    ],
    components: ["nuc", "orin_nano_super"],
    estimatedHours: 4,
  },

  w1_isaaclab_custom_upper: {
    summary: "IsaacLab에 커스텀 상부(토르소 mesh, 머리 mass, SO-ARM 간략 모델) 추가 + DR +-20%",
    steps: [
      "토르소 mesh를 USD로 변환하여 IsaacLab에 추가",
      "머리 mass/inertia 설정",
      "SO-ARM 간략 모델(mass+joint) 추가",
      "Domain Randomization +/-20% 적용",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "IsaacLab 공식 문서", url: "https://isaac-sim.github.io/IsaacLab/" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w1_isaaclab_env_complete: {
    summary: "IsaacLab 환경을 완성하고 delta2에 인계 + epsilon2 검증 루프 인계 (Week 1 최우선)",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w1_parametric_standing: {
    summary: "상부 mass(3~6kg) x CoM 높이(40~60cm) x 배터리 배치 조합으로 파라메트릭 직립 테스트",
    resources: [
      { label: "기획서 7.4절 (무게 예산 — 직립 테스트)", type: "internal", section: "7.4" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w1_smolvla_stage1_start: {
    summary: "LeRobot Hub 공개 데이터로 SmolVLA Stage 1 사전 파인튜닝 시작 (DGX 백그라운드)",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
      { label: "SmolVLA (HuggingFace)", url: "https://huggingface.co/HuggingFaceTB/SmolVLA-base" },
      { label: "LeRobot Hub", url: "https://huggingface.co/lerobot" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w1_smolvla_tensorrt_script: {
    summary: "SmolVLA 모델을 TensorRT로 변환하는 스크립트를 직접 작성",
    resources: [
      { label: "TensorRT 문서", url: "https://developer.nvidia.com/tensorrt" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w1_urdf_export_script: {
    summary: "BHL URDF export 스크립트를 셋업하여 자동 URDF 갱신 파이프라인 구축",
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_esp32_fall_isr: {
    summary: "ESP32 HW 인터럽트로 MPU6050 낙상 감지 + MOSFET 전원 차단 구현",
    steps: [
      "ESP32 + MPU6050 I2C 연결",
      "낙상 각도/가속도 임계값 설정",
      "HW 인터럽트(ISR)로 즉시 MOSFET 차단 구현",
      "IsaacLab 검증 루프 시작",
    ],
    resources: [
      { label: "기획서 7.8절 (안전 — 보행)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "mosfet"],
    estimatedHours: 6,
  },

  // =======================================================================
  // WEEK 2
  // =======================================================================

  w2_torso_assembly: {
    summary: "기획서 7.2절 11단계 순서로 토르소 프레임 조립 + SO-ARM 마운트 + 휘어짐 확인",
    steps: [
      "프로파일 프레임 조립",
      "배터리 A+B 슬롯 장착",
      "PDB + DC-DC 장착",
      "NUC 마운트",
      "Orin + carrier + 방열판",
      "환기팬 + 배기구/흡기구",
      "SO-ARM x2 어깨 마운트",
      "목 서보 XL430 x2 장착",
      "스피커 + 마이크 장착",
      "Orin<->NUC Ethernet 연결",
      "케이블 정리 + 간섭 확인",
    ],
    resources: [
      { label: "기획서 7.2절 (토르소 조립 순서)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020", "orin_nano_super", "nuc", "xl430", "battery_a", "battery_b", "pdb", "dc_dc_converter", "speaker", "microphone"],
    estimatedHours: 10,
  },

  w2_episode_collect_30: {
    summary: "물체당 10개씩 총 30개 에피소드 수집 + 메타데이터 기록 + 수집 프로토콜 문서화",
    steps: [
      "수집 환경 셋업 (테이블, 마커, 조명)",
      "스타벅스 컵 10개 수집",
      "텀블러 10개 수집",
      "인형 10개 수집",
      "에피소드별 메타데이터(위치, 회전, 접근 방향) 기록",
      "수집 프로토콜 문서화 (Week 3 epsilon2 인수인계 대비)",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
      { label: "기획서 4.2절 (수집 전략)", type: "internal", section: "4.2" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 8,
  },

  w2_head_mockup: {
    summary: "스티로폼 블록으로 머리 간이 목업 제작 + 전자부품 임시 배치 + 계량(700g 이하)",
    resources: [
      { label: "기획서 7.3절 (머리 제작 타임라인)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo"],
    estimatedHours: 4,
  },

  w2_state_machine_v1_start: {
    summary: "상태 머신 v1 구현 시작 + SmolVLA Stage 1 모니터링 + 에코 캔슬링 후속",
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 8,
  },

  w2_esp32_bench_test: {
    summary: "ESP32 MOSFET 벤치 테스트 — 기울임 각도에 따른 차단 동작 확인",
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "mosfet"],
    estimatedHours: 3,
  },

  w2_emotion_v1: {
    summary: "감정 상태 머신 v1 구현 (중립/기쁨/놀람) + 평가 스크립트 완성",
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["neopixel_led", "mg90s_servo"],
    estimatedHours: 5,
  },

  w2_walking_rl_start: {
    summary: "Walking RL 1차 학습을 DGX에서 시작 (delta3 SmolVLA Stage 1과 시간 분배)",
    resources: [
      { label: "기획서 8절 (Sim->Real 파이프라인)", type: "internal", section: "8" },
      { label: "IsaacLab RL 문서", url: "https://isaac-sim.github.io/IsaacLab/" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 16,
  },

  w2_emergency_stop: {
    summary: "B+C 양극 직렬 NC 차단 + ESP32 MOSFET 차단으로 비상정지 회로 완성",
    resources: [
      { label: "기획서 7.5절 (배터리 — 비상정지)", type: "internal", section: "7.5" },
    ],
    components: ["esp32", "mosfet", "emergency_stop_switch"],
    estimatedHours: 4,
  },

  w2_gearbox_postprocess: {
    summary: "3D프린트된 기어박스의 서포트 제거, 리밍, 베어링 시트 후가공 + 공중 지그 설계",
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010"],
    estimatedHours: 8,
  },

  w2_standing_checkpoint: {
    summary: "IsaacLab에서 상부 mass 장착 시 직립 최종 확인 -> 보행 체크포인트",
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
      { label: "기획서 10절 (게이트 조건 — 직립 체크포인트)", type: "internal", section: "10" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w2_imu_structure: {
    summary: "ESP32용 IMU(낙상 감지)와 NUC용 IMU(policy 입력)를 별도 구조로 확정",
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "nuc"],
    estimatedHours: 3,
  },

  w2_mini_finetune: {
    summary: "30개 에피소드로 미니 파인튜닝 → 결과 모델 실행 → 치명적 결함 확인 → 수집 전략 확정",
    steps: [
      "delta3: 30개 데이터로 DGX Stage 2 테스트 파인튜닝",
      "delta1: 결과 모델을 Orin에서 실행",
      "치명적 결함(그립 실패, 카메라 오류 등) 확인",
      "수집 전략(각도, 위치, 변형 비율) 확정",
    ],
    resources: [
      { label: "기획서 4.2절 (수집 전략)", type: "internal", section: "4.2" },
    ],
    components: ["dgx_spark", "orin_nano_super"],
    estimatedHours: 6,
  },

  // =======================================================================
  // WEEK 3 — 수집 집중 + Phase 1 마감
  // =======================================================================

  w3_collect_570: {
    summary: "delta1+epsilon2가 하루 ~120개씩 570개 몰아서 수집하여 누적 600개 달성 (★핵심★)",
    steps: [
      "delta1: Week 2 프로토콜 기반 수집 리드",
      "epsilon2: 수집 인수인계 세션 (delta1 영상 시청 + 동일 패턴 훈련)",
      "epsilon2 수집 투입",
      "하루 ~120개 x 5일 목표",
      "누적 600개 도달 시 수집 종료 (시연 조건 60%+ 확인)",
      "SmolVLA 중간 모델 실행 → 실패 패턴 → delta3 피드백",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
      { label: "기획서 4.2절 (수집 전략)", type: "internal", section: "4.2" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 40,
  },

  w3_smolvla_stage2: {
    summary: "Stage 1 완료 후 자체 600개 데이터로 Stage 2 DGX 학습 실행 + 학습 설정(lr, batch) 결정",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w3_walking_rl_review: {
    summary: "Walking RL 학습 결과를 검토하고 보상 함수를 조정",
    resources: [
      { label: "기획서 8절 (Sim->Real 파이프라인)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w3_tensorrt_deploy: {
    summary: "delta3이 넘긴 Stage 1 모델을 TensorRT로 변환하고 Orin에 배포 + 정합성 검증",
    steps: [
      "Stage 1 모델(PyTorch) -> ONNX 변환",
      "ONNX -> TensorRT 엔진 빌드 (FP16)",
      "Orin에 배포",
      "PyTorch vs TensorRT 추론 결과 정합성 검증",
    ],
    resources: [
      { label: "TensorRT 문서", url: "https://developer.nvidia.com/tensorrt" },
    ],
    components: ["orin_nano_super", "dgx_spark"],
    estimatedHours: 6,
  },

  w3_gpu_profiling: {
    summary: "Orin에서 SmolVLA Hz 실측 — 5Hz+: 진행 / 2~5Hz: UX 보완 / 2Hz-: 다운사이즈",
    resources: [
      { label: "기획서 11절 (리스크 — SmolVLA Hz)", type: "internal", section: "11" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 3,
  },

  w3_state_machine_v1_complete: {
    summary: "상태 머신 v1을 완성하여 IDLE/TALKING/MANIPULATING 기본 전환 동작 구현",
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w3_sim2sim_verify: {
    summary: "Walking RL 모니터링 + IsaacLab->MuJoCo Sim2sim 검증 + 공중 지그 3D프린트",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["nuc"],
    estimatedHours: 8,
  },

  w3_soc_safety: {
    summary: "SOC 20% 이하 시 안전 자세 전환 로직 구현",
    resources: [
      { label: "기획서 5.1절 (LOW_BATTERY 상태)", type: "internal", section: "5.1" },
    ],
    components: ["esp32", "bms"],
    estimatedHours: 3,
  },

  w3_phase1_gate: {
    summary: "Phase 1 게이트 통과 확인: 직립, 토르소, 수집 600개, SmolVLA v1, ESP32, Sim2sim",
    resources: [
      { label: "기획서 10절 (게이트 조건 — Phase 1)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 2,
  },

  // =======================================================================
  // WEEK 4
  // =======================================================================

  w4_head_surface_finish: {
    summary: "외주 CNC 도착 시 사포+서피서 마감, 미도착 시 수작업 경로 B로 전환 + 서피서 도포",
    resources: [
      { label: "기획서 7.3절 (머리 제작 — 두 가지 경로)", type: "internal", section: "7.3" },
    ],
    components: [],
    estimatedHours: 8,
  },

  w4_body_cover_pattern: {
    summary: "하이리온 컬러 천 커버 패턴 제작 (재단+봉제+벨크로+환기구 메쉬)",
    resources: [
      { label: "기획서 7.6절 (외장 — 바디 외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 8,
  },

  w4_smolvla_v1_eval: {
    summary: "SmolVLA v1 평가 리포트 작성 — 물체별 성공률, 실패 유형 분석",
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w4_lip_sync: {
    summary: "오픈소스 lip sync 구현 — epsilon1 TTS 오디오 타이밍을 입 서보(MG90S)와 동기화",
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["mg90s_servo", "orin_nano_super"],
    estimatedHours: 6,
  },

  w4_neck_pid_start: {
    summary: "MediaPipe 얼굴 감지 -> XL430 목 서보 PID 제어로 시선 추적 시작",
    resources: [
      { label: "MediaPipe 얼굴 감지", url: "https://developers.google.com/mediapipe/solutions/vision/face_detector" },
    ],
    components: ["xl430", "camera_usb", "orin_nano_super"],
    estimatedHours: 6,
  },

  w4_smolvla_ablation: {
    summary: "epsilon1이 설계한 ablation 조합들을 DGX에서 학습 실행 + 결과 검토",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w4_walking_rl_2nd: {
    summary: "Walking RL 2차 학습 — 지형 커리큘럼 + 마찰 Domain Randomization 적용",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w4_ablation_interpret: {
    summary: "delta3이 실행한 ablation 결과를 해석하여 최적 데이터 조합 방향 도출",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w4_groq_stt_llm: {
    summary: "Groq STT + LLM 스트리밍 연동 + fetch 태스크 타입 프롬프트 + FETCH 시퀀서 구현",
    steps: [
      "Groq STT 스트리밍 연동",
      "LLM 프롬프트에 fetch 태스크 타입 추가",
      "FETCH 시퀀서 구현 (WALKING->MANIPULATING->WALKING->handover)",
    ],
    resources: [
      { label: "Groq API 문서", url: "https://console.groq.com/docs" },
      { label: "기획서 5.1절 (FETCH 서브스텝)", type: "internal", section: "5.1" },
      { label: "기획서 4.4절 (언어->동작 연결)", type: "internal", section: "4.4" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 10,
  },

  w4_actuator_10_assembly: {
    summary: "기어박스 후가공 완료 상태에서 액추에이터 10개를 모두 조립 (★핵심★)",
    steps: [
      "기어박스 10개 최종 점검",
      "BLDC 모터 결합 (M6C12 x6, 5010 x4)",
      "ESC(B-G431B) 솔더링 + 연결",
      "개별 동작 테스트",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신 — 액추에이터)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 16,
  },

  w4_leg_assembly_start: {
    summary: "액추에이터 장착하여 다리 조립 시작 + 배터리 C 연결",
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b", "battery_c"],
    estimatedHours: 8,
  },

  // =======================================================================
  // WEEK 5
  // =======================================================================

  w5_head_paint: {
    summary: "머리에 수성 도료 도장 + 건조 + LED 눈 디퓨저 제작(반투명 아크릴/실리콘)",
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["neopixel_led"],
    estimatedHours: 6,
  },

  w5_body_cover_complete: {
    summary: "바디 천 커버를 완성하고 토르소에 임시 피팅하여 간섭 확인",
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_emotion_5types: {
    summary: "LED 감정 5종 확장 + Gemini 폴백 + lip sync 완성 + PID 목 제어 완성(오버슈트 <5도)",
    steps: [
      "감정 5종(중립/기쁨/놀람/슬픔/분노) LED 패턴 구현",
      "Gemini 폴백 로직 추가",
      "VAD 비활성화 처리",
      "lip sync 최종 완성",
      "PID 목 제어 완성 (오버슈트 5도 이하로 튜닝)",
    ],
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["neopixel_led", "mg90s_servo", "xl430", "camera_usb"],
    estimatedHours: 10,
  },

  w5_survival_keywords: {
    summary: "서바이벌 키워드 사전 작성 — 동의어 매핑 + 사전 Q&A 30개 준비",
    resources: [
      { label: "기획서 4.4절 (언어->동작 연결 — 오프라인)", type: "internal", section: "4.4" },
      { label: "기획서 5.5절 (Fallback 계층 설계)", type: "internal", section: "5.5" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_walking_rl_final_review: {
    summary: "Walking RL 2차 학습 결과를 최종 검토하여 보행 성능 확인",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 3,
  },

  w5_smolvla_best_combo: {
    summary: "SmolVLA ablation 결과에서 최적 조합을 정리하고 epsilon1에 최종 모델 전달",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w5_scenario_bc_design: {
    summary: "보행 실패 시 대안 시나리오 B/C의 구조 + 전환 조건 정의",
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_optimal_data_combo: {
    summary: "ablation 결과 + delta3 학습 결과를 기반으로 최적 데이터 조합 최종 확정",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w5_survival_engine: {
    summary: "서바이벌 모드 엔진 완성 — Whisper tiny + Piper TTS를 Orin에서 실행 + 키워드 사전 연동",
    steps: [
      "Whisper tiny 모델 Orin 배포",
      "Piper TTS 경량 엔진 설치",
      "epsilon2 키워드 사전 연동",
      "오프라인 자율 모드(계층 2) 완성",
      "10분 연속 크래시 없음 확인",
    ],
    resources: [
      { label: "기획서 5.5절 (Fallback 계층 설계)", type: "internal", section: "5.5" },
      { label: "Whisper", url: "https://github.com/openai/whisper" },
      { label: "Piper TTS", url: "https://github.com/rhasspy/piper" },
    ],
    components: ["orin_nano_super", "speaker", "microphone"],
    estimatedHours: 8,
  },

  w5_fetch_sequencer_complete: {
    summary: "상태 머신 + FETCH 시퀀서 완성 + 카메라 공유(/camera/image_raw) 토픽 설정",
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w5_leg_complete: {
    summary: "다리 조립 완성 + NUC<->CAN 실물 연결하여 통신 확인",
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 8,
  },

  w5_aerial_gait_test: {
    summary: "공중 지그에 매달고 보행 테스트 + NUC jitter 측정 (★핵심 체크포인트★)",
    steps: [
      "공중 지그에 로봇 다리 고정",
      "NUC에서 Walking RL policy 실행",
      "CAN 통신 + 실시간 jitter 측정",
      "보행 패턴 확인 (발차기, 스윙 등)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real — 공중 보행)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w5_aerial_sim_compare: {
    summary: "시뮬 궤적을 저장하고 공중 보행 실측 로그와 비교하여 sim-to-real gap 분석",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_phase2_gate: {
    summary: "Phase 2 게이트 통과: 대화 TTFT <500ms, 표정 5종, 서바이벌 10분, 공중 보행, ablation",
    resources: [
      { label: "기획서 10절 (게이트 조건 — Phase 2)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 2,
  },

  // =======================================================================
  // WEEK 6 — 양 트랙 마일스톤
  // =======================================================================

  w6_upper_integration: {
    summary: "IDLE/TALKING/MANIPULATING 전환 + LOW_BATTERY + EMERGENCY + 서바이벌 계층 통합",
    steps: [
      "IDLE<->TALKING<->MANIPULATING 전환 테스트",
      "FETCH 시퀀서 로직 연결",
      "LOW_BATTERY + EMERGENCY 상태 구현",
      "서바이벌 계층 1 + 계층 2 통합",
      "파이프라인 10분 크래시 없음 확인",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
      { label: "기획서 5.5절 (Fallback 계층)", type: "internal", section: "5.5" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 12,
  },

  w6_fetch_logic_test: {
    summary: "FETCH 시퀀서 로직을 테스트 — 보행은 mock, SmolVLA pick + handover는 실제 수행",
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super", "xl430"],
    estimatedHours: 6,
  },

  w6_head_prefit: {
    summary: "머리 외주 도착 시 전자부품(카메라/LED) pre-fit 테스트 + 상반신 통합 물리 지원",
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led"],
    estimatedHours: 4,
  },

  w6_exterior_check: {
    summary: "외장 상태 점검 + 천 커버 미세 조정 (환기구, 간섭 등)",
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w6_dummy_weight: {
    summary: "스펙시트 기반 더미 웨이트 제작 — 100g 단위 조절 가능하게 설계",
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w6_ground_gait_first: {
    summary: "더미 웨이트 장착 후 지면 보행 첫 시도 (★핵심 체크포인트★)",
    resources: [
      { label: "기획서 8절 (Sim->Real — 지면 보행)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w6_gap_analysis: {
    summary: "지면 보행 gap 데이터를 epsilon2가 분석하고 delta3이 재학습 여부 판단",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: [],
    estimatedHours: 4,
  },

  // =======================================================================
  // WEEK 7 — 상체 마무리 + 하체 최종 policy
  // =======================================================================

  w7_upper_measurement: {
    summary: "상반신 정밀 계측(질량 +-10g, CoM, 관성 텐서) → delta3/delta2에 전달 + 무게 예산 검증",
    steps: [
      "각 부품별 질량 +-10g 정밀 계측",
      "무게 중심(CoM) 산출",
      "관성 텐서 계산",
      "delta2 더미 웨이트를 실측값으로 업데이트",
      "무게 예산 검증 → 초과 시 경량화 방안 수립",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w7_head_electronics_integrate: {
    summary: "머리에 전자부품 8단계 통합: 피팅→카메라→LED→입서보→배선→결합→계량→테스트",
    steps: [
      "외주 조형물 피팅 확인",
      "카메라 장착",
      "LED + 디퓨저 장착",
      "입 서보(MG90S) 장착",
      "배선 집약 (목 내부 경로)",
      "토르소 결합",
      "전체 계량 (<=700g)",
      "감정 표현 전체 테스트",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo", "xl430"],
    estimatedHours: 8,
  },

  w7_foot_cover: {
    summary: "캐릭터 신발 느낌의 다리 발 커버 제작 (EVA 또는 3D프린트)",
    resources: [
      { label: "기획서 7.6절 (외장 — 다리 외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w7_smolvla_v2_data: {
    summary: "SmolVLA v2 데이터 정제 후 delta3에 전달 + TensorRT v2 Orin 배포",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["orin_nano_super", "dgx_spark"],
    estimatedHours: 6,
  },

  w7_survival_scenario_final: {
    summary: "서바이벌 시나리오 확정 — epsilon2 키워드 사전 + delta3 시나리오 B/C를 통합",
    resources: [
      { label: "기획서 5.5절 (Fallback 계층)", type: "internal", section: "5.5" },
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w7_smolvla_v2_eval: {
    summary: "SmolVLA v2 모델의 실물 평가 + 감정 표현 평가(5인 테스트)",
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["orin_nano_super", "xl430"],
    estimatedHours: 5,
  },

  w7_exterior_final_check: {
    summary: "외장 전체 최종 점검 — 머리+바디+다리 커버 상태 확인 및 보정",
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w7_relearn_test: {
    summary: "재학습된 Walking RL 결과 반복 테스트 + 30분 전원 테스트 + BMS/NUC 안정성 확인",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["nuc", "bms", "battery_c"],
    estimatedHours: 8,
  },

  w7_emergency_manual: {
    summary: "비상 매뉴얼 작성 — 전원 시퀀싱, 비상정지, 낙상 차단, 재시작 절차 포함",
    resources: [
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mosfet", "emergency_stop_switch"],
    estimatedHours: 4,
  },

  w7_urdf_measurement_update: {
    summary: "실측 데이터로 URDF를 업데이트하고 Walking RL 재학습 트리거",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 6,
  },

  w7_smolvla_v2_dgx: {
    summary: "epsilon1이 정제한 v2 데이터로 SmolVLA v2 DGX 학습 실행",
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w7_walking_rl_final: {
    summary: "Walking RL 최종본을 delta2에 전달 + 시나리오 B/C 최종 확정 후 epsilon1에 전달",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: ["dgx_spark", "nuc"],
    estimatedHours: 4,
  },

  w7_sim2real_report: {
    summary: "sim-to-real 파이프라인 심층 분석 + 리포트 정리 (epsilon2+delta3 공동)",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: [],
    estimatedHours: 6,
  },

  w7_phase3_gate: {
    summary: "Phase 3 게이트: 머리 통합, SmolVLA v2 배포, Walking RL 최종, 외장 완성, 리포트",
    resources: [
      { label: "기획서 10절 (게이트 조건 — Phase 3)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 2,
  },

  // =======================================================================
  // WEEK 8 — 트랙 합류 + 풀 시나리오 1차
  // =======================================================================

  w8_body_merge: {
    summary: "퀵릴리즈로 상하체 결합 + 관절 가동 범위 실측 + 스텝 응답 테스트 (★핵심★)",
    steps: [
      "퀵릴리즈 핀/나비너트로 상하체 물리 결합",
      "관절 가동 범위 실측 (+-5도 이상 시 URDF 수정)",
      "관절 스텝 응답 테스트",
    ],
    resources: [
      { label: "기획서 7.2절 (상하체 결합부)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020"],
    estimatedHours: 4,
  },

  w8_power_integration: {
    summary: "전원 A+B+C 통합 배선하여 전체 시스템 전원 공급 확인",
    resources: [
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
    ],
    components: ["battery_a", "battery_b", "battery_c", "pdb", "bms", "dc_dc_converter"],
    estimatedHours: 4,
  },

  w8_real_body_gait: {
    summary: "실제 상체 장착 상태에서 보행 테스트 — 실패 시 delta3 재학습 (★핵심★)",
    resources: [
      { label: "기획서 8절 (Sim->Real — 실체 장착)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010"],
    estimatedHours: 6,
  },

  w8_mass_relearn: {
    summary: "실체 mass가 예상과 다를 경우 DGX에서 최종 Walking RL 재학습",
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w8_mosfet_real_verify: {
    summary: "실체 결합 상태에서 MOSFET 낙상 차단 실물 검증 + sim-to-real 비교",
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "mosfet"],
    estimatedHours: 3,
  },

  w8_walk_arm_policy: {
    summary: "보행 중 팔 정지 정책 + 대화->보행 명령 연동 + FETCH 타이머 튜닝(T1, T2)",
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝 — 타이머)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super", "nuc"],
    estimatedHours: 6,
  },

  w8_full_scenario_v1: {
    summary: "풀 시나리오 1차 테스트: 시선→인사→FETCH→자유보행 전체 흐름 실행 (★핵심★)",
    steps: [
      "시선 추적 (MediaPipe → 목 PID)",
      "인사 (TTS + 손 흔들기)",
      "대화 → FETCH 트리거",
      "FETCH: 보행→pick→복귀→handover",
      "자유 보행 + 대화",
      "보행 로그 기록 + 분석",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "camera_usb", "neopixel_led", "speaker", "microphone"],
    estimatedHours: 8,
  },

  w8_merge_gate: {
    summary: "합류 게이트: 상하체 결합, 실체 보행(직립+전진+정지), MOSFET 차단, 풀 시나리오 통과",
    resources: [
      { label: "기획서 10절 (게이트 조건 — 합류)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 2,
  },

  // =======================================================================
  // WEEK 9 — 안정화 + 답사 + 리허설 1차
  // =======================================================================

  w9_stabilization: {
    summary: "전원 참여로 풀 시나리오 반복 실행 + 5분 연속 보행 + 교수님 피드백 즉시 반영",
    steps: [
      "풀 시나리오 반복 실행 (실패 시 즉시 원인 분류+수정)",
      "5분 연속 보행 도전",
      "보행+대화 동시 테스트",
      "교수님 피드백 → delta3 재튜닝 → 즉시 반영",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc"],
    estimatedHours: 20,
  },

  w9_site_survey: {
    summary: "발표 장소 답사 — 네트워크, 바닥 마찰, 조명, 전원, 레이아웃 등 전원 체크",
    steps: [
      "5GHz 핫스팟 latency 측정 (500ms 이내) — epsilon1",
      "바닥 재질 마찰 확인 → delta3 policy 보정 — delta2",
      "MediaPipe 조명 테스트 — epsilon2",
      "전원 콘센트 위치 확인 — delta2",
      "로봇 분리 운반 → 현장 조립 (10분 이내) — delta1",
      "시연 레이아웃 마커 배치 (홈<->테이블<->관객) — epsilon1",
      "FETCH 타이머 현장 보정 (T1, T2) — epsilon1",
      "현장 보행 테스트 — delta2",
      "외장 상태 확인 (운송 중 파손 여부) — delta1+epsilon2",
    ],
    resources: [
      { label: "기획서 3절 (시연 환경 레이아웃)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w9_rehearsal_1: {
    summary: "리허설 1차 — 시나리오 전체 흐름 + 비상정지 + 서바이벌 전환 + 10보 직진 (★핵심★)",
    steps: [
      "시나리오 전체 흐름 (시선→인사→FETCH→자유보행)",
      "실패 시 원인 분류 + 즉시 수정",
      "시나리오 레벨 판정 (A/B/C)",
      "서바이벌 모드 전환 (네트워크 차단 → 계층 1/2)",
      "비상정지 테스트",
      "10보 직진 + 회전",
      "5분 낙상 없음 확인",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
      { label: "기획서 10절 (게이트 조건)", type: "internal", section: "10" },
    ],
    components: ["orin_nano_super", "nuc", "esp32"],
    estimatedHours: 8,
  },

  // =======================================================================
  // WEEK 10 — 리허설 2차 + 발표
  // =======================================================================

  w10_rehearsal_2: {
    summary: "발표 장소에서 리허설 2차 — 전체 시나리오 2회+ 반복 + 비상 시나리오 전환 확인",
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc", "esp32"],
    estimatedHours: 6,
  },

  w10_final_presentation: {
    summary: "최종 발표 — 시선/인사/대화/집기 + MOSFET 정상 + 비상정지 정상 + 리허설 2회+",
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
      { label: "기획서 10절 (최종 필수)", type: "internal", section: "10" },
    ],
    components: ["orin_nano_super", "nuc", "esp32", "xl430", "camera_usb", "neopixel_led", "speaker", "microphone"],
    estimatedHours: 4,
  },

  w10_scenario_level_a: {
    summary: "레벨 A (풀): FETCH 시퀀스(걸어가서 집고 돌아와서 전달) + 10보 이상 보행",
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 A)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_scenario_level_b: {
    summary: "레벨 B (보행 없이): 제자리 pick-place + 별도 보행 시연",
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 B)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_scenario_level_c: {
    summary: "레벨 C (받침대): 받침대에 고정 + 제자리 pick-place",
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 C)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_bonus_walk_talk: {
    summary: "보너스 목표: 보행+대화 동시 수행 + 30분 연속 보행",
    resources: [
      { label: "기획서 10절 (최종 선택)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 4,
  },
};
