import { useMemo, useState, type ReactNode } from 'react'
import { champSquare, champSplash } from '../../data/assets'
import { asset } from '../../data/assets'
import { Icon, type IconName } from '../ui/Icon'
import { MaterialIcon, type MaterialIconName } from '../ui/MaterialIcon'
import { modoPorId } from '../../data/modos'
import type { PortfolioData, Proyecto } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import './screens.css'

/**
 * El raíl lateral se queda solo con INICIO. Antes repetía el menú completo,
 * que ya está en la barra superior: era informacion duplicada y ademas lo que
 * el cliente pone ahí son entradas de contenido, no secciones de navegación.
 */
const SECCIONES: { route: Route; label: string; icono: IconName }[] = [
  { route: 'inicio', label: 'INICIO', icono: 'store' },
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
 * Inicio: la pantalla de bienvenida. El texto explica que es un portfolio
 * hecho con la interfaz de LoL y donde esta cada cosa; los datos sobre la
 * persona viven en Perfil, asi que aqui no se repiten. El_raíl, las pestanas
 * de contenido, el arte a sangre y el boton dorado son del cliente.
 */
export function Inicio({ data, onNavegar, onAbrir, modo }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('grid')
  const { hero, perfil, proyectos, hitos, materiales } = data
  const [pestana, setPestana] = useState<Pestana>('coleccion')

  // el arte del fondo va aparte del campeon que da nombre a la coleccion
  const fondo = useMemo(() => champSplash(hero.fondoInicio ?? hero.champFavorito), [hero])
  const modoActual = modoPorId(modo ?? null)

  /*
   * Los tres materiales que se enseñan en el inicio. Sin nivel ya no hay en que
   * ordenar, asi que mandan los destacados y, a igualdad, el orden alfabetico.
   */
  const topMateriales = useMemo(
    () =>
      [...materiales]
        .sort(
          (a, b) =>
            Number(!!b.destacado) - Number(!!a.destacado) ||
            a.nombre.localeCompare(b.nombre, 'es'),
        )
        .slice(0, 3),
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
        {SECCIONES.map((s) => (
          <button
            key={s.route}
            type="button"
            className="home__side-item home__side-item--on"
            aria-current="page"
            onClick={() => {
              play('nav-click')
              onNavegar(s.route)
            }}
            {...sound}
          >
            <Icon name={s.icono} size={18} />
            <span>{s.label}</span>
          </button>
        ))}
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
            aria-label={`Arte de ${hero.fondoInicio ?? hero.champFavorito} como fondo del inicio`}
          />
          <div className="home__scrim" />

          <div className="home__copy">
            <p className="hero__eyebrow">{hero.eyebrow}</p>
            <h1 className="hero__title">{hero.titulo}</h1>
            <p className="hero__subtitle">{hero.subtitulo}</p>
            <p className="hero__text">{hero.descripcion}</p>

            {modoActual && (
              <p className="home__modo">
                <Icon name="check" size={14} />
                Modo confirmado: {modoActual.titulo}. Elegí tu campeón en la colección.
              </p>
            )}

            {/*
              Sin botones: Inicio es el mapa del portfolio, no una landing con
              llamada a la accion. La navegacion se hace desde las pestanas de
              arriba, el_raíl o la barra superior.
            */}
            <p className="hero__pista">
              <Icon name="caret" size={14} />
              Todo lo que hay aquí se abre desde las pestañas de arriba.
            </p>
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