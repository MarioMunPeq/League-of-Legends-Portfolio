import { createContext, useContext, useMemo } from 'react'
import type { SoundName } from '../data/audio'

export type AudioContextValue = {
  muted: boolean
  toggle: () => void
  play: (name: SoundName) => void
}

export const AudioCtx = createContext<AudioContextValue | null>(null)

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio debe usarse dentro de <AudioProvider>')
  return ctx
}

/** Enlaza los gestos de sonido que el cliente aplica a un boton. */
export function useButtonSound(kind: 'gold' | 'grid' = 'gold') {
  const { play } = useAudio()
  return useMemo(
    () => ({
      onMouseEnter: () => play(kind === 'grid' ? 'grid-hover' : 'hover'),
      onMouseDown: () => play(kind === 'grid' ? 'grid-click' : 'click'),
    }),
    [play, kind],
  )
}
