stateDiagram-v2
    [*] --> IDLE

    state "IDLE" as IDLE {
        direction LR
        note right of IDLE
            Whisper VAD 대기 (음성 감지 시 전환)
            Orin GPU: 유휴
            NUC: BHL lowlevel 대기
            입 서보: 닫힘
        end note
    }

    state "TALKING" as TALKING {
        direction LR
        note right of TALKING
            Whisper STT (GPU) + LLM + Piper TTS
            입 서보: TTS 재생 중 open/close
            NUC: BHL lowlevel 대기 (또는 보행 유지)
        end note
    }

    state "WALKING" as WALKING {
        direction LR
        note right of WALKING
            Orin: UDP vx vy wz 전송
            NUC: ONNX 250Hz + CAN
            팔: precoded 스윙
            대화 가능 (Whisper 병행)
        end note
    }

    state "MANIPULATING" as MANIPULATING {
        direction LR
        note right of MANIPULATING
            Orin GPU: SmolVLA 450M
            카메라 x3 활성
            BusLinker x2 서보 제어
            보행 불가 (상호 배타)
        end note
    }

    state "EMERGENCY" as EMERGENCY {
        direction LR
        note right of EMERGENCY
            Battery 1 차단 (다리 전원 OFF)
            모터 토크 해제, 안전 주저앉음
            Orin 로그 유지 (Battery 2 유지)
        end note
    }

    %% 기본 전환
    IDLE --> TALKING : VAD 음성 감지
    TALKING --> IDLE : 침묵 타임아웃

    %% 대화에서 행동으로
    TALKING --> WALKING : LLM intent = walk
    TALKING --> MANIPULATING : LLM intent = arm 명령

    %% 행동 완료
    WALKING --> IDLE : 타이머 만료 또는 stop
    MANIPULATING --> IDLE : 조작 완료

    %% 보행 중 대화 (병행)
    WALKING --> TALKING : VAD 음성 감지 (보행 유지)
    TALKING --> WALKING : 대화 중 walk 명령 (대화 유지)

    %% 비상
    IDLE --> EMERGENCY : NUC 통신 두절 또는 E-stop
    TALKING --> EMERGENCY : NUC 통신 두절 또는 E-stop
    WALKING --> EMERGENCY : NUC 통신 두절 또는 E-stop
    MANIPULATING --> EMERGENCY : NUC 통신 두절 또는 E-stop

    %% FETCH 시퀀스 (오케스트레이터가 상태 전환을 순차 구동)
    state "FETCH 시퀀스 (오케스트레이터)" as FETCH {
        direction TB
        [*] --> FW1
        FW1: WALKING 전진 (타이머 T1)
        FW1 --> FS1
        FS1: 정지, NUC stable 대기
        FS1 --> FM1
        FM1: MANIPULATING SmolVLA pick
        FM1 --> FW2
        FW2: WALKING 복귀 (회전 + 타이머 T2)
        FW2 --> FS2
        FS2: 정지, NUC stable 대기
        FS2 --> FM2
        FM2: MANIPULATING precoded handover
        FM2 --> [*]
    }

    TALKING --> FETCH : LLM intent = fetch
    FETCH --> IDLE : 시퀀스 완료
