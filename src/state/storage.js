import { initialDiary, SCHEMA_VERSION } from './diary.js'

export const STORAGE_KEY = 'ammi-bc-diary'

function isString(v) {
  return typeof v === 'string'
}

// Anything that does not look like a diary is dropped rather than trusted,
// so a corrupted entry cannot crash the app on start.
export function parseDiary(raw) {
  if (!raw) return null
  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!data || typeof data !== 'object' || data.version !== SCHEMA_VERSION) return null
  const members = Array.isArray(data.members)
    ? data.members
        .filter((m) => m && isString(m.id) && isString(m.name) && m.name)
        .map((m) => ({ id: m.id, name: m.name, phone: isString(m.phone) ? m.phone : '', paid: m.paid === true }))
    : []
  const draws = Array.isArray(data.draws)
    ? data.draws
        .filter((d) => d && isString(d.id) && isString(d.memberId) && isString(d.name) && Number.isInteger(d.round))
        .map((d) => ({ id: d.id, memberId: d.memberId, name: d.name, round: d.round, at: isString(d.at) ? d.at : '' }))
    : []
  return {
    version: SCHEMA_VERSION,
    members,
    draws,
    round: Number.isInteger(data.round) && data.round > 0 ? data.round : 1,
    groupLink: isString(data.groupLink) ? data.groupLink : '',
  }
}

export function loadDiary(storage = globalThis.localStorage) {
  try {
    return parseDiary(storage.getItem(STORAGE_KEY)) ?? initialDiary
  } catch {
    return initialDiary
  }
}

// Returns false when the browser refuses to store (private mode, full disk),
// so the UI can warn that changes will not survive a reload.
export function saveDiary(diary, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(diary))
    return true
  } catch {
    return false
  }
}
