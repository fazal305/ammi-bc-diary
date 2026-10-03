import { describe, expect, it } from 'vitest'
import { diaryReducer, eligibleMembers, initialDiary, currentRoundDraws } from './diary.js'
import { loadDiary, parseDiary, saveDiary, STORAGE_KEY } from './storage.js'

function withMembers(...names) {
  return names.reduce(
    (s, name, i) => diaryReducer(s, { type: 'addMember', id: `m${i}`, name, phone: '' }),
    initialDiary,
  )
}

describe('members', () => {
  it('adds a trimmed member as unpaid', () => {
    const s = diaryReducer(initialDiary, { type: 'addMember', name: '  زاہدہ   آنٹی ', phone: '۰۳۰۰-۱۲۳۴۵۶۷' })
    expect(s.members).toHaveLength(1)
    expect(s.members[0]).toMatchObject({ name: 'زاہدہ آنٹی', phone: '03001234567', paid: false })
  })

  it('ignores a blank name', () => {
    expect(diaryReducer(initialDiary, { type: 'addMember', name: '   ' })).toBe(initialDiary)
  })

  it('toggles paid and resets payments', () => {
    let s = withMembers('a', 'b')
    s = diaryReducer(s, { type: 'togglePaid', id: 'm0' })
    expect(s.members.map((m) => m.paid)).toEqual([true, false])
    s = diaryReducer(s, { type: 'resetPayments' })
    expect(s.members.every((m) => !m.paid)).toBe(true)
  })

  it('edits and removes a member', () => {
    let s = withMembers('a', 'b')
    s = diaryReducer(s, { type: 'updateMember', id: 'm1', name: 'c', phone: '' })
    expect(s.members[1].name).toBe('c')
    s = diaryReducer(s, { type: 'removeMember', id: 'm0' })
    expect(s.members.map((m) => m.id)).toEqual(['m1'])
  })
})

describe('draws', () => {
  it('removes a winner from the next draw', () => {
    let s = withMembers('a', 'b', 'c')
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm1' })
    expect(eligibleMembers(s).map((m) => m.id)).toEqual(['m0', 'm2'])
    expect(currentRoundDraws(s)[0].name).toBe('b')
  })

  it('refuses to draw the same member twice in a round', () => {
    let s = withMembers('a')
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm0' })
    expect(diaryReducer(s, { type: 'recordDraw', memberId: 'm0' })).toBe(s)
  })

  it('keeps history but makes everyone eligible in a new round', () => {
    let s = withMembers('a', 'b')
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm0' })
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm1' })
    expect(eligibleMembers(s)).toHaveLength(0)
    s = diaryReducer(s, { type: 'newRound' })
    expect(eligibleMembers(s)).toHaveLength(2)
    expect(s.draws).toHaveLength(2)
    expect(currentRoundDraws(s)).toHaveLength(0)
  })

  it('keeps the winner name after the member is removed', () => {
    let s = withMembers('a')
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm0' })
    s = diaryReducer(s, { type: 'removeMember', id: 'm0' })
    expect(s.draws[0].name).toBe('a')
  })
})

describe('storage', () => {
  function memoryStorage(initial = {}) {
    const data = { ...initial }
    return {
      getItem: (k) => data[k] ?? null,
      setItem: (k, v) => {
        data[k] = String(v)
      },
    }
  }

  it('round-trips a diary', () => {
    const store = memoryStorage()
    let s = withMembers('a')
    s = diaryReducer(s, { type: 'recordDraw', memberId: 'm0', at: '2026-10-01T00:00:00.000Z' })
    expect(saveDiary(s, store)).toBe(true)
    expect(loadDiary(store)).toEqual(s)
  })

  it('falls back to an empty diary on corrupt data', () => {
    expect(loadDiary(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toBe(initialDiary)
    expect(parseDiary('{"version":99}')).toBeNull()
  })

  it('drops malformed members', () => {
    const raw = JSON.stringify({ version: 1, members: [{ id: 'x', name: 'ok' }, { id: 1 }, null], draws: 'no' })
    const d = parseDiary(raw)
    expect(d.members).toEqual([{ id: 'x', name: 'ok', phone: '', paid: false }])
    expect(d.draws).toEqual([])
  })

  it('reports a failed save', () => {
    const store = { getItem: () => null, setItem: () => { throw new Error('quota') } }
    expect(saveDiary(initialDiary, store)).toBe(false)
  })
})
