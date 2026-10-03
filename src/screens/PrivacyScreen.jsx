import ScreenHeader from '../components/ScreenHeader.jsx'

export default function PrivacyScreen() {
  return (
    <>
      <ScreenHeader title="آپ کا ڈیٹا" icon="🔒" />
      <section className="card prose">
        <h2 className="card-title">سارا حساب صرف آپ کے فون میں</h2>
        <ul>
          <li>ممبران کے نام، فون نمبر، پیسوں کا حساب اور پرچیاں صرف اسی فون کے براؤزر میں محفوظ ہوتی ہیں۔</li>
          <li>یہ ایپ کوئی اکاؤنٹ نہیں بناتی اور کوئی ڈیٹا کسی سرور پر نہیں بھیجتی۔</li>
          <li>کوئی کوکیز، اشتہار یا ٹریکنگ استعمال نہیں ہوتی۔</li>
          <li>واٹس ایپ کا پیغام صرف تب جاتا ہے جب آپ خود بٹن دبا کر واٹس ایپ میں «بھیجیں» دبائیں۔</li>
          <li>اگر آپ براؤزر کی ہسٹری یا ڈیٹا صاف کریں گی تو ڈائری بھی مٹ جائے گی، اور دوسرے فون پر یہ ڈیٹا نظر نہیں آئے گا۔</li>
        </ul>
      </section>
      <section className="card card-quiet prose" lang="en" dir="ltr">
        <h2 className="card-title">Privacy, in English</h2>
        <p>
          Everything you enter (names, phone numbers, payment status and draws) is stored only in this browser&apos;s
          localStorage on this device. There are no accounts, servers, cookies, analytics or ads. A WhatsApp message is
          only sent when you tap a share button and then press send inside WhatsApp. Clearing your browser data deletes
          the diary.
        </p>
        <p>
          Source code and contact:{' '}
          <a href="https://github.com/fazal305/ammi-bc-diary" target="_blank" rel="noopener noreferrer">
            github.com/fazal305/ammi-bc-diary
          </a>
        </p>
      </section>
    </>
  )
}
