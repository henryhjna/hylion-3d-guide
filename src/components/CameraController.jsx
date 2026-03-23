import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_PRESETS } from '../data/parts';

export default function CameraController({ selectedPart, xrayMode }) {
  const { camera, controls } = useThree((state) => ({
    camera: state.camera,
    controls: state.controls,
  }));
  const startPos = useRef(new THREE.Vector3());
  const startTarget = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3(0, 1.2, 3.5));
  const endTarget = useRef(new THREE.Vector3(0, 0.5, 0));
  const isAnimating = useRef(false);
  const progress = useRef(1);

  useEffect(() => {
    let preset;
    if (xrayMode) {
      preset = CAMERA_PRESETS.xray;
    } else if (selectedPart) {
      preset = CAMERA_PRESETS[selectedPart] || CAMERA_PRESETS.overview;
    } else {
      preset = CAMERA_PRESETS.overview;
    }

    // Capture current position as start
    startPos.current.copy(camera.position);
    if (controls?.target) {
      startTarget.current.copy(controls.target);
    }

    endPos.current.set(...preset.position);
    endTarget.current.set(...preset.target);
    isAnimating.current = true;
    progress.current = 0;
  }, [selectedPart, xrayMode, camera, controls]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    progress.current = Math.min(progress.current + delta * 1.2, 1);
    const t = easeInOutCubic(progress.current);

    // Interpolate from start to end using t directly (not cumulative lerp)
    camera.position.lerpVectors(startPos.current, endPos.current, t);

    if (controls?.target) {
      controls.target.lerpVectors(startTarget.current, endTarget.current, t);
      controls.update();
    }

    if (progress.current >= 1) {
      isAnimating.current = false;
      // Snap to exact target
      camera.position.copy(endPos.current);
      if (controls?.target) {
        controls.target.copy(endTarget.current);
        controls.update();
      }
    }
  });

  return null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
