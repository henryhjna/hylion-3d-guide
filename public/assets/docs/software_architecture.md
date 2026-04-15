# HYlion Software Architecture — 소프트웨어 아키텍처

각 보드에서 실행되는 소프트웨어 스택과 데이터 흐름.

## Mermaid 다이어그램

```mermaid
flowchart TD
    subgraph JETSON_SW ["Jetson Orin Nano - JetPack Ubuntu"]
        subgraph JETSON_INPUT ["입력 처리"]
            SW_CAM["OpenCV\nUSB Camera x3 캡처\nRGB 프레임 수집"]
            SW_WHISPER["Whisper, local\nSTT, 음성을 텍스트로"]
        end
        subgraph JETSON_BRAIN ["두뇌"]
            SW_LLM["Cloud LLM API\nGemini Flash 또는 GPT-4o mini\nWiFi 호출\n응답 생성 + 명령 분류"]
            SW_LLM_LOCAL["Local LLM fallback\nQwen 2.5 0.5B Q4, Ollama\n350MB VRAM, 35 t/s\nWiFi 끊김 시 자동 전환"]
            SW_CMDMAP["명령 매핑 테이블\nYAML 또는 JSON\n다리 명령 키 → vx vy wz 룩업"]
            SW_SMOLVLA["SmolVLA 450M, local\nLeRobot 프레임워크\nPyTorch, 비동기 추론\n카메라 영상 + 텍스트 → 관절 액션"]
        end
        subgraph JETSON_OUTPUT ["출력 처리"]
            SW_PIPER["Piper TTS, local\n텍스트를 음성 PCM으로 합성"]
            SW_UDP["UDP Client, Python\nvx vy wz를 NUC로 전송"]
            SW_LEROBOT["LeRobot ServoControl\nUSB Serial로 BusLinker 제어\nSTS3215 목표 위치 전송"]
            SW_GPIO["Jetson.GPIO\nPWM 신호 생성\n말하는 동안 입 서보 제어"]
            SW_AUDIO["ALSA 또는 PulseAudio\nPCM을 USB Speaker로 출력"]
        end
    end

    subgraph NUC_SW ["Intel N95 Mini PC - Ubuntu"]
        subgraph NUC_MAIN ["메인 컨트롤러, C"]
            SW_UDPSRV["UDP Server\n속도 명령 수신\nudp_joystick.py 호환"]
            SW_ONNX["ONNX Runtime, C API\nMLP 정책 추론, 25Hz\nIsaac Gym에서 훈련된 모델"]
            SW_SOCKETCAN["SocketCAN, Linux\nUSB-CAN 인터페이스\nCAN 프레임 송수신"]
            SW_IMUREAD["USB Serial 수신\nArduino에서 IMU 데이터 읽기"]
        end
        subgraph NUC_UTIL ["유틸리티, Python"]
            SW_CALIB["calibrate_joints.py\n전원 투입 후 관절 영점 보정"]
        end
    end

    subgraph ESC_FW ["B-G431B-ESC1 x12 - STM32G431CB\nRecoil-Motor-Controller-BESC, C 펌웨어"]
        SW_FOC["FOC 알고리즘, 수 kHz\nClarke, Park 변환\nPI 전류 제어"]
        SW_PD["PD 위치 제어기\n목표 각도 → 필요 토크 계산"]
        SW_CAN_RX["CAN 프로토콜 핸들러\n프레임 수신, ID 필터링"]
        SW_I2C["I2C 드라이버\nAS5600 인코더 읽기"]
    end

    subgraph ARDUINO_FW ["Arduino - IMU 브릿지"]
        SW_IMU_DRV["BNO085 I2C 또는 SPI 드라이버\n각속도 + 중력 벡터 읽기"]
        SW_IMU_SERIAL["USB Serial 출력\nIMU 데이터를 NUC로 전송"]
    end

    SW_WHISPER -->|텍스트| SW_LLM
    SW_LLM -.->|WiFi 끊김 시 전환| SW_LLM_LOCAL
    SW_LLM -->|항상: 응답 텍스트| SW_PIPER
    SW_LLM -->|다리 명령 키| SW_CMDMAP
    SW_LLM -->|팔 명령 텍스트| SW_SMOLVLA
    SW_LLM_LOCAL -->|항상: 응답 텍스트| SW_PIPER
    SW_LLM_LOCAL -->|다리 명령 키| SW_CMDMAP
    SW_LLM_LOCAL -->|팔 명령 텍스트| SW_SMOLVLA
    SW_CAM -->|RGB 프레임| SW_SMOLVLA

    SW_CMDMAP -->|vx vy wz| SW_UDP
    SW_PIPER -->|PCM 오디오| SW_AUDIO
    SW_PIPER -->|말하는 중 플래그| SW_GPIO
    SW_SMOLVLA -->|관절 목표 각도| SW_LEROBOT

    SW_UDP -->|Ethernet UDP| SW_UDPSRV
    SW_UDPSRV -->|속도 명령| SW_ONNX
    SW_IMUREAD -->|IMU 데이터| SW_ONNX
    SW_SOCKETCAN -->|관절 위치 피드백| SW_ONNX
    SW_ONNX -->|목표 관절 각도| SW_SOCKETCAN

    SW_SOCKETCAN -->|CAN 프레임| SW_CAN_RX
    SW_CAN_RX -->|목표 위치| SW_PD
    SW_PD -->|토크 명령| SW_FOC
    SW_I2C -->|현재 축 각도| SW_PD
    SW_I2C -.->|위치, 속도| SW_CAN_RX

    SW_IMU_DRV -->|센서 데이터| SW_IMU_SERIAL
    SW_IMU_SERIAL -->|USB Serial| SW_IMUREAD

    SW_LEROBOT -.->|서보 피드백| SW_SMOLVLA
```

