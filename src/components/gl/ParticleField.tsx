'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 1600;
const SPREAD = 14;

function Points() {
  const geo = useRef<THREE.BufferGeometry>(null);
  const { pointer, viewport } = useThree();
  const base = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    const cols = Math.ceil(Math.sqrt(COUNT));
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = ((i % cols) / cols - 0.5) * SPREAD;
      arr[i * 3 + 1] = (Math.floor(i / cols) / cols - 0.5) * (SPREAD * 0.6);
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, []);
  const positions = useMemo(() => base.slice(), [base]);

  useFrame(() => {
    const mx = (pointer.x * viewport.width) / 2;
    const my = (pointer.y * viewport.height) / 2;
    for (let i = 0; i < COUNT; i++) {
      const ox = base[i * 3], oy = base[i * 3 + 1];
      const dx = ox - mx, dy = oy - my;
      const d = Math.hypot(dx, dy);
      const f = Math.max(0, 1 - d / 2.4);
      const tx = ox + (dx / (d || 1)) * f * 1.1;
      const ty = oy + (dy / (d || 1)) * f * 1.1;
      positions[i * 3] += (tx - positions[i * 3]) * 0.09;
      positions[i * 3 + 1] += (ty - positions[i * 3 + 1]) * 0.09;
    }
    if (geo.current) geo.current.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#8A94A8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: false, powerPreference: 'low-power' }}>
      <Points />
    </Canvas>
  );
}
