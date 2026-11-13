// The guides' 3D phone, in three.js: a generic slab phone that comes apart into its layers (glass, display panel, frame with
// battery, board and charging port, back), with one part lit in Signal Red. Phone3D loads this module with import() on a tap,
// so three.js is never part of a page load. Units are millimetres. Material colours are numbers here: the phone is a
// physical object, the same in light and dark. Only the highlight reads the --signal token.

import * as THREE from "three"
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js"

import type { PhonePart } from "@/content-large"

const W = 71
const H = 147
const T = 7.6 // frame depth
const R = 9 // corner radius
const WALL = 2.4 // frame wall
const Z = -T / 2 + 1.8 // top of the mid-plate, where the battery and boards sit

type Layer = "back" | "frame" | "panel" | "glass"
// z of each layer when shut. Taken apart, each moves to [x, z]: sideways as well as out, because straight out the display
// panel would cover the battery, board and port. The big gap is panel to frame, so the frame's inside is clear; the glass
// is clear anyway, and the back only needs to show. Symmetric about 0, so the phone turns about the middle of the spread.
const SHUT: Record<Layer, number> = { back: -T / 2 - 1.4, frame: 0, panel: T / 2 + 1.2, glass: T / 2 + 2.4 }
const APART: Record<Layer, [number, number]> = { back: [-57, -30], frame: [-25, -10], panel: [33, 12], glass: [57, 30] }

// Where each inside part sits, as [w, h, r, x, y]: shut, its outline is drawn on the glass so the lit part still shows.
const FOOT: Partial<Record<PhonePart, number[]>> = { battery: [44, 66, 3, 0, -12], board: [64, 34, 3, 0, H / 2 - 24], port: [44, 15, 2, 0, -H / 2 + 13] }

const POSE = { yaw: 0.42, pitch: -0.16 } // at rest: turned so the front of every layer faces the viewer
const SWAY = 0.16 // radians either side of the pose, while idle
const MOVE_MS = 900
const FILL = 0.74 // of the canvas height, taken apart (perspective shaves a little off, so this lands near 70%)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)

function rrect(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

/** A rounded slab of `depth`, centred on z; `bevel` rounds its edges so they catch the light. */
function slab(w: number, h: number, r: number, depth: number, { hole, bevel = 0 }: { hole?: THREE.Shape; bevel?: number } = {}) {
  const shape = rrect(w - 2 * bevel, h - 2 * bevel, r - bevel)
  if (hole) shape.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 12 })
  g.translate(0, 0, -depth / 2)
  return g
}

const disc = (r: number, depth: number) => new THREE.CylinderGeometry(r, r, depth, 40).rotateX(Math.PI / 2)

