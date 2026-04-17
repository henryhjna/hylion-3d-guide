// HYlion Physical AI — 팀 구성
// 정체성/역할의 큰 틀은 유지. 최종발표(2026-06-01) 6주 카운트다운 시점의 담당 분담을 W-6 컬럼에 명시.
// 이 시점 분담:
//   - 인혁 + 승민(보조): torso + mouth HW (W-6 ~ W-5 +arm 통합까지 인혁 보조)
//   - 희승: BHL Walking RL 학습 → W-4부터 다리 통합/실체 보행 합류
//   - 성래: 오케스트레이터 단독 (FSM scaffold → 단계별 상태 추가)
//   - 상윤: SmolVLA 학습 (수집·평가에서 학습까지 확장) + lip sync + 외장

export const TEAM = {
  delta1: {
    id: 'delta1',
    name: '인혁',
    role: '하드웨어·외장 오너',
    trackLead: 'Track A 리드',
    color: '#00f0ff',
    colorBright: '#66f7ff',
    parts: ['torso', 'mouth', 'left_arm', 'right_arm', 'head'],
    responsibilities: [
      '토르소 11단계 조립',
      'mouth HW (입 서보 + 마운트)',
      'SO-ARM 2팔 조립·캘리브레이션',
      '머리 외주 통합 + 상하체 결합',
      '외장 마감 + 운송 분해/재조립',
    ],
    currentFocus: 'W-6: 토르소 + mouth HW 완성',
  },
  delta2: {
    id: 'delta2',
    name: '승민',
    role: '보행 시스템 오너',
    trackLead: 'Track B 리드 (W-4 복귀)',
    color: '#ff00aa',
    colorBright: '#ff66cc',
    parts: ['torso', 'left_leg', 'right_leg'],
    responsibilities: [
      'W-6~W-5: 인혁 보조 (상체 HW)',
      'W-4~: BHL 다리 조립 + NUC↔CAN + 전원 + 비상정지 복귀',
      '낙상 감지 BNO085 벤치',
      '비상 매뉴얼 작성',
    ],
    currentFocus: 'W-6: 인혁 보조 (토르소 조립)',
  },
  delta3: {
    id: 'delta3',
    name: '희승',
    role: 'AI 인프라 오너 — BHL 훈련 전담',
    trackLead: 'Track B 리드',
    color: '#c8ff00',
    colorBright: '#e0ff66',
    parts: ['left_leg', 'right_leg'],
    responsibilities: [
      'BHL Walking RL 학습 (HOVER reward, AMASS retargeting)',
      'IsaacLab 환경 + DR 튜닝',
      'W-4: BHL 다리 조립 + 공중지그 보행',
      'W-3~: 실체 mass 재학습 + sim2real 보정',
    ],
    currentFocus: 'W-6: BHL Walking RL 학습 계속',
  },
  epsilon1: {
    id: 'epsilon1',
    name: '성래',
    role: '오케스트레이터·통합 오너',
    trackLead: 'Track A 리드',
    color: '#4466ff',
    colorBright: '#7799ff',
    parts: ['torso', 'mouth', 'left_arm', 'right_arm'],
    responsibilities: [
      'Python asyncio FSM 오케스트레이터',
      'IDLE/TALKING(W-6) → MANIPULATING(W-5) → WALKING/FETCH(W-4) 단계별 구현',
      'mouth 입 서보 PWM 제어',
      '대화 파이프라인 (STT/LLM/TTS) + 서바이벌 모드',
      'LeRobot ServoControl + UDP NUC 연동',
    ],
    currentFocus: 'W-6: 오케스트레이터 골격 + IDLE/TALKING + mouth PWM',
  },
  epsilon2: {
    id: 'epsilon2',
    name: '상윤',
    role: 'SmolVLA·캐릭터·검증 오너',
    trackLead: 'A+B',
    color: '#00ff88',
    colorBright: '#66ffaa',
    parts: ['head', 'left_arm', 'right_arm'],
    responsibilities: [
      'SmolVLA 학습 (Stage 1 → Stage 2 → v2)',
      'LeRobot Orin 환경 + 평가 스크립트',
      '2팔 수집 (W-5)',
      'lip sync + 감정 표현 + 키워드 사전',
      '외장 + sim2real gap 분석',
    ],
    currentFocus: 'W-6: SmolVLA Stage 1 학습 착수 (1팔 수집 데이터)',
  },
};
