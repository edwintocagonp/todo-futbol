import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import type { ModelId, Variant } from "../content";
import { SHAPES, backPrint, ballGeometry, bend, clay, crest, fabric, lcd, mesh, netTexture, pitch, puffy } from "./geometry";

type ModelProps = { variant: Variant; number?: string; player?: string; detail?: number; studs?: boolean };

function useDisposable<T extends { dispose: () => void }>(make: () => T, deps: unknown[]) {
  const value = useMemo(make, deps);
  useEffect(() => () => value.dispose(), [value]);
  return value;
}

function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.all([document.fonts.load('900 64px "Archivo Variable"'), document.fonts.load('700 64px "JetBrains Mono Variable"')]).then(
      () => alive && setReady(true)
    );
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

const ink = (v: Variant) => (new THREE.Color(v.second).getHSL({ h: 0, s: 0, l: 0 }).l > 0.82 && new THREE.Color(v.main).getHSL({ h: 0, s: 0, l: 0 }).l > 0.82 ? "#141414" : v.second);

function Jersey({ variant, number = "10", player = "" }: ModelProps) {
  const fonts = useFontsReady();
  const geometry = useDisposable(() => puffy(SHAPES.jersey(), 0.14, 0.12), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, variant.pattern), [variant.main, variant.second, variant.pattern]);
  const material = useDisposable(() => clay(variant.main, map), [map]);
  const back = useDisposable(() => backPrint(number, player, ink(variant)), [number, player, variant.second, fonts]);
  const badge = useDisposable(() => crest(variant.main, ink(variant)), [variant.main, variant.second, fonts]);
  const z = (geometry.boundingBox!.max.z - geometry.boundingBox!.min.z) / 2 + 0.004;
  return (
    <group>
      <mesh geometry={geometry} material={material} castShadow />
      <mesh position={[0, 1.005, z - 0.012]} rotation={[0, 0, Math.PI]} scale={[1, 0.42, 1]}>
        <torusGeometry args={[0.27, 0.035, 10, 32, Math.PI]} />
        <meshPhysicalMaterial color={variant.second} roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 0.5, z]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.24, 0.24]} />
        <meshStandardMaterial map={badge} transparent roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, -z]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial map={back} transparent roughness={0.6} />
      </mesh>
    </group>
  );
}

function Shorts({ variant }: ModelProps) {
  const geometry = useDisposable(() => puffy(SHAPES.shorts(), 0.14, 0.12), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, "plain", { band: "top", side: true }), [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map), [map]);
  return <mesh geometry={geometry} material={material} castShadow />;
}

function Kit(props: ModelProps) {
  return (
    <group>
      <group position={[0, 0.42, 0.1]} scale={0.8}>
        <Jersey {...props} />
      </group>
      <group position={[0.15, -0.95, -0.2]} scale={0.56} rotation={[0, -0.2, 0.06]}>
        <Shorts {...props} variant={{ ...props.variant, main: props.variant.pattern === "halves" ? props.variant.second : props.variant.main }} />
      </group>
    </group>
  );
}

function Socks({ variant }: ModelProps) {
  const geometry = useDisposable(() => puffy(SHAPES.sock(), 0.16, 0.12), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, "plain", { band: "top" }), [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map), [map]);
  return (
    <group>
      <mesh geometry={geometry} material={material} position={[-0.35, 0.05, 0]} rotation={[0, 0, 0.08]} castShadow />
      <mesh geometry={geometry} material={material} position={[0.3, -0.05, -0.25]} rotation={[0, 0.3, -0.06]} castShadow />
    </group>
  );
}

function Jacket({ variant }: ModelProps) {
  const body = useDisposable(() => puffy(SHAPES.jacket(), 0.16, 0.12), []);
  const legs = useDisposable(() => puffy(SHAPES.pants(), 0.14, 0.1), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, "plain", { side: true }), [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map), [map]);
  const z = (body.boundingBox!.max.z - body.boundingBox!.min.z) / 2;
  return (
    <group>
      <group position={[0.42, -0.55, -0.35]} scale={0.7} rotation={[0, -0.25, 0]}>
        <mesh geometry={legs} material={material} castShadow />
      </group>
      <group position={[-0.15, 0.25, 0.1]} scale={0.82}>
        <mesh geometry={body} material={material} castShadow />
        <mesh position={[0, -0.02, z + 0.005]}>
          <boxGeometry args={[0.035, 1.92, 0.02]} />
          <meshStandardMaterial color="#d9dde2" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.05, 0.8, z + 0.02]}>
          <boxGeometry args={[0.06, 0.13, 0.03]} />
          <meshStandardMaterial color="#d9dde2" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export function Ball({ variant, detail = 4 }: ModelProps) {
  const geometry = useMemo(() => ballGeometry(variant.main, variant.second, detail), [variant.main, variant.second, detail]);
  const material = useDisposable(() => new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.2 }), []);
  return <mesh geometry={geometry} material={material} castShadow />;
}

