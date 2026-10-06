import { useMemo, type CSSProperties } from 'react'
import { GoldButton } from '../ui/GoldButton'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import type { Route } from '../../hooks/useHashRoute'
import type { Perfil } from '../../data/types'
import { asset } from '../../data/assets'
import { crestPath } from '../../data/ranks'
import './chrome.css'

/**
 * Secciones de la barra superior. El cliente no pone texto: pone el icono de
 * la seccion y el nombre sale al pasar el raton. Estos son los archivos que
 * carga la League (`nav-icon-profile`, `nav-icon-collections`, `nav-icon-loot`),
 * y van en el grupo de la derecha, que es donde el cliente los coloca.
 */
const SECCIONES: { route: Route; label: string; icono: string }[] = [
  { route: 'perfil', label: 'Perfil', icono: 'nav-icon-profile.svg' },
  { route: 'coleccion', label: 'Campeones', icono: 'nav-icon-collections.svg' },
  { route: 'artesania', label: 'Artesanía', icono: 'nav-icon-loot.svg' },
]

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
      {/* El logo de League es el boton de inicio, igual que en el cliente. */}
      <button
        type="button"
        className="top__logo"
        aria-label="Inicio"
        aria-current={route === 'inicio' ? 'page' : undefined}
        onClick={() => {
          play('nav-click')
          onNavigate('inicio')
        }}
        {...sound}
      >
        <img src={asset('assets/ui/chrome/league-logo-active.svg')} alt="" />
      </button>

      <GoldButton
        variant="play"
        className="btn--play"
        onClick={() => {
          play('nav-click')
          onNavigate('jugar')
        }}
      >
        JUGAR
      </GoldButton>

      <div className="top__tools">
        {/* Secciones del portfolio, en el grupo de iconos de la derecha. */}
        <nav className="top__nav" aria-label="Navegacion principal">
          {SECCIONES.map((s) => (
            <button
              key={s.route}
              type="button"
              className="top__link"
              title={s.label}
              aria-label={s.label}
              aria-current={route === s.route ? 'page' : undefined}
              onClick={() => {
                play('nav-click')
                onNavigate(s.route)
              }}
              {...sound}
            >
              <img src={asset(`assets/ui/nav/${s.icono}`)} alt="" />
            </button>
          ))}
        </nav>

        <div className="top__wallet">
          <span className="top__wallet-row">
            <img src={asset('assets/ui/currency/icon-be-150.png')} alt="" />
            20
            <span className="top__wallet-plus">+</span>
          </span>
          <span className="top__wallet-row">
            <img src={asset('assets/ui/currency/icon-rp-32.png')} alt="" />
            147 MIL
          </span>
        </div>

        {/* Retrato con el marco real del cliente y el nivel en su hexagono. */}
        <button
          type="button"
          className="top__profile"
          title="Perfil"
          aria-label={`${perfil.summoner}, nivel ${perfil.nivel}`}
          aria-current={route === 'perfil' ? 'page' : undefined}
          onClick={() => {
            play('nav-click')
            onNavigate('perfil')
          }}
          {...sound}
        >
          <span className="top__portrait">
            <span className="top__portrait-plate" />
            <img className="top__crest" src={crest} alt="" />
            <img
              className="top__frame"
              src={asset('assets/ui/level-ring/theme-1-solid-border.png')}
              alt=""
            />
            <span className="top__level">{perfil.nivel}</span>
          </span>
        </button>

        <div className="top__summoner">
          <span className="top__summoner-name">{perfil.summoner}</span>
          <span className="top__status">
            <span className="top__status-dot" />
            En linea
          </span>
        </div>

        <button type="button" className="top__iconbtn" aria-label="Invitar" {...sound}>
          <Mask name="party-invite-mask.svg" size={22} />
        </button>
        <button
          type="button"
          className="top__iconbtn"
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          aria-pressed={muted}
          onClick={toggle}
          {...sound}
        >
          <Mask name="mute_mask.png" size={22} />
        </button>

        {/* Controles de ventana: en el cliente van al extremo derecho. */}
        <div className="top__sysbtns">
          <button type="button" className="top__sysbtn" aria-label="Ayuda" {...sound}>
            <img src={asset('assets/ui/hextech/question-mark.svg')} alt="" />
          </button>
          <span className="top__sysbtn top__sysbtn--void" aria-hidden="true">
            <b>—</b>
          </span>
          <button type="button" className="top__sysbtn" aria-label="Ajustes" {...sound}>
            <img src={asset('assets/ui/uikit-icons/icon_settings.png')} alt="" />
          </button>
          <button type="button" className="top__sysbtn" aria-label="Cerrar" {...sound}>
            <img src={asset('assets/ui/chrome/x.png')} alt="" />
          </button>
        </div>
      </div>
    </header>
  )
}

/**
 * Icono del cliente pintado como mascara, para heredar el color del texto.
 * Es lo que hace la League con sus iconos de la barra social.
 */
function Mask({ name, size }: { name: string; size: number }) {
  const url = asset(`assets/ui/social/${name}`)
  return (
    <span
      className="maskicon"
      style={
        {
          width: size,
          height: size,
          maskImage: `url("${url}")`,
          WebkitMaskImage: `url("${url}")`,
        } as CSSProperties
      }
    />
  )
}
