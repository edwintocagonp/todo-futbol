import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import type { Pattern } from "../content";

export function puffy(shape: THREE.Shape, depth = 0.16, bevel = 0.12) {
  const raw = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.75,
    bevelSegments: 6,
    curveSegments: 28,
  });
  raw.center();
  raw.computeBoundingBox();
  const box = raw.boundingBox!;
  const w = box.max.x - box.min.x;
  const h = box.max.y - box.min.y;
  const pos = raw.attributes.position;
  const uv = raw.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - box.min.x) / w, (pos.getY(i) - box.min.y) / h);
  raw.deleteAttribute("normal");
  const g = mergeVertices(raw, 1e-4);
  raw.dispose();
  g.computeVertexNormals();
  g.computeBoundingBox();
  return g;
}

export function bend(g: THREE.BufferGeometry, amount: number) {
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) - amount * pos.getX(i) ** 2);
  g.computeVertexNormals();
  return g;
}

export const clay = (color: string, map?: THREE.Texture | null, extra: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({
    color: map ? "#ffffff" : color,
    map: map ?? null,
    roughness: 0.55,
    clearcoat: 0.25,
    clearcoatRoughness: 0.45,
    sheen: 0.25,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(color),
    ...extra,
  });

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, ctx: c.getContext("2d")! };
}

function toTexture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function weave(ctx: CanvasRenderingContext2D, size: number) {
  for (let y = 0; y < size; y += 4)
    for (let x = (y / 4) % 2 ? 2 : 0; x < size; x += 4) {
      ctx.fillStyle = "rgba(0,0,0,0.045)";
      ctx.fillRect(x, y, 2, 2);
    }
}

export function fabric(main: string, second: string, pattern: Pattern = "plain", options: { band?: "top" | "bottom"; side?: boolean } = {}) {
  const size = 512;
  const { c, ctx } = canvas(size, size);
  ctx.fillStyle = main;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = second;
  if (pattern === "stripes") for (let x = 0; x < size; x += 96) ctx.fillRect(x + 48, 0, 40, size);
  if (pattern === "halves") ctx.fillRect(0, 0, size / 2, size);
  if (pattern === "sash") {
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.fillRect(-size, -46, size * 2, 92);
    ctx.restore();
  }
  if (pattern === "hoops") {
    ctx.fillRect(0, size * 0.38, size, size * 0.24);
    ctx.fillStyle = "#d61f2c";
    ctx.fillRect(0, size * 0.62, size, size * 0.1);
    ctx.fillStyle = second;
  }
  if (options.band === "top") ctx.fillRect(0, 0, size, 46);
  if (options.band === "bottom") ctx.fillRect(0, size - 60, size, 60);
  if (options.side) {
    ctx.fillRect(10, 0, 26, size);
    ctx.fillRect(size - 36, 0, 26, size);
  }
  weave(ctx, size);
  return toTexture(c);
}

export function backPrint(number: string, player: string, color: string) {
  const { c, ctx } = canvas(512, 512);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = '800 64px "Archivo Variable", sans-serif';
  ctx.fillText(player.toUpperCase(), 256, 120);
  ctx.font = '900 300px "Archivo Variable", sans-serif';
  ctx.fillText(number, 256, 420);
  return toTexture(c);
}

export function crest(main: string, second: string) {
  const { c, ctx } = canvas(256, 256);
  ctx.fillStyle = second;
  ctx.beginPath();
  ctx.moveTo(128, 20);
  ctx.lineTo(220, 56);
  ctx.quadraticCurveTo(214, 180, 128, 236);
  ctx.quadraticCurveTo(42, 180, 36, 56);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = main;
  ctx.textAlign = "center";
  ctx.font = '900 96px "Archivo Variable", sans-serif';
  ctx.fillText("TF", 128, 160);
  return toTexture(c);
}

export function shape(points: [string, ...number[]][]) {
  const s = new THREE.Shape();
  for (const [op, ...a] of points) {
    if (op === "M") s.moveTo(a[0], a[1]);
    else if (op === "L") s.lineTo(a[0], a[1]);
    else if (op === "Q") s.quadraticCurveTo(a[0], a[1], a[2], a[3]);
  }
  s.closePath();
  return s;
}