function Boot({ variant, studs = true }: ModelProps) {
  const upper = useDisposable(() => puffy(SHAPES.boot(), 0.42, 0.12), []);
  const sole = useDisposable(() => puffy(SHAPES.sole(), 0.62, 0.05), []);
  const map = useDisposable(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = variant.main;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = variant.second;
    ctx.fillRect(0, 0, size * 0.22, size);
    ctx.beginPath();
    ctx.moveTo(size * 0.3, size * 0.72);
    ctx.quadraticCurveTo(size * 0.55, size * 0.38, size * 0.86, size * 0.5);
    ctx.lineTo(size * 0.84, size * 0.58);
    ctx.quadraticCurveTo(size * 0.56, size * 0.5, size * 0.36, size * 0.78);
    ctx.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map, { sheen: 0.1, clearcoat: 0.5 }), [map]);
  const z = (upper.boundingBox!.max.z - upper.boundingBox!.min.z) / 2;
  const laces = [0.42, 0.28, 0.14, 0];
  return (
    <group rotation={[0.12, -0.5, 0]}>
      <mesh geometry={upper} material={material} castShadow />
      <mesh geometry={sole} position={[0, -0.02, 0]} castShadow>
        <meshPhysicalMaterial color={variant.second} roughness={0.6} clearcoat={0.3} />
      </mesh>
      {laces.map((x, i) => (
        <mesh key={x} position={[x, 0.24 + i * 0.055, 0]} rotation={[Math.PI / 2, 0, -0.35]}>
          <capsuleGeometry args={[0.025, z * 1.3, 4, 8]} />
          <meshStandardMaterial color="#f4f6f8" roughness={0.6} />
        </mesh>
      ))}
      {studs &&
        [-0.8, -0.55, -0.1, 0.2, 0.5, 0.8].map((x) =>
          [-1, 1].map((s) => (
            <mesh key={`${x}${s}`} position={[x, -0.5, s * z * 0.45]}>
              <cylinderGeometry args={[0.05, 0.065, 0.12, 12]} />
              <meshStandardMaterial color={variant.second} roughness={0.5} />
            </mesh>
          ))
        )}
    </group>
  );
}

function ShinGuards({ variant }: ModelProps) {
  const geometry = useDisposable(() => bend(puffy(SHAPES.shinguard(), 0.06, 0.08), 0.45), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, "plain", { band: "bottom" }), [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map, { clearcoat: 0.8, sheen: 0 }), [map]);
  return (
    <group>
      <mesh geometry={geometry} material={material} position={[-0.38, 0.05, 0]} rotation={[0, 0.25, 0.08]} castShadow />
      <mesh geometry={geometry} material={material} position={[0.4, -0.05, -0.2]} rotation={[0, -0.25, -0.08]} castShadow />
    </group>
  );
}

function Gloves({ variant }: ModelProps) {
  const geometry = useDisposable(() => puffy(SHAPES.glove(), 0.22, 0.12), []);
  const map = useDisposable(() => fabric(variant.main, variant.second, "plain", { band: "bottom" }), [variant.main, variant.second]);
  const material = useDisposable(() => clay(variant.main, map), [map]);
  return (
    <group scale={0.92}>
      <mesh geometry={geometry} material={material} position={[-0.45, 0.04, 0]} rotation={[0, 0.2, 0.15]} castShadow />
      <mesh geometry={geometry} material={material} position={[0.48, -0.04, -0.25]} rotation={[0, Math.PI - 0.25, 0.1]} castShadow />
    </group>
  );
}

