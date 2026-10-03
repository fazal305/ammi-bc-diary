import { useId, useRef, useState } from 'react'
import { cleanName, NAME_MAX } from '../lib/text.js'
import { isValidPhone, normalizePhone } from '../lib/phone.js'

function validate(name, phone, takenNames) {
  const errors = {}
  const clean = cleanName(name)
  if (!clean) errors.name = 'نام لکھنا ضروری ہے۔'
  else if (takenNames.includes(clean)) errors.name = 'یہ نام پہلے سے لسٹ میں ہے۔ فرق کے لیے ساتھ کچھ لکھ دیں، جیسے «زاہدہ (پڑوسن)»۔'
  if (!isValidPhone(normalizePhone(phone))) errors.phone = 'فون نمبر پورا لکھیں، جیسے 03001234567'
  return errors
}

export default function MemberForm({ initial, takenNames, submitLabel, onSubmit, onCancel, children }) {
  const id = useId()
  const [name, setName] = useState(initial?.name ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)
  const phoneRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(name, phone, takenNames)
    setErrors(found)
    if (found.name) return nameRef.current.focus()
    if (found.phone) return phoneRef.current.focus()
    onSubmit({ name, phone })
    if (!initial) {
      setName('')
      setPhone('')
      nameRef.current.focus()
    }
  }

  return (
    <form className="member-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-name`}>نام</label>
        <input
          ref={nameRef}
          id={`${id}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={NAME_MAX}
          autoComplete="off"
          enterKeyHint="next"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          required
        />
        {errors.name && (
          <p className="field-error" id={`${id}-name-error`}>
            {errors.name}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${id}-phone`}>
          فون نمبر <span className="optional">(ضروری نہیں)</span>
        </label>
        <input
          ref={phoneRef}
          id={`${id}-phone`}
          type="tel"
          inputMode="tel"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={20}
          autoComplete="off"
          enterKeyHint="done"
          placeholder="03001234567"
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
        />
        {errors.phone && (
          <p className="field-error" id={`${id}-phone-error`}>
            {errors.phone}
          </p>
        )}
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            چھوڑ دیں
          </button>
        )}
      </div>
      {children}
    </form>
  )
}