export const SHAPES = {
  jersey: () =>
    shape([
      ["M", -0.27, 1],
      ["Q", 0, 0.8, 0.27, 1],
      ["L", 0.6, 0.93],
      ["Q", 0.85, 0.82, 1.08, 0.52],
      ["L", 0.84, 0.24],
      ["Q", 0.74, 0.32, 0.62, 0.38],
      ["L", 0.64, -0.95],
      ["Q", 0, -1.05, -0.64, -0.95],
      ["L", -0.62, 0.38],
      ["Q", -0.74, 0.32, -0.84, 0.24],
      ["L", -1.08, 0.52],
      ["Q", -0.85, 0.82, -0.6, 0.93],
    ]),
  jacket: () =>
    shape([
      ["M", -0.22, 1.04],
      ["Q", 0, 0.92, 0.22, 1.04],
      ["L", 0.62, 0.93],
      ["Q", 0.9, 0.82, 0.98, 0.4],
      ["L", 1.08, -0.6],
      ["L", 0.82, -0.66],
      ["L", 0.72, 0.18],
      ["L", 0.67, -0.98],
      ["Q", 0, -1.04, -0.67, -0.98],
      ["L", -0.72, 0.18],
      ["L", -0.82, -0.66],
      ["L", -1.08, -0.6],
      ["L", -0.98, 0.4],
      ["Q", -0.9, 0.82, -0.62, 0.93],
    ]),
  shorts: () =>
    shape([
      ["M", -0.86, 0.72],
      ["L", 0.86, 0.72],
      ["L", 1, -0.7],
      ["L", 0.12, -0.78],
      ["L", 0, -0.18],
      ["L", -0.12, -0.78],
      ["L", -1, -0.7],
    ]),
  pants: () =>
    shape([
      ["M", -0.6, 1],
      ["L", 0.6, 1],
      ["L", 0.62, -1],
      ["L", 0.12, -1],
      ["L", 0, 0.2],
      ["L", -0.12, -1],
      ["L", -0.62, -1],
    ]),
  sock: () =>
    shape([
      ["M", -0.28, 1],
      ["L", 0.28, 1],
      ["L", 0.28, -0.35],
      ["Q", 0.3, -0.5, 0.5, -0.52],
      ["L", 0.72, -0.55],
      ["Q", 0.95, -0.62, 0.9, -0.85],
      ["Q", 0.85, -1.02, 0.6, -1],
      ["L", -0.1, -1],
      ["Q", -0.32, -0.98, -0.3, -0.7],
    ]),
  boot: () =>
    shape([
      ["M", -1, -0.28],
      ["L", 0.75, -0.3],
      ["Q", 1.12, -0.28, 1.1, -0.05],
      ["Q", 1, 0.12, 0.6, 0.18],
      ["L", 0.05, 0.38],
      ["Q", -0.2, 0.62, -0.55, 0.62],
      ["Q", -0.85, 0.6, -0.98, 0.35],
      ["Q", -1.08, 0.05, -1, -0.28],
    ]),
  sole: () =>
    shape([
      ["M", -1.02, -0.3],
      ["L", 0.78, -0.33],
      ["Q", 1.16, -0.32, 1.14, -0.12],
      ["L", 1.12, -0.2],
      ["Q", 1.1, -0.42, 0.78, -0.44],
      ["L", -0.98, -0.42],
      ["Q", -1.06, -0.4, -1.02, -0.3],
    ]),
  shinguard: () =>
    shape([
      ["M", 0, 1],
      ["Q", 0.55, 1, 0.58, 0.55],
      ["L", 0.48, -0.75],
      ["Q", 0.4, -1, 0, -1],
      ["Q", -0.4, -1, -0.48, -0.75],
      ["L", -0.58, 0.55],
      ["Q", -0.55, 1, 0, 1],
    ]),
  glove: () => {
    const fingers = [
      { x: 0.46, w: 0.22, h: 0.72 },
      { x: 0.24, w: 0.23, h: 0.95 },
      { x: 0.01, w: 0.23, h: 1.02 },
      { x: -0.22, w: 0.23, h: 0.92 },
    ];
    const s = new THREE.Shape();
    s.moveTo(-0.42, -1);
    s.lineTo(0.42, -1);
    s.lineTo(0.46, -0.45);
    for (const f of fingers) {
      s.lineTo(f.x, f.h - 0.11);
      s.quadraticCurveTo(f.x, f.h, f.x - f.w / 2, f.h);
      s.quadraticCurveTo(f.x - f.w, f.h, f.x - f.w, f.h - 0.11);
      s.lineTo(f.x - f.w, 0.5);
    }
    s.lineTo(-0.47, 0.1);
    s.quadraticCurveTo(-0.78, 0.3, -0.9, 0.12);
    s.quadraticCurveTo(-0.98, -0.02, -0.82, -0.12);
    s.quadraticCurveTo(-0.6, -0.3, -0.46, -0.45);
    s.closePath();
    return s;
  },
  bib: () =>
    shape([
      ["M", -0.3, 1],
      ["Q", 0, 0.72, 0.3, 1],
      ["L", 0.48, 1],
      ["Q", 0.5, 0.55, 0.72, 0.35],
      ["L", 0.72, -1],
      ["L", -0.72, -1],
      ["L", -0.72, 0.35],
      ["Q", -0.5, 0.55, -0.48, 1],
    ]),
};

