import { withArena } from '../arena.js'

/**
 * A complex path - koi.
 *
 * STATIC. This one is a showpiece: several hundred closed Bezier subpaths in a single
 * illustration, in the spirit of the lion the engine renders in its own reference
 * images. The achievement is that the engine draws it at all, so there is nothing to
 * drag or sweep - a control here would only let a visitor make it worse.
 *
 * Everything still derives from one cubic spine: sample it for position, tangent and
 * normal, and the body outline, every fin and every scale follow. The spine is now a
 * fixed pose rather than four handles.
 */

function cubicAt(a, b, c, d, u) {
  const m = 1 - u;
  return {
    x: m * m * m * a.x + 3 * m * m * u * b.x + 3 * m * u * u * c.x + u * u * u * d.x,
    y: m * m * m * a.y + 3 * m * m * u * b.y + 3 * m * u * u * c.y + u * u * u * d.y
  };
}
function cubicTangent(a, b, c, d, u) {
  const m = 1 - u;
  const x = 3 * m * m * (b.x - a.x) + 6 * m * u * (c.x - b.x) + 3 * u * u * (d.x - c.x);
  const y = 3 * m * m * (b.y - a.y) + 6 * m * u * (c.y - b.y) + 3 * u * u * (d.y - c.y);
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}
function bodyProfile(u, girth) {
  return Math.sin(Math.pow(u, 0.62) * Math.PI) * girth;
}
function smoothClosed(path, pts) {
  if (pts.length < 3) return;
  const mid = (p, q) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
  const first = mid(pts[pts.length - 1], pts[0]);
  path.moveTo(first.x, first.y);
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const m = mid(cur, next);
    path.quadTo(cur.x, cur.y, m.x, m.y);
  }
}
export default {
  id: 'koi',
  name: 'A complex path',
  slug: 'koi',
  static: true,
  concepts: [
    "hundreds of closed Bezier subpaths",
    "curvature-adaptive flattening at scale",
    "nonzero winding cutouts",
    "layered alpha on curved paths",
    "gradient shaders on paths"
  ],
  docsHref: "/projects/graphics-engine/docs/paths-gradients#construction",
  size: { w: 512, h: 512 },
  params: [],
  handles: [],
  draw(module, canvas) {
    // The pose and the styling are fixed: this demo is a finished picture, not a toy.
    const p = { girth: 42, scaleRows: 7, scaleCols: 26, finAlpha: 38, finRays: 5,
                palette: 'Kohaku', showBounds: 'Hide' }
    const h = { head: { x: 96, y: 168 }, c1: { x: 236, y: 96 },
                c2: { x: 292, y: 356 }, tail: { x: 430, y: 322 } }
    withArena(module, (g) => {
      const PALETTES = {
        Kohaku: {
          body: [[1, 0.99, 0.97, 1], [0.99, 0.93, 0.88, 1]],
          mark: [0.86, 0.24, 0.12],
          fin: [0.94, 0.55, 0.42],
          ink: [0.18, 0.13, 0.14]
        },
        Ogon: {
          body: [[1, 0.93, 0.72, 1], [0.86, 0.66, 0.24, 1]],
          mark: [0.78, 0.52, 0.1],
          fin: [0.94, 0.8, 0.45],
          ink: [0.28, 0.19, 0.06]
        },
        Ink: {
          body: [[0.93, 0.94, 0.96, 1], [0.62, 0.66, 0.72, 1]],
          mark: [0.16, 0.18, 0.24],
          fin: [0.42, 0.47, 0.56],
          ink: [0.09, 0.1, 0.13]
        }
      };
      const pal = PALETTES[p.palette];
      canvas.clear(0.98, 0.98, 0.97, 1);
      const { head, c1, c2, tail } = h;
      const P = (u) => cubicAt(head, c1, c2, tail, u);
      const T = (u) => cubicTangent(head, c1, c2, tail, u);
      const N = (u) => {
        const t = T(u);
        return { x: -t.y, y: t.x };
      };
      const girth = p.girth;
      const finA = p.finAlpha / 100;
      const rays = p.finRays | 0;
      const tp = P(1), tt = T(1), tn = N(1);
      let finRayCount = 0;
      const lobe = (spread, reach, a) => {
        const bx = tp.x - tt.x * girth * 0.3, by = tp.y - tt.y * girth * 0.3;
        const tipx = tp.x + tt.x * girth * reach + tn.x * girth * spread;
        const tipy = tp.y + tt.y * girth * reach + tn.y * girth * spread;
        const path = g.path();
        path.moveTo(bx, by);
        path.cubicTo(
          bx + tt.x * girth * 0.75 + tn.x * girth * spread * 0.3,
          by + tt.y * girth * 0.75 + tn.y * girth * spread * 0.3,
          tipx - tn.x * girth * 0.4,
          tipy - tn.y * girth * 0.4,
          tipx,
          tipy
        );
        path.cubicTo(
          tipx + tn.x * girth * 0.46,
          tipy + tn.y * girth * 0.46,
          bx + tt.x * girth * 0.6 + tn.x * girth * spread * 0.95,
          by + tt.y * girth * 0.6 + tn.y * girth * spread * 0.95,
          bx,
          by
        );
        canvas.drawPathWithPaint(path, g.paint({ color: pal.fin, alpha: finA * a }));
        for (let i = 1; i <= rays; i++) {
          const f = i / (rays + 1);
          const rx = bx + (tipx - bx) * 1 + tn.x * girth * spread * (f - 0.5) * 0.9;
          const ry = by + (tipy - by) * 1 + tn.y * girth * spread * (f - 0.5) * 0.9;
          const ray = g.path();
          const wob = girth * 0.045;
          ray.moveTo(bx, by);
          ray.quadTo((bx + rx) / 2 + tn.x * wob, (by + ry) / 2 + tn.y * wob, rx, ry);
          ray.quadTo((bx + rx) / 2 - tn.x * wob, (by + ry) / 2 - tn.y * wob, bx, by);
          canvas.drawPathWithPaint(ray, g.paint({ color: pal.fin, alpha: finA * 0.85 }));
          finRayCount++;
        }
      };
      for (const [spread, reach, a] of [
        [1.75, 1.35, 0.6],
        [1.05, 1.75, 0.8],
        [0.15, 1.95, 1],
        [-0.85, 1.75, 0.8],
        [-1.6, 1.35, 0.6]
      ]) lobe(spread, reach, a);
      const finAt = (u, side, len, sweep) => {
        const pos = P(u), t = T(u), n = N(u);
        const w = bodyProfile(u, girth) * 0.8;
        const root = { x: pos.x + n.x * w * side, y: pos.y + n.y * w * side };
        const tip = {
          x: root.x + n.x * len * side + t.x * sweep,
          y: root.y + n.y * len * side + t.y * sweep
        };
        const path = g.path();
        path.moveTo(root.x - t.x * girth * 0.28, root.y - t.y * girth * 0.28);
        path.quadTo(
          root.x + n.x * len * 0.6 * side - t.x * girth * 0.1,
          root.y + n.y * len * 0.6 * side - t.y * girth * 0.1,
          tip.x,
          tip.y
        );
        path.quadTo(
          root.x + n.x * len * 0.4 * side + t.x * girth * 0.5,
          root.y + n.y * len * 0.4 * side + t.y * girth * 0.5,
          root.x + t.x * girth * 0.3,
          root.y + t.y * girth * 0.3
        );
        canvas.drawPathWithPaint(path, g.paint({ color: pal.fin, alpha: finA }));
      };
      finAt(0.3, 1, girth * 0.95, girth * 0.5);
      finAt(0.3, -1, girth * 0.8, girth * 0.45);
      finAt(0.58, 1, girth * 0.7, girth * 0.4);
      const STEPS = 34;
      const outline = [];
      for (let i = 0; i <= STEPS; i++) {
        const u = i / STEPS;
        const pos = P(u), n = N(u), w = bodyProfile(u, girth);
        outline.push({ x: pos.x + n.x * w, y: pos.y + n.y * w });
      }
      for (let i = STEPS; i >= 0; i--) {
        const u = i / STEPS;
        const pos = P(u), n = N(u), w = bodyProfile(u, girth);
        outline.push({ x: pos.x - n.x * w, y: pos.y - n.y * w });
      }
      const body = g.path();
      smoothClosed(body, outline);
      const bodyShader = g.shader(module.createLinearGradient(
        head.x,
        head.y,
        tail.x,
        tail.y,
        g.vec([...pal.body[0], ...pal.body[1]]),
        0
      ), "body gradient");
      canvas.drawPathWithPaint(body, g.paint({ shader: bodyShader }));
      {
        const band = [];
        for (let i = 0; i <= STEPS; i++) {
          const u = i / STEPS, pos = P(u), n = N(u), w = bodyProfile(u, girth);
          band.push({ x: pos.x + n.x * w, y: pos.y + n.y * w });
        }
        for (let i = STEPS; i >= 0; i--) {
          const u = i / STEPS, pos = P(u), n = N(u), w = bodyProfile(u, girth) * 0.55;
          band.push({ x: pos.x + n.x * w, y: pos.y + n.y * w });
        }
        const shade = g.path();
        smoothClosed(shade, band);
        canvas.drawPathWithPaint(shade, g.paint({ color: pal.ink, alpha: 0.1 }));
      }
      const rows = p.scaleRows | 0;
      const cols = p.scaleCols | 0;
      let scaleCount = 0;
      if (rows > 0) {
        for (let r = 0; r < rows; r++) {
          const v = rows === 1 ? 0 : r / (rows - 1) * 1.5 - 0.75;
          for (let cIdx = 0; cIdx < cols; cIdx++) {
            const u = 0.1 + cIdx / cols * 0.74;
            const pos = P(u), t = T(u), n = N(u);
            const w = bodyProfile(u, girth);
            const cx = pos.x + n.x * w * v;
            const cy = pos.y + n.y * w * v;
            const s = girth * 0.3 * (1 - Math.abs(v) * 0.35) * (1.05 - u * 0.45);
            if (s < 1.2) continue;
            const path = g.path();
            const ax = cx - t.x * s, ay = cy - t.y * s;
            const bx = cx + t.x * s, by = cy + t.y * s;
            path.moveTo(ax, ay);
            path.quadTo(cx + n.x * s * 1.15, cy + n.y * s * 1.15, bx, by);
            path.quadTo(cx + n.x * s * 0.35, cy + n.y * s * 0.35, ax, ay);
            canvas.drawPathWithPaint(path, g.paint({
              color: pal.mark,
              alpha: 0.16 + 0.1 * ((cIdx + r) % 2)
            }));
            scaleCount++;
          }
        }
      }
      for (const [u, side, size] of [[0.26, 0.3, 0.95], [0.44, -0.45, 0.7], [0.63, 0.35, 0.55]]) {
        const pos = P(u), t = T(u), n = N(u);
        const w = bodyProfile(u, girth);
        const cx = pos.x + n.x * w * side, cy = pos.y + n.y * w * side;
        const s = girth * size * 0.55;
        const blotch = g.path();
        blotch.moveTo(cx - t.x * s, cy - t.y * s);
        blotch.cubicTo(
          cx - t.x * s * 0.3 + n.x * s,
          cy - t.y * s * 0.3 + n.y * s,
          cx + t.x * s * 0.6 + n.x * s * 0.8,
          cy + t.y * s * 0.6 + n.y * s * 0.8,
          cx + t.x * s,
          cy + t.y * s
        );
        blotch.cubicTo(
          cx + t.x * s * 0.4 - n.x * s * 0.9,
          cy + t.y * s * 0.4 - n.y * s * 0.9,
          cx - t.x * s * 0.5 - n.x * s * 0.7,
          cy - t.y * s * 0.5 - n.y * s * 0.7,
          cx - t.x * s,
          cy - t.y * s
        );
        canvas.drawPathWithPaint(blotch, g.paint({ color: pal.mark, alpha: 0.82 }));
      }
      {
        const u = 0.115;
        const pos = P(u), n = N(u);
        const w = bodyProfile(u, girth);
        const ex = pos.x + n.x * w * 0.46, ey = pos.y + n.y * w * 0.46;
        const rOuter = Math.max(3.4, girth * 0.165);
        const eye = g.path();
        eye.addCircle(ex, ey, rOuter, module.PathDirection.CW);
        eye.addCircle(ex, ey, rOuter * 0.42, module.PathDirection.CCW);
        canvas.drawPathWithPaint(eye, g.paint({ color: pal.ink }));
        const pupil = g.path();
        pupil.addCircle(ex, ey, rOuter * 0.42, module.PathDirection.CW);
        canvas.drawPathWithPaint(pupil, g.paint({ color: pal.ink, alpha: 0.85 }));
        const spark = g.path();
        spark.addCircle(
          ex - rOuter * 0.28,
          ey - rOuter * 0.3,
          rOuter * 0.24,
          module.PathDirection.CW
        );
        canvas.drawPathWithPaint(spark, g.paint({ color: [1, 1, 1], alpha: 0.9 }));
      }
      for (const side of [1, -1]) {
        const pos = P(0.01), t = T(0.01), n = N(0.01);
        const path = g.path();
        const w = girth * 0.22;
        const sx = pos.x + n.x * w * side * 0.7, sy = pos.y + n.y * w * side * 0.7;
        const ex = sx - t.x * girth * 0.9 + n.x * girth * 0.55 * side;
        const ey = sy - t.y * girth * 0.9 + n.y * girth * 0.55 * side;
        path.moveTo(sx, sy);
        path.quadTo(sx - t.x * girth * 0.65, sy - t.y * girth * 0.65, ex, ey);
        path.quadTo(
          sx - t.x * girth * 0.5 + n.x * 2 * side,
          sy - t.y * girth * 0.5 + n.y * 2 * side,
          sx,
          sy
        );
        canvas.drawPathWithPaint(path, g.paint({ color: pal.ink, alpha: 0.7 }));
      }
      if (p.showBounds === "Show") {
        const l = body.boundsLeft(), tpp = body.boundsTop();
        const r = body.boundsRight(), b = body.boundsBottom();
        const frame = g.path();
        frame.addRect(l, tpp, r - l, b - tpp, module.PathDirection.CW);
        frame.addRect(l + 2, tpp + 2, r - l - 4, b - tpp - 4, module.PathDirection.CCW);
        canvas.drawPathWithPaint(frame, g.paint({ color: [0.55, 0.35, 0.2], alpha: 0.75 }));
      }
      this._scaleCount = scaleCount;
      this._finRayCount = finRayCount;
    });
  },
};
