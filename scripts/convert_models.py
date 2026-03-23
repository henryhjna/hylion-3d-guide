#!/usr/bin/env python3
"""
HYlion 3D Guide — URDF/STL → glTF 모델 변환 스크립트

사용법:
  python scripts/convert_models.py --soarm    # SO-ARM URDF → glTF
  python scripts/convert_models.py --bhl      # BHL URDF → glTF
  python scripts/convert_models.py --all      # 전부 변환

필요 패키지:
  pip install trimesh pygltflib numpy

또는 Blender CLI:
  blender --background --python scripts/convert_models.py -- --blender
"""

import argparse
import os
import sys
import subprocess
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
MODELS_DIR = PROJECT_ROOT / "public" / "assets" / "models"

# GitHub 저장소 URL
SOARM_REPO = "https://github.com/TheRobotStudio/SO-ARM100.git"
BHL_REPO = "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite.git"


def ensure_dir(path):
    path.mkdir(parents=True, exist_ok=True)


def clone_repo(url, target_dir):
    """Sparse checkout으로 필요한 파일만 가져오기"""
    if target_dir.exists():
        print(f"  이미 존재: {target_dir}")
        return
    print(f"  클론 중: {url}")
    subprocess.run(["git", "clone", "--depth", "1", url, str(target_dir)], check=True)


def convert_stl_to_glb_trimesh(stl_files, output_path, color=None):
    """trimesh를 사용한 STL → GLB 변환"""
    try:
        import trimesh
    except ImportError:
        print("  ERROR: pip install trimesh pygltflib numpy")
        return False

    scene = trimesh.Scene()
    for stl_file in stl_files:
        if not stl_file.exists():
            print(f"  스킵 (파일 없음): {stl_file}")
            continue
        mesh = trimesh.load(str(stl_file))
        if color:
            mesh.visual.face_colors = color
        scene.add_geometry(mesh, node_name=stl_file.stem)
        print(f"  추가: {stl_file.name}")

    if len(scene.geometry) == 0:
        print("  WARNING: 변환할 메시 없음")
        return False

    scene.export(str(output_path))
    print(f"  출력: {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")
    return True


def convert_soarm():
    """SO-ARM100 STL → glTF 변환"""
    print("\n=== SO-ARM100 변환 ===")
    tmp_dir = PROJECT_ROOT / "tmp" / "soarm"
    output_dir = MODELS_DIR / "soarm"
    ensure_dir(output_dir)

    clone_repo(SOARM_REPO, tmp_dir)

    # STL 파일 탐색
    stl_dir = tmp_dir / "stl"
    if not stl_dir.exists():
        # 다른 경로 시도
        stl_files = list(tmp_dir.rglob("*.stl"))
    else:
        stl_files = list(stl_dir.glob("*.stl"))

    if not stl_files:
        print("  WARNING: STL 파일을 찾을 수 없음")
        print(f"  검색 경로: {tmp_dir}")
        return

    print(f"  발견된 STL: {len(stl_files)}개")

    # 팔로워 파트 변환 (프로젝트에서 사용하는 것)
    follower_keywords = ["Base", "Motor_holder", "Under_arm", "Upper_arm",
                         "Rotation", "Wrist", "Moving_Jaw", "SO101"]
    follower_stls = [f for f in stl_files if any(kw.lower() in f.stem.lower() for kw in follower_keywords)]

    if follower_stls:
        convert_stl_to_glb_trimesh(
            follower_stls,
            output_dir / "soarm101_follower.glb",
            color=[0, 200, 255, 200]  # 시안
        )

    # 전체도 변환
    convert_stl_to_glb_trimesh(
        stl_files[:20],  # 최대 20개
        output_dir / "soarm101_all.glb",
        color=[0, 200, 255, 200]
    )


def convert_bhl():
    """Berkeley Humanoid Lite URDF/STEP → glTF 변환"""
    print("\n=== BHL 변환 ===")
    tmp_dir = PROJECT_ROOT / "tmp" / "bhl"
    output_dir = MODELS_DIR / "bhl"
    ensure_dir(output_dir)

    # BHL Assets 저장소 클론
    bhl_assets_repo = "https://github.com/HybridRobotics/Berkeley-Humanoid-Lite-Assets.git"
    clone_repo(bhl_assets_repo, tmp_dir)

    # URDF/STL/STEP 파일 탐색
    mesh_files = list(tmp_dir.rglob("*.stl")) + list(tmp_dir.rglob("*.obj"))
    print(f"  발견된 메시: {len(mesh_files)}개")

    if mesh_files:
        convert_stl_to_glb_trimesh(
            mesh_files[:30],  # 최대 30개
            output_dir / "bhl_robot.glb",
            color=[255, 0, 170, 200]  # 마젠타
        )
    else:
        print("  WARNING: 메시 파일을 찾을 수 없음")
        print("  URDF만 있는 경우 Blender에서 수동 변환 필요")

        # URDF 파일 위치 안내
        urdf_files = list(tmp_dir.rglob("*.urdf"))
        if urdf_files:
            print(f"  발견된 URDF: {[str(f) for f in urdf_files]}")


def convert_blender():
    """Blender CLI를 사용한 변환 (Blender 설치 필요)"""
    print("\n=== Blender 변환 모드 ===")
    print("Blender가 설치되어 있어야 합니다.")

    blender_script = '''
import bpy
import sys
import glob

# 모든 기본 오브젝트 삭제
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# STL 파일들 임포트
stl_dir = sys.argv[-1]
for stl in glob.glob(stl_dir + "/*.stl"):
    bpy.ops.import_mesh.stl(filepath=stl)
    print(f"Imported: {stl}")

# glTF로 익스포트
output = stl_dir + "/output.glb"
bpy.ops.export_scene.gltf(filepath=output, export_format='GLB')
print(f"Exported: {output}")
'''

    script_path = PROJECT_ROOT / "tmp" / "blender_convert.py"
    ensure_dir(script_path.parent)
    script_path.write_text(blender_script)
    print(f"  Blender 스크립트 생성: {script_path}")
    print(f"  사용법: blender --background --python {script_path} -- <STL_DIR>")


def cleanup():
    """임시 파일 정리"""
    tmp_dir = PROJECT_ROOT / "tmp"
    if tmp_dir.exists():
        shutil.rmtree(tmp_dir)
        print("\n임시 파일 정리 완료")


def main():
    parser = argparse.ArgumentParser(description="HYlion 3D 모델 변환")
    parser.add_argument("--soarm", action="store_true", help="SO-ARM100 변환")
    parser.add_argument("--bhl", action="store_true", help="BHL 변환")
    parser.add_argument("--all", action="store_true", help="전부 변환")
    parser.add_argument("--blender", action="store_true", help="Blender 모드")
    parser.add_argument("--cleanup", action="store_true", help="임시 파일 정리")
    args = parser.parse_args()

    ensure_dir(MODELS_DIR)

    if args.blender:
        convert_blender()
    elif args.soarm or args.all:
        convert_soarm()
    if args.bhl or args.all:
        convert_bhl()
    if args.cleanup:
        cleanup()

    if not any([args.soarm, args.bhl, args.all, args.blender, args.cleanup]):
        parser.print_help()
        print("\n예시:")
        print("  python scripts/convert_models.py --all")
        print("  python scripts/convert_models.py --soarm --cleanup")


if __name__ == "__main__":
    main()
