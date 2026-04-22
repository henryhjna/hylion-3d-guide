# BHL 하체 전용 빌드 가이드 (HYlion 적용 버전)

> **하이리온은 Berkeley Humanoid Lite(BHL)에서 토르소 + 양다리만 가져다 씁니다. 팔은 SO-ARM101 사용 — BHL 팔 구성요소는 이 가이드에서 전부 제외했습니다.**
>
> **출처**: BHL GitBook 공식 docs, arXiv 2504.17249, T-K-233/Recoil-Motor-Controller-BESC, AS5600 modification 노트, BHL 공식 YouTube 튜토리얼.

---

## 1. 하이리온 하체 시스템 구조

```
[Intel N95 NUC]  (토르소 중앙, BHL low-level 제어 전용)
  ├─ USB ── [IM10A IMU]   USB 직결 (BHL 권장, BNO085+Arduino 브릿지 미사용)
  └─ USB ── [USB-CAN 어댑터] ×2   (다리당 1버스)
             │
             └── 1 Mbps CAN 2.0 버스 ×2 (좌다리, 우다리)
                  │
                  └── 각 관절의 BESC ×6 (좌 6 + 우 6 = 총 12개)
                       │
                       └── 3상 BLDC 모터 + AS5600 자기 엔코더
```

### 하이리온 다리 수량 (팔 제외, BHL 전체 기준이 아님)

| 항목 | 수량 | 비고 |
|---|---|---|
| 다리 자유도(DoF) | **12 DoF** (다리 2 × 6 DoF) | hip roll/yaw/pitch + knee pitch + ankle pitch/roll |
| BESC 수 (B-G431B-ESC1) | **12개** (다리당 6) | BHL 원본 총 14개 중 다리 몫만 |
| MAD M6C12 150KV (6512 액추에이터) | **8개** | 다리당 4 (hip roll/yaw/pitch + knee) |
| MAD 5010 (5010 액추에이터) | **4개** | 다리당 2 (ankle pitch/roll) — KV variant는 발주 전 BHL BOM 최종 확인 |
| AS5600 자기 엔코더 | **12개** | 관절당 1 |
| 사이클로이드 기어박스 | **12세트** (3D 프린트) | 감속비 **15:1** (M6C12, 5010 공통) |
| CAN 2.0 버스 | **2개** (다리당 1, 1 Mbps) | BHL 원본 총 4개 중 다리 몫 |
| USB-CAN 어댑터 | **2개** | 버스당 1 |
| IMU | **IM10A ×1** (USB 직결, HiPNUC) | BHL 원본 BNO085+Arduino는 레거시, IM10A가 공식 권장 |
| 배터리 1 (다리 전용) | 6S LiPo 4000 mAh, **약 30분 동작** | BHL 논문 §IV와 동일 |

### 제어 주기 (중요 — 혼동 주의)

| 루프 | 주기 | 위치 | 근거 |
|---|---|---|---|
| **MLP locomotion policy 추론** | **25 Hz** | NUC (ONNX Runtime C API) | BHL 논문 §IV |
| CAN 제어 루프 (PC ↔ ESC) | 250 Hz | NUC SocketCAN | BHL 논문 §IV |
| IMU 샘플링 | 250 Hz | NUC ← IM10A USB | BHL 논문 §IV |
| FOC 전류 루프 | ~수 kHz | BESC 내부 (STM32G431) | Recoil 펌웨어 |

> **policy = 25Hz**, **통신/제어 = 250Hz**. "policy 250Hz"는 오표기. 학생들에게 강조할 것.

---

## 2. BESC(모터 컨트롤러) 1세트 구성 — 관절당 1개 × 12 관절

BHL이 "모터 컨트롤러"를 부르는 명칭이 **BESC** (Brushless ESC) 입니다. **조립 관점에서 1 관절 = 이 블록 전체 1세트 = 총 12 세트**.

