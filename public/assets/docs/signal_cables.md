# HYlion Signal Cables — 신호 케이블 배선도

Orin과 NUC의 물리 포트별 연결 구성. USB Hub, CAN 데이지 체인, TTL 데이지 체인 포함.

## Mermaid 다이어그램

```mermaid
flowchart TD
    subgraph JETSON_PORTS ["Jetson Orin Nano Super 포트"]
        J_USB1["USB 포트 1"]
        J_USB2["USB 포트 2"]
        J_ETH["Ethernet 포트"]
        J_GPIO["GPIO 40핀 헤더\nPWM + 5V + GND"]
    end

    subgraph HUB_SENSOR ["USB Hub A - 센서/입력"]
        HA["유전원 USB Hub\n4포트 이상"]
    end

    subgraph HUB_CTRL ["USB Hub B - 출력/제어"]
        HB["유전원 USB Hub\n4포트 이상"]
    end

    MIC["S1. USB Mic"]
    CAM1["S2a. Camera 좌 그리퍼"]
    CAM2["S2b. Camera 우 그리퍼"]
    CAM3["S2c. Camera 외부"]

    SPK["M1. USB Speaker"]
    BL_L["A1a. BusLinker 좌팔"]
    BL_R["A1b. BusLinker 우팔"]
    MOUTH["M2. Mouth Servo"]

    subgraph NUC_PORTS ["NUC N95 포트"]
        N_ETH["Ethernet 포트"]
        N_USB1["USB 포트 1"]
        N_USB2["USB 포트 2"]
        N_USB3["USB 포트 3"]
    end

    USBCAN_L["L2a. USB-CAN 좌다리"]
    USBCAN_R["L2b. USB-CAN 우다리"]
    IMU["LF2. IM10A IMU (USB 직결)"]

    subgraph CAN_LEFT ["좌다리 CAN 데이지 체인"]
        EL1["ESC #1"] --> EL2["#2"] --> EL3["#3"] --> EL4["#4"] --> EL5["#5"] --> EL6["#6"]
    end

    subgraph CAN_RIGHT ["우다리 CAN 데이지 체인"]
        ER1["ESC #7"] --> ER2["#8"] --> ER3["#9"] --> ER4["#10"] --> ER5["#11"] --> ER6["#12"]
    end

    subgraph SV_LEFT ["좌팔 TTL 데이지 체인"]
        SL1["Servo #1"] --> SL2["#2"] --> SL3["#3"] --> SL4["#4"] --> SL5["#5"] --> SL6["#6"]
    end

    subgraph SV_RIGHT ["우팔 TTL 데이지 체인"]
        SR1["Servo #7"] --> SR2["#8"] --> SR3["#9"] --> SR4["#10"] --> SR5["#11"] --> SR6["#12"]
    end

    J_USB1 -->|USB-A| HA
    J_USB2 -->|USB-A| HB
    J_ETH -->|Ethernet| N_ETH
    J_GPIO -->|PWM 1선 + 5V + GND| MOUTH

    HA -->|USB| MIC
    HA -->|USB| CAM1
    HA -->|USB| CAM2
    HA -->|USB| CAM3

    HB -->|USB| SPK
    HB -->|USB-C| BL_L
    HB -->|USB-C| BL_R

    N_USB1 -->|USB| USBCAN_L
    N_USB2 -->|USB| USBCAN_R
    N_USB3 -->|USB 직결| IMU

    USBCAN_L -->|CAN_H + CAN_L 2선| EL1
    USBCAN_R -->|CAN_H + CAN_L 2선| ER1

    BL_L -->|TTL 3핀| SL1
    BL_R -->|TTL 3핀| SR1
```

## 포트 배정 요약

### Jetson Orin Nano Super (USB 2개 + Ethernet + GPIO)
| 포트 | 연결 대상 | 케이블 |
|------|----------|--------|
| USB 1 | USB Hub A (센서) | USB-A |
| USB 2 | USB Hub B (제어) | USB-A |
| Ethernet | NUC N95 | CAT6 ~30cm |
| GPIO | Mouth Servo (SG90급) | PWM + 5V + GND |

### USB Hub A — 센서/입력 (5V from DC-DC #3)
| 포트 | 장치 |
|------|------|
| 1 | USB Microphone |
| 2 | Camera 좌 그리퍼 |
| 3 | Camera 우 그리퍼 |
| 4 | Camera 외부 (머리) |

### USB Hub B — 출력/제어 (5V from DC-DC #3)
| 포트 | 장치 | 케이블 |
|------|------|--------|
| 1 | USB Speaker | USB |
| 2 | BusLinker 좌팔 | USB-C |
| 3 | BusLinker 우팔 | USB-C |

### NUC N95 (3 USB + 1 Ethernet)
| 포트 | 연결 대상 | 하위 체인 |
|------|----------|----------|
| USB 1 | USB-CAN 좌다리 | → CAN 데이지 ESC #1~#6 |
| USB 2 | USB-CAN 우다리 | → CAN 데이지 ESC #7~#12 |
| USB 3 | IM10A IMU | USB 직결 (BHL 공식 권장, 브릿지 불필요) |
| Ethernet | Orin | UDP vx vy wz |
