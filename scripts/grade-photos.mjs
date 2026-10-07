// "Paradise grade" (docs/04 §8: slightly warm, lifted shadows, not over-saturated).
// Reads untouched originals from assets-src/photos/ and writes graded copies to src/assets/images/photos/.
// Re-run after adding or replacing a photo:  node scripts/grade-photos.mjs   (or: … --preview to make before/after sheets)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = 'assets-src/photos';
const OUT = 'src/assets/images/photos';
const preview = process.argv.includes('--preview');
const previewDir = process.argv[process.argv.indexOf('--preview') + 1] || '/tmp/grade-preview';

export async function grade(input) {
  return (
    sharp(input)
      .rotate()
      // 1. Gentle auto-levels: stretch the tonal range, ignoring the extreme 0.5% (fixes haze / flat exposures).
      .normalise({ lower: 0.5, upper: 99.85 })
      // 2. Warmth + lifted shadows, per channel (out = a·in + b). Slopes < 1 keep white at ~255 so skies
      //    don't blow out; the offsets lift blacks so shadows are soft rather than crushed; blue is pulled
      //    down a little more than red/green for warmth.
      .linear([0.995, 0.976, 0.95], [5, 6, 6])
      // 3. Vibrance-ish: modest saturation and a hair of brightness.
      .modulate({ saturation: 1.12, brightness: 1.01 })
      // 4. Light clarity.
      .sharpen({ sigma: 0.7, m1: 0.6, m2: 1.2 })
  );
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jpg'));
if (preview) fs.mkdirSync(previewDir, { recursive: true });
for (const f of files) {
  const input = path.join(SRC, f);
  if (preview) {
    const W = 640;
    const before = await sharp(input).rotate().resize({ width: W }).toBuffer({ resolveWithObject: true });
    const after = await (await grade(input)).resize({ width: W }).toBuffer();
    const h = before.info.height;
    await sharp({ create: { width: W * 2 + 8, height: h, channels: 3, background: '#ffffff' } })
      .composite([{ input: before.data, left: 0, top: 0 }, { input: after, left: W + 8, top: 0 }])
      .jpeg({ quality: 78 })
      .toFile(path.join(previewDir, f));
  } else {
    await (await grade(input)).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(OUT, f));
  }
}
console.log(`${preview ? 'previewed' : 'graded'} ${files.length} photos`);