/** `part`: the part to light up. `open`: start taken apart. */
export async function createPhone(canvas: HTMLCanvasElement, { part, open: startOpen = true }: { part: PhonePart; open?: boolean }) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }) // throws without WebGL
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
  // A key light from the upper left, so the frame's walls and the layers' edges shade instead of reading flat.
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-1, 1.4, 1.2)
  scene.add(key)
  scene.environmentIntensity = 0.8
  const camera = new THREE.PerspectiveCamera(22, 4 / 3, 10, 4000)

  const signal = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim())
  const phys = (color: THREE.ColorRepresentation, o: THREE.MeshPhysicalMaterialParameters = {}) => new THREE.MeshPhysicalMaterial({ color, ...o })
  const alu = phys(0x9a9ea6, { metalness: 0.9, roughness: 0.3 }) // anodised aluminium: metal, satin rather than mirror
  const backMat = phys(0x2a2d33, { roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.35 }) // frosted glass back
  const plate = phys(0x767a82, { metalness: 0.6, roughness: 0.55 })
  const cell = phys(0x24262b, { roughness: 0.45, clearcoat: 0.5 })
  const label = phys(0xb7bbc1, { roughness: 0.75 })
  const pcb = phys(0x1f4237, { roughness: 0.5, clearcoat: 0.4 })
  const can = phys(0xc8cbd0, { metalness: 1, roughness: 0.25 }) // shield cans and the port shell
  const black = phys(0x111215, { roughness: 0.35 })
  const flex = phys(0xc4842f, { roughness: 0.4, clearcoat: 0.6 }) // the amber of a polyimide flex cable
  const copper = phys(0xb86b3c, { metalness: 0.9, roughness: 0.35 })
  const panelEdge = phys(0x60646c, { metalness: 0.6, roughness: 0.4 }) // so the panel's outline holds on a dark page
  const screen = phys(0x050608, { roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 0.5 })
  const active = phys(0x0b0e14, { roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 0.5 }) // the pixel area, a shade off the border
  // The outer glass would vanish on a light page: a tinted edge, a crisp outline and a sheen band make it a sheet.
  const glassFace = phys(0xe6eff3, { roughness: 0.03, transparent: true, opacity: 0.12, clearcoat: 1, depthWrite: false })
  const glassEdge = phys(0x8fbcb8, { roughness: 0.1, transparent: true, opacity: 0.9 })
  const glassLine = new THREE.LineBasicMaterial({ color: 0x7d8c96, transparent: true, opacity: 0.9 })
  const sheen = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false })
  // The lit part: Signal Red, matte and outside tone mapping so it stays the brand red (a sheen would turn it pink), glowing
  // a little so it reads in the dark theme too.
  const lit = new THREE.MeshStandardMaterial({ color: signal, emissive: signal, emissiveIntensity: 0.2, roughness: 0.75, envMapIntensity: 0.3, toneMapped: false })
  const hint = new THREE.MeshBasicMaterial({ color: signal, transparent: true, opacity: 0, depthWrite: false })
  const hintFill = hint.clone()
  if (part === "glass") {
    glassFace.setValues({ color: signal, emissive: signal, emissiveIntensity: 0.3, opacity: 0.42 })
    glassEdge.setValues({ color: signal, emissive: signal, emissiveIntensity: 0.3 })
    glassLine.color.copy(signal)
  }
  const is = (name: PhonePart, normal: THREE.Material) => (name === part ? lit : normal)

  const pose = new THREE.Group()
  scene.add(pose)
  const layers = {} as Record<Layer, THREE.Group>
  for (const n of Object.keys(SHUT) as Layer[]) pose.add((layers[n] = new THREE.Group()))
  const { back, frame, panel, glass } = layers
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.set(x, y, z)
    parent.add(mesh)
    return mesh
  }

  // Back: its inside faces the viewer when apart, so the wireless coil is on that side and the cameras on the other.
  add(back, slab(W, H, R, 1.2, { bevel: 0.4 }), backMat)
  add(back, new THREE.RingGeometry(8, 19, 48), copper, 0, -8, 1.05)
  add(back, slab(25, 25, 7, 1.4, { bevel: 0.4 }), backMat, -W / 2 + 17, H / 2 - 17, -1.3)
  for (const [x, y] of [[-W / 2 + 12, H / 2 - 12], [-W / 2 + 22, H / 2 - 22]]) {
    add(back, disc(4.6, 1.2), can, x, y, -2.2)
    add(back, disc(3.6, 1.4), black, x, y, -2.3)
  }

  // Frame: the anodised band with its keys, the mid-plate, and the parts that sit in it.
  add(frame, slab(W, H, R, T, { hole: rrect(W - 2 * WALL, H - 2 * WALL, R - WALL), bevel: 0.6 }), alu)
  for (const [y, h] of [[30, 18], [6, 10]]) add(frame, new THREE.BoxGeometry(1, h, 2.6), alu, W / 2 + 0.3, y)
  add(frame, slab(W - 2 * WALL + 0.6, H - 2 * WALL + 0.6, R - WALL, 0.8), plate, 0, 0, Z - 0.4)
  add(frame, slab(44, 66, 3, 3.4, { bevel: 0.5 }), is("battery", cell), 0, -12, Z + 1.7)
  add(frame, slab(30, 18, 1.5, 0.1), label, 0, -6, Z + 3.95)
  add(frame, new THREE.BoxGeometry(8, 16, 0.3), is("battery", flex), 10, 29, Z + 1.4) // battery flex up to the board
  const by = H / 2 - 24
  add(frame, slab(64, 34, 3, 1), is("board", pcb), 0, by, Z + 0.5)
  add(frame, slab(13, 13, 1.2, 1.2), black, -6, by + 3, Z + 1.6) // processor
  add(frame, new THREE.BoxGeometry(15, 12, 1.6), can, 17, by + 6, Z + 1.8)
  add(frame, new THREE.BoxGeometry(10, 9, 1.4), can, -23, by - 6, Z + 1.7)
  add(frame, new THREE.BoxGeometry(9, 3.5, 1.2), black, 10, by - 13, Z + 1.6) // battery connector
  add(frame, slab(44, 15, 2, 1), is("port", pcb), 0, -H / 2 + 13, Z + 0.5) // the lower board the port sits on
  const portShell = slab(9, 3.3, 1.65, 7.5, { hole: rrect(7.2, 1.6, 0.8) }).rotateX(Math.PI / 2)
  add(frame, portShell, is("port", can), 0, -H / 2 + WALL + 3.75, Z + 2.65)

  // Display panel: black, its pixel area a shade lighter, and the front camera's hole.
  const panelGeo = slab(W - 3, H - 3, R - 1.5, 1.2)
  add(panel, panelGeo, [is("panel", screen), is("panel", panelEdge)])
  if (part !== "panel") panel.add(new THREE.LineSegments(new THREE.EdgesGeometry(panelGeo, 40), new THREE.LineBasicMaterial({ color: 0x4d5159 })))
  add(panel, new THREE.ShapeGeometry(rrect(W - 7, H - 7, R - 3.5)), is("panel", active), 0, 0, 0.61)
  add(panel, new THREE.CircleGeometry(1.5, 24), black, 0, H / 2 - 9, 0.62)

  const glassGeo = slab(W, H, R, 1) // ExtrudeGeometry's groups: 0 the faces, 1 the edge
  add(glass, glassGeo, [glassFace, glassEdge])
  glass.add(new THREE.LineSegments(new THREE.EdgesGeometry(glassGeo, 40), glassLine))
  for (const [a, b] of [[0, 18], [23, 27]]) {
    const band = new THREE.Shape([new THREE.Vector2(-35, a), new THREE.Vector2(35, a + 38), new THREE.Vector2(35, b + 38), new THREE.Vector2(-35, b)])
    add(glass, new THREE.ShapeGeometry(band), sheen, 0, 0, 0.52)
  }
  const foot = FOOT[part]
  if (foot) {
    const [w, h, r, x, y] = foot
    const ring = rrect(w + 3, h + 3, r + 1.5)
    ring.holes.push(rrect(w, h, r))
    add(glass, new THREE.ShapeGeometry(ring), hint, x, y, 0.56)
    add(glass, new THREE.ShapeGeometry(rrect(w, h, r)), hintFill, x, y, 0.55)
  }

  let open = startOpen
  let since = -Infinity
  // A press mid-move turns back from where the layers are, so fast presses never jump.
  let from = startOpen ? 1 : 0
  let apart = from
  let span = MOVE_MS
  const drag = { yaw: 0, pitch: 0 }
  let held = false
  let sway = reduced ? 0 : 1 // eases to 0 while held, so grabbing and letting go never jump

  function place(apart: number) {
    for (const n of Object.keys(SHUT) as Layer[]) {
      const [x, z] = APART[n]
      layers[n].position.set(x * apart, 0, SHUT[n] + (z - SHUT[n]) * apart)
    }
    hint.opacity = 0.9 * (1 - apart)
    hintFill.opacity = 0.16 * (1 - apart)
  }

  function update(now: number) {
    const moved = reduced ? 1 : easeInOut(clamp01((now - since) / span))
    apart = from + ((open ? 1 : 0) - from) * moved
    place(apart)
    sway += ((reduced || held ? 0 : 1) - sway) * 0.06
    pose.rotation.set(POSE.pitch + drag.pitch, POSE.yaw + drag.yaw + Math.sin(now / 2600) * SWAY * sway, 0)
    lit.emissiveIntensity = reduced ? 0.2 : 0.15 + 0.1 * Math.sin(now / 700)
    return !reduced // idle sway and the glow keep it moving
  }

  // Framed on the taken-apart stack at rest, so it fills the same share of the canvas at any width.
  place(1)
  pose.rotation.set(POSE.pitch, POSE.yaw, 0)
  pose.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(pose, true)
  const size = bounds.getSize(new THREE.Vector3())
  const centre = bounds.getCenter(new THREE.Vector3())

  // Draws only while the canvas is on screen; with reduced motion, only when something changes.
  let raf = 0
  let visible = true
  const tick = (now: number) => {
    raf = 0
    if (update(now) || now - since < span) wake()
    renderer.render(scene, camera)
  }
  const wake = () => {
    if (raf || !visible) return
    raf = requestAnimationFrame(tick)
  }
  const resize = () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    camera.aspect = canvas.clientWidth / canvas.clientHeight || 4 / 3
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const d = Math.max(size.y / FILL, size.x / 0.88 / camera.aspect) / 2 / t + size.z / 2
    camera.position.set(centre.x, centre.y, centre.z + d)
    camera.updateProjectionMatrix()
    wake()
  }
  update(performance.now())
  await renderer.compileAsync(scene, camera)
  const ro = new ResizeObserver(resize)
  const io = new IntersectionObserver((entries) => {
    visible = entries.at(-1)!.isIntersecting
    if (visible) wake()
  })
  ro.observe(canvas)
  io.observe(canvas)
  resize()

  return {
    /** Takes the phone apart or puts it back. Returns the new state. */
    toggle() {
      from = apart
      open = !open
      since = performance.now()
      span = Math.max(1, MOVE_MS * Math.abs((open ? 1 : 0) - from))
      wake()
      return open
    },
    /** A drag across the canvas, in px: turns the phone. */
    turn(dx: number, dy: number) {
      drag.yaw += dx * 0.008
      drag.pitch = Math.min(0.9, Math.max(-0.9, drag.pitch + dy * 0.006))
      wake()
    },
    hold(on: boolean) {
      held = on
      wake()
    },
    dispose() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => (o as THREE.Mesh).geometry?.dispose())
      scene.environment?.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

export type Phone = Awaited<ReturnType<typeof createPhone>>
