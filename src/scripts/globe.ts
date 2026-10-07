// Hero globe: dotted Earth on <canvas> with animated flight arcs from Colombo. ~5 KB, no 3D library.
// Orthographic projection; sways gently around Sri Lanka (always in view); pauses off-screen / in hidden tabs;
// renders a single static frame when the visitor prefers reduced motion.
//
// Performance (docs/09 — keep every frame well under 50 ms on a throttled phone):
// static sphere + glow pre-rendered once per resize; no trig per dot (angle-addition with precomputed sin/cos);
// dots batched into a few brightness buckets (one fill per bucket); one gradient stroke per comet trail;
// capped at 30 fps; animation only starts after the page has loaded and the browser is idle.
import { LAND } from '../data/land-mask';
import { CMB, DESTINATIONS } from '../lib/flights';
import { SRI_LANKA } from '../lib/geo-data';

const RAD = Math.PI / 180;
type Vec = [number, number, number];

const toVec = (lat: number, lon: number): Vec => [
  Math.cos(lat * RAD) * Math.sin(lon * RAD),
  Math.sin(lat * RAD),
  Math.cos(lat * RAD) * Math.cos(lon * RAD),
];

function decodeLand() {
  const bytes = Uint8Array.from(atob(LAND.bits), (c) => c.charCodeAt(0));
  const lat: number[] = [];
  const lon: number[] = [];
  for (let r = 0; r < LAND.rows; r++) {
    const la = LAND.top - LAND.step / 2 - r * LAND.step;
    if (la < -60) break; // Antarctica's coast compresses into streaks at the globe's rim
    for (let c = 0; c < LAND.cols; c++) {
      const i = r * LAND.cols + c;
      if (bytes[i >> 3]! & (1 << (i & 7))) {
        lat.push(la);
        lon.push(-180 + LAND.step / 2 + c * LAND.step);
      }
    }
  }
  return { lat, lon };
}

/** Great-circle path between two points, lifted off the surface in the middle. */
function arcPath(a: [number, number], b: [number, number], steps = 48): Vec[] {
  const p = toVec(a[0], a[1]);
  const q = toVec(b[0], b[1]);
  const dot = Math.min(1, Math.max(-1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]));
  const omega = Math.acos(dot);
  const lift = 0.06 + omega * 0.16;
  const out: Vec[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    const h = 1 + lift * Math.sin(Math.PI * t);
    out.push([(p[0] * s1 + q[0] * s2) * h, (p[1] * s1 + q[1] * s2) * h, (p[2] * s1 + q[2] * s2) * h]);
  }
  return out;
}

const BUCKETS = 6;

