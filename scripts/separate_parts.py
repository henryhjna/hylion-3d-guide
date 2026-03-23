#!/usr/bin/env python3
"""
HYlion 3D Guide — Blender 파트 분리 스크립트

사용법:
  blender --background hyurion_rigg.blend --python scripts/separate_parts.py

또는 bone 구조만 확인:
  blender --background hyurion_rigg.blend --python scripts/separate_parts.py -- --inspect

출력:
  public/assets/models/head.glb
  public/assets/models/torso.glb
  public/assets/models/arm_left.glb
  public/assets/models/arm_right.glb
  public/assets/models/leg_left.glb
  public/assets/models/leg_right.glb
  public/assets/models/hylion-robot.glb (전체 조합)
"""

import bpy
import os
import sys

# ── Config ──────────────────────────────────────────────────────────────────

PART_IDS = ["head", "torso", "arm_left", "arm_right", "leg_left", "leg_right"]

# Bone name keywords → part ID mapping
# UPDATE THIS after running --inspect to see actual bone names
BONE_TO_PART = {
    # Head
    "head": "head", "neck": "head", "jaw": "head", "eye": "head",
    "Head": "head", "Neck": "head",
    # Torso
    "spine": "torso", "chest": "torso", "shoulder": "torso",
    "Spine": "torso", "Chest": "torso", "Shoulder": "torso",
    "hips": "torso", "pelvis": "torso", "root": "torso",
    "Hips": "torso", "Root": "torso",
    # Left arm
    "arm_l": "arm_left", "arm.l": "arm_left", "arm.L": "arm_left",
    "forearm_l": "arm_left", "forearm.l": "arm_left", "forearm.L": "arm_left",
    "hand_l": "arm_left", "hand.l": "arm_left", "hand.L": "arm_left",
    "finger": "arm_left",  # will be overridden by R check below
    "upper_arm_l": "arm_left", "UpperArm.L": "arm_left",
    # Right arm
    "arm_r": "arm_right", "arm.r": "arm_right", "arm.R": "arm_right",
    "forearm_r": "arm_right", "forearm.r": "arm_right", "forearm.R": "arm_right",
    "hand_r": "arm_right", "hand.r": "arm_right", "hand.R": "arm_right",
    "upper_arm_r": "arm_right", "UpperArm.R": "arm_right",
    # Left leg
    "leg_l": "leg_left", "leg.l": "leg_left", "leg.L": "leg_left",
    "thigh_l": "leg_left", "thigh.l": "leg_left", "thigh.L": "leg_left",
    "shin_l": "leg_left", "shin.l": "leg_left", "shin.L": "leg_left",
    "foot_l": "leg_left", "foot.l": "leg_left", "foot.L": "leg_left",
    "UpperLeg.L": "leg_left", "LowerLeg.L": "leg_left",
    # Right leg
    "leg_r": "leg_right", "leg.r": "leg_right", "leg.R": "leg_right",
    "thigh_r": "leg_right", "thigh.r": "leg_right", "thigh.R": "leg_right",
    "shin_r": "leg_right", "shin.r": "leg_right", "shin.R": "leg_right",
    "foot_r": "leg_right", "foot.r": "leg_right", "foot.R": "leg_right",
    "UpperLeg.R": "leg_right", "LowerLeg.R": "leg_right",
}


def get_part_for_bone(bone_name):
    """Match bone name to part ID using keyword lookup."""
    bn = bone_name.lower()
    # Check L/R suffix patterns
    if bn.endswith('.l') or bn.endswith('_l') or '_l_' in bn:
        if 'arm' in bn or 'hand' in bn or 'finger' in bn or 'forearm' in bn:
            return 'arm_left'
        if 'leg' in bn or 'thigh' in bn or 'shin' in bn or 'foot' in bn or 'toe' in bn:
            return 'leg_left'
    if bn.endswith('.r') or bn.endswith('_r') or '_r_' in bn:
        if 'arm' in bn or 'hand' in bn or 'finger' in bn or 'forearm' in bn:
            return 'arm_right'
        if 'leg' in bn or 'thigh' in bn or 'shin' in bn or 'foot' in bn or 'toe' in bn:
            return 'leg_right'
    # Direct keyword match
    for keyword, part in BONE_TO_PART.items():
        if keyword.lower() in bn:
            return part
    return 'torso'


