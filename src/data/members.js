// HYlion Physical AI — 멤버별 주차 태스크 맵
// 실행가이드 v12 기반 전수 추출

export const MEMBERS = {
  delta1: {
    name: 'δ1',
    identity: '하드웨어·외장 오너',
    track: 'A (리드)',
    color: '#00f0ff',
    parts: ['torso', 'left_arm', 'right_arm', 'head'],
    weeklyTasks: {
      0: {
        focus: 'SO-ARM 커리큘럼 + 킥오프',
        tasks: [
          '[공통] SO-ARM 조립 + 서보모터 장착 + Dynamixel ID 설정 + 캘리브레이션',
          '조립하면서 조립 기준서 초안 작성 (나사 토크, 그리스, 주의사항)',
          '머리 외주 사양 논의 (전자부품 치수 제공, ε2와 공동)',
          '[공통] SO-ARM URDF 정의 + RViz + Gazebo',
          '[공통] Leader-follower 텔레오퍼레이션 + 카메라',
          '텔레옵 경험을 프로젝트 설계에 반영 (화각·작업 공간 체감)',
          '머리 외주 사양서 마무리 (ε2와 공동, 외형+내부 치수+개구부+≤300g)',
          '[공통] 데이터 수집 → 모방학습 → 자율 동작 → 종합 미션',
          '수집 조작 감각 기록 → 프로토콜 기초',
        ],
        dependencies: {
          receives: ['ε2: 머리 레퍼런스+스케치'],
          gives: ['조립 기준서 초안 → δ2 (Week 1)'],
        },
      },
      1: {
        focus: '설계 확정 + Track A 분기',
        tasks: [
          '[전체 합의] 인터페이스 + 리소스 할당',
          '[전체 합의] U2D2 버스 분배 (좌팔 6 / 우팔 6+목 2)',
          '[전체 합의] 카메라 마운트 위치·각도',
          'SO-ARM 작업 공간 실측 + 카메라 위치·각도 확정 (이후 변경 금지)',
          '실물체 3개 그립 테스트 (컵, 텀블러, 인형 → jaw 부족 시 고무 패드/물체 교체)',
          '텔레오퍼레이션 환경 구축 (leader + follower + 녹화)',
          '토르소 프레임 CAD (환기 구조 + 퀵릴리즈 hip)',
          'BHL 액추에이터 3개 시험 조립 + 조립 기준서 작성 → δ2 인계',
        ],
        dependencies: {
          receives: ['δ2: 상체 무게 적산값', 'ε1: 상태 머신 프레임워크 선정 결과'],
          gives: [
            '카메라 위치·각도 확정 → ε1 (Week 1)',
            '조립 기준서 → δ2 (Week 1 말)',
            'SmolVLA 수집 기준 합의 → ε1 (Week 1)',
          ],
        },
      },
      2: {
        focus: '토르소 조립 + 수집 시작',
        tasks: [
          '토르소 프레임 조립 (아래→위 11단계, 기획서 7.2절 참조)',
          'SO-ARM 마운트 + 휘어짐 확인',
          '에피소드 수집 시작 — 30개 (물체당 10개, 메타데이터 기록)',
          '머리 간이 목업 (스티로폼 블록 + 전자부품 임시 배치 + 계량 ≤700g)',
          '수집 프로토콜 문서화 (Week 3 ε2 인수인계 대비)',
          '미니 파인튜닝 결과 모델 실행 → 치명적 결함 확인',
          'δ3+δ1: 수집 전략 확정',
        ],
        dependencies: {
          receives: ['δ3: 미니 파인튜닝 결과 모델 (Week 2 말)'],
          gives: [
            '수집 30개 데이터 → δ3 미니 파인튜닝 (Week 2 말)',
            '수집 프로토콜 → ε2 (Week 3 인수인계)',
          ],
        },
      },
      3: {
        focus: '570개 몰아서 수집 (Phase 1 마감)',
        tasks: [
          'Week 2 프로토콜 기반 수집 (하루 ~120개 목표)',
          'ε2 수집 인수인계 세션 진행 (영상 시청 + 동일 패턴 훈련)',
          '누적 600개 도달 시 수집 종료 (시연 조건 60%+ 확인)',
          'SmolVLA 중간 모델 실행 → 실패 패턴 → δ3 피드백',
        ],
        dependencies: {
          receives: ['δ3: SmolVLA 중간 모델'],
          gives: [
            '수집 600개 데이터 → δ3 Stage 2 학습 (Week 3)',
            '실패 패턴 피드백 → δ3 (Week 3)',
          ],
        },
      },
      4: {
        focus: '수집 종료 → 머리/외장 전환',
        tasks: [
          '머리 표면 마감 시작: 외주 CNC 도착 시 사포+서피서, 미도착 시 수작업 조각(열선커터+칼+사포)',
          '서피서 도포 + 건조 (1일)',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      5: {
        focus: '머리 도장 + 외장 디테일',
        tasks: [
          '머리 수성 도료 도장 + 건조',
          'LED 눈 디퓨저 제작 (반투명 아크릴/실리콘)',
          '외장 디테일 점검',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      6: {
        focus: '상반신 통합 물리 지원 + 머리 전자부품 피팅',
        tasks: [
          '상반신 통합 물리 지원',
          '머리 외주 도착 시: 전자부품 pre-fit 테스트 (카메라·LED 피팅 확인)',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      7: {
        focus: '상반신 정밀 계측 + 머리 통합 + 발 커버',
        tasks: [
          '상반신 정밀 계측 (질량 ±10g, CoM, 관성 텐서) → δ3·δ2 전달',
          'δ2 더미 웨이트 실측값으로 업데이트',
          '무게 예산 검증 → 초과 시 경량화',
          '머리 전자부품 통합 (외주 도착 시): 피팅→카메라→LED+디퓨저→입 서보→배선 집약→토르소 결합→계량 ≤700g→감정 전체 테스트',
          '플랜 B: 미도착 시 목업 유지 (Week 4~5 도장 완료 상태)',
          '다리 발 커버 제작 (EVA 또는 3D프린트)',
        ],
        dependencies: {
          receives: ['δ2: 더미 웨이트 실측값'],
          gives: [
            '상반신 정밀 계측 (질량, CoM, 관성 텐서) → δ3·δ2 (Week 7)',
          ],
        },
      },
      8: {
        focus: '트랙 합류 — 상하체 결합 + 풀 시나리오 1차',
        tasks: [
          '상하체 결합 (퀵릴리즈)',
          '관절 가동 범위 실측 (±5° 이상 시 URDF 수정)',
          '관절 스텝 응답 테스트',
          '외장 부착 준비 (외주 도착 확인)',
        ],
        dependencies: {
          receives: ['δ2: 전원 A+B+C 통합 배선 완료'],
          gives: ['상하체 결합 완료 → 전원 풀 시나리오 진입'],
        },
      },
      9: {
        focus: '전원 올핸즈 — 안정화 + 답사 + 리허설 1차',
        tasks: [
          '풀 시나리오 반복 실행 (전원 참여, 실패 시 즉시 원인 분류+수정)',
          '5분 연속 보행 도전',
          '보행+대화 동시 테스트',
          '[답사] 로봇 분리 운반 → 현장 조립 (10분 이내)',
          '[답사] 외장 상태 확인 (운송 중 파손 여부, ε2와 공동)',
          '[리허설 1차] 로봇 조립/분해, 물리 안전, 외장 상태 담당',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      10: {
        focus: '전원 올핸즈 — 리허설 2차 + 발표',
        tasks: [
          '현장 조립, 물리 안전, 외장 담당',
          '[리허설 2차] 발표 장소에서 실행',
          '[리허설 2차] 시연 시나리오 전체 2회 이상 반복',
          '[리허설 2차] 비상 시나리오 전환 확인 (A→B, A→C)',
          '[발표] 시선·인사·대화·집기 동작',
          '[발표] MOSFET 정상 확인',
          '[발표] 비상정지 정상 확인',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
    },
  },

  delta2: {
    name: 'δ2',
    identity: '보행 시스템 오너',
    track: 'B (리드)',
    color: '#ff00aa',
    parts: ['left_leg', 'right_leg'],
    weeklyTasks: {
      0: {
        focus: 'SO-ARM 커리큘럼 + 킥오프',
        tasks: [
          '[공통] SO-ARM 조립 + 서보모터 장착 + Dynamixel ID 설정 + 캘리브레이션',
          '[공통] SO-ARM URDF 정의 + RViz + Gazebo',
          '배터리 소비 전류 계산 (Orin 25W + NUC 15W + SO-ARM + BHL BLDC → 30분 가능 확인)',
          '스펙시트 기반 상체 무게 적산 (Week 2 직립 테스트 결과와 대조 예정)',
          '[공통] Leader-follower 텔레오퍼레이션 + 카메라',
          'BHL 문서 정독 + lowlevel 코드 리딩 (개인 노트북에서, NUC는 Week 1 도착)',
          '[공통] 데이터 수집 → 모방학습 → 자율 동작 → 종합 미션',
          'Sim2sim 절차 파악 (BHL 문서) + BHL lowlevel 코드 리딩 계속',
        ],
        dependencies: {
          receives: [],
          gives: ['상체 무게 적산값 → 전체 (Week 1 합의)'],
        },
      },
      1: {
        focus: '설계 확정 + Track B NUC/전원 셋업',
        tasks: [
          '[전체 합의] 인터페이스 + 리소스 할당',
          '[전체 합의] 상체 무게 적산값 공유',
          '[전체 합의] 배터리 배치 방향 (토르소 vs hip)',
          '[전체 합의] 전원 시퀀싱',
          'NUC xanmod RT 커널 완성 (Ubuntu 22.04 + RT + CAN)',
          'BHL lowlevel C 빌드 + 숙달 (코드 리딩, 더미 CAN 루프)',
          'PDB + BMS + DC-DC 조립·배선 + 전원 시퀀싱 문서화',
          'Sim2sim 환경 셋업',
          'Orin↔NUC Ethernet + ROS2 통신 확인',
          'IsaacLab 환경 직접 실행 (δ3 인계 후)',
        ],
        dependencies: {
          receives: [
            'δ1: 조립 기준서 (Week 1 말)',
            'δ3: IsaacLab 환경 완성 인계 (Week 1)',
          ],
          gives: ['상체 무게 적산값 → 전체 (Week 1 합의)'],
        },
      },
      2: {
        focus: 'Walking RL 1차 학습 + 기어박스 후가공',
        tasks: [
          'Walking RL 1차 학습 시작 (DGX — δ3 Stage 1과 시간 분배)',
          '비상정지 회로 완성',
          'NUC 더미 policy 실행 테스트',
          '기어박스 후가공 선행 (서포트 제거, 리밍, 베어링 시트)',
          '공중 지그 설계',
        ],
        dependencies: {
          receives: ['δ3: IsaacLab 상부 mass 직립 최종 확인 결과'],
          gives: [],
        },
      },
      3: {
        focus: 'Walking RL 모니터링 + Sim2sim 검증',
        tasks: [
          'Walking RL 모니터링 + Sim2sim 검증 (IsaacLab → MuJoCo)',
          '공중 지그 3D프린트',
          'SOC 20% 안전 자세 로직',
        ],
        dependencies: {
          receives: [],
          gives: ['Sim2sim 검증 결과 → δ3 (Week 3)'],
        },
      },
      4: {
        focus: '물리 진입 — 액추에이터 조립 + 다리 조립',
        tasks: [
          '액추에이터 10개 조립 (기어박스 후가공 완료 상태)',
          '다리 조립 시작 + 배터리 C 연결',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      5: {
        focus: '다리 완성 + 공중 지그 보행 테스트',
        tasks: [
          '다리 완성 + NUC↔CAN 실물 연결',
          '공중 지그 보행 테스트 + NUC jitter 측정',
        ],
        dependencies: {
          receives: ['δ3: Walking RL 최종 검토 결과'],
          gives: ['공중 보행 로그 → ε2 비교 분석 (Week 5)'],
        },
      },
      6: {
        focus: '더미 지면 보행 (Track B 마일스톤)',
        tasks: [
          '더미 웨이트 제작 (스펙시트 기반, 100g 단위 조절 가능)',
          '지면 보행 첫 시도',
          'gap 데이터 → ε2 분석, δ3 재학습 판단',
        ],
        dependencies: {
          receives: [],
          gives: [
            'gap 데이터 → ε2 분석 (Week 6)',
            'gap 데이터 → δ3 재학습 판단 (Week 6)',
            '더미 웨이트 실측값 → δ1 (Week 7)',
          ],
        },
      },
      7: {
        focus: '최종 policy 테스트 + 전원 테스트 + 비상 매뉴얼',
        tasks: [
          '재학습 결과 테스트 반복 + 30분 전원 테스트',
          'BMS 최종 + NUC 장기 안정성',
          '비상 매뉴얼 작성 (전원 시퀀싱, 비상정지, 낙상 차단, 재시작 절차)',
        ],
        dependencies: {
          receives: [
            'δ1: 상반신 정밀 계측 (질량, CoM, 관성 텐서)',
            'δ3: Walking RL 최종본',
          ],
          gives: [],
        },
      },
      8: {
        focus: '트랙 합류 — 전원 통합 + 실체 보행',
        tasks: [
          '전원 A+B+C 통합 배선',
          '실체 장착 보행 테스트 (안 되면 δ3 재학습)',
          '풀 시나리오 보행 (걷기+멈추기+재시작)',
        ],
        dependencies: {
          receives: ['δ1: 상하체 결합 완료'],
          gives: ['실체 보행 결과 → δ3 재학습 판단 (Week 8)'],
        },
      },
      9: {
        focus: '전원 올핸즈 — 안정화 + 답사 + 리허설 1차',
        tasks: [
          '풀 시나리오 반복 실행 (전원 참여, 실패 시 즉시 원인 분류+수정)',
          '5분 연속 보행 도전',
          '보행+대화 동시 테스트',
          '[답사] 바닥 재질 (마찰 → δ3 policy 보정)',
          '[답사] 전원 콘센트 위치',
          '[답사] 현장 보행 테스트 (바닥 마찰 확인)',
          '[리허설 1차] 전원 투입/차단, 보행 모니터, 비상 매뉴얼 집행 담당',
        ],
        dependencies: {
          receives: [],
          gives: ['바닥 마찰 데이터 → δ3 policy 보정 (Week 9)'],
        },
      },
      10: {
        focus: '전원 올핸즈 — 리허설 2차 + 발표',
        tasks: [
          '전원, 보행, 비상 매뉴얼 담당',
          '[리허설 2차] 발표 장소에서 실행',
          '[리허설 2차] 시연 시나리오 전체 2회 이상 반복',
          '[리허설 2차] 비상 시나리오 전환 확인 (A→B, A→C)',
          '[발표] 시선·인사·대화·집기 동작',
          '[발표] MOSFET 정상 확인',
          '[발표] 비상정지 정상 확인',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
    },
  },

  delta3: {
    name: 'δ3',
    identity: 'AI 인프라 오너',
    track: 'A+B',
    color: '#c8ff00',
    parts: [],
    weeklyTasks: {
      0: {
        focus: 'SO-ARM 커리큘럼 + IsaacLab 환경 로드',
        tasks: [
          '[공통] SO-ARM 조립 + 서보모터 장착 + Dynamixel ID 설정 + 캘리브레이션',
          '[공통] SO-ARM URDF 정의 + RViz + Gazebo',
          'BHL 리포지토리 클론 → IsaacLab 환경 로드 (체크포인트)',
          '[공통] Leader-follower 텔레오퍼레이션 + 카메라',
          'BHL 액추에이터 파라미터 문서화 + ROS2 토픽 리스트 초안',
          '[공통] 데이터 수집 → 모방학습 → 자율 동작 → 종합 미션',
          'IsaacLab 체크포인트 결과 정리 + Week 1 직립 테스트 계획 수립',
        ],
        dependencies: {
          receives: [],
          gives: ['IsaacLab 환경 로드 결과 → δ2 (Week 1)'],
        },
      },
      1: {
        focus: 'IsaacLab 환경 완성 + 직립 테스트 + SmolVLA Stage 1',
        tasks: [
          '[전체 합의] 인터페이스 + 리소스 할당',
          'IsaacLab 커스텀 상부 추가 (토르소 mesh, 머리 mass, SO-ARM 간략 모델, DR ±20%)',
          'IsaacLab 환경 완성 → δ2 인계 (Week 1 최우선)',
          'IsaacLab 로드 검증 → ε2 검증 루프 인계',
          '파라메트릭 직립 테스트 시작 (Week 2 초 결과)',
          'SmolVLA DGX Stage 1 시작 (LeRobot Hub 공개 데이터, 백그라운드 학습)',
        ],
        dependencies: {
          receives: [],
          gives: [
            'IsaacLab 환경 완성 → δ2 (Week 1)',
            'IsaacLab 검증 루프 → ε2 (Week 1)',
            'SmolVLA Stage 1 모델 → ε1 모니터링 (Week 2~)',
          ],
        },
      },
      2: {
        focus: 'IsaacLab 직립 최종 확인 + SmolVLA Stage 1 모니터링',
        tasks: [
          'IsaacLab 상부 mass 직립 최종 확인 → 보행 체크포인트',
          'SmolVLA Stage 1 DGX 학습 모니터링',
          '30개로 미니 파인튜닝 (DGX, Stage 2 테스트)',
          'δ3+δ1: 수집 전략 확정',
        ],
        dependencies: {
          receives: ['δ1: 수집 30개 데이터 (Week 2 말)'],
          gives: [
            '직립 최종 확인 결과 → δ2 (Week 2)',
            '미니 파인튜닝 결과 모델 → δ1 실행 (Week 2 말)',
          ],
        },
      },
      3: {
        focus: 'SmolVLA Stage 2 학습 + Walking RL 보상 함수 조정',
        tasks: [
          'SmolVLA Stage 1 완료 → Stage 2 DGX 학습 실행 (자체 600개 데이터)',
          'SmolVLA v1 학습 설정 결정 (lr, batch, 비율)',
          'Walking RL 결과 검토 + 보상 함수 조정',
        ],
        dependencies: {
          receives: [
            'δ1+ε2: 수집 600개 데이터 (Week 3)',
            'δ1: 실패 패턴 피드백 (Week 3)',
          ],
          gives: [
            'SmolVLA Stage 1 모델 → ε1 TensorRT 변환 (Week 3)',
            'SmolVLA 중간 모델 → δ1 실행 (Week 3)',
          ],
        },
      },
      4: {
        focus: 'SmolVLA ablation 학습 + Walking RL 2차',
        tasks: [
          'SmolVLA ablation 학습 DGX 실행 (ε1이 설계한 조합들)',
          'Walking RL 2차 학습 (지형 커리큘럼, 마찰 DR)',
          'SmolVLA 학습 결과 검토 + 피드백',
        ],
        dependencies: {
          receives: ['ε1: ablation 실험 설계 조합 (Week 3~4)'],
          gives: ['ablation 실행 결과 → ε1 해석 (Week 4)'],
        },
      },
      5: {
        focus: 'Walking RL 최종 + SmolVLA 최적 조합 + 시나리오 B/C 설계',
        tasks: [
          'Walking RL 최종 검토',
          'SmolVLA 최적 조합 학습 결과 정리 → ε1에 최종 모델 전달',
          '시나리오 B/C 설계 (보행 실패 시 대안 시나리오 구조 + 전환 조건 정의)',
        ],
        dependencies: {
          receives: ['ε1: 최적 데이터 조합 확정 결과 (Week 5)'],
          gives: [
            'SmolVLA 최적 모델 → ε1 (Week 5)',
            'Walking RL 최종 검토 결과 → δ2 (Week 5)',
            '시나리오 B/C 설계 → ε1 (Week 7)',
          ],
        },
      },
      6: {
        focus: 'Track B 더미 보행 gap 분석 + 재학습 판단',
        tasks: [
          'δ2 gap 데이터 기반 재학습 판단',
        ],
        dependencies: {
          receives: ['δ2: gap 데이터 (Week 6)', 'ε2: gap 분석 결과 (Week 6)'],
          gives: [],
        },
      },
      7: {
        focus: 'URDF 실측 업데이트 + Walking RL 재학습 + SmolVLA v2',
        tasks: [
          'URDF 실측 업데이트 → Walking RL 재학습 트리거',
          'SmolVLA v2 DGX 학습 실행 (ε1이 정제한 v2 데이터)',
          'Walking RL 최종본 → δ2 전달',
          '시나리오 B/C 최종 확정 (W5 설계 기반 → ε1에 전달)',
          'sim-to-real 파이프라인 (ε2 공동)',
        ],
        dependencies: {
          receives: [
            'δ1: 상반신 정밀 계측 (질량, CoM, 관성 텐서)',
            'ε1: SmolVLA v2 정제 데이터',
          ],
          gives: [
            'Walking RL 최종본 → δ2 (Week 7)',
            'SmolVLA v2 학습 완료 모델 → ε1 TensorRT 배포 (Week 7)',
            '시나리오 B/C 최종 확정 → ε1 (Week 7)',
          ],
        },
      },
      8: {
        focus: '트랙 합류 — 실체 mass 재학습',
        tasks: [
          '실체 mass 최종 재학습 (필요 시)',
        ],
        dependencies: {
          receives: ['δ2: 실체 보행 결과 (재학습 필요 여부)'],
          gives: ['재학습된 policy → δ2 (Week 8)'],
        },
      },
      9: {
        focus: '전원 올핸즈 — 안정화 + 답사 + 리허설 1차',
        tasks: [
          '풀 시나리오 반복 실행 (전원 참여, 실패 시 즉시 원인 분류+수정)',
          '5분 연속 보행 도전',
          '보행+대화 동시 테스트',
          '교수님 피드백 → 재튜닝 설정 → 즉시 반영',
          '[답사] 바닥 재질 (마찰 → policy 보정)',
          '[리허설 1차] 현장 보정 (바닥 마찰→policy, 조명→MediaPipe), 비상 시 재튜닝 담당',
        ],
        dependencies: {
          receives: ['δ2: 바닥 마찰 데이터 (Week 9)'],
          gives: [],
        },
      },
      10: {
        focus: '전원 올핸즈 — 리허설 2차 + 발표',
        tasks: [
          'AI 보정, 비상 시 재튜닝 담당',
          '[리허설 2차] 발표 장소에서 실행',
          '[리허설 2차] 시연 시나리오 전체 2회 이상 반복',
          '[리허설 2차] 비상 시나리오 전환 확인 (A→B, A→C)',
          '[발표] 시선·인사·대화·집기 동작',
          '[발표] MOSFET 정상 확인',
          '[발표] 비상정지 정상 확인',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
    },
  },

  epsilon1: {
    name: 'ε1',
    identity: '데이터·대화·통합 오너',
    track: 'A (리드)',
    color: '#4466ff',
    parts: ['torso'],
    weeklyTasks: {
      0: {
        focus: 'SO-ARM 커리큘럼 + LLM 파이프라인 테스트',
        tasks: [
          '[공통] SO-ARM 조립 + 서보모터 장착 + Dynamixel ID 설정 + 캘리브레이션',
          '[공통] SO-ARM URDF 정의 + RViz + Gazebo',
          'LLM JSON 안정성 테스트 (Groq 100회) + Groq 전체 파이프라인 latency 측정 (STT→LLM→TTS 라운드트립)',
          'JSON 액션 스키마 초안',
          '[공통] Leader-follower 텔레오퍼레이션 + 카메라',
          '상태별 프로세스-리소스 매핑표 초안',
          'smach/FlexBE 평가 → 상태 머신 프레임워크 선정',
          '[공통] 데이터 수집 → 모방학습 → 자율 동작 → 종합 미션',
          'SmolVLA 수집 기준 문서 초안 + LeRobot 데이터 포맷 사전 조사',
        ],
        dependencies: {
          receives: [],
          gives: ['상태 머신 프레임워크 선정 결과 → 전체 (Week 1 합의)'],
        },
      },
      1: {
        focus: 'Orin 셋업 + 상태 머신 설계 + SmolVLA TensorRT',
        tasks: [
          '[전체 합의] 인터페이스 + 리소스 할당',
          '[전체 합의] 상태 머신 프레임워크 선정 결과 공유',
          'Orin JetPack + TensorRT + ROS2 + 카메라 드라이버 초기 셋업',
          '에코 캔슬링 테스트 (→ AEC 필요 여부)',
          '상태 머신 설계 확정',
          'SmolVLA 수집 기준 문서 (δ1 합의)',
          'Orin USB 오디오 + 스피커 테스트',
          'SmolVLA TensorRT 변환 스크립트 직접 작성 (Track B 지원)',
        ],
        dependencies: {
          receives: ['δ1: 카메라 위치·각도 확정 (Week 1)'],
          gives: ['SmolVLA 수집 기준 문서 → δ1 합의 (Week 1)'],
        },
      },
      2: {
        focus: 'SmolVLA Stage 1 모니터링 + 상태 머신 v1',
        tasks: [
          'SmolVLA Stage 1 모니터링 (δ3 DGX 실행 중)',
          '에코 캔슬링 후속 완료',
          '상태 머신 v1 구현 시작',
        ],
        dependencies: {
          receives: ['δ3: SmolVLA Stage 1 학습 상태'],
          gives: [],
        },
      },
      3: {
        focus: 'TensorRT 변환 + Orin 배포 + GPU 프로파일링',
        tasks: [
          'TensorRT 변환 + Orin 배포 + 정합성 검증 (δ3이 넘긴 Stage 1 모델)',
          'GPU 프로파일링 (SmolVLA Hz 실측 → 5Hz↑: 진행 / 2~5Hz: UX 보완 / 2Hz↓: δ3 다운사이즈)',
          'ablation 실험 설계 (δ3에 학습 요청할 조합 정리)',
          '상태 머신 v1 완성',
        ],
        dependencies: {
          receives: ['δ3: SmolVLA Stage 1 완료 모델 (Week 3)'],
          gives: [
            'ablation 실험 설계 조합 → δ3 (Week 3~4)',
            'TensorRT 정합성 검증 결과 → δ3 (Week 3)',
          ],
        },
      },
      4: {
        focus: 'ablation 해석 + 대화 연동 + FETCH 시퀀서',
        tasks: [
          'ablation 결과 해석 (δ3 실행 결과 받아서)',
          'Groq STT + LLM 연동 (스트리밍) + LLM 프롬프트에 fetch 태스크 타입 추가',
          'FETCH 시퀀서 구현 (WALKING→MANIPULATING→WALKING→handover)',
        ],
        dependencies: {
          receives: ['δ3: ablation 실행 결과 (Week 4)'],
          gives: ['TTS 오디오 타이밍 → ε2 lip sync (Week 4)'],
        },
      },
      5: {
        focus: '최적 데이터 조합 확정 + 서바이벌 모드 + 상태 머신 완성',
        tasks: [
          'ablation → 최적 데이터 조합 확정 (δ3 학습 결과 기반)',
          '서바이벌 모드 엔진 완성 (Whisper tiny + Piper TTS on Orin, ε2 키워드 사전 연동)',
          '상태 머신 + FETCH 시퀀서 완성',
          '카메라 공유 (/camera/image_raw)',
        ],
        dependencies: {
          receives: [
            'δ3: SmolVLA 최적 조합 학습 결과 (Week 5)',
            'ε2: 서바이벌 키워드 사전 (Week 5)',
          ],
          gives: ['최적 데이터 조합 확정 → δ3 (Week 5)'],
        },
      },
      6: {
        focus: '상반신 통합 (Track A 마일스톤)',
        tasks: [
          'IDLE↔TALKING↔MANIPULATING 전환',
          'FETCH 시퀀서 로직 테스트 (보행은 mock, SmolVLA pick + handover 실제)',
          'LOW_BATTERY + EMERGENCY',
          '서바이벌 계층 1 + 계층 2',
          '파이프라인 10분 크래시 없음',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      7: {
        focus: 'SmolVLA v2 데이터 정제 + TensorRT v2 배포 + 서바이벌 시나리오 확정',
        tasks: [
          'SmolVLA v2 데이터 정제 → δ3 전달',
          'TensorRT v2 Orin 배포 (δ3 학습 완료 모델)',
          '서바이벌 시나리오 확정 (ε2 키워드 사전 + δ3 시나리오 B/C 통합)',
        ],
        dependencies: {
          receives: [
            'δ3: SmolVLA v2 학습 완료 모델 (Week 7)',
            'δ3: 시나리오 B/C 최종 확정 (Week 7)',
            'ε2: 키워드 사전 (Week 5~)',
          ],
          gives: ['SmolVLA v2 정제 데이터 → δ3 학습 (Week 7)'],
        },
      },
      8: {
        focus: '트랙 합류 — 풀 시나리오 1차',
        tasks: [
          '보행 중 팔 정지 정책',
          '대화→보행 명령 ("걸어" → /gait/cmd)',
          'FETCH 시퀀서 타이머 튜닝 (시연 환경 레이아웃 T1, T2)',
          '풀 시나리오 1차 테스트 (시선→인사→FETCH→자유보행)',
          '보행 로깅',
        ],
        dependencies: {
          receives: ['δ1+δ2: 상하체 결합 + 실체 보행 완료'],
          gives: ['보행 로그 → ε2 분석 (Week 8)'],
        },
      },
      9: {
        focus: '전원 올핸즈 — 안정화 + 답사 + 리허설 1차',
        tasks: [
          '풀 시나리오 반복 실행 (전원 참여, 실패 시 즉시 원인 분류+수정)',
          '5분 연속 보행 도전',
          '보행+대화 동시 테스트',
          '[답사] 5GHz 핫스팟 latency (500ms 이내)',
          '[답사] 시연 레이아웃 마커 배치 (홈↔테이블↔관객)',
          '[답사] FETCH 타이머 현장 보정 (T1, T2)',
          '[리허설 1차] 시스템 기동, 시나리오 진행, 네트워크 모니터, 서바이벌 전환 담당',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      10: {
        focus: '전원 올핸즈 — 리허설 2차 + 발표',
        tasks: [
          '시스템 기동, 데모 연출, 시나리오 B/C 전환 판단 담당',
          '[리허설 2차] 발표 장소에서 실행',
          '[리허설 2차] 시연 시나리오 전체 2회 이상 반복',
          '[리허설 2차] 비상 시나리오 전환 확인 (A→B, A→C)',
          '[발표] 시선·인사·대화·집기 동작',
          '[발표] MOSFET 정상 확인',
          '[발표] 비상정지 정상 확인',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
    },
  },

  epsilon2: {
    name: 'ε2',
    identity: '검증·캐릭터·데이터 오너',
    track: 'A+B',
    color: '#00ff88',
    parts: ['head'],
    weeklyTasks: {
      0: {
        focus: 'SO-ARM 커리큘럼 + 부품 주문 + 사전 조사',
        tasks: [
          '[공통] SO-ARM 조립 + 서보모터 장착 + Dynamixel ID 설정 + 캘리브레이션',
          '한국 부품 온라인 주문 (Orin, NUC, XL430×2, U2D2×2, 카메라, ESC×12, 알루미늄 프로파일)',
          '머리 외주 사양 논의 (레퍼런스+스케치 준비, δ1과 공동)',
          '[공통] SO-ARM URDF 정의 + RViz + Gazebo',
          'BHL URDF 파일 구조 파악 (문서 수준, Week 1에서 본격 셋업)',
          '[공통] Leader-follower 텔레오퍼레이션 + 카메라',
          '텔레옵 직접 해보며 수집 감각 사전 체험',
          '머리 외주 사양서 마무리 (δ1과 공동, 외형+내부 치수+개구부+≤300g)',
          '[공통] 데이터 수집 → 모방학습 → 자율 동작 → 종합 미션',
          'ESP32 + MPU6050 낙상 감지 사전 조사 + 평가 지표 구상',
        ],
        dependencies: {
          receives: ['δ1: 전자부품 치수 (머리 외주 사양 논의)'],
          gives: ['머리 레퍼런스+스케치 → δ1 (Week 0)'],
        },
      },
      1: {
        focus: '머리 외주 발주 + ESP32 구현 + URDF/IsaacLab 검증',
        tasks: [
          '[전체 합의] 인터페이스 + 리소스 할당',
          '머리 외주 사양서 최종 → 외주 발주 (납기 목표 Week 5~6)',
          '바디 외장 방향 확정',
          'SmolVLA 평가 지표 + 스크립트 초안',
          'URDF export 스크립트 직접 셋업',
          'ESP32 낙상 ISR + MOSFET 구현',
          'IsaacLab 검증 루프 시작',
        ],
        dependencies: {
          receives: ['δ3: IsaacLab 검증 루프 인계 (Week 1)'],
          gives: ['머리 외주 발주 (Week 1)'],
        },
      },
      2: {
        focus: 'ESP32 벤치 테스트 + 감정 상태 머신 + 평가 스크립트',
        tasks: [
          'ESP32 MOSFET 벤치 테스트 (기울임 → 차단 확인)',
          '감정 상태 머신 v1 (중립·기쁨·놀람)',
          '평가 스크립트 완성',
          'IMU 구조 확정 (ESP32용 + NUC용 별도)',
          'IsaacLab 검증 계속',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      3: {
        focus: '수집 투입 (δ1 인수인계) + IsaacLab 검증',
        tasks: [
          '수집 인수인계 세션 (δ1 영상 시청 + 동일 패턴 훈련) → 수집 투입',
          '누적 600개 도달 시 수집 종료 (δ1과 공동)',
          'IsaacLab 검증 계속 (수집과 시간 분배)',
        ],
        dependencies: {
          receives: ['δ1: 수집 프로토콜 인수인계 (Week 3)'],
          gives: ['수집 데이터 → δ3 Stage 2 학습 (Week 3)'],
        },
      },
      4: {
        focus: '수집 종료 → 외장+캐릭터 표현 전환',
        tasks: [
          '바디 천 커버 패턴 제작 (하이리온 컬러, 벨크로 고정, 환기구 메쉬)',
          'SmolVLA v1 평가 리포트 (물체별 성공률, 실패 유형)',
          'lip sync 구현 (오픈소스, ε1이 TTS 오디오 타이밍 제공 → 입 서보 동기)',
          '목 서보 PID 시선 추적 시작 (MediaPipe 얼굴 → XL430 목 PID)',
          'Walking RL 시뮬 평가 (외장 작업과 시간 분배, Track B)',
        ],
        dependencies: {
          receives: ['ε1: TTS 오디오 타이밍 (Week 4)'],
          gives: ['SmolVLA v1 평가 리포트 → δ3·ε1 (Week 4)'],
        },
      },
      5: {
        focus: '바디 커버 완성 + 캐릭터 표현 확장 + 키워드 사전',
        tasks: [
          '바디 천 커버 완성 + 토르소 임시 피팅',
          'LED 감정 5종 확장 + Gemini 폴백 + VAD 비활성화',
          'lip sync 완성 + PID 목 제어 완성 (오버슈트 <5°)',
          '서바이벌 키워드 사전 작성 ("컵/빨간거/저거" → starbucks_cup 등 동의어 매핑 + 사전 Q&A 30개)',
          '시뮬 궤적 저장 + 공중 보행 로그 vs 시뮬 비교 (Track B)',
        ],
        dependencies: {
          receives: ['δ2: 공중 보행 로그 (Week 5)'],
          gives: [
            '서바이벌 키워드 사전 → ε1 (Week 5)',
            '공중 보행 로그 vs 시뮬 비교 결과 → δ2·δ3 (Week 5)',
          ],
        },
      },
      6: {
        focus: '외장 미세 조정 + Track B gap 분석',
        tasks: [
          '외장 상태 점검 + 천 커버 미세 조정',
          'gap 데이터 분석 (δ2 지면 보행 결과)',
        ],
        dependencies: {
          receives: ['δ2: gap 데이터 (Week 6)'],
          gives: ['gap 분석 결과 → δ3 재학습 판단 (Week 6)'],
        },
      },
      7: {
        focus: 'SmolVLA v2 평가 + 감정 표현 평가 + 외장 최종 점검 + sim-to-real',
        tasks: [
          'SmolVLA v2 실물 평가',
          '감정 표현 평가 (5인 테스트)',
          '외장 전체 최종 점검 (머리+바디+다리)',
          'sim-to-real 심층 분석 + 리포트 정리 (Track B)',
        ],
        dependencies: {
          receives: ['δ3+ε1: SmolVLA v2 모델 (Week 7)'],
          gives: ['sim-to-real 리포트 → 전체 (Week 7)'],
        },
      },
      8: {
        focus: '트랙 합류 — MOSFET 검증 + sim-to-real 비교 + 캐릭터 조정',
        tasks: [
          'MOSFET 낙상 차단 실물 검증',
          '실체 vs 더미 sim-to-real 비교',
          '스텝 응답 vs 시뮬 비교',
          '보행 로그 분석 + 캐릭터 최종 조정',
        ],
        dependencies: {
          receives: ['ε1: 보행 로그 (Week 8)'],
          gives: [],
        },
      },
      9: {
        focus: '전원 올핸즈 — 안정화 + 답사 + 리허설 1차',
        tasks: [
          '풀 시나리오 반복 실행 (전원 참여, 실패 시 즉시 원인 분류+수정)',
          '5분 연속 보행 도전',
          '보행+대화 동시 테스트',
          '[답사] MediaPipe 조명 테스트',
          '[답사] 외장 상태 확인 (운송 중 파손 여부, δ1과 공동)',
          '[리허설 1차] 캐릭터 표현 확인, 기록(영상), 비상 매뉴얼 보조 담당',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
      10: {
        focus: '전원 올핸즈 — 리허설 2차 + 발표',
        tasks: [
          '캐릭터, 기록, 비상 보조 담당',
          '[리허설 2차] 발표 장소에서 실행',
          '[리허설 2차] 시연 시나리오 전체 2회 이상 반복',
          '[리허설 2차] 비상 시나리오 전환 확인 (A→B, A→C)',
          '[발표] 시선·인사·대화·집기 동작',
          '[발표] MOSFET 정상 확인',
          '[발표] 비상정지 정상 확인',
        ],
        dependencies: {
          receives: [],
          gives: [],
        },
      },
    },
  },
};
