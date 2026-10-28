// ponytail: mock screenshots only. Run: NODE_PATH="$(npm root -g)" node shot.mjs <url> <outdir>
import { chromium } from 'playwright';
const [,, url, out] = process.argv;
const b = await chromium.launch({ channel: 'msedge' });
const shots = [
  ['desktop-light', { width: 1440, height: 900 }, 1, 'light', false],
  ['desktop-dark', { width: 1440, height: 900 }, 1, 'dark', false],
  ['zoom-200', { width: 720, height: 450 }, 2, 'light', false], // 1440x900 at 200% browser zoom
  ['mobile-light', { width: 390, height: 844 }, 2, 'light', true],
  ['mobile-dark', { width: 390, height: 844 }, 2, 'dark', true],
];
for (const [name, viewport, deviceScaleFactor, colorScheme, isMobile] of shots) {
  const p = await b.newPage({ viewport, deviceScaleFactor, colorScheme, isMobile });
  await p.goto(url, { waitUntil: 'networkidle' });
  if (name === 'desktop-light') { await p.screenshot({ path: `${out}/hero-desktop-closed.png` }); await p.waitForTimeout(700); await p.screenshot({ path: `${out}/hero-desktop-opening.png` }); }
  await p.waitForTimeout(2600); // let the fold finish opening
  await p.screenshot({ path: `${out}/hero-${name}.png` });
  if (name === 'desktop-light' || name === 'mobile-light') { await p.mouse.wheel(0, 700); await p.waitForTimeout(300); await p.mouse.wheel(0, -150); await p.waitForTimeout(500); await p.screenshot({ path: `${out}/hero-${name}-island.png` }); }
  await p.close();
}
await b.close();
