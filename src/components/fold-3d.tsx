import { Mark } from "@/components/logo"
import { hero } from "@/content"

// The screen is drawn once per half; each half shows its own side of it (see .fold-screen in globals.css).
function Screen({ mark }: { mark?: boolean }) {
  const { jobCard, fold } = hero
  return (
    <div className="fold-screen">
      <div className="fold-status">
        <span>{fold.time}</span>
        <span>{fold.network}</span>
      </div>
      <div className="fold-card">
        <div className="fold-card-head">
          {jobCard.heading} <b>{jobCard.number}</b>
        </div>
        {jobCard.rows.map((row) => (
          <div key={row.label} className="fold-row">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
        <div className="fold-ok">
          <i />
          {jobCard.status}
        </div>
      </div>
      {mark && <Mark tone="device" className="fold-mark text-device-paper" />}
    </div>
  )
}

/** CSS-only 3D Galaxy Z Fold: closed, opens into a V at 0.6 s, then hovers. Decorative. */
export function Fold3D() {
  return (
    <div className="fold-stage" aria-hidden>
      <div className="fold">
        <div className="fold-hinge" />
        <div className="fold-half fold-l">
          <div className="fold-face fold-in">
            <Screen mark />
          </div>
          <div className="fold-face fold-out">
            <div className="fold-cover">
              <div className="fold-time">{hero.fold.time}</div>
              <div className="fold-date">{hero.fold.date}</div>
              <Mark tone="device" className="text-device-paper" />
            </div>
          </div>
        </div>
        <div className="fold-half fold-r">
          <div className="fold-face fold-in">
            <Screen />
          </div>
          <div className="fold-face fold-out">
            <div className="fold-back">
              <div className="fold-cam">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
