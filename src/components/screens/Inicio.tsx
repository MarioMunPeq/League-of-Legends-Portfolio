import { useMemo, useState, type ReactNode } from 'react'
import { champSquare, champSplash } from '../../data/assets'
import { asset } from '../../data/assets'
import { GoldButton } from '../ui/GoldButton'
import { Icon, type IconName } from '../ui/Icon'
import { MaterialIcon, type MaterialIconName } from '../ui/MaterialIcon'
import { crestPath } from '../../data/ranks'
import { modoPorId } from '../../data/modos'
import type { PortfolioData, Proyecto } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import './screens.css'

/** Secciones de la barra lateral, como la lista de Hall of Legends. */
const SECCIONES: { route: Route; label: string; icono: IconName }[] = [
  { route: 'inicio', label: 'INICIO', icono: 'store' },
  { route: 'perfil', label: 'PERFIL', icono: 'profile' },
  { route: 'coleccion', label: 'CAMPEONES', icono: 'collection' },
  { route: 'artesania', label: 'ARTESANÍA', icono: 'loot' },
]

const PESTANAS = [
  { id: 'coleccion', label: 'COLECCIÓN', icono: 'collection' },
  { id: 'maestria', label: 'MAESTRÍA', icono: 'spark' },
  { id: 'logros', label: 'LOGROS', icono: 'crown' },
] as const satisfies readonly { id: string; label: string; icono: IconName }[]

type Pestana = (typeof PESTANAS)[number]['id']

type Showcase = {
  /** la linea cursiva sobre el titulo, como el lema de la coleccion */
  guion: string
  titulo: string
  claim: string
  /** contenido del boton dorado: icono + cifra */
  coste: ReactNode
  /** miniaturas de la coleccion, como en el cliente */
  thumbs: ReactNode
  accion: () => void
  etiqueta: string
}

type Props = {
  data: PortfolioData
  onNavegar: (route: Route) => void
  onAbrir: (proyecto: Proyecto) => void
  /** modo confirmado en la pantalla Jugar */
  modo?: string | null
}

/**
 * Inicio: la pantalla de bienvenida con el marco del cliente. El titular, el
 * texto y las cifras son los del portfolio; el envase (barra lateral, pestanas
 * de coleccion, arte a sangre y boton dorado) es el del cliente de LoL.
 */