## 소프트웨어 스택 요약

### Jetson Orin Nano (JetPack Ubuntu)
| 모듈 | 구현 | 역할 |
|------|------|------|
| OpenCV | Python | USB Camera ×3 캡처 |
| Whisper | Python, local | STT (음성→텍스트) |
| Cloud LLM | API 호출 | Gemini Flash / GPT-4o mini |
| Local LLM | Ollama | Qwen 2.5 0.5B Q4 (350MB VRAM, 35 t/s) |
| 명령 매핑 | YAML/JSON | 다리 명령 키 → vx vy wz |
| SmolVLA 450M | LeRobot/PyTorch | 카메라+텍스트 → 관절 액션 (비동기) |
| Piper TTS | Python, local | 텍스트 → 음성 PCM |
| UDP Client | Python | vx vy wz → NUC |
| LeRobot ServoControl | Python | USB Serial → BusLinker |
| Jetson.GPIO | Python | PWM → 입 서보 |
| ALSA/PulseAudio | System | PCM → USB Speaker |

### NUC N95 (Ubuntu)
| 모듈 | 언어 | 역할 |
|------|------|------|
| UDP Server | C | Orin에서 vx vy wz 수신 (udp_joystick.py 호환) |
| ONNX Runtime | C API | MLP policy 추론, 25Hz (Isaac Gym 모델) |
| SocketCAN | C (Linux) | USB-CAN → CAN 프레임 송수신 |
| USB Serial | C | Arduino에서 IMU 데이터 수신 |
| calibrate_joints.py | Python | 관절 영점 보정 유틸리티 |

### ESC — B-G431B-ESC1 ×12 (STM32G431CB)
| 모듈 | 역할 |
|------|------|
| Recoil-Motor-Controller-BESC | C 펌웨어 |
| FOC (수 kHz) | Clarke/Park 변환 + PI 전류 제어 |
| PD 위치 제어기 | 목표 각도 → 토크 |
| CAN 프로토콜 | 프레임 수신, ID 필터링 |
| I2C 드라이버 | AS5600 인코더 읽기 |

### Arduino — IMU 브릿지
| 모듈 | 역할 |
|------|------|
| BNO085 드라이버 | I2C/SPI로 각속도+중력 읽기 |
| USB Serial 출력 | IMU 데이터를 NUC로 전송 |
