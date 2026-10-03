import { describe, expect, it } from 'vitest'
import { pickRandom } from './draw.js'
import { isValidPhone, normalizePhone, toInternational } from './phone.js'
import { toAsciiDigits, toUrduDigits } from './text.js'
import { isValidGroupLink, reminderMessage, shareUrl, winnerMessage } from './whatsapp.js'

describe('digits', () => {
  it('converts Urdu and Arabic-Indic digits', () => {
    expect(toAsciiDigits('۰۳۰۰ ٤٥')).toBe('0300 45')
    expect(toUrduDigits('12')).toBe('۱۲')
  })
})

describe('phone', () => {
  it('normalizes and validates', () => {
    expect(normalizePhone(' +92 300-1234567 ')).toBe('+923001234567')
    expect(isValidPhone('')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('03001234567')).toBe(true)
  })

  it('converts to international form', () => {
    expect(toInternational('03001234567')).toBe('923001234567')
    expect(toInternational('+923001234567')).toBe('923001234567')
    expect(toInternational('00447700900123')).toBe('447700900123')
  })
})

describe('draw', () => {
  it('picks within range and handles empty lists', () => {
    expect(pickRandom([])).toBeNull()
    expect(pickRandom(['a', 'b', 'c'], () => 0.999)).toBe('c')
    expect(pickRandom(['a', 'b', 'c'], () => 0)).toBe('a')
    expect(['a', 'b']).toContain(pickRandom(['a', 'b']))
  })
})

describe('whatsapp', () => {
  it('builds share urls', () => {
    expect(shareUrl('سلام')).toBe('https://wa.me/?text=%D8%B3%D9%84%D8%A7%D9%85')
    expect(shareUrl('x', '03001234567')).toBe('https://wa.me/923001234567?text=x')
  })

  it('builds messages', () => {
    expect(winnerMessage('زاہدہ آنٹی')).toContain('زاہدہ آنٹی کی نکلی ہے')
    expect(reminderMessage(['a', 'b'])).toContain('• a\n• b')
  })

  it('accepts only real group invite links', () => {
    expect(isValidGroupLink('https://chat.whatsapp.com/AbCdEf1234567890XyZ')).toBe(true)
    expect(isValidGroupLink('https://chat.whatsapp.com/AbCdEf1234567890XyZ?mode=ems_copy_t')).toBe(true)
    expect(isValidGroupLink('https://chat.whatsapp.com/AbCdEf1234567890XyZ?x="><')).toBe(false)
    expect(isValidGroupLink('javascript:alert(1)')).toBe(false)
    expect(isValidGroupLink('https://evil.com/chat.whatsapp.com/abc')).toBe(false)
  })
})
