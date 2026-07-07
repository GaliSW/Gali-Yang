'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 1600;
const SPREAD = 14;

function Points() {
  const geo = useRef<THREE.BufferGeometry>(null);
  const { viewport, gl } = useThree();
  // 覆蓋在 canvas 上的文字層會擋掉 R3F 的 pointer 事件,改聽 window 層級
  const mouse = useRef({ x: 9999, y: 9999 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.current.x = (nx * viewport.width) / 2;
      mouse.current.y = (ny * viewport.height) / 2;
    };
    const onLeave = () => { mouse.current.x = 9999; mouse.current.y = 9999; };
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [gl, viewport.width, viewport.height]);
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
    const mx = mouse.current.x;
    const my = mouse.current.y;
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
