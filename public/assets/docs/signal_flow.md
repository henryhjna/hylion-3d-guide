# Signal Flow

로봇의 센서 입력부터 액추에이터 출력까지의 전체 신호 흐름.

```mermaid
flowchart TD
    S0["S0. User\n음성으로 명령"]
    S1["S1. USB Microphone\n음성을 디지털 신호로 변환"]
    S2["S2. USB Camera x3\n좌 그리퍼 + 우 그리퍼 + 외부"]

    subgraph JETSON ["S3. Jetson Orin Nano Super (25W MAXN)"]
        S3a["S3a. STT\nWhisper, local 실행\n음성을 텍스트로 변환"]
        S3b["S3b. Cloud LLM\nGemini Flash 또는 GPT-4o mini\nWiFi 또는 테더링으로 API 호출\nfallback: Qwen 2.5 0.5B Q4, local"]
        S3f["S3f. 오케스트레이터\nPython FSM, 상태 전환 관리\nFETCH 시퀀서\nNUC 피드백 수신"]
        S3c["S3c. Piper TTS, local\n응답 텍스트를 음성으로 합성"]
        S3d["S3d. 명령 매핑, 다리용\n미리 정의된 명령 테이블에서\nvx vy wz 룩업"]
        S3e["S3e. SmolVLA 450M, 팔용, 항상 local\n텍스트 + 카메라 영상으로\n관절 액션 생성"]
    end

    subgraph LEG ["다리 - BHL"]
        L1["L1. Intel N95 Mini PC\nRL Policy, MLP via ONNX\npolicy 25Hz + CAN 제어 250Hz\n(BHL 논문 기준)"]
        L2["L2. USB-CAN Adapter x2\nUSB를 CAN으로 변환\n다리당 1개"]
        L3["L3. CAN Bus x2\n2가닥 배선, 1Mbps\n다리당 1버스"]
        L4["L4. B-G431B-ESC1 (BESC) x12\n보드당: STM32G431CB + L6387 ×3 + STL180N6F7 ×6\n3-shunt 전류센싱 + FDCAN 온보드 트랜시버\nRecoil 펌웨어: FOC 수kHz, CAN 250Hz"]
        L5["L5. BLDC Motor x12\nMAD M6C12 150KV x8 (hip·knee) + MAD 5010 x4 (ankle)\n극쌍 14, delta 와인딩"]
        L6["L6. Cycloidal Gearbox x12\n3D 프린트 감속기\n감속비 15:1 (BHL 공식)"]
        L7["L7. Leg Joint x12\nhip, knee, ankle 등"]
        LF1["LF1. AS5600 Encoder x12\n모터 축 각도 측정"]
        LF2["LF2. IM10A IMU (USB 직결)\n몸체 기울기 측정\nBHL 공식 권장"]
    end

    subgraph ARM ["팔 - SO-ARM101 x2"]
        A1["A1. BusLinker Controller x2 (Follower)\nUSB ↔ TTL Feetech SCServo 어댑터\n팔당 1개 (Leader arm용 별도 ×2 필요)"]
        A2["A2. STS3215 Pro 12V Servo x12\n6개씩 양팔, stall 30kg·cm\n12-bit 자석 인코더 내장\nFollower 기어비 1/345"]
        A3["A3. Arm Joint x12\n양팔 × 6DOF\n(shoulder_pan/lift + elbow_flex + wrist_flex/roll + gripper)"]
    end

    subgraph MOUTH ["입"]
        M1["M1. USB Speaker\n합성 음성 출력"]
        M2["M2. Mouth Servo x1\nGPIO PWM 직접 구동\n말하는 동안 입 개폐"]
    end

    S0 -->|음파| S1
    S1 -->|USB PCM 오디오| S3a
    S2 -->|USB RGB 영상 x3| S3e
    S3a -->|텍스트| S3b
    S3b -->|intent + 응답 텍스트| S3f

    S3f -->|항상: 응답 텍스트| S3c
    S3f -->|다리 명령일 때| S3d
    S3f -->|팔 명령일 때| S3e

    S3c -->|USB 오디오, 합성 음성| M1
    S3c -->|GPIO PWM, 말하는 중 신호| M2

    S3d -->|Ethernet UDP, vx vy wz| L1
    L1 -->|USB, 목표 각도| L2
    L2 -->|CAN 2.0 프레임| L3
    L3 -->|CAN 2.0, ID 매칭| L4
    L4 -->|3-phase PWM| L5
    L5 -->|고속 저토크 회전| L6
    L6 -->|저속 고토크 회전| L7

    L5 -.-|모터 축 장착| LF1
    LF1 -->|I2C, 축 각도| L4
    L4 -.->|CAN에서 USB, 위치+속도| L1
    L7 -.-|몸체 자세 변화| LF2
    LF2 -.->|USB 직결, 각속도+중력| L1

    L1 -.->|Ethernet UDP, 보행 상태+IMU stable| S3f

    S3e -->|USB Serial x2, 목표 각도| A1
    A1 -->|TTL Serial Bus, 서보 ID+위치| A2
    A2 -->|서보 출력축 회전| A3

    A2 -.->|TTL Serial, 현재 위치| A1
    A1 -.->|USB Serial, 관절 상태| S3e

    classDef human fill:#2a2a3a,stroke:#888780,stroke-width:1.5px,color:#e0ddd5
    classDef sensor fill:#0d2a28,stroke:#4ecdc4,stroke-width:1.5px,color:#e0ddd5
    classDef brain fill:#1e1040,stroke:#c084fc,stroke-width:2px,color:#e0ddd5
    classDef comm fill:#1a2040,stroke:#6e8efb,stroke-width:1.5px,color:#e0ddd5
    classDef actuator fill:#2a1f10,stroke:#f7a046,stroke-width:1.5px,color:#e0ddd5
    classDef mech fill:#2a1018,stroke:#e85d75,stroke-width:1.5px,color:#e0ddd5

    class S0 human
    class S1,S2,LF1,LF2 sensor
    class S3a,S3b,S3c,S3d,S3e,S3f,L1,L4 brain
    class L2,L3,A1 comm
    class L5,A2,M1,M2 actuator
    class L6,L7,A3 mech
```

## 신호 경로 요약

### 음성 대화 경로
User → USB Mic → **Orin Whisper STT (local)** → Cloud LLM (Gemini Flash / GPT-4o mini) → 오케스트레이터 → Piper TTS (local) → USB Speaker + 입 서보 (GPIO PWM)

### 팔 조작 경로 (SmolVLA)
오케스트레이터 (팔 명령) → **SmolVLA 450M** (LeRobot/PyTorch) ← USB Camera ×3 (OpenCV)
→ BusLinker ×2 (USB Serial) → STS3215 ×12 (TTL Bus) → 관절 ×12
← 서보 위치 피드백 (TTL → USB)

### 다리 보행 경로 (Walking RL)
오케스트레이터 (다리 명령) → 명령 매핑 (YAML/JSON, vx vy wz) → UDP Client
→ **NUC** (UDP Server) → RL Policy (ONNX Runtime C API, MLP policy 25Hz — BHL 논문 기준; CAN 제어 루프 250Hz)
→ SocketCAN → USB-CAN ×2 → CAN Bus ×2 → ESC ×12 (Recoil-BESC, FOC) → BLDC ×12 → 기어박스 ×12 → 관절 ×12
← AS5600 인코더 (I2C → ESC → CAN → NUC)
← IM10A IMU (USB 직결 → NUC, BHL 공식 권장)
← NUC → Orin (UDP 보행 상태 + IMU stable)