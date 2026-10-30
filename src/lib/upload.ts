const MAX_SIDE = 1600 // px: plenty to see a crack, small enough (~300 KB) for the Worker and the shop's inbox
const QUALITY = 0.8

/** Any photo the browser can open (iPhone HEIC included) as a JPEG, longest side MAX_SIDE, as base64. */
async function toJpeg(file: File) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", QUALITY))
  const url = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
  return url.slice(url.indexOf(",") + 1)
}

/**
 * Sends one photo to /api/upload (Worker → Apps Script → the shop's Drive folder) and resolves with its Drive
 * file id. XMLHttpRequest, not fetch: only XHR reports upload progress. `onProgress` gets 0 to 1.
 */
export async function uploadPhoto(file: File, onProgress: (p: number) => void): Promise<string> {
  const data = await toJpeg(file)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/upload")
    xhr.setRequestHeader("content-type", "application/json")
    xhr.responseType = "json"
    // The last 10% is the Apps Script saving it to Drive, which reports nothing until it is done.
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress((e.loaded / e.total) * 0.9)
    xhr.onload = () => {
      const out = xhr.response as { ok?: boolean; id?: string } | null
      if (xhr.status === 200 && out?.ok && out.id) resolve(out.id)
      else reject(new Error(`upload ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error("upload network"))
    xhr.send(JSON.stringify({ data }))
  })
}
