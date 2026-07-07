'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const frag = /* glsl */ `
  uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv;
    float w1 = 0.5 + 0.5 * sin(p.x * 3.2 + uTime * 0.35 + p.y * 2.1);
    float w2 = 0.5 + 0.5 * sin(p.y * 4.1 - uTime * 0.22 + p.x * 1.4);
    vec3 col = mix(uA, uB, w1);
    col = mix(col, uC, w2 * 0.55);
    float grid = step(0.96, fract(p.x * 14.0)) + step(0.96, fract(p.y * 9.0));
    col += grid * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ palette }: { palette: [string, string, string] }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uA: { value: new THREE.Color(palette[0]) },
    uB: { value: new THREE.Color(palette[1]) },
    uC: { value: new THREE.Color(palette[2]) },
  }), [palette]);
  useFrame((_, dt) => { if (mat.current) mat.current.uniforms.uTime.value += dt; });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export default function ProjectPlane({ palette }: { palette: [string, string, string] }) {
  return (
    <Canvas dpr={[1, 1.5]} orthographic camera={{ zoom: 100 }} gl={{ antialias: false }}>
      <Plane palette={palette} />
    </Canvas>
  );
}
