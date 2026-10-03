import { useId, useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { href } from '../hooks/useHashRoute.js'
import { currentRoundDraws } from '../state/diary.js'
import { isValidGroupLink, reminderMessage, shareUrl, winnerMessage } from '../lib/whatsapp.js'

function ShareBlock({ titleId, title, message, buttonLabel, online }) {
  return (
    <section className="card" aria-labelledby={titleId}>
      <h2 id={titleId} className="card-title">
        {title}
      </h2>
      <p className="bubble-label">یہ پیغام جائے گا:</p>
      <p className="bubble">{message}</p>
      {online ? (
        <a className="btn btn-wa" href={shareUrl(message)} target="_blank" rel="noopener noreferrer">
          💬 {buttonLabel}
        </a>
      ) : (
        <p className="note">پیغام بھیجنے کے لیے انٹرنیٹ آن کریں۔</p>
      )}
    </section>
  )
}

function GroupLink({ link, dispatch, online }) {
  const id = useId()
  const [editing, setEditing] = useState(!link)
  const [value, setValue] = useState(link)
  const [error, setError] = useState('')

  if (!editing) {
    return (
      <>
        {online ? (
          <a className="btn btn-wa" href={link} target="_blank" rel="noopener noreferrer">
            👥 واٹس ایپ گروپ کھولیں
          </a>
        ) : (
          <p className="note">گروپ کھولنے کے لیے انٹرنیٹ آن کریں۔</p>
        )}
        <button type="button" className="btn-link" onClick={() => setEditing(true)}>
          گروپ کا لنک بدلیں
        </button>
      </>
    )
  }

  function save(event) {
    event.preventDefault()
    const trimmed = value.trim()
    if (trimmed && !isValidGroupLink(trimmed)) {
      setError('یہ واٹس ایپ گروپ کا لنک نہیں لگتا۔ لنک https://chat.whatsapp.com/ سے شروع ہوتا ہے۔')
      return
    }
    setError('')
    dispatch({ type: 'setGroupLink', link: trimmed })
    setEditing(!trimmed)
  }

  return (
    <form onSubmit={save} noValidate>
      <div className="field">
        <label htmlFor={`${id}-link`}>گروپ کا لنک</label>
        <input
          id={`${id}-link`}
          type="url"
          inputMode="url"
          dir="ltr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://chat.whatsapp.com/…"
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`}
        />
        <p className="field-help" id={`${id}-help`}>
          واٹس ایپ میں گروپ کھولیں ← گروپ کے نام پر دبائیں ← «Invite via link» ← «Copy link»، پھر یہاں لگا دیں۔
        </p>
        {error && (
          <p className="field-error" id={`${id}-error`}>
            {error}
          </p>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          لنک محفوظ کریں
        </button>
        {link && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setValue(link)
              setError('')
              setEditing(false)
            }}
          >
            چھوڑ دیں
          </button>
        )}
      </div>
    </form>
  )
}

export default function WhatsAppScreen({ diary, dispatch, online }) {
  const latest = currentRoundDraws(diary).at(-1)
  const unpaid = diary.members.filter((m) => !m.paid).map((m) => m.name)

  return (
    <>
      <ScreenHeader title="واٹس ایپ گروپ" icon="💬" />
      <p className="lead">بٹن دبانے پر واٹس ایپ کھلے گا۔ وہاں اپنا کمیٹی گروپ چنیں اور «بھیجیں» دبا دیں۔</p>

      {latest ? (
        <ShareBlock
          titleId="wa-winner"
          title="پرچی کا نتیجہ"
          message={winnerMessage(latest.name)}
          buttonLabel="نتیجہ گروپ میں بھیجیں"
          online={online}
        />
      ) : (
        <section className="card card-quiet">
          <h2 className="card-title">پرچی کا نتیجہ</h2>
          <p>اس دور میں ابھی کوئی پرچی نہیں نکلی۔</p>
          <a className="btn btn-secondary" href={href('draw')}>
            🎲 پرچی نکالیں
          </a>
        </section>
      )}

      {diary.members.length > 0 && (
        <ShareBlock
          titleId="wa-reminder"
          title="پیسوں کی یاد دہانی"
          message={reminderMessage(unpaid)}
          buttonLabel="یاد دہانی بھیجیں"
          online={online}
        />
      )}

      <section className="card" aria-labelledby="wa-group">
        <h2 id="wa-group" className="card-title">
          کمیٹی کا واٹس ایپ گروپ
        </h2>
        <GroupLink link={diary.groupLink} dispatch={dispatch} online={online} />
      </section>
    </>
  )
}
