// Generate site imagery through OpenRouter. Run from the website root:
//   node scripts/images/run.mjs [--dry-run] [--agy] [name ...]
// Masters + sidecar JSON land in scripts/images/out/. Spend is logged in out/spend.json and capped.
import { readFile, writeFile, mkdir, stat, unlink } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const AGY = path.join(process.env.LOCALAPPDATA ?? '', 'agy', 'bin', 'agy.exe');

const MODEL = 'google/gemini-nano-banana-2.1'; // checked against /api/v1/models on 2026-10-28
const CAP_USD = 15;
const CONCURRENCY = 2;
const RETRIES = 3;
const STYLE =
  'Premium, candid editorial photo of a modern phone repair lab, shot on an iPhone 15 Pro: bright soft diffused daylight, clean and minimal, neutral palette of off-white, light grey, charcoal and black, true-to-life colour, crisp detail, no grain, no vignette, no clutter, no scratches or dirt, natural rather than staged, no CGI look, no added text or logos.';

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));
const OUT = path.join(dir, 'out');
const SPEND = path.join(OUT, 'spend.json');
const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const useAgy = args.includes('--agy');
const only = args.filter((a) => !a.startsWith('--'));

const key = readFileSync('.env.local', 'utf8').match(/^OPENROUTER_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key && !dry && !useAgy) throw new Error('OPENROUTER_API_KEY missing in .env.local');

const jobs = JSON.parse(await readFile(path.join(dir, 'jobs.json'), 'utf8')).filter(
  (j) => !only.length || only.includes(j.name),
);
await mkdir(OUT, { recursive: true });
const spend = existsSync(SPEND) ? JSON.parse(await readFile(SPEND, 'utf8')) : { total: 0, calls: [] };

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const masterOf = (name) =>
  ['.png', '.jpg', '.webp'].map((e) => path.join(OUT, name + e)).find(existsSync);

// "out:<name>" sources point at another job's master; that job runs first if it is in this batch.
const done = {};
async function source(src) {
  if (src.startsWith('out:')) {
    const name = src.slice(4);
    await done[name];
    const file = masterOf(name);
    if (!file && dry) return src;
    if (!file) throw new Error(`source ${src} has no master yet`);
    return file;
  }
  return src;
}

async function call(job) {
  const files = await Promise.all(job.sources.map(source));
  const prompt = `${STYLE} ${job.prompt}`;
  if (dry) return console.log(`[dry] ${job.name} <- ${files.join(', ')}\n      ${prompt}\n`);
  if (useAgy) return callAgy(job, files, prompt);
  // ponytail: cap checked before each call, so 2 in flight can overshoot by one call (~$0.10)
  if (spend.total >= CAP_USD) throw new Error(`spend cap $${CAP_USD} reached ($${spend.total.toFixed(2)})`);

  const content = [{ type: 'text', text: prompt }];
  for (const f of files)
    content.push({
      type: 'image_url',
      image_url: { url: `data:${MIME[path.extname(f).toLowerCase()]};base64,${(await readFile(f)).toString('base64')}` },
    });

  let res, err;
  for (let i = 1; i <= RETRIES; i++) {
    try {
      const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          modalities: ['image', 'text'],
          image_config: { aspect_ratio: job.aspect, image_size: '2K' },
          usage: { include: true },
          messages: [{ role: 'user', content }],
        }),
      });
      res = await r.json();
      if (!r.ok) {
        const e = new Error(`${r.status} ${JSON.stringify(res.error ?? res).slice(0, 300)}`);
        if (r.status < 500 && r.status !== 429) i = RETRIES; // credits, auth, bad request: retrying will not help
        throw e;
      }
      if (res.usage?.cost) record(job.name, res.usage.cost); // a call that returns no image can still bill
      if (!res.choices?.[0]?.message?.images?.length) throw new Error('no image in response');
      break;
    } catch (e) {
      err = e;
      res = null;
      console.warn(`  ${job.name} try ${i}/${RETRIES}: ${e.message}`);
      if (i < RETRIES) await new Promise((r) => setTimeout(r, 4000 * i));
    }
  }
  if (!res) throw err;

  const url = res.choices[0].message.images[0].image_url.url;
  const [, mime, b64] = url.match(/^data:([^;]+);base64,(.+)$/);
  const ext = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' }[mime] ?? '.png';
  const file = path.join(OUT, job.name + ext);
  await writeFile(file, Buffer.from(b64, 'base64'));
  await writeFile(
    path.join(OUT, job.name + '.json'),
    JSON.stringify(
      { model: res.model ?? MODEL, prompt, sources: job.sources, aspect: job.aspect, date: new Date().toISOString(), cost: res.usage?.cost ?? null },
      null,
      2,
    ) + '\n',
  );
  console.log(`  ${job.name}: ${path.relative(process.cwd(), file)} $${(res.usage?.cost ?? 0).toFixed(4)} (total $${spend.total.toFixed(2)})`);
}

