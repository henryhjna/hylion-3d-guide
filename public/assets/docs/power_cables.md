# HYlion Power Cables — 전원 배선도

2개 배터리에서 모든 부하로의 전원 분배 구성.

## Mermaid 다이어그램

```mermaid
flowchart TD
    BATT1["Battery 1\n6S LiPo 4000mAh\n22.2V nom, 25.2V max\n다리 모터 전용\nLiPo 저전압 알람 장착"]
    BATT2["Battery 2\n4S LiPo 8000mAh\n14.8V nom, 16.8V max\n연산 + 팔 + 주변기기\nLiPo 저전압 알람 장착, 14.0V 컷오프"]

    subgraph DCDC_BLOCK ["DC-DC 변환기 x3"]
        DCDC_12V_NUC["DC-DC #1, buck-boost 권장\n14.8V to 12V, 3A\nNUC 전용"]
        DCDC_12V_ARM["DC-DC #2, buck-boost 권장\n14.8V to 12V, 15A\n팔 서보 전용"]
        DCDC_5V["DC-DC #3\n14.8V to 5V, 3A\nUSB Hub 전원"]
    end

    subgraph LOAD_24V ["24V 직결 - 다리 ESC x12"]
        ESC_L["좌다리 ESC x6\nB-G431B-ESC1\n전원 데이지 체인"]
        ESC_R["우다리 ESC x6\nB-G431B-ESC1\n전원 데이지 체인"]
    end

    subgraph MOTOR_L ["좌다리 모터 x6"]
        ML["ESC → BLDC Motor\n3상 전력선 x6\nM6C12 x4 + 5010 x2"]
    end

    subgraph MOTOR_R ["우다리 모터 x6"]
        MR["ESC → BLDC Motor\n3상 전력선 x6\nM6C12 x4 + 5010 x2"]
    end

    subgraph LOAD_14V ["14.8V 직결"]
        JETSON["Jetson Orin Nano\n9-20V 허용, 15W max"]
    end

    subgraph LOAD_12V_NUC ["12V - NUC 단독"]
        NUC["NUC N95 Mini PC\n12V, 15-20W"]
    end

    subgraph LOAD_12V_ARM ["12V - 팔 서보"]
        BL_L["BusLinker 좌팔 x1\n→ STS3215 x6 분배\n12V, peak 6A"]
        BL_R["BusLinker 우팔 x1\n→ STS3215 x6 분배\n12V, peak 6A"]
    end

    subgraph LOAD_5V ["5V - 주변기기"]
        HUB_A["USB Hub A x1\n센서/입력용"]
        HUB_B["USB Hub B x1\n출력/제어용"]
    end

    subgraph LOAD_GPIO ["Jetson GPIO 5V"]
        MOUTH["Mouth Servo x1\nSG90급, 5V, 250mA"]
    end

    BATT1 -->|"XT60, 24V"| ESC_L
    BATT1 -->|"XT60 분기, 24V"| ESC_R
    ESC_L -->|"3상 전력선 x6"| ML
    ESC_R -->|"3상 전력선 x6"| MR

    BATT2 -->|"XT60, 14.8V 직결"| JETSON
    BATT2 -->|"XT60 분기"| DCDC_12V_NUC
    BATT2 -->|"XT60 분기, 14AWG 이상"| DCDC_12V_ARM
    BATT2 -->|"XT60 분기"| DCDC_5V

    DCDC_12V_NUC -->|"DC 배럴잭, 12V 3A"| NUC
    DCDC_12V_ARM -->|"DC 피그테일, 12V"| BL_L
    DCDC_12V_ARM -->|"DC 피그테일, 12V"| BL_R

    DCDC_5V -->|"DC 5V"| HUB_A
    DCDC_5V -->|"DC 5V"| HUB_B

    JETSON -->|"GPIO 핀 5V + GND"| MOUTH
```

## 전원 요약

### Battery 1 — 다리 전용 (6S LiPo 4000mAh, 22.2V)
| 부하 | 전압 | 연결 | 비고 |
|------|------|------|------|
| ESC ×6 좌다리 | 24V 직결 | XT60 | 데이지 체인 |
| ESC ×6 우다리 | 24V 직결 | XT60 분기 | 데이지 체인 |

### Battery 2 — 연산+팔+주변기기 (4S LiPo 8000mAh, 14.8V)
| 부하 | 전압 | 변환 | 연결 |
|------|------|------|------|
| Jetson Orin | 14.8V 직결 | 없음 (9-20V 허용) | XT60 |
| NUC N95 | 12V | DC-DC #1 (buck-boost, 3A) | DC 배럴잭 |
| BusLinker ×2 (팔 서보) | 12V | DC-DC #2 (buck-boost, 15A) | DC 피그테일 |
| USB Hub A + B | 5V | DC-DC #3 (3A) | DC 5V |
| Mouth Servo | 5V | Jetson GPIO | PWM + 5V + GND |

### 안전
- 양쪽 배터리에 LiPo 저전압 알람 장착
- Battery 2: 14.0V 컷오프
- NC 비상정지: Battery 1 차단 (Battery 2 유지, Orin 로그 보존)