export function Inicio({ data, onNavegar, onAbrir, modo }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('grid')
  const { hero, perfil, proyectos, hitos, materiales } = data
  const [pestana, setPestana] = useState<Pestana>('coleccion')

  const fondo = useMemo(() => champSplash(hero.champFavorito), [hero.champFavorito])
  const crest = useMemo(() => crestPath(perfil.rango), [perfil.rango])
  const modoActual = modoPorId(modo ?? null)

  const topMateriales = useMemo(
    () => [...materiales].sort((a, b) => b.nivel - a.nivel).slice(0, 3),
    [materiales],
  )

  const cost = (cifra: string) => (
    <>
      <img src={asset('assets/mastery/icon-mark-of-mastery.png')} alt="" />
      {cifra}
    </>
  )

  const showcase: Record<Pestana, Showcase> = {
    coleccion: {
      guion: 'Colección',
      titulo: hero.champFavorito,
      claim: `La colección completa: ${proyectos.length} campeones, un proyecto cada uno.`,
      coste: cost(`${proyectos.length} PROYECTOS`),
      thumbs: proyectos.slice(0, 3).map((p) => (
        <button
          key={p.id}
          type="button"
          className="home__thumb"
          aria-label={`Abrir ${p.titulo}`}
          onClick={() => onAbrir(p)}
          {...sound}
        >
          <img src={champSquare(p.campeon)} alt="" loading="lazy" />
        </button>
      )),
      accion: () => onNavegar('coleccion'),
      etiqueta: 'Ver la colección de campeones',
    },
    maestria: {
      guion: 'Maestría',
      titulo: 'Artesanía',
      claim: `${materiales.length} materiales y ${materiales.filter((m) => m.destacado).length} destacados en la mochila.`,
      coste: cost(`${materiales.length} OBJETOS`),
      thumbs: topMateriales.map((m) => (
        <button
          key={m.id}
          type="button"
          className="home__thumb"
          aria-label={`Ver ${m.nombre}`}
          onClick={() => onNavegar('artesania')}
          {...sound}
        >
          <MaterialIcon name={m.id as MaterialIconName} categoria={m.categoria} size={64} />
        </button>
      )),
      accion: () => onNavegar('artesania'),
      etiqueta: 'Ver los materiales',
    },
    logros: {
      guion: 'Cuenta',
      titulo: perfil.summoner,
      claim: `Nivel ${perfil.nivel} · programando desde 2022.`,
      coste: cost(`${hitos.length} HITOS`),
      thumbs: hitos.slice(0, 3).map((h) => (
        <button
          key={h.etiqueta}
          type="button"
          className="home__thumb home__thumb--hito"
          aria-label={`${h.valor} ${h.etiqueta}`}
          onClick={() => onNavegar('perfil')}
          {...sound}
        >
          <span>{h.valor}</span>
        </button>
      )),
      accion: () => onNavegar('perfil'),
      etiqueta: 'Abrir el perfil',
    },
  }

  const vista = showcase[pestana]

  return (
    <div className="home">
      <aside className="home__side">
        <div className="home__side-head">
          <img className="home__side-crest" src={crest} alt="" />
          <span className="home__side-title">{hero.eyebrow}</span>
        </div>

        {SECCIONES.map((s) => (
          <button
            key={s.route}
            type="button"
            className="home__side-item"
            onClick={() => {
              play('nav-click')
              onNavegar(s.route)
            }}
            {...sound}
          >
            <Icon name={s.icono} size={20} />
            <span>{s.label}</span>
          </button>
        ))}

        <button
          type="button"
          className="home__side-item home__side-item--play"
          onClick={() => {
            play('nav-click')
            onNavegar('jugar')
          }}
          {...sound}
        >
          <span className="home__side-bullet" aria-hidden="true" />
          JUGAR
        </button>
      </aside>

      <div className="home__main">
        <div className="home__tabs">
          {PESTANAS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={pestana === t.id}
              className="home__tab"
              onClick={() => setPestana(t.id)}
              {...sound}
            >
              <Icon name={t.icono} size={16} />
              {t.label}
            </button>
          ))}

          <span className="spacer" />

          <span className="home__tab-note">
            <Icon name="help" size={16} />
            <Icon name="mute" size={16} />
          </span>
        </div>

        <section className="home__stage">
          <div
            className="home__art"
            style={{ backgroundImage: `url(${fondo})` }}
            role="img"
            aria-label={`Arte de ${hero.champFavorito}, campeon favorito`}
          />
          <div className="home__scrim" />

          <div className="home__copy">
            <p className="hero__eyebrow">{hero.eyebrow}</p>
            <h1 className="hero__title">{hero.titulo}</h1>
            <p className="hero__region">Valladolid · España</p>
            <p className="hero__subtitle">{hero.subtitulo}</p>
            <p className="hero__text">{hero.descripcion}</p>

            {modoActual && (
              <p className="home__modo">
                <Icon name="check" size={14} />
                Modo confirmado: {modoActual.titulo}. Elegí tu campeón en la colección.
              </p>
            )}

            <div className="hero__actions">
              <GoldButton
                variant="play"
                size="lg"
                onClick={() => {
                  play('nav-click')
                  onNavegar('jugar')
                }}
              >
                {hero.ctaPrimario}
              </GoldButton>
              <GoldButton
                variant="ghost"
                size="lg"
                onClick={() => {
                  play('nav-click')
                  onNavegar('coleccion')
                }}
              >
                {hero.ctaSecundario}
              </GoldButton>
            </div>

            <div className="hero__facts">
              <div>
                <span className="hero__fact-value">{perfil.maestria}</span>
                <span className="hero__fact-label">Puntos de maestría</span>
              </div>
              <div>
                <span className="hero__fact-value">{proyectos.length}</span>
                <span className="hero__fact-label">Proyectos</span>
              </div>
              <div>
                <span className="hero__fact-value">{perfil.meses}</span>
                <span className="hero__fact-label">Meses programando</span>
              </div>
              <div>
                <span className="hero__fact-value">{hitos.length}</span>
                <span className="hero__fact-label">Hitos</span>
              </div>
            </div>
          </div>

          <aside className="home__display">
            <p className="home__guion">{vista.guion}</p>
            <h2 className="home__display-title">{vista.titulo}</h2>
            <p className="home__display-claim">{vista.claim}</p>

            <ul className="home__thumbs">{vista.thumbs}</ul>

            <button type="button" className="home__cost" onClick={vista.accion} aria-label={vista.etiqueta}>
              {vista.coste}
            </button>
          </aside>
        </section>
      </div>
    </div>
  )
}