import { toUrduDigits } from './text.js'

const formatter = new Intl.DateTimeFormat('ur-PK', { day: 'numeric', month: 'long', year: 'numeric' })

export function urduDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return toUrduDigits(formatter.format(date))
}
