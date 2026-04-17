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
          '토르소 11단계 조립 (프레임→배터리2 슬롯→DC-DC×3→NUC→Orin→USB Hub→환기팬→어깨 마운트→스피커→이더넷→케이블)',
          'mouth HW 조립 (입 서보 SG90 + 마운트)',
          '입 힌지 PWM 배선 (Jetson GPIO 5V) — 성래 PWM 제어 입력',
          '토르소 내부 케이블 정리 + 간섭 확인',
        ],
        dependencies: {
          receives: ['승민: 조립 보조'],
          gives: ['성래: mouth PWM 인터페이스 (입 서보 핀 매핑)'],
        },
      },
      'W-5': {
        focus: 'SO-ARM 양팔 조립 + 토르소 마운트',
        tasks: [
          'SO-ARM 2팔 조립 (STS3215 ×6, BusLinker #2)',
          '토르소 양팔 어깨 마운트',
          '2팔 캘리브레이션',
          '양팔 텔레옵 동시 동작 검증 (리더-팔로워)',
        ],
        dependencies: {
          receives: ['승민: 조립 보조'],
          gives: ['상윤: 양팔 수집 환경 인계', '성래: LeRobot ServoControl 양팔 제어 가능'],
        },
      },
      'W-4': {
        focus: '상체 외장/마감 + 머리 수령 대기',
        tasks: [
          '바디 천커버 패턴 제작 (하이리온 컬러, 벨크로 고정, 환기 메쉬)',
          '머리 외주 수령 대기 + 피팅 준비 (전자부품 pre-fit)',
          '서피서 + 도장 (외주 미도착 시 플랜B)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-3': {
        focus: '머리 통합 + 상하체 결합 (실내 sim2real 게이트)',
        tasks: [
          '머리 외주 수령 → 전자부품 8단계 통합 (카메라+입서보+배선)',
          '계량 ≤700g 검증',
          '상하체 결합 (퀵릴리즈)',
          '관절 가동 범위 실측 (±5° 이상 시 URDF 수정)',
        ],
        dependencies: {
          receives: ['희승+승민: 다리 완성', '상윤: 머리 외장 마감'],
          gives: ['성래: 풀 시나리오 진행 가능 (전체 결합)', '희승: 실체 mass 측정값'],
        },
      },
      'W-2': {
        focus: '운송 분해/재조립 훈련 + 외장 보호',
        tasks: [
          '운송 분해/재조립 10분 훈련',
          '외장 운송 보호 (천커버 탈착, 머리 보호)',
          '공연장 답사 시 현장 조립 시뮬',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '드레스 리허설 — 현장 조립/외장 담당',
        tasks: [
          '공연장 현장 조립/분해',
          '외장 상태 확인',
          '리허설 2회+ 물리 안전 담당',
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
          '토르소 11단계 조립 보조 (인혁과)',
          'mouth 마운트 보조',
          'BHL 다리 모터 입고 모니터링 (W-5 조립 대비)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-5': {
        focus: '인혁 보조 — 2팔 조립 + 손목 카메라 배선',
        tasks: [
          'SO-ARM 2팔 조립 보조 (인혁과)',
          '손목 카메라 USB 배선',
          'BHL 다리 조립 시작 준비 (희승 합류 전 부품 정리)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-4': {
        focus: '하체 복귀 — BHL 다리 조립 + 전원/안전',
        tasks: [
          'BHL 다리 조립 (희승과)',
          '전원 회로 (배터리 1+2, DC-DC, 비상정지 NC 회로)',
          'NUC↔CAN 연결 + SocketCAN 검증',
          '낙상 감지 BNO085 벤치 테스트',
        ],
        dependencies: {
          receives: ['희승: 다리 RL 학습 결과 + 다리 부품'],
          gives: ['희승: 다리 HW 완성 → 공중지그 보행 가능', '성래: NUC UDP 서버 동작'],
        },
      },
      'W-3': {
        focus: '실체 mass 보행 테스트 + URDF 업데이트',
        tasks: [
          '실체 mass 보행 테스트 (희승과)',
          'URDF 실측 업데이트 (인혁 결합 후 무게/관성)',
          '재학습 트리거 판단',
        ],
        dependencies: {
          receives: ['인혁: 상하체 결합 완료'],
          gives: ['희승: 실측 URDF → 재학습'],
        },
      },
      'W-2': {
        focus: '비상 매뉴얼 초안 + 공연장 답사',
        tasks: [
          '비상 매뉴얼 초안 (전원·비상정지·낙상·재시작)',
          '운송 분해/재조립 (인혁과)',
          '공연장 답사 — 전원 콘센트, 바닥 마찰',
        ],
        dependencies: { receives: [], gives: ['희승: 바닥 마찰 데이터'] },
      },
      'W-1': {
        focus: '비상 매뉴얼 최종화 + 안전 검증',
        tasks: [
          '비상 매뉴얼 최종화',
          '낙상감지/비상정지 실측 검증',
          '리허설 2회+ 전원/안전 담당',
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
    identity: 'AI 인프라 오너 — BHL Walking RL 전담',
    track: 'B (리드)',
    color: '#c8ff00',
    parts: ['left_leg', 'right_leg'],
    weeklyTasks: {
      'W-6': {
        focus: 'BHL Walking RL 학습 계속 (현재 진행 중)',
        tasks: [
          'Walking RL 학습 (HOVER reward 튜닝)',
          'AMASS retargeting 안정화',
          'IsaacLab 도메인 랜덤화 ±20%',
          'PhysX CPU 모드 학습 속도 모니터링',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-5': {
        focus: 'Walking RL 학습 + BHL 다리 조립 시작',
        tasks: [
          'Walking RL 학습 계속',
          'BHL 다리 조립 시작 (모터 도착 시, 액추에이터 12개)',
          '기어박스 후가공 (서포트 제거, 리밍, 베어링 시트)',
        ],
        dependencies: {
          receives: ['모터 입고'],
          gives: [],
        },
      },
      'W-4': {
        focus: 'BHL 다리 완성 + 공중지그 보행 (W-4 게이트)',
        tasks: [
          'BHL 다리 완성 (액추에이터 12개)',
          '공중 지그 보행 테스트',
          'NUC jitter 측정',
          'Walking RL ONNX 배포 (NUC, 250Hz CAN 루프)',
        ],
        dependencies: {
          receives: ['승민: 전원 회로 + NUC↔CAN'],
          gives: ['승민: 공중지그 보행 데이터'],
        },
      },
      'W-3': {
        focus: '실체 mass 재학습 + sim2real 파이프라인',
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
          '비상 시 재튜닝',
          '5분 연속 보행 안정화',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'final': {
        focus: '발표 — AI 보정, 비상 시 재튜닝',
        tasks: [
          'AI 보정',
          '비상 시 재튜닝 담당',
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
          '오케스트레이터 골격 구현 (Python asyncio FSM)',
          'IDLE 상태 로직 (Whisper VAD 대기)',
          'TALKING 상태 로직 (STT/LLM/TTS 라운드트립)',
          '입 서보 PWM 제어 (mouth 연동, lip sync 기초)',
          'JSON 액션 스키마 초안',
        ],
        dependencies: {
          receives: ['인혁: mouth PWM 인터페이스'],
          gives: [],
        },
      },
      'W-5': {
        focus: 'MANIPULATING 상태 + LeRobot ServoControl',
        tasks: [
          'MANIPULATING 상태 로직 추가',
          'LeRobot ServoControl 연동 (BusLinker #1+#2)',
          '클라우드 LLM STT/LLM/TTS 연동 초안',
          '에코 캔슬링 테스트 (AEC 필요 여부)',
        ],
        dependencies: {
          receives: ['인혁: 양팔 LeRobot 제어 가능'],
          gives: [],
        },
      },
      'W-4': {
        focus: 'WALKING 상태 + UDP 파이프 + FETCH 시퀀서 초안',
        tasks: [
          'WALKING 상태 로직',
          'UDP vx/vy/wz 명령 파이프 (Orin→NUC, udp_joystick.py 호환)',
          'FETCH 시퀀서 초안 (WALKING→MANIPULATING→WALKING→handover)',
          '카메라 공유 (/camera/image_raw)',
        ],
        dependencies: {
          receives: ['승민: NUC UDP 서버 동작'],
          gives: [],
        },
      },
      'W-3': {
        focus: '대화 파이프라인 완성 + 전체 상태머신 + 실내 풀 시나리오',
        tasks: [
          '대화 파이프라인 완성 (STT+LLM+TTS, 스트리밍)',
          '전체 상태머신 연동 (IDLE↔TALKING↔MANIPULATING↔WALKING↔FETCH↔EMERGENCY)',
          '실내 풀 시나리오 1차 진행',
          '서바이벌 모드 폴백 (Qwen 0.5B 로컬 + Piper)',
        ],
        dependencies: {
          receives: ['인혁: 전체 결합', '상윤: lip sync TTS 타이밍', '희승: 실체 보행'],
          gives: [],
        },
      },
      'W-2': {
        focus: '네트워크 안정성 + 시연 레이아웃',
        tasks: [
          '5GHz 핫스팟 latency (500ms 이내)',
          '서바이벌 모드 실외 검증',
          '시연 레이아웃 마커 배치 (홈↔테이블↔관객)',
          'FETCH 타이머 현장 보정 (T1, T2)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '시스템 기동 + 시나리오 B/C 전환 판단',
        tasks: [
          '시스템 기동/시나리오 진행',
          '시나리오 B/C 전환 판단 로직 확정',
          'FETCH 시퀀서 타이머 현장 보정',
          '리허설 2회+ 시나리오 진행 담당',
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
        focus: 'SmolVLA Stage 1 학습 착수 (1팔 데이터)',
        tasks: [
          'LeRobot Orin 환경 셋업',
          'SmolVLA Stage 1 학습 착수 (1팔 수집 데이터 + smolvla_base, DGX 낮 슬롯)',
          '평가 스크립트 작성',
          'BNO085 IMU 낙상 감지 사전 조사',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-5': {
        focus: '양팔 수집 시작 + Stage 2 파인튜닝',
        tasks: [
          '양팔 수집 (스타벅스 컵·텀블러·인형 각 ~100개)',
          'SmolVLA Stage 2 파인튜닝 착수 (DGX, 자체 데이터)',
          '수집 프로토콜 문서화',
        ],
        dependencies: {
          receives: ['인혁: 양팔 수집 환경'],
          gives: [],
        },
      },
      'W-4': {
        focus: 'SmolVLA v1 평가 + 감정 표현',
        tasks: [
          'SmolVLA v1 실물 평가 (물체별 성공률, 실패 유형)',
          '추가 수집 보정',
          '감정 표현 v1 (중립/기쁨/놀람)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-3': {
        focus: 'lip sync + SmolVLA v2 평가 + sim2real gap 분석',
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
        focus: '외장 최종 점검 + 키워드 사전 + 캐릭터 표현',
        tasks: [
          '외장 운송 후 파손 확인',
          '키워드 사전 + 동의어 매핑 (서바이벌 모드)',
          '캐릭터 표현 조정 (감정/대화)',
        ],
        dependencies: { receives: [], gives: [] },
      },
      'W-1': {
        focus: '캐릭터 표현 + 기록 영상 + 비상 보조',
        tasks: [
          '캐릭터 표현 확인',
          '기록(영상)',
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