def get_part_for_vertex(obj, vertex):
    """Determine part from vertex's dominant bone weight."""
    max_weight = 0
    max_group = None
    for g in vertex.groups:
        if g.weight > max_weight:
            max_weight = g.weight
            try:
                max_group = obj.vertex_groups[g.group].name
            except IndexError:
                pass
    if max_group:
        return get_part_for_bone(max_group)
    return 'torso'


def inspect_scene():
    """Print scene structure for analysis."""
    print("\n" + "=" * 60)
    print("SCENE INSPECTION")
    print("=" * 60)
    for obj in bpy.data.objects:
        print(f"\n[{obj.type}] {obj.name}")
        if obj.type == 'ARMATURE':
            print(f"  Bones ({len(obj.data.bones)}):")
            for bone in obj.data.bones:
                children = [c.name for c in bone.children]
                part = get_part_for_bone(bone.name)
                print(f"    {bone.name} → {part} (children: {children})")
        if obj.type == 'MESH':
            print(f"  Vertices: {len(obj.data.vertices)}")
            print(f"  Polygons: {len(obj.data.polygons)}")
            print(f"  Materials: {[m.name for m in obj.data.materials if m]}")
            print(f"  Dimensions: {[round(d, 4) for d in obj.dimensions]}")
            print(f"  Vertex Groups ({len(obj.vertex_groups)}):")
            for vg in obj.vertex_groups:
                part = get_part_for_bone(vg.name)
                print(f"    {vg.name} → {part}")


def separate_and_export():
    """Separate mesh by bone weights and export GLB files."""
    # Find mesh object
    mesh_obj = None
    for obj in bpy.data.objects:
        if obj.type == 'MESH':
            mesh_obj = obj
            break

    if not mesh_obj:
        print("❌ No MESH object found")
        return False

    print(f"\nSeparating: {mesh_obj.name} ({len(mesh_obj.data.vertices)} verts)")

    # Map vertices to parts
    part_verts = {pid: set() for pid in PART_IDS}
    for v in mesh_obj.data.vertices:
        part = get_part_for_vertex(mesh_obj, v)
        part_verts[part].add(v.index)

    for pid, verts in part_verts.items():
        print(f"  {pid}: {len(verts)} vertices")

    # Output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    output_dir = os.path.join(project_root, "public", "assets", "models")
    os.makedirs(output_dir, exist_ok=True)

    # Separate each part
    for part_id in PART_IDS:
        if not part_verts[part_id]:
            print(f"  ⚠️ {part_id}: no vertices, skipping")
            continue

        # Duplicate original
        bpy.ops.object.select_all(action='DESELECT')
        mesh_obj.select_set(True)
        bpy.context.view_layer.objects.active = mesh_obj
        bpy.ops.object.duplicate()
        part_obj = bpy.context.active_object
        part_obj.name = part_id

        # Delete vertices NOT in this part
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='DESELECT')
        bpy.ops.object.mode_set(mode='OBJECT')

        for v in part_obj.data.vertices:
            if v.index not in part_verts[part_id]:
                v.select = True

        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.delete(type='VERT')
        bpy.ops.object.mode_set(mode='OBJECT')

        remaining = len(part_obj.data.vertices)
        print(f"  ✅ {part_id}: {remaining} vertices separated")

    # Hide original
    mesh_obj.hide_set(True)

    # Export individual parts
    for part_id in PART_IDS:
        part_obj = bpy.data.objects.get(part_id)
        if not part_obj or len(part_obj.data.vertices) == 0:
            continue

        bpy.ops.object.select_all(action='DESELECT')
        part_obj.select_set(True)
        out_path = os.path.join(output_dir, f"{part_id}.glb")
        bpy.ops.export_scene.gltf(
            filepath=out_path, use_selection=True,
            export_format='GLB', export_apply=True,
        )
        print(f"  📦 {out_path}")

    # Export combined
    bpy.ops.object.select_all(action='DESELECT')
    for part_id in PART_IDS:
        obj = bpy.data.objects.get(part_id)
        if obj:
            obj.select_set(True)
    out_path = os.path.join(output_dir, "hylion-robot.glb")
    bpy.ops.export_scene.gltf(
        filepath=out_path, use_selection=True,
        export_format='GLB', export_apply=True,
    )
    print(f"  📦 {out_path} (combined)")
    print("\n✅ Part separation + GLB export complete")
    return True


# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []

    if "--inspect" in argv:
        inspect_scene()
    else:
        inspect_scene()
        print("\n" + "=" * 60)
        print("SEPARATION")
        print("=" * 60)
        separate_and_export()
