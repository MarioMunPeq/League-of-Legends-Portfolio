import { useAudio } from '../../hooks/useAudio'

/** Iconos de navegacion dibujados en SVG, con la silueta del cliente. */
export type IconName =
  | 'play'
  | 'home'
  | 'profile'
  | 'collection'
  | 'loot'
  | 'store'
  | 'party'
  | 'search'
  | 'close'
  | 'settings'
  | 'help'
  | 'sound'
  | 'mute'
  | 'chat'
  | 'mic'
  | 'github'
  | 'linkedin'
  | 'mail'
  | 'cv'
  | 'web'
  | 'crown'
  | 'trophy'
  | 'shield'
  | 'spark'
  | 'plus'
  | 'check'
  | 'caret'
  | 'external'

const PATHS: Record<IconName, string> = {
  play: 'M8 5v14l11-7z',
  home: 'M12 3 2 11.2l1.2 1.8L4 12.4V21h6v-6h4v6h6v-8.6l.8.6 1.2-1.8L12 3Z',
  profile:
    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2.2-7 5v1h14v-1c0-2.8-3-5-7-5Z',
  collection: 'M4 5h7v6H4V5Zm9 0h7v6h-7V5ZM4 13h7v6H4v-6Zm9 0h7v6h-7v-6Z',
  loot: 'M12 2 4 6v6c0 4.5 3.3 8.6 8 10 4.7-1.4 8-5.5 8-10V6l-8-4Zm0 5 5 2.4-2 .9-3-1.5-3 1.5-2-.9L12 7Z',
  store: 'M5 4h14l1.2 5H3.8L5 4Zm-1.2 7h16.4v8a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2v-8Zm4 1.5v3h8v-3h-8Z',
  party: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 .5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2 19c0-3 3.1-5 7-5s7 2 7 5v1H2v-1Zm14.5-4.7c2.4.3 4.5 1.7 4.5 3.7v1h-4v-1c0-1.5-.2-2.7-.5-3.7Z',
  search:
    'M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm0 2.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm5.8 10.3 4.2 4.2-1.8 1.8-4.2-4.2 1.8-1.8Z',
  close: 'm6 4.6 12 12-1.4 1.4-12-12L6 4.6Zm14.8 0-12 12-1.4-1.4 12-12 1.4 1.4Z',
  settings:
    'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm-1.5-8h3l.4 2.4 1.7.7 2-1.4 2.1 2.1-1.4 2 .7 1.7 2.4.4v3l-2.4.4-.7 1.7 1.4 2-2.1 2.1-2-1.4-1.7.7-.4 2.4h-3l-.4-2.4-1.7-.7-2 1.4-2.1-2.1 1.4-2-.7-1.7L2.6 14v-3L5 10.6l.7-1.7-1.4-2 2.1-2.1 2 1.4 1.7-.7.4-2.4Z',
  help: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm.1 15.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM14 12c-.9.7-1.3 1.1-1.3 2h-1.8c0-1.5.5-2.3 1.7-3.2.9-.6 1.2-1 1.2-1.7 0-.8-.6-1.4-1.5-1.4-.9 0-1.6.6-1.7 1.6l-1.8-.5C8.3 7 9.6 5.9 11.6 5.9c2 0 3.3 1.1 3.3 2.7 0 1.1-.5 1.7-1.9 2.7l-.9.7Z',
  sound:
    'M4 9.5h3L12 5v14l-5-4.5H4v-5Zm11.5-.6a5 5 0 0 1 0 6.2l1.3 1.4a7 7 0 0 0 0-9l-1.3 1.4Zm2.3-2.7a9 9 0 0 1 0 11.6l1.3 1.4a11 11 0 0 0 0-14.4l-1.3 1.4Z',
  mute: 'M4 9.5h3L12 5v14l-5-4.5H4v-5Zm12.4-.1L19 12l-2.6 2.6-1.4-1.4L15.6 11.6l-1.2-1.2 1.4-1.4L18.4 11.4l1.4-1.4 1.4 1.4L19.6 13l1.6 1.6-1.4 1.4-1.8-1.8-1.6 1.6Z',
  chat: 'M3 4h18v12H8l-5 4V4Zm3 3v2h12V7H6Zm0 4v2h8v-2H6Z',
  mic: 'M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z',
  github:
    'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2Z',
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5Z',
  mail: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm9 7.2L4.5 7v10h15V7L12 12.2Z',
  cv: 'M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5L13 3.5ZM8.5 10h7v1.6h-7V10Zm0 3.4h7V15h-7v-1.6Zm0 3.4h4.5v1.6H8.5v-1.6Z',
  web: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 9h-3a15 15 0 0 0-1.4-5.7A8 8 0 0 1 18.9 11ZM12 4.1c.8 1.2 1.4 3.4 1.6 6.9h-3.2c.2-3.5.8-5.7 1.6-6.9ZM8.5 5.3A15 15 0 0 0 7.1 11h-3a8 8 0 0 1 4.4-5.7ZM5.1 13h3a15 15 0 0 0 1.4 5.7A8 8 0 0 1 5.1 13ZM12 19.9c-.8-1.2-1.4-3.4-1.6-6.9h3.2c-.2 3.5-.8 5.7-1.6 6.9Zm3.5-1.2a15 15 0 0 0 1.4-5.7h3a8 8 0 0 1-4.4 5.7Z',
  crown: 'M3 18h18l1.5-11-5.5 4L12 4 7 11 1.5 7 3 18Z',
  trophy:
    'M8 4h8v6a4 4 0 0 1-8 0V4ZM4 5h2a6 6 0 0 0 1 4.4A5 5 0 0 1 4 9V5Zm16 0h-2a6 6 0 0 1-1 4.4A5 5 0 0 0 20 9V5ZM11 14h2v3h3v2H8v-2h3v-3Z',
  shield: 'M12 2 4 5.5v6c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5v-6L12 2Z',
  spark: 'M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5L3.5 11 10 9l2-6.5Z',
  plus: 'M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z',
  check: 'M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7 9.5 16.2Z',
  caret: 'M9.5 5.5 16 12l-6.5 6.5L8 17l5-5-5-5 1.5-1.5Z',
  external:
    'M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h5v2H6v11h11v-4h2v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
}

const FILLED: IconName[] = ['play', 'home', 'crown', 'spark']

type Props = {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 20, className }: Props) {
  const { play } = useAudio()
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={FILLED.includes(name) ? 'currentColor' : 'none'}
      stroke={FILLED.includes(name) ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      onMouseEnter={() => play('grid-hover')}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
