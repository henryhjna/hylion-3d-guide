import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PARTS } from '../data/parts';
import { TEAM } from '../data/team';
import { TIMELINE } from '../data/timeline';

// ── Part region definitions (for single-mesh FBX fallback) ─────────────────
const PART_REGIONS = {
  head:      { yMin: 0.75, yMax: 1.0,  xMin: -999, xMax: 999 },
  torso:     { yMin: 0.45, yMax: 0.75, xMin: -0.15, xMax: 0.15 },
  left_arm:  { yMin: 0.40, yMax: 0.78, xMin: -999, xMax: -0.12 },
  right_arm: { yMin: 0.40, yMax: 0.78, xMin: 0.12,  xMax: 999 },
  left_leg:  { yMin: 0.0,  yMax: 0.45, xMin: -999, xMax: -0.02 },
  right_leg: { yMin: 0.0,  yMax: 0.45, xMin: 0.02,  xMax: 999 },
};

function detectPartFromPoint(point, modelHeight) {
  if (!point || !modelHeight) return null;
  const ny = point.y / modelHeight; // normalize to 0-1
  const nx = point.x;
  for (const [id, r] of Object.entries(PART_REGIONS)) {
    if (ny >= r.yMin && ny <= r.yMax && nx >= r.xMin && nx <= r.xMax) return id;
  }
  return 'torso';
}

// ── Dynamic camera presets from bounding box ───────────────────────────────
export function calculateCameraPresets(bbox) {
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());
  const h = size.y;
  const d = h * 2.5;
  return {
    overview:  { position: [0, center.y + h * 0.2, d], target: [0, center.y, 0] },
    head:      { position: [0, bbox.max.y - h * 0.1, h * 0.8], target: [0, bbox.max.y - h * 0.15, 0] },
    torso:     { position: [h * 0.6, center.y, h * 0.9], target: [0, center.y, 0] },
    left_arm:  { position: [-h * 0.8, center.y + h * 0.1, h * 0.7], target: [-h * 0.2, center.y + h * 0.1, 0] },
    right_arm: { position: [h * 0.8, center.y + h * 0.1, h * 0.7], target: [h * 0.2, center.y + h * 0.1, 0] },
    left_leg:  { position: [-h * 0.4, bbox.min.y + h * 0.15, h * 1.2], target: [-h * 0.1, bbox.min.y + h * 0.2, 0] },
    right_leg: { position: [h * 0.4, bbox.min.y + h * 0.15, h * 1.2], target: [h * 0.1, bbox.min.y + h * 0.2, 0] },
    legs:      { position: [0, bbox.min.y + h * 0.15, h * 1.5], target: [0, bbox.min.y + h * 0.2, 0] },
    xray:      { position: [0, center.y, h * 1.5], target: [0, center.y, 0] },
  };
}

