// Contact sheet and web export for the masters in scripts/images/out/. Run from the website root:
//   node scripts/images/export.mjs --sheet   numbered contact sheet -> scripts/images/out/sheet.jpg
//   node scripts/images/export.mjs [name ...] public/images/<name>-<w>.avif|webp, <name>-og.jpg, alt.json (named images only: the rest of alt.json stays)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTHS = [640, 960, 1280, 1920];
const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const OUT = path.join(dir, 'out');
const PUB = path.resolve('public', 'images');
const jobs = JSON.parse(await readFile(path.join(dir, 'jobs.json'), 'utf8'));
const masterOf = (name) => ['.png', '.jpg', '.webp'].map((e) => path.join(OUT, name + e)).find(existsSync);
const esc = (s) => s.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);

if (process.argv.includes('--sheet')) {
  const T = 480;
  const have = jobs.map((j, i) => ({ ...j, n: i + 1, file: masterOf(j.name) })).filter((j) => j.file);
  const cols = 4;
  const tiles = await Promise.all(
    have.map(async (j, i) => {
      const img = await sharp(j.file).resize(T, T * 0.75, { fit: 'cover' }).toBuffer();
      const label = Buffer.from(
        `<svg width="${T}" height="40"><rect width="100%" height="100%" fill="#0E0E0E"/><text x="12" y="27" font-family="Arial" font-size="20" fill="#F5F5F2">${j.n}. ${esc(j.name)}</text></svg>`,
      );
      const tile = await sharp({ create: { width: T, height: T * 0.75 + 40, channels: 3, background: '#F5F5F2' } })
        .composite([{ input: img, top: 0, left: 0 }, { input: label, top: T * 0.75, left: 0 }])
        .png()
        .toBuffer();
      return { input: tile, left: (i % cols) * (T + 8), top: Math.floor(i / cols) * (T * 0.75 + 48) };
    }),
  );
  const rows = Math.ceil(have.length / cols);
  await sharp({ create: { width: cols * (T + 8) - 8, height: rows * (T * 0.75 + 48) - 8, channels: 3, background: '#FFFFFF' } })
    .composite(tiles)
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, 'sheet.jpg'));
  const missing = jobs.filter((j) => !masterOf(j.name)).map((j) => j.name);
  console.log(`sheet: ${have.length} images${missing.length ? `, missing: ${missing.join(', ')}` : ''}`);
  process.exit();
}

await mkdir(PUB, { recursive: true });
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const alt = only.length ? JSON.parse(await readFile(path.join(PUB, 'alt.json'), 'utf8')) : {};
for (const j of jobs) {
  if (only.length && !only.includes(j.name)) continue;
  const file = masterOf(j.name);
  if (!file) {
    console.warn(`  skip ${j.name}: no master yet (run run.mjs)`);
    continue;
  }
  const side = JSON.parse(await readFile(path.join(OUT, j.name + '.json'), 'utf8').catch(() => '{}'));
  // XMP travels with every file: what it shows, and an IPTC flag that it is AI-made (Google reads DigitalSourceType).
  // Clean-ups of a real photo are "composite"; new scenes are fully generated.
  const edit = !j.prompt.startsWith('New') && !!j.sources[0] && !j.sources[0].startsWith('out:');
  const type = side.model === 'photo' ? 'digitalCapture' : edit ?'compositeWithTrainedAlgorithmicMedia' : 'trainedAlgorithmicMedia';
  const xmp = `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" Iptc4xmpExt:DigitalSourceType="http://cv.iptc.org/newscodes/digitalsourcetype/${type}"><dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(j.alt)}</rdf:li></rdf:Alt></dc:title><dc:creator><rdf:Seq><rdf:li>Rehan Traders</rdf:li></rdf:Seq></dc:creator><dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© Rehan Traders, Hafeez Center, Lahore</rdf:li></rdf:Alt></dc:rights></rdf:Description></rdf:RDF></x:xmpmeta>`;
  const meta = await sharp(file).metadata();
  const width = Math.min(meta.width, WIDTHS.at(-1));
  const height = Math.round((meta.height * width) / meta.width); // size of the largest exported file
  for (const w of WIDTHS) {
    const r = () => sharp(file).resize({ width: w, withoutEnlargement: true }).withXmp(xmp);
    await r().avif({ quality: 55, effort: 6 }).toFile(path.join(PUB, `${j.name}-${w}.avif`));
    await r().webp({ quality: 74, effort: 6 }).toFile(path.join(PUB, `${j.name}-${w}.webp`));
  }
  await sharp(file).resize(1200, 630, { fit: 'cover', position: 'attention' }).withXmp(xmp).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(PUB, `${j.name}-og.jpg`));
  alt[j.name] = { alt: j.alt, width, height, placeholder: j.name.startsWith('placeholder-'), ai: side.model !== 'photo' };
  console.log(`  ${j.name} ${width}x${height}`);
}
await writeFile(path.join(PUB, 'alt.json'), JSON.stringify(alt, null, 2) + '\n');
console.log(`exported ${Object.keys(alt).length}/${jobs.length} images to public/images/`);
