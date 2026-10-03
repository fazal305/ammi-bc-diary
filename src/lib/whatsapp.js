import { toInternational } from './phone.js'

export const GROUP_LINK_PATTERN = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{10,40}\/?$/

export function isValidGroupLink(value) {
  return GROUP_LINK_PATTERN.test(value.trim())
}

// wa.me cannot target a group, so this opens WhatsApp's chat picker with the
// text filled in; Ammi picks the group there.
export function shareUrl(text, phone = '') {
  const to = phone ? toInternational(phone) : ''
  return `https://wa.me/${to}?text=${encodeURIComponent(text)}`
}

export function winnerMessage(name) {
  return `اس مہینے کی کمیٹی ${name} کی نکلی ہے! مبارک ہو 🎉`
}

export function reminderMessage(unpaidNames) {
  if (unpaidNames.length === 0) return 'سب کی کمیٹی جمع ہو گئی ہے، شکریہ!'
  return `یاد دہانی: ان کی کمیٹی ابھی باقی ہے:\n${unpaidNames.map((n) => `• ${n}`).join('\n')}\nمہربانی کر کے جلدی جمع کروا دیں۔`
}
