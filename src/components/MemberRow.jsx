import { useState } from 'react'
import MemberForm from './MemberForm.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function MemberRow({ member, hasWon, takenNames, dispatch }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const status = member.paid ? 'کمیٹی جمع ہو گئی' : 'باقی ہے'

  if (editing) {
    return (
      <li className="member member-editing">
        <MemberForm
          initial={member}
          takenNames={takenNames}
          submitLabel="محفوظ کریں"
          onSubmit={(fields) => {
            dispatch({ type: 'updateMember', id: member.id, ...fields })
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        >
          <button type="button" className="btn btn-danger-outline" onClick={() => setConfirmDelete(true)}>
            یہ ممبر لسٹ سے نکالیں
          </button>
        </MemberForm>
        <ConfirmDialog
          open={confirmDelete}
          title={`«${member.name}» کو نکال دیں؟`}
          message="ان کا نام ممبران کی لسٹ سے ہٹ جائے گا۔ اگر ان کی پرچی نکل چکی ہے تو وہ تاریخ میں رہے گی۔"
          confirmLabel="ہاں، نکال دیں"
          danger
          onConfirm={() => dispatch({ type: 'removeMember', id: member.id })}
          onCancel={() => setConfirmDelete(false)}
        />
      </li>
    )
  }

  return (
    <li className="member">
      <div className="member-info">
        <span className="member-name">{member.name}</span>
        {hasWon && <span className="badge">🎉 کمیٹی نکل چکی</span>}
        {member.phone && (
          <span className="member-phone" dir="ltr">
            {member.phone}
          </span>
        )}
      </div>
      <button
        type="button"
        className={`pay-toggle ${member.paid ? 'is-paid' : 'is-unpaid'}`}
        aria-label={`${member.name}: ${status}۔ بدلنے کے لیے دبائیں`}
        onClick={() => dispatch({ type: 'togglePaid', id: member.id })}
      >
        <span className="pay-mark" aria-hidden="true">
          {member.paid ? '✓' : '✗'}
        </span>
        {status}
      </button>
      <button type="button" className="btn-link" onClick={() => setEditing(true)} aria-label={`${member.name} کا نام یا نمبر تبدیل کریں`}>
        تبدیل کریں
      </button>
    </li>
  )
}
