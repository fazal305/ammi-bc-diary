import { cleanName, NAME_MAX } from '../lib/text.js'
import { normalizePhone } from '../lib/phone.js'

export const SCHEMA_VERSION = 1

export const initialDiary = {
  version: SCHEMA_VERSION,
  members: [],
  draws: [],
  round: 1,
  groupLink: '',
}

export function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function winnerIds(diary) {
  return new Set(diary.draws.filter((d) => d.round === diary.round).map((d) => d.memberId))
}

export function eligibleMembers(diary) {
  const won = winnerIds(diary)
  return diary.members.filter((m) => !won.has(m.id))
}

export function currentRoundDraws(diary) {
  return diary.draws.filter((d) => d.round === diary.round)
}

function memberFields(payload) {
  return {
    name: cleanName(payload.name).slice(0, NAME_MAX),
    phone: normalizePhone(payload.phone ?? ''),
  }
}

export function diaryReducer(state, action) {
  switch (action.type) {
    case 'addMember': {
      const fields = memberFields(action)
      if (!fields.name) return state
      return {
        ...state,
        members: [...state.members, { id: action.id ?? newId(), ...fields, paid: false }],
      }
    }
    case 'updateMember': {
      const fields = memberFields(action)
      if (!fields.name) return state
      return {
        ...state,
        members: state.members.map((m) => (m.id === action.id ? { ...m, ...fields } : m)),
      }
    }
    case 'removeMember':
      return { ...state, members: state.members.filter((m) => m.id !== action.id) }
    case 'togglePaid':
      return {
        ...state,
        members: state.members.map((m) => (m.id === action.id ? { ...m, paid: !m.paid } : m)),
      }
    case 'resetPayments':
      return { ...state, members: state.members.map((m) => ({ ...m, paid: false })) }
    case 'recordDraw': {
      const member = eligibleMembers(state).find((m) => m.id === action.memberId)
      if (!member) return state
      const draw = {
        id: action.id ?? newId(),
        memberId: member.id,
        name: member.name,
        round: state.round,
        at: action.at ?? new Date().toISOString(),
      }
      return { ...state, draws: [...state.draws, draw] }
    }
    case 'newRound':
      return { ...state, round: state.round + 1 }
    case 'setGroupLink':
      return { ...state, groupLink: action.link.trim() }
    case 'replace':
      return action.diary
    default:
      return state
  }
}