// ── Hologram material ──────────────────────────────────────────────────────
function createHologramMaterial(color = 0x00f0ff) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(color) },
      opacity: { value: 0.6 },
    },
    vertexShader: `
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float opacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
        float scanline = smoothstep(0.3, 0.7, sin(vPosition.y * 80.0 + time * 2.0) * 0.5 + 0.5) * 0.15;
        float flicker = sin(time * 8.0) * 0.03 + 0.97;
        float alpha = (fresnel * 0.5 + 0.1 + scanline) * opacity * flicker;
        vec3 col = color * (fresnel * 0.8 + 0.3);
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// ── Region highlight overlay material ──────────────────────────────────────
function createRegionShaderMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: new THREE.Color(0x8090b0) },
      highlightColor: { value: new THREE.Color(0x00f0ff) },
      highlightYMin: { value: -1.0 },
      highlightYMax: { value: -1.0 },
      highlightXMin: { value: -999.0 },
      highlightXMax: { value: 999.0 },
      highlightIntensity: { value: 0.0 },
      modelHeight: { value: 1.0 },
      memberActive: { value: 0.0 },   // 1.0 when member filter active
      // Per-region membership (1.0 = member owns this region)
      rHead: { value: 1.0 }, rTorso: { value: 1.0 },
      rArmL: { value: 1.0 }, rArmR: { value: 1.0 },
      rLegL: { value: 1.0 }, rLegR: { value: 1.0 },
      time: { value: 0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      varying vec3 vNormal;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform vec3 highlightColor;
      uniform float highlightYMin;
      uniform float highlightYMax;
      uniform float highlightXMin;
      uniform float highlightXMax;
      uniform float highlightIntensity;
      uniform float modelHeight;
      uniform float memberActive;
      uniform float rHead, rTorso, rArmL, rArmR, rLegL, rLegR;
      uniform float time;
      varying vec3 vWorldPos;
      varying vec3 vNormal;

      float getRegionOwnership(float ny, float nx) {
        if (ny > 0.75) return rHead;
        if (ny > 0.45) {
          if (nx < -0.12) return rArmL;
          if (nx > 0.12) return rArmR;
          return rTorso;
        }
        if (nx < -0.02) return rLegL;
        return rLegR;
      }

      void main() {
        float ny = vWorldPos.y / modelHeight;
        float nx = vWorldPos.x;
        bool inHighlight = ny >= highlightYMin && ny <= highlightYMax
                        && nx >= highlightXMin && nx <= highlightXMax;
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 1.5);

        // Per-region dimming for member filter
        float ownership = getRegionOwnership(ny, nx);
        float dim = memberActive > 0.5 ? mix(0.3, 1.0, ownership) : 1.0;

        // Add ambient term so model is always visible
        float ambient = 0.35;
        vec3 color = baseColor * (dim * 0.7 + ambient);
        if (inHighlight && highlightIntensity > 0.0) {
          float pulse = sin(time * 3.0) * 0.1 + 0.9;
          color = mix(color, highlightColor, highlightIntensity * 0.5 * pulse);
          color += highlightColor * fresnel * highlightIntensity * 0.5;
        } else {
          color += vec3(0.08) * fresnel * dim;
        }
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════
export default function RobotModel({
  selectedPart, hoveredPart, onPartClick, onPartHover, onBackground,
  xrayMode, selectedWeek, teamFilter, trackFilter,
}) {
  const groupRef = useRef();
  const [loadState, setLoadState] = useState('loading'); // loading | glb | placeholder
  const [partMeshes, setPartMeshes] = useState({});
  const [modelHeight, setModelHeight] = useState(1.0);
  const hologramMaterials = useRef([]);
  const materialsRef = useRef({});

  const PART_IDS = ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg'];
  const BASE = import.meta.env.BASE_URL;

  // ── Load GLB parts ──
  useEffect(() => {
    const loader = new GLTFLoader();
    const meshes = {};
    let loaded = 0;

    // Try combined GLB first, then individual parts
    loader.load(
      `${BASE}assets/models/hylion-robot.glb`,
      (gltf) => {
        const model = gltf.scene;
        // Normalize scale
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const scale = 1.0 / (size.y || 1);
        model.scale.setScalar(scale);
        // Floor at y=0, center x/z
        const sBox = new THREE.Box3().setFromObject(model);
        const center = sBox.getCenter(new THREE.Vector3());
        model.position.y = -sBox.min.y;
        model.position.x = -center.x;
        model.position.z = -center.z;

        // Assign per-part materials and collect meshes
        model.traverse((child) => {
          if (child.isMesh) {
            // Match by object name to part ID
            const partId = PART_IDS.find(pid => child.name.toLowerCase().includes(pid.replace('_', ''))) ||
                           PART_IDS.find(pid => child.name.toLowerCase() === pid) ||
                           findPartByName(child.name);
            if (partId) {
              child.userData.partId = partId;
              const mat = createPartMaterial(partId);
              materialsRef.current[partId] = mat;
              child.material = mat;
              meshes[partId] = child;
            }
          }
        });

        const h = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).y;
        setModelHeight(h);
        setPartMeshes({ _model: model, ...meshes });
        setLoadState('glb');
        console.log('✅ GLB loaded, parts:', Object.keys(meshes).join(', '), 'height:', h.toFixed(3));
      },
      undefined,
      (err) => {
        console.warn('GLB load failed, using placeholder:', err);
        setLoadState('placeholder');
      }
    );

    return () => {
      Object.values(materialsRef.current).forEach(m => m.dispose?.());
    };
  }, []);

  function findPartByName(name) {
    const n = name.toLowerCase();
    if (n.includes('head') || n.includes('neck')) return 'head';
    if (n.includes('torso') || n.includes('pelvis') || n.includes('spine')) return 'torso';
    if (n.includes('arm') && n.includes('l')) return 'left_arm';
    if (n.includes('arm') && n.includes('r')) return 'right_arm';
    if ((n.includes('leg') || n.includes('thigh') || n.includes('shin') || n.includes('foot')) && n.includes('l')) return 'left_leg';
    if ((n.includes('leg') || n.includes('thigh') || n.includes('shin') || n.includes('foot')) && n.includes('r')) return 'right_leg';
    return null;
  }

  function createPartMaterial(partId) {
    const isUpper = ['head', 'torso', 'left_arm', 'right_arm'].includes(partId);
    const baseHue = isUpper ? 0x4488cc : 0xaa4488;
    return new THREE.MeshStandardMaterial({
      color: baseHue,
      emissive: isUpper ? 0x002233 : 0x220022,
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.6,
      transparent: false,
    });
  }

  // ── Per-part highlight logic (GLB parts) ──
  const activePart = hoveredPart || selectedPart;
  useEffect(() => {
    if (loadState !== 'glb') return;
    const memberParts = teamFilter && TEAM[teamFilter] ? TEAM[teamFilter].parts : null;

    for (const [pid, mesh] of Object.entries(partMeshes)) {
      if (pid === '_model') continue;
      const mat = materialsRef.current[pid];
      if (!mat) continue;

      const isActive = pid === activePart;
      const isHovered = pid === hoveredPart;
      const isMemberPart = memberParts ? memberParts.includes(pid) : true;
      const partData = PARTS[pid];
      const accentColor = partData?.color || '#00f0ff';

      if (isActive) {
        mat.emissive.set(accentColor);
        mat.emissiveIntensity = isHovered ? 0.4 : 0.6;
      } else if (isMemberPart) {
        const isUpper = ['head', 'torso', 'left_arm', 'right_arm'].includes(pid);
        mat.emissive.set(isUpper ? 0x002233 : 0x220022);
        mat.emissiveIntensity = 0.15;
        mat.opacity = 1;
        mat.transparent = false;
      } else {
        // Dimmed (not member's part)
        mat.emissive.set(0x111111);
        mat.emissiveIntensity = 0.05;
        mat.opacity = 0.35;
        mat.transparent = true;
      }
    }
  }, [activePart, hoveredPart, teamFilter, loadState, partMeshes]);

  // ── Animation ──
  useFrame((state) => {
    if (groupRef.current && !selectedPart) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    }
    hologramMaterials.current.forEach(m => { m.uniforms.time.value = state.clock.elapsedTime; });
  });

  // ── GLB Click handler — find partId from hit mesh ──
  const handleGLBClick = useCallback((e) => {
    e.stopPropagation();
    let obj = e.object;
    while (obj && !obj.userData.partId) obj = obj.parent;
    const partId = obj?.userData?.partId;
    if (partId) onPartClick(partId, e);
  }, [onPartClick]);

  const handleGLBHover = useCallback((e) => {
    e.stopPropagation();
    let obj = e.object;
    while (obj && !obj.userData.partId) obj = obj.parent;
    const partId = obj?.userData?.partId || null;
    onPartHover(partId);
    document.body.style.cursor = partId ? 'pointer' : 'default';
  }, [onPartHover]);

  const handlePointerOut = useCallback(() => {
    onPartHover(null);
    document.body.style.cursor = 'default';
  }, [onPartHover]);

  // ── Week-based highlighting for placeholder ──
  const highlightedParts = useMemo(() => {
    const set = new Set();
    if (selectedWeek !== null && selectedWeek !== undefined) {
      const weekData = TIMELINE.find(w => w.week === selectedWeek);
      if (weekData) weekData.highlightParts.forEach(p => set.add(p));
    }
    return set;
  }, [selectedWeek]);

  return (
    <group ref={groupRef}>
      {/* GLB model (per-part meshes with individual click targets) */}
      {loadState === 'glb' && partMeshes._model && (
        <primitive
          object={partMeshes._model}
          onClick={handleGLBClick}
          onPointerMove={handleGLBHover}
          onPointerOut={handlePointerOut}
        />
      )}

      {/* Placeholder (Track fallback) */}
      {loadState === 'placeholder' && (
        <PlaceholderRobot
          selectedPart={selectedPart}
          hoveredPart={hoveredPart}
          onPartClick={onPartClick}
          onPartHover={onPartHover}
          xrayMode={xrayMode}
          highlightedParts={highlightedParts}
          teamFilter={teamFilter}
          hologramMaterials={hologramMaterials}
        />
      )}

      {/* Hover label (both modes) */}
      {activePart && PARTS[activePart] && (
        <Html
          position={[0, loadState === 'fbx' ? modelHeight * (PART_REGIONS[activePart]?.yMax || 0.5) + 0.08 : 1.0, 0]}
          center
          distanceFactor={3}
        >
          <div className="glass-panel px-3 py-1.5 pointer-events-none whitespace-nowrap"
            style={{ borderColor: (PARTS[activePart]?.color || '#00f0ff') + '40' }}>
            <span className="text-xs font-bold" style={{ color: PARTS[activePart]?.color,  }}>
              {PARTS[activePart]?.label}
            </span>
          </div>
        </Html>
      )}

      {/* X-ray internal components */}
      {xrayMode && <InternalComponents modelHeight={modelHeight} />}
    </group>
  );
}

// ── Placeholder robot (hologram primitives) ────────────────────────────────
function PlaceholderRobot({ selectedPart, hoveredPart, onPartClick, onPartHover, xrayMode, highlightedParts, teamFilter, hologramMaterials }) {
  const PART_DEFS = useMemo(() => ({
    head:      { geo: new THREE.SphereGeometry(0.12, 16, 16), pos: [0, 0.88, 0], color: 0x00f0ff },
    torso:     { geo: new THREE.BoxGeometry(0.24, 0.25, 0.14, 4, 4, 4), pos: [0, 0.62, 0], color: 0x00f0ff },
    left_arm:  { geo: new THREE.CylinderGeometry(0.03, 0.025, 0.3, 8), pos: [-0.18, 0.60, 0], color: 0x00f0ff },
    right_arm: { geo: new THREE.CylinderGeometry(0.03, 0.025, 0.3, 8), pos: [0.18, 0.60, 0], color: 0x00f0ff },
    left_leg:  { geo: new THREE.CylinderGeometry(0.04, 0.035, 0.48, 8), pos: [-0.08, 0.24, 0], color: 0xff00aa },
    right_leg: { geo: new THREE.CylinderGeometry(0.04, 0.035, 0.48, 8), pos: [0.08, 0.24, 0], color: 0xff00aa },
  }), []);

  // Create materials ONCE and update uniforms reactively
  const materials = useMemo(() => {
    const mats = {};
    for (const [id, def] of Object.entries(PART_DEFS)) {
      mats[id] = createHologramMaterial(def.color);
    }
    hologramMaterials.current = Object.values(mats);
    return mats;
  }, [PART_DEFS, hologramMaterials]);

  // Update opacity reactively without creating new materials
  useEffect(() => {
    for (const [id, mat] of Object.entries(materials)) {
      const isActive = selectedPart === id || hoveredPart === id;
      const isDimmed = teamFilter && TEAM[teamFilter] && !TEAM[teamFilter].parts.includes(id);
      mat.uniforms.opacity.value = isDimmed ? 0.15 : isActive ? 0.9 : 0.5;
    }
  }, [selectedPart, hoveredPart, teamFilter, materials]);

  // Dispose on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach(m => m.dispose());
      Object.values(PART_DEFS).forEach(d => d.geo.dispose());
      hologramMaterials.current = [];
    };
  }, [materials, PART_DEFS, hologramMaterials]);

  return (
    <>
      {Object.entries(PART_DEFS).map(([id, def]) => (
        <mesh
          key={id}
          geometry={def.geo}
          material={materials[id]}
          position={def.pos}
          onClick={(e) => { e.stopPropagation(); onPartClick(id, e); }}
          onPointerOver={(e) => { e.stopPropagation(); onPartHover(id); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { onPartHover(null); document.body.style.cursor = 'default'; }}
        />
      ))}
    </>
  );
}

// ── Internal components (X-ray mode) ───────────────────────────────────────
function InternalComponents({ modelHeight }) {
  const s = modelHeight || 1.0;
  return (
    <group>
      <mesh position={[0.04 * s, 0.68 * s, 0]}>
        <boxGeometry args={[0.08 * s, 0.02 * s, 0.08 * s]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0.04 * s, 0.72 * s, 0]} center distanceFactor={3}>
        <div className="text-sm text-green-400 font-bold whitespace-nowrap pointer-events-none">Orin</div>
      </Html>

      <mesh position={[-0.04 * s, 0.62 * s, 0]}>
        <boxGeometry args={[0.07 * s, 0.02 * s, 0.07 * s]} />
        <meshStandardMaterial color="#4466ff" emissive="#4466ff" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[-0.04 * s, 0.66 * s, 0]} center distanceFactor={3}>
        <div className="text-sm text-blue-400 font-bold whitespace-nowrap pointer-events-none">NUC</div>
      </Html>

      <mesh position={[0, 0.53 * s, 0]}>
        <boxGeometry args={[0.2 * s, 0.04 * s, 0.1 * s]} />
        <meshStandardMaterial color="#c8ff00" emissive="#c8ff00" emissiveIntensity={0.3} />
      </mesh>
      <Html position={[0, 0.57 * s, 0]} center distanceFactor={3}>
        <div className="text-sm text-yellow-400 font-bold whitespace-nowrap pointer-events-none">BAT A+B</div>
      </Html>

      <mesh position={[0, 0.25 * s, 0.04 * s]}>
        <boxGeometry args={[0.03 * s, 0.015 * s, 0.02 * s]} />
        <meshStandardMaterial color="#ff8800" emissive="#ff8800" emissiveIntensity={0.6} />
      </mesh>
      <Html position={[0, 0.28 * s, 0.04 * s]} center distanceFactor={3}>
        <div className="text-sm text-orange-400 font-bold whitespace-nowrap pointer-events-none">ESP32</div>
      </Html>
    </group>
  );
}
