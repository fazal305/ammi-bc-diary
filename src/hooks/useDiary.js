import { useEffect, useReducer, useState } from 'react'
import { diaryReducer } from '../state/diary.js'
import { loadDiary, parseDiary, saveDiary, STORAGE_KEY } from '../state/storage.js'

export function useDiary() {
  const [diary, dispatch] = useReducer(diaryReducer, undefined, () => loadDiary())
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    // The write result is only known after syncing with localStorage.
    // oxlint-disable-next-line react/set-state-in-effect
    setSaveFailed(!saveDiary(diary))
  }, [diary])

  // Keep two open tabs from overwriting each other with stale data.
  useEffect(() => {
    function onStorage(event) {
      if (event.key !== STORAGE_KEY) return
      const next = parseDiary(event.newValue)
      if (next) dispatch({ type: 'replace', diary: next })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { diary, dispatch, saveFailed }
}
