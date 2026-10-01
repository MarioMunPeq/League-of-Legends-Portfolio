import { useMemo, useState } from 'react'
import { asset, champSpell, champSquare } from '../../data/assets'
import { GoldButton } from '../ui/GoldButton'
import { SearchField } from '../ui/Fields'
import { Icon } from '../ui/Icon'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import type { Proyecto } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import './screens.css'

/** El equipo de la partida: los cuatro aliados con su rol asignado. */
const ALIADOS = [
  { rol: 'Inferior', nombre: 'MISS FORTUNE', iconoPosicion: asset("assets/ui/roles/position-bottom.svg") },
  { rol: 'Jungla', nombre: 'LEE SIN', iconoPosicion: asset("assets/ui/roles/position-jungle.svg") },
  { rol: 'Superior', nombre: 'NASUS', iconoPosicion: asset("assets/ui/roles/position-top.svg") },
  { rol: 'Apoyo', nombre: 'ZYRA', iconoPosicion: asset("assets/ui/roles/position-utility.svg") },
]

/** Dos ramas del arbol de estilos, como en la ficha del jugador. */
const RUNAS = [
  asset("assets/perks/trees/7200_domination.png"),
  asset("assets/perks/trees/7204_resolve.png"),
]

const INVOCADORES = ['SummonerFlash', 'SummonerDot']

const ORDENES = ['Favoritos', 'Más recientes', 'Alfabético'] as const

type Props = {
  proyectos: Proyecto[]
  /** campeones descargados que todavia no son proyecto: aparecen bloqueados */
  restantes: string[]
  onAbrir: (proyecto: Proyecto) => void
  onNavegar: (route: Route) => void
}

/** Seleccion de campeon: elegir un proyecto abre su ficha. */
export function Seleccion({ proyectos, restantes, onAbrir, onNavegar }: Props) {
  const { play } = useAudio()
  const [query, setQuery] = useState('')
  const [elegido, setElegido] = useState<string | null>(null)
  const sound = useButtonSound('grid')

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()
    const coincide = (nombre: string, proyecto?: Proyecto) =>
      !q ||
      nombre.toLowerCase().includes(q) ||
      (proyecto
        ? proyecto.titulo.toLowerCase().includes(q) ||
          proyecto.rol.toLowerCase().includes(q) ||
          proyecto.tags.some((t) => t.toLowerCase().includes(q))
        : false)

    return [
      ...proyectos.filter((p) => coincide(p.campeon, p)).map((p) => ({ champ: p.campeon, proyecto: p })),
      ...restantes.filter((c) => coincide(c)).map((c) => ({ champ: c, proyecto: undefined })),
    ]
  }, [proyectos, restantes, query])

  const proyectoElegido = proyectos.find((p) => p.id === elegido)

  const confirmar = () => {
    if (proyectoElegido) {
      play('click')
      onAbrir(proyectoElegido)
    }
  }

  return (
    <div className="seleccion">
      <aside className="seleccion__equipo">
        <div className="ally ally--self">
          <span className="ally__slot">
            {RUNAS.map((r) => (
              <img key={r} className="ally__rune" src={r} alt="" />
            ))}
          </span>
          <span className={`ally__portrait ${proyectoElegido ? '' : 'ally__portrait--empty'}`}>
            {proyectoElegido ? (
              <img src={champSquare(proyectoElegido.campeon)} alt="" />
            ) : (
              '?'
            )}
          </span>
          <span className="ally__text">
            <span className="ally__role">Eligiendo</span>
            <span className="ally__name">{proyectoElegido?.titulo ?? 'Sin elegir'}</span>
          </span>
        </div>

        {ALIADOS.map((a) => (
          <div key={a.nombre} className="ally">
            <span className="ally__slot">
              <img className="ally__rune" src={a.iconoPosicion} alt="" />
              <img className="ally__rune" src={asset("assets/ui/roles/blue-role-swapping-icon.svg")} alt="" />
            </span>
            <span className="ally__portrait ally__portrait--empty">+</span>
            <span className="ally__text">
              <span className="ally__role">{a.rol}</span>
              <span className="ally__name">{a.nombre}</span>
            </span>
          </div>
        ))}
      </aside>

      <div className="seleccion__grid-wrap">
        <div className="seleccion__toolbar">
          <SearchField
            label="Buscar proyecto"
            placeholder="Buscar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: '1 1 12rem', maxWidth: '22rem' }}
          />
          <select
            className="input input--plain"
            aria-label="Ordenar por"
            style={{ maxWidth: '12rem' }}
            defaultValue="Favoritos"
            {...sound}
          >
            {ORDENES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="spacer" />
          <GoldButton variant="ghost" size="sm" onClick={() => onNavegar('coleccion')}>
            VER TODOS
          </GoldButton>
        </div>

        <div className="seleccion__grid">
          {visibles.map(({ champ, proyecto }, i) => (
            <button
              key={champ}
              type="button"
              className={`pick ${proyecto ? '' : 'pick--locked'}`}
              aria-pressed={proyecto?.id === elegido}
              disabled={!proyecto}
              aria-label={
                proyecto ? `Elegir ${proyecto.titulo}` : `${champ}: sin proyecto todavia`
              }
              onClick={() => {
                if (!proyecto) return
                setElegido(proyecto.id)
                play('grid-click')
              }}
              {...sound}
            >
              <img
                src={champSquare(champ)}
                alt={champ}
                loading={i > 12 ? 'lazy' : 'eager'}
              />
              {proyecto?.estado === 'En curso' && <span className="pick__tag">6</span>}
            </button>
          ))}
        </div>

        <div className="seleccion__foot">
          {proyectoElegido ? (
            <span className="seleccion__chosen">
              <img
                src={champSquare(proyectoElegido.campeon)}
                alt=""
              />
              <span className="seleccion__chosen-name">{proyectoElegido.titulo}</span>
            </span>
          ) : (
            <span className="muted">Elegí un campeón para ver su proyecto</span>
          )}

          <span className="spacer" />

          <span className="row" style={{ gap: '0.5rem' }}>
            {INVOCADORES.map((s) => (
              <img
                key={s}
                src={champSpell(`${s}.png`)}
                alt={s}
                style={{ width: '2rem', height: '2rem' }}
              />
            ))}
          </span>

          <GoldButton variant="gold" onClick={confirmar} disabled={!proyectoElegido}>
            FIJAR
          </GoldButton>
          <GoldButton variant="ghost" onClick={() => onNavegar('lobby')}>
            <Icon name="chat" size={16} />
            SALIR
          </GoldButton>
        </div>
      </div>
    </div>
  )
}
