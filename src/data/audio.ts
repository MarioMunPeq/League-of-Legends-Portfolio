import { asset } from './assets'

export type SoundName =
  | 'hover'
  | 'click'
  | 'grid-hover'
  | 'grid-click'
  | 'nav-click'
  | 'page'
  | 'visor'

const FILES: Record<SoundName, string> = {
  hover: 'sfx-uikit-button-gold-hover.ogg',
  click: 'sfx-uikit-button-gold-click.ogg',
  'grid-hover': 'sfx-uikit-grid-hover.ogg',
  'grid-click': 'sfx-uikit-grid-click.ogg',
  'nav-click': 'sfx-nav-button-play-click.ogg',
  page: 'sfx-lobby-strawberry-page-load.ogg',
  visor: 'sfx-regalia-lobby-visor-open.ogg',
}

/** Sonidos que pueden solaparse y necesitan una voz propia por reproduccion. */
const POLYPHONIC: SoundName[] = ['hover', 'click', 'grid-hover', 'grid-click']

const templates = new Map<SoundName, HTMLAudioElement>()

function ensure(): void {
  if (typeof Audio === 'undefined' || templates.size > 0) return
  for (const [name, file] of Object.entries(FILES) as [SoundName, string][]) {
    const audio = new Audio(asset(`audio/${file}`))
    audio.preload = 'auto'
    templates.set(name, audio)
  }
}

/** Precarga los sonidos sin reproducirlos; util tras el primer gesto. */
export function primeAudio(): void {
  ensure()
}

export function play(name: SoundName): void {
  ensure()
  const template = templates.get(name)
  if (!template) return

  if (POLYPHONIC.includes(name)) {
    // voz descartable: un hover rapido no debe cortar al anterior
    const voice = template.cloneNode() as HTMLAudioElement
    void voice.play().catch(() => {})
    return
  }

  template.currentTime = 0
  void template.play().catch(() => {})
}

export function disposeAudio(): void {
  for (const audio of templates.values()) {
    audio.pause()
    audio.src = ''
  }
  templates.clear()
}
