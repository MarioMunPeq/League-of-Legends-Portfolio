import { useEffect, useRef, useState } from 'react'
import { champPassive, champSpell, champSplash } from '../../data/assets'
import { GoldButton } from '../ui/GoldButton'
import { Icon } from '../ui/Icon'
import type { Proyecto } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import { getChamp } from '../../data/champs.generated'
import './screens.css'

type Props = {
  proyecto: Proyecto | undefined
  onVolver: () => void
  onNavegar: (route: Route) => void
}

/** Detalle de un proyecto, presentado como la pantalla de perfil de campeon. */
export function DetalleProyecto({ proyecto, onVolver, onNavegar }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    ref.current?.focus()
    window.scrollTo({ top: 0 })
  }, [proyecto?.id])

  useEffect(() => {
    if (!copiado) return
    const t = setTimeout(() => setCopiado(false), 1800)
    return () => clearTimeout(t)
  }, [copiado])

  if (!proyecto) {
    return (
      <section className="screen screen--center">
        <p className="label">Proyecto no encontrado</p>
        <h2>Elegí un campeón</h2>
        <p className="muted">Ese proyecto no está en la colección.</p>
        <GoldButton onClick={onVolver}>VOLVER A CAMPEONES</GoldButton>
      </section>
    )
  }

  const champ = getChamp(proyecto.campeon)
  const splash = champSplash(proyecto.campeon)

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiado(true)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <article className="detalle" ref={ref} tabIndex={-1}>
      <div className="detalle__hero" style={{ backgroundImage: `url(${splash})` }}>
        <div className="detalle__hero-fade" />
        <div className="detalle__hero-copy">
          <button type="button" className="link-back" onClick={onVolver}>
            <Icon name="caret" size={14} className="link-back__icon" />
            VOLVER A LA COLECCIÓN
          </button>
          <p className="detalle__rol">{proyecto.rol}</p>
          <h1 className="detalle__titulo">{proyecto.titulo}</h1>
          <p className="detalle__claim">{proyecto.claim}</p>
        </div>
        <span className="detalle__estado" data-estado={proyecto.estado}>
          {proyecto.estado}
        </span>
      </div>

      <div className="detalle__body">
        <div className="detalle__main">
          <section>
            <h2 className="label">Sobre el proyecto</h2>
            <p className="detalle__desc">{proyecto.descripcion}</p>
          </section>

          <section>
            <h2 className="label">Qué hace</h2>
            <ul className="detalle__highlights">
              {proyecto.highlights.map((h) => (
                <li key={h}>
                  <Icon name="check" size={16} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="label">Habilidades</h2>
            <p className="muted">
              Las capacidades del proyecto, con los nombres del campeón para que sirva de guía.
            </p>
            <div className="ability-row">
              <figure className="ability ability--passive">
                <img src={champPassive(champ?.passive.icon ?? "")} alt="" />
                <figcaption>
                  <span className="ability__name">{champ?.passive.name ?? 'Pasiva'}</span>
                  <span className="ability__desc">{champ?.passive.description}</span>
                </figcaption>
              </figure>
              {champ?.spells.map((spell, i) => (
                <figure className="ability" key={spell.name}>
                  <img src={champSpell(spell.icon)} alt="" />
                  <figcaption>
                    <span className="ability__key">{['Q', 'W', 'E', 'R'][i]}</span>
                    <span className="ability__name">{spell.name}</span>
                    <span className="ability__desc">{spell.description}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {champ && (
            <section>
              <h2 className="label">Ficha del campeón</h2>
              <div className="detalle__stats">
                {(
                  [
                    ['Ataque', champ.info.attack],
                    ['Defensa', champ.info.defense],
                    ['Magia', champ.info.magic],
                    ['Dificultad', champ.info.difficulty],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="stat">
                    <span className="stat__label">{label}</span>
                    <span className="stat__bar">
                      <span style={{ width: `${(value / 10) * 100}%` }} />
                    </span>
                    <span className="stat__value">{value}</span>
                  </div>
                ))}
              </div>
              <p className="detalle__blurb">{champ.blurb}</p>
            </section>
          )}
        </div>

        <aside className="detalle__side">
          <div className="panel panel--capped side-block">
            <h3 className="label">Métricas</h3>
            <dl className="metricas">
              {proyecto.metricas.map((m) => (
                <div key={m.etiqueta}>
                  <dt>{m.etiqueta}</dt>
                  <dd>{m.valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="panel panel--capped side-block">
            <h3 className="label">Stack</h3>
            <div className="chips">
              {proyecto.stack.map((s) => (
                <span key={s} className="chip chip--cyan">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="panel panel--capped side-block">
            <h3 className="label">Etiquetas</h3>
            <div className="chips">
              {proyecto.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="panel panel--capped side-block">
            <h3 className="label">Enlaces</h3>
            <div className="stack" style={{ gap: '0.5rem' }}>
              {proyecto.enlaces.map((e) => (
                <a key={e.etiqueta} className="side-link" href={e.url} target="_blank" rel="noreferrer noopener">
                  <span>{e.etiqueta}</span>
                  <Icon name="external" size={14} />
                </a>
              ))}
              <button type="button" className="side-link" onClick={copiarEnlace}>
                <span>{copiado ? 'Enlace copiado' : 'Copiar enlace'}</span>
                <Icon name={copiado ? 'check' : 'cv'} size={14} />
              </button>
            </div>
          </div>

          <div className="panel panel--capped side-block">
            <h3 className="label">Interés</h3>
            <p className="muted">¿Hablamos de este proyecto?</p>
            <GoldButton block onClick={() => onNavegar('perfil')}>
              ESCRIBIRME
            </GoldButton>
          </div>
        </aside>
      </div>
    </article>
  )
}