function Cones() {
  const geometry = useDisposable(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.12, 0.22),
          new THREE.Vector2(0.2, 0.21),
          new THREE.Vector2(0.62, 0.03),
          new THREE.Vector2(0.66, 0),
        ],
        48
      ),
    []
  );
  const colors = ["#ff6b1a", "#ffd21f", "#2fd65f", "#1f56d6", "#ff6b1a"];
  return (
    <group rotation={[0.55, 0, 0]} position={[0, -0.1, 0]}>
      {colors.slice(0, 3).map((c, i) => (
        <mesh key={i} geometry={geometry} position={[-0.35, i * 0.06, 0]}>
          <meshPhysicalMaterial color={c} roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <mesh geometry={geometry} position={[0.6, 0, 0.45]}>
        <meshPhysicalMaterial color={colors[3]} roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry} position={[0.55, 0, -0.55]}>
        <meshPhysicalMaterial color={colors[4]} roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Ladder({ variant }: ModelProps) {
  return (
    <group rotation={[0.85, 0.5, 0]} scale={0.85}>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((y) => (
        <RoundedBox key={y} args={[1.4, 0.07, 0.16]} radius={0.03} position={[0, 0, y]}>
          <meshPhysicalMaterial color={variant.main} roughness={0.4} clearcoat={0.6} />
        </RoundedBox>
      ))}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.01, 0]}>
          <boxGeometry args={[0.05, 0.02, 2.9]} />
          <meshStandardMaterial color={variant.second} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Bibs({ variant }: ModelProps) {
  const geometry = useDisposable(() => puffy(SHAPES.bib(), 0.03, 0.04), []);
  const otherColor = variant.main === "#ff6b1a" ? "#2fd65f" : "#ff6b1a";
  const front = useDisposable(() => mesh(variant.main, variant.second), [variant.main, variant.second]);
  const other = useDisposable(() => mesh(otherColor, "#141414"), [otherColor]);
  const a = useDisposable(() => clay(variant.main, front, { sheen: 0.5 }), [front]);
  const b = useDisposable(() => clay(otherColor, other, { sheen: 0.5 }), [other]);
  return (
    <group>
      <mesh geometry={geometry} material={b} position={[0.35, 0.05, -0.3]} rotation={[0, -0.3, 0.1]} />
      <mesh geometry={geometry} material={a} position={[-0.2, -0.05, 0.1]} rotation={[0, 0.2, -0.05]} castShadow />
    </group>
  );
}

function Goal({ variant }: ModelProps) {
  const net = useDisposable(() => netTexture(), []);
  const white = useDisposable(() => new THREE.MeshPhysicalMaterial({ color: variant.main, roughness: 0.3, clearcoat: 0.6 }), [variant.main]);
  const w = 1.8;
  const h = 1.2;
  const d = 0.7;
  const bar = (from: [number, number, number], to: [number, number, number]) => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const len = a.distanceTo(b);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return (
      <mesh key={`${from}${to}`} position={mid} quaternion={q} material={white}>
        <cylinderGeometry args={[0.035, 0.035, len, 12]} />
      </mesh>
    );
  };
  const netMat = (
    <meshBasicMaterial map={net} transparent alphaTest={0.3} side={THREE.DoubleSide} color={variant.second} opacity={0.9} />
  );
  return (
    <group rotation={[0.25, -0.55, 0]} position={[0, -0.55, 0]}>
      {bar([-w / 2, 0, 0], [-w / 2, h, 0])}
      {bar([w / 2, 0, 0], [w / 2, h, 0])}
      {bar([-w / 2, h, 0], [w / 2, h, 0])}
      {bar([-w / 2, 0, -d], [w / 2, 0, -d])}
      {bar([-w / 2, h, 0], [-w / 2, 0, -d])}
      {bar([w / 2, h, 0], [w / 2, 0, -d])}
      <mesh position={[0, h / 2, -d / 2]} rotation={[Math.atan2(d, h), 0, 0]}>
        <planeGeometry args={[w, Math.hypot(h, d)]} />
        {netMat}
      </mesh>
    </group>
  );
}

function Stopwatch({ variant }: ModelProps) {
  const fonts = useFontsReady();
  const screen = useMemo(() => lcd("00:00.0"), [fonts]);
  useEffect(() => () => screen.texture.dispose(), [screen]);
  const last = useRef(-1);
  useFrame(({ clock }) => {
    const tenth = Math.floor(clock.elapsedTime * 10);
    if (tenth === last.current) return;
    last.current = tenth;
    const t = clock.elapsedTime % 600;
    const text = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}.${Math.floor((t % 1) * 10)}`;
    const { ctx, canvas, texture } = screen;
    ctx.fillStyle = "#0b130b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2fd65f";
    ctx.fillText(text, 256, 175);
    texture.needsUpdate = true;
  });
  return (
    <group rotation={[0.15, -0.35, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.3, 64]} />
        <meshPhysicalMaterial color={variant.main} roughness={0.45} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.12]}>
        <torusGeometry args={[0.82, 0.06, 16, 64]} />
        <meshPhysicalMaterial color={variant.second} roughness={0.35} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0.16]}>
        <planeGeometry args={[1.05, 0.52]} />
        <meshBasicMaterial map={screen.texture} toneMapped={false} />
      </mesh>
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={x} position={[x, 0.82 - Math.abs(x) * 0.25, 0]} rotation={[0, 0, -x * 0.9]}>
          <cylinderGeometry args={[0.09, 0.09, 0.16, 16]} />
          <meshPhysicalMaterial color={i === 1 ? variant.second : "#d9dde2"} roughness={0.3} metalness={i === 1 ? 0 : 0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.13, 0.03, 8, 24]} />
        <meshStandardMaterial color="#d9dde2" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Pump({ variant }: ModelProps) {
  const fonts = useFontsReady();
  const screen = useDisposable(() => lcd("8.5", variant.second).texture, [fonts, variant.second]);
  const hose = useDisposable(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([new THREE.Vector3(0.72, 0.1, 0), new THREE.Vector3(1.05, 0.2, 0.1), new THREE.Vector3(1.05, -0.45, 0.25), new THREE.Vector3(0.7, -0.6, 0.3)]),
        32,
        0.045,
        10
      ),
    []
  );
  return (
    <group rotation={[0.2, -0.5, 0]} position={[-0.2, 0.05, 0]}>
      <RoundedBox args={[1.35, 0.85, 0.6]} radius={0.18} smoothness={6} castShadow>
        <meshPhysicalMaterial color={variant.main} roughness={0.4} clearcoat={0.6} />
      </RoundedBox>
      <mesh position={[0, 0.432, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.302]}>
        <planeGeometry args={[1.0, 0.08]} />
        <meshBasicMaterial color={variant.second} toneMapped={false} />
      </mesh>
      <mesh position={[0.72, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.12, 0.16, 20]} />
        <meshStandardMaterial color="#2a2d31" roughness={0.5} />
      </mesh>
      <mesh geometry={hose}>
        <meshStandardMaterial color="#2a2d31" roughness={0.6} />
      </mesh>
      <mesh position={[0.5, -0.66, 0.32]} rotation={[0, 0, Math.PI / 2.4]}>
        <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
        <meshStandardMaterial color="#d9dde2" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Board() {
  const field = useDisposable(() => pitch(512, 360), []);
  const red: [number, number][] = [
    [-0.55, 0.3],
    [-0.55, -0.3],
    [-0.25, 0],
    [-0.15, 0.4],
    [-0.15, -0.4],
  ];
  return (
    <group rotation={[0.55, -0.35, 0.05]}>
      <RoundedBox args={[1.95, 1.4, 0.06]} radius={0.04} castShadow>
        <meshStandardMaterial color="#c9ced4" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.85, 1.3]} />
        <meshStandardMaterial map={field} roughness={0.8} />
      </mesh>
      {red.map(([x, y], i) => (
        <group key={i}>
          <mesh position={[x, y, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.035, 20]} />
            <meshPhysicalMaterial color="#d61f2c" clearcoat={1} roughness={0.3} />
          </mesh>
          <mesh position={[-x * 0.95, -y, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.035, 20]} />
            <meshPhysicalMaterial color="#1f56d6" clearcoat={1} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0.62, -0.82, 0.08]} rotation={[0, 0, 1.2]}>
        <capsuleGeometry args={[0.05, 0.7, 6, 12]} />
        <meshPhysicalMaterial color="#141414" clearcoat={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function ProductModel({ model, ...props }: ModelProps & { model: ModelId }) {
  switch (model) {
    case "kit":
      return <Kit {...props} />;
    case "jersey":
      return <Jersey {...props} />;
    case "shorts":
      return <Shorts {...props} />;
    case "socks":
      return <Socks {...props} />;
    case "jacket":
      return <Jacket {...props} />;
    case "ball":
      return <Ball {...props} />;
    case "boot":
      return <Boot {...props} />;
    case "shinguard":
      return <ShinGuards {...props} />;
    case "gloves":
      return <Gloves {...props} />;
    case "cones":
      return <Cones />;
    case "ladder":
      return <Ladder {...props} />;
    case "bib":
      return <Bibs {...props} />;
    case "goal":
      return <Goal {...props} />;
    case "stopwatch":
      return <Stopwatch {...props} />;
    case "pump":
      return <Pump {...props} />;
    case "board":
      return <Board />;
  }
}
