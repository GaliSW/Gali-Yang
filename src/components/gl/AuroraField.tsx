'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// 即時流動 shader 背景(omma 式的影片級流動感,但真即時、可互動)
// domain-warped FBM 噪聲流動,滑鼠位置會微幅扭轉流場並提亮
const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0); // 全螢幕平面,無視攝影機
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uMouse;   // 0..1(平滑後)
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y) * 1.4;
    float t = uTime * 0.05;

    float md = length(uv - uMouse);
    float mInf = smoothstep(0.55, 0.0, md);
    p += (uMouse - 0.5) * 0.22 * mInf; // 滑鼠微幅扭轉流場

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + t * 0.6),
                  fbm(p + 2.0 * q + vec2(8.3, 2.8) - t * 0.4));
    float f = fbm(p + 2.4 * r);

    vec3 deep = vec3(0.039, 0.063, 0.122);  // #0A101F
    vec3 mid  = vec3(0.043, 0.145, 0.137);  // 暗青綠
    vec3 acc  = vec3(0.133, 0.773, 0.369);  // #22C55E

    vec3 col = mix(deep, mid, smoothstep(0.25, 0.8, f));
    float ridge = smoothstep(0.68, 0.97, f);
    col = mix(col, acc, ridge * 0.42 + mInf * 0.12);

    float vig = smoothstep(1.05, 0.3, length(uv - 0.5));
    col *= 0.25 + vig * 0.75;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function AuroraPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const target = useRef({ x: 0.5, y: 0.5 });
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uAspect: { value: 16 / 9 },
  }), []);

  useEffect(() => {
    // 覆蓋層會擋 R3F pointer,一律聽 window
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    u.uAspect.value = state.size.width / state.size.height;
    const m = u.uMouse.value as THREE.Vector2;
    m.x += (target.current.x - m.x) * 0.06; // 平滑跟隨
    m.y += (target.current.y - m.y) * 0.06;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

export default function AuroraField() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 1] }} style={{ position: 'absolute', inset: 0 }}>
      <AuroraPlane />
    </Canvas>
  );
}