export function mesh(main: string, second: string) {
  const size = 256;
  const { c, ctx } = canvas(size, size);
  ctx.fillStyle = main;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  for (let y = 6; y < size; y += 12)
    for (let x = (y / 12) % 2 ? 12 : 6; x < size; x += 12) {
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  ctx.fillStyle = second;
  ctx.fillRect(0, size - 18, size, 18);
  return toTexture(c);
}

export function pitch(width: number, height: number, lines = true) {
  const { c, ctx } = canvas(width, height);
  const stripes = 12;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 ? "#2f8f3a" : "#38a043";
    ctx.fillRect(0, (i * height) / stripes, width, height / stripes + 1);
  }
  if (lines) {
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.lineWidth = Math.max(2, width / 160);
    const m = width * 0.06;
    ctx.strokeRect(m, m, width - 2 * m, height - 2 * m);
    ctx.beginPath();
    ctx.moveTo(m, height / 2);
    ctx.lineTo(width - m, height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width * 0.14, 0, Math.PI * 2);
    ctx.stroke();
    const bw = width * 0.5;
    ctx.strokeRect((width - bw) / 2, m, bw, height * 0.14);
    ctx.strokeRect((width - bw) / 2, height - m - height * 0.14, bw, height * 0.14);
  }
  return toTexture(c);
}

export function lcd(text: string, color = "#2fd65f", bg = "#0b130b") {
  const { c, ctx } = canvas(512, 256);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = '700 130px "JetBrains Mono Variable", monospace';
  ctx.fillText(text, 256, 175);
  return { texture: toTexture(c), canvas: c, ctx };
}

export function netTexture() {
  const { c, ctx } = canvas(256, 256);
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 3;
  for (let i = 0; i <= 256; i += 21) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const ballCache = new Map<string, THREE.BufferGeometry>();

// 12 pentágonos y 20 hexágonos: cada punto toma el color del centro más cercano
export function ballGeometry(main: string, second: string, detail = 4) {
  const key = `${main}${second}${detail}`;
  const hit = ballCache.get(key);
  if (hit) return hit;
  const ico = new THREE.IcosahedronGeometry(1, 0);
  const p = ico.attributes.position;
  const centres: { v: THREE.Vector3; pent: boolean }[] = [];
  const seen: THREE.Vector3[] = [];
  for (let i = 0; i < p.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i).normalize();
    if (!seen.some((s) => s.distanceTo(v) < 1e-3)) {
      seen.push(v);
      centres.push({ v, pent: true });
    }
  }
  for (let i = 0; i < p.count; i += 3) {
    const v = new THREE.Vector3().fromBufferAttribute(p, i).add(new THREE.Vector3().fromBufferAttribute(p, i + 1)).add(new THREE.Vector3().fromBufferAttribute(p, i + 2));
    centres.push({ v: v.normalize(), pent: false });
  }
  ico.dispose();

  const raw = new THREE.IcosahedronGeometry(1, detail);
  const pos = raw.attributes.position;
  const colors: number[] = [];
  const a = new THREE.Color(main);
  const b = new THREE.Color(second);
  const seam = new THREE.Color("#3a3d40");
  const v = new THREE.Vector3();
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let best = -2;
    let next = -2;
    let pent = false;
    for (const c of centres) {
      const d = v.dot(c.v) + (c.pent ? 0.035 : 0);
      if (d > best) {
        next = best;
        best = d;
        pent = c.pent;
      } else if (d > next) next = d;
    }
    const edge = THREE.MathUtils.smoothstep(best - next, 0, 0.022);
    v.multiplyScalar(1 + 0.018 * edge - 0.012);
    pos.setXYZ(i, v.x, v.y, v.z);
    tmp.copy(pent ? b : a).lerp(seam, 1 - edge);
    colors.push(tmp.r, tmp.g, tmp.b);
  }
  raw.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  raw.deleteAttribute("normal");
  raw.deleteAttribute("uv");
  const g = mergeVertices(raw, 1e-5);
  raw.dispose();
  g.computeVertexNormals();
  ballCache.set(key, g);
  return g;
}
