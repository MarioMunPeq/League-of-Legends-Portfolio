import { useMemo, useState } from 'react'
import { TabStrip } from '../ui/TabStrip'
import { SearchField } from '../ui/Fields'
import { useButtonSound } from '../../hooks/useAudio'
import type { Material } from '../../data/types'
import './screens.css'

type Orden = 'nombre' | 'nivel' | 'categoria'

const ORDEN_LABEL: Record<Orden, string> = {
  nombre: 'Alfabético',
  nivel: 'Por nivel',
  categoria: 'Por categoría',
}

type Props = {
  materiales: Material[]
}

/** Artesania -> Botin: cada tecnologia es un objeto con su icono. */
export function Artesania({ materiales }: Props) {
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<Orden>('nivel')
  const [categoria, setCategoria] = useState<string>('todas')
  const [soloDestacados, setSoloDestacados] = useState(false)
  const sound = useButtonSound('grid')

  const categorias = useMemo(() => {
    const counts = new Map<string, number>()
    for (const m of materiales) counts.set(m.categoria, (counts.get(m.categoria) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], 'es'))
  }, [materiales])

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = materiales.filter((m) => {
      if (q && !`${m.nombre} ${m.categoria} ${m.descripcion}`.toLowerCase().includes(q)) return false
      if (categoria !== 'todas' && m.categoria !== categoria) return false
      if (soloDestacados && !m.destacado) return false
      return true
    })

    lista = [...lista]
    if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    if (orden === 'nivel') lista.sort((a, b) => b.nivel - a.nivel)
    if (orden === 'categoria')
      lista.sort(
        (a, b) => a.categoria.localeCompare(b.categoria, 'es') || a.nombre.localeCompare(b.nombre, 'es'),
      )
    return lista
  }, [materiales, query, orden, categoria, soloDestacados])

  return (
    <>
      <div className="subnav">
        <TabStrip
          ariaLabel="Secciones de artesania"
          active={categoria}
          onChange={setCategoria}
          tabs={[
            { id: 'todas', label: 'MATERIALES', badge: String(materiales.length) },
            ...categorias.map(([cat, n]) => ({ id: cat, label: cat.toUpperCase(), badge: String(n) })),
          ]}
        />
      </div>

      <div className="screen">
        <div className="coleccion">
          <aside className="panel panel--capped side-filters">
            <h3>Inventario</h3>
            <div className="meter">
              <div className="meter__value">{materiales.length}</div>
              <div className="meter__label">Materiales en mochila</div>
            </div>
            <div className="meter">
              <div className="meter__value">{materiales.filter((m) => m.destacado).length}</div>
              <div className="meter__label">Destacados</div>
            </div>

            <h3>Buscar</h3>
            <SearchField
              label="Buscar materiales"
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <h3 style={{ marginTop: '1.25rem' }}>Ordenar</h3>
            <select
              className="input input--plain"
              aria-label="Ordenar materiales"
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              {...sound}
            >
              {Object.entries(ORDEN_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <label
              className="row"
              style={{ gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.8125rem', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={soloDestacados}
                onChange={(e) => setSoloDestacados(e.target.checked)}
              />
              Solo destacados
            </label>
          </aside>

          <div>
            <div className="section-title">
              <h2>MATERIALES</h2>
              <span>
                {visibles.length} de {materiales.length}
              </span>
            </div>

            <div className="material-grid">
              {visibles.map((m) => (
                <article
                  key={m.id}
                  className={`material ${m.destacado ? 'material--destacado' : ''}`}
                  {...sound}
                >
                  <img className="material__icon" src={m.icono} alt="" loading="lazy" />
                  <div style={{ minWidth: 0 }}>
                    <span className="material__cat">{m.categoria}</span>
                    <h3 className="material__name">{m.nombre}</h3>
                    <p className="material__desc">{m.descripcion}</p>
                    <div className="material__level">
                      <span className="material__level-bar">
                        <span className="material__level-fill" style={{ width: `${m.nivel}%` }} />
                      </span>
                      <span className="material__level-num">{m.nivel}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
