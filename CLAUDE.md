# HYlion 3D Guide — CLAUDE.md

## 프로젝트 개요

한양대 하이리온 Physical AI 로봇의 **인터랙티브 3D 비주얼 가이드**.
팀원 5명(δ1, δ2, δ3, ε1, ε2)이 온보딩, 주차별 할일, 시스템 이해, 발표 쇼케이스에 사용.

**설계 철학:** "나는 지금 어디에 있고, 다음에 뭘 하면 되고, 그게 전체에서 어떤 의미인지를 체감시키는 것."

## 기술 스택

| 도구 | 버전 | 용도 |
|------|------|------|
| Vite | 8.x | 빌드 도구 |
| React | 19.x | UI |
| Three.js | 0.183 | 3D 렌더링 |
| React Three Fiber | 9.x | React ↔ Three.js |
| @react-three/drei | 10.x | 3D 헬퍼 |
| Tailwind CSS | 4.x | 유틸리티 CSS |
| GSAP | 3.x | 애니메이션 |
| react-markdown | latest | 문서 렌더링 |

## 명령어

```bash
npm install    # 의존성 설치
npm run dev    # 개발 서버 (localhost:5173)
npm run build  # 프로덕션 빌드
```

## 디렉토리 구조

```
hylion-3d-guide/
├── public/
│   └── assets/
│       ├── docs/
│       │   ├── 기획서_v13.md           # AI 코파일럿이 런타임에 읽음
│       │   └── 실행가이드_v13.md        # 문서 업데이트 시 자동 반영
│       └── models/                     # glTF 모델 (향후)
├── src/
│   ├── components/
│   │   ├── Scene3D.jsx                 # R3F Canvas + 조명 + 파티클
│   │   ├── RobotModel.jsx             # Multi-Layer 로봇 + 홀로그램
│   │   ├── HologramShader.jsx         # Layer 3 홀로그램 셰이더
│   │   ├── CameraController.jsx       # 카메라 프리셋 + 트랜지션
│   │   ├── Navigation.jsx             # 상단 탭 (4뷰) + 필터 + 검색 + 설정
│   │   ├── PartInfoPanel.jsx          # 우측 파트 상세 패널
│   │   ├── Timeline.jsx               # 하단 Week 0~10 타임라인
│   │   ├── ArchitectureView.jsx       # X-ray 모드
│   │   ├── StateMachine.jsx           # SVG 상태 전환 다이어그램
│   │   ├── ScenarioFlow.jsx           # 시연 시나리오 시뮬레이터
│   │   ├── MemberDashboard.jsx        # My View 개인 대시보드 + 체크리스트
│   │   ├── DocsSearch.jsx             # Cmd+K 문서 즉시 검색
│   │   ├── AICopilot.jsx              # Claude API 채팅 패널
│   │   ├── SettingsModal.jsx          # API 키 설정 모달
│   │   └── TeamOverlay.jsx            # 멤버 파트 오버레이
│   ├── data/
│   │   ├── parts.js                   # 파트별 데이터 (스펙, 카메라)
│   │   ├── timeline.js                # 주차별 요약 (미니 타임라인용)
│   │   ├── techTree.js                # ★ 노드 기반 의존성 맵 (60+ 노드)
│   │   ├── members.js                 # ★ 멤버별 주차별 작업 + 의존성
│   │   ├── architecture.js            # 시스템 아키텍처
│   │   └── team.js                    # 팀 기본 정보
│   ├── hooks/
│   │   ├── useDocsSearch.js           # 문서 인덱싱 + 검색 로직
│   │   └── useAICopilot.js            # Claude API 호출 + 컨텍스트
│   ├── styles/globals.css
│   ├── App.jsx                        # 메인 레이아웃 + 전역 상태
│   └── main.jsx
├── CLAUDE.md
├── package.json
└── vite.config.js
```

## 뷰 구조 (4 탭)

| 탭 | 설명 |
|----|------|
| 🤖 로봇 탐색 | 3D 파트 클릭 → 줌인 → 스펙/담당자/작업 |
| 🌳 테크트리 | 노드 기반 의존성 맵 (주차별 작업 + 게이트) |
| 🔧 아키텍처 | X-ray 투시 (컴퓨팅 노드 + 리소스 + 전원) |
| 🎬 시나리오 | 시연 시나리오 시뮬레이터 (레벨 A/B/C) |

### 항상 표시
- 하단: 미니 타임라인 바 (현재 주차 + 게이트)
- 좌측 하단: Progress 위젯 (파트별 완성도)
- 우측 하단: AI 코파일럿 채팅 버튼
- 상단 우측: 멤버 선택 (δ1~ε2) + 🔍 검색 + ⚙️ 설정
- Cmd/Ctrl+K: 문서 즉시 검색 모달

## 핵심 기능

### 1. My View — 멤버별 대시보드
- 멤버 선택 → 이번 주 체크리스트 + 핵심 목표 + 의존성
- 체크리스트 상태는 localStorage에 저장
- 3D 뷰에서 담당 파트만 풀 컬러, 나머지 반투명

