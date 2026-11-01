// The hero's 3D Galaxy Z Fold6, in three.js. Fold3D loads this module with import() on the first interaction, so three.js
// is never part of the first page load. Units are millimetres. Material colours are numbers here (Fold6 Navy, glass):
// the phone is a physical object, the same in light and dark. The screens' brand colours come from the
// --device-* tokens in globals.css.

import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

import { QR_PATH } from "@/components/job-card"
import { MARK } from "@/components/logo"
import { hero, jobCardContent } from "@/content"

// Galaxy Z Fold6: open 132.6 x 153.5 x 5.6 mm, closed 68.1 x 153.5 x 12.1 mm.
const W = 66.3 // one half
const H = 153.5
const T = 5.6
const G = 0.12 // half the crease gap
const C = 0.2 // hinge axis sits this far in front of the screen, so the closed screens are 2C apart
const B = 3.2 // inner screen bezel
const R_OUT = 3 // outer corner radius: the Fold6's squared corners
const BEVEL = 0.9
const SW = W - B // one half of the inner screen
const SH = H - 2 * B
const COVER = { w: 60.4, h: 148.2, bottom: 2.7, hole: 3.5, holeY: 3.4 } // display, its bottom bezel, front camera
const NOTCH = { w: 9.6, d: 1.4 } // the hinge cap's notch in the frame, top and bottom, while open

const OPEN_V = 0.5 // the left half leans in this far (radians) while open, so the phone reads as a fold
const POSE = {
  open: { yaw: -0.34, pitch: 0.18, x: 4, z: T / 2 + 8 },
  closed: { yaw: 0.5, pitch: 0.12, x: -(G + W / 2) + 2, z: -C },
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const easeIn = (t: number) => 1 - Math.cos((t * Math.PI) / 2) // fastest at the end: the halves snap shut
const css = (hex: number) => new THREE.Color(hex).getStyle()

/** Rounded rectangle with one radius for the left corners and one for the right. */
function rrect(x0: number, y0: number, x1: number, y1: number, rl: number, rr: number) {
  const s = new THREE.Shape()
  s.moveTo(x0 + rl, y0)
  s.absarc(x1 - rr, y0 + rr, rr, -Math.PI / 2, 0, false)
  s.absarc(x1 - rr, y1 - rr, rr, 0, Math.PI / 2, false)
  s.absarc(x0 + rl, y1 - rl, rl, Math.PI / 2, Math.PI, false)
  s.absarc(x0 + rl, y0 + rl, rl, Math.PI, Math.PI * 1.5, false)
  return s
}

/** Flat shape whose UVs span the box [x, y, w, h]. `flip` mirrors u, for a screen seen from behind. */
function plate(shape: THREE.Shape, [bx, by, bw, bh]: number[], flip = false) {
  const g = new THREE.ShapeGeometry(shape, 12)
  const p = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < p.count; i++) {
    const u = (p.getX(i) - bx) / bw
    uv.setXY(i, flip ? 1 - u : u, (p.getY(i) - by) / bh)
  }
  return g
}

/**
 * The right half's body, z from -T (back) to 0 (screen), notched for the hinge cap at top and bottom; the left half is
 * the same body mirrored. Caps (group 0) take the glass, sides (group 1) the frame. The outline is inset by the bevel,
 * which grows it back.
 */
function body() {
  const [x0, x1, y0, y1, r] = [G + BEVEL, G + W - BEVEL, -H / 2 + BEVEL, H / 2 - BEVEL, R_OUT - BEVEL]
  const nx = NOTCH.w / 2 + BEVEL
  const s = new THREE.Shape()
  s.moveTo(x0, y0 + NOTCH.d)
  s.lineTo(nx, y0 + NOTCH.d)
  s.lineTo(nx, y0)
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false)
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false)
  s.lineTo(nx, y1)
  s.lineTo(nx, y1 - NOTCH.d)
  s.lineTo(x0, y1 - NOTCH.d)
  const g = new THREE.ExtrudeGeometry(s, { depth: T - 2 * BEVEL, bevelThickness: BEVEL, bevelSize: BEVEL, bevelSegments: 4, curveSegments: 16 })
  return g.translate(0, 0, -T + BEVEL)
}

function canvas2d(w: number, h: number) {
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  return { c, x: c.getContext("2d")! }
}

