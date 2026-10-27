import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

import { netTexture } from "../models/geometry";
import { Ball, BlobShadow } from "./Ball";

const GOAL_Z = -12;
const POST = 3.66;
const BAR = 2.44;
const BALL_R = 0.11;

function pitchTexture() {
  const W = 1024;
  const H = 1434;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const px = (x: number) => ((x + 25) / 50) * W;
  const pz = (z: number) => ((z + 55) / 70) * H;
  for (let z = -55; z < 15; z += 5) {
    ctx.fillStyle = Math.round((z + 55) / 5) % 2 ? "#1f6b2b" : "#257a32";
    ctx.fillRect(0, pz(z), W, pz(z + 5) - pz(z) + 1);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(px(-25), pz(GOAL_Z));
  ctx.lineTo(px(25), pz(GOAL_Z));
  ctx.stroke();
  ctx.strokeRect(px(-20.15), pz(GOAL_Z), px(20.15) - px(-20.15), pz(GOAL_Z + 16.5) - pz(GOAL_Z));
  ctx.strokeRect(px(-9.15), pz(GOAL_Z), px(9.15) - px(-9.15), pz(GOAL_Z + 5.5) - pz(GOAL_Z));
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(px(0), pz(GOAL_Z + 11), (0.11 / 50) * W * 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  const r = (9.15 / 50) * W;
  const angle = Math.acos(5.5 / 9.15);
  ctx.ellipse(px(0), pz(GOAL_Z + 11), r, (9.15 / 70) * H, 0, Math.PI / 2 - angle, Math.PI / 2 + angle);
  ctx.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(220,255,200,0.55)");
  g.addColorStop(1, "rgba(200,255,180,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function Floodlight({ position, glow }: { position: [number, number, number]; glow: THREE.Texture }) {
  const [x, , z] = position;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[0.25, 0.4, 22, 8]} />
        <meshStandardMaterial color="#1b1f1c" />
      </mesh>
      <mesh position={[0, 22.5, 0]} rotation={[0, Math.atan2(-x, GOAL_Z - z), 0]}>
        <boxGeometry args={[5, 2.2, 0.4]} />
        <meshBasicMaterial color="#f4fff0" />
      </mesh>
      <sprite position={[0, 22.5, 0.6]} scale={[18, 18, 1]}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.85} />
      </sprite>
    </group>
  );
}

function Goal({ net }: { net: THREE.Texture }) {
  const post = <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.25} roughness={0.4} />;
  return (
    <group position={[0, 0, GOAL_Z]}>
      <mesh position={[-POST, BAR / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, BAR, 12]} />
        {post}
      </mesh>
      <mesh position={[POST, BAR / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, BAR, 12]} />
        {post}
      </mesh>
      <mesh position={[0, BAR, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, POST * 2 + 0.12, 12]} />
        {post}
      </mesh>
      <group>
        <mesh position={[0, BAR / 2 + 0.1, -1.6]} rotation={[0.25, 0, 0]}>
          <planeGeometry args={[POST * 2, BAR + 0.4]} />
          <meshBasicMaterial map={net} transparent alphaTest={0.3} side={THREE.DoubleSide} color="#dfe9e2" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * POST, BAR / 2, -0.8]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.8, BAR]} />
            <meshBasicMaterial map={net} transparent alphaTest={0.3} side={THREE.DoubleSide} color="#dfe9e2" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

type Shot = { start: number; from: THREE.Vector3; to: THREE.Vector3 } | null;

