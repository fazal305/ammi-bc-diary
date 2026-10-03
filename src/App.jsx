import { useEffect, useRef } from 'react'
import { useDiary } from './hooks/useDiary.js'
import { useHashRoute } from './hooks/useHashRoute.js'
import { useOnline } from './hooks/useOnline.js'
import HomeScreen from './screens/HomeScreen.jsx'
import MembersScreen from './screens/MembersScreen.jsx'
import DrawScreen from './screens/DrawScreen.jsx'
import WhatsAppScreen from './screens/WhatsAppScreen.jsx'
import PrivacyScreen from './screens/PrivacyScreen.jsx'
import NotFoundScreen from './screens/NotFoundScreen.jsx'

const SCREENS = {
  home: HomeScreen,
  members: MembersScreen,
  draw: DrawScreen,
  whatsapp: WhatsAppScreen,
  privacy: PrivacyScreen,
}

export default function App() {
  const route = useHashRoute()
  const online = useOnline()
  const { diary, dispatch, saveFailed } = useDiary()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  // Move focus to the new screen's heading so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.querySelector('h1')?.focus()
  }, [route])

  const Screen = SCREENS[route] ?? NotFoundScreen

  return (
    <>
      {!online && (
        <p className="banner banner-offline" role="status">
          انٹرنیٹ بند ہے۔ فکر نہ کریں، آپ کا سارا حساب اسی فون میں محفوظ ہے۔
        </p>
      )}
      {saveFailed && (
        <p className="banner banner-error" role="alert">
          یہ براؤزر ڈیٹا محفوظ نہیں کر پا رہا (شاید پرائیویٹ موڈ ہے)۔ صفحہ بند کرنے سے تبدیلیاں مٹ جائیں گی۔
        </p>
      )}
      <main className="page" ref={mainRef}>
        <Screen diary={diary} dispatch={dispatch} online={online} />
      </main>
    </>
  )
}
