import { href } from '../hooks/useHashRoute.js'
import { eligibleMembers } from '../state/diary.js'
import { toUrduDigits } from '../lib/text.js'

export default function HomeScreen({ diary }) {
  const total = diary.members.length
  const paid = diary.members.filter((m) => m.paid).length
  const left = eligibleMembers(diary).length

  return (
    <>
      <header className="home-header">
        <h1 className="app-title" tabIndex={-1}>
          امی کی بی سی ڈائری
        </h1>
        {total > 0 ? (
          <p className="home-summary">
            {toUrduDigits(total)} ممبران · {toUrduDigits(paid)} کی کمیٹی جمع · دور {toUrduDigits(diary.round)}
          </p>
        ) : (
          <p className="home-summary">شروع کرنے کے لیے پہلے ممبران شامل کریں۔</p>
        )}
      </header>

      <nav className="tiles" aria-label="مین مینو">
        <a className="tile tile-members" href={href('members')}>
          <span className="tile-icon" aria-hidden="true">👥</span>
          <span className="tile-text">
            <span className="tile-label">کمیٹی ممبران</span>
            <span className="tile-hint">نام شامل کریں، پیسوں کا حساب</span>
          </span>
        </a>
        <a className="tile tile-draw" href={href('draw')}>
          <span className="tile-icon" aria-hidden="true">🎲</span>
          <span className="tile-text">
            <span className="tile-label">پرچی نکالیں</span>
            <span className="tile-hint">
              {total === 0 ? 'سب کے سامنے قرعہ اندازی' : `${toUrduDigits(left)} نام پرچی میں باقی`}
            </span>
          </span>
        </a>
        <a className="tile tile-wa" href={href('whatsapp')}>
          <span className="tile-icon" aria-hidden="true">💬</span>
          <span className="tile-text">
            <span className="tile-label">واٹس ایپ گروپ</span>
            <span className="tile-hint">گروپ میں پیغام بھیجیں</span>
          </span>
        </a>
      </nav>

      <footer className="home-footer">
        <a href={href('privacy')}>آپ کا ڈیٹا کہاں ہے؟ (پرائیویسی)</a>
      </footer>
    </>
  )
}
