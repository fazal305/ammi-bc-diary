import { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { href } from '../hooks/useHashRoute.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { currentRoundDraws, eligibleMembers } from '../state/diary.js'
import { pickRandom } from '../lib/draw.js'
import { urduDate } from '../lib/date.js'
import { toUrduDigits } from '../lib/text.js'
import { shareUrl, winnerMessage } from '../lib/whatsapp.js'

const ROLL_MS = 2800

function Roller({ names, winner, onDone }) {
  const [shown, setShown] = useState(names[0])
  // A fresh onDone each parent render must not restart the roll.
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })

  useEffect(() => {
    let i = 0
    let delay = 70
    let timer
    const start = performance.now()
    function tick() {
      if (performance.now() - start >= ROLL_MS) {
        setShown(winner)
        timer = setTimeout(() => doneRef.current(), 350)
        return
      }
      i = (i + 1) % names.length
      setShown(names[i])
      delay *= 1.12 // slow down like a spinning wheel
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, delay)
    return () => clearTimeout(timer)
  }, [names, winner])

  return (
    <div className="draw-stage is-rolling" aria-hidden="true">
      <p className="draw-caption">پرچی نکل رہی ہے…</p>
      <p className="draw-name">{shown}</p>
    </div>
  )
}

export default function DrawScreen({ diary, dispatch, online }) {
  const reduceMotion = useReducedMotion()
  const [rolling, setRolling] = useState(null)
  const [revealed, setRevealed] = useState(null)
  const [confirmRound, setConfirmRound] = useState(false)
  const eligible = eligibleMembers(diary)
  const allRoundDraws = currentRoundDraws(diary)
  // The draw is saved before the roll starts; keep it out of the history until the reveal.
  const roundDraws = rolling ? allRoundDraws.slice(0, -1) : allRoundDraws
  const pastDraws = diary.draws.filter((d) => d.round !== diary.round)

  function draw() {
    const winner = pickRandom(eligible)
    if (!winner) return
    // Recorded before the animation, so leaving mid-roll cannot undo a draw.
    dispatch({ type: 'recordDraw', memberId: winner.id })
    setRevealed(null)
    if (reduceMotion || eligible.length === 1) {
      setRevealed(winner.name)
    } else {
      setRolling({ names: eligible.map((m) => m.name), winner: winner.name })
    }
  }

  function finishRoll() {
    setRevealed(rolling.winner)
    setRolling(null)
  }

  let stage
  if (rolling) {
    stage = <Roller names={rolling.names} winner={rolling.winner} onDone={finishRoll} />
  } else if (revealed) {
    stage = (
      <div className="draw-stage is-revealed">
        <p className="draw-caption">اس مہینے کی کمیٹی نکلی ہے</p>
        <p className="draw-name">{revealed}</p>
        <p className="draw-congrats">مبارک ہو! 🎉</p>
        <div className="stack">
          {online ? (
            <a className="btn btn-wa" href={shareUrl(winnerMessage(revealed))} target="_blank" rel="noopener noreferrer">
              💬 واٹس ایپ پر بتائیں
            </a>
          ) : (
            <p className="note">واٹس ایپ پر بتانے کے لیے انٹرنیٹ آن کریں۔</p>
          )}
          <button type="button" className="btn btn-ghost" onClick={() => setRevealed(null)}>
            ٹھیک ہے
          </button>
        </div>
      </div>
    )
  } else if (diary.members.length === 0) {
    stage = (
      <div className="empty-state">
        <p className="empty-title">ابھی کوئی ممبر نہیں</p>
        <p>پرچی نکالنے سے پہلے ممبران کے نام شامل کریں۔</p>
        <a className="btn btn-primary" href={href('members')}>
          👥 ممبران شامل کریں
        </a>
      </div>
    )
  } else if (eligible.length === 0) {
    stage = (
      <div className="empty-state">
        <p className="empty-title">اس دور میں سب کی کمیٹی نکل چکی ہے 🎉</p>
        <p>اگلی کمیٹی کے لیے نیا دور شروع کریں، سب نام دوبارہ پرچی میں آ جائیں گے۔</p>
        <button type="button" className="btn btn-primary" onClick={() => setConfirmRound(true)}>
          نیا دور شروع کریں
        </button>
      </div>
    )
  } else {
    stage = (
      <div className="draw-ready">
        <p className="draw-pool-title">
          پرچی میں یہ {toUrduDigits(eligible.length)} نام شامل ہیں:
        </p>
        <ul className="chips">
          {eligible.map((m) => (
            <li key={m.id} className="chip">
              {m.name}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn-draw" onClick={draw}>
          🎲 پرچی نکالیں
        </button>
        <p className="note">جس کا نام ایک بار نکل آئے، وہ اس دور میں دوبارہ پرچی میں نہیں آتا۔</p>
      </div>
    )
  }

  return (
    <>
      <ScreenHeader title="پرچی نکالیں" icon="🎲" />
      <section className="card draw-card" aria-label="قرعہ اندازی">
        {stage}
      </section>
      <p className="visually-hidden" aria-live="assertive">
        {revealed && `اس مہینے کی کمیٹی ${revealed} کی نکلی ہے`}
      </p>

      <section className="card card-quiet" aria-labelledby="history-title">
        <h2 id="history-title" className="card-title">
          دور {toUrduDigits(diary.round)} کی پرچیاں
        </h2>
        {roundDraws.length === 0 ? (
          <p>اس دور میں ابھی کوئی پرچی نہیں نکلی۔</p>
        ) : (
          <ol className="history">
            {roundDraws.map((d, i) => (
              <li key={d.id}>
                <span className="history-num">{toUrduDigits(i + 1)}</span>
                <span className="history-name">{d.name}</span>
                <span className="history-date">{urduDate(d.at)}</span>
              </li>
            ))}
          </ol>
        )}
        {pastDraws.length > 0 && (
          <details className="past">
            <summary>پچھلے دور دیکھیں</summary>
            <ol className="history">
              {pastDraws.map((d) => (
                <li key={d.id}>
                  <span className="history-num">دور {toUrduDigits(d.round)}</span>
                  <span className="history-name">{d.name}</span>
                  <span className="history-date">{urduDate(d.at)}</span>
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>

      <ConfirmDialog
        open={confirmRound}
        title="نیا دور شروع کریں؟"
        message="سب ممبران کے نام دوبارہ پرچی میں آ جائیں گے۔ پچھلی پرچیوں کا ریکارڈ محفوظ رہے گا۔"
        confirmLabel="ہاں، نیا دور"
        onConfirm={() => {
          dispatch({ type: 'newRound' })
          setConfirmRound(false)
        }}
        onCancel={() => setConfirmRound(false)}
      />
    </>
  )
}
