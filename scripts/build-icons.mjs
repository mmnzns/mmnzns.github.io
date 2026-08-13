/**
 * Build the favicon set from the brand mark.
 *
 * Run with `node scripts/build-icons.mjs` after changing the source SVG. The
 * output is committed, so this is not part of the build — it's a one-off tool.
 *
 * Why PNG and ICO rather than an SVG favicon: the previous favicon was an SVG
 * that drew its "M" with a <text> element. Browsers rasterise favicons in a
 * restricted context where a system font is not guaranteed to resolve, so the
 * letter silently vanished and the tab showed an empty tile. Raster formats
 * have no such dependency. The brand SVG itself is 112KB of embedded bitmap,
 * so shipping it as-is would be worse on every axis.
 *
 * The mark is dark ink with a small accent dot. On its own it disappears
 * against a dark tab strip, so every size is composited onto paper.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// sharp wants a path, not a URL, once options are also being passed.
const SRC = fileURLToPath(
  new URL('../../Website Logos & Icons/MNMonzones.svg', import.meta.url),
);
const PAPER = { r: 251, g: 249, b: 246, alpha: 1 };

/** Mark on paper, with breathing room so it isn't clipped by rounded masks. */
async function tile(size, padRatio = 0.12) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const mark = await sharp(SRC, { density: 600 })
    .resize(inner, inner, { fit: 'contain', background: { ...PAPER, alpha: 0 } })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: PAPER },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Pack PNGs into an .ico. The format is a small directory followed by the
 * image payloads; modern Windows and every browser accept PNG payloads, so
 * there's no need to emit BMP.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width, 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const out = (name) => new URL(`../public/${name}`, import.meta.url);

const sizes = [16, 32, 48];
const images = [];
for (const size of sizes) {
  // Small sizes get less padding or the mark turns to a smudge.
  images.push({ size, data: await tile(size, size <= 32 ? 0.06 : 0.1) });
}

await writeFile(out('favicon.ico'), ico(images));
await writeFile(out('favicon-32.png'), images.find((i) => i.size === 32).data);
await writeFile(out('apple-touch-icon.png'), await tile(180, 0.14));

for (const [name, buf] of [
  ['favicon.ico', ico(images)],
  ['favicon-32.png', images.find((i) => i.size === 32).data],
]) {
  console.log(`${name.padEnd(22)} ${(buf.length / 1024).toFixed(1)}KB`);
}
console.log('apple-touch-icon.png   written');