```
[CAN 버스] ──┬─────┬─────┬─────  ... 데이지체인 (다리당 6개)
               │     │     │
   ┌───────────┴───────────────────────┐
   │           BESC (관절 1개당 1개)      │
   │  ┌──────────────────────────────┐  │
   │  │ B-G431B-ESC1 보드            │  │
   │  │                              │  │
   │  │  STM32G431CB (FOC 연산)      │  │
   │  │      │                       │  │
   │  │  L6387ED 게이트드라이버         │  │
   │  │      │                       │  │
   │  │  STL180N6F7 MOSFET 3쌍 ──── 3상 출력 ──> BLDC 모터
   │  │      ▲                       │  │
   │  │  3-shunt 전류센싱             │  │
   │  │                              │  │
   │  │  CAN 트랜시버 (내장) ─ CAN ──┼──┼──> CAN 버스
   │  └──────────────────────────────┘  │
   │           │ I2C                    │
   │  ┌────────┴────────────────┐       │
   │  │ AS5600 자기 엔코더        │<── 모터축 radial 자석
   │  └─────────────────────────┘       │
   │                                    │
   │  펌웨어: Recoil-Motor-Controller-  │
   │  BESC (T-K-233, C, MIT)            │
   └────────────────────────────────────┘
```

### 관절 1개당 소요 부품 (1 세트)

| 구성요소 | 상세 | 내장/별도 |
|---|---|---|
| **B-G431B-ESC1 보드** | STM32G431CB + L6387ED + STL180N6F7 ×6 + 3-shunt 전류센싱 + CAN 트랜시버 내장 | 보드 하나로 통합 |
| **AS5600 자기 엔코더** | 12-bit I2C, R1/R4 제거 + DIR→VDD 수정 | 별도 부품 |
| **Radial 자석** | AS5600 동봉 자석 (반경 방향 자화) | AS5600에 포함 |
| **BLDC 모터** | MAD M6C12 150KV (hip·knee) or MAD 5010 (ankle) | 별도 부품 |
| **사이클로이드 기어박스** | 3D 프린트, 15:1 감속 | 3D 프린트 |
| **Recoil 펌웨어** | STM32CubeIDE로 플래시 (Run ×4 절차) | 오픈소스 |

### 관절 12개 = 소요 수량 × 12

| 부품 | 소요 × 12 관절 | 프로젝트 발주 수량 |
|---|---|---|
| B-G431B-ESC1 (BESC) | 12개 | **12개 (+스페어 2 = 14)** ✅ |
| AS5600 + radial 자석 | 12개 | **12개 (+스페어 2 = 14)** ✅ |
| BLDC 모터 | 12개 (M6C12 ×8 + 5010 ×4) | **M6C12 8 + 5010 4 = 12** ✅ |
| 사이클로이드 기어박스 (3D 프린트) | 12 세트 | **12 세트 (+스페어 2)** ✅ |
| Recoil 펌웨어 플래시 | 12회 | 오픈소스 (수량 없음) |

### CAN 버스 측면

- 다리당 1 CAN 버스 × 2 다리 = **2 버스**
- 한 버스에 BESC 6개 데이지체인 (좌: CAN ID 1/3/5/7/11/13, 우: 2/4/6/8/12/14 — BHL 원본 ID 체계)
- USB-CAN 어댑터 **2개** (NUC ↔ CAN 버스)

> **용어 관계**: BESC = B-G431B-ESC1 하드웨어 + Recoil 펌웨어. ST 공식 이름은 "B-G431B-ESC1", BHL 커뮤니티는 이 보드+펌웨어 조합을 "BESC"라 부름.

---

## 3. 액추에이터 조립 절차 (Building the Actuator 페이지 기반)

### 3-1. AS5600 엔코더 수정 ⚠️

공식 링크: https://notes.tk233.xyz/electrical/as5600-modification

BHL이 **이대로 따르라고** 명시함. 핵심 3가지:

1. **R1 제거**: VCC 포트에 5V를 사용하려면 R1 제거 필요
2. **R4 제거**: PGO 핀을 정상 작동시키려면 R4 제거 필요
3. **DIR을 VDD에 묶기**: CCW 회전을 사용하려면 DIR 패드를 VDD에 연결. 0R 점퍼로 DIR 패드를 R1 상단(VCC) 쪽에 연결 가능

저항 작업 후 VCC / GND / SDA / SCL 와이어를 해당 패드에 납땜.

### 3-2. 모터 샤프트에 자석 장착

- **엔코더에 딸려온 자석만 사용할 것** — BHL이 강조.
- 이 자석은 **반경 방향(radial)으로 자화**되어 있어서 AS5600와 작동. 일반 원형 자석은 **축 방향(axial)** 자화라 **작동하지 않음**.
- 핫글루로 모터 회전자 샤프트 끝에 고정.
- 5010 모터: 클립 사용 (문서 예시 이미지)
- M6C12 모터: 클립 대신 샤프트 끝 나사로 고정 (절차 동일)

