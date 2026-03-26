# DGX Spark 환경 가이드

HYlion 프로젝트에서 사용하는 DGX Spark 워크스테이션의 설치 환경과 실행 방법을 정리한다.

---

## 1. Isaac Sim (소스 빌드)

| 항목 | 값 |
|------|-----|
| 경로 | `~/IsaacSim/` |
| 빌드 | `~/IsaacSim/_build/linux-aarch64/release/` |
| 실행 | `${ISAACSIM_PATH}/isaac-sim.sh` |
| 용도 | 로봇 시뮬레이션 플랫폼 |

DGX Spark는 aarch64(ARM) 아키텍처이므로 소스 빌드가 필요하다. 사전 빌드된 x86 바이너리는 사용 불가.

---

## 2. Isaac Lab

| 항목 | 값 |
|------|-----|
| 경로 | `~/IsaacLab/` |
| 실행 | `./isaaclab.sh -p ...` |
| 용도 | BHL Walking RL 학습 |

### DGX Spark 물리 엔진 제약

**핵심 제약:** DGX Spark(GB10, SM 12.1 Blackwell)에서 **PhysX GPU 가속이 지원되지 않는다.** PhysX CPU 모드로는 RL 훈련 속도가 실용적이지 않다.

**해결 경로 — Newton 물리 백엔드:**
- Newton은 Isaac Lab 3.0 beta(develop 브랜치)에서 제공되는 대안 물리 백엔드
- DGX Spark에서 Newton GPU 가속 동작 여부는 **Week 0에 반드시 검증 필요**
- 검증 항목: 환경 로드 성공, 10-step 학습 루프 실행, throughput(steps/sec) 측정

### BHL → Isaac Lab 3.0 마이그레이션 (선행 필요)

BHL 공식 스택은 Isaac Lab 2.1.0 + Isaac Sim 4.5.0(PhysX). DGX Spark에서 GPU 가속 훈련을 하려면 Isaac Lab 3.0으로 마이그레이션이 필요하다:

```bash
git clone -b develop https://github.com/isaac-sim/IsaacLab.git
# Isaac Sim 6.0-dev + isaaclab_newton 백엔드 설치
```

**주요 변경점:**
- Articulation, ContactSensor 등 asset 클래스 API 변경
- quaternion convention: wxyz → xyzw
- Newton 프리셋 환경 설정 추가
- Isaac Lab 3.0 Migration Guide 참조

### JIT 컴파일

- DGX Spark 첫 실행 시 SM 12.1용 NVCC **JIT 컴파일에 약 1시간 이상** 소요
- 약 42개 커널 컴파일, `~/.cache/warp/`에 ~436MB 캐시 생성
- **Week 0에 반드시 선행** — 이후 실행부터는 캐시 활용으로 정상 속도

### PhysX CPU 폴백

마이그레이션 완료 전까지 PhysX CPU 모드로 환경 검증은 가능:
```bash
cd ~/IsaacLab && ./isaaclab.sh -p ... --device cpu
```
단, 훈련 속도가 매우 느려서 실제 RL 학습에는 부적합. 환경 로드·기본 동작 확인 용도로만 사용.

---

## 3. SO-ARM101 시뮬레이션

| 항목 | 값 |
|------|-----|
| 경로 | `~/isaac_so_arm101/` |
| 가상환경 | `~/isaac_so_arm101/.venv/` |
| 실행 | `cd ~/isaac_so_arm101 && uv run random_agent --task Isaac-SO-ARM101-Reach-Play-v0` |
| 용도 | SO-ARM 시뮬레이션 (프로젝트에 직접 쓰이진 않음) |

SO-ARM101의 Isaac Lab 환경 테스트 용도. 실제 프로젝트에서는 실물 팔 + LeRobot 텔레오퍼레이션을 사용한다.

---

## 4. Berkeley Humanoid Lite (BHL) — 핵심

| 항목 | 값 |
|------|-----|
| 경로 | `~/Berkeley-Humanoid-Lite/` |
| 용도 | 하체 Walking RL 학습 (프로젝트 핵심) |

### 실행 명령
```bash
cd ~/IsaacLab && ./isaaclab.sh -p \
  ~/Berkeley-Humanoid-Lite/scripts/rsl_rl/train_new.py \
  --task Velocity-Berkeley-Humanoid-Lite-Biped-v0 \
  --device cuda
```

### 수정한 파일
- **`train_new.py`** — Isaac Lab 최신 `train.py`를 복사한 뒤 BHL 환경 import를 추가한 버전
- **`biped/agents/rsl_rl_ppo_cfg.py`** — `class_name`, `obs_groups` 필드 추가

### 학습 흐름
1. Isaac Lab의 `isaaclab.sh`로 Python 환경 진입
2. `train_new.py`가 BHL Biped 환경을 로드
3. RSL-RL PPO 알고리즘으로 보행 정책 학습
4. 학습된 정책을 실물 로봇에 sim-to-real 전이

---

## 5. LeRobot + SmolVLA — 핵심

| 항목 | 값 |
|------|-----|
| 경로 | `~/lerobot/` |
| 가상환경 | `~/lerobot_env/` |
| 용도 | 상체 SmolVLA 파인튜닝 (프로젝트 핵심) |

### 실행 방법
```bash
source ~/lerobot_env/bin/activate
cd ~/lerobot
lerobot-train ...
```

### 학습 흐름
1. SO-ARM101 텔레오퍼레이션으로 데모 데이터 수집 (Week 2-3)
2. LeRobot 데이터셋 포맷으로 변환
3. SmolVLA (450M VLA 모델) 파인튜닝
4. 학습된 모델로 자율 매니퓰레이션 수행

---

## 6. Ollama + Gemma3

| 항목 | 값 |
|------|-----|
| 실행 | `ollama run gemma3:27b` |
| 용도 | 로컬 LLM (보조용) |

온디바이스 LLM으로, 음성 대화 파이프라인의 오프라인 폴백이나 개발 중 테스트에 활용.

---

## 7. 환경변수

`~/.bashrc`에 다음이 추가되어 있다:

```bash
export ISAACSIM_PATH="$HOME/IsaacSim/_build/linux-aarch64/release"
export ISAACSIM_PYTHON_EXE="${ISAACSIM_PATH}/python.sh"
export LD_PRELOAD="/lib/aarch64-linux-gnu/libgomp.so.1"
```

| 변수 | 설명 |
|------|------|
| `ISAACSIM_PATH` | Isaac Sim 빌드 경로. Isaac Lab이 이 변수를 참조 |
| `ISAACSIM_PYTHON_EXE` | Isaac Sim 내장 Python 실행기 |
| `LD_PRELOAD` | OpenMP 라이브러리 선로딩 (aarch64 호환성) |

---

## 8. 시스템 설정

| 설정 | 내용 |
|------|------|
| swap | 비활성화 (영구) — swap이 활성화되면 GPU 메모리 부족 시 시스템이 OOM 대신 swap thrashing에 빠져 전체가 멈추는(벽돌화) 현상 방지 |
| GCC | 11을 기본 컴파일러로 설정 — Isaac Sim 빌드 호환성 |
| Git LFS | 설치됨 — 대용량 모델 파일 관리 |
| Git HTTPS | `git config --global url."https://github.com/".insteadOf "git@github.com:"` — SSH 대신 HTTPS 사용 |
