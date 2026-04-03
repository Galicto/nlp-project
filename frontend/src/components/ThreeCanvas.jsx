import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

const HolographicResume = () => {
  const group = useRef();
  const scannerRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      // Subtle hovering effect
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (state.pointer.x * Math.PI) / 10, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.4 + (state.pointer.y * Math.PI) / 15, 0.05);
    }
    
    if (scannerRef.current) {
      // Animate scanner line up and down
      scannerRef.current.position.y = Math.sin(t * 2) * 2;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group>
          {/* Main Document Body */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.2, 4.5]} />
            <meshStandardMaterial 
              color="#0d111a" 
              transparent 
              opacity={0.8}
              side={THREE.DoubleSide}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Glowing Document Edge */}
          <Line
            points={[[-1.6, 2.25, 0.01], [1.6, 2.25, 0.01], [1.6, -2.25, 0.01], [-1.6, -2.25, 0.01], [-1.6, 2.25, 0.01]]}
            color="#3b82f6"
            lineWidth={2}
          />

          {/* Abstract Text Lines indicating Resume Data */}
          <Line points={[[-1.2, 1.5, 0.02], [0.5, 1.5, 0.02]]} color="#60a5fa" lineWidth={3} />
          <Line points={[[-1.2, 1.2, 0.02], [1.2, 1.2, 0.02]]} color="#3b82f6" lineWidth={2} opacity={0.5} transparent />
          <Line points={[[-1.2, 0.9, 0.02], [0.8, 0.9, 0.02]]} color="#3b82f6" lineWidth={2} opacity={0.5} transparent />
          
          <Line points={[[-1.2, 0.2, 0.02], [0.2, 0.2, 0.02]]} color="#60a5fa" lineWidth={3} />
          <Line points={[[-1.2, -0.1, 0.02], [1.0, -0.1, 0.02]]} color="#3b82f6" lineWidth={2} opacity={0.5} transparent />
          <Line points={[[-1.2, -0.4, 0.02], [1.2, -0.4, 0.02]]} color="#3b82f6" lineWidth={2} opacity={0.5} transparent />
          <Line points={[[-1.2, -0.7, 0.02], [0.5, -0.7, 0.02]]} color="#3b82f6" lineWidth={2} opacity={0.5} transparent />

          {/* Scanner Line */}
          <group ref={scannerRef}>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[3.4, 0.02, 0.02]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
            </mesh>
            <pointLight distance={3} intensity={5} color="#60a5fa" />
          </group>

        </group>
      </Float>
    </group>
  );
};

export default function ThreeCanvas() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#3b82f6" />
        <HolographicResume />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
