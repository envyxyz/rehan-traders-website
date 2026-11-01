// What the visitor is waiting on, counted: a request, an upload, a chunk or a page. TopLine (components/loading.tsx)
// shows the red line at the top of the screen while the count is above zero. Every busyStart needs its busyStop.
let count = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export const isBusy = () => count > 0
export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => void listeners.delete(listener)
}
export function busyStart() {
  count++
  emit()
}
/** Never below zero: a late stop after busyReset must not eat the next start. */
export function busyStop() {
  count = Math.max(0, count - 1)
  emit()
}
/** A new page has arrived: whatever was in flight no longer matters. */
export function busyReset() {
  count = 0
  emit()
}