function HeroBall({ kick, onGoal, narrow }: { kick: number; onGoal: () => void; narrow: boolean }) {
  const ball = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const shot = useRef<Shot>(null);
  const respawn = useRef(-10);
  const home = useMemo(() => new THREE.Vector3(narrow ? 0 : 0.42, BALL_R, narrow ? 2.2 : 2.4), [narrow]);
  const scored = useRef(false);
  const clock = useThree((s) => s.clock);

  useEffect(() => {
    if (!kick || shot.current) return;
    const from = ball.current ? ball.current.position.clone() : home.clone();
    const to = new THREE.Vector3((Math.random() - 0.5) * 5.6, 0.4 + Math.random() * 1.7, GOAL_Z - 0.6);
    shot.current = { start: clock.elapsedTime, from, to };
    scored.current = false;
  }, [kick, clock, home]);

  useFrame(({ clock }, dt) => {
    const b = ball.current;
    if (!b) return;
    const t = clock.elapsedTime;
    const s = shot.current;
    if (s) {
      const k = Math.min(1, (t - s.start) / 0.95);
      b.position.lerpVectors(s.from, s.to, k);
      b.position.y += Math.sin(k * Math.PI) * 1.6;
      b.rotation.x -= dt * 22;
      b.rotation.z += dt * 6;
      if (k >= 1 && !scored.current) {
        scored.current = true;
        onGoal();
      }
      if (t - s.start > 2.2) {
        shot.current = null;
        respawn.current = t;
      }
    } else {
      const bounce = Math.abs(Math.sin(t * 2.6));
      b.position.set(home.x, BALL_R + bounce * 0.75, home.z);
      b.rotation.x -= dt * 2.4;
      b.rotation.y += dt * 0.6;
    }
    const grow = Math.min(1, (t - respawn.current) / 0.5);
    b.scale.setScalar(BALL_R * (shot.current ? 1 : 1 - (1 - grow) ** 3));
    if (shadow.current) {
      shadow.current.position.set(b.position.x, 0.005, b.position.z);
      const lift = Math.max(0, b.position.y - BALL_R);
      shadow.current.scale.setScalar(Math.max(0.2, 1 - lift * 0.35));
    }
  });

  return (
    <>
      <group ref={ball}>
        <Ball main="#f4f6f8" second="#141414" detail={5} />
      </group>
      <group ref={shadow}>
        <BlobShadow y={0} size={0.34} opacity={0.75} />
      </group>
    </>
  );
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    for (let i = 0; i < 260; i++) pos.push((Math.random() - 0.5) * 30, Math.random() * 9, -Math.random() * 30 + 2);
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (points.current) points.current.rotation.y += dt * 0.01;
  });
  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.05} color="#e9ffd6" transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

export function HeroScene({ kick, onGoal, narrow }: { kick: number; onGoal: () => void; narrow: boolean }) {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  const field = useMemo(pitchTexture, []);
  const glow = useMemo(glowTexture, []);
  const net = useMemo(() => {
    const t = netTexture();
    t.repeat.set(9, 3);
    return t;
  }, []);
  useEffect(
    () => () => {
      field.dispose();
      glow.dispose();
      net.dispose();
    },
    [field, glow, net]
  );

  useLayoutEffect(() => {
    camera.current?.lookAt(narrow ? 0 : -1.4, 1.25, GOAL_Z);
  }, [narrow]);

  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  useFrame((_, dt) => {
    const c = camera.current;
    if (!c) return;
    const k = Math.min(1, dt * 2);
    c.position.x += ((narrow ? 0 : 0.2) + pointer.current.x * 0.5 - c.position.x) * k;
    c.position.y += (1.05 - pointer.current.y * 0.2 - c.position.y) * k;
    c.lookAt(narrow ? 0 : -1.4, 1.25, GOAL_Z);
  });

  return (
    <>
      <PerspectiveCamera ref={camera} makeDefault position={[0.2, 1.05, narrow ? 5.6 : 4.4]} fov={narrow ? 50 : 38} />
      <fog attach="fog" args={["#04100a", 18, 60]} />
      <hemisphereLight args={["#cfe8ff", "#0d2412", 0.45]} />
      <directionalLight position={[-8, 18, -20]} intensity={2.2} color="#f2fff0" />
      <directionalLight position={[10, 14, 8]} intensity={1.4} color="#fffbe8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
        <planeGeometry args={[50, 70]} />
        <meshStandardMaterial map={field} roughness={0.95} />
      </mesh>
      <Goal net={net} />
      <mesh position={[0, 4, -34]}>
        <boxGeometry args={[70, 8, 4]} />
        <meshStandardMaterial color="#0a1510" />
      </mesh>
      {[
        [-24, 0, -36],
        [24, 0, -36],
        [-30, 0, -8],
        [30, 0, -8],
      ].map((p) => (
        <Floodlight key={p.join()} position={p as [number, number, number]} glow={glow} />
      ))}
      <Dust />
      <HeroBall kick={kick} onGoal={onGoal} narrow={narrow} />
    </>
  );
}
