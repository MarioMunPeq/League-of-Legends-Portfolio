import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { disposeAudio, play, primeAudio } from '../data/audio'
import type { SoundName } from '../data/audio'
import { AudioCtx } from './useAudio'

const STORAGE_KEY = 'lol-portfolio:mute'

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState<boolean>(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1',
  )

  useEffect(() => {
    primeAudio()
    return disposeAudio
  }, [])

  const handlePlay = useCallback(
    (name: SoundName) => {
      if (!muted) play(name)
    },
    [muted],
  )

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      if (!next) play('hover')
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ muted, toggle, play: handlePlay }),
    [muted, toggle, handlePlay],
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}
