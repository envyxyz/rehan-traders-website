"use client"

import * as React from "react"

import { Icon } from "@/components/icon"
import { Plus, X } from "@/components/icons"
import { booking } from "@/content-large"
import { busyStart, busyStop } from "@/lib/busy"
import { uploadPhoto } from "@/lib/upload"

export const MAX_PHOTOS = 3

/** A picked photo: its preview, upload progress (0 to 1), and the Drive file id once uploaded. */
export type Photo = { key: string; preview: string; progress: number; id?: string }

/**
 * Up to 3 photos. A dashed square with a plus adds one; each photo uploads at once and shows greyed under a
 * progress ring until it is in, then gets a remove button. A failed upload drops the photo and reports `onError`.
 */
export function PhotoPicker({
  photos,
  onChange,
  onError,
}: {
  photos: Photo[]
  onChange: React.Dispatch<React.SetStateAction<Photo[]>>
  onError: (message: string | null) => void
}) {
  const input = React.useRef<HTMLInputElement>(null)
  const c = booking.fault
  // Photos picked or uploading, counted when a file is taken: two quick drops share one limit, where `photos`
  // would still be last render's list.
  const taken = React.useRef(photos.length)
  const patch = (key: string, p: Partial<Photo>) => onChange((all) => all.map((x) => (x.key === key ? { ...x, ...p } : x)))
  const drop = (key: string) => {
    taken.current--
    onChange((all) => {
      const gone = all.find((x) => x.key === key)
      if (gone) URL.revokeObjectURL(gone.preview)
      return all.filter((x) => x !== gone)
    })
  }

  function add(files: FileList | null) {
    onError(null)
    for (const file of [...(files ?? [])].slice(0, MAX_PHOTOS - taken.current)) {
      const key = crypto.randomUUID()
      taken.current++
      onChange((all) => [...all, { key, preview: URL.createObjectURL(file), progress: 0 }])
      busyStart()
      uploadPhoto(file, (progress) => patch(key, { progress }))
        .then((id) => patch(key, { id, progress: 1 }))
        .catch(() => {
          drop(key)
          onError(c.uploadError)
        })
        .finally(busyStop)
    }
    if (input.current) input.current.value = ""
  }

  return (
    <ul className="flex flex-wrap gap-2.5">
      {photos.map((p) => (
        <li key={p.key} className="relative size-20 overflow-hidden rounded-md bg-concrete">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
          <img src={p.preview} alt={c.photoAlt} className={p.id ? "size-full object-cover" : "size-full object-cover opacity-40 grayscale"} />
          {p.id ? (
            <button
              type="button"
              aria-label={c.removePhoto}
              onClick={() => drop(p.key)}
              className="absolute top-0 right-0 grid size-11 cursor-pointer place-items-center"
            >
              <span className="grid size-7 place-items-center rounded-pill bg-action text-on-action">
                <Icon icon={X} size="sm" />
              </span>
            </button>
          ) : (
            <Ring progress={p.progress} label={c.uploading} />
          )}
        </li>
      ))}
      {photos.length < MAX_PHOTOS && (
        <li>
          <button
            type="button"
            aria-label={c.addPhoto}
            onClick={() => input.current?.click()}
            className="grid size-20 cursor-pointer place-items-center rounded-md border-2 border-dashed border-hairline text-steel transition-colors duration-(--duration-fast) hover:border-ink hover:text-ink"
          >
            <Icon icon={Plus} size="lg" />
          </button>
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
        </li>
      )}
    </ul>
  )
}

/** Circular progress over a photo while it uploads. */
function Ring({ progress, label }: { progress: number; label: string }) {
  const r = 14
  const length = 2 * Math.PI * r
  return (
    <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} className="absolute inset-0 grid place-items-center">
      <svg aria-hidden viewBox="0 0 36 36" className="size-9 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="3" className="stroke-hairline" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - progress)}
          className="stroke-ink"
        />
      </svg>
    </span>
  )
}
