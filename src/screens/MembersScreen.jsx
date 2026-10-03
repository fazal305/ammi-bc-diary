import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import MemberForm from '../components/MemberForm.jsx'
import MemberRow from '../components/MemberRow.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { winnerIds } from '../state/diary.js'
import { cleanName, toUrduDigits } from '../lib/text.js'

export default function MembersScreen({ diary, dispatch }) {
  const [added, setAdded] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const { members } = diary
  const won = winnerIds(diary)
  const paidCount = members.filter((m) => m.paid).length
  const names = members.map((m) => m.name)

  return (
    <>
      <ScreenHeader title="کمیٹی ممبران" icon="👥" />

      {members.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">ابھی لسٹ خالی ہے</p>
          <p>نیچے نام لکھ کر پہلا ممبر شامل کریں۔</p>
        </div>
      ) : (
        <>
          <p className="tally" aria-live="polite">
            {toUrduDigits(members.length)} میں سے <strong>{toUrduDigits(paidCount)}</strong> کی کمیٹی جمع ہو گئی
          </p>
          <ul className="member-list">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                hasWon={won.has(member.id)}
                takenNames={names.filter((n) => n !== member.name)}
                dispatch={dispatch}
              />
            ))}
          </ul>
        </>
      )}

      <section className="card" aria-labelledby="add-title">
        <h2 id="add-title" className="card-title">
          نیا ممبر شامل کریں
        </h2>
        <MemberForm
          takenNames={names}
          submitLabel="+ شامل کریں"
          onSubmit={(fields) => {
            dispatch({ type: 'addMember', ...fields })
            setAdded(cleanName(fields.name))
          }}
        />
        <p className="form-success" role="status">
          {added && `✓ «${added}» کا نام لسٹ میں شامل ہو گیا`}
        </p>
      </section>

      {paidCount > 0 && (
        <section className="card card-quiet" aria-labelledby="month-title">
          <h2 id="month-title" className="card-title">
            نیا مہینہ
          </h2>
          <p>نئے مہینے کی کمیٹی جمع کرنی ہو تو سب کو دوبارہ «باقی ہے» پر کر دیں۔</p>
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(true)}>
            نیا مہینہ شروع کریں
          </button>
        </section>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="نیا مہینہ شروع کریں؟"
        message="سب ممبران «باقی ہے» پر ہو جائیں گے۔ پرچیوں کا ریکارڈ ویسے ہی رہے گا۔"
        confirmLabel="ہاں، نیا مہینہ"
        onConfirm={() => {
          dispatch({ type: 'resetPayments' })
          setConfirmReset(false)
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  )
}
