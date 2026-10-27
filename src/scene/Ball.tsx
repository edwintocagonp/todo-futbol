import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { ballGeometry } from "../models/geometry";

export function Ball({ main, second, detail = 4 }: { main: string; second: string; detail?: number }) {
  const geometry = useMemo(() => ballGeometry(main, second, detail), [main, second, detail]);
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.2 }), []);
  useEffect(() => () => material.dispose(), [material]);
  return <mesh geometry={geometry} material={material} castShadow />;
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
