const URDU_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

// Urdu keyboards type Eastern Arabic digits; storage and links need ASCII.
export function toAsciiDigits(value) {
  return String(value).replace(/[۰-۹٠-٩]/g, (ch) => {
    const i = URDU_DIGITS.indexOf(ch)
    return String(i >= 0 ? i : ARABIC_DIGITS.indexOf(ch))
  })
}

export function toUrduDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => URDU_DIGITS[d])
}

export function cleanName(value) {
  return String(value).replace(/\s+/g, ' ').trim()
}

export const NAME_MAX = 40
