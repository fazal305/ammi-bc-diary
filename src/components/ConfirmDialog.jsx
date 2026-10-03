import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ open, title, message, confirmLabel, danger = false, onConfirm, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Focus the safe choice so a stray Enter cannot confirm.
      dialog.querySelector('.btn-ghost')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="confirm-title"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <h2 id="confirm-title" className="dialog-title">
        {title}
      </h2>
      <p className="dialog-message">{message}</p>
      <div className="dialog-actions">
        <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          نہیں، واپس جائیں
        </button>
      </div>
    </dialog>
  )
}
