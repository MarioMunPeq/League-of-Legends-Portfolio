import { useMemo, useState } from 'react'
import { asset, champSquare } from '../../data/assets'
import { SearchField, SelectField } from '../ui/Fields'
import { TabStrip } from '../ui/TabStrip'
import { Icon } from '../ui/Icon'
import { modoPorId } from '../../data/modos'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
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
  /** modo confirmado en la pantalla Jugar, mostrado como contexto */
  modo: string | null
  onAbrir: (proyecto: Proyecto) => void
  onLimpiarModo: () => void
}

/** Coleccion -> Campeones: cada proyecto es un campeon de la coleccion. */
export function Coleccion({ proyectos, mastery, modo, onAbrir, onLimpiarModo }: Props) {
  const { play } = useAudio()
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<Orden>('orden')
  const [categoria, setCategoria] = useState<'todas' | 'favoritos' | 'en-curso'>('todas')
  const [soloDestacados, setSoloDestacados] = useState(false)
  const sound = useButtonSound('grid')

  const modoActual = modoPorId(modo)

  const etiquetas = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of proyectos)
      for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'))
  }, [proyectos])

  const [etiquetaActiva, setEtiquetaActiva] = useState<string | null>(null)

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = proyectos.filter((p) => {
      if (soloDestacados && (mastery[p.id] ?? 0) < 8) return false
      if (etiquetaActiva && !p.tags.includes(etiquetaActiva)) return false
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
    if (orden === 'mastery') sorted.sort((a, b) => (mastery[b.id] ?? 0) - (mastery[a.id] ?? 0))
    return sorted
  }, [proyectos, query, orden, categoria, mastery, soloDestacados, etiquetaActiva])

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
          <aside className="coleccion__side">
            <div className="framed-stat">
              <span className="framed-stat__value">{totalMaestria}</span>
              <span className="framed-stat__label">Nivel de maestría total</span>
            </div>
            <div className="framed-stat">
              <span className="framed-stat__value">{totalMaestria * 37}</span>
              <span className="framed-stat__label">Cifras de partida</span>
            </div>

            <SearchField
              label="Buscar proyectos"
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="coleccion__search"
            />

            <label className="coleccion__check">
              <input
                type="checkbox"
                checked={soloDestacados}
                onChange={(e) => setSoloDestacados(e.target.checked)}
                {...sound}
              />
              Mostrar solo destacados
            </label>

            <SelectField
              label="Ordenar por"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className="coleccion__select"
            >
              {Object.entries(ORDEN_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Etiqueta"
              className="coleccion__select"
              value={etiquetaActiva ?? ''}
              onChange={(e) => setEtiquetaActiva(e.target.value || null)}
            >
              <option value="">Todas las etiquetas</option>
              {etiquetas.map(([t]) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectField>
          </aside>

          <div>
            {modoActual && (
              <p className="coleccion__modo">
                <Icon name="check" size={14} />
                Partida confirmada en {modoActual.titulo}: elige tu campeón.
                <button
                  type="button"
                  className="coleccion__modo-clear"
                  onClick={() => {
                    play('grid-click')
                    onLimpiarModo()
                  }}
                  {...sound}
                >
                  Quitar
                </button>
              </p>
            )}

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
                  onClick={() => {
                    setQuery('')
                    setEtiquetaActiva(null)
                    setSoloDestacados(false)
                  }}
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
                    title={proyecto.claim}
                    onClick={() => onAbrir(proyecto)}
                    {...sound}
                  >
                    <span className="champ-card__art">
                      <img
                        src={champSquare(proyecto.campeon)}
                        alt={proyecto.campeon}
                        loading="lazy"
                      />
                      <span className="champ-card__foot">
                        <img
                          className="champ-card__mastery"
                          src={asset('assets/mastery/mastery-mark.png')}
                          alt=""
                        />
                        <span className="champ-card__level">
                          <img src={asset('assets/mastery/icon-mark-of-mastery.png')} alt="" />
                          {mastery[proyecto.id] ?? 0}
                        </span>
                      </span>
                      <span
                        className={`champ-card__estado ${estadoClass(proyecto.estado)}`}
                        title={proyecto.estado}
                      />
                    </span>
                    <span className="champ-card__name">{proyecto.titulo}</span>
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