import { useMemo, useState } from 'react'
import { asset, champSquare } from '../../data/assets'
import { SearchField, SelectField } from '../ui/Fields'
import { TabStrip } from '../ui/TabStrip'
import { useButtonSound } from '../../hooks/useAudio'
import type { Proyecto } from '../../data/types'
import './screens.css'

type Orden = 'orden' | 'alfabetico' | 'mastery'

const ORDEN_LABEL: Record<Orden, string> = {
  orden: 'Partida',
  alfabetico: 'Alfabético',
  mastery: 'Maestría',
}

type Props = {
  proyectos: Proyecto[]
  /** puntos de maestria por proyecto, para ordenar y filtrar */
  mastery: Record<string, number>
  onAbrir: (proyecto: Proyecto) => void
}

/** Coleccion -> Campeones: cada proyecto es un campeon de la coleccion. */
export function Coleccion({ proyectos, mastery, onAbrir }: Props) {
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<Orden>('orden')
  const [categoria, setCategoria] = useState<'todas' | 'favoritos' | 'en-curso'>('todas')
  const sound = useButtonSound('grid')

  const categorias = useMemo(() => {
    const set = new Set(proyectos.flatMap((p) => p.tags))
    return [...set].sort()
  }, [proyectos])

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = proyectos.filter((p) => {
      if (!q) return true
      return (
        p.titulo.toLowerCase().includes(q) ||
        p.campeon.toLowerCase().includes(q) ||
        p.claim.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    })

    if (categoria === 'favoritos') lista = lista.filter((p) => (mastery[p.id] ?? 0) >= 8)
    if (categoria === 'en-curso') lista = lista.filter((p) => p.estado === 'En curso')

    const sorted = [...lista]
    if (orden === 'orden') sorted.sort((a, b) => a.orden - b.orden)
    if (orden === 'alfabetico') sorted.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
    if (orden === 'mastery')
      sorted.sort((a, b) => (mastery[b.id] ?? 0) - (mastery[a.id] ?? 0))
    return sorted
  }, [proyectos, query, orden, categoria, mastery])

  const totalMaestria = useMemo(
    () => proyectos.reduce((acc, p) => acc + (mastery[p.id] ?? 0), 0),
    [proyectos, mastery],
  )

  const estadoClass = (estado: Proyecto['estado']) =>
    ({
      'En curso': 'champ-card__estado--curso',
      Estable: 'champ-card__estado--estable',
      'En mantenimiento': 'champ-card__estado--mantenimiento',
      Archivado: 'champ-card__estado--archivado',
    })[estado]

  return (
    <>
      <div className="subnav">
        <TabStrip
          ariaLabel="Secciones de la coleccion"
          active={categoria}
          onChange={(id) => setCategoria(id as typeof categoria)}
          tabs={[
            { id: 'todas', label: 'CAMPEONES', badge: String(proyectos.length) },
            { id: 'favoritos', label: 'PREFERIDOS' },
            { id: 'en-curso', label: 'EN CURSO' },
          ]}
        />
      </div>

      <div className="screen">
        <div className="coleccion">
          <aside className="panel panel--capped side-filters">
            <h3>Maestría</h3>
            <div className="meter">
              <div className="meter__value">{totalMaestria}</div>
              <div className="meter__label">Nivel de maestría total</div>
            </div>
            <div className="meter">
              <div className="meter__value">{totalMaestria * 37}</div>
              <div className="meter__label">Cifras de partida</div>
            </div>

            <h3>Buscar</h3>
            <SearchField
              label="Buscar projects"
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <h3 style={{ marginTop: '1.25rem' }}>Ordenar</h3>
            <SelectField
              label="Ordenar por"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
            >
              {Object.entries(ORDEN_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>

            <h3 style={{ marginTop: '1.25rem' }}>Etiquetas</h3>
            <div className="chips">
              {categorias.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </aside>

          <div>
            <div className="section-title">
              <h2>SUPERIOR</h2>
              <span>
                {visibles.length} de {proyectos.length} proyectos
              </span>
            </div>

            {visibles.length === 0 ? (
              <div className="screen--center" style={{ minHeight: '20rem' }}>
                <p className="label">Sin resultados</p>
                <h2>Nada coincide con «{query}»</h2>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setQuery('')}
                  {...sound}
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div className="champ-grid">
                {visibles.map((proyecto) => (
                  <button
                    key={proyecto.id}
                    type="button"
                    className="champ-card"
                    onClick={() => onAbrir(proyecto)}
                    {...sound}
                  >
                    <div className="champ-card__art">
                      <img
                        src={champSquare(proyecto.campeon)}
                        alt={proyecto.campeon}
                        loading="lazy"
                      />
                      <img
                        className="champ-card__mastery"
                        src={asset("assets/mastery/mastery-mark.png")}
                        alt=""
                      />
                      <span className="champ-card__level">
                        <IconDot /> {mastery[proyecto.id] ?? 0}
                      </span>
                      <span
                        className={`champ-card__estado ${estadoClass(proyecto.estado)}`}
                        title={proyecto.estado}
                      />
                    </div>
                    <div className="champ-card__body">
                      <span className="champ-card__name">{proyecto.titulo}</span>
                      <span className="champ-card__claim">{proyecto.claim}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function IconDot() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2.5 14 9l6.5 2-6.5 2-2 6.5-2-6.5L3.5 11 10 9l2-6.5Z" />
    </svg>
  )
}
