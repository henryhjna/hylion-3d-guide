# HYlion Signal Flow — 전체 신호 흐름도

로봇의 센서 입력부터 액추에이터 출력까지의 전체 신호 흐름.

## Mermaid 다이어그램

```mermaid
flowchart TD
    S0["S0. User\n음성으로 명령"]
    S1["S1. USB Microphone\n음성을 디지털 신호로 변환"]
    S2["S2. USB Camera x3\n좌 그리퍼 + 우 그리퍼 + 외부"]

    subgraph JETSON ["S3. Jetson Orin Nano"]
        S3a["S3a. STT\nWhisper 등, local 실행\n음성을 텍스트로 변환"]
        S3b["S3b. Cloud LLM\nGemini Flash 또는 GPT-4o mini\nWiFi API 호출, 응답+명령 분류\nfallback: Qwen 2.5 0.5B Q4, local"]
        S3c["S3c. TTS\nPiper TTS, local\n응답 텍스트를 음성으로 합성"]
        S3d["S3d. 명령 매핑, 다리용\n미리 정의된 명령 테이블에서\nvx vy wz 룩업"]
        S3e["S3e. SmolVLA 450M, 팔용, 항상 local\nLeRobot/PyTorch, 비동기 추론\n텍스트 + 카메라 영상 → 관절 액션"]
    end

    subgraph LEG ["다리 - BHL"]
        L1["L1. Intel N95 Mini PC\nONNX Runtime C API, MLP 25Hz\nIsaac Gym 모델"]
        L2["L2. USB-CAN Adapter x2\nUSB를 CAN으로 변환\n다리당 1개"]
        L3["L3. CAN Bus x2\n2가닥 배선, 1Mbps\n다리당 1버스"]
        L4["L4. B-G431B-ESC1 x12\nSTM32 FOC, 수 kHz"]
        L5["L5. BLDC Motor x12\nMAD M6C12 x8 + MAD 5010 x4"]
        L6["L6. Cycloidal Gearbox x12\n3D 프린트 감속기"]
        L7["L7. Leg Joint x12\nhip, knee, ankle 등"]
        LF1["LF1. AS5600 Encoder x12\n모터 축 각도 측정"]
        LF2["LF2. BNO085 IMU\n몸체 기울기 측정"]
        LF3["LF3. Arduino\nIMU용 USB 브릿지"]
    end

    subgraph ARM ["팔 - SO-ARM101 x2"]
        A1["A1. BusLinker Controller x2\nUSB Serial 서보 어댑터\n팔당 1개"]
        A2["A2. STS3215 Servo x12\n6개씩 양팔, 30kg 토크\n12-bit 자석 인코더 내장"]
        A3["A3. Arm Joint x2\n각 6DOF, 5축 + Gripper"]
    end

    subgraph MOUTH ["입"]
        M1["M1. USB Speaker\n합성 음성 출력"]
        M2["M2. Mouth Servo x1\nGPIO PWM 직접 구동\n말하는 동안 입 개폐"]
    end

    S0 -->|음파| S1
    S1 -->|USB PCM 오디오| S3a
    S2 -->|USB RGB 영상 x3| S3e
    S3a -->|텍스트| S3b

    S3b -->|항상: 응답 텍스트| S3c
    S3b -->|다리 명령일 때| S3d
    S3b -->|팔 명령일 때| S3e

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
    LF2 -->|I2C 또는 SPI| LF3
    LF3 -.->|USB, 각속도+중력| L1

    S3e -->|USB Serial x2, 목표 각도| A1
    A1 -->|TTL Serial Bus, 서보 ID+위치| A2
    A2 -->|서보 출력축 회전| A3

    A2 -.->|TTL Serial, 현재 위치| A1
    A1 -.->|USB Serial, 관절 상태| S3e
```

## 신호 경로 요약

### 음성 대화 경로
User → USB Mic → **Orin Whisper STT (local)** → Cloud LLM (Gemini Flash / GPT-4o mini, fallback: Qwen 2.5 0.5B Q4 Ollama) → Piper TTS (local) → USB Speaker (ALSA/PulseAudio PCM) + 입 서보 (Jetson.GPIO PWM)

### 팔 조작 경로 (SmolVLA)
Cloud LLM (명령 분류) → **Orin SmolVLA 450M** (LeRobot/PyTorch, 비동기 추론) ← USB Camera ×3 (OpenCV)
→ BusLinker ×2 (LeRobot ServoControl, USB Serial) → STS3215 ×12 (TTL Bus) → 관절 ×12
← STS3215 위치 피드백 (TTL → USB)

### 다리 보행 경로 (Walking RL)
Cloud LLM (명령 분류) → Orin 명령 매핑 (YAML/JSON 테이블, vx vy wz 룩업) → UDP Client (Python)
→ **NUC** (UDP Server, udp_joystick.py 호환) → RL Policy (ONNX Runtime C API, MLP 25Hz, Isaac Gym 모델)
→ SocketCAN → USB-CAN ×2 → CAN Bus ×2 → ESC ×12 (Recoil-BESC, FOC 수kHz) → BLDC ×12 → 기어박스 ×12 → 관절 ×12
← AS5600 인코더 (I2C → ESC → CAN → NUC)
← BNO085 IMU (Arduino I2C/SPI → USB Serial → NUC)
