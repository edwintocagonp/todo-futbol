import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function netTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
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
