import { useMemo } from 'react'
import { Icon } from '../ui/Icon'
import { GoldButton } from '../ui/GoldButton'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import type { Route } from '../../hooks/useHashRoute'
import type { Perfil } from '../../data/types'
import { asset } from '../../data/assets'
import { crestPath } from '../../data/ranks'
import './chrome.css'

const NAV: { route: Route; label: string }[] = [
  { route: 'inicio', label: 'INICIO' },
  { route: 'perfil', label: 'PERFIL' },
  { route: 'coleccion', label: 'CAMPEONES' },
  { route: 'artesania', label: 'ARTESANÍA' },
  { route: 'seleccion', label: 'SELECCIÓN' },
  { route: 'lobby', label: 'GRUPO' },
]

const TOOLS = ['profile', 'collection', 'loot', 'party', 'store'] as const

type Props = {
  route: Route
  perfil: Perfil
  onNavigate: (route: Route) => void
}

export function TopBar({ route, perfil, onNavigate }: Props) {
  const { muted, toggle, play } = useAudio()
  const sound = useButtonSound('grid')
  const crest = useMemo(() => crestPath(perfil.rango), [perfil.rango])

  return (
    <header className="top">
      <div className="top__brand">
        <span className="top__brandmark" aria-hidden="true">
          L
        </span>
        <GoldButton
          variant="play"
          className="btn--play"
          onClick={() => {
            play('nav-click')
            onNavigate('seleccion')
          }}
        >
          JUGAR
        </GoldButton>
      </div>

      <nav className="top__nav" aria-label="Navegacion principal">
        {NAV.map((item) => (
          <button
            key={item.route}
            type="button"
            className="top__link"
            aria-current={route === item.route ? 'page' : undefined}
            onClick={() => {
              play('nav-click')
              onNavigate(item.route)
            }}
            {...sound}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="top__tools">
        {TOOLS.map((tool) => (
          <button
            key={tool}
            type="button"
            className="top__iconbtn top__iconbtn--aux"
            aria-label={tool}
            onClick={() => play('grid-click')}
            {...sound}
          >
            <Icon name={tool} size={22} />
          </button>
        ))}

        <span className="top__divider" aria-hidden="true" />

        <div className="top__wallet">
          <span className="top__wallet-row">
            <img src={asset("assets/ui/currency/icon-be-150.png")} alt="" />
            20
            <span className="chip chip--gold" style={{ marginLeft: '0.25rem' }}>
              +
            </span>
          </span>
          <span className="top__wallet-row">
            <img src={asset("assets/ui/currency/icon-rp-32.png")} alt="" />
            147 MIL
          </span>
        </div>

        <button
          type="button"
          className="top__iconbtn"
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          aria-pressed={muted}
          onClick={toggle}
          {...sound}
        >
          <Icon name={muted ? 'mute' : 'sound'} size={20} />
        </button>

        <div className="top__account">
          <div className="top__summoner">
            <span className="top__summoner-name">{perfil.summoner}</span>
            <span className="top__status">
              <span className="top__status-dot" />
              En linea
            </span>
          </div>
          <div className="top__emblem">
            <img className="top__crest" src={crest} alt="" />
            <span className="top__emblem-level">{perfil.nivel}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