function texture(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

type Ink = { paper: string; ink: string; steel: string; rule: string; red: string; display: string; type: string }

function tokens(): Ink {
  const root = getComputedStyle(document.documentElement)
  const v = (name: string, fallback: string) => root.getPropertyValue(name).trim() || fallback
  return {
    paper: v("--device-paper", "white"),
    ink: v("--device-ink", "black"),
    steel: v("--device-steel", "gray"),
    rule: v("--device-rule", "silver"),
    red: v("--device-red", "red"),
    display: v("--font-display", "sans-serif"),
    type: v("--font-typewriter", "monospace"),
  }
}

/** The brand mark centred on (cx, cy), `size` wide. `glow` blurs each part in its own colour. */
function mark(x: CanvasRenderingContext2D, cx: number, cy: number, size: number, stroke: string, red: string, glow = 0) {
  x.save()
  x.translate(cx - size / 2, cy - size / 2)
  x.scale(size / 256, size / 256)
  x.shadowBlur = glow
  x.shadowColor = stroke
  x.strokeStyle = stroke
  x.lineWidth = MARK.width
  x.stroke(new Path2D(MARK.stroke))
  x.fillStyle = stroke
  x.beginPath()
  x.arc(MARK.dot.cx, MARK.dot.cy, MARK.dot.r, 0, Math.PI * 2)
  x.fill()
  x.shadowColor = red
  x.fillStyle = red
  x.fill(new Path2D(MARK.t))
  x.restore()
}

/** The open inner screen: wallpaper, status bar and the Rehan Traders job card (the JobCard layout), across both halves. */
function innerScreen(k: Ink) {
  const cw = 1024
  const ch = Math.round((cw * SH) / (2 * (SW + G)))
  const { c, x } = canvas2d(cw, ch)

  const bg = x.createLinearGradient(0, 0, cw * 0.45, ch)
  bg.addColorStop(0, css(0x34405e))
  bg.addColorStop(0.5, css(0x1a2133))
  bg.addColorStop(1, css(0x080a10))
  x.fillStyle = bg
  x.fillRect(0, 0, cw, ch)
  // A soft diagonal plane of light, like the One UI wallpaper.
  x.globalAlpha = 0.07
  x.fillStyle = k.paper
  x.beginPath()
  x.moveTo(cw * 0.1, ch)
  x.lineTo(cw, ch * 0.08)
  x.lineTo(cw, ch * 0.5)
  x.lineTo(cw * 0.6, ch)
  x.fill()

  // Status bar and gesture bar. The inner camera sits under the display, unseen.
  x.globalAlpha = 0.9
  x.fillStyle = k.paper
  x.strokeStyle = k.paper
  x.textBaseline = "middle"
  x.font = `600 28px ${k.display}`
  x.fillText(hero.fold.time, 48, 46)
  x.textAlign = "right"
  x.fillText(hero.fold.network, cw - 112, 46)
  x.textAlign = "left"
  x.lineWidth = 2.5
  x.beginPath()
  x.roundRect(cw - 98, 34, 44, 24, 7)
  x.stroke()
  x.fillRect(cw - 93, 39, 30, 14)
  x.fillRect(cw - 52, 41, 4, 10)
  x.globalAlpha = 0.5
  x.beginPath()
  x.roundRect(cw / 2 - 70, ch - 26, 140, 7, 4)
  x.fill()
  x.globalAlpha = 1

  // The job card.
  const pad = 52
  const w = cw - 2 * pad
  const h = Math.round(w * 0.62)
  const top = Math.round((ch - h) / 2 + 20)
  const col = w * 0.3
  x.save()
  x.beginPath()
  x.roundRect(pad, top, w, h, 30)
  x.clip()
  x.fillStyle = k.ink
  x.fillRect(pad, top, col, h)
  x.fillStyle = k.paper
  x.fillRect(pad + col, top, w - col, h)
  mark(x, pad + col / 2, top + h / 2, col * 0.66, k.paper, k.red)

  const left = pad + col + 44
  const right = pad + w - 44
  const inner = right - left
  const y0 = top + 44
  mark(x, left + 28, y0 + 28, 56, k.ink, k.red)
  x.fillStyle = k.ink
  x.textBaseline = "top"
  x.font = `800 28px ${k.display}`
  x.fillText(jobCardContent.brandFirst, left + 70, y0 + 2)
  x.fillText(jobCardContent.brandSecond, left + 70, y0 + 30)
  const qr = 108
  x.save()
  x.translate(right - qr, y0)
  x.scale(qr / 25, qr / 25)
  x.fill(new Path2D(QR_PATH))
  x.restore()

  const rowH = 80
  const fieldsTop = top + h - 40 - 2 * rowH
  let size = 76
  x.font = `700 ${size}px ${k.display}`
  size = Math.floor(size * Math.min(1, inner / x.measureText(jobCardContent.phone).width))
  x.font = `700 ${size}px ${k.display}`
  x.textBaseline = "middle"
  x.fillText(jobCardContent.phone, left - 2, (y0 + qr + fieldsTop) / 2)

  const gap = 40
  const fw = (inner - gap) / 2
  x.textBaseline = "top"
  Object.values(jobCardContent.fields).forEach((f, i) => {
    const fx = left + (i % 2) * (fw + gap)
    const fy = fieldsTop + Math.floor(i / 2) * rowH
    x.fillStyle = k.steel
    x.font = `500 20px ${k.display}`
    x.fillText(f.label, fx, fy)
    x.fillStyle = k.ink
    x.font = `700 24px ${k.type}`
    x.fillText(f.initial, fx, fy + 28, fw)
    x.fillStyle = k.rule
    x.fillRect(fx, fy + 62, fw, 2)
  })
  x.restore()

  // The crease: a soft shade and a faint sheen down the middle, a few pixels wide, not a line.
  for (let i = -8; i <= 8; i++) {
    x.globalAlpha = 0.1 * Math.exp(-((i + 2) ** 2) / 8)
    x.fillStyle = "black"
    x.fillRect(cw / 2 + i, 0, 1, ch)
    x.globalAlpha = 0.06 * Math.exp(-((i - 3) ** 2) / 6)
    x.fillStyle = k.paper
    x.fillRect(cw / 2 + i, 0, 1, ch)
  }
  x.globalAlpha = 1
  return c
}

/** The cover screen: black, with the mark and its glow. Brightness breathes through emissiveIntensity. */
function coverScreen(k: Ink) {
  const cw = 512
  const ch = Math.round((cw * COVER.h) / COVER.w)
  const { c, x } = canvas2d(cw, ch)
  x.fillStyle = "black"
  x.fillRect(0, 0, cw, ch)
  x.globalAlpha = 0.55
  mark(x, cw / 2, ch / 2, 168, k.paper, k.red, 70)
  x.globalAlpha = 1
  mark(x, cw / 2, ch / 2, 168, k.paper, k.red, 18)
  // Front camera: centred, near the top.
  const mm = cw / COVER.w
  x.fillStyle = "black"
  x.strokeStyle = css(0x2a2d35)
  x.lineWidth = 0.3 * mm
  x.beginPath()
  x.arc(cw / 2, COVER.holeY * mm, (COVER.hole / 2) * mm, 0, Math.PI * 2)
  x.fill()
  x.stroke()
  return c
}

const CLICK_VOLUME = 3.5 // the files peak about -14 dBFS, too quiet for a phone speaker; this lifts them to about -3. Tune here

/** `closed`: start shut, with the cover lit, as if it had just been folded. */
export async function createFold(canvas: HTMLCanvasElement, { closed: startClosed = false } = {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) // throws without WebGL: the poster stays
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  const camera = new THREE.PerspectiveCamera(24, 1, 100, 2000)
  camera.position.set(0, 0, 500)

  await document.fonts.ready
  const k = tokens()
  const innerTex = texture(innerScreen(k))
  const coverTex = texture(coverScreen(k))

  // Satin anodised Armor Aluminum, grey-navy (Samsung renders: lit rail about #474D5F, highlight #6D7385).
  const frame = new THREE.MeshPhysicalMaterial({ color: 0x5a6074, metalness: 0.85, roughness: 0.42, side: THREE.DoubleSide })
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x050608, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 0.45 })
  // Screens: black glass that reflects the room, lit from inside through the emissive map. Not tone mapped, so the
  // job card shows its real paper and ink.
  const screen = (map: THREE.Texture) =>
    new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: 0.05, envMapIntensity: 0.6, emissive: 0xffffff, emissiveMap: map, toneMapped: false, side: THREE.DoubleSide })
  const innerMat = screen(innerTex)
  const coverMat = screen(coverTex)
  coverMat.emissiveIntensity = 0

  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    parent.add(m)
    return m
  }

  // tilt (pointer, gyroscope) > pose (open or closed) > device (recentred) > the halves. The right half stays put; the
  // left half and the hinge spine turn about the hinge axis (x 0, z C), the spine by half as much.
  const tiltG = new THREE.Group()
  const pose = new THREE.Group()
  const device = new THREE.Group()
  const right = new THREE.Group()
  const leftPivot = new THREE.Group()
  const left = new THREE.Group()
  const spinePivot = new THREE.Group()
  scene.add(tiltG)
  tiltG.add(pose)
  pose.add(device)
  device.add(right, leftPivot, spinePivot)
  leftPivot.position.z = C
  spinePivot.position.z = C
  left.position.z = -C
  leftPivot.add(left)

  const screenBox = [-(SW + G), -SH / 2, 2 * (SW + G), SH]
  const rScreen = 1.6
  // Each half's screen runs LAP past the hinge axis and tucks under the other, so the open screen has no gap at the crease.
  const LAP = 0.4
  const SCREEN_Z = 0.15 // clear of the glass under it, or the frame's bevel edge shows through as a line
  const shell = body()
  add(right, shell, [glass, frame])
  add(right, plate(rrect(-LAP, -SH / 2, G + SW, SH / 2, 0.01, rScreen), screenBox), innerMat, 0, 0, SCREEN_Z)
  add(left, shell, [glass, frame]).scale.x = -1
  add(left, plate(rrect(-G - SW, -SH / 2, LAP, SH / 2, rScreen, 0.01), screenBox), innerMat, 0, 0, SCREEN_Z)
  const cx0 = -G - W + (W - COVER.w) / 2
  const cy0 = -H / 2 + COVER.bottom
  add(left, plate(rrect(cx0, cy0, cx0 + COVER.w, cy0 + COVER.h, 2.4, 2.4), [cx0, cy0, COVER.w, COVER.h], true), coverMat, 0, 0, -T - SCREEN_Z)

  // Hinge spine: a half cylinder under the crease while open, the rounded left edge once closed.
  const spineR = T + C
  const cut = 0.3 // trims the arc so its edges stay under the screens while open
  add(spinePivot, new THREE.CylinderGeometry(spineR, spineR, H - 0.8, 48, 1, false, Math.PI / 2 + cut, Math.PI - 2 * cut), frame)
  // Hinge caps fill the frame's notches, slightly recessed, and turn with the spine.
  const cap = new THREE.BoxGeometry(NOTCH.w - 0.3, NOTCH.d - 0.15, T - 1)
  for (const y of [1, -1]) add(spinePivot, cap, frame, 0, y * (H / 2 - NOTCH.d / 2 - 0.1), -C - T / 2 - 0.1)

  // Side keys on the outer edge. The back (navy, cameras) never turns to the camera, so it is not modelled.
  add(right, new THREE.BoxGeometry(0.7, 17, 2.2), frame, G + W + 0.2, 36, -T / 2)
  add(right, new THREE.BoxGeometry(0.7, 11, 2.2), frame, G + W + 0.2, 14, -T / 2)

  // State. Closing: the inner screen fades, the halves fold and snap, the cover wakes. Opening runs it back.
  const FADE = reduced ? 150 : 300
  const FOLD = reduced ? 1 : 1000
  const SNAP_AT = FADE * 0.8 + FOLD
  const CLOSE_END = SNAP_AT + 120 + 700
  const OPEN_END = 150 + FOLD * 0.9 + 450
  let closed = startClosed
  let since = -Infinity
  let click: "open" | "close" | null = null // the sound still to play
  let audio: AudioContext | null = null
  // The real click files, fetched and decoded on first use. No audio or a failed fetch just leaves the fold silent.
  const clicks = new Map<string, Promise<AudioBuffer>>()
  const load = (name: string) => {
    let p = clicks.get(name)
    if (!p) clicks.set(name, (p = fetch(`/sounds/fold-${name}.mp3`).then((r) => r.arrayBuffer()).then((b) => audio!.decodeAudioData(b))))
    p.catch(() => clicks.delete(name))
    return p
  }
  const play = (ctx: AudioContext, name: string) =>
    load(name)
      .then(async (buffer) => {
        // Browsers keep audio off until the visitor has tapped. Starting it while it is off would only queue the click for a later,
        // wrong moment, so a fold that moves with no tap behind it stays silent.
        if (ctx.state !== "running") await Promise.race([ctx.resume(), new Promise((r) => setTimeout(r, 100))])
        if (ctx.state !== "running") return
        const src = ctx.createBufferSource()
        const gain = ctx.createGain()
        gain.gain.value = CLICK_VOLUME
        src.buffer = buffer
        src.connect(gain).connect(ctx.destination)
        src.start()
      })
      .catch(() => {})
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
  let glowOnly = false

  function update(now: number, dt: number) {
    const e = now - since
    if (click && e >= (closed ? SNAP_AT : 150 + FOLD * 0.9)) {
      if (audio) void play(audio, click) // the halves meet
      click = null
    }
    let fold: number, inner: number, cover: number, kick = 0
    if (closed) {
      inner = 1 - clamp01(e / FADE)
      fold = easeIn(clamp01((e - FADE * 0.8) / FOLD))
      cover = clamp01((e - SNAP_AT - 120) / 700)
      // A small settle after the snap.
      if (!reduced && e > SNAP_AT && e < CLOSE_END) kick = Math.sin((e - SNAP_AT) / 30) * Math.exp(-(e - SNAP_AT) / 90) * 0.012
    } else {
      cover = 1 - clamp01(e / 250)
      fold = 1 - easeInOut(clamp01((e - 150) / (FOLD * 0.9)))
      inner = clamp01((e - 150 - FOLD * 0.9 + 100) / 350)
    }
    const breathe = reduced ? 0.9 : 0.82 + 0.18 * Math.sin((now / 4200) * Math.PI * 2)
    innerMat.emissiveIntensity = inner
    coverMat.emissiveIntensity = cover * breathe

    leftPivot.rotation.y = OPEN_V + (Math.PI - OPEN_V) * fold
    spinePivot.rotation.y = leftPivot.rotation.y / 2
    pose.rotation.set(lerp(POSE.open.pitch, POSE.closed.pitch, fold) + kick, lerp(POSE.open.yaw, POSE.closed.yaw, fold), 0)
    device.position.set(lerp(POSE.open.x, POSE.closed.x, fold), 0, lerp(POSE.open.z, POSE.closed.z, fold))

    const ease = 1 - Math.exp(-dt * 7)
    tilt.x += (tilt.tx - tilt.x) * ease
    tilt.y += (tilt.ty - tilt.y) * ease
    tiltG.rotation.set(tilt.y * 0.16, tilt.x * 0.24, 0)

    const settling = Math.abs(tilt.tx - tilt.x) + Math.abs(tilt.ty - tilt.y) > 0.0005
    const busy = e < (closed ? CLOSE_END : OPEN_END) || settling
    glowOnly = !busy && closed && !reduced
    return busy || glowOnly
  }

  // Draws only while something moves and the canvas is on screen.
  let raf = 0
  let last = 0
  let visible = true
  const tick = (now: number) => {
    raf = 0
    // The closed cover's slow glow is all that moves: 20 fps is plenty and spares the phone's battery.
    if (glowOnly && now - last < 50) return void (raf = requestAnimationFrame(tick))
    const dt = Math.min(now - last, 50) / 1000
    last = now
    if (update(now, dt)) wake()
    renderer.render(scene, camera)
  }
  const wake = () => {
    if (raf || !visible) return
    last ||= performance.now()
    raf = requestAnimationFrame(tick)
  }
  const resize = () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    camera.aspect = canvas.clientWidth / canvas.clientHeight || 1
    camera.updateProjectionMatrix()
    wake()
  }
  // Compile first, so the first frame the loop draws does not compile the shaders on the main thread.
  update(performance.now(), 0)
  await renderer.compileAsync(scene, camera)

  const ro = new ResizeObserver(resize)
  const io = new IntersectionObserver((entries) => {
    visible = entries.at(-1)!.isIntersecting
    if (visible) wake()
  })
  ro.observe(canvas)
  io.observe(canvas)
  resize()
  renderer.render(scene, camera)

  return {
    /** Folds or opens. Returns the new state, or null while a fold is still running. */
    toggle(ctx: AudioContext | null) {
      const now = performance.now()
      if (now - since < (closed ? CLOSE_END : OPEN_END)) return null
      closed = !closed
      since = now
      audio = ctx
      click = ctx ? (closed ? "close" : "open") : null
      if (click) load(click).catch(() => {}) // fetch now, play when the halves meet
      wake()
      return closed
    },
    isClosed: () => closed,
    /** -1..1 each way; 0, 0 is at rest. Ignored with reduced motion. */
    tilt(x: number, y: number) {
      if (reduced) return
      tilt.tx = x
      tilt.ty = y
      wake()
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose())
      for (const t of [innerTex, coverTex, scene.environment]) t?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

export type Fold = Awaited<ReturnType<typeof createFold>>
