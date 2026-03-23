// taskHints.js — 각 techTree 노드의 실행 힌트, 리소스, 예상 시간
// 기획서 v12 + 실행가이드 v12 기반

export const TASK_HINTS = {
  // =======================================================================
  // WEEK 0 — SO-ARM 커리큘럼 + 킥오프 (4일)
  // =======================================================================

  w0_soarm_assembly: {
    summary: "Week 0 Day 1 전원 공통 과제. SO-ARM을 직접 조립하며 로봇 하드웨어 감각을 익히는 첫 단계로, 이후 텔레오퍼레이션(Day 3)과 모방학습(Day 4)의 물리적 기반이 된다. 기획서 5.7절에 따라 U2D2 버스 분배(좌팔 6 / 우팔 6+목 2)를 고려해 ID를 할당한다.",
    steps: [
      "SO-ARM 키트 구성품 확인 — 서보 6개, 프레임 파트, 나사류 누락 체크",
      "서보모터(XL430) 6개를 프레임에 순서대로 조립 (어깨→팔꿈치→손목→그리퍼)",
      "U2D2 연결 후 Dynamixel Wizard2로 ID 할당 (좌팔 1~6, 우팔 7~12, 기획서 5.7절 참조)",
      "각 관절 캘리브레이션 — 중립 위치에서 position offset 설정",
      "전체 6축 동시 구동 테스트 (토크 ON/OFF, 각 관절 범위 확인)",
      "δ1은 조립 과정을 기록하여 조립 기준서 초안에 활용",
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
    summary: "δ1 전용 과제. SO-ARM 조립 경험을 바탕으로 조립 기준서 초안을 작성한다. 이 기준서는 Week 1에서 BHL 액추에이터 시험 조립 시 확장되고, 최종본은 δ2가 Week 2에 다리를 조립할 때 핵심 참조 문서가 된다 (기획서 6.2절 협업 구조 — δ1→δ2 조립 노트 인계).",
    steps: [
      "프레임 결합 시 나사 토크 기록 (M2: 0.5Nm, M3: 1.0Nm 등 실측치)",
      "기어 그리스 도포량 기록 (소량 — 과도하면 먼지 유입으로 기어 마모 가속)",
      "3D프린트 서포트 제거 시 파손 주의사항 기록 (얇은 벽면, 스냅핏 부위)",
      "조립 순서별 사진 첨부 (δ2 인수인계 대비, 특히 까다로운 결합부 클로즈업)",
      "공통 실수 및 해결법 메모 (예: 서보 혼 방향 오조립, 나사 길이 혼동)",
    ],
    resources: [
      { label: "기획서 6.2절 (협업 구조)", type: "internal", section: "6.2" },
    ],
    components: ["xl430"],
    estimatedHours: 2,
  },

  w0_head_spec_discuss: {
    summary: "δ1+ε2 공동 과제. 하이리온 캐릭터 머리의 외주 CNC 사양을 준비하기 위한 첫 논의로, ε2는 외형 디자인(레퍼런스+스케치)을, δ1은 내부에 들어갈 전자부품(카메라, LED 눈, 입 서보) 치수를 공유한다. 기획서 7.3절에 따르면 충돌 시 내부 공간 확보 우선(기능 > 외형)이 원칙이다.",
    steps: [
      "ε2: 하이리온 캐릭터 레퍼런스 이미지 수집 + 외형 스케치 준비",
      "δ1: 내부 전자부품 치수 정리 — 카메라(USB), LED 눈(NeoPixel) 2개, 입 서보(MG90S) 1개",
      "카메라 렌즈 위치와 LED 눈 개구부 크기 합의 (시야각 확보 vs 디자인)",
      "머리 무게 제약 확인 — 외주 조형물 ≤300g + 내부 전자부품 ≤400g = 총 ≤700g (기획서 7.3절)",
      "목 서보(XL430 x2)는 토르소 상단에 배치됨을 확인 (머리 무게 미포함)",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo", "xl430"],
    estimatedHours: 2,
  },

  w0_kr_parts_order: {
    summary: "ε2 전용 과제. Week 1부터 각 트랙이 실물 부품으로 작업을 시작하므로, Day 1에 한국 온라인 주문을 완료해야 배송 리드타임(2~5일)을 맞출 수 있다. 심천 조달 부품(모터, 배터리 등)과 겹치지 않도록 기획서 9.1절 조달 채널을 교차 확인한다.",
    steps: [
      "기획서 9.1절 조달 채널 기반으로 한국 구매 부품 리스트 최종 확인",
      "Orin Nano Super + carrier board 주문 (ε1이 Week 1에 JetPack 셋업 예정)",
      "NUC (BeeLink N95) 주문 (δ2가 Week 1에 RT 커널 설치 예정)",
      "XL430 x2 (목 서보 여분) + U2D2 x2 주문",
      "USB 카메라 + ESC(B-G431B-ESC1) x12 + 2020 알루미늄 프로파일 주문",
      "배송 추적 설정 — Week 1 월요일까지 도착 여부 확인, 미도착 시 대안 채널 탐색",
    ],
    resources: [
      { label: "기획서 9.1절 (조달 채널)", type: "internal", section: "9.1" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "u2d2", "camera_usb", "esc_b_g431b"],
    estimatedHours: 2,
  },

  w0_3dprint_start: {
    summary: "백그라운드 과제. BHL 액추에이터의 사이클로이드 기어박스(10세트)와 다리 구조물 3D프린트는 수일이 소요되므로 Day 1부터 프린터 2대를 풀가동해야 Week 1 시험 조립(δ1)과 Week 2 기어박스 후가공(δ2)에 맞출 수 있다. 기획서 7.1절에 따르면 BHL은 5DOF x 2 = 10개 액추에이터를 사용한다.",
    steps: [
      "BHL GitHub에서 최신 STL 파일 다운로드 (기어박스 + 다리 구조물)",
      "슬라이서 설정 — 기어박스는 정밀도 우선 (레이어 0.15mm, 인필 80% 이상), 구조물은 강도 우선",
      "프린터 2대에 작업 분배 — 프린터 A: 기어박스 10세트, 프린터 B: 다리 프레임 파트",
      "프린트 진행 중 품질 모니터링 (층간 분리, 서포트 부착 상태 확인)",
      "완성된 파트 서포트 제거 후 치수 검수 (베어링 시트 내경, 모터 마운트 구멍 직경)",
    ],
    resources: [
      { label: "BHL 공식 GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010"],
    estimatedHours: 8,
  },

  w0_soarm_sim: {
    summary: "Week 0 Day 2 전원 공통 과제. SO-ARM URDF 구조를 파악하고 IsaacSim/IsaacLab에서 시뮬레이션 검증한다. 기획서 2.2절에 따라 프로젝트 전체 시뮬레이션 플랫폼은 IsaacLab(USD)이므로, 커리큘럼 단계부터 IsaacLab을 사용하여 URDF→USD 파이프라인에 익숙해진다.",
    steps: [
      "SO-ARM URDF 파일 구조 파악 — link, joint, transmission 태그 이해",
      "URDF → USD 변환 (IsaacLab urdf_converter 또는 Isaac Sim URDF importer)",
      "IsaacLab에서 SO-ARM 로드 + joint 구동 테스트",
      "중력 하에서 자세 유지 확인 (IsaacSim 물리 엔진)",
      "δ3의 BHL IsaacLab 환경과 동일 플랫폼임을 확인 — 향후 통합 용이",
    ],
    resources: [
      { label: "IsaacLab URDF Import", url: "https://isaac-sim.github.io/IsaacLab/main/index.html" },
    ],
    components: ["xl430"],
    estimatedHours: 4,
  },

  w0_isaaclab_load: {
    summary: "δ3 전용 체크포인트 과제. IsaacLab에서 BHL 환경을 로드하는 것은 전체 Sim→Real 파이프라인(기획서 8절)의 출발점이다. 이 환경이 동작해야 Week 1에서 커스텀 상부 추가, 파라메트릭 직립 테스트, Walking RL 학습이 가능하다. NVIDIA GPU(DGX Spark)가 필요하며, BHL은 IsaacLab 환경이 검증되어 있으므로 로드 자체는 빠르게 완료되어야 한다.",
    steps: [
      "BHL GitHub 리포지토리 클론 (최신 릴리즈 태그 확인)",
      "IsaacLab 설치 — Isaac Sim + IsaacLab 확장 (NVIDIA GPU 필수, DGX Spark 활용)",
      "BHL USD 에셋 로드 + 시뮬 환경 실행 확인",
      "단순 직립 테스트 실행으로 환경 정상 동작 검증",
      "체크포인트 기록 — 환경 버전, 의존성 버전, 로드 시간, 스크린샷 첨부",
      "Week 1 커스텀 상부 추가 계획 사전 검토 (토르소 mesh, 머리 mass, SO-ARM 간략 모델)",
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
    summary: "δ2 전용 과제. 시연 당일 최소 30분 연속 구동이 필요하므로, 각 서브시스템(Orin 25W, NUC 15W, SO-ARM STS3215 x12 + 목 XL430 x2, BHL BLDC x10)의 소비전류를 합산하여 배터리 A/B/C 용량이 충분한지 사전 검증한다. 기획서 7.5절의 배터리 배치 계획과 7.7절 전원 시퀀싱의 기초 데이터가 된다.",
    steps: [
      "각 보드/모터 스펙시트에서 정격 소비전력 추출 (Orin 25W, NUC 15W 등)",
      "SO-ARM XL430 x14개 (양팔 12 + 목 2) 피크/평균 전류 계산",
      "BHL BLDC x10개 (MAD M6C12 x6 + 5010 x4) 보행 시 평균 전류 추정",
      "배터리 A/B/C 각각의 용량(Wh) 대비 소비전력으로 구동 시간 산출",
      "30분 구동 가능 여부 판정 — 부족 시 배터리 용량 업그레이드 또는 사용 패턴 조정 제안",
    ],
    resources: [
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "mad_m6c12", "battery_a", "battery_b", "battery_c"],
    estimatedHours: 2,
  },

  w0_weight_estimate: {
    summary: "δ2 전용 과제. 상체 무게는 BHL 다리의 직립/보행 안정성에 직접 영향을 미친다. 기획서 7.4절에 따르면 Week 1에 δ3가 파라메트릭 직립 테스트(3~6kg x CoM 40~60cm)를 실행하고, Week 2 초에 이 적산값과 대조하여 상체 무게 예산을 최종 확정한다. 여기서의 사전 적산은 그 비교 기준이 된다.",
    steps: [
      "Orin Nano Super + carrier board 무게 확인 (스펙시트 기반)",
      "NUC (BeeLink N95) 무게 확인",
      "SO-ARM x2 (서보 x12 + 프레임) + 목 XL430 x2 무게 합산",
      "배터리 A + B + 카메라 + 스피커 + 마이크 + LED 등 부품별 무게 적산",
      "토르소 프레임(2020 알루미늄 프로파일 + 3D프린트 브래킷) 무게 추정",
      "총합 산출 + δ3의 파라메트릭 직립 테스트 조합(3/4/5/6kg) 중 해당 구간 확인",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "camera_usb", "battery_a", "battery_b"],
    estimatedHours: 2,
  },

  w0_llm_latency_test: {
    summary: "ε1 전용 과제. 시연 시나리오(기획서 3절)에서 관객과의 대화→물체 가져오기(FETCH) 트리거가 핵심이므로, LLM의 JSON 응답 안정성과 전체 대화 파이프라인(STT→LLM→TTS) 지연 시간을 사전에 검증한다. Groq 클라우드(기획서 5.4절)를 1차 연결로 사용하며, JSON 파싱 실패율이 높으면 프롬프트 조정이나 응답 포맷 제약이 필요하다.",
    steps: [
      "Groq API 키 발급 + Python 테스트 스크립트 작성",
      "100회 호출 테스트 — JSON 형식 응답 요청 후 파싱 성공/실패율 측정",
      "STT(Whisper) → LLM(Groq) → TTS 전체 라운드트립 시간 측정 (목표: 2초 이내)",
      "JSON 액션 스키마 초안 작성 — fetch(target_object), greet, talk 등 액션 타입 정의",
      "파싱 실패 패턴 분석 — 실패 시 프롬프트 개선 방향 메모",
      "결과 정리하여 Week 1 합의 미팅에서 공유 준비",
    ],
    resources: [
      { label: "Groq API 문서", url: "https://console.groq.com/docs" },
      { label: "기획서 5.4절 (네트워크)", type: "internal", section: "5.4" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 3,
  },

  w0_bhl_urdf_study: {
    summary: "ε2 전용 과제. Week 1에서 URDF export 스크립트 셋업과 IsaacLab 검증 루프를 담당하게 되므로, BHL URDF의 구조(link/joint 트리, mass/inertia 값, 메쉬 파일 경로)를 문서 수준에서 사전 파악해둔다. 기획서 2.2절에 따르면 URDF → USD 변환이 IsaacLab 환경의 기본 흐름이다.",
    steps: [
      "BHL GitHub에서 URDF 파일 위치 확인 (description/ 또는 urdf/ 디렉토리)",
      "URDF 트리 구조 파악 — base_link부터 발끝까지 link/joint 계층",
      "각 link의 mass, inertia, visual/collision 메쉬 파일 경로 확인",
      "joint 타입(revolute/fixed), 축 방향, limit 값 정리",
      "Week 1 URDF export 스크립트 셋업 시 필요한 사전 지식 메모",
    ],
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w0_teleop: {
    summary: "Week 0 Day 3 전원 공통 과제 (커리큘럼 5-6~5-7). Leader-Follower 텔레오퍼레이션을 직접 체험하며 로봇 조작 감각을 익힌다. δ1은 화각과 작업 공간을 체감하여 Week 1 카메라 위치 확정에 반영하고, ε2는 Week 3 데이터 수집 투입 전 조작 감각을 사전 체험한다.",
    steps: [
      "Leader ARM + Follower ARM USB 연결 및 ID 확인",
      "LeRobot 텔레오퍼레이션 코드 실행 — Leader 관절값을 Follower에 실시간 전송",
      "카메라 스트리밍 셋업 + 화면에 Follower 시점 표시",
      "간단한 물체 집기 연습 — 컵/텀블러 등으로 그리퍼 감각 익히기",
      "δ1: 화각·작업 공간 체감 기록 (카메라 위치/각도 후보 메모)",
      "ε2: 수집 시 주의할 조작 패턴 메모 (접근 각도, 그립 타이밍)",
    ],
    resources: [
      { label: "LeRobot 텔레오퍼레이션 가이드", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 4,
  },

  w0_bhl_actuator_doc: {
    summary: "δ3 전용 과제. BHL 액추에이터(MAD M6C12 150KV x6, 5010 110KV x4)의 파라미터를 문서화하면 IsaacLab 시뮬에서의 모터 모델링 정확도가 올라간다. ROS2 토픽 리스트 초안은 Week 1 합의 미팅(기획서 5.6절)에서 인터페이스 확정의 기초 자료가 된다.",
    steps: [
      "MAD M6C12 (150KV, 6개 — 고관절/무릎) 스펙 정리: KV, 최대 토크, 연속 전류",
      "MAD 5010 (110KV, 4개 — 발목) 스펙 정리: KV, 최대 토크, 연속 전류",
      "사이클로이드 기어박스 기어비 확인 (BHL 문서에서 추출)",
      "ESC (B-G431B-ESC1) 제어 파라미터 정리 — CAN 프로토콜, 제어 주기(250Hz)",
      "ROS2 토픽 리스트 초안 작성 — /gait/cmd(Orin→NUC), /gait/status(NUC→Orin) 등 (기획서 5.3절 참조)",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 3,
  },

  w0_bhl_lowlevel_reading: {
    summary: "δ2 전용 과제. BHL lowlevel C 코드는 NUC에서 실행되어 10개 액추에이터를 CAN 버스로 250Hz 제어하는 핵심 모듈이다(기획서 5.3절, 7.1절). Week 1에 NUC 도착 후 즉시 빌드+숙달해야 하므로, NUC 없이도 개인 노트북에서 코드 리딩과 구조 파악을 선행한다. Day 3~4에 걸쳐 진행.",
    steps: [
      "BHL GitHub 클론 후 lowlevel C 코드 디렉토리 구조 파악",
      "메인 제어 루프 분석 — 센서 읽기 → policy 출력 적용 → CAN 쓰기 사이클",
      "CAN 통신 프로토콜 이해 — 4개 버스 구성, 모터 ID 매핑, 메시지 포맷",
      "policy 입출력 인터페이스 확인 — 관절 각도/속도 입력, 토크/위치 명령 출력",
      "안전 관련 코드 확인 — 토크 리밋, 소프트 리밋, 에러 핸들링",
    ],
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: ["nuc"],
    estimatedHours: 4,
  },

  w0_head_spec_final: {
    summary: "δ1+ε2 공동 과제 (Day 3). Day 1 논의를 바탕으로 머리 외주 사양서를 최종 마무리한다. ε2는 Week 0~1에 하이리온 3D 모델링(Blender/Fusion360)을 진행하여 STL을 준비하고, Week 1에 외주 발주하므로 이 사양서가 모델링의 구속 조건이 된다. 기획서 7.3절 참조.",
    steps: [
      "외형 치수 확정 — 높이 ~25cm, 폭, 깊이, 전체 비례",
      "내부 전자부품 배치 도면 마무리 — 카메라(정면 USB) + LED 눈(NeoPixel x2) + 입 서보(MG90S)",
      "개구부 위치/크기 확정 — 카메라 렌즈 홀, LED 디퓨저 영역, 입 서보 가동 범위",
      "무게 제약 명시 — 외주 조형물 ≤300g (스티로폼 CNC 기준)",
      "배선 경로 확인 — 모든 배선은 목 내부를 통해 토르소로 내려감 (기획서 7.3절)",
      "사양서 문서화 완료 → ε2의 3D 모델링 작업 시작 가능 상태 확인",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo"],
    estimatedHours: 3,
  },

  w0_state_machine_eval: {
    summary: "ε1 전용 과제 (Day 3). 시연 시나리오의 7개 상태(IDLE/TALKING/MANIPULATING/WALKING/FETCH/LOW_BATTERY/EMERGENCY, 기획서 5.1절)를 관리할 프레임워크를 선정한다. 특히 FETCH 상태의 서브스텝 시퀀스(WALKING→MANIPULATING→WALKING→handover)를 표현할 수 있어야 한다. 선정 결과는 Week 1 합의 미팅에서 전체 공유한다.",
    steps: [
      "기획서 5.2절 상태별 프로세스-리소스 매핑표를 참고하여 초안 작성 (Orin GPU/CPU, NUC, ESP32 할당)",
      "smach 설치 + 예제 실행 — 계층적 상태 머신, 동시 실행 컨테이너 지원 확인",
      "FlexBE 설치 + 예제 실행 — GUI 기반 행동 트리 편집기, 런타임 수정 기능 확인",
      "비교 기준: FETCH 서브스텝 표현력, ROS2 호환성, 디버깅 편의성, 비상정지 전환 용이성",
      "프레임워크 최종 선정 + 선정 근거 문서화",
      "Week 1 합의 미팅 발표 자료 준비 (기획서 5.6절 인터페이스 명세와 연계)",
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
    summary: "Week 0 Day 4 전원 공통 과제 (커리큘럼 5-8~5-11). SO-ARM으로 데이터 수집→모방학습 훈련→자율 동작→종합 미션까지 전체 파이프라인을 체험한다. 이 경험이 프로젝트의 SmolVLA 수집/훈련 워크플로 이해의 기초가 되며, δ1은 수집 조작 감각을, ε1은 SmolVLA 수집 기준 문서 초안에 반영할 인사이트를 얻는다.",
    steps: [
      "LeRobot 데이터 수집 스크립트 실행 — 텔레오퍼레이션으로 에피소드 녹화",
      "수집 데이터 형식 확인 — 관절 각도, 카메라 이미지, 타임스탬프 구조 파악",
      "모방학습 훈련 실행 (LeRobot 기본 모델) — 수렴 과정 관찰",
      "훈련된 모델로 자율 동작 테스트 — 성공/실패 패턴 관찰",
      "종합 미션 실행 (커리큘럼 최종 단계) — 전체 파이프라인 완주",
      "δ1: 수집 조작 감각 기록, ε1: SmolVLA 수집 기준 문서 반영 사항 메모",
    ],
    resources: [
      { label: "LeRobot 프레임워크", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 4,
  },

  w0_smolvla_data_prep: {
    summary: "ε1 전용 과제 (Day 4). Week 2~3에 본격 수집이 시작되기 전에 SmolVLA 수집 기준 문서 초안을 작성한다. 기획서 4.1절의 물체 3종(스타벅스 컵, 텀블러, 인형) x 600 에피소드 수집 계획과 4.2절의 1주 집중 수집 전략을 반영하며, LeRobot 데이터 포맷을 사전에 파악해둔다.",
    steps: [
      "기획서 4.1절 물체 및 수집 조건 정독 — 물체별 200개, 변형 축(위치 ±3cm, 회전 0/90/180°, 접근 방향)",
      "LeRobot 데이터 포맷 조사 — 에피소드 구조, 이미지 저장 방식, 메타데이터 필드",
      "수집 기준 문서 초안 작성 — 에피소드 길이, 성공/실패 판정 기준, 메타데이터 기록 항목",
      "SmolVLA 모델 입력 요구사항 확인 — 카메라 해상도, 관절 데이터 형식",
      "Week 1에서 δ1과 합의할 항목 정리 (수집 환경, 물체 배치, 카메라 위치)",
    ],
    resources: [
      { label: "SmolVLA (HuggingFace)", url: "https://huggingface.co/HuggingFaceTB/SmolVLA-base" },
      { label: "LeRobot 데이터 포맷", url: "https://github.com/huggingface/lerobot/blob/main/lerobot/common/datasets/README.md" },
      { label: "기획서 4절 (SmolVLA 태스크 정의)", type: "internal", section: "4" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w0_isaaclab_checkpoint: {
    summary: "δ3 전용 과제 (Day 4). Day 2에서 로드한 IsaacLab 환경의 체크포인트 결과를 정리하고, Week 1에 실행할 파라메트릭 직립 테스트(상부 3~6kg x CoM 40~60cm x 배터리 배치)의 구체적 계획을 수립한다. 기획서 7.4절에 따르면 Week 2 초에 직립 결과가 나와야 상체 무게 예산이 확정된다.",
    steps: [
      "IsaacLab 환경 로드 결과 문서화 — 환경 버전, 물리 파라미터, 기본 직립 성공 여부",
      "파라메트릭 직립 테스트 변수 정의 — 상부 mass(3/4/5/6kg), CoM 높이(40/50/60cm), 배터리 배치(토르소/hip)",
      "테스트 자동화 스크립트 설계 — 조합별 시뮬 실행 + 결과 로깅 방식",
      "Week 1 실행 일정 계획 — 조합당 소요 시간 추정, 전체 1~2일 내 완료 목표",
      "δ2의 상체 무게 적산값과 대조할 비교 프레임 준비",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 2,
  },

  w0_sim2sim_study: {
    summary: "δ2 전용 과제 (Day 4). Sim2sim(IsaacLab→MuJoCo)은 시뮬에서 학습한 Walking RL policy를 실제 NUC에서 실행하기 전 중간 검증 단계다(기획서 8절). Week 3에서 본격 Sim2sim 검증을 실행하므로, BHL 문서에서 절차와 변환 스크립트 구조를 사전 파악한다.",
    steps: [
      "BHL 문서에서 Sim2sim 관련 섹션 정독 — IsaacLab→MuJoCo 변환 절차",
      "MuJoCo XML 모델 구조 확인 — URDF와의 차이점 파악",
      "Sim2sim 변환 스크립트(있을 경우) 코드 리딩",
      "IsaacLab policy 출력 → MuJoCo 입력 인터페이스 매핑 이해",
      "lowlevel C 코드 리딩 계속 — policy 실행 파트와 CAN 통신 파트 집중",
    ],
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
      { label: "MuJoCo 공식 문서", url: "https://mujoco.readthedocs.io/" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w0_esp32_fall_research: {
    summary: "ε2 전용 과제 (Day 4). 기획서 7.8절 보행 안전 설계에 따르면 ESP32가 MPU6050 IMU로 낙상을 감지하면 HW 인터럽트(ISR)로 MOSFET을 차단하여 BHL 다리 전원을 즉시 끊는다. Week 1에서 실제 구현을 하므로, 여기서는 회로 구성과 임계값 설정에 필요한 사전 조사를 수행한다.",
    steps: [
      "ESP32 + MPU6050 I2C 연결 방법 조사 — 핀 배치, 라이브러리 선택",
      "낙상 감지 알고리즘 조사 — 기울기 각도 임계값, 가속도 스파이크 기반 방식 비교",
      "MOSFET 전원 차단 회로 구성 조사 — N-channel MOSFET, 게이트 드라이버 필요 여부",
      "평가 지표 구상 — 낙상 감지 지연(ms), false positive 비율, 차단 후 복구 절차",
      "Week 1 구현 계획 수립 — 필요 부품(심천 조달 확인), 테스트 시나리오",
    ],
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050"],
    estimatedHours: 3,
  },

  w0_shenzhen_procurement: {
    summary: "별도 진행 과제. 심천 현지에서 BHL 핵심 부품(MAD BLDC 모터, 배터리, BMS, PDB)과 전자부품을 일괄 조달한다. 이 부품들이 Week 1까지 도착해야 δ2의 전원 조립, δ1의 액추에이터 시험 조립, ε2의 ESP32 낙상 감지 구현이 가능하다. 기획서 9.1절 조달 채널, 9.2절 예산 참조.",
    steps: [
      "출발 전: MAD Components에 사전 연락 — M6C12 150KV x6, 5010 110KV x4 재고 확인 및 수령 일정 조율",
      "출발 전: BHL BOM 최신 릴리즈 확인 + 전체 부품 리스트를 한국 조달분과 교차 대조",
      "출발 전: 화창베이 구매 리스트 준비 — 부품명 + 중국어 명칭 + 수량 + 예상 가격",
      "현지: MAD 모터 수령 + 외관/축 상태 검수",
      "현지: 화창베이 일괄 구매 — ESP32, MPU6050 x2~3, CAN-USB x2, MOSFET, 베어링, 히트인서트, DC-DC, 비상정지 스위치, 마이크, 스피커, LED, 환기팬, 배선재",
      "현지: 배터리 A+B+C + BMS x3 + PDB 구매 — 배터리 사양이 기획서 7.5절 요구와 일치하는지 확인",
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
    summary: "[공통] Week 1 주 초 전체 합의 미팅. Week 0에서 각자 준비한 결과물(δ2 무게 적산, ε1 상태 머신 프레임워크, δ3 ROS2 토픽 초안, ε1 JSON 스키마)을 모아 프로젝트의 핵심 인터페이스와 리소스 할당을 확정한다. 기획서 5.6절에 따르면 Week 1 이후 인터페이스 변경 시 전체 공지 필수이므로, 이 미팅이 설계 동결 시점이다.",
    steps: [
      "δ2: 상체 무게 적산값 발표 — Week 2 직립 테스트 결과와 대조 예정임을 공유",
      "ε1: Week 0에서 선정한 상태 머신 프레임워크(smach 또는 FlexBE) 발표 + 선정 근거",
      "δ3: ROS2 토픽 리스트 초안 발표 — /gait/cmd, /gait/status 등 (기획서 5.3절)",
      "배터리 배치 방향 합의 — 토르소 최하단 vs hip (직립 테스트 결과로 최종 결정 예정)",
      "전원 시퀀싱 확정 — A ON → Orin/NUC 부팅 → B ON → Dynamixel → C ON → BHL (기획서 7.7절)",
      "U2D2 버스 분배 확정 — #1: 좌팔 6개(ID 1~6), #2: 우팔 6개+목 2개(ID 7~14) (기획서 5.7절)",
      "카메라 마운트 위치/각도 확정 — 이후 변경 금지, 수집/추론 동일 조건 보장 (기획서 7.2절)",
    ],
    resources: [
      { label: "기획서 5.6절 (인터페이스 명세)", type: "internal", section: "5.6" },
      { label: "기획서 5.7절 (U2D2 버스 분배)", type: "internal", section: "5.7" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_workspace_camera: {
    summary: "δ1 전용 과제. SO-ARM의 실제 작업 공간(도달 범위)을 실측하고, 카메라가 물체와 그리퍼를 모두 포착할 수 있는 최적 위치/각도를 확정한다. 기획서 7.2절에 따라 이후 변경 금지이며, Week 2~3 수집과 시연 당일 추론이 동일 카메라 조건에서 이루어져야 한다. 테이블 높이와 물체 위치도 이 시점에 확정한다 (기획서 4.1절).",
    steps: [
      "SO-ARM을 토르소 마운트 높이에 놓고 도달 범위 실측 (전방/측방/하방)",
      "물체 3종(컵, 텀블러, 인형)을 테이블에 놓고 그리퍼 접근 가능 영역 확인",
      "카메라를 여러 위치/각도에 임시 고정하여 화각 테스트 (물체 + 그리퍼 동시 포착)",
      "최적 카메라 위치/각도 확정 + 고정 브래킷 설계 또는 기존 마운트 선정",
      "확정 조건을 문서화하여 ε1(수집 기준 문서)과 공유",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["xl430", "camera_usb"],
    estimatedHours: 2,
  },

  w1_grip_test: {
    summary: "δ1 전용 과제. SO-ARM101 그리퍼의 jaw 폭(~5~6cm)으로 시연 물체 3종을 실제로 잡을 수 있는지 검증한다(기획서 7.10절). 그립 실패 시 고무 패드 부착이나 물체 교체로 대응하며, 이 결과가 Week 2~3 수집 물체를 최종 결정한다.",
    steps: [
      "스타벅스 테이크아웃 컵(빈 컵+뚜껑) 그립 테스트 — 5회 반복, 성공률 기록",
      "텀블러 그립 테스트 — 직경, 무게, 표면 마찰 확인",
      "하이리온 인형 그립 테스트 — 변형 가능한 소재의 그립 안정성 확인",
      "실패 시 대응: 고무 패드(실리콘 시트) 부착 → 재테스트, 또는 물체 교체 후보 선정",
      "최종 물체 3종 확정 + 각 물체별 최적 접근 방향(정면/측면) 기록",
    ],
    resources: [
      { label: "기획서 7.10절 (그리퍼 검증)", type: "internal", section: "7.10" },
    ],
    components: ["xl430"],
    estimatedHours: 2,
  },

  w1_teleop_env: {
    summary: "δ1 전용 과제. Week 2부터 에피소드 수집이 시작되므로, Leader(조종용) + Follower(실행용) + 카메라 녹화가 통합된 텔레오퍼레이션 환경을 완성해야 한다. LeRobot 프레임워크 기반으로 데이터가 자동 저장되는 파이프라인을 구축한다.",
    steps: [
      "Leader ARM과 Follower ARM을 작업 테이블에 고정 배치",
      "LeRobot 텔레오퍼레이션 + 녹화 스크립트 통합 실행 확인",
      "카메라를 확정된 위치/각도에 고정 마운트",
      "에피소드 저장 경로 + 메타데이터 자동 기록 설정 (LeRobot 데이터 포맷)",
      "테스트 에피소드 3~5개 녹화 → 데이터 무결성 확인 (이미지, 관절값, 타임스탬프)",
    ],
    resources: [
      { label: "LeRobot 텔레오퍼레이션", url: "https://github.com/huggingface/lerobot" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 3,
  },

  w1_torso_cad: {
    summary: "δ1 전용 과제. 기획서 7.2절의 토르소 구조(~25cm, 2020 알루미늄 프로파일 프레임)를 CAD로 설계한다. Week 2에서 실제 조립(11단계)을 진행하므로, 모든 부품 마운트 위치와 환기 구조, 퀵릴리즈 hip 결합부가 이 설계에 포함되어야 한다. 상하체 결합은 운송 시 분리→현장 10분 조립이 가능해야 한다(기획서 7.11절).",
    steps: [
      "2020 알루미늄 프로파일 프레임 레이아웃 설계 (높이 ~25cm, 폭/깊이는 부품 수납 기준)",
      "내부 부품 배치 설계 — 배터리 A+B(최하단), PDB+DC-DC, NUC, Orin, 환기팬 (기획서 7.2절 순서)",
      "3D프린트 브래킷 설계 — SO-ARM 어깨 마운트, Orin/NUC 마운트, 배터리 슬롯, 머리 목 마운트(상단)",
      "환기 구조 설계 — Orin 방열판 위 40mm 팬 + 배기구(상단) + 흡기구(하단) (기획서 7.9절)",
      "퀵릴리즈 hip 결합부 설계 — 나비너트 또는 퀵릴리즈 핀, 10분 이내 결합/분리 가능",
      "δ2와 hip 인터페이스 치수 합의 (BHL 다리 프레임과의 결합 부위)",
    ],
    resources: [
      { label: "기획서 7.2절 (토르소)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020"],
    estimatedHours: 6,
  },

  w1_actuator_trial_assembly: {
    summary: "δ1 전용 과제. 3D프린트된 사이클로이드 기어박스에 MAD BLDC 모터를 결합하여 BHL 액추에이터 3개를 시험 조립한다. 이 과정에서 Week 0 SO-ARM 조립 기준서를 BHL 액추에이터용으로 확장하며, 완성된 기준서는 δ2가 Week 4에 10개 액추에이터를 본 조립할 때 핵심 참조 문서가 된다(기획서 6.2절 δ1→δ2 조립 노트 인계).",
    steps: [
      "3D프린트 기어박스 서포트 제거 + 리밍 — 베어링 시트, 모터 축 구멍 정밀 가공",
      "기어박스 + MAD BLDC 모터(M6C12 또는 5010) 결합 — 정렬 확인, 나사 토크 기록",
      "ESC(B-G431B-ESC1) 연결 + CAN 통신 핀 배선 확인",
      "조립 기준서 확장 — 기어박스 후가공 주의사항, 모터 결합 순서, 그리스 도포, 베어링 압입 방법",
      "사진 첨부 문서화 + δ2에 인수인계 세션 진행",
      "나머지 7개는 δ2가 Week 4에 본 조립 시 기준서 참조",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
      { label: "기획서 6.2절 (협업 구조 — 조립 노트 인계)", type: "internal", section: "6.2" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w1_orin_setup: {
    summary: "ε1 전용 과제. Orin Nano Super는 시연 당일 SmolVLA 추론(TensorRT), MediaPipe, ROS2, 상태 머신, TTS, LED, SO-ARM 제어를 모두 담당하는 메인 보드다(기획서 5.3절). Week 3에 TensorRT 변환/배포가 예정되어 있으므로, 이 시점에 기본 셋업을 완료해야 한다.",
    steps: [
      "JetPack SDK 설치 — L4T + CUDA + cuDNN + TensorRT (Orin Nano Super용 버전 확인)",
      "ROS2 Humble 설치 + 기본 토픽 퍼블리시/구독 테스트",
      "카메라 드라이버(v4l2/USB) 설정 + 이미지 스트리밍 확인",
      "U2D2 x2 USB 연결 확인 — Dynamixel SDK 설치 + 서보 통신 테스트",
      "Orin USB 오디오(스피커 + 마이크) 장치 인식 확인",
      "기본 시스템 벤치마크 — GPU 사용률, 메모리, 열 상태 모니터링 셋업",
    ],
    resources: [
      { label: "JetPack 설치 가이드", url: "https://developer.nvidia.com/embedded/jetpack" },
      { label: "기획서 5.3절 (컴퓨팅 분배)", type: "internal", section: "5.3" },
    ],
    components: ["orin_nano_super", "camera_usb"],
    estimatedHours: 6,
  },

  w1_echo_cancel_test: {
    summary: "ε1 전용 과제. 시연 시나리오(기획서 3절)에서 로봇이 TTS로 음성 출력하면서 동시에 마이크로 관객 음성을 수신해야 하므로, 에코(자기 음성 피드백)가 STT를 방해하는지 검증한다. AEC가 필요하면 Week 2에서 후속 구현을 진행한다.",
    steps: [
      "Orin USB 오디오 장치(스피커 + 마이크) 연결 및 기본 재생/녹음 테스트",
      "TTS 재생 중 마이크 녹음 동시 실행 — 에코 수준 측정",
      "AEC 필요 여부 판단 — 에코가 STT 정확도를 유의미하게 저하시키는지 확인",
      "필요 시 AEC 라이브러리(SpeexDSP, WebRTC AEC 등) 후보 조사",
    ],
    resources: [
      { label: "기획서 11절 (리스크 — 에코 캔슬링)", type: "internal", section: "11" },
    ],
    components: ["orin_nano_super", "speaker", "microphone"],
    estimatedHours: 3,
  },

  w1_state_machine_design: {
    summary: "ε1 전용 과제. Week 0에서 선정한 프레임워크로 상태 머신의 상세 설계를 확정한다. 7개 상태 + FETCH 서브스텝(기획서 5.1절)의 전환 규칙, 각 상태에서의 프로세스-리소스 할당(기획서 5.2절)을 구체화한다. 동시에 SmolVLA 수집 기준 문서를 δ1과 합의하여 Week 2 수집 시작에 대비한다.",
    steps: [
      "상태 전환 다이어그램 작성 — 7개 상태 + FETCH 서브스텝 5단계 (기획서 5.1절 기반)",
      "각 상태별 활성 프로세스 + 리소스 할당 명세 (기획서 5.2절 매핑표 기반)",
      "비상정지(EMERGENCY) 전환 로직 설계 — 어느 상태에서든 즉시 전환, ESP32 트리거 수신",
      "SmolVLA 수집 기준 문서를 δ1과 합의 — 카메라 위치, 에피소드 길이, 성공 판정 기준",
      "상태 머신 설계 문서 완성 → Week 2 구현 시작 준비",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
      { label: "기획서 5.2절 (상태별 프로세스-리소스)", type: "internal", section: "5.2" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w1_head_order: {
    summary: "ε2 전용 과제. Week 0에서 준비한 사양서와 3D 모델링(Blender/Fusion360) 결과물(STL)을 최종 확인하고 스티로폼 CNC 외주를 발주한다. 기획서 7.3절에 따르면 납기 3~4주이므로, Week 1에 발주해야 Week 5~6 도착이 가능하다. 미도착 시 플랜 B(수작업 스티로폼 조각)로 전환된다.",
    steps: [
      "3D 모델(STL) 최종 검수 — 내부 전자부품 공간, 개구부, 배선 경로 재확인",
      "외주 업체 선정 + 견적 확인 — 스티로폼 CNC 절삭, 재질/밀도 지정",
      "발주 + 납기 일정 확인 (목표: Week 5~6 도착)",
      "δ1에 발주 완료 통보 — Week 4 표면 마감 일정 사전 공유",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작 타임라인)", type: "internal", section: "7.3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w1_body_exterior_direction: {
    summary: "ε2 전용 과제. 하이리온 캐릭터 컬러의 천/펠트로 토르소를 감싸는 바디 외장의 방향을 확정하고(기획서 7.6절), 동시에 SmolVLA 평가 지표와 스크립트 초안을 작성한다. 평가 스크립트는 Week 2 미니 파인튜닝 결과 검증부터 사용되므로 선행 준비가 필요하다.",
    steps: [
      "바디 외장 컬러/소재 확정 — 하이리온 캐릭터 컬러 천 또는 펠트, 벨크로 고정 방식",
      "환기구 메쉬 소재 선정 — 배기구/흡기구 부분은 통풍 가능한 메쉬 (기획서 7.6절)",
      "SmolVLA 평가 지표 정의 — 물체별 성공률, 그립 실패 유형, 에피소드 완료 시간",
      "평가 스크립트 초안 작성 — 자동 성공/실패 판정 + 결과 시각화",
      "Week 4 바디 천 커버 패턴 제작을 위한 토르소 치수 사전 확인 (δ1 CAD 참조)",
    ],
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_nuc_rt_kernel: {
    summary: "δ2 전용 과제. NUC(BeeLink N95)는 BHL 다리의 lowlevel 제어를 담당하며, 10개 액추에이터를 CAN 버스 250Hz로 구동하려면 RT(실시간) 커널이 필수다(기획서 5.3절, 7.1절). xanmod RT 커널로 실시간성을 확보하고, CAN-USB 드라이버를 활성화하여 Week 1 후반 lowlevel C 빌드의 기반을 준비한다.",
    steps: [
      "Ubuntu 22.04 클린 설치 (BeeLink N95 BIOS 설정 확인)",
      "xanmod RT 커널 빌드 또는 사전 빌드 패키지 설치",
      "RT 커널 부팅 확인 + uname -r로 커널 버전 검증",
      "CAN-USB x2 드라이버 활성화 + socketcan 설정 (ip link set can0 type can bitrate 1000000)",
      "실시간성 latency 테스트 — cyclictest로 worst-case latency 측정 (목표: <1ms)",
      "ROS2 Humble 설치 (Orin과의 Ethernet 통신 준비)",
    ],
    resources: [
      { label: "xanmod 커널", url: "https://xanmod.org/" },
      { label: "기획서 5.3절 (NUC 역할)", type: "internal", section: "5.3" },
    ],
    components: ["nuc", "can_usb"],
    estimatedHours: 6,
  },

  w1_bhl_lowlevel_build: {
    summary: "δ2 전용 과제. Week 0에서 코드 리딩한 BHL lowlevel C 코드를 실제 NUC에서 빌드하고, 모터 없이 더미 CAN 루프로 제어 사이클을 반복 실행하며 숙달한다. Week 4에 실제 액추에이터를 연결할 때 소프트웨어 측 준비가 완료된 상태여야 하며, δ3가 인계한 IsaacLab 환경도 직접 실행해본다.",
    steps: [
      "NUC에 BHL 리포지토리 클론 + 빌드 의존성 설치",
      "lowlevel C 코드 빌드 (make/cmake) — 컴파일 에러 해결",
      "더미 CAN 루프 실행 — vcan(가상 CAN) 인터페이스로 모터 없이 제어 사이클 테스트",
      "CAN 메시지 모니터링 — candump으로 전송 메시지 포맷/주기 확인",
      "policy 입력 인터페이스 테스트 — 더미 관절 각도 입력 → 토크 명령 출력 확인",
      "δ3가 인계한 IsaacLab 환경을 NUC에서 간단히 실행하여 인수 확인",
    ],
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: ["nuc", "can_usb"],
    estimatedHours: 6,
  },

  w1_power_assembly: {
    summary: "δ2 전용 과제. 기획서 7.5절(배터리 배치)과 7.7절(전원 시퀀싱)에 따라 전원 분배 시스템을 조립한다. PDB에서 배터리 A(Orin/NUC), B(Dynamixel), C(BHL BLDC)를 분배하고, DC-DC 컨버터로 5V/12V/19V를 생성한다. 비상정지 시 B+C만 차단하고 A는 유지하여 Orin 로그를 보존해야 한다.",
    steps: [
      "PDB에 배터리 A(Orin+NUC), B(Dynamixel) 연결 포인트 배선 — 극성/전류 용량 확인",
      "BMS x3 연결 + 각 배터리 셀 전압 밸런싱 확인",
      "DC-DC 벅 컨버터 셋업 — 5V(ESP32, LED), 12V(Dynamixel), 19V(NUC) 출력 조정",
      "비상정지 회로 배선 — B+C 양극 직렬 NC 차단 스위치 + ESP32 MOSFET C 라인 (기획서 7.5절)",
      "전원 시퀀싱 절차 문서화 — A ON → Orin/NUC 부팅 → B ON → Dynamixel → C ON → BHL",
      "전원 투입/차단 테스트 — 멀티미터로 각 단계 전압 확인",
    ],
    resources: [
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
    ],
    components: ["pdb", "bms", "dc_dc_converter", "battery_a", "battery_b"],
    estimatedHours: 5,
  },

  w1_sim2sim_setup: {
    summary: "δ2 전용 과제. Week 0에서 문서 수준으로 파악한 Sim2sim 절차를 실제로 셋업한다. IsaacLab에서 학습한 policy를 MuJoCo에서 실행하여 전이 품질을 검증하는 환경이다(기획서 8절). 동시에 Orin↔NUC 간 Ethernet 직결 ROS2 통신(/gait/cmd, /gait/status)을 확인한다.",
    steps: [
      "MuJoCo 설치 + BHL MuJoCo 모델(MJCF) 로드 확인",
      "IsaacLab → MuJoCo 변환 파이프라인 실행 테스트",
      "Orin↔NUC Ethernet 직결 설정 — 고정 IP 할당, ping 확인",
      "ROS2 토픽 통신 테스트 — /gait/cmd(Orin→NUC), /gait/status(NUC→Orin) 퍼블리시/구독",
      "통신 지연 측정 — ROS2 토픽 라운드트립 latency 확인",
    ],
    resources: [
      { label: "MuJoCo 공식 문서", url: "https://mujoco.readthedocs.io/" },
    ],
    components: ["nuc", "orin_nano_super"],
    estimatedHours: 4,
  },

  w1_isaaclab_custom_upper: {
    summary: "δ3 전용 과제 (Week 1 최우선). BHL 원본은 상체가 없으므로, 하이리온의 커스텀 상부(토르소+머리+SO-ARM)를 IsaacLab 환경에 추가해야 Walking RL이 실제 로봇 조건에서 학습할 수 있다. 기획서 2.3절에 따르면 커스텀 상부는 mass/CoM/inertia만 정확히 반영하면 되며, DR(Domain Randomization) ±20%로 불확실성에 대응한다.",
    steps: [
      "δ1의 토르소 CAD를 USD로 변환하여 IsaacLab에 추가 (또는 간략 박스 메쉬로 대체)",
      "머리 mass(≤700g) + inertia 설정 — Week 0 사양서 기반",
      "SO-ARM 간략 모델 추가 — 6DOF x2를 mass+joint로 간소화",
      "Domain Randomization 설정 — mass ±20%, friction ±20%, CoM offset ±2cm",
      "상부 추가 전후 직립 안정성 비교 테스트",
      "환경 완성 후 δ2와 ε2에 인계 준비",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "IsaacLab 공식 문서", url: "https://isaac-sim.github.io/IsaacLab/" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w1_isaaclab_env_complete: {
    summary: "δ3 전용 과제 (Week 1 최우선). 커스텀 상부가 추가된 IsaacLab 환경을 최종 완성하고, δ2(보행 시스템 오너)와 ε2(검증 오너)에 각각 인계한다. δ2는 이 환경에서 Walking RL을 학습하고, ε2는 IsaacLab 검증 루프를 시작한다. 이 인계가 지연되면 Track B 전체 일정에 영향을 준다.",
    steps: [
      "커스텀 상부 최종 확인 — mass, inertia, DR 설정 검증",
      "환경 로드 + 기본 직립 테스트 통과 확인",
      "δ2 인계 — 환경 실행 방법, 학습 스크립트, 파라미터 설명",
      "ε2 인계 — 검증 루프 실행 방법, 평가 지표, 로깅 설정",
      "환경 설정 파일 + README 문서화 (재현 가능하도록)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w1_parametric_standing: {
    summary: "δ3 전용 과제. 기획서 7.4절에 따라 상부 mass(3/4/5/6kg) x CoM 높이(40/50/60cm) x 배터리 배치(토르소/hip) 조합으로 IsaacLab에서 파라메트릭 직립 테스트를 실행한다. Week 2 초에 결과가 나와야 δ2의 상체 무게 적산값과 대조하여 상체 무게 예산이 확정되고, 배터리 배치 방향이 최종 결정된다.",
    steps: [
      "테스트 조합 매트릭스 생성 — mass 4단계 x CoM 3단계 x 배터리 2단계 = 24개 조합",
      "자동화 스크립트 실행 — 조합별 시뮬 실행 + 직립 안정성 지표 로깅",
      "결과 분석 — 안정 영역(mass/CoM 한계), 배터리 배치 영향도 시각화",
      "δ2의 상체 무게 적산값(Week 0)과 대조 — 현 설계가 안정 영역 내인지 확인",
      "결과 리포트 작성 → Week 2 초 전체 공유 (상체 무게 예산 + 배터리 배치 최종 결정 자료)",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산 — 직립 테스트)", type: "internal", section: "7.4" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w1_smolvla_stage1_start: {
    summary: "δ3 전용 과제. 기획서 4.3절의 2-Stage 파인튜닝 전략에 따라, Stage 1에서는 LeRobot Hub의 SO-100 공개 pick-place 데이터(수천 에피소드)로 SmolVLA를 사전 파인튜닝한다. 카메라 위치와 물체가 달라도 접근-그립-리프트 패턴을 사전 학습하면 Stage 2(자체 데이터) 효율이 올라간다. DGX Spark 백그라운드 작업.",
    steps: [
      "LeRobot Hub에서 SO-100 호환 공개 pick-place 데이터셋 다운로드",
      "SmolVLA 베이스 모델 로드 + 데이터 전처리 파이프라인 구축",
      "Stage 1 학습 하이퍼파라미터 설정 — lr, batch size, epoch 수",
      "DGX Spark에서 백그라운드 학습 시작 (Walking RL과 GPU 시간 분배)",
      "학습 모니터링 — loss 곡선, 중간 체크포인트 저장",
      "Stage 1 완료 후 ε1에 모델 전달 (Week 3 TensorRT 변환용)",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
      { label: "SmolVLA (HuggingFace)", url: "https://huggingface.co/HuggingFaceTB/SmolVLA-base" },
      { label: "LeRobot Hub", url: "https://huggingface.co/lerobot" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w1_smolvla_tensorrt_script: {
    summary: "ε1 전용 과제 (Track B 지원). SmolVLA PyTorch 모델을 Orin에서 실시간 추론하려면 TensorRT 변환이 필수다. Week 3에 δ3가 Stage 1 학습을 완료하면 이 스크립트로 즉시 변환→Orin 배포→정합성 검증을 진행해야 하므로, 변환 스크립트를 선행 작성한다(기획서 5.3절 컴퓨팅 분배).",
    steps: [
      "SmolVLA 모델 아키텍처 분석 — 입력/출력 텐서 형태, 동적 축 확인",
      "PyTorch → ONNX export 스크립트 작성 (dynamic axes 설정)",
      "ONNX → TensorRT 엔진 빌드 스크립트 작성 (FP16, Orin 타겟)",
      "더미 입력으로 PyTorch vs TensorRT 추론 결과 정합성 테스트 코드 작성",
      "Orin에서 TensorRT 추론 벤치마크 — Hz 측정 (목표: 5Hz 이상, 기획서 GPU 프로파일링 대비)",
    ],
    resources: [
      { label: "TensorRT 문서", url: "https://developer.nvidia.com/tensorrt" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w1_urdf_export_script: {
    summary: "ε2 전용 과제. BHL URDF가 수정될 때마다 수동으로 변환하면 오류가 발생하기 쉬우므로, URDF export → USD 변환까지 자동화 파이프라인을 구축한다. Week 0에서 파악한 URDF 구조 지식을 활용하며, 이 파이프라인은 δ3의 IsaacLab 환경 업데이트와 ε2 자신의 검증 루프에서 반복 사용된다.",
    steps: [
      "BHL URDF export 스크립트 환경 구축 — Python 의존성, 경로 설정",
      "URDF → USD 변환 스크립트 연동 (IsaacLab 유틸리티 활용)",
      "변환 후 자동 검증 — 링크 수, 조인트 수, mass 합계 일치 확인",
      "파이프라인 테스트 — URDF 수정 → 스크립트 실행 → USD 생성 → IsaacLab 로드 확인",
    ],
    resources: [
      { label: "BHL GitHub", url: "https://github.com/Berkeley-Humanoid/Berkeley-Humanoid-Lite" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w1_esp32_fall_isr: {
    summary: "ε2 전용 과제. 기획서 7.8절 보행 안전 설계의 핵심 구현. ESP32가 MPU6050에서 기울기/가속도를 읽어 낙상을 감지하면, HW 인터럽트(ISR)로 MOSFET을 즉시 차단하여 BHL 다리 전원(배터리 C)을 끊는다. BHL의 백드라이버블 특성 덕분에 전원 차단 시 관절이 풀리며 안전하게 주저앉는다(기획서 7.1절).",
    steps: [
      "ESP32 + MPU6050 I2C 연결 — Week 0 조사 결과 기반 배선",
      "MPU6050 캘리브레이션 — 수평 상태에서 offset 보정",
      "낙상 감지 임계값 설정 — 기울기 각도(예: 45도 이상), 가속도 스파이크 기준",
      "HW 인터럽트(ISR) 구현 — MPU6050 INT 핀 → ESP32 GPIO → MOSFET 게이트 차단",
      "MOSFET 전원 차단 테스트 — 보드 기울여서 차단 동작 확인, 차단 지연 시간 측정",
      "IsaacLab 검증 루프 시작 — ε2로서 δ3가 인계한 환경의 기본 검증 수행",
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
    summary: "토르소 프레임이 완성되어야 Orin, NUC, 배터리를 장착할 수 있다. 기획서 7.2절의 아래→위 11단계 순서를 따르며, δ1이 물리 장착을 전담하고 각 오너가 자기 부품의 배선·소프트웨어를 담당한다.",
    steps: [
      "① 2020 알루미늄 프로파일 프레임 조립 (δ1)",
      "② 배터리 A+B 슬롯 장착 (δ1) → δ2가 배선",
      "③ PDB + DC-DC 벅 컨버터(5V/12V/19V) 장착 (δ1) → δ2 전원 배선",
      "④ NUC(BeeLink N95) 마운트 (δ1) → δ2가 전원·Ethernet·USB 연결",
      "⑤ Orin + carrier + 방열판 장착 (δ1) → ε1이 전원·USB 연결",
      "⑥ 40mm 환기팬 + 배기구(상단)/흡기구(하단) 설치 (δ1)",
      "⑦ SO-ARM ×2 어깨 마운트 (δ1) → ε1이 U2D2 USB 연결",
      "⑧ 목 서보 XL430 ×2 장착 (δ1) → ε1이 U2D2 데이지체인 연결",
      "⑨ 스피커 + 마이크 장착 (δ1) → ε1이 Orin USB 오디오 연결",
      "⑩ Orin↔NUC Ethernet 직결 (δ2)",
      "⑪ 케이블 정리 + 간섭 확인 (δ1) — SO-ARM 마운트 후 휘어짐 점검 포함",
    ],
    resources: [
      { label: "기획서 7.2절 (토르소 조립 순서)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020", "orin_nano_super", "nuc", "xl430", "battery_a", "battery_b", "pdb", "dc_dc_converter", "speaker", "microphone"],
    estimatedHours: 10,
  },

  w2_episode_collect_30: {
    summary: "Week 3에 570개를 몰아치기 전, δ1이 단독으로 30개를 먼저 수집하여 파이프라인 검증과 수집 프로토콜을 확립한다. 에피소드당 약 5분이 소요되며, 변형 축(위치 ±3cm, 회전 0°/90°/180°, 접근 방향)별 메타데이터를 기록해야 한다.",
    steps: [
      "수집 환경 셋업 — 테이블 마커, 조명, 카메라 위치를 Week 1 실측 결과와 동일하게 고정",
      "스타벅스 컵 10개 수집 (변형 축: 마커 내 위치 ±3cm, 물체 회전 0°/90°/180°, 접근 방향 정면/측면)",
      "텀블러 10개 수집 (동일 변형 축 적용)",
      "인형 10개 수집 (동일 변형 축 적용)",
      "에피소드별 메타데이터(위치, 회전, 접근 방향) 기록 — 시연 조건(동일 테이블·조명·카메라) 비율 60%+ 유지",
      "수집 프로토콜 문서화 (Week 3 ε2 인수인계 대비) — 촬영 각도, 그립 패턴, 실패 판정 기준 포함",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
      { label: "기획서 4.2절 (수집 전략)", type: "internal", section: "4.2" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 8,
  },

  w2_head_mockup: {
    summary: "Week 7 전자부품 통합 전에 무게·공간 배치를 사전 검증하기 위한 간이 목업이다. 스티로폼 블록에 카메라·LED·입 서보를 임시 배치하고, 합산 700g 이하인지 확인하여 직립 테스트 mass 데이터에 반영한다.",
    steps: [
      "스티로폼 블록을 머리 크기(~25cm)로 절삭",
      "카메라(USB) 1개, LED 눈(NeoPixel) 2개, 입 서보(MG90S) 1개를 내부에 임시 배치",
      "배선 경로(목 내부 → 토르소) 간섭 확인",
      "전체 계량하여 700g(외주 셸 ≤300g + 전자부품 ≤400g) 이하 확인",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작 타임라인)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo"],
    estimatedHours: 4,
  },

  w2_state_machine_v1_start: {
    summary: "Week 3 완성 목표인 상태 머신 v1의 골격을 이번 주에 잡아야 한다. IDLE·TALKING·MANIPULATING 기본 상태 전환 구조를 구현하면서, 병행하여 δ3이 DGX에서 진행 중인 SmolVLA Stage 1 학습을 모니터링한다.",
    steps: [
      "Week 0에서 선정한 상태 머신 프레임워크(smach/FlexBE)로 IDLE↔TALKING↔MANIPULATING 골격 구현",
      "기획서 5.1절 전환 규칙 반영 — MANIPULATING 중 대화 요청은 완료 후 TALKING 전환",
      "SmolVLA Stage 1 DGX 학습 로그 모니터링 (loss 추이, 수렴 여부)",
      "에코 캔슬링 후속 완료 — AEC 필요 여부 최종 결론",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 8,
  },

  w2_esp32_bench_test: {
    summary: "Week 1에서 구현한 ESP32 낙상 ISR + MOSFET 회로를 벤치에서 실제 기울여 차단 동작을 검증한다. 이 테스트가 통과해야 Phase 1 게이트의 \"ESP32 MOSFET 동작\" 조건을 충족할 수 있다.",
    steps: [
      "MPU6050 기울임 임계값(예: 45°) 설정 후 ISR 트리거 확인",
      "MOSFET이 배터리 C 라인을 실제 차단하는지 전류 측정",
      "차단 후 BHL 관절이 백드라이버블하게 풀리는지 확인",
      "복구 절차 테스트 — 안전 자세 후 C 재투입 → IDLE 복귀",
    ],
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "mosfet"],
    estimatedHours: 3,
  },

  w2_emotion_v1: {
    summary: "하이리온의 캐릭터 표현 기초가 되는 감정 상태 머신 v1을 구현한다. Week 5에서 5종으로 확장할 예정이므로, 이번 주에는 중립·기쁨·놀람 3종의 LED 패턴과 입 서보 동작을 먼저 구현하고 평가 스크립트를 완성한다.",
    steps: [
      "중립·기쁨·놀람 3종의 NeoPixel LED 패턴(색상·밝기·애니메이션) 정의",
      "각 감정에 대응하는 입 서보(MG90S) 동작 매핑",
      "상태 전환 트리거 인터페이스 설계 (상태 머신에서 감정 전환 호출)",
      "평가 스크립트 완성 — 각 감정 전환 정상 동작·응답 시간 자동 측정",
    ],
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["neopixel_led", "mg90s_servo"],
    estimatedHours: 5,
  },

  w2_walking_rl_start: {
    summary: "Week 1에서 δ3가 완성한 IsaacLab 환경 위에서 Walking RL 1차 학습을 DGX에서 시작한다. SmolVLA Stage 1 학습과 DGX 시간을 분배해야 하므로, δ3와 GPU 스케줄을 사전에 조율해야 한다.",
    steps: [
      "δ3의 IsaacLab 환경 인계 확인 — 커스텀 상부(토르소 mesh + 머리 mass + SO-ARM 간략 모델) 포함",
      "Walking RL 보상 함수 초기 설정 (직립 유지, 전진 속도, 에너지 효율)",
      "DGX에서 학습 시작 — SmolVLA Stage 1과 GPU 시간 분배 조율",
      "학습 로그 모니터링 (보상 커브, episode length 추이)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real 파이프라인)", type: "internal", section: "8" },
      { label: "IsaacLab RL 문서", url: "https://isaac-sim.github.io/IsaacLab/" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 16,
  },

  w2_emergency_stop: {
    summary: "배터리 B(Dynamixel)+C(BHL BLDC) 양극에 직렬 NC(Normally Closed) 스위치를 달고, ESP32 MOSFET으로 C 라인을 추가 차단하는 이중 비상정지 회로를 완성한다. 기획서 7.5절에 따라 배터리 A(Orin/NUC)는 로그 유지를 위해 차단하지 않는다.",
    steps: [
      "B+C 양극에 직렬 NC 비상정지 스위치 배선",
      "ESP32 MOSFET으로 C 라인 추가 차단 회로 연결",
      "물리 비상정지 버튼 + ISR 소프트 차단 이중 동작 확인",
      "A 라인(Orin/NUC)은 차단되지 않고 로그가 유지되는지 확인",
    ],
    resources: [
      { label: "기획서 7.5절 (배터리 — 비상정지)", type: "internal", section: "7.5" },
    ],
    components: ["esp32", "mosfet", "emergency_stop_switch"],
    estimatedHours: 4,
  },

  w2_gearbox_postprocess: {
    summary: "Week 4 액추에이터 10개 조립의 선행 공정이다. 3D프린트된 사이클로이드 기어박스 10세트의 서포트를 제거하고, 리밍과 베어링 시트를 가공하여 정밀 결합이 가능한 상태로 만든다. 동시에 Week 5 공중 보행 테스트용 지그를 설계한다.",
    steps: [
      "기어박스 10세트 서포트 제거 (얇은 벽면 파손 주의)",
      "베어링 시트 리밍 — 내경을 베어링 외경에 맞춰 정밀 가공",
      "모터 마운트 구멍 치수 검수 (M6C12 6개, 5010 4개 각각 확인)",
      "히트인서트 삽입 (나사 체결부)",
      "공중 지그 설계 — 다리를 매달고 보행 테스트할 구조물 CAD",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010"],
    estimatedHours: 8,
  },

  w2_standing_checkpoint: {
    summary: "Week 1 파라메트릭 직립 테스트(상부 3~6kg × CoM 40~60cm) 결과를 δ2의 무게 적산과 대조하여, 상체 무게 예산을 최종 확정하는 체크포인트이다. 이 결과가 Walking RL 학습의 기준 mass가 된다.",
    steps: [
      "δ3: IsaacLab에서 상부 mass 조합별 직립 결과 정리 (통과/실패 경계값 확인)",
      "δ2: 스펙시트 기반 무게 적산값과 직립 테스트 결과 대조",
      "상체 무게 예산 확정 — 초과 시 경량화 대상 식별",
      "배터리 배치 최종 결정 (토르소 최하단 vs hip — CoM 높이 영향)",
      "확정된 mass를 Walking RL 학습 파라미터에 반영",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
      { label: "기획서 10절 (게이트 조건 — 직립 체크포인트)", type: "internal", section: "10" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w2_imu_structure: {
    summary: "ESP32용 IMU(MPU6050, 낙상 감지 전용)와 NUC용 IMU(Walking RL policy 입력)는 역할과 샘플레이트가 다르므로 별도 구조로 분리해야 한다. ESP32 IMU는 HW 인터럽트로 즉시 MOSFET 차단을 트리거하고, NUC IMU는 CAN 버스를 통해 250Hz policy 루프에 공급된다.",
    steps: [
      "ESP32용 MPU6050 배치 위치 확정 (토르소 중심부, 진동 최소 지점)",
      "NUC용 IMU 배치 위치 확정 (hip 근처, policy 입력에 적합한 위치)",
      "두 IMU 간 I2C 주소 충돌 방지 확인 (별도 버스 또는 주소 변경)",
      "각 IMU의 샘플레이트·필터 설정 문서화",
    ],
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "nuc"],
    estimatedHours: 3,
  },

  w2_mini_finetune: {
    summary: "Week 2 말에 수집한 30개 에피소드로 미니 파인튜닝을 돌려, Week 3 대량 수집 전에 치명적 결함(카메라 각도 오류, 그립 실패 패턴 등)을 조기 발견한다. 이 결과로 변형 축 비율, 시연 조건 비율 등 수집 전략을 최종 확정한다.",
    steps: [
      "δ3: 30개 데이터로 DGX Stage 2 테스트 파인튜닝 실행",
      "δ1: 결과 모델을 Orin에서 실행하여 실물 pick-place 시도",
      "치명적 결함 확인 — 그립 실패율, 접근 궤적 이상, 카메라 프레이밍 오류 등",
      "변형 축 비율(위치 ±3cm / 회전 / 접근 방향) 조정 여부 판단",
      "δ3+δ1: 수집 전략 확정 (시연 조건 60%+ 유지 기준으로 변형 배분)",
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
    summary: "프로젝트에서 가장 노동집약적인 주간이다. δ1+ε2가 2인 체제로 하루 ~120개(에피소드당 5분 × 120개 = 10시간/일)씩 5일간 570개를 수집하여 누적 600개를 달성한다. 시연 조건(동일 테이블·조명·카메라) 에피소드 비율 60%+ 유지가 핵심이다.",
    steps: [
      "δ1: Week 2 프로토콜 기반으로 수집 리드 — 물체 3종(컵 200/텀블러 200/인형 200) 균등 배분",
      "ε2: 수집 인수인계 세션 — δ1 수집 영상 시청 + 동일 그립 패턴 훈련 후 투입",
      "변형 축 적용: 마커 내 위치(±3cm), 물체 회전(0°/90°/180°), 접근 방향(정면/측면)",
      "에피소드별 메타데이터 기록 + 시연 조건 비율 60%+ 실시간 모니터링",
      "중간 지점(~300개)에서 SmolVLA 중간 모델 실행 → 실패 패턴 분석 → δ3 피드백",
      "누적 600개 도달 확인 후 수집 종료 — Week 4부터 δ1·ε2는 머리/외장으로 전환",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
      { label: "기획서 4.2절 (수집 전략)", type: "internal", section: "4.2" },
    ],
    components: ["xl430", "u2d2", "camera_usb"],
    estimatedHours: 40,
  },

  w3_smolvla_stage2: {
    summary: "Stage 1(공개 데이터 사전 파인튜닝)이 완료된 모델 위에 자체 600개 에피소드로 Stage 2 파인튜닝을 실행한다. 공개 데이터로 접근-그립-리프트 패턴을 사전 학습했으므로, Stage 2에서는 시연 조건(카메라 위치, 물체 3종, 테이블 높이)에 특화된다.",
    steps: [
      "Stage 1 모델 체크포인트 확인 (수렴 여부, loss 안정성)",
      "자체 600개 에피소드 데이터셋 준비 — LeRobot 포맷 정합성 검증",
      "학습 하이퍼파라미터 결정 (lr, batch size, 공개:자체 데이터 비율)",
      "DGX에서 Stage 2 학습 실행 + 로그 모니터링",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w3_walking_rl_review: {
    summary: "Week 2에서 시작한 Walking RL 1차 학습 결과를 검토하고, 보상 함수를 조정한다. 직립 유지·전진 속도·에너지 효율 간의 트레이드오프를 분석하여 Week 4 2차 학습에 반영할 개선 방향을 도출한다.",
    steps: [
      "학습 커브(보상, episode length) 분석 — 수렴 여부 판단",
      "보행 궤적 시각화 — 발 접지 패턴, 몸체 흔들림 확인",
      "보상 함수 항목별 기여도 분석 (직립, 전진, 에너지, 관절 한계)",
      "개선 방향 도출 → Week 4 2차 학습(지형 커리큘럼 + 마찰 DR)에 반영",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real 파이프라인)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w3_tensorrt_deploy: {
    summary: "δ3가 DGX에서 학습한 Stage 1 모델을 TensorRT로 변환하여 Orin에 배포한다. GPU 프로파일링(다음 태스크)의 전제 조건이며, PyTorch 원본 대비 TensorRT 추론 결과의 정합성을 반드시 검증해야 한다.",
    steps: [
      "Stage 1 모델(PyTorch) → ONNX 변환 (opset 버전 호환 확인)",
      "ONNX → TensorRT 엔진 빌드 (FP16, Orin GPU 아키텍처 타겟)",
      "Orin에 TensorRT 엔진 배포 + 카메라 입력 연결",
      "PyTorch vs TensorRT 추론 결과 정합성 검증 — 동일 입력에 대해 출력 차이 ≤ 허용 범위",
      "ε1이 Week 1에서 작성한 TensorRT 변환 스크립트 활용",
    ],
    resources: [
      { label: "TensorRT 문서", url: "https://developer.nvidia.com/tensorrt" },
    ],
    components: ["orin_nano_super", "dgx_spark"],
    estimatedHours: 6,
  },

  w3_gpu_profiling: {
    summary: "Orin에서 SmolVLA TensorRT 모델의 실제 추론 주파수를 측정한다. 5Hz 이상이면 정상 진행, 2~5Hz이면 UX 보완(동작 사이 자연스러운 대기 모션 삽입), 2Hz 미만이면 δ3에게 모델 다운사이즈를 요청해야 한다.",
    steps: [
      "TensorRT 엔진 로드 + 카메라 스트림 연결 상태에서 추론 루프 실행",
      "100회 추론의 평균 Hz 및 p95 레이턴시 측정",
      "MediaPipe(CPU, 2~3fps)와 동시 실행 시 GPU 간섭 여부 확인",
      "결과에 따라 분기: 5Hz+→진행 / 2~5Hz→UX 보완 설계 / 2Hz-→δ3에 다운사이즈 요청",
    ],
    resources: [
      { label: "기획서 11절 (리스크 — SmolVLA Hz)", type: "internal", section: "11" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 3,
  },

  w3_state_machine_v1_complete: {
    summary: "Week 2에서 시작한 상태 머신 v1을 완성하여 IDLE↔TALKING↔MANIPULATING 기본 전환이 정상 동작해야 한다. 기획서 5.1절 전환 규칙과 5.2절 리소스 매핑을 충실히 반영하며, FETCH·LOW_BATTERY·EMERGENCY는 Week 5~6에서 추가한다.",
    steps: [
      "IDLE → TALKING 전환: 마이크 입력 감지 시 대화 파이프라인 활성화",
      "TALKING → MANIPULATING 전환: LLM이 pick 액션 추출 시 SmolVLA 실행",
      "MANIPULATING → TALKING: SmolVLA 동작 완료 후 대화 복귀",
      "MANIPULATING 중 대화 요청 → 큐잉 후 완료 시 처리 (기획서 5.1절)",
      "상태별 리소스 매핑 검증 — GPU(SmolVLA), CPU(MediaPipe), 네트워크(Groq) 동시 사용 시 충돌 없음 확인",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w3_sim2sim_verify: {
    summary: "IsaacLab에서 학습한 Walking RL policy를 MuJoCo로 전이(Sim2sim)하여 시뮬레이터 간 동작 차이를 검증한다. 이 검증이 통과해야 Week 5 공중 보행(Sim2real) 시 예상치 못한 동작 차이를 줄일 수 있다. 동시에 공중 지그를 3D프린트한다.",
    steps: [
      "IsaacLab 학습 policy를 MuJoCo 환경에서 로드",
      "동일 초기 상태에서 두 시뮬의 관절 궤적 비교 (각도·토크 차이 분석)",
      "차이가 허용 범위 초과 시 원인 분석 (물리 파라미터, 접촉 모델 차이 등)",
      "공중 지그 STL 3D프린트 시작 (Week 5 테스트용)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["nuc"],
    estimatedHours: 8,
  },

  w3_soc_safety: {
    summary: "배터리 SOC가 20% 이하로 떨어지면 LOW_BATTERY 상태로 전환하여 안전 자세를 취하고, 대화만 가능하게 제한하는 로직을 구현한다. 기획서 5.1절의 LOW_BATTERY 상태 정의에 따르며, BMS 전압 읽기를 ESP32가 담당한다.",
    steps: [
      "ESP32에서 BMS를 통해 배터리 C(BHL) SOC 읽기 구현",
      "SOC 20% 이하 시 NUC에 LOW_BATTERY 신호 전송",
      "NUC → Orin ROS2 토픽(/gait/status)으로 상태 전달",
      "상태 머신에서 LOW_BATTERY 전환 → 안전 자세 + 대화만 허용",
    ],
    resources: [
      { label: "기획서 5.1절 (LOW_BATTERY 상태)", type: "internal", section: "5.1" },
    ],
    components: ["esp32", "bms"],
    estimatedHours: 3,
  },

  w3_phase1_gate: {
    summary: "Phase 1은 Week 3 말에 통과해야 하는 첫 번째 공식 게이트이다. 여기서 실패하면 Week 4 이후 작업(머리/외장 전환, 다리 조립)에 진입할 수 없으므로, 모든 항목을 체크리스트로 확인한다.",
    steps: [
      "직립 확인 + Walking RL 학습 중 (Week 2 체크포인트 통과)",
      "토르소 + SO-ARM 완성 (11단계 조립 완료)",
      "카메라·물체·그립 확정 (Week 1 실측 기반)",
      "수집 600개 완료 (시연 조건 60%+ 확인)",
      "SmolVLA v1 동작 + TensorRT 정합성 확인",
      "ESP32 MOSFET 차단 동작 확인",
      "Sim2sim(IsaacLab → MuJoCo) 완료 + NUC 준비",
    ],
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
    summary: "δ1이 수집에서 머리/외장 제작으로 전환하는 첫 작업이다. 외주 CNC 도착 시 사포(#200→#400)+서피서 2회로 표면을 마감하고, 미도착 시 경로 B(스티로폼 수작업: 열선 커터→칼→사포→목공 퍼티)로 즉시 전환한다.",
    steps: [
      "외주 CNC 도착 여부 확인 (납기 목표 Week 5~6이므로 조기 도착 가능)",
      "[경로 A] 도착 시: 사포 #200 → #400 순차 연마 + 서피서 1회 도포",
      "[경로 B] 미도착 시: 스티로폼 블록 열선 커터 대형 절삭 → 칼/사포 디테일 → 목공 퍼티 메움",
      "서피서 2회째 도포 + 24시간 건조 (Week 5 도장 준비)",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작 — 두 가지 경로)", type: "internal", section: "7.3" },
    ],
    components: [],
    estimatedHours: 8,
  },

  w4_body_cover_pattern: {
    summary: "프로파일 프레임 위에 씌울 바디 천 커버의 패턴을 제작한다. 기획서 7.6절에 따라 하이리온 캐릭터 컬러의 천/펠트를 사용하고, 유지보수 시 탈착이 가능하도록 벨크로로 고정하며, 환기구 부분은 메쉬 소재를 적용한다.",
    steps: [
      "토르소 프레임 외형 치수 실측 (높이 ~25cm, 단면 크기)",
      "하이리온 캐릭터 컬러 천/펠트 재단",
      "환기구(배기구 상단, 흡기구 하단) 위치에 메쉬 소재 삽입",
      "벨크로 부착 (유지보수 시 탈착 가능)",
      "봉제 + 토르소 가피팅으로 간섭 확인",
    ],
    resources: [
      { label: "기획서 7.6절 (외장 — 바디 외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 8,
  },

  w4_smolvla_v1_eval: {
    summary: "Stage 2 학습이 완료된 SmolVLA v1 모델의 성능을 물체별·실패 유형별로 정량 평가한다. 이 리포트가 ε1의 ablation 실험 설계와 δ3의 v2 학습 방향 결정의 근거가 된다.",
    steps: [
      "물체 3종(컵/텀블러/인형) 각각 20회 pick-place 시도",
      "물체별 성공률 산출 (접근 성공, 그립 성공, 리프트 성공, 전달 성공)",
      "실패 유형 분류 — 접근 궤적 오류, 그립 미스, 낙하 등",
      "시연 조건 vs 변형 조건 별 성공률 차이 분석",
      "리포트 작성 → ε1(ablation 설계)과 δ3(v2 학습 방향)에 전달",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w4_lip_sync: {
    summary: "TTS 오디오의 타이밍에 맞춰 입 서보(MG90S)를 구동하여 하이리온이 말할 때 입이 움직이는 lip sync를 구현한다. ε1이 TTS 재생 시 오디오 타이밍(음성 구간/무음 구간)을 제공하면, ε2가 이를 입 서보 각도로 변환한다.",
    steps: [
      "오픈소스 lip sync 라이브러리 조사 및 선정",
      "ε1의 TTS 오디오 스트림에서 음량/에너지 정보 추출",
      "음량 → MG90S 서보 각도 매핑 함수 구현 (열림/닫힘 범위 설정)",
      "Orin에서 TTS 재생과 서보 구동의 동기화 테스트",
      "Week 5에서 최종 완성 (오버슈트, 지연 미세 조정)",
    ],
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["mg90s_servo", "orin_nano_super"],
    estimatedHours: 6,
  },

  w4_neck_pid_start: {
    summary: "MediaPipe 얼굴 감지로 관객의 얼굴 위치를 추적하고, XL430 목 서보 2개(pan/tilt)를 PID 제어하여 하이리온이 관객을 바라보는 시선 추적을 시작한다. Week 5에서 오버슈트 <5°로 튜닝을 완성한다.",
    steps: [
      "MediaPipe 얼굴 감지를 CPU 모드로 Orin에서 실행 (기획서 5.2절: GPU는 SmolVLA 전용)",
      "얼굴 중심 좌표 → 목 pan/tilt 목표 각도 변환 로직 구현",
      "XL430 ×2에 PID 제어 적용 (Kp, Ki, Kd 초기값 설정)",
      "기본 추적 동작 확인 — 얼굴 이동 시 목이 따라가는지 테스트",
    ],
    resources: [
      { label: "MediaPipe 얼굴 감지", url: "https://developers.google.com/mediapipe/solutions/vision/face_detector" },
    ],
    components: ["xl430", "camera_usb", "orin_nano_super"],
    estimatedHours: 6,
  },

  w4_smolvla_ablation: {
    summary: "ε1이 설계한 ablation 조합(데이터 비율, 학습률, 물체별 가중치 등)을 δ3가 DGX에서 일괄 학습 실행한다. 각 조합의 결과를 비교하여 Week 5에서 최적 데이터 조합을 확정하는 근거를 마련한다.",
    steps: [
      "ε1이 설계한 ablation 조합 목록 확인 (예: 공개/자체 비율, lr 변형, 물체별 가중치)",
      "각 조합별 DGX 학습 실행 (GPU 스케줄 관리)",
      "학습 로그(loss, 검증 성공률) 기록 + 조합 간 비교표 작성",
      "결과를 ε1에 전달하여 해석 및 최적 조합 도출에 활용",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w4_walking_rl_2nd: {
    summary: "1차 학습 결과에서 도출된 개선 방향을 반영하여 Walking RL 2차 학습을 실행한다. 지형 커리큘럼(평지→경사→요철)과 마찰 Domain Randomization을 추가하여 sim-to-real 전이 시 실제 바닥 조건에 대한 로버스트니스를 높인다.",
    steps: [
      "지형 커리큘럼 설정 — 평지에서 시작하여 점진적으로 경사·요철 추가",
      "마찰 DR 범위 설정 (발표장 바닥 재질 예상치 ± 변동 폭)",
      "Week 3 보상 함수 조정 결과 반영",
      "DGX에서 2차 학습 실행 + 모니터링",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w4_ablation_interpret: {
    summary: "δ3가 실행한 ablation 결과(조합별 loss, 검증 성공률)를 해석하여 최적 데이터 조합 방향을 도출한다. ε2의 SmolVLA v1 평가 리포트(물체별 실패 유형)와 교차 분석하여 Week 5 최종 확정에 사용한다.",
    steps: [
      "조합별 검증 성공률 비교 — 공개/자체 데이터 비율 영향 분석",
      "물체별 성능 차이 확인 (ε2 평가 리포트와 교차 분석)",
      "과적합/과소적합 경계 식별 (학습 epoch vs 검증 성능)",
      "최적 조합 후보 2~3개 선정 → Week 5에서 δ3가 최종 학습",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w4_groq_stt_llm: {
    summary: "Groq 클라우드 STT + LLM을 스트리밍으로 연동하고, LLM 프롬프트에 fetch 태스크 타입을 추가하여 \"컵 가져와\"류 명령을 인식한다. 동시에 FETCH 시퀀서(기획서 5.1절 서브스텝 ①~⑤)의 골격을 구현한다.",
    steps: [
      "Groq STT 스트리밍 연동 — 마이크 입력 → Groq Whisper → 텍스트",
      "LLM 프롬프트에 fetch 태스크 타입 추가 — \"컵 가져와\" → {action: \"fetch\", target: \"starbucks_cup\"}",
      "FETCH 시퀀서 구현: ①WALKING(테이블 방향, T1초) → ②MANIPULATING(SmolVLA pick) → ③WALKING(홈 방향, 180°+T2초) → ④MANIPULATING(handover) → ⑤IDLE",
      "기획서 4.4절 언어→동작 연결 로직: LLM이 물체 종류 추출 → SmolVLA에 target_object 전달",
      "Week 5에서 상태 머신과 완전 통합 + 카메라 공유 토픽 설정",
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
    summary: "BHL 하반신의 핵심 공정으로, 5DOF × 2다리 = 10개 액추에이터를 모두 조립한다. Week 2에서 후가공 완료된 사이클로이드 기어박스에 BLDC 모터(MAD M6C12 ×6 + 5010 ×4)를 결합하고, ESC를 솔더링한다.",
    steps: [
      "기어박스 10개 최종 점검 — 리밍·베어링 시트·히트인서트 상태 확인",
      "BLDC 모터 결합: hip/knee용 M6C12(150KV) ×6 + ankle용 5010(110KV) ×4",
      "ESC(B-G431B-ESC1) 10개 솔더링 + 모터 3상 연결",
      "개별 동작 테스트 — CAN 명령으로 각 액추에이터 회전 확인",
      "조립 기준서(δ1 Week 1 작성) 참조하여 토크·그리스 적용",
      "불량 액추에이터 식별 시 예비 기어박스로 교체",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신 — 액추에이터)", type: "internal", section: "7.1" },
    ],
    components: ["mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 16,
  },

  w4_leg_assembly_start: {
    summary: "10개 액추에이터를 3D프린트된 다리 프레임에 장착하여 다리 조립을 시작한다. 배터리 C(BHL BLDC 전용)를 다리 프레임에 연결하여 독립 전원 공급을 확인한다. Week 5에서 다리 완성 + NUC 연결로 이어진다.",
    steps: [
      "3D프린트 다리 구조물에 액추에이터 10개 순서대로 장착 (hip→knee→ankle)",
      "각 관절 가동 범위가 URDF 정의와 일치하는지 확인",
      "배터리 C + BMS 연결 → ESC 전원 공급 확인",
      "CAN 버스 배선(CAN-USB ×2, 4버스 1Mbps) 연결",
      "다리 단독 전원 인가 후 모든 관절 동작 테스트",
    ],
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
    summary: "Week 4에서 서피서 처리가 완료된 머리에 수성 도료를 도장하고, LED 눈 디퓨저를 제작한다. Phase 2 게이트의 \"머리 도장 완료\" 조건을 충족하기 위한 필수 작업이며, 건조 시간(24~48시간)을 고려하여 주 초에 시작해야 한다.",
    steps: [
      "서피서 표면 상태 점검 (기포·크랙 있으면 추가 사포 처리)",
      "수성 도료 1차 도장 + 건조 (최소 24시간)",
      "필요 시 2차 도장 + 건조",
      "LED 눈 디퓨저 제작 — 반투명 아크릴 절삭 또는 실리콘 몰드 캐스팅",
      "외장 디테일 점검 (색상 균일성, 표면 결함)",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["neopixel_led"],
    estimatedHours: 6,
  },

  w5_body_cover_complete: {
    summary: "Week 4에서 패턴 제작한 바디 천 커버를 완성하고, 토르소에 임시 피팅하여 환기구·케이블 출구·SO-ARM 가동 범위와의 간섭을 확인한다. Phase 2 게이트의 \"바디 커버 완성\" 조건에 해당한다.",
    steps: [
      "천 커버 봉제 마무리 (솔기 처리, 벨크로 최종 부착)",
      "토르소 프레임에 임시 피팅",
      "환기구(배기구/흡기구) 메쉬 부분 통풍 확인",
      "SO-ARM 어깨 관절 가동 시 간섭 없는지 확인",
      "케이블 출구 부분(Ethernet, USB 등) 접근성 확인",
    ],
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_emotion_5types: {
    summary: "Week 2에서 구현한 3종(중립·기쁨·놀람) 감정을 5종(+슬픔·분노)으로 확장하고, lip sync와 PID 목 제어를 최종 완성한다. Groq 연결 장애 시 Gemini 폴백도 추가하며, VAD 비활성화로 TTS 자체 음성이 STT에 피드백되는 문제를 방지한다.",
    steps: [
      "슬픔·분노 LED 패턴 추가 구현 (총 5종: 중립/기쁨/놀람/슬픔/분노)",
      "Gemini 폴백 로직 추가 — Groq 장애 시 자동 전환",
      "VAD 비활성화 처리 — TTS 재생 중 STT 입력 차단",
      "lip sync 최종 완성 — 음량→서보 매핑 미세 조정, 지연 보정",
      "PID 목 제어 완성 — 오버슈트 5° 이하로 Kp/Ki/Kd 튜닝",
    ],
    resources: [
      { label: "기획서 6.1절 (epsilon2 역할)", type: "internal", section: "6.1" },
    ],
    components: ["neopixel_led", "mg90s_servo", "xl430", "camera_usb"],
    estimatedHours: 10,
  },

  w5_survival_keywords: {
    summary: "네트워크 장애 시 오프라인 서바이벌 모드(기획서 5.5절 계층 2)에서 사용할 키워드 사전과 사전 Q&A를 준비한다. \"컵/빨간거/저거\" 같은 구어 표현을 starbucks_cup 등 SmolVLA target_object에 매핑하는 동의어 사전이 핵심이다.",
    steps: [
      "물체 3종에 대한 동의어 매핑 — \"컵/빨간거/스타벅스\"→starbucks_cup, \"텀블러/보온병\"→tumbler, \"인형/하이리온\"→doll",
      "일상 구어 표현 포함 (\"그거\", \"저거\", \"이거 가져와\" 등)",
      "사전 Q&A 30개 작성 — 예상 관객 질문 + 하이리온 캐릭터 답변",
      "ε1 서바이벌 엔진에 연동 가능한 JSON 포맷으로 정리",
    ],
    resources: [
      { label: "기획서 4.4절 (언어->동작 연결 — 오프라인)", type: "internal", section: "4.4" },
      { label: "기획서 5.5절 (Fallback 계층 설계)", type: "internal", section: "5.5" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_walking_rl_final_review: {
    summary: "Week 4 2차 학습(지형 커리큘럼 + 마찰 DR) 결과를 최종 검토한다. 이 결과가 Week 7에서 δ2에게 전달되는 Walking RL 최종본의 기반이 되므로, 시뮬 내 보행 안정성·속도·에너지 효율을 종합 평가한다.",
    steps: [
      "2차 학습 보상 커브 분석 — 1차 대비 개선 폭 확인",
      "지형 커리큘럼 통과율 확인 (평지→경사→요철 순서)",
      "마찰 DR 범위 내 보행 안정성 확인",
      "시뮬 내 연속 보행 테스트 (5분 이상 낙상 없이 유지 여부)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 3,
  },

  w5_smolvla_best_combo: {
    summary: "Week 4 ablation 실험 결과에서 최적 데이터 조합(공개/자체 비율, lr, 물체별 가중치)을 정리하고, 해당 모델을 ε1에게 전달한다. 이 모델이 Week 7 SmolVLA v2 학습의 베이스라인이 된다.",
    steps: [
      "ablation 조합별 물체 3종 검증 성공률 최종 비교",
      "최적 조합 확정 — 성공률·일반화 성능·학습 시간 종합 판단",
      "최적 모델 체크포인트를 ε1에 전달 (TensorRT v2 변환용)",
      "학습 설정(lr, batch, epoch, 데이터 비율) 문서화",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 4,
  },

  w5_scenario_bc_design: {
    summary: "보행이 불안정할 경우를 대비하여 시나리오 B(제자리 pick-place + 별도 보행 시연)와 C(받침대 고정 + 제자리 pick-place)의 구조와 전환 조건을 정의한다. ε1의 상태 머신에 A→B, A→C 전환 로직을 반영할 수 있도록 명확히 기술한다.",
    steps: [
      "시나리오 B 구조 정의 — 보행 없이 제자리에서 pick-place 수행 + 별도 보행 시연",
      "시나리오 C 구조 정의 — 받침대에 고정하여 보행 완전 생략, 제자리 pick-place만",
      "A→B 전환 조건 정의 (예: 보행 중 낙상 2회 이상, NUC jitter 과다 등)",
      "A→C 전환 조건 정의 (예: 다리 하드웨어 고장, 보행 policy 실패 등)",
      "ε1에 전달하여 상태 머신에 전환 로직 반영",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_optimal_data_combo: {
    summary: "ε1의 ablation 해석 결과와 δ3의 최적 조합 학습 결과를 종합하여, SmolVLA v2 학습에 사용할 최종 데이터 조합을 확정한다. 이 결정이 Week 7 SmolVLA v2 DGX 학습의 입력이 된다.",
    steps: [
      "ε1 ablation 해석 리포트 + δ3 최적 조합 결과 교차 검토",
      "공개/자체 데이터 비율 최종 확정",
      "물체별 가중치·학습률·epoch 수 확정",
      "데이터 정제 방향 결정 (v2용으로 어떤 에피소드를 제외/보강할지)",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w5_survival_engine: {
    summary: "네트워크 완전 차단 상황에서도 10분간 크래시 없이 자율 대화가 가능한 서바이벌 모드 엔진을 완성한다. Whisper tiny(STT)와 Piper TTS를 Orin 로컬에서 실행하고, ε2의 키워드 사전으로 물체 인식 + 사전 Q&A 30개로 대화를 처리한다.",
    steps: [
      "Whisper tiny 모델을 Orin에 배포 + 마이크 입력 연결",
      "Piper TTS 경량 엔진 Orin 설치 + 스피커 출력 확인",
      "ε2 키워드 사전(동의어 매핑 + Q&A 30개) JSON 연동",
      "계층 1(스크립트 시연) + 계층 2(오프라인 자율) 모드 전환 로직 구현",
      "네트워크 차단 상태에서 10분 연속 크래시 없음 테스트",
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
    summary: "Week 4에서 골격을 잡은 FETCH 시퀀서를 상태 머신과 완전 통합하고, SmolVLA·MediaPipe가 동일 카메라(/camera/image_raw)를 공유하는 토픽 설정을 완료한다. 이것으로 IDLE↔TALKING↔MANIPULATING↔WALKING↔FETCH 전체 전환이 가능해진다.",
    steps: [
      "FETCH 시퀀서를 상태 머신에 통합 — TALKING에서 fetch 명령 시 FETCH 진입",
      "카메라 공유 토픽(/camera/image_raw) 설정 — SmolVLA·MediaPipe 동시 구독",
      "FETCH 서브스텝(①~⑤) 전환 자동화 테스트",
      "타이머 T1, T2 초기값 설정 (시연 환경 레이아웃 기반)",
      "FETCH 중 비상정지 → EMERGENCY 즉시 전환 확인",
    ],
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝)", type: "internal", section: "5.1" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 6,
  },

  w5_leg_complete: {
    summary: "Week 4에서 시작한 다리 조립을 완성하고, NUC와 CAN-USB ×2를 실물 연결하여 4버스(1Mbps, 250Hz) 통신을 확인한다. 이것이 공중 보행 테스트의 전제 조건이다.",
    steps: [
      "다리 프레임 + 액추에이터 10개 최종 조립 완료",
      "NUC에 CAN-USB ×2 연결 (4개 CAN 버스 구성)",
      "NUC xanmod RT 커널에서 CAN 통신 테스트 (250Hz 명령 주기 확인)",
      "BHL lowlevel C 코드로 전체 10개 관절 동시 구동 확인",
      "배터리 C 전원으로 독립 구동 테스트",
    ],
    resources: [
      { label: "기획서 7.1절 (BHL 하반신)", type: "internal", section: "7.1" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 8,
  },

  w5_aerial_gait_test: {
    summary: "공중 지그에 다리를 매달고 Walking RL policy를 실행하는 최초의 Sim2real 보행 테스트이다. NUC의 CAN 통신 jitter와 실시간성을 측정하여 Week 6 지면 보행의 안전성을 사전 검증한다. Phase 2 게이트의 \"공중 보행 성공 + NUC 안정\" 조건에 해당한다.",
    steps: [
      "Week 3에서 3D프린트한 공중 지그에 다리 고정",
      "NUC에서 Walking RL policy(C 코드) 실행 → CAN 버스로 관절 명령 전송",
      "CAN 통신 jitter 측정 (250Hz 명령 주기 대비 편차)",
      "NUC CPU 부하·메모리·레이턴시 기록",
      "보행 패턴 시각적 확인 — 발차기, 스윙, 좌우 대칭성",
      "시뮬 궤적과 비교하기 위한 관절 각도 로그 저장",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real — 공중 보행)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w5_aerial_sim_compare: {
    summary: "공중 보행 테스트에서 기록한 실측 관절 궤적을 IsaacLab/MuJoCo 시뮬 궤적과 비교하여 sim-to-real gap을 정량 분석한다. gap이 크면 Week 7에서 δ3가 URDF 실측 업데이트 + Walking RL 재학습을 트리거한다.",
    steps: [
      "공중 보행 로그(관절 각도, 토크, 타이밍)를 시뮬 동일 초기 조건과 정렬",
      "관절별 궤적 차이(RMSE, 최대 편차) 산출",
      "접촉 모델, 마찰, 관성 파라미터 중 gap 주 원인 식별",
      "리포트 작성 → δ3에 전달 (Week 7 재학습 필요 여부 판단 근거)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w5_phase2_gate: {
    summary: "Phase 2는 Week 5 말에 통과해야 하는 두 번째 게이트이다. 상체(대화+캐릭터 표현)와 하체(공중 보행) 모두 기본 동작이 검증되어야 하며, 이 게이트 통과 후 Week 6부터 양 트랙 마일스톤(상반신 통합, 지면 보행)에 진입한다.",
    steps: [
      "대화 TTFT(Time To First Token) <500ms 확인",
      "시선 추적 + 표정 5종(중립/기쁨/놀람/슬픔/분노) 동작 확인",
      "서바이벌 모드 10분 크래시 없음 확인",
      "공중 보행 성공 + NUC CAN 통신 안정 확인",
      "SmolVLA ablation 완료 + 최적 조합 확정",
      "머리 도장 완료 + 바디 커버 완성",
    ],
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
    summary: "상반신 통합 테스트(epsilon1 주도). IDLE↔TALKING↔MANIPULATING↔FETCH 4개 상태 전환을 실물 SO-ARM + Orin 환경에서 검증한다. 보행은 아직 mock으로 대체하되 SmolVLA pick과 handover는 실제 수행하며, LOW_BATTERY(SOC 20%)와 EMERGENCY 비상정지도 연결한다. 서바이벌 계층 1(스크립트 시연)+계층 2(오프라인 자율)를 통합하여 파이프라인 10분 크래시 없음을 달성해야 한다.",
    steps: [
      "IDLE→TALKING 전환 확인 (관객 음성 입력 → STT → 대화 파이프라인 활성화)",
      "TALKING→MANIPULATING 전환 확인 (fetch 명령 감지 → SmolVLA 실행)",
      "MANIPULATING→IDLE 복귀 (pick/handover 완료 후 상태 복원)",
      "FETCH 시퀀서 로직 연결 — WALKING 서브스텝은 mock(/gait/cmd 더미), pick+handover는 실제",
      "LOW_BATTERY 상태 구현 (SOC 20% 이하 → 안전 자세, 대화만 가능)",
      "EMERGENCY 상태 구현 (비상정지 → BHL 전원 차단, Orin 로그 유지)",
      "서바이벌 계층 1(스크립트 시연: 키워드 매칭+사전 녹음) + 계층 2(Whisper tiny+Piper TTS) 통합",
      "전체 파이프라인 10분 연속 크래시 없음 확인 — 메모리 누수/토픽 지연 모니터링",
    ],
    resources: [
      { label: "기획서 5.1절 (상태 머신)", type: "internal", section: "5.1" },
      { label: "기획서 5.5절 (Fallback 계층)", type: "internal", section: "5.5" },
      { label: "기획서 5.2절 (상태별 프로세스-리소스 매핑)", type: "internal", section: "5.2" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 12,
  },

  w6_fetch_logic_test: {
    summary: "FETCH 시퀀서 로직 단독 테스트. 기획서 5.1절 타이머 기반 open-loop 구조에서 WALKING 서브스텝은 /gait/cmd mock 퍼블리시로 대체하고, SmolVLA pick(물체 잡기) + precoded handover(팔 뻗기 전달)는 실제 SO-ARM으로 수행한다. T1(테이블 방향), T2(홈 방향) 타이머 값을 임시 설정하고 서브스텝 간 자동 전환이 올바른지 검증한다.",
    steps: [
      "FETCH 진입 시 LLM이 target_object를 전달하는 인터페이스 확인",
      "서브스텝 1: WALKING mock — /gait/cmd에 전진 명령 퍼블리시 (타이머 T1초)",
      "서브스텝 2: 정지 → MANIPULATING — SmolVLA pick 실행 (target_object 전달)",
      "서브스텝 3: WALKING mock — 180도 회전 + 전진 (타이머 T2초)",
      "서브스텝 4: 정지 → MANIPULATING — precoded handover (팔 뻗기)",
      "서브스텝 5: IDLE 복귀 확인",
      "3개 물체(컵, 텀블러, 인형)에 대해 연속 FETCH 반복 테스트",
    ],
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝)", type: "internal", section: "5.1" },
      { label: "기획서 3절 (시연 시나리오 — fetch 흐름)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "xl430"],
    estimatedHours: 6,
  },

  w6_head_prefit: {
    summary: "머리 외주 CNC 조형물이 도착한 경우, 내부에 전자부품(카메라 1개, NeoPixel LED 눈 2개)을 임시 장착하여 피팅 간섭 여부를 확인한다. 미도착 시 Week 4~5에 만든 수작업 목업으로 계속 진행. delta1이 상반신 통합(epsilon1 주도) 과정에서 물리적 지원(케이블 정리, 토르소 개폐 등)을 병행한다.",
    steps: [
      "외주 조형물 개봉 및 외관 검수 (크기, 개구부 위치, 표면 상태)",
      "카메라 모듈 임시 장착 — 정면 개구부 정렬, USB 케이블 경로 확인",
      "NeoPixel LED 눈 2개 임시 장착 — 디퓨저 맞춤, 발광 균일도 확인",
      "내부 공간 간섭 점검 (카메라+LED+입서보 동시 수납 가능 여부)",
      "미도착 시: 목업 상태 유지, Week 7 전자부품 통합 계획 재확인",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led"],
    estimatedHours: 4,
  },

  w6_exterior_check: {
    summary: "Week 5에서 완성한 바디 천 커버의 토르소 피팅 상태를 점검한다. 환기구(배기구/흡기구) 메쉬 부분이 막히지 않았는지, SO-ARM 어깨 관절과 천 커버 간 간섭이 없는지, 벨크로 고정이 견고한지 확인하고 미세 조정한다.",
    steps: [
      "바디 천 커버 장착 후 SO-ARM 양팔 전체 가동 범위 동작 — 간섭 여부 확인",
      "환기구(상단 배기+하단 흡기) 메쉬 영역 개방 상태 점검",
      "벨크로 고정점 견고성 확인 (흔들어도 탈착 안 되는지)",
      "필요 시 천 커버 재단 미세 조정 또는 벨크로 위치 변경",
    ],
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w6_dummy_weight: {
    summary: "Track B 더미 지면 보행을 위한 더미 웨이트 제작. Week 7 실측 전까지 상체 질량을 대리하는 역할이며, delta2가 스펙시트 기반 무게 적산값(Orin+NUC+SO-ARM+배터리 A/B+토르소 프레임+머리 목업)을 합산하여 총 무게를 설정한다. 100g 단위로 추가/제거가 가능하도록 분리형으로 설계하여 Week 7 실측값 반영 시 즉시 업데이트할 수 있게 한다.",
    steps: [
      "스펙시트 기반 상체 총 무게 적산 (Orin 200g + NUC 300g + SO-ARM x2 + 배터리 A/B + 프레임 + 머리)",
      "더미 웨이트 소재 선정 (철판/납추/모래주머니 등)",
      "100g 단위 분리 가능한 모듈형 구조 설계",
      "BHL hip 결합부에 안정적으로 고정되는 마운트 제작",
      "CoM 위치를 실제 상체와 유사하게 배치 (무게 중심 높이 고려)",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
      { label: "기획서 11절 (리스크 — 두 트랙 무게 비동기)", type: "internal", section: "11" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w6_ground_gait_first: {
    summary: "Week 5 공중 보행 성공 후, 더미 웨이트를 장착한 BHL 다리를 실제 지면에 내려 첫 보행을 시도하는 핵심 체크포인트. 공중 보행과 달리 지면 반력, 마찰, 미끄러짐이 발생하므로 Walking RL policy의 실제 성능을 처음으로 검증한다. 직립 유지 → 제자리 걸음 → 전진 순서로 단계적 진행하며, 실패 시 gap 데이터를 기록하여 delta3 재학습 판단에 활용한다.",
    steps: [
      "더미 웨이트 장착 + BHL hip 결합부 고정 상태 확인",
      "안전 지그(낙하 방지 줄 또는 보조자 대기) 준비",
      "NUC에서 Walking RL policy 로드 + CAN 통신 정상 확인",
      "1단계: 직립 유지 테스트 (10초 이상 넘어지지 않기)",
      "2단계: 제자리 걸음 (발을 들었다 놓기 반복)",
      "3단계: 전진 보행 시도 (1~3보)",
      "IMU 로그 + 관절 각도 로그 + 영상 기록",
      "실패 시 넘어진 방향/시점/관절 상태 기록 → gap 분석용 데이터 확보",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real — 지면 보행)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010", "esc_b_g431b"],
    estimatedHours: 6,
  },

  w6_gap_analysis: {
    summary: "지면 보행 첫 시도에서 수집한 gap 데이터(IMU 로그, 관절 궤적, 영상)를 epsilon2가 분석하고, 시뮬레이션 결과와 비교하여 sim-to-real gap의 원인을 분류한다. delta3은 gap 크기에 따라 IsaacLab에서 도메인 랜덤화(마찰, mass, 지연) 파라미터를 조정하여 재학습할지 판단한다. 보행 전체 실패 시 시나리오 B(제자리 pick-place)로 전환하는 의사결정 시점이기도 하다.",
    steps: [
      "지면 보행 IMU 로그와 시뮬 IMU 궤적 비교 (roll/pitch 편차 분석)",
      "관절 실측 각도 vs 시뮬 명령 각도 비교 (tracking error 산출)",
      "영상 분석 — 발 미끄러짐, 발목 꺾임, 과도한 흔들림 등 패턴 분류",
      "gap 원인 분류: 마찰 부정합 / mass 부정합 / 관절 응답 지연 / 기타",
      "delta3에 재학습 필요 여부 + 구체적 DR 파라미터 조정 사항 전달",
      "보행 전체 실패 시 시나리오 B 전환 논의 (기획서 3절 레벨 판정 기준)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "기획서 3절 (시연 시나리오 레벨 — B 조건)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 4,
  },

  // =======================================================================
  // WEEK 7 — 상체 마무리 + 하체 최종 policy
  // =======================================================================

  w7_upper_measurement: {
    summary: "Week 8 합체 전 마지막 상반신 정밀 계측. delta1이 각 부품(머리, 토르소 프레임, SO-ARM x2, Orin, NUC, 배터리 A/B, 스피커 등)의 질량을 +-10g 정밀도로 측정하고, 무게 중심(CoM)과 관성 텐서를 산출한다. 이 데이터는 delta3의 URDF 업데이트 + Walking RL 재학습, delta2의 더미 웨이트 실측값 업데이트에 직접 사용되므로, 정확도가 Week 8 실체 보행 성공에 직결된다.",
    steps: [
      "전자저울(0.1g)로 각 부품별 질량 측정 — 머리, 토르소 프레임, SO-ARM x2, Orin+carrier, NUC, 배터리 A/B, 스피커/마이크, 케이블 뭉치",
      "부품별 장착 위치 기준 CoM(무게 중심) 산출 — 토르소 좌표계 기준 x/y/z",
      "관성 텐서 계산 (CAD 기반 + 실측 보정)",
      "delta2 더미 웨이트를 실측 총 질량으로 업데이트 (100g 단위 모듈 추가/제거)",
      "무게 예산 검증 — 초과 시 불필요 브래킷 제거, 케이블 단축 등 경량화 방안 수립",
      "실측 데이터를 delta3(URDF 업데이트용) + delta2(더미 웨이트용)에 즉시 전달",
    ],
    resources: [
      { label: "기획서 7.4절 (무게 예산)", type: "internal", section: "7.4" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w7_head_electronics_integrate: {
    summary: "머리 전자부품 8단계 통합 — Week 7의 핵심 하드웨어 작업. 외주 CNC 조형물(또는 수작업 목업)에 카메라, LED 눈, 입 서보를 순차 장착하고, 모든 배선을 목 내부 경로로 집약하여 토르소에 결합한다. 최종 계량 게이트는 700g 이하이며, 초과 시 디퓨저 소재 변경이나 배선 단축으로 경량화한다. 플랜 B: 외주 미도착 시 Week 4~5 도장 완료 목업으로 동일 8단계를 진행한다.",
    steps: [
      "1단계 피팅: 외주 조형물(또는 목업)의 개구부에 전자부품 더미 배치 → 공간 간섭 최종 확인",
      "2단계 카메라: USB 카메라를 정면 개구부에 고정 — 화각이 SO-ARM 작업 공간을 커버하는지 확인",
      "3단계 LED+디퓨저: NeoPixel LED 눈 2개 + 반투명 디퓨저(아크릴/실리콘) 장착 — 균일 발광 확인",
      "4단계 입 서보: MG90S를 입 개구부에 장착 — lip sync 동작 범위(개폐 각도) 확인",
      "5단계 배선 집약: 카메라 USB + LED 신호선 + 서보 PWM + 전원을 목 내부 경로로 통합 번들링",
      "6단계 토르소 결합: 머리를 목 서보(XL430 x2) 위에 장착 — 고정 나사 체결, 흔들림 없는지 확인",
      "7단계 계량: 전체(머리 조형물+전자부품) 700g 이하 확인 — 초과 시 디퓨저 소재 변경/배선 단축",
      "8단계 감정 전체 테스트: 5종 감정(중립/기쁨/놀람/슬픔/분노) LED 패턴 + lip sync + 목 PID 시선 추적 통합 동작 검증",
    ],
    resources: [
      { label: "기획서 7.3절 (머리 제작)", type: "internal", section: "7.3" },
    ],
    components: ["camera_usb", "neopixel_led", "mg90s_servo", "xl430"],
    estimatedHours: 8,
  },

  w7_foot_cover: {
    summary: "BHL 다리 발 끝에 하이리온 캐릭터 신발 느낌의 발 커버를 제작한다. EVA 폼(충격 흡수, 경량) 또는 3D프린트(정밀, TPU 유연) 소재를 선택하며, 바닥면 마찰 계수가 보행 policy에 영향을 주므로 Week 9 답사 시 현장 바닥과의 마찰 테스트도 고려하여 소재를 결정한다.",
    steps: [
      "BHL 발 끝 치수 실측 + 발 커버 외형 디자인 (epsilon2 캐릭터 컨셉 반영)",
      "소재 선택: EVA 폼(경량, 충격 흡수) vs TPU 3D프린트(정밀, 유연성) 비교",
      "바닥면 마찰 계수 고려 — 미끄러짐 방지를 위한 패턴/소재 선정",
      "시제품 제작 + BHL 발에 피팅 테스트",
      "보행 테스트 시 발 커버 영향 확인 (무게 추가, 마찰 변화)",
    ],
    resources: [
      { label: "기획서 7.6절 (외장 — 다리 외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w7_smolvla_v2_data: {
    summary: "SmolVLA v2용 데이터 정제(epsilon1) + delta3에 전달하여 DGX 학습 트리거 + 학습 완료 모델을 TensorRT v2로 Orin에 배포. v1 대비 ablation 결과에서 선별된 최적 데이터 조합을 사용하며, 실패 에피소드 제거, 메타데이터 필터링, 증강 비율 조정을 거친 정제 데이터셋이다.",
    steps: [
      "v1 평가 리포트에서 실패 유형별 에피소드 식별 + 제거",
      "ablation 최적 조합에 맞춰 데이터셋 재구성 (시연 조건 비율 60%+ 유지)",
      "정제된 v2 데이터셋을 delta3 DGX 서버에 전달",
      "delta3 학습 완료 후 모델 수신 → ONNX → TensorRT FP16 변환",
      "Orin에 v2 모델 배포 + v1 대비 추론 Hz/정합성 비교 검증",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["orin_nano_super", "dgx_spark"],
    estimatedHours: 6,
  },

  w7_survival_scenario_final: {
    summary: "서바이벌 시나리오 최종 확정. epsilon2의 키워드 사전(동의어 매핑+Q&A 30개)과 delta3이 Week 5에서 설계한 시나리오 B/C 구조 및 전환 조건을 하나의 통합 시나리오 문서로 병합한다. 네트워크 장애 시 계층 1(스크립트 시연 모드)→계층 2(오프라인 자율)→보행 실패 시 시나리오 B/C 전환까지의 전체 fallback 흐름을 확정한다.",
    steps: [
      "epsilon2 키워드 사전 최종본 수신 (동의어 매핑 + 사전 Q&A 30개)",
      "delta3 시나리오 B/C 설계 문서 수신 (전환 조건, 레이아웃 변경 사항)",
      "통합 시나리오 문서 작성 — 정상 흐름(A) + 보행 실패(B/C) + 네트워크 장애(서바이벌)",
      "상태 머신에 시나리오 B/C 전환 로직 반영 (epsilon1 구현)",
      "전체 fallback 체인 시뮬레이션 테스트",
    ],
    resources: [
      { label: "기획서 5.5절 (Fallback 계층)", type: "internal", section: "5.5" },
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super"],
    estimatedHours: 4,
  },

  w7_smolvla_v2_eval: {
    summary: "SmolVLA v2 모델을 Orin TensorRT에서 실행하여 3개 물체(컵, 텀블러, 인형)에 대한 실물 pick 성공률을 측정하고, v1 대비 개선 여부를 정량 평가한다. 동시에 감정 표현 시스템(LED 5종 + lip sync + 목 PID)에 대해 5인 사용자 테스트를 실시하여 감정 인식률과 자연스러움을 평가한다.",
    steps: [
      "SmolVLA v2 TensorRT 모델 Orin 로드 + 추론 Hz 확인",
      "물체별 pick 테스트: 컵 20회, 텀블러 20회, 인형 20회 → 성공률 산출",
      "v1 대비 성공률 비교표 작성 + 실패 유형 분류 (접근 실패/그립 실패/리프트 실패)",
      "감정 표현 5인 테스트 — 각 감정(중립/기쁨/놀람/슬픔/분노) 표출 후 인식률 측정",
      "감정 전환 자연스러움 주관 평가 (5점 척도)",
      "평가 결과 리포트 작성 → Phase 3 게이트 판단 자료로 활용",
    ],
    resources: [
      { label: "기획서 4.1절 (물체 및 수집 조건)", type: "internal", section: "4.1" },
    ],
    components: ["orin_nano_super", "xl430"],
    estimatedHours: 5,
  },

  w7_exterior_final_check: {
    summary: "Phase 3 게이트 전 외장 전체 최종 점검. 머리(도장 상태+디퓨저 발광), 바디(천 커버 피팅+벨크로+환기구), 다리(발 커버 고정+마찰면)를 전수 확인하고, 파손이나 변색이 있으면 보정한다. Week 9 운송 시 파손 위험 부위(머리 돌출부, 바디 커버 모서리)에 보호 조치를 미리 계획한다.",
    steps: [
      "머리: 도장 표면 상태(긁힘, 변색) + LED 디퓨저 발광 균일도 재확인",
      "바디: 천 커버 피팅 상태 + 벨크로 접착력 + 환기구 메쉬 개방 상태",
      "다리: 발 커버 고정 상태 + 바닥면 마찰 소재 상태",
      "파손/변색 부위 보정 (터치업 도장, 천 커버 재봉 등)",
      "Week 9 운송 대비 보호 조치 계획 (완충재, 분리 운반 순서)",
    ],
    resources: [
      { label: "기획서 7.6절 (외장)", type: "internal", section: "7.6" },
    ],
    components: [],
    estimatedHours: 3,
  },

  w7_relearn_test: {
    summary: "Week 6 gap 분석 결과를 반영한 재학습 Walking RL policy를 더미 웨이트 장착 상태에서 반복 테스트한다. 30분 전원 연속 테스트로 배터리 C 소모율과 BMS 동작을 검증하고, NUC의 장시간 운용 안정성(메모리 누수, CAN 타임아웃 등)을 확인한다. Phase 3 게이트의 '더미 보행 안정' 조건 충족이 목표이다.",
    steps: [
      "재학습 policy를 NUC에 배포 + CAN 통신 정상 확인",
      "더미 웨이트 장착 상태에서 지면 보행 반복 (최소 10회)",
      "직립 유지 + 전진 + 정지 + 회전 기본 동작 안정성 확인",
      "30분 연속 전원 테스트 — 배터리 C SOC 모니터링 + BMS 셀 밸런싱 확인",
      "NUC 장시간 운용: 메모리 사용량, CAN 타임아웃, CPU 온도 모니터링",
      "불안정 시 delta3에 추가 재학습 요청 + DR 파라미터 구체 전달",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["nuc", "bms", "battery_c"],
    estimatedHours: 8,
  },

  w7_emergency_manual: {
    summary: "delta2가 전원/안전 오너로서 비상 매뉴얼을 작성한다. 전원 투입 순서(A→Orin/NUC 부팅→B→Dynamixel 토크→C→BHL 캘리브), 비상정지 후 복구 절차, ESP32 MOSFET 낙상 차단 동작 확인법, 재시작 절차를 포함한다. Week 9 리허설에서 전원이 이 매뉴얼을 숙지하고, 각자 역할(delta2: 전원 투입/차단, delta1: 물리 안전 등)에 따라 집행한다.",
    steps: [
      "전원 투입 시퀀싱 문서화: A ON → Orin/NUC 부팅 → B ON → Dynamixel 토크 → C ON → BHL 캘리브",
      "비상정지 절차: B+C 양극 NC 차단 + ESP32 MOSFET C 차단 → A 유지 → Orin 로그 보존",
      "비상정지 후 복구: 원인 확인 → 안전 자세 → C 재투입 → B 재투입 → IDLE 복귀",
      "ESP32 낙상 감지 차단 동작 확인법 (기울임 각도 임계값, ISR 반응 시간)",
      "재시작 절차: 전원 완전 차단 → 30초 대기 → 투입 시퀀싱 재실행",
      "역할별 비상 행동 지침 작성 (delta1: 물리 안전, delta2: 전원, epsilon1: 시스템, epsilon2: 기록)",
    ],
    resources: [
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mosfet", "emergency_stop_switch"],
    estimatedHours: 4,
  },

  w7_urdf_measurement_update: {
    summary: "delta1이 전달한 상반신 실측 데이터(질량, CoM, 관성 텐서)를 IsaacLab URDF에 반영하고, Walking RL 재학습을 트리거한다. 더미 웨이트가 아닌 실체 상반신 파라미터로 학습하는 것이 Week 8 합체 성공의 핵심이다. DR(Domain Randomization) 범위도 실측값 +-20%로 재조정한다.",
    steps: [
      "delta1 실측 데이터 수신 (부품별 질량, CoM xyz, 관성 텐서)",
      "IsaacLab URDF의 상부 mass/inertia 파라미터 업데이트",
      "DR 범위 재조정: 실측값 기준 mass +-20%, CoM +-10%",
      "Walking RL 재학습 DGX 실행 트리거",
      "학습 수렴 모니터링 + 최종본 delta2에 전달",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "기획서 7.4절 (무게 예산 — 실측 반영)", type: "internal", section: "7.4" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 6,
  },

  w7_smolvla_v2_dgx: {
    summary: "epsilon1이 정제한 v2 데이터셋으로 SmolVLA v2를 DGX에서 학습한다. Stage 2 파인튜닝 방식이며, ablation에서 확정된 최적 하이퍼파라미터(lr, batch size, 공개 데이터 비율)를 사용한다. Walking RL 재학습과 DGX 시간을 분배해야 하므로 스케줄 조율이 필요하다.",
    steps: [
      "epsilon1으로부터 정제된 v2 데이터셋 수신 + 무결성 확인",
      "ablation 최적 하이퍼파라미터 설정 (lr, batch, Stage 1 공개 데이터 비율)",
      "DGX 학습 실행 (Walking RL 재학습과 GPU 시간 분배 조율)",
      "학습 loss/성공률 모니터링 + 체크포인트 저장",
      "학습 완료 모델을 epsilon1에 전달 (TensorRT 변환 + Orin 배포용)",
    ],
    resources: [
      { label: "기획서 4.3절 (2-Stage 파인튜닝)", type: "internal", section: "4.3" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 12,
  },

  w7_walking_rl_final: {
    summary: "실측 URDF 기반 Walking RL 최종본을 delta2 NUC에 전달하여 Week 8 합체에 대비한다. 동시에 Week 5에서 설계한 시나리오 B/C를 최종 확정하고 epsilon1에 전달한다. 시나리오 레벨 판정 기준: A(FETCH+10보+), B(보행 미달 시 제자리 pick-place+별도 보행), C(받침대 고정+제자리 pick-place). Week 7 말 시점의 더미 보행 안정성으로 예비 판정을 수행한다.",
    steps: [
      "Walking RL 최종 학습 결과 검토 (reward curve, 보행 안정성 지표)",
      "최종 policy 파일을 delta2 NUC에 배포 + 동작 확인",
      "시나리오 B/C 최종 확정 — 전환 조건, 레이아웃 변경, 상태 머신 분기점 명시",
      "epsilon1에 시나리오 B/C 문서 + 상태 머신 전환 조건 전달",
      "더미 보행 안정성 기준 시나리오 레벨 예비 판정 (A/B/C)",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
      { label: "기획서 3절 (시연 시나리오 레벨)", type: "internal", section: "3" },
    ],
    components: ["dgx_spark", "nuc"],
    estimatedHours: 4,
  },

  w7_sim2real_report: {
    summary: "epsilon2와 delta3이 공동으로 sim-to-real 파이프라인 전체를 심층 분석한다. IsaacLab 학습→Sim2sim(MuJoCo)→공중 보행→더미 지면 보행→(예비) 실체 보행까지의 각 단계별 gap을 정리하고, DR 파라미터 효과, 관절 응답 지연, 마찰 부정합 등 핵심 gap 요인을 리포트로 문서화한다. 이 리포트는 Phase 3 게이트 자료이자 Week 8 합체 시 참조 문서가 된다.",
    steps: [
      "각 단계별 gap 데이터 수집 정리 (시뮬→Sim2sim→공중→지면)",
      "DR 파라미터(mass, 마찰, 관절 강성) 효과 정량 분석",
      "관절 응답 지연(시뮬 명령 vs 실측) 분석 + 개선 여부 추적",
      "마찰 부정합 분석 (시뮬 마찰 vs 실제 바닥 마찰)",
      "리포트 작성 — 핵심 gap 요인, 조치 이력, 잔여 리스크, Week 8 권고사항",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: [],
    estimatedHours: 6,
  },

  w7_phase3_gate: {
    summary: "Phase 3 게이트 통과 판정. 5개 조건을 모두 충족해야 Week 8 합체에 진입한다: (1) 머리 전자부품 8단계 통합 완료(또는 목업 기능 검증), (2) SmolVLA v2 Orin TensorRT 배포 완료, (3) Walking RL 최종본 + 더미 보행 안정(30분 전원 테스트 통과), (4) 실측값이 무게 예산 이하, (5) 외장 완성(머리 도장+바디 커버+발 커버) + sim-to-real 리포트 완성.",
    steps: [
      "머리 통합 확인: 8단계 완료 + 계량 700g 이하 (또는 목업 기능 동등 검증)",
      "SmolVLA v2 확인: Orin TensorRT 배포 + 물체별 pick 성공률 v1 이상",
      "Walking RL 확인: 최종본 NUC 배포 + 더미 보행 안정 (직립+전진+정지)",
      "무게 확인: 상반신 실측 총 질량이 무게 예산 이하",
      "외장 확인: 머리 도장 + 바디 커버 + 발 커버 상태 양호",
      "sim-to-real 리포트 완성 확인",
      "미충족 항목 시 보완 계획 수립 + Week 8 합체 일정 조정 여부 판단",
    ],
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
    summary: "프로젝트 최대 마일스톤 — 상하체 결합. 토르소 하단의 퀵릴리즈 핀(또는 나비너트)을 BHL hip 프레임에 결합하여 상체(토르소+SO-ARM+머리)와 하체(BHL 다리)를 하나의 로봇으로 만든다. 결합 후 관절 가동 범위를 실측하여 +-5도 이상 차이 시 URDF를 수정하고, 관절 스텝 응답을 측정하여 시뮬과 비교한다. 이 결합 구조는 운송 시 분리→현장 10분 조립이 가능해야 한다.",
    steps: [
      "토르소 하단 퀵릴리즈 핀/나비너트와 BHL hip 프레임 결합부 정렬 확인",
      "퀵릴리즈로 상하체 물리 결합 — 체결 토크 확인, 흔들림 없는지 검증",
      "결합 상태에서 모든 다리 관절(10DOF) 가동 범위 실측",
      "실측 vs URDF 비교 — +-5도 이상 차이 시 URDF 수정 + delta3 재학습 트리거",
      "관절 스텝 응답 테스트 (명령 각도 스텝 입력 → 응답 시간/오버슈트 측정)",
      "epsilon2: 스텝 응답 vs 시뮬 비교 분석",
      "결합/분리 소요 시간 측정 — 10분 이내 목표 (Week 9 답사 대비)",
    ],
    resources: [
      { label: "기획서 7.2절 (상하체 결합부)", type: "internal", section: "7.2" },
    ],
    components: ["aluminum_profile_2020"],
    estimatedHours: 4,
  },

  w8_power_integration: {
    summary: "상하체 결합에 맞춰 3개 배터리 전원을 통합 배선한다. A(Orin+NUC+LED+입서보+스피커, 토르소 최하단 또는 hip), B(Dynamixel x14, 토르소 최하단), C(BHL BLDC x10+ESP32, 다리 프레임)가 PDB+BMS+DC-DC(5V/12V/19V)를 통해 각 부하에 공급되도록 연결한다. 비상정지 시 B+C는 NC 차단되고 A는 유지(Orin 로그 보존). 전원 시퀀싱(A→부팅→B→토크→C→캘리브)을 실물에서 처음 통합 검증한다.",
    steps: [
      "배터리 A: PDB→DC-DC(5V Orin, 19V NUC)→각 부하 배선 확인",
      "배터리 B: PDB→SO-ARM STS3215 x12 + 목 XL430 x2 배선 확인",
      "배터리 C: BHL 다리 BLDC x10 + ESP32 배선 확인 (다리 프레임 내부)",
      "BMS x3 셀 밸런싱 상태 확인",
      "비상정지 회로 연결: B+C 양극 NC 차단 + ESP32 MOSFET C 라인 차단",
      "전원 시퀀싱 실물 테스트: A ON → Orin/NUC 부팅 → B ON → Dynamixel 토크 → C ON → BHL 캘리브",
      "전체 시스템 동시 전원 ON 상태에서 전압/전류 안정성 확인",
    ],
    resources: [
      { label: "기획서 7.5절 (배터리 배치)", type: "internal", section: "7.5" },
      { label: "기획서 7.7절 (전원 시퀀싱)", type: "internal", section: "7.7" },
    ],
    components: ["battery_a", "battery_b", "battery_c", "pdb", "bms", "dc_dc_converter"],
    estimatedHours: 4,
  },

  w8_real_body_gait: {
    summary: "더미 웨이트가 아닌 실제 상체(토르소+SO-ARM+머리+배터리 A/B)가 장착된 상태에서 지면 보행을 테스트한다. 더미 대비 실체의 차이점은: (1) 질량 분포가 비균일(SO-ARM 어깨, 머리 등 돌출), (2) CoM 높이가 다를 수 있음, (3) 배선/외장으로 인한 미세 간섭 가능성. 직립→전진→정지를 확인하고, 실패 시 delta3에 실체 mass 기반 최종 재학습을 요청한다.",
    steps: [
      "실체 상체 결합 상태에서 전원 시퀀싱 완료 확인",
      "안전 지그/보조자 대기 상태에서 직립 테스트",
      "전진 보행 시도 (3~5보 목표)",
      "정지 명령 후 안정적 정지 확인",
      "더미 보행 대비 차이점 기록: 흔들림 증가, 편향, 관절 부하 변화 등",
      "실패 시: 실측 mass로 URDF 재업데이트 → delta3 최종 재학습 트리거",
      "성공 시: 5분 연속 보행 시도 → Week 8 풀 시나리오 진입 준비",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real — 실체 장착)", type: "internal", section: "8" },
    ],
    components: ["nuc", "can_usb", "mad_m6c12", "mad_5010"],
    estimatedHours: 6,
  },

  w8_mass_relearn: {
    summary: "실체 장착 보행 테스트가 실패하거나 더미 대비 유의미한 gap이 발생한 경우, DGX에서 실체 mass 기반 최종 Walking RL 재학습을 수행한다. Week 7 실측 URDF에 결합 후 추가 측정값(결합부 유격, 실체 CoM 편차)을 반영하여 DR 범위를 최종 조정한다. 이 재학습이 마지막 기회이므로 학습 시간을 최소화하기 위해 기존 체크포인트에서 이어 학습한다.",
    steps: [
      "실체 보행 실패 원인 분석 데이터 수신 (epsilon2 gap 분석 + 영상)",
      "URDF에 결합 후 추가 측정값 반영 (결합부 유격, 실체 CoM 편차)",
      "DR 범위 최종 조정 (실체 기반 mass +-10%로 좁힘)",
      "기존 체크포인트에서 이어 학습 (전체 재학습 대비 시간 절약)",
      "학습 완료 → delta2 NUC 배포 → 실체 재테스트",
    ],
    resources: [
      { label: "기획서 8절 (Sim->Real)", type: "internal", section: "8" },
    ],
    components: ["dgx_spark"],
    estimatedHours: 8,
  },

  w8_mosfet_real_verify: {
    summary: "실체 상하체 결합 상태에서 ESP32 MOSFET 낙상 차단을 실물 검증한다. 의도적으로 불안정 자세를 유발하여 MPU6050 기울임 감지→ISR→MOSFET C 라인 차단→BHL 관절 풀림(백드라이버블)→안전 주저앉음 시퀀스가 정상 동작하는지 확인한다. 동시에 epsilon2가 실체 vs 더미 상태에서의 sim-to-real 차이를 비교 분석한다.",
    steps: [
      "ESP32 + MPU6050 장착 상태 + MOSFET 배선 최종 확인",
      "정상 직립 상태에서 IMU 기준값 캘리브레이션",
      "의도적 불안정 유발 (보조자가 살짝 밀기) → 낙상 감지 트리거 확인",
      "MOSFET 차단 → BHL 관절 풀림 → 안전 주저앉음 동작 확인",
      "차단 반응 시간 측정 (ISR 트리거 → MOSFET OFF 까지)",
      "epsilon2: 실체 vs 더미 sim-to-real 비교 (IMU 궤적, 관절 응답, 낙상 패턴)",
    ],
    resources: [
      { label: "기획서 7.8절 (안전)", type: "internal", section: "7.8" },
    ],
    components: ["esp32", "mpu6050", "mosfet"],
    estimatedHours: 3,
  },

  w8_walk_arm_policy: {
    summary: "보행 중 SmolVLA를 중단하고 precoded 팔 스윙을 실행하는 정책을 구현한다. 대화에서 '걸어'와 같은 보행 명령 감지 시 Orin이 /gait/cmd 토픽으로 NUC에 전달하는 연동을 완성한다. FETCH 시퀀서의 타이머 T1(홈→테이블)과 T2(테이블→홈)를 실제 보행 속도에 맞춰 튜닝하며, 시연 환경 레이아웃(관객↔로봇홈 ~1.5m↔테이블 ~1.5m)을 기준으로 설정한다.",
    steps: [
      "WALKING 상태 진입 시 SmolVLA 추론 중단 + precoded 팔 스윙 활성화",
      "WALKING→정지 시 팔 중립 복귀 + SmolVLA 추론 재개 가능 상태 확인",
      "대화 명령 '걸어/가져와' 감지 → /gait/cmd 토픽 퍼블리시 연동",
      "FETCH 타이머 T1 튜닝: 홈→테이블 방향 전진 시간 (레이아웃 ~1.5m 기준)",
      "FETCH 타이머 T2 튜닝: 180도 회전 + 테이블→홈 복귀 시간",
      "연속 FETCH 3회 반복 테스트 (물체 3종) → 타이머 정밀도 확인",
    ],
    resources: [
      { label: "기획서 5.1절 (FETCH 서브스텝 — 타이머)", type: "internal", section: "5.1" },
      { label: "기획서 3절 (시연 환경 레이아웃)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc"],
    estimatedHours: 6,
  },

  w8_full_scenario_v1: {
    summary: "시연 시나리오(기획서 3절) 전체 흐름을 실체 로봇으로 처음 실행하는 핵심 테스트. 관객 접근→시선 추적→인사→대화→FETCH(걸어가서 집고 돌아와서 전달)→자유 보행+대화까지의 전체 시퀀스를 통합 검증한다. 이 테스트 결과로 시나리오 레벨 A/B/C를 1차 판정하며, 실패 구간을 식별하여 Week 9 안정화 작업의 우선순위를 결정한다.",
    steps: [
      "1. 시선 추적: MediaPipe 얼굴 감지 → XL430 목 PID → 관객 바라보기",
      "2. 인사: '안녕하세요' TTS + 손 흔들기(precoded) + happy LED + lip sync",
      "3. 대화: 관객 '저 빨간 컵 줄 수 있어?' → Groq STT→LLM→fetch 트리거",
      "4. FETCH 서브스텝1: WALKING 테이블 방향 (T1초) → 정지",
      "5. FETCH 서브스텝2: MANIPULATING SmolVLA pick (target: starbucks_cup)",
      "6. FETCH 서브스텝3: WALKING 홈 복귀 (180도 회전+T2초) → 정지",
      "7. FETCH 서브스텝4: MANIPULATING precoded handover → IDLE 복귀",
      "8. 자유 보행 + 대화 (보행 중 precoded 팔 스윙, 대화 가능)",
      "9. 전체 보행 로그(IMU, 관절, /gait/status) 기록 + epsilon2 분석",
      "10. 시나리오 레벨 1차 판정: A(전체 성공)/B(보행 미달)/C(보행 전체 실패)",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc", "xl430", "camera_usb", "neopixel_led", "speaker", "microphone"],
    estimatedHours: 8,
  },

  w8_merge_gate: {
    summary: "합류 게이트 통과 판정. 4개 조건 충족 필요: (1) 상하체 퀵릴리즈 결합 완료 + 분리/조립 10분 이내, (2) 실체 보행 성공(직립+전진+정지), (3) MOSFET 낙상 차단 실물 검증 통과, (4) 풀 시나리오 1차 통과(시나리오 레벨 A/B/C 판정 완료). 미통과 항목이 있으면 Week 9 안정화에서 집중 보완한다.",
    steps: [
      "상하체 결합 확인: 퀵릴리즈 체결 상태 + 분리/조립 10분 이내",
      "실체 보행 확인: 직립 유지 + 전진 3보 이상 + 정지 명령 정상",
      "MOSFET 차단 확인: 낙상 감지→차단→안전 주저앉음 시퀀스 정상",
      "풀 시나리오 1차 통과 확인: 시나리오 레벨 A/B/C 판정 결과 기록",
      "미통과 항목별 보완 계획 수립 + Week 9 안정화 우선순위 결정",
    ],
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
    summary: "Week 9부터 개인별 분업이 아니라 전원이 같은 공간에서 함께 작업한다(올핸즈). 풀 시나리오를 반복 실행하며 실패 시 즉시 원인을 분류(HW/SW/네트워크/보행/조작)하고 담당자가 현장에서 수정한다. 5분 연속 보행과 보행+대화 동시 수행을 목표로 하며, 교수님 피드백을 받아 delta3이 현장에서 즉시 재튜닝(보행 파라미터/감정 표현 등)을 반영한다.",
    steps: [
      "풀 시나리오(시선→인사→FETCH→자유보행) 반복 실행 — 최소 5회",
      "실패 시 즉시 원인 분류: HW(결합부/관절) / SW(상태머신/SmolVLA) / 네트워크(Groq) / 보행(policy) / 조작(pick 실패)",
      "원인별 담당자 즉시 수정: delta1(HW), epsilon1(SW), delta2(보행), delta3(policy 재튜닝)",
      "5분 연속 보행 도전 — 낙상 없이 직진+회전+정지 반복",
      "보행+대화 동시 테스트 — WALKING 상태에서 Groq STT/LLM/TTS 정상 동작 확인",
      "교수님 피드백 수렴 → delta3 현장 재튜닝(DGX 원격 또는 파라미터 미세조정)",
      "안정화 결과를 바탕으로 답사/리허설 1차 진입 판단",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc"],
    estimatedHours: 20,
  },

  w9_site_survey: {
    summary: "전원이 발표 장소에 방문하여 시연 환경을 실측하는 답사. 핵심 체크 3가지: (1) 5GHz 핫스팟 latency가 500ms 이내인지 — 초과 시 서바이벌 모드로 전환해야 하므로 Groq 라운드트립을 현장에서 직접 측정, (2) 바닥 마찰이 학습 환경과 다른지 — 달라질 경우 delta3이 policy 마찰 파라미터를 현장 보정, (3) 로봇 분리 운반→현장 10분 조립이 가능한지 — 퀵릴리즈 결합+전원 시퀀싱+캘리브를 10분 내에 완료하는 리허설.",
    steps: [
      "5GHz 핫스팟 latency 측정: Groq STT→LLM→TTS 라운드트립 500ms 이내 확인 — epsilon1 (초과 시 서바이벌 모드 전환 계획)",
      "바닥 재질 마찰 확인: 현장 바닥에서 보행 테스트 → 미끄러짐 발생 시 delta3 policy 마찰 보정 — delta2",
      "MediaPipe 조명 테스트: 현장 조명에서 얼굴 감지 정상 동작 확인 — epsilon2",
      "전원 콘센트 위치 확인: 충전/대기 위치 결정 — delta2",
      "로봇 분리 운반 → 현장 조립 10분 이내 리허설: 퀵릴리즈 결합+전원 시퀀싱+BHL 캘리브 — delta1",
      "시연 레이아웃 마커 배치: 관객 위치↔로봇 홈(~1.5m)↔물체 테이블(~1.5m) 고정 — epsilon1",
      "FETCH 타이머 T1/T2 현장 보정: 실제 보행 속도+현장 거리에 맞춰 재튜닝 — epsilon1",
      "현장 보행 테스트: 바닥 마찰 반영된 상태에서 직진+회전+정지 확인 — delta2",
      "외장 상태 확인: 운송 중 파손 여부 (머리 돌출부, 바디 커버 모서리) — delta1+epsilon2",
    ],
    resources: [
      { label: "기획서 3절 (시연 환경 레이아웃)", type: "internal", section: "3" },
      { label: "기획서 5.4절 (네트워크)", type: "internal", section: "5.4" },
      { label: "기획서 7.11절 (운송)", type: "internal", section: "7.11" },
    ],
    components: [],
    estimatedHours: 4,
  },

  w9_rehearsal_1: {
    summary: "발표 조건과 동일한 환경에서 실시하는 리허설 1차. 전원이 역할별 포지션(delta1: 조립/물리안전, delta2: 전원/보행/비상매뉴얼, delta3: 현장보정/재튜닝, epsilon1: 시스템기동/시나리오진행, epsilon2: 캐릭터확인/기록)에서 시나리오 전체를 실행한다. 네트워크 차단 시 서바이벌 모드 전환, 비상정지 동작, 10보 직진+회전, 5분 낙상 없음을 모두 검증해야 한다.",
    steps: [
      "역할별 포지션 배치 (비상 매뉴얼에 따라 각자 담당 위치)",
      "시나리오 전체 흐름 실행: 시선→인사→대화→FETCH(걸어가서 집고 돌아와서 전달)→자유보행",
      "실패 구간 발생 시 즉시 중단 → 원인 분류(HW/SW/네트워크/보행/조작) → 현장 수정 → 재실행",
      "시나리오 레벨 판정: A(FETCH+10보+) / B(제자리 pick-place+별도 보행) / C(받침대 고정+제자리)",
      "서바이벌 모드 전환 테스트: 의도적 네트워크 차단 → 계층 1(스크립트 시연) → 계층 2(오프라인 자율)",
      "비상정지 테스트: 비상정지 버튼 → B+C 차단 → 안전 주저앉음 → 복구 시퀀싱",
      "보행 성능: 10보 직진 + 180도 회전 + 정지",
      "안정성: 5분 연속 동작 중 낙상 없음 확인",
      "epsilon2: 전체 과정 영상 기록 + 리허설 결과 리포트 작성",
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
    summary: "발표 당일 장소에서 실시하는 리허설 2차+. 전체 시나리오를 최소 2회 반복 실행하여 재현성을 확인하고, 비상 시나리오 전환(A→B, A→C)이 실제로 원활히 이루어지는지 검증한다. epsilon1이 시나리오 B/C 전환 판단을 실시간으로 수행하며, 전원이 Week 9 리허설 1차 피드백을 반영한 최종 상태로 임한다. 이 리허설을 통과해야 발표에 진입한다.",
    steps: [
      "발표 장소에서 로봇 조립 (delta1, 10분 이내) + 전원 시퀀싱 (delta2)",
      "시나리오 전체 흐름 1회차 실행 — 성공/실패 기록",
      "시나리오 전체 흐름 2회차 실행 — 1회차 대비 개선 여부 확인",
      "비상 시나리오 전환 테스트: A→B (보행 실패 시 제자리 pick-place)",
      "비상 시나리오 전환 테스트: A→C (보행 전체 실패 시 받침대 고정)",
      "최종 시나리오 레벨 확정 (epsilon1 판단)",
      "발표 직전 외장 최종 점검 + 배터리 충전 상태 확인",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
    ],
    components: ["orin_nano_super", "nuc", "esp32"],
    estimatedHours: 6,
  },

  w10_final_presentation: {
    summary: "최종 발표. 최종 필수 조건(시나리오 C 이상)을 충족해야 한다: (1) 시선 추적+인사+대화+집기 동작 정상, (2) MOSFET 낙상 차단 정상, (3) 비상정지 정상, (4) 리허설 2회+ 완료. 역할별 포지션은 Week 9과 동일하며, epsilon1이 현장에서 시나리오 레벨(A/B/C)을 실시간 판단하여 필요 시 B/C로 전환한다. 전원 개인 작업 없이 발표에만 집중한다.",
    steps: [
      "발표 30분 전: 로봇 조립(delta1) + 전원 투입(delta2) + 시스템 기동(epsilon1) + 외장 점검(epsilon2)",
      "발표 직전: 배터리 SOC 확인 + 네트워크 latency 확인 + 서바이벌 모드 대기 상태 확인",
      "발표 실행: 확정된 시나리오 레벨(A/B/C)에 따라 시연",
      "비상 상황 시: epsilon1이 시나리오 전환 판단, delta2가 비상 매뉴얼 집행",
      "발표 종료: 안전 자세 전환 → 전원 차단(C→B→A) → 로봇 분리 보관",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오)", type: "internal", section: "3" },
      { label: "기획서 10절 (최종 필수)", type: "internal", section: "10" },
    ],
    components: ["orin_nano_super", "nuc", "esp32", "xl430", "camera_usb", "neopixel_led", "speaker", "microphone"],
    estimatedHours: 4,
  },

  w10_scenario_level_a: {
    summary: "시나리오 레벨 A (풀 시나리오) 판정 기준. 시연 흐름 1~4 전체를 수행한다: 시선 추적→인사→대화→FETCH 시퀀스(걸어가서 집고 돌아와서 전달)→자유 보행+대화. 보행은 10보 이상이어야 하며, FETCH 시퀀스(WALKING→pick→WALKING→handover)가 최소 1회 성공해야 한다. 레벨 A 달성은 보행+fetch 시퀀스 모두 성공을 의미하며, 프로젝트의 최고 목표이다.",
    steps: [
      "판정 조건 1: FETCH 시퀀스 1회 이상 성공 (걸어서 테이블→pick→복귀→handover)",
      "판정 조건 2: 보행 10보 이상 (직진+회전 포함)",
      "판정 조건 3: 시선 추적+인사+대화 정상 동작",
      "판정 조건 4: 자유 보행 중 대화 가능",
      "미달 시: 레벨 B로 전환 (epsilon1 판단)",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 A)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_scenario_level_b: {
    summary: "시나리오 레벨 B (보행 미달 시 대안) 판정 기준. 시연 흐름 1~3만 수행하되 보행을 제외한다: 시선 추적→인사→대화→제자리 pick-place(물체를 팔 닿는 테이블 위에 배치). 보행은 별도로 짧게 시연(제자리 걸음 또는 수 보 전진)하여 보행 능력은 있되 FETCH 연계는 안정적이지 않음을 보여준다. 레벨 A에서 보행 연계 실패 시 epsilon1이 실시간으로 B로 전환한다.",
    steps: [
      "레이아웃 변경: 물체 테이블을 로봇 팔 닿는 거리로 이동",
      "시연 흐름 1~3 실행: 시선→인사→대화→제자리 SmolVLA pick→handover",
      "별도 보행 시연: 제자리 걸음 또는 전진 3~5보 (FETCH와 분리)",
      "전환 판단: 레벨 A 시도 중 보행 실패 → epsilon1이 레이아웃 변경 지시 → B 진입",
      "레벨 B에서도 시선 추적+인사+대화+집기가 정상이어야 함",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 B)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_scenario_level_c: {
    summary: "시나리오 레벨 C (보행 전체 실패 시 최소 시연) 판정 기준. 로봇을 받침대에 고정하여 보행 없이 시연한다: 시선 추적→인사→대화→제자리 pick-place. 보행 기능을 완전히 포기하는 대신 상체 기능(시선/인사/대화/조작/감정표현)의 완성도를 극대화한다. 이것이 최종 필수 조건(시나리오 C 이상)의 최소 기준이며, 이 레벨조차 달성하지 못하면 발표 조건 미충족이다.",
    steps: [
      "받침대 준비: BHL 다리를 고정할 수 있는 받침대/지그 마련",
      "로봇 받침대 고정 + 전원 시퀀싱 (C 배터리 투입 불필요할 수 있음)",
      "시연 흐름 1~3 실행: 시선→인사→대화→제자리 SmolVLA pick→handover",
      "상체 기능 완성도 극대화: 감정 5종, lip sync, 시선 추적 자연스러움",
      "최종 필수 조건 확인: 시선+인사+대화+집기+MOSFET 정상+비상정지 정상",
    ],
    resources: [
      { label: "기획서 3절 (시연 시나리오 레벨 C)", type: "internal", section: "3" },
    ],
    components: [],
    estimatedHours: 2,
  },

  w10_bonus_walk_talk: {
    summary: "최종 선택(보너스) 목표. 레벨 A 달성 이후 도전하는 상위 목표 2가지: (1) 보행+대화 동시 수행 — WALKING 상태에서 Groq STT/LLM/TTS가 정상 동작하며 관객과 대화하면서 걷기, (2) 30분 연속 보행 — 배터리 C SOC 모니터링하며 30분간 낙상 없이 보행 유지. 두 목표 모두 레벨 A가 안정적으로 통과된 후에만 시도한다.",
    steps: [
      "보행+대화 동시: WALKING 상태에서 Groq 라운드트립 정상 확인",
      "보행+대화 동시: 관객 질문에 TTS로 응답하면서 직진+회전 동시 수행",
      "30분 보행: 배터리 C SOC 모니터링 시작 (초기 100%→30분 후 SOC 기록)",
      "30분 보행: 5분 간격 상태 체크 (직립/보행/관절 온도/NUC 안정성)",
      "30분 보행 중 낙상 발생 시 즉시 중단 + 원인 기록",
    ],
    resources: [
      { label: "기획서 10절 (최종 선택)", type: "internal", section: "10" },
    ],
    components: [],
    estimatedHours: 4,
  },
};
