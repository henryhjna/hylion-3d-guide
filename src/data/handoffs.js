// handoffs.js — 기획서 6.2절 협업 구조 + 실행가이드 기반 인수인계/전달 항목
// 모든 협업 화살표를 techTree 노드 ID에 매핑

export const HANDOFFS = {
  // ─── δ1 → δ3: 에피소드 원본 ─────────────────────────────────────────
  "w2_episode_collect_30 -> w2_mini_finetune": {
    what: "에피소드 원본 데이터 (30개, 물체당 10개)",
    format: "LeRobot 데이터 포맷 (.hdf5 / .parquet + 메타데이터 JSON)",
    location: "공유 드라이브 또는 DGX 접근 가능한 스토리지",
    deadline: "Week 2 말",
    verification: "delta3이 DGX에서 데이터 로드 + 미니 파인튜닝 실행 성공 확인",
    from: "delta1",
    to: "delta3",
  },
  "w3_collect_570 -> w3_smolvla_stage2": {
    what: "에피소드 원본 데이터 (누적 600개, 시연 조건 60%+ 포함)",
    format: "LeRobot 데이터 포맷 (.hdf5 / .parquet + 변형 조건 메타데이터)",
    location: "공유 드라이브 → DGX 전송",
    deadline: "Week 3 수집 완료 즉시",
    verification: "delta3이 600개 전체 데이터셋 로드 + Stage 2 학습 시작 확인",
    from: "delta1",
    to: "delta3",
  },

  // ─── δ1 → δ2: 액추에이터 조립 노트 ──────────────────────────────────
  "w1_actuator_trial_assembly -> w4_actuator_10_assembly": {
    what: "BHL 액추에이터 조립 기준서 (나사 토크, 그리스, 조립 순서, 주의사항)",
    format: "문서 (Markdown/PDF) + 조립 사진",
    location: "공유 드라이브 (Notion 또는 Google Drive)",
    deadline: "Week 1 말",
    verification: "delta2가 기준서 기반으로 액추에이터 3개 독립 조립 성공",
    from: "delta1",
    to: "delta2",
  },

  // ─── ε1 → δ3: ablation 설계 ──────────────────────────────────────────
  "w3_gpu_profiling -> w4_smolvla_ablation": {
    what: "ablation 실험 설계서 (학습 요청 조합: 데이터 비율, lr, batch, augmentation 등)",
    format: "실험 조합표 (스프레드시트 또는 YAML config 파일들)",
    location: "공유 드라이브 또는 Git 리포지토리",
    deadline: "Week 3 말",
    verification: "delta3이 모든 조합의 학습 config를 DGX에서 실행 가능 확인",
    from: "epsilon1",
    to: "delta3",
  },

  // ─── ε2 → ε1: 키워드 사전 ────────────────────────────────────────────
  "w5_survival_keywords -> w5_survival_engine": {
    what: "서바이벌 키워드 사전 (동의어 매핑 + 사전 Q&A 30개)",
    format: "JSON 파일 ({\"컵\": \"starbucks_cup\", \"빨간거\": \"starbucks_cup\", ...} + Q&A 목록)",
    location: "Git 리포지토리 (src/data/ 또는 config/)",
    deadline: "Week 5 중반 (서바이벌 엔진 완성 전)",
    verification: "epsilon1이 키워드 사전을 서바이벌 엔진에 로드하여 매칭 테스트 통과",
    from: "epsilon2",
    to: "epsilon1",
  },

  // ─── δ2 → 전원: 비상 매뉴얼 ──────────────────────────────────────────
  "w7_emergency_manual -> w9_rehearsal_1": {
    what: "비상 매뉴얼 (전원 시퀀싱, 비상정지 절차, 낙상 차단 동작, 재시작 절차)",
    format: "문서 (인쇄용 PDF + 빠른 참조 1장 요약)",
    location: "공유 드라이브 + 현장 인쇄본",
    deadline: "Week 7 말",
    verification: "전원 모두 비상 매뉴얼 숙지 + Week 9 리허설에서 비상 절차 실행 확인",
    from: "delta2",
    to: "all",
  },

  // ─── δ3 → ε1: 시나리오 B/C 설계 ─────────────────────────────────────
  "w5_scenario_bc_design -> w7_survival_scenario_final": {
    what: "시나리오 B/C 설계 (보행 실패 시 대안 시나리오 구조 + 전환 조건)",
    format: "문서 (시나리오 흐름도 + 전환 조건 표)",
    location: "공유 드라이브",
    deadline: "Week 5 (설계), Week 7 (최종 확정 후 epsilon1에 전달)",
    verification: "epsilon1이 오케스트레이터에 시나리오 B/C 전환 로직을 구현하여 테스트 통과",
    from: "delta3",
    to: "epsilon1",
  },

  // ─── δ3 → ε1: 학습 완료 모델 ─────────────────────────────────────────
  "w5_smolvla_best_combo -> w7_smolvla_v2_data": {
    what: "SmolVLA 최종 모델 체크포인트 (ablation 최적 조합)",
    format: "PyTorch 체크포인트 파일 (.pt / .safetensors)",
    location: "DGX → 공유 스토리지 (epsilon1 접근 가능)",
    deadline: "Week 5 말 (Stage 1 기반) + Week 7 (v2 최종)",
    verification: "epsilon1이 LeRobot PyTorch Orin 배포 + 추론 실행 + 정합성 검증",
    from: "delta3",
    to: "epsilon1",
  },
  "w7_smolvla_v2_dgx -> w7_smolvla_v2_data": {
    what: "SmolVLA v2 학습 완료 모델 체크포인트",
    format: "PyTorch 체크포인트 파일 (.pt / .safetensors)",
    location: "DGX → 공유 스토리지",
    deadline: "Week 7 중반",
    verification: "epsilon1이 LeRobot v2 Orin 배포 + 실물 pick 테스트 통과",
    from: "delta3",
    to: "epsilon1",
  },

  // ─── δ3 → ε1, ε2: 학습 결과 ──────────────────────────────────────────
  "w4_smolvla_ablation -> w4_ablation_interpret": {
    what: "SmolVLA ablation 학습 결과 (조합별 loss 커브, 성공률, 실패 유형)",
    format: "실험 로그 (WandB / TensorBoard) + 요약 스프레드시트",
    location: "WandB 대시보드 + 공유 드라이브",
    deadline: "Week 4 (각 조합 학습 완료 즉시)",
    verification: "epsilon1이 ablation 결과를 해석하여 최적 조합 방향 도출",
    from: "delta3",
    to: "epsilon1",
  },
  "w4_smolvla_ablation -> w4_smolvla_v1_eval": {
    what: "SmolVLA 학습 결과 (모델 체크포인트 + 학습 메트릭)",
    format: "모델 파일 + 학습 로그",
    location: "DGX → 공유 스토리지",
    deadline: "Week 4",
    verification: "epsilon2가 실물 평가 리포트 작성 (물체별 성공률, 실패 유형 분류)",
    from: "delta3",
    to: "epsilon2",
  },

  // ─── ε2 → δ3: 분석 결과 (sim-to-real) ────────────────────────────────
  "w6_gap_analysis -> w7_urdf_measurement_update": {
    what: "지면 보행 gap 분석 결과 + 재학습 권고사항",
    format: "분석 리포트 (궤적 비교 그래프, gap 수치, 재학습 파라미터 제안)",
    location: "공유 드라이브",
    deadline: "Week 6 말",
    verification: "delta3이 분석 결과 기반으로 URDF 업데이트 + 재학습 트리거 실행",
    from: "epsilon2",
    to: "delta3",
  },

  // ─── ε2 → δ2: 분석 결과 (현장 튜닝) ──────────────────────────────────
  "w5_aerial_sim_compare -> w7_relearn_test": {
    what: "공중 보행 로그 vs 시뮬 비교 분석 결과 + sim-to-real gap 리포트",
    format: "분석 리포트 (궤적 비교, 관절 토크 비교, 권고사항)",
    location: "공유 드라이브",
    deadline: "Week 5 말 ~ Week 7",
    verification: "delta2가 분석 결과 기반으로 현장 파라미터 조정 후 보행 개선 확인",
    from: "epsilon2",
    to: "delta2",
  },

  // ─── δ2 → ε2: 실물 보행 로그 ─────────────────────────────────────────
  "w6_ground_gait_first -> w6_gap_analysis": {
    what: "실물 보행 로그 (관절 위치/토크/IMU 시계열 데이터)",
    format: "CSV 로그",
    location: "NUC 로컬 → 공유 드라이브 전송",
    deadline: "Week 6 (지면 보행 직후)",
    verification: "epsilon2가 로그 파싱 + 시뮬 궤적과 비교 분석 수행 가능 확인",
    from: "delta2",
    to: "epsilon2",
  },

  // ─── δ1 → δ2: 상체 실측 무게 ─────────────────────────────────────────
  "w7_upper_measurement -> w6_dummy_weight": {
    what: "상반신 정밀 계측 데이터 (질량 +-10g, CoM, 관성 텐서)",
    format: "측정 시트 (스프레드시트: 부품별 질량, CoM 좌표, 관성 텐서)",
    location: "공유 드라이브",
    deadline: "Week 7 초 (더미 웨이트 업데이트용)",
    verification: "delta2가 더미 웨이트를 실측값으로 업데이트 + 보행 재테스트 안정 확인",
    from: "delta1",
    to: "delta2",
  },

  // ─── ε2 → δ1: IsaacLab 검증 → CAD 수정 ──────────────────────────────
  "w1_fall_detection_impl -> w1_torso_cad": {
    what: "IsaacLab 검증 결과 (상부 mass 분포가 CAD에 미치는 영향 분석)",
    format: "검증 리포트 (CoM 위치, 전도 마진 등)",
    location: "공유 드라이브",
    deadline: "Week 1 중반 (토르소 CAD 확정 전)",
    verification: "delta1이 피드백 반영하여 CAD 수정 (배터리 위치, 부품 배치 등)",
    from: "epsilon2",
    to: "delta1",
  },

  // ─── ε2 → δ3: IsaacLab 검증 → URDF 조정 ─────────────────────────────
  "w2_imu_structure -> w2_standing_checkpoint": {
    what: "IsaacLab 검증 루프 결과 (DR 범위 적절성, URDF 파라미터 조정 필요 항목)",
    format: "검증 리포트 (파라미터별 민감도, 조정 제안값)",
    location: "공유 드라이브",
    deadline: "Week 2 (직립 체크포인트 전)",
    verification: "delta3이 URDF 파라미터 조정 후 직립 테스트 재실행 → 안정성 개선 확인",
    from: "epsilon2",
    to: "delta3",
  },

  // ─── δ1 ↔ ε2: 머리/외장 공동 ─────────────────────────────────────────
  "w0_head_spec_discuss -> w1_head_order": {
    what: "머리 외주 사양 (delta1: 내부 치수/전자부품 공간, epsilon2: 외형 디자인/STL)",
    format: "사양서 (PDF/문서) + 3D 모델 (STL/Blender 파일)",
    location: "공유 드라이브",
    deadline: "Week 0~1 (외주 발주 전)",
    verification: "외주 업체가 사양서 접수 + 제작 가능 확인 + 납기 Week 5~6 합의",
    from: "delta1",
    to: "epsilon2",
    resources: [
      { label: "기획서 7.3절 (머리 제작)", url: "" },
    ],
  },
  "w4_head_surface_finish -> w7_head_electronics_integrate": {
    what: "머리 외장 마감 완료품 (delta1 도장) + 바디 천 커버 (epsilon2 봉제)",
    format: "물리 결과물 (도장 완료 머리 + 천 커버)",
    location: "랩 현장 대면 전달",
    deadline: "Week 4~5 (머리 마감), Week 5 (바디 커버)",
    verification: "delta1이 머리 전자부품 통합 8단계 진행 가능 상태 확인",
    from: "delta1",
    to: "epsilon2",
  },

  // ─── δ3 → δ2: Walking RL 최종본 전달 ─────────────────────────────────
  "w7_walking_rl_final -> w7_relearn_test": {
    what: "Walking RL 최종 policy 모델 (NUC 실행용)",
    format: "C/ONNX policy 파일 (NUC BHL lowlevel 호환 포맷)",
    location: "공유 드라이브 → NUC 로컬 배포",
    deadline: "Week 7 중반",
    verification: "delta2가 NUC에 배포 후 더미 웨이트 장착 지면 보행 안정 확인",
    from: "delta3",
    to: "delta2",
  },

  // ─── δ1 → δ3: 상체 실측 → URDF 업데이트 ──────────────────────────────
  "w7_upper_measurement -> w7_urdf_measurement_update": {
    what: "상반신 정밀 계측 데이터 (URDF 반영용 질량/CoM/관성 텐서)",
    format: "측정 시트 (URDF 태그 형식으로 변환 가능한 수치)",
    location: "공유 드라이브",
    deadline: "Week 7 초",
    verification: "delta3이 URDF 업데이트 → Walking RL 재학습 트리거 → 시뮬 직립 확인",
    from: "delta1",
    to: "delta3",
  },

  // ─── w8 풀 시나리오 보행 로그 → ε2 분석 ──────────────────────────────
  "w8_full_scenario_v1 -> w9_stabilization": {
    what: "풀 시나리오 보행 로그 + 캐릭터 표현 피드백",
    format: "CSV 로그 + 영상 기록 + 실패 분류 시트",
    location: "공유 드라이브",
    deadline: "Week 8 말",
    verification: "epsilon2가 보행 로그 분석 + 캐릭터 최종 조정 반영",
    from: "delta2",
    to: "epsilon2",
  },
};
