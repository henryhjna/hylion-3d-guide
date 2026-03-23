import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const hologramVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const hologramFragmentShader = `
  uniform float time;
  uniform vec3 color;
  uniform float opacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    // Fresnel edge glow
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    fresnel = pow(fresnel, 2.0);

    // Scanline effect
    float scanline = sin(vPosition.y * 80.0 + time * 2.0) * 0.5 + 0.5;
    scanline = smoothstep(0.3, 0.7, scanline);

    // Flicker
    float flicker = sin(time * 8.0) * 0.05 + 0.95;

    // Horizontal scan band
    float scanBand = smoothstep(0.0, 0.1, abs(sin(vPosition.y * 2.0 - time * 0.5)));

    // Combine
    float alpha = (fresnel * 0.8 + 0.15) * scanline * flicker * scanBand * opacity;
    vec3 finalColor = color * (fresnel * 0.6 + 0.4);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function HologramMaterial({ color = '#00f0ff', opacity = 0.6 }) {
  const materialRef = useRef();

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color: { value: new THREE.Color(color) },
    opacity: { value: opacity },
  }), [color, opacity]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={hologramVertexShader}
      fragmentShader={hologramFragmentShader}
      uniforms={uniforms}
      transparent
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );
}

export function HologramWireframe({ color = '#00f0ff', opacity = 0.4 }) {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 6) * 0.1 + 0.9;
      materialRef.current.opacity = opacity * flicker;
    }
  });

  return (
    <meshBasicMaterial
      ref={materialRef}
      color={color}
      wireframe
      transparent
      opacity={opacity}
    />
  );
}

export default function HologramMesh({ geometry, position, rotation, scale, color = '#00f0ff', opacity = 0.6 }) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Wireframe base */}
      <mesh geometry={geometry} scale={scale || [1, 1, 1]}>
        <HologramWireframe color={color} opacity={opacity * 0.5} />
      </mesh>
      {/* Hologram overlay */}
      <mesh geometry={geometry} scale={scale ? scale.map(s => s * 1.001) : [1.001, 1.001, 1.001]}>
        <HologramMaterial color={color} opacity={opacity} />
      </mesh>
    </group>
  );
}