### 3-3. 납땜 — 케이블 규격

| 용도 | 규격 | 색상 규칙 |
|---|---|---|
| 전원 | **14 AWG** stranded 실리콘 와이어 | white/red = 양극, black = 접지 |
| CAN | **30 AWG** stranded 실리콘 와이어 | yellow = CAN-H 및 SDA, green = CAN-L 및 SCL |

### 3-4. 공식 경고 (반드시 준수)

> **⚠️ CAN 포트 솔더 패드는 매우 약함**: ESC의 CAN 포트 솔더 패드는 FR4 베이스층에서 떨어져 나가기 쉬움. 케이블과 패드에 과도한 힘 금지. 납땜·취급 각별히 주의.
>
> **💡 플럭스 활용**: 엔코더와 CAN 솔더 패드는 다루기 까다로움. 플럭스를 더 바르면 견고한 조인트를 만들기 쉬움.

### 3-5. 영상 참조

- [액추에이터 조립 (BHL 공식)](https://youtu.be/CHPVXL-SsSo)
- [다리 조립 (BHL 공식)](https://youtu.be/aRtWpbteiNA) ⭐
- [전체 로봇 조립 (BHL 공식)](https://youtu.be/SIGD8I-hwG8)

---

## 4. BESC 펌웨어 플래시 (Flashing the Motor Controllers 페이지 기반)

### 4-1. 준비

```bash
git clone https://github.com/T-K-233/Recoil-Motor-Controller-BESC.git
```

STM32CubeIDE 필요. 보드 Micro USB로 PC에 연결 시 자동 감지.

### 4-2. **Run 버튼 총 4번** 절차

**Run #1 — Flash 보호 설정**
1. `Core/Inc/motor_controller_conf.h`에서 `FIRST_TIME_BOOTUP = 1`
2. "Run" 클릭
3. 새 보드면 ST-LINK 펌웨어 업데이트 수락 → 다시 Run
4. USB 재연결 (전원 재인가)

**Run #2 — 액추에이터 파라미터 설정**
1. `DEVICE_CAN_ID`: Joint ID Mapping에 맞춰 설정 (범위 `[1, 63]`)

   > **⚠️ BHL 원본 CAN ID 체계를 그대로 따르세요**. 팔 ID(9, 10)는 건너뜁니다 — BHL `calibrate_joints.py`·`ping.py` 스크립트가 원본 매핑을 가정하기 때문에, ID를 재번호하면 BHL 도구들과 호환이 깨집니다.
   >
   > **좌다리 CAN 버스 (CAN2)** — CAN ID: 1, 3, 5, 7, 11, 13
   > | CAN ID | 관절 |
   > |---|---|
   > | 1 | left_hip_roll |
   > | 3 | left_hip_yaw |
   > | 5 | left_hip_pitch |
   > | 7 | left_knee_pitch |
   > | 11 | left_ankle_pitch |
   > | 13 | left_ankle_roll |
   >
   > **우다리 CAN 버스 (CAN3)** — CAN ID: 2, 4, 6, 8, 12, 14
   > | CAN ID | 관절 |
   > |---|---|
   > | 2 | right_hip_roll |
   > | 4 | right_hip_yaw |
   > | 6 | right_hip_pitch |
   > | 8 | right_knee_pitch |
   > | 12 | right_ankle_pitch |
   > | 14 | right_ankle_roll |

2. 모터 타입 define uncomment:
   - hip/knee용: `MOTORPROFILE_MAD_M6C12_150KV`
   - ankle용: `MOTORPROFILE_MAD_5010_110KV` / `_310KV` / `_370KV` 중 선택
3. `LOAD_ID_FROM_FLASH = 0`, `LOAD_CONFIG_FROM_FLASH = 0` (Flash 무작위값 덮어쓰기)
4. Run
5. 전원 재인가 → LED가 **약 1 Hz로 깜박**이면 정상

**Run #3 — Flash 값 사용 모드로 복귀**
1. `LOAD_ID_FROM_FLASH = 1`, `LOAD_CONFIG_FROM_FLASH = 1`
2. `FIRST_TIME_BOOTUP = 0`
3. Run

**Run #4 — 최종 확정 플래시** (설정 고정)

### 4-3. 영상 참조

- [ESC 플래싱 (BHL 공식)](https://youtu.be/hUxj4s9o3TY)

---

## 5. 캘리브레이션 & 단일 액추에이터 테스트

### 5-1. CAN 활성화

USB-CAN 어댑터 연결 + 액추에이터 전원 인가 후:
```bash
sudo ip link set can0 up type can bitrate 1000000
```

### 5-2. 통신 확인 (ping)
```bash
uv run ./source/berkeley_humanoid_lite_lowlevel/scripts/motor/ping.py -c can0 -i 1
```
성공 시 `Motor is online` 출력.

### 5-3. 전기각 오프셋 캘리브레이션 ⚠️
```bash
uv run ./source/berkeley_humanoid_lite_lowlevel/scripts/motor/calibrate_electrical_offset.py -c can0 -i 1
```

> **경고**: 모터가 CCW 1회전 → CW 1회전 하며 **약 1A 전류**를 끌어감. 파워 케이블 확실히 연결, 액추에이터가 **자유롭게 돌 수 있는 상태(아무것도 안 붙은 상태)**여야 함.

- [모터 캘리브레이션 (BHL 공식)](https://youtu.be/NbDtOXiBMt0)

### 5-4. 회전 방향 반대일 때
- 3상 모터 와이어 중 아무 두 개를 맞바꾸거나,
- 펌웨어의 `MOTOR_PHASE_ORDER`를 `-1`로 변경

### 5-5. 단일 액추에이터 동작 테스트
```bash
uv run ./source/berkeley_humanoid_lite_lowlevel/scripts/motor/move_actuator.py -c can0 -i 1
```
(공식 페이지는 `move_actuator.py`로 지칭. 최신 레포에 파일명 차이가 있을 수 있으니 `scripts/motor/` 디렉터리 확인)

- 작은 kP/kD/토크 한계로 시작. `Ctrl+C`로 정지.
- [동작 테스트 (BHL 공식)](https://youtu.be/wnrsmn_R_LM)

### 5-6. 로봇 통합 후 — 조인트 영점 캘리브레이션 (매 전원 사이클)

관절에 엔코더가 모터 샤프트 쪽 **1개**뿐이라 매 전원 사이클마다 영점 재설정 필요:

```bash
python3 ./berkeley_humanoid_lite_lowlevel/robot/calibrate_joints.py
```

각 관절을 기계적 한계까지 손으로 움직이고, 끝나면 `q` 또는 조이스틱 `B` 버튼. `./calibration.yaml`에 저장.

---

## 6. 모터 특성 (Motor Characterization — 시뮬 정확도용)

| 항목 | M6C12 (6512 액추에이터) | 5010 (5010 액추에이터) |
|---|---|---|
| 극쌍(pole pair) 수 | **14** | 14 |
| 상 저항 Rq | 0.1886 Ω | 0.6193 Ω |
| 토크 상수 | 0.0919 Nm/A | 0.1176 Nm/A |
| 회전자 지름 | 68 mm | 53 mm |
| 회전자 질량 | 86 g | 47 g |
| 감속비 (사이클로이달 기어박스) | **15:1** | 15:1 |
| 반영 관성 (출력축 기준) | 0.0224 kg·m² | 0.00743 kg·m² |
| 와인딩 타입 | delta | delta |

> **와인딩 판별법 (BHL 실험)**: 두 상에 1.00V/10A 전원을 인가하고 열화상으로 권선 발열 패턴 관찰. 전체 권선의 1/3만 발열하면 delta 와인딩.

---

## 7. 기계 요소 (3D 프린트 이외)

**6512 액추에이터**
- **6811ZZ 볼베어링** 기준 사이즈 설계
- 하우징 / 사이클로이달 기어 / 입력 샤프트 / 출력 샤프트 모두 3D 프린트
- 입력 샤프트에 **황동 육각 스탠드 임베딩** (토크 전달 + 강성)

---

## 8. 하이리온 적용 순서 (학생 체크리스트)

### 조립 전 준비
1. [ ] BHL 공식 BOM을 프로젝트 `components.js`와 교차 대조
2. [ ] MAD M6C12 150KV ×8 + MAD 5010 ×4 수령 + 외관 검수 (다리만 총 12개)
3. [ ] B-G431B-ESC1 ×12 + AS5600 ×12 + 자석 ×12 수령
4. [ ] Bambu Lab X1C 등 프린터 2대 이상 풀가동 (사이클로이드 12세트 + 다리 구조물)

### 액추에이터 조립 (12개 × 동일 절차)
5. [ ] AS5600 보드 **R1 / R4 제거 + DIR → VDD 연결**
6. [ ] AS5600에 VCC/GND/SDA/SCL 납땜
7. [ ] 모터 샤프트에 **반경 자화 자석**을 핫글루로 고정
8. [ ] BESC에 3상 모터선 + 엔코더선 + CAN선 납땜 (14 AWG 전원, 30 AWG CAN, 플럭스 충분히)
9. [ ] 사이클로이드 기어박스 후가공 (리밍 + 베어링 시트 + 히트 인서트)
10. [ ] 기어박스 + 모터 + ESC 1세트 조립

### 펌웨어 + 통신
11. [ ] STM32CubeIDE로 Recoil 펌웨어 플래시 (**Run ×4** 절차), CAN ID 1~12 할당
12. [ ] USB-CAN 어댑터 ×2 연결 + SocketCAN 1 Mbps
13. [ ] `ping.py`로 ESC 12개 통신 확인
14. [ ] `calibrate_electrical_offset.py`로 전기각 캘리브 (관절당 CCW 1회전 + CW 1회전)
15. [ ] `move_actuator.py`로 단일 액추에이터 정현파 위치 추종 확인

### IMU + 다리 통합
16. [ ] **IM10A IMU** USB 직결 (Arduino 브릿지 없음!) — `test_imu.py`로 250 Hz 수신 확인
17. [ ] 좌다리 / 우다리 각각 hip roll/yaw/pitch + knee + ankle pitch/roll 순으로 조립

### NUC 보행 루프
18. [ ] NUC Ubuntu 22.04 + xanmod RT 커널 + `start_can_transports.sh`
19. [ ] ONNX Runtime C API로 MLP policy 실행 — **정책 25 Hz, CAN 제어 루프 250 Hz로 분리** 확인
20. [ ] `calibrate_joints.py`로 영점 세팅 (매 전원 사이클)
21. [ ] 공중 지그에서 보행 테스트 → 낙상감지 IM10A 임계치 튜닝

---

## 9. BHL 공식에 없어서 우리가 정해야 할 것

- **CAN 버스 종단저항 120Ω**: CAN 표준 관행. BHL 문서에는 직접 지시 없음. 우리는 **각 버스 끝에 120Ω 종단저항**을 추가하기로 (기본 관행).
- **CAN_H/CAN_L 트위스트 페어**: 일반 관행. 신호 무결성 위해 꼬아서 배선.
- **5010 KV variant 최종 확정**: 발목 2개에 110/310/370 중 어느 것을 쓸지 BHL 공식 BOM(Google Sheet)에서 최종 확인 후 발주.
- **ESD 방지**: 펌웨어 플래시·솔더링 시 ESD 팔찌 착용 권장.

---

## 10. 참고 링크 모음

- [BHL GitBook](https://berkeley-humanoid-lite.gitbook.io/docs)
- [BHL 논문 (arXiv 2504.17249)](https://arxiv.org/abs/2504.17249)
- [BHL GitHub — 메인 레포](https://github.com/HybridRobotics/Berkeley-Humanoid-Lite)
- [BHL GitHub — Lowlevel](https://github.com/HybridRobotics/Berkeley-Humanoid-Lite-Lowlevel)
- [Recoil-Motor-Controller-BESC](https://github.com/T-K-233/Recoil-Motor-Controller-BESC)
- [AS5600 Modification 노트](https://notes.tk233.xyz/electrical/as5600-modification)
- [B-G431B-ESC1 제품 페이지 (ST)](https://www.st.com/en/evaluation-tools/b-g431b-esc1.html)
- [BHL YouTube 재생목록](https://www.youtube.com/watch?v=5qgEJpEf3pQ&list=PLkKPImegJQxMdfrARhSdNrf62fLh3uQC-)
- [하이리온 Onshape CAD (팀 공유)](https://cad.onshape.com/documents/fc6443b1d89dcba950e85b60/w/94a26479973a4098a5884426/e/be3fe37849edbeadc95b9bf8)

---

*최종 업데이트: 2026-04-22 — BHL GitBook 공식 + 논문 §IV + Training Environment 페이지 기준, 팔 관련 수치 전부 제거한 하이리온 전용 버전.*