### 2. 문서 즉시 검색 (Cmd+K)
- `public/assets/docs/` 마크다운을 섹션 단위 인덱싱
- 키워드 → 즉시 검색 → 원문 보기 → 코파일럿 연계
- API 키 불필요, 오프라인 동작

### 3. AI 코파일럿
- Claude API (claude-sonnet-4-20250514)
- system prompt에 기획서+실행가이드 전문 주입
- 현재 컨텍스트(뷰, 파트, 멤버, 주차) 실시간 인식
- API 키: localStorage + Settings 모달

### 4. 게이트 배너
- Phase 1/2/3/합류 게이트 주차에서 상단 배너 표시
- 조건 목록 + 진행률

### 5. Progress 위젯
- 주차 기반 파트별 완성도 자동 계산
- 좌측 하단 미니 위젯

### 6. 홀로그램 셰이더 (Layer 3)
- 모델 없는 파트용 와이어프레임 + 네온 엣지 + 스캔라인
- `HologramShader.jsx`의 커스텀 ShaderMaterial

## 데이터 파일 핵심

### techTree.js (~60+ 노드)
- 실행가이드의 모든 체크리스트를 노드로 변환
- 노드 간 의존성 화살표
- 게이트(⚡), 체크포인트(▲), 합류(★★) 표시
- 크리티컬 패스 자동 계산 가능

### members.js (5명 × 11주)
- 멤버별 주차별 체크리스트
- 의존성 (← 받는 것, → 주는 것)
- 기획서 6.2절 협업 구조 기반

## 상태 관리 (App.jsx)

| 상태 | 타입 | 용도 |
|------|------|------|
| `currentView` | string | 4가지 뷰 탭 |
| `selectedPart` | string? | 선택된 파트 ID |
| `selectedWeek` | number? | 선택된 주차 (자동 감지) |
| `hoveredPart` | string? | 호버 중인 파트 |
| `xrayMode` | boolean | X-ray 투시 모드 |
| `showStateMachine` | boolean | 상태 머신 오버레이 |
| `teamFilter` | string? | 멤버 필터 |
| `trackFilter` | string? | 트랙 필터 (A/B) |
| `showDocsSearch` | boolean | 문서 검색 모달 |
| `showSettings` | boolean | 설정 모달 |
| `copilotPrefill` | string | 코파일럿 프리필 |

## Multi-Layer 3D 렌더링

```
Layer 1 (정밀): SO-ARM, BHL → URDF/STL → glTF
  → 솔리드, 메탈릭, 관절 회전

Layer 2 (프로젝트): 머리 (Blender), 토르소 (CAD), 내부 부품
  → 솔리드 또는 반투명

Layer 3 (홀로그램): 외장, placeholder, 미완성 파트
  → 와이어프레임 + 네온 엣지 + 스캔라인
  → HologramShader.jsx
```

## 향후 작업

### Phase 2 (킬러 피처)
- [ ] TechTree.jsx 풀 구현 (SVG/Canvas 노드 렌더링)
- [ ] 크리티컬 패스 자동 계산
- [ ] Dependencies 네온 라인 시각화

### Phase 3 (시네마틱)
- [ ] 60초 온보딩 시네마틱
- [ ] 시나리오 시뮬레이터 3D 연동 (레벨 A/B/C)

### Phase 4 (모델 교체)
- [ ] SO-ARM URDF → glTF 변환 (Layer 1)
- [ ] BHL URDF → glTF 변환 (Layer 1)
- [ ] 머리 Blender → glTF (Layer 2)
- [ ] 반응형 레이아웃

## 참고 에셋

```
../asserts/
├── model.fbx               # 3D 모델 (FBX)
├── hyurion_rig.blend        # Blender 리깅 파일
├── 기획서_v13.md            # 기획서 원본
├── 실행가이드_v13.md        # 실행가이드 원본
└── docs/                    # 11개 카테고리 기술 문서
    ├── SO-ARM100/           # SO-ARM101 스펙, BOM
    ├── BHL/                 # Berkeley Humanoid Lite
    ├── SmolVLA/             # VLA 모델 + LeRobot
    ├── Orin/                # Jetson Orin Nano Super
    ├── IsaacLab/            # 시뮬레이션
    ├── Groq/                # 클라우드 추론 API
    ├── Dynamixel/           # XL430 목 서보
    ├── MediaPipe/           # 시선 추적
    ├── Audio/               # Whisper, Piper TTS
    ├── ROS2/                # 미들웨어
    └── Safety/              # BNO085 낙상 감지, NC 비상정지
```

## 주의사항

- Google Drive에서 `npm install` → EPERM 에러 → 로컬(C:/Projects/)에서 작업 후 복사
- Three.js 번들 ~1.1MB → 필요시 dynamic import
- `public/assets/docs/`의 문서를 업데이트하면 AI 코파일럿 + 문서 검색 자동 반영
- API 키는 localStorage → 서버 전송 없음
- techTree.js/members.js가 데이터의 심장 → 실행가이드 업데이트 시 동기화 필요
