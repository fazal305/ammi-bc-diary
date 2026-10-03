import { href } from '../hooks/useHashRoute.js'

export default function NotFoundScreen() {
  return (
    <div className="empty-state not-found">
      <h1 className="app-title" tabIndex={-1}>
        یہ صفحہ نہیں ملا
      </h1>
      <p>شاید لنک غلط ہے۔ کوئی بات نہیں، آپ کا حساب محفوظ ہے۔</p>
      <a className="btn btn-primary" href={href('home')}>
        ڈائری کے پہلے صفحے پر جائیں
      </a>
    </div>
  )
}
