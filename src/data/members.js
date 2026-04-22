// HYlion Physical AI — 멤버별 6주 카운트다운 태스크 맵
// 2026-04-17 기준 진척 반영. weeklyTasks 키: 'W-6'~'W-1', 'final'.
// identity는 유지, W-6 시점 담당 = 인혁+승민(상체 HW), 희승(BHL RL), 성래(오케스트레이터), 상윤(SmolVLA 학습)

export const MEMBERS = {
  delta1: {
    name: '인혁',
    identity: '하드웨어·외장 오너 — 상체 HW 리드',
    track: 'A (리드)',
    color: '#00f0ff',
    parts: ['torso', 'mouth', 'left_arm', 'right_arm', 'head'],
    weeklyTasks: {
      'W-6': {
        focus: '토르소 + mouth HW 완성 (W-6 게이트)',
        tasks: [
          '토르소 조립 (프레임·배터리·DC-DC·NUC·Orin·USB Hub·환기·어깨 마운트·이더넷)',
          'mouth HW 조립 (입 서보 + 마운트)',
          '입 힌지 PWM 배선 (Jetson GPIO 5V)',
        ],
        dependencies: {
          receives: ['승민: 조립 보조'],
          gives: ['성래: mouth PWM 인터페이스'],
        },
      },
      'W-5': {
        focus: 'SO-ARM 양팔 조립 + 무게 적산 + 카메라 calib',
        tasks: [
          'SO-ARM 2팔 조립 (STS3215 ×6, BusLinker #2)',
          '토르소 양팔 어깨 마운트 + 캘리브레이션',
          '양팔 텔레옵 동시 동작 검증',
          '상체 무게 적산 (양팔 조립 직후) → 승민/희승 전달',
          '카메라 calibration (intrinsic, 상윤과 — 손목×2 + 외부)',
          'NUC RT 커널 + CAN 드라이버 셋업 (승민과)',
        ],
        dependencies: {
          receives: ['승민: 조립 보조 + RT 커널 작업'],
          gives: ['상윤: 양팔 수집 환경 + 카메라 calib', '성래: LeRobot ServoControl 양팔 제어', '승민/희승: 상체 무게 적산값'],
        },
      },
      'W-4': {
        focus: '상체 외장/마감',
        tasks: [
          '바디 천커버 제작 (벨크로 + 환기 메쉬)',
          '서피서 + 도장 (외주 미도착 시 플랜B)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-3': {
        focus: '머리 통합 + 상하체 결합 (실내 sim2real 게이트)',
        tasks: [
          '머리 외주 수령 → 전자부품 통합 (카메라 + 입서보 + 배선)',
          '상하체 결합 (퀵릴리즈)',
        ],
        dependencies: {
          receives: ['희승+승민: 다리 완성', '상윤: 머리 외장 마감'],
          gives: ['성래: 풀 시나리오 진행 가능 (전체 결합)', '희승: 실체 mass'],
        },
      },
      'W-2': {
        focus: '운송 분해/재조립',
        tasks: [
          '운송 분해/재조립',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '드레스 리허설 — 현장 조립/외장 담당',
        tasks: [
          '공연장 현장 조립/분해',
          '리허설 물리 안전 담당',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — 현장 조립, 물리 안전, 외장',
        tasks: [
          '현장 조립',
          '물리 안전 모니터',
          '외장 담당',
        ],
        dependencies: { receives: [], gives: [] },
      },
    },
  },

  delta2: {
    name: '승민',
    identity: '보행 시스템 오너 — W-6~W-5 인혁 보조, W-4부터 하체 복귀',
    track: 'B (W-4 복귀)',
    color: '#ff00aa',
    parts: ['torso', 'left_leg', 'right_leg'],
    weeklyTasks: {
      'W-6': {
        focus: '인혁 보조 — 토르소 조립 동시 진행',
        tasks: [
          '토르소 조립 보조 (인혁과)',
          'mouth 마운트 보조',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-5': {
        focus: '인혁 보조 — 2팔 조립 + RT 커널 + 무게 시뮬 반영',
        tasks: [
          'SO-ARM 2팔 조립 보조 (인혁과)',
          '손목 카메라 USB 배선',
          'NUC RT 커널 + CAN 드라이버 셋업 (인혁과, 메인)',
          '상체 무게 적산값 받아서 시뮬 반영 (희승과)',
        ],
        dependencies: {
          receives: ['인혁: 상체 무게 적산값'],
          gives: ['희승: 시뮬 반영용 적산값'],
        },
      },
      'W-4': {
        focus: '하체 복귀 — BHL 다리 조립 + 전원/안전 + 공연장 일정',
        tasks: [
          'BHL 다리 조립 (희승과)',
          '전원 회로 (배터리 1+2, DC-DC, 비상정지)',
          'NUC↔CAN 연결',
          '낙상 감지 IM10A 벤치 테스트 (USB 직결)',
          '공연장 예약/답사 일정 확정 (희승 도움)',
        ],
        dependencies: {
          receives: ['희승: 다리 RL 학습 결과 + 다리 부품'],
          gives: ['희승: 다리 HW 완성', '성래: NUC UDP 서버 동작', '전원: 공연장 답사 일정'],
        },
      },
      'W-3': {
        focus: '실체 mass 보행 + URDF 업데이트',
        tasks: [
          '실체 mass 보행 테스트 (희승과)',
          'URDF 실측 업데이트',
        ],
        dependencies: {
          receives: ['인혁: 상하체 결합 완료'],
          gives: ['희승: 실측 URDF → 재학습'],
        },
      },
      'W-2': {
        focus: '비상 매뉴얼 + 공연장 답사',
        tasks: [
          '비상 매뉴얼 초안 (전원·비상정지·낙상·재시작)',
          '공연장 답사 — 전원, 바닥 마찰',
        ],
        dependencies: { receives: [], gives: ['희승: 바닥 마찰 데이터'] },
      },
      'W-1': {
        focus: '비상 매뉴얼 최종화 + 안전 검증',
        tasks: [
          '비상 매뉴얼 최종화',
          '낙상감지/비상정지 실측 검증',
          '리허설 전원/안전 담당',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — 전원, 보행, 비상 매뉴얼',
        tasks: [
          '전원 투입/차단',
          '보행 모니터',
          '비상 매뉴얼 집행',
        ],
        dependencies: { receives: [], gives: [] },
      },
    },
  },

  delta3: {
    name: '희승',
    identity: 'AI 인프라 오너 — BHL Walking RL 전담 + W-6/W-5 HW 합류',
    track: 'B (리드)',
    color: '#c8ff00',
    parts: ['left_leg', 'right_leg', 'torso'],
    weeklyTasks: {
      'W-6': {
        focus: 'Walking RL 자동 학습 + 토르소/mouth HW 합류 (인혁·승민과)',
        tasks: [
          'Walking RL 학습 자동 스케줄 (HOVER reward 튜닝 — DGX 야간 슬롯, 오토)',
          'AMASS retargeting 안정화',
          'IsaacLab 도메인 랜덤화 ±20%',
          '⭐ 토르소 조립 참여 (인혁·승민과) — 프레임·배터리 슬롯·DC-DC·USB Hub',
          'BHL 다리 3D 프린트 진척 체크 + 기어박스 후가공 사전 준비 (리밍, 히트인서트)',
          'BHL 공식 액추에이터 조립 영상 선학습 (YouTube CHPVXL-SsSo) → W-5 조립 주도 대비',
        ],
        dependencies: {
          receives: ['인혁: 토르소 조립 순서 (리드)'],
          gives: ['인혁·승민: HW 조립 공수 보강'],
        },
      },
      'W-5': {
        focus: 'Walking RL 학습 + SO-ARM 조립 보조 + BHL 다리 조립 시작 + 무게 시뮬 반영 + 백업 절차',
        tasks: [
          'Walking RL 학습 계속 (야간 오토)',
          '⭐ SO-ARM 양팔 조립 보조 (인혁·승민과) — 오전 슬롯',
          'BHL 다리 조립 시작 (모터 도착 시, 액추에이터 12개 본격 조립 — 오후 슬롯)',
          '기어박스 후가공 (리밍, 베어링 시트, 히트인서트)',
          'ESC 펌웨어 선 플래싱 (B-G431B-ESC1 ×12, STM32CubeIDE, CAN ID 1~12)',
          '상체 무게 적산값 시뮬 반영 (승민과, IsaacLab URDF 업데이트)',
          '데이터/모델 백업 절차 정의 (Walking RL 체크포인트, 상윤+성래에게 디테일 공유)',
        ],
        dependencies: {
          receives: ['모터 입고', '인혁: 상체 무게 적산값'],
          gives: ['인혁·승민: SO-ARM 조립 공수 보강', '상윤+성래: 백업 디테일 (체크포인트 포맷)'],
        },
      },
      'W-4': {
        focus: 'BHL 다리 완성 + 공중지그 보행 + 답사 일정',
        tasks: [
          'BHL 다리 완성',
          '공중 지그 보행 테스트',
          'Walking RL ONNX 배포 (NUC, MLP policy 25Hz + CAN 제어 루프 250Hz)',
          '공연장 예약/답사 일정 도움 (승민과)',
        ],
        dependencies: {
          receives: ['승민: 전원 회로 + NUC↔CAN'],
          gives: ['승민: 공중지그 보행 데이터'],
        },
      },
      'W-3': {
        focus: '실체 mass 재학습 + sim2real',
        tasks: [
          '실체 mass 재학습 (필요 시, URDF 실측 기반)',
          'sim2real 파이프라인 (상윤 공동)',
          '실내 풀 시나리오 보행 검증',
        ],
        dependencies: {
          receives: ['승민: 실측 URDF', '상윤: sim2real gap 분석'],
          gives: ['승민: 재학습된 policy'],
        },
      },
      'W-2': {
        focus: '바닥/조명 policy 보정 + 공연장 sim2real 1차',
        tasks: [
          '바닥 마찰/조명 policy 보정',
          '공연장 sim2real 1차 — 실체 보행 테스트',
        ],
        dependencies: {
          receives: ['승민: 바닥 마찰 데이터'],
          gives: [],
        },
      },
      'W-1': {
        focus: 'AI 보정 + 비상 시 재튜닝',
        tasks: [
          '리허설 중 policy 보정',
          '5분 연속 보행 안정화',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — AI 보정, 비상 시 재튜닝',
        tasks: [
          'AI 보정',
          '비상 시 재튜닝',
        ],
        dependencies: { receives: [], gives: [] },
      },
    },
  },

  epsilon1: {
    name: '성래',
    identity: '오케스트레이터·통합 오너',
    track: 'A (리드)',
    color: '#4466ff',
    parts: ['torso', 'mouth', 'left_arm', 'right_arm'],
    weeklyTasks: {
      'W-6': {
        focus: '오케스트레이터 골격 + IDLE/TALKING + mouth PWM',
        tasks: [
          '오케스트레이터 골격 (Python asyncio FSM)',
          'IDLE 상태 (Whisper VAD 대기)',
          'TALKING 상태 (STT/LLM/TTS 라운드트립)',
          '입 서보 PWM 제어 (mouth lip sync 기초)',
          'JSON 액션 스키마',
        ],
        dependencies: {
          receives: ['인혁: mouth PWM 인터페이스'],
          gives: [],
        },
      },
      'W-5': {
        focus: 'MANIPULATING 상태 + LeRobot ServoControl + 백업 정책',
        tasks: [
          'MANIPULATING 상태 로직',
          'LeRobot ServoControl 연동 (BusLinker #1+#2)',
          '클라우드 LLM STT/LLM/TTS 연동',
          '데이터/모델 백업 정책 수립 (수집 데이터·체크포인트, 상윤과; 희승 디테일)',
        ],
        dependencies: {
          receives: ['인혁: 양팔 LeRobot 제어 가능', '희승: 백업 디테일'],
          gives: [],
        },
      },
      'W-4': {
        focus: 'WALKING 상태 + UDP 파이프 + FETCH 시퀀서',
        tasks: [
          'WALKING 상태 로직',
          'UDP vx/vy/wz 파이프 (Orin→NUC)',
          'FETCH 시퀀서 초안 (WALKING→MANIPULATING→handover)',
        ],
        dependencies: {
          receives: ['승민: NUC UDP 서버 동작'],
          gives: [],
        },
      },
      'W-3': {
        focus: '대화 파이프라인 + 전체 상태머신 + 실내 풀 시나리오',
        tasks: [
          '대화 파이프라인 완성 (STT+LLM+TTS, 스트리밍)',
          '전체 상태머신 연동 (IDLE↔TALKING↔MANIPULATING↔WALKING↔FETCH↔EMERGENCY)',
          '실내 풀 시나리오 1차 진행',
          '서바이벌 모드 폴백 (Qwen 로컬 + Piper)',
        ],
        dependencies: {
          receives: ['인혁: 전체 결합', '상윤: lip sync TTS 타이밍', '희승: 실체 보행'],
          gives: [],
        },
      },
      'W-2': {
        focus: '네트워크 안정성 + 실외 검증 + 시나리오 sequence',
        tasks: [
          '5GHz 핫스팟 latency 검증',
          '서바이벌 모드 실외 검증',
          'FETCH 타이머 현장 보정',
          '시연 시나리오 sequence (대본·큐시트, 상윤과)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '시스템 기동 + 시나리오 B/C 전환 판단',
        tasks: [
          '시스템 기동/시나리오 진행',
          '시나리오 B/C 전환 판단 로직 확정',
          '리허설 시나리오 진행 담당',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — 시스템 기동, 데모 연출, 시나리오 전환 판단',
        tasks: [
          '시스템 기동',
          '시나리오 진행',
          '시나리오 B/C 전환 판단',
        ],
        dependencies: { receives: [], gives: [] },
      },
    },
  },

  epsilon2: {
    name: '상윤',
    identity: 'SmolVLA·캐릭터·검증 오너 — SmolVLA 학습까지 확장',
    track: 'A+B',
    color: '#00ff88',
    parts: ['head', 'left_arm', 'right_arm'],
    weeklyTasks: {
      'W-6': {
        focus: 'SmolVLA Stage 1 학습 착수 + 머리 외주 follow-up',
        tasks: [
          'LeRobot Orin 환경 셋업',
          'SmolVLA Stage 1 학습 착수 (1팔 수집 데이터 + smolvla_base)',
          '평가 스크립트 작성',
          '머리 외주 follow-up (납기·진척 컨택, 외주 gate 책임)',
        ],
        dependencies: { receives: [], gives: ['전원: 머리 외주 진척 보고'] },
      },
      'W-5': {
        focus: '양팔 수집 + Stage 2 + 카메라 calib + 백업 + 외주',
        tasks: [
          '양팔 수집 (스타벅스 컵·텀블러·인형)',
          'SmolVLA Stage 2 파인튜닝',
          '카메라 calibration (intrinsic, 인혁과)',
          '데이터/모델 백업 정책 (성래와 메인, 수집 데이터+SmolVLA 체크포인트)',
          '머리 외주 follow-up + 입고 디데이 확정',
        ],
        dependencies: {
          receives: ['인혁: 양팔 수집 환경 + 카메라 calib', '희승: 백업 디테일'],
          gives: ['전원: 외주 입고 디데이'],
        },
      },
      'W-4': {
        focus: 'SmolVLA v1 평가 + 감정 표현 + 외주 플랜B 판단',
        tasks: [
          'SmolVLA v1 실물 평가 (물체별 성공률, 실패 유형)',
          '추가 수집 보정',
          '감정 표현 v1 (중립/기쁨/놀람)',
          '머리 외주 follow-up + 플랜B trigger 판단 (미입고 시 인혁 W-4 도장 플랜B 발동)',
        ],
        dependencies: { receives: [], gives: ['인혁: 외주 입고/플랜B 결정'] },
      },
      'W-3': {
        focus: 'lip sync + SmolVLA v2 평가 + sim2real gap',
        tasks: [
          'lip sync 완성 (TTS 타이밍 → 입 서보 동기, 성래 협업)',
          'SmolVLA v2 실물 평가',
          'sim2real gap 분석 (보행+조작)',
          '머리 외장 최종 마감 (인혁 결합 전)',
        ],
        dependencies: {
          receives: [],
          gives: ['성래: lip sync TTS 타이밍', '희승: sim2real gap 분석'],
        },
      },
      'W-2': {
        focus: '키워드 사전 + 캐릭터 표현 + 시나리오 sequence',
        tasks: [
          '키워드 사전 + 동의어 매핑 (서바이벌 모드)',
          '캐릭터 표현 조정 (감정/대화)',
          '시연 시나리오 sequence (대본·큐시트, 성래와)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '캐릭터 표현 + 비상 보조',
        tasks: [
          '캐릭터 표현 확인',
          '비상 매뉴얼 보조',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — 캐릭터, 기록, 비상 보조',
        tasks: [
          '캐릭터 담당',
          '기록(영상)',
          '비상 보조',
        ],
        dependencies: { receives: [], gives: [] },
      },
    },
  },
};