// Fallback when OpenRouter fails: Antigravity's image tool. No per-call cost; quota ~14 images / 5 h.
async function callAgy(job, files, prompt) {
  const file = path.join(OUT, job.name + '.png');
  const refs = files.map((f, i) => `Reference photo ${i + 1}: ${path.resolve(f)}`).join('\n');
  const task = `Generate one photorealistic image with your image generation tool, using the reference photo(s) below as input images (edit them, do not just describe them). Aspect ratio ${job.aspect}, highest resolution available.
${refs}
Prompt: ${prompt}
Save the result as PNG to exactly this path: ${file}
Do not create or modify any other file. Reply with only the saved path.`;
  for (let i = 1; i <= RETRIES; i++) {
    const before = existsSync(file) ? (await stat(file)).mtimeMs : 0;
    const { stdout, stderr } = await run(AGY, ['-p', task, '--print-timeout', '8m0s', '--add-dir', path.resolve('.'), '--add-dir', path.resolve('..', 'growth', 'Photos')], {
      maxBuffer: 1 << 24,
    }).catch((e) => e);
    if (existsSync(file) && (await stat(file)).mtimeMs > before) break;
    const msg = `${stdout ?? ''}${stderr ?? ''}`.trim().slice(-300);
    console.warn(`  ${job.name} agy try ${i}/${RETRIES}: ${msg}`);
    if (/429|quota|RESOURCE_EXHAUSTED/i.test(msg) || i === RETRIES) throw new Error(`agy: ${msg}`);
  }
  await writeFile(
    path.join(OUT, job.name + '.json'),
    JSON.stringify({ model: 'agy generate_image', prompt, sources: job.sources, aspect: job.aspect, date: new Date().toISOString(), cost: null }, null, 2) + '\n',
  );
  for (const e of ['.jpg', '.webp']) if (existsSync(path.join(OUT, job.name + e))) await unlink(path.join(OUT, job.name + e)); // keep one master
  console.log(`  ${job.name}: ${path.relative(process.cwd(), file)} (agy)`);
}

function record(name, cost) {
  spend.total += cost;
  spend.calls.push({ name, cost, date: new Date().toISOString() });
  return writeFile(SPEND, JSON.stringify(spend, null, 2) + '\n');
}

// Pool of CONCURRENCY workers; done[name] lets dependants wait for their source.
const queue = [...jobs];
const resolvers = {};
for (const j of jobs) done[j.name] = new Promise((r) => (resolvers[j.name] = r));
let failed = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      // take a job whose out: source is not still pending in this batch
      const i = queue.findIndex((j) => j.sources.every((s) => !s.startsWith('out:') || !queue.some((q) => q.name === s.slice(4))));
      const job = queue.splice(i < 0 ? 0 : i, 1)[0];
      try {
        await call(job);
      } catch (e) {
        failed++;
        console.error(`x ${job.name}: ${e.message}`);
        if (e.message.startsWith('spend cap')) queue.length = 0;
      } finally {
        resolvers[job.name]();
      }
    }
  }),
);
console.log(`done: ${jobs.length - failed}/${jobs.length}, spend $${spend.total.toFixed(2)} of $${CAP_USD}`);
process.exitCode = failed ? 1 : 0;
