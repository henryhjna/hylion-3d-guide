"""
Extract parts from hyurion_rig.blend based on vertex groups.
Run: blender --background hyurion_rig.blend --python scripts/extract_parts.py
"""
import bpy
import os

# Bone-to-part mapping (from actual bone structure)
BONE_TO_PART = {
    'pelvis': 'torso',
    'torso': 'torso',
    'neck': 'head',
    'head': 'head',
    'upper_arm_R': 'right_arm',
    'upper_arm_L': 'left_arm',
    'thigh_R': 'right_leg',
    'shin_R': 'right_leg',
    'foot_R': 'right_leg',
    'thigh_L': 'left_leg',
    'shin_L': 'left_leg',
    'foot_L': 'left_leg',
}

PART_IDS = ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg']

# Find the mesh
mesh_obj = None
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        mesh_obj = obj
        break

if not mesh_obj:
    print("ERROR: No mesh found")
    exit(1)

print(f"Mesh: {mesh_obj.name}, Verts: {len(mesh_obj.data.vertices)}, VGroups: {len(mesh_obj.vertex_groups)}")

# Map each vertex to a part based on dominant weight
vert_to_part = {}
part_vert_count = {pid: 0 for pid in PART_IDS}

for v in mesh_obj.data.vertices:
    best_weight = 0
    best_group = None
    for g in v.groups:
        if g.weight > best_weight:
            best_weight = g.weight
            try:
                best_group = mesh_obj.vertex_groups[g.group].name
            except:
                pass
    part = BONE_TO_PART.get(best_group, 'torso')
    vert_to_part[v.index] = part
    part_vert_count[part] += 1

for pid, count in part_vert_count.items():
    pct = count / len(mesh_obj.data.vertices) * 100
    print(f"  {pid}: {count} verts ({pct:.1f}%)")

# Output directory
output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "assets", "models")
os.makedirs(output_dir, exist_ok=True)

# For each part: duplicate mesh, delete non-part vertices, export
for part_id in PART_IDS:
    if part_vert_count[part_id] == 0:
        print(f"  SKIP {part_id}: no vertices")
        continue

    # Select and duplicate
    bpy.ops.object.select_all(action='DESELECT')
    mesh_obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_obj
    bpy.ops.object.duplicate()
    part_obj = bpy.context.active_object
    part_obj.name = part_id

    # Remove armature modifier if present
    for mod in part_obj.modifiers:
        if mod.type == 'ARMATURE':
            bpy.ops.object.modifier_remove(modifier=mod.name)

    # Delete vertices not in this part
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')

    for v in part_obj.data.vertices:
        if vert_to_part.get(v.index) != part_id:
            v.select = True

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.delete(type='VERT')
    bpy.ops.object.mode_set(mode='OBJECT')

    remaining = len(part_obj.data.vertices)
    print(f"  {part_id}: {remaining} verts after separation")

# Hide original mesh
mesh_obj.hide_set(True)

# Export each part as GLB
for part_id in PART_IDS:
    part_obj = bpy.data.objects.get(part_id)
    if not part_obj or len(part_obj.data.vertices) == 0:
        continue

    bpy.ops.object.select_all(action='DESELECT')
    part_obj.select_set(True)
    bpy.context.view_layer.objects.active = part_obj

    out = os.path.join(output_dir, f"{part_id}.glb")
    bpy.ops.export_scene.gltf(
        filepath=out,
        use_selection=True,
        export_format='GLB',
        export_apply=True,
    )
    size_kb = os.path.getsize(out) / 1024
    print(f"  EXPORTED: {out} ({size_kb:.0f} KB)")

# Export combined
bpy.ops.object.select_all(action='DESELECT')
for part_id in PART_IDS:
    obj = bpy.data.objects.get(part_id)
    if obj:
        obj.select_set(True)

out = os.path.join(output_dir, "hylion-robot.glb")
bpy.ops.export_scene.gltf(
    filepath=out,
    use_selection=True,
    export_format='GLB',
    export_apply=True,
)
size_kb = os.path.getsize(out) / 1024
print(f"  EXPORTED: {out} ({size_kb:.0f} KB)")
print("\nDONE")
