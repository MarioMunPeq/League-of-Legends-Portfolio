import { useMemo, useState } from 'react'
import { TabStrip } from '../ui/TabStrip'
import { SearchField, SelectField } from '../ui/Fields'
import { MaterialIcon } from '../ui/MaterialIcon'
import type { MaterialIconName } from '../ui/MaterialIcon'
import { asset } from '../../data/assets'
import { useButtonSound } from '../../hooks/useAudio'
import type { Material } from '../../data/types'
import './screens.css'

type Orden = 'nombre' | 'nivel' | 'categoria'

const ORDEN_LABEL: Record<Orden, string> = {
  nombre: 'Alfabético',
  nivel: 'Por nivel',
  categoria: 'Por categoría',
}

/**
 * Icono de cabecera de categoria. Son los mismos archivos que usa la pantalla
 * de artesanado del cliente (`assets/category_icons`), que en su lista de la
 * izquierda aparecen junto a MATERIALES, CAMPEONES, ASPECTOS, EFIGIES y
 * EMOTICONOS.
 */
const CATEGORIA_ICONO: Record<string, string> = {
  Lenguajes: 'category-all.png',
  Interfaces: 'category-champion.png',
  Datos: 'category-chest.png',
  Plataformas: 'category-companion.png',
  'IA y datos': 'category-eternals.png',
  Calidad: 'category-skin.png',
}

/**
 * Carril de categorias de la izquierda, con la misma forma que el del cliente:
 * una tira vertical de iconos, el activo marcado con una barra de oro. Los
 * iconos de las seis primeras categorias son los del propio cliente; los dos
 * ultimos (reordenar y ayuda) son glifos de interfaz.
 */
const CARRIL: { id: string; label: string; icono?: string }[] = [
  { id: 'todas', label: 'Todo', icono: 'category-all.png' },
  { id: 'Lenguajes', label: 'Lenguajes', icono: 'category-champion.png' },
  { id: 'Interfaces', label: 'Interfaces', icono: 'category-chest.png' },
  { id: 'Datos', label: 'Datos', icono: 'category-companion.png' },
  { id: 'IA y datos', label: 'IA y datos', icono: 'category-eternals.png' },
  { id: 'Calidad', label: 'Calidad', icono: 'category-skin.png' },
]

type Props = {
  materiales: Material[]
}

/** Artesania -> Botin: cada tecnologia es un objeto de la mochila. */
export function Artesania({ materiales }: Props) {
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<Orden>('nivel')
  const [categoria, setCategoria] = useState<string>('todas')
  const [soloDestacados, setSoloDestacados] = useState(false)
  const sound = useButtonSound('grid')

  const categorias = useMemo(() => {
    const counts = new Map<string, Material[]>()
    for (const m of materiales) {
      const lista = counts.get(m.categoria) ?? []
      lista.push(m)
      counts.set(m.categoria, lista)
    }
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

  const destacados = materiales.filter((m) => m.destacado).length
  const mediaNivel = Math.round(
    materiales.reduce((acc, m) => acc + m.nivel, 0) / (materiales.length || 1),
  )

  return (
    <>
      <div className="subnav">
        <TabStrip
          ariaLabel="Secciones de artesania"
          active={categoria}
          onChange={setCategoria}
          tabs={[
            { id: 'todas', label: 'MATERIALES', badge: String(materiales.length) },
            ...categorias.map(([cat, lista]) => ({ id: cat, label: cat.toUpperCase(), badge: String(lista.length) })),
          ]}
        />
      </div>

      <div className="screen screen--rail">
        <nav className="rail" aria-label="Categorias de artesania">
          {CARRIL.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`rail__item ${categoria === c.id ? 'rail__item--on' : ''}`}
              title={c.label}
              aria-label={c.label}
              aria-pressed={categoria === c.id}
              onClick={() => setCategoria(categoria === c.id ? 'todas' : c.id)}
              {...sound}
            >
              <img src={asset(`assets/ui/loot/${c.icono}`)} alt="" />
            </button>
          ))}
          <span className="rail__spacer" />
          <button
            type="button"
            className="rail__item"
            title="Ayuda"
            aria-label="Ayuda"
            {...sound}
          >
            <span className="rail__help">?</span>
          </button>
        </nav>

        <div className="coleccion">
          <aside className="arsenal">
            <div className="arsenal__stats">
              <div className="framed-stat">
                <span className="framed-stat__value">{materiales.length}</span>
                <span className="framed-stat__label">Materiales en mochila</span>
              </div>
              <div className="framed-stat framed-stat--split">
                <span className="framed-stat__value">{destacados}</span>
                <span className="framed-stat__label">Destacados</span>
                <span className="framed-stat__rule" aria-hidden="true" />
                <span className="framed-stat__value">{mediaNivel}</span>
                <span className="framed-stat__label">Nivel medio</span>
              </div>
            </div>

            <label className="arsenal__check">
              <input
                type="checkbox"
                checked={soloDestacados}
                onChange={(e) => setSoloDestacados(e.target.checked)}
                {...sound}
              />
              Solo destacados
            </label>

            {categorias.map(([cat, lista]) => (
              <section key={cat} className="arsenal__group">
                <h3>
                  <img
                    className="arsenal__cat-icon"
                    src={asset(`assets/ui/loot/${CATEGORIA_ICONO[cat] ?? 'category-all.png'}`)}
                    alt=""
                  />
                  {cat}
                </h3>
                <ul className="arsenal__items">
                  <li>
                    <button
                      type="button"
                      className={`arsenal__item arsenal__item--all ${categoria === 'todas' ? 'is-on' : ''}`}
                      aria-pressed={categoria === 'todas'}
                      aria-label="Ver todos los materiales"
                      onClick={() => setCategoria('todas')}
                      {...sound}
                    >
                      <MaterialIcon name="vite" categoria={cat} size={44} />
                    </button>
                  </li>
                  {lista.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        className={`arsenal__item ${categoria === cat ? 'is-on' : ''}`}
                        aria-pressed={categoria === cat}
                        aria-label={`Ver ${m.nombre}`}
                        title={m.nombre}
                        onClick={() => setCategoria(categoria === cat ? 'todas' : cat)}
                        {...sound}
                      >
                        <MaterialIcon
                          name={m.id as MaterialIconName}
                          categoria={m.categoria}
                          size={44}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </aside>

          <div>
            <div className="arsenal__toolbar">
              <SearchField
                label="Buscar materiales"
                placeholder="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="arsenal__search"
              />
              <SelectField
                label="Ordenar materiales"
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className="arsenal__sort"
              >
                {Object.entries(ORDEN_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="section-title">
              <h2>{categoria === 'todas' ? 'MATERIALES' : categoria.toUpperCase()}</h2>
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
                  <MaterialIcon name={m.id as MaterialIconName} categoria={m.categoria} />
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