export function mountGlobe(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const { lat, lon } = decodeLand();
  const n = lat.length;
  // Precomputed unit-sphere components: x = cl·sin(lon), y = sl, z = cl·cos(lon).
  const px = new Float32Array(n);
  const py = new Float32Array(n);
  const pz = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const cl = Math.cos(lat[i]! * RAD);
    px[i] = cl * Math.sin(lon[i]! * RAD);
    py[i] = Math.sin(lat[i]! * RAD);
    pz[i] = cl * Math.cos(lon[i]! * RAD);
  }
  const bucketStyles = Array.from(
    { length: BUCKETS },
    (_, b) => `rgba(30,99,214,${(0.12 + ((b + 0.5) / BUCKETS) * 0.55).toFixed(2)})`,
  );
  const arcs = DESTINATIONS.map((d, i) => ({
    path: arcPath(CMB, d.coords),
    offset: (i * 0.137) % 1,
    speed: 0.00011 + (i % 5) * 0.000012,
  }));
  const hub = toVec(CMB[0], CMB[1]);
  // Sri Lanka's real coastline (Natural Earth), drawn as a highlighted shape — at 1.5° the dot grid alone
  // would only give the island 4–5 dots. Main island + Mannar/Jaffna islands.
  const island = SRI_LANKA.map((poly) => poly.map(([la, lo]) => toVec(la, lo)));
  const islandCentre = toVec(7.85, 80.7);

  let w = 0;
  let h = 0;
  let dpr = 1;
  let R = 0;
  let cx = 0;
  let cy = 0;
  let backdrop: HTMLCanvasElement | null = null;

  // View rotation: centre longitude (radians) + fixed tilt so the northern hemisphere leans toward us.
  let center = 80.7 * RAD;
  const tilt = -9 * RAD;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  let cosC = 1;
  let sinC = 0;

  const project = (v: Vec): [number, number, number] => {
    // Rotate around Y by −center (cosC/sinC are cos/sin of −center).
    const x = v[0] * cosC + v[2] * sinC;
    const z0 = -v[0] * sinC + v[2] * cosC;
    const y = v[1] * cosT - z0 * sinT;
    const z = v[1] * sinT + z0 * cosT;
    return [cx + x * R, cy - y * R, z];
  };
  const visible = (p: [number, number, number]) => {
    if (p[2] > 0) return true;
    const dx = (p[0] - cx) / R;
    const dy = (p[1] - cy) / R;
    return dx * dx + dy * dy > 1; // behind the globe but outside its disc (high part of an arc)
  };

  /** Atmosphere + sphere body, rendered once per size. */
  const renderBackdrop = () => {
    backdrop = document.createElement('canvas');
    backdrop.width = canvas.width;
    backdrop.height = canvas.height;
    const b = backdrop.getContext('2d')!;
    b.scale(dpr, dpr);
    const glow = b.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.3);
    glow.addColorStop(0, 'rgba(30,99,214,0.16)');
    glow.addColorStop(1, 'rgba(30,99,214,0)');
    b.fillStyle = glow;
    b.beginPath();
    b.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    b.fill();
    const body = b.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    body.addColorStop(0, '#ffffff');
    body.addColorStop(1, '#d6e6fb');
    b.fillStyle = body;
    b.beginPath();
    b.arc(cx, cy, R, 0, Math.PI * 2);
    b.fill();
    b.strokeStyle = 'rgba(30,99,214,0.22)';
    b.lineWidth = 1;
    b.stroke();
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    R = Math.min(w, h) * 0.37; // glow reaches 1.3R = 0.48 of the canvas: never touches its edges
    cx = w / 2;
    cy = h / 2;
    renderBackdrop();
    draw(performance.now());
  };

  const buckets: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());

  function draw(now: number) {
    cosC = Math.cos(-center);
    sinC = Math.sin(-center);
    ctx!.setTransform(1, 0, 0, 1, 0, 0);
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    if (backdrop) ctx!.drawImage(backdrop, 0, 0);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Land dots, bucketed by depth (brighter toward the viewer).
    for (let b = 0; b < BUCKETS; b++) buckets[b] = new Path2D();
    const size = Math.max(1.2, R / 170);
    const half = size / 2;
    for (let i = 0; i < n; i++) {
      const vx = px[i]!;
      const vz = pz[i]!;
      const vy = py[i]!;
      const z0 = -vx * sinC + vz * cosC;
      const z = vy * sinT + z0 * cosT;
      if (z <= 0.02) continue;
      const x = vx * cosC + vz * sinC;
      const y = vy * cosT - z0 * sinT;
      const b = Math.min(BUCKETS - 1, (z * BUCKETS) | 0);
      buckets[b]!.rect(cx + x * R - half, cy - y * R - half, size, size);
    }
    for (let b = 0; b < BUCKETS; b++) {
      ctx!.fillStyle = bucketStyles[b]!;
      ctx!.fill(buckets[b]!);
    }

    // Flight arcs: faint route + one gradient-stroked comet per arc.
    ctx!.lineCap = 'round';
    for (const a of arcs) {
      const pts = a.path.map(project);
      ctx!.strokeStyle = 'rgba(30,99,214,0.18)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      let pen = false;
      for (const p of pts) {
        if (!visible(p)) {
          pen = false;
          continue;
        }
        if (pen) ctx!.lineTo(p[0], p[1]);
        else ctx!.moveTo(p[0], p[1]);
        pen = true;
      }
      ctx!.stroke();

      const t = reduced ? 0.9 : (now * a.speed + a.offset) % 1.35;
      const head = Math.min(1, t);
      const tail = Math.max(0, t - 0.32);
      const i0 = Math.floor(tail * (pts.length - 1));
      const i1 = Math.floor(head * (pts.length - 1));
      if (i1 > i0) {
        const pTail = pts[i0]!;
        const pHead = pts[i1]!;
        const grad = ctx!.createLinearGradient(pTail[0], pTail[1], pHead[0], pHead[1]);
        grad.addColorStop(0, 'rgba(30,99,214,0)');
        grad.addColorStop(1, 'rgba(30,99,214,0.95)');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        pen = false;
        for (let i = i0; i <= i1; i++) {
          const p = pts[i]!;
          if (!visible(p)) {
            pen = false;
            continue;
          }
          if (pen) ctx!.lineTo(p[0], p[1]);
          else ctx!.moveTo(p[0], p[1]);
          pen = true;
        }
        ctx!.stroke();
        if (t < 1 && visible(pHead)) {
          ctx!.fillStyle = '#1e63d6';
          ctx!.beginPath();
          ctx!.arc(pHead[0], pHead[1], 2.2, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      if (t >= 1) {
        // Landing pulse at the destination.
        const end = pts[pts.length - 1]!;
        if (visible(end)) {
          const k = (t - 1) / 0.35;
          ctx!.strokeStyle = `rgba(30,99,214,${(1 - k).toFixed(2)})`;
          ctx!.lineWidth = 1.2;
          ctx!.beginPath();
          ctx!.arc(end[0], end[1], 2 + k * 10, 0, Math.PI * 2);
          ctx!.stroke();
        }
      }
    }

    // Sri Lanka: glowing halo, the real island outline filled bright, and a label.
    const sc = project(islandCentre);
    if (sc[2] > 0.05) {
      const pulse = reduced ? 0.4 : (now % 3000) / 3000;
      const halo = ctx!.createRadialGradient(sc[0], sc[1], 0, sc[0], sc[1], R * 0.16);
      halo.addColorStop(0, 'rgba(30,99,214,0.28)');
      halo.addColorStop(1, 'rgba(30,99,214,0)');
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(sc[0], sc[1], R * 0.16, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = `rgba(30,99,214,${(0.7 * (1 - pulse)).toFixed(2)})`;
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(sc[0], sc[1], R * 0.05 + pulse * R * 0.12, 0, Math.PI * 2);
      ctx!.stroke();

      // Illustrative 2.2× enlargement around the island centre so its shape reads at globe scale.
      const K = 2.2;
      const grow = (p: [number, number, number]) => [sc[0] + (p[0] - sc[0]) * K, sc[1] + (p[1] - sc[1]) * K] as const;
      const shape = new Path2D();
      for (const poly of island) {
        poly.forEach((v, i) => {
          const [x, y] = grow(project(v));
          if (i) shape.lineTo(x, y);
          else shape.moveTo(x, y);
        });
        shape.closePath();
      }
      ctx!.fillStyle = '#1e63d6';
      ctx!.fill(shape);
      ctx!.strokeStyle = '#ffffff';
      ctx!.lineWidth = 1;
      ctx!.stroke(shape);

      // Colombo on the west coast.
      const [hx, hy] = grow(project(hub));
      ctx!.fillStyle = '#ffffff';
      ctx!.beginPath();
      ctx!.arc(hx, hy, 2.6, 0, Math.PI * 2);
      ctx!.fill();

      // Label with a leader line, placed to the right of the island.
      const lx = sc[0] + R * 0.24;
      const ly = sc[1] - R * 0.14;
      ctx!.strokeStyle = 'rgba(11,23,48,0.45)';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(sc[0] + R * 0.07, sc[1] - R * 0.05);
      ctx!.lineTo(lx - 4, ly + 4);
      ctx!.stroke();
      ctx!.fillStyle = '#0b1730';
      ctx!.font = `500 ${Math.max(15, R * 0.06).toFixed(0)}px Fraunces, Georgia, serif`;
      ctx!.fillText('Sri Lanka', lx, ly);
      ctx!.fillStyle = '#1e63d6';
      ctx!.font = '600 10px Inter, system-ui, sans-serif';
      ctx!.fillText('COLOMBO · CMB', lx, ly + 15);
    }
  }

  // Animation loop (30 fps cap) with a gentle sway around Sri Lanka.
  let running = false;
  let ready = false; // becomes true after load + idle
  let inView = false;
  let raf = 0;
  let lastFrame = 0;
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - lastFrame < 33) return;
    lastFrame = now;
    // Gentle sway that always keeps Sri Lanka in view.
    const target = (80.7 + 22 * Math.sin(now * 0.00012)) * RAD;
    center += (target - center) * 0.04;
    draw(now);
  };
  const start = () => {
    if (running || reduced || !ready || !inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    inView = !!entry?.isIntersecting;
    if (inView) start();
    else stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  // Static first frame immediately; motion only once the page is loaded and idle.
  const begin = () => {
    ready = true;
    start();
  };
  const idle = (cb: () => void) =>
    'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1500);
  if (document.readyState === 'complete') idle(begin);
  else window.addEventListener('load', () => idle(begin), { once: true });
}
