import { useMemo, type CSSProperties } from 'react'
import { Icon } from '../ui/Icon'
import { PlayButton } from '../ui/PlayButton'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import type { Route } from '../../hooks/useHashRoute'
import type { EnlaceSocial, Perfil } from '../../data/types'
import { asset } from '../../data/assets'
import { PLAYER_ICON } from '../../data/ranks'
import './chrome.css'

/**
 * Pestanas de la izquierda. En el cliente son los juegos (LOL, CLASSIC, TFT) y
 * JUGAR ya abre el juego, asi que aqui solo queda la entrada al sitio: las otras
 * dos pantallas tienen su propio boton (la placa de jugar y el retrato de la
 * cuenta) y no hacen falta repetidas en la tira.
 */
const PESTANAS: { route: Route; label: string }[] = [{ route: 'inicio', label: 'INICIO' }]

/**
 * Celdas de la derecha. El cliente llena ese grupo con los iconos de sus
 * secciones (coleccion, botin, tienda...) y aqui se mixes con los dos enlaces
 * que el portfolio anade al juego: repositorio y perfil profesional. Las dos
 * primeras son navegacion de la app y van con el icono del cliente; las otras
 * dos son enlaces y usan el glifo, tambien en dorado como las del cliente.
 */
const SECCIONES: {
  route?: Route
  id?: string
  label: string
  icono?: string
  glifo?: 'github' | 'linkedin'
}[] = [
  { route: 'coleccion', label: 'Coleccion de campeones', icono: 'nav-icon-collections.svg' },
  { route: 'artesania', label: 'Artesania y materiales', icono: 'nav-icon-loot.svg' },
  { id: 'github', label: 'Repositorio', glifo: 'github' },
  { id: 'linkedin', label: 'Perfil profesional', glifo: 'linkedin' },
]

type Props = {
  route: Route
  perfil: Perfil
  enlaces: EnlaceSocial[]
  onNavigate: (route: Route) => void
}

export function TopBar({ route, perfil, enlaces, onNavigate }: Props) {
const { muted, toggle, play } = useAudio()
  const sound = useButtonSound('grid')
  /*
   * El retrato de la barra es el mismo profile-icon que aparece en la ficha:
   * el cliente lo repite en los dos sitios. La insignia de rango no va aqui.
   */
  const retrato = PLAYER_ICON

  const porId = useMemo(
    () => new Map(enlaces.map((e) => [e.id, e] as const)),
    [enlaces],
  )
  // el portfolio no publica correo: el boton de aviso abre el canal de GitHub
  const github = porId.get('github')

  return (
    <header className="top">
      {/* La placa de JUGAR del cliente: escudo de League + cartel con punta. */}
      <PlayButton onClick={() => onNavigate('jugar')} />

      {/* El boton azul de avisos del cliente; aqui abre el canal de contacto. */}
      <a
        className="top__alert"
        href={github?.url ?? '#contacto'}
        aria-label={github ? `Escribir por GitHub a ${github.handle}` : 'Contacto'}
        title={github ? `Escribir por GitHub a ${github.handle}` : 'Contacto'}
        target={github?.url.startsWith('http') ? '_blank' : undefined}
        rel="noreferrer noopener"
        {...sound}
      >
        !
      </a>

      {/* Doble galon del cliente, entre el aviso y las pestanas. */}
      <span className="top__chevron" aria-hidden="true" />

      <nav className="top__tabs" aria-label="Secciones principales">
        {PESTANAS.map((p) => (
          <button
            key={p.route}
            type="button"
            className="top__tab"
            aria-current={route === p.route ? 'page' : undefined}
            onClick={() => {
              play('nav-click')
              onNavigate(p.route)
            }}
            {...sound}
          >
            {p.label}
          </button>
        ))}
      </nav>

      <div className="top__tools">
        <nav className="top__nav" aria-label="Navegacion secundaria">
          {SECCIONES.map((s) => {
            const destino = s.id ? porId.get(s.id) : undefined

            const inner = s.glifo ? (
              <Icon name={s.glifo} size={28} />
            ) : (
              <img src={asset(`assets/ui/nav/${s.icono}`)} alt="" />
            )

            if (destino) {
              return (
                <a
                  key={s.id}
                  className="top__link top__link--ext"
                  href={destino.url}
                  target={destino.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer noopener"
                  title={s.label}
                  aria-label={s.label}
                  {...sound}
                >
                  {inner}
                </a>
              )
            }

            const activo = s.route !== undefined && route === s.route
            return (
              <button
                key={s.route}
                type="button"
                className="top__link"
                title={s.label}
                aria-label={s.label}
                aria-current={activo ? 'page' : undefined}
                onClick={() => {
                  play('nav-click')
                  if (s.route) onNavigate(s.route)
                }}
                {...sound}
              >
                {inner}
              </button>
            )
          })}
        </nav>

        {/*
         * La cartera. Ojo con los nombres de archivo de Riot: estan cruzados.
         * `icon-be-150.png` contiene el diamante cian de los Riot Points y
         * `icon-rp-72.png` la llama dorada de las esencias azules. Por eso la primera
         * fila (esencias) usa el fichero "rp" y la segunda (RP) el "be".
         *
         * El cliente solo encierra la primera fila en la capsula: los Riot Points
         * van debajo, fuera del borde.
         */}
        <div className="top__wallet">
          <span className="top__wallet-pill">
            <img src={asset('assets/ui/currency/icon-rp-72.png')} alt="" />
            20
            <span className="top__wallet-plus">+</span>
          </span>
          <span className="top__wallet-row">
            <img src={asset('assets/ui/currency/icon-be-150.png')} alt="" />
            147 MIL
          </span>
        </div>

        {/*
         * La cuenta es la unica via a la ficha: el retrato y el nombre son un
         * solo boton, como en el cliente, donde el invocador abre su perfil.
         */}
        <button
          type="button"
          className="top__account"
          title="Perfil"
          aria-label={`Perfil de ${perfil.summoner}, nivel ${perfil.nivel}`}
          aria-current={route === 'perfil' ? 'page' : undefined}
          onClick={() => {
            play('nav-click')
            onNavigate('perfil')
          }}
          {...sound}
        >
          <span className="top__portrait">
            <span className="top__portrait-plate" />
            <img className="top__crest" src={retrato} alt="" />
            <img
              className="top__frame"
              src={asset('assets/ui/level-ring/theme-1-solid-border.png')}
              alt=""
            />
            <span className="top__level">{perfil.nivel}</span>
          </span>
          <span className="top__summoner">
            <span className="top__summoner-name">{perfil.summoner}</span>
            <span className="top__status">
              <span className="top__status-dot" aria-hidden="true">
                <Icon name="check" size={11} />
              </span>
              En linea
            </span>
          </span>
        </button>

        <button type="button" className="top__iconbtn" aria-label="Invitar" {...sound}>
          <Mask name="party-invite-mask.svg" size={24} tone="orange" />
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

        {/*
         * Controles de ventana. El cliente los TREPONE en la esquina superior
         * derecha, no centrados en la barra, asi que van fuera del flujo.
         */}
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
 * Es lo que hace la League con sus iconos de la barra social: el glifo es
 * monocromo y el color lo pone quien lo usa.
 */
function Mask({ name, size, tone }: { name: string; size: number; tone?: string }) {
  const url = asset(`assets/ui/social/${name}`)
  return (
    <span
      className={`maskicon ${tone === 'orange' ? 'maskicon--orange' : ''}`}
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