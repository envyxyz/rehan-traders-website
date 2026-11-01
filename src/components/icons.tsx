import { createLucideIcon, type IconNode, type LucideIcon } from "lucide-react"

// Every icon on the site comes from here: Lucide, drawn at one stroke by `Icon` (icon.tsx). Components import these names,
// never lucide-react itself, so the set stays one family.
export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BatteryCharging,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRight,
  CircleHelp,
  Clock,
  Cpu,
  Download,
  Droplet,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Tablet,
  Wrench,
  X,
} from "lucide-react"
import { BatteryCharging, Cpu, Droplet, Tablet } from "lucide-react"

export type IconGlyph = LucideIcon

// Drawn for this site in Lucide's grid and stroke (Smartphone's body): Lucide has no foldable, cracked screen or phone back.
const body: IconNode[number] = ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "body" }]
export const CrackedPhone = createLucideIcon("cracked-phone", [body, ["path", { d: "m13.5 5-3 4.5 3.5 2-3 5.5", key: "crack" }], ["path", { d: "M12 18h.01", key: "button" }]])
export const Foldable = createLucideIcon("foldable", [
  ["path", { d: "M11 3.5 4.6 5A2 2 0 0 0 3 7v10a2 2 0 0 0 1.6 2l6.4 1.5Z", key: "left" }],
  ["rect", { width: "8", height: "17", x: "13", y: "3.5", rx: "2", key: "right" }],
])
export const PhoneBack = createLucideIcon("phone-back", [
  body,
  ["rect", { width: "5", height: "6", x: "8", y: "5", rx: "1.5", key: "camera" }],
  ["path", { d: "M10.5 7h.01", key: "lens1" }],
  ["path", { d: "M10.5 9h.01", key: "lens2" }],
])
export const ScreenLines = createLucideIcon("screen-lines", [body, ["path", { d: "M9 6v12", key: "l1" }], ["path", { d: "M12 6v7", key: "l2" }], ["path", { d: "M15 10v8", key: "l3" }]])

/** The icon for each repair, by service slug. */
export const repairIcons: Record<string, IconGlyph> = {
  "touch-glass-replacement": CrackedPhone,
  "galaxy-z-fold-flip": Foldable,
  iphone: PhoneBack,
  "screen-replacement": ScreenLines,
  "battery-charging": BatteryCharging,
  "water-damage-data-recovery": Droplet,
  "board-repair": Cpu,
  "ipad-tablet": Tablet,
}
