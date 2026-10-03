import { toAsciiDigits } from './text.js'

// Keeps a leading + and digits only. Returns '' for empty input.
export function normalizePhone(value) {
  const ascii = toAsciiDigits(value).trim()
  const plus = ascii.startsWith('+') ? '+' : ''
  return plus + ascii.replace(/\D/g, '')
}

export function isValidPhone(normalized) {
  if (normalized === '') return true
  const digits = normalized.replace('+', '')
  return digits.length >= 10 && digits.length <= 15
}

// International form without "+", as wa.me expects. Local Pakistani numbers
// (03xx...) are assumed, since that is the audience.
export function toInternational(normalized) {
  let digits = normalized.replace('+', '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  else if (/^03\d{9}$/.test(digits)) digits = '92' + digits.slice(1)
  return digits
}
