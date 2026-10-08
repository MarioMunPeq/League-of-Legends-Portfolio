import { useMemo, useState } from 'react'
import { SearchField, SelectField } from '../ui/Fields'
import { SkillLogo } from '../ui/SkillLogo'
import { asset } from '../../data/assets'
import { useButtonSound } from '../../hooks/useAudio'
import type { Material } from '../../data/types'
import './screens.css'

type Orden = 'destacados' | 'nombre'

const ORDEN_LABEL: Record<Orden, string> = {
  destacados: 'Destacados primero',
  nombre: 'Alfabético',
}

/** Cuantos logos se Teachnan en la previsualizacion de una ficha de grupo. */
const MIRA = 12

/**
 * Orden de los grupos. No es el alfabetico: los Lenguajes abren, porque son lo
 * primero que se lee de alguien que programa.
 */
const ORDEN_GRUPOS = ['Lenguajes', 'Herramientas y calidad']

type Grupo = {
  nombre: string
  lista: Material[]
}

type Props = {
  materiales: Material[]
  /** grupo con el que se abre la pantalla: #/artesania/Lenguajes */
  grupoInicial?: string
}

/**
 * Artesania -> Loot.
 *
 * La pantalla se abre con las fichas de los grupos, como la de botin del
 * cliente: primero eliges MATERIALES, CAMPEONES, ASPECTOS... y luego ves lo que
 * hay dentro. Aqui los grupos son dos, Lenguajes y Herramientas y calidad.
 *
 * Ni barras de nivel ni notas: un 92 de Git es un numero que no significa nada.
 * Lo que prueba cada material es su logo de marca y su descripcion.
 */
export function Artesania({ materiales, grupoInicial }: Props) {
  const [query, setQuery] = useState('')
  const [orden, setOrden] = useState<Orden>('destacados')
  /** grupo abierto, o null cuando se esta en la rejilla de grupos */
  const [grupo, setGrupo] = useState<string | null>(grupoInicial ?? null)
  const sound = useButtonSound('grid')

  const grupos = useMemo<Grupo[]>(() => {
    const porNombre = new Map<string, Material[]>()
    for (const m of materiales) {
      const lista = porNombre.get(m.categoria) ?? []
      lista.push(m)
      porNombre.set(m.categoria, lista)
    }
    return [...porNombre.entries()]
      .map(([nombre, lista]) => ({ nombre, lista }))
      .sort((a, b) => {
        const ia = ORDEN_GRUPOS.indexOf(a.nombre)
        const ib = ORDEN_GRUPOS.indexOf(b.nombre)
        if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
        return a.nombre.localeCompare(b.nombre, 'es')
      })
  }, [materiales])

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase()
    let lista = materiales.filter((m) => {
      if (grupo && m.categoria !== grupo) return false
      if (q && !`${m.nombre} ${m.descripcion}`.toLowerCase().includes(q)) return false
      return true
    })

    lista = [...lista]
    if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
    else lista.sort((a, b) => Number(!!b.destacado) - Number(!!a.destacado) || a.nombre.localeCompare(b.nombre, 'es'))
    return lista
  }, [materiales, query, orden, grupo])

  return (
    <div className="artesania">
      {/*
       * Cabecera del cliente: franja oscura con el icono de la bandeja de botin
       * y, al lado, los rotulos de seccion. En la captura el titulo va en
       * mayusculas y el activo en blanco sobre un pano claro.
       */}
      <header className="artesania__head">
        <h1 className="artesania__title">
          <img className="artesania__mark" src={asset('assets/ui/loot/tray-loot.svg')} alt="" />
          ARTESANÍA
        </h1>

        <nav className="artesania__tabs" aria-label="Grupos de materiales">
          <button
            type="button"
            className="artesania__tab"
            aria-current={grupo === null}
            onClick={() => setGrupo(null)}
            {...sound}
          >
            GRUPOS
          </button>
          {grupos.map((g) => (
            <button
              key={g.nombre}
              type="button"
              className="artesania__tab"
              aria-current={grupo === g.nombre}
              onClick={() => setGrupo(g.nombre)}
              {...sound}
            >
              {g.nombre.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <div className="artesania__body">
        {/* ---- vista de grupos: las fichas grandes, como las del botin ---- */}
        {grupo === null ? (
          <>
            <div className="artesania__lead">
              <h2>Qué llevo en la mochila</h2>
              <p>
                {materiales.length} materiales y herramientas con los que trabajo. Cada grupo
                abre su listado; dentro está el logo de la marca y para qué la uso.
              </p>
            </div>

            <div className="categoria-grid">
              {grupos.map((g) => (
                <button
                  key={g.nombre}
                  type="button"
                  className="categoria"
                  onClick={() => setGrupo(g.nombre)}
                  {...sound}
                >
                  <span className="categoria__logos" aria-hidden="true">
                    {g.lista.slice(0, MIRA).map((m) => (
                      <SkillLogo key={m.id} material={m} size={22} />
                    ))}
                    {g.lista.length > MIRA && (
                      <span className="categoria__mas">+{g.lista.length - MIRA}</span>
                    )}
                  </span>

                  <span className="categoria__foot">
                    <span className="categoria__name">{g.nombre}</span>
                    <span className="categoria__count">{g.lista.length}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* ---- vista de detalle: los materiales del grupo ---- */
          <>
            <div className="artesania__toolbar">
              <button
                type="button"
                className="artesania__back"
                onClick={() => setGrupo(null)}
                {...sound}
              >
                <span aria-hidden="true">‹</span> GRUPOS
              </button>

              <SearchField
                label={`Buscar en ${grupo}`}
                placeholder="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="artesania__search"
              />

              <SelectField
                label="Ordenar materiales"
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className="artesania__sort"
              >
                {Object.entries(ORDEN_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectField>
            </div>

            <div className="section-title">
              <h2>{grupo.toUpperCase()}</h2>
              <span>
                {visibles.length} de {materiales.filter((m) => m.categoria === grupo).length}
              </span>
            </div>

            <div className="material-grid">
              {visibles.map((m) => (
                <article
                  key={m.id}
                  className={`material ${m.destacado ? 'material--destacado' : ''}`}
                  {...sound}
                >
                  <span className="material__logo">
                    <SkillLogo material={m} size={30} />
                  </span>
                  <div className="material__body">
                    <h3 className="material__name">{m.nombre}</h3>
                    <p className="material__desc">{m.descripcion}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
