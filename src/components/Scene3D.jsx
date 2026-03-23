import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';
import RobotModel from './RobotModel';
import CameraController from './CameraController';

export default function Scene3D({
  selectedPart,
  hoveredPart,
  onPartClick,
  onPartHover,
  onBackground,
  xrayMode,
  selectedWeek,
  teamFilter,
  trackFilter,
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      style={{ background: '#0a0a0f' }}
      onPointerMissed={onBackground}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={0.4} color="#e0e8ff" />
        <directionalLight position={[-5, 3, -5]} intensity={0.2} color="#4466ff" />
        <pointLight position={[0, 2, 2]} intensity={0.3} color="#00f0ff" distance={8} />
        <pointLight position={[0, -1, 0]} intensity={0.15} color="#ff00aa" distance={5} />

        {/* Background particles */}
        <Stars radius={50} depth={30} count={80} factor={2} saturation={0} fade speed={0.5} />

        {/* Grid floor */}
        <gridHelper args={[10, 40, '#1a1a2e', '#12121a']} position={[0, -0.5, 0]} />

        {/* Robot Model */}
        <RobotModel
          selectedPart={selectedPart}
          hoveredPart={hoveredPart}
          onPartClick={onPartClick}
          onPartHover={onPartHover}
          xrayMode={xrayMode}
          selectedWeek={selectedWeek}
          teamFilter={teamFilter}
          trackFilter={trackFilter}
        />

        {/* Camera Controller */}
        <CameraController selectedPart={selectedPart} xrayMode={xrayMode} />

        {/* Orbit Controls — makeDefault exposes via useThree().controls */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={8}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 + 0.3}
          target={[0, 0.5, 0]}
        />
      </Suspense>
    </Canvas>
  );
}
