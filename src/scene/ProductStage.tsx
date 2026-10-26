import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import type { ModelId, Product, Variant } from "../content";
import { ProductModel } from "../models/Models";

const SCALE: Record<ModelId, number> = {
  kit: 0.92,
  jersey: 0.95,
  shorts: 1,
  socks: 0.95,
  jacket: 0.92,
  ball: 0.95,
  boot: 0.9,
  shinguard: 1,
  gloves: 0.95,
  cones: 1.2,
  ladder: 0.9,
  bib: 1,
  goal: 1.05,
  stopwatch: 0.95,
  pump: 1,
  board: 1,
};

const envCache = new WeakMap<THREE.WebGLRenderer, THREE.Texture>();

export function StudioLights({ rim = "#2fd65f" }: { rim?: string }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    let env = envCache.get(gl);
    if (!env) {
      const pmrem = new THREE.PMREMGenerator(gl);
      env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
      envCache.set(gl, env);
    }
    scene.environment = env;
    scene.environmentIntensity = 0.55;
  }, [gl, scene]);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.3} color="#fff6ea" />
      <directionalLight position={[-4, 1.5, -3]} intensity={2.4} color={rim} />
      <directionalLight position={[0, -3, 2]} intensity={0.4} color="#6fb3ff" />
    </>
  );
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

let blob: THREE.Texture | null = null;

export function BlobShadow({ y = -1.2, size = 2.2, opacity = 1 }: { y?: number; size?: number; opacity?: number }) {
  if (!blob) blob = shadowTexture();
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size * 0.45]} />
      <meshBasicMaterial map={blob} color="#000000" transparent opacity={opacity} depthWrite={false} fog={false} />
    </mesh>
  );
}

type StageProps = {
  product: Product;
  variant: Variant;
  hovered?: boolean;
  number?: string;
  player?: string;
  detail?: number;
  spin?: boolean;
  distance?: number;
};

export function ProductStage({ product, variant, hovered = false, number, player, detail = 3, spin = true, distance = 5.4 }: StageProps) {
  const group = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const speed = useRef(0.4);
  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    speed.current += ((hovered ? 1.8 : 0.4) - speed.current) * Math.min(1, dt * 4);
    if (spin) g.rotation.y += dt * speed.current;
    g.position.y = Math.sin(clock.elapsedTime * 1.3 + seed) * 0.06;
  });
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, distance]} fov={32} />
      <StudioLights />
      <group ref={group} scale={SCALE[product.model]} rotation={[0, -0.5, 0]}>
        <ProductModel model={product.model} variant={variant} number={number} player={player} detail={detail} studs={product.id !== "zapatos-indor"} />
      </group>
      <BlobShadow />
    </>
  );
}
