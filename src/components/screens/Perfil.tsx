import { useMemo, useRef, useState } from 'react'
import { asset, champSplash } from '../../data/assets'
import { crestPath, rankLabel } from '../../data/ranks'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/Icon'
import { FormularioContacto } from '../ui/FormularioContacto'
import { useButtonSound } from '../../hooks/useAudio'
import type { PortfolioData } from '../../data/types'
import './screens.css'

const HITO_ICONS = ['crown', 'spark', 'shield', 'play'] as const satisfies readonly IconName[]

/** Las cinco pestañas de la ficha del cliente, con su seccion de destino. */
const SECCIONES: { id: string; label: string }[] = [
  { id: 'sobre-mi', label: 'SOBRE MÍ' },
  { id: 'hitos', label: 'HITOS' },
  { id: 'experiencia', label: 'EXPERIENCIA' },
  { id: 'formacion', label: 'FORMACIÓN' },
  { id: 'contacto', label: 'CONTACTO' },
]

type Props = {
  data: PortfolioData
}

/** Perfil: la ficha del jugador. Arriba el arte con las cinco cifras, a la izquierda el panel de identidad y a la derecha el contenido. */
export function Perfil({ data }: Props) {
  const { perfil, sobreMi, formacion, experiencia, hitos, hero, enlaces, contacto } = data
  const rangoTexto = `${rankLabel(perfil.rango)} ${perfil.division}`.trim()
  const portada = hero.portada ?? hero.champFavorito

  const mainRef = useRef<HTMLDivElement>(null)
  const [activa, setActiva] = useState(() => SECCIONES[0]?.id ?? 'sobre-mi')
  const sound = useButtonSound('grid')

  const crest = useMemo(() => crestPath(perfil.rango), [perfil.rango])

  /* Las cifras de la cabecera, con el emblema de cada una debajo. */
  const cifras = [
    { etiqueta: '5V5 FLEXIBLE', valor: rangoTexto, emblema: crest, svg: true },
    {
      etiqueta: 'HONOR',
      valor: `NIVEL ${perfil.nivel}`,
      emblema: asset('assets/ui/honor/heart-miniicon.png'),
      svg: false,
    },
    {
      etiqueta: 'PUNTUACIÓN DE MAESTRÍA',
      valor: String(perfil.maestria),
      emblema: asset('assets/mastery/mastery-mark.png'),
      svg: false,
    },
    {
      etiqueta: 'TROFEO',
      valor: 'SIN LOGRO',
      emblema: asset('assets/ranked/frame/ranked-emblem.png'),
      svg: false,
      apagado: true,
    },
    {
      etiqueta: 'ESTANDARTE MUNDIAL',
      valor: 'SIN LOGRO',
      emblema: asset('assets/ranked/frame/member-banner.png'),
      svg: false,
      apagado: true,
    },
  ]

  const irA = (id: string) => {
    setActiva(id)
    mainRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="perfil__hero">
        <img
          className="perfil__banner"
          src={champSplash(portada)}
          alt={`Arte de ${portada} como fondo de la ficha`}
        />
        <div className="perfil__banner-fade" />

        <div className="perfil__tabs">
          {SECCIONES.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activa === s.id}
              className="tab"
              onClick={() => irA(s.id)}
              {...sound}
            >
              {s.label}
            </button>
          ))}
          <span className="spacer" />
          <span className="perfil__lookup">
            <span className="perfil__lookup-name">{perfil.summoner}</span>
            <span className="perfil__lookup-tag">#ESPAÑA</span>
          </span>
        </div>

        <div className="perfil__cifras">
          {cifras.map((c) => (
            <div key={c.etiqueta} className={`cifra ${c.apagado ? 'cifra--apagada' : ''}`}>
              <span className="cifra__etiqueta">{c.etiqueta}</span>
              <span className="cifra__valor">{c.valor}</span>
              {c.svg ? (
                <img className="cifra__emblema cifra__emblema--crest" src={c.emblema} alt="" />
              ) : (
                <img className="cifra__emblema" src={c.emblema} alt="" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="perfil__layout">
        <aside className="panel panel--capped perfil__card">
          {/* El nivel va en su placa hexagonal, arriba del retrato. */}
          <span className="perfil__levelchip">{perfil.nivel}</span>

          {/* Marco real del cliente, con la insignia dentro del aro. */}
          <div className="perfil__emblem">
            <img className="perfil__emblem-crest" src={crest} alt={`Insignia de ${rangoTexto}`} />
            <img
              className="perfil__emblem-frame"
              src={asset('assets/ui/level-ring/theme-1-solid-border.png')}
              alt=""
            />
          </div>

          <h1 className="perfil__name">{perfil.nombre}</h1>
          <p className="perfil__riotid-plain">{perfil.summoner}</p>

          <p className="perfil__lema">Mente maestra</p>

          <div className="perfil__circles" aria-hidden="true">
            <img src={asset('assets/perks/trees/7200_domination.png')} alt="" />
            <img src={asset('assets/perks/trees/7204_resolve.png')} alt="" />
            <img src={asset('assets/perks/runes/firststrike.png')} alt="" />
          </div>

          <p className="perfil__title-line">{hero.eyebrow}</p>

          <div className="chips" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
            <span className="chip chip--gold">Nivel {perfil.nivel}</span>
            <span className="chip chip--cyan">Maestría {perfil.maestria}</span>
          </div>
        </aside>

        <div className="perfil__main" ref={mainRef}>
          <section className="perfil__section perfil__about" id="sobre-mi">
            <div className="section-title">
              <h2>SOBRE MÍ</h2>
              <span>quién está detrás de la cuenta</span>
            </div>
            {sobreMi.map((parrafo) => (
              <p key={parrafo.slice(0, 24)}>{parrafo}</p>
            ))}
          </section>

          <section className="perfil__section" id="hitos">
            <div className="section-title">
              <h2>HITOS</h2>
              <span>números de la cuenta, traducidos</span>
            </div>
            <div className="hitos">
              {hitos.map((hito, i) => (
                <article key={hito.etiqueta} className="hito">
                  <span className="hito__icon">
                    <Icon name={HITO_ICONS[i % HITO_ICONS.length] ?? 'spark'} size={28} />
                  </span>
                  <span className="hito__value">{hito.valor}</span>
                  <span className="hito__label">{hito.etiqueta}</span>
                  <p className="hito__desc">{hito.descripcion}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="perfil__section" id="experiencia">
            <div className="section-title">
              <h2>EXPERIENCIA</h2>
              <span>trayectoria</span>
            </div>
            <div className="perfil__timeline">
              {experiencia.map((item) => (
                <article key={`${item.periodo}-${item.empresa}`} className="tl-item">
                  <span className="tl-item__periodo">{item.periodo}</span>
                  <div>
                    <h3 className="tl-item__title">{item.puesto}</h3>
                    <p className="tl-item__org">{item.empresa}</p>
                    <ul className="tl-item__list">
                      {item.resumen.map((linea) => (
                        <li key={linea.slice(0, 24)}>{linea}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="perfil__section" id="formacion">
            <div className="section-title">
              <h2>FORMACIÓN</h2>
              <span>estudios y certificaciones</span>
            </div>
            <div className="perfil__timeline">
              {formacion.map((item) => (
                <article key={`${item.periodo}-${item.titulo}`} className="tl-item">
                  <span className="tl-item__periodo">{item.periodo}</span>
                  <div>
                    <h3 className="tl-item__title">{item.titulo}</h3>
                    <p className="tl-item__org">{item.centro}</p>
                    <p className="muted" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                      {item.detalle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="perfil__section" id="contacto">
            <div className="section-title">
              <h2>CONTACTO</h2>
              <span>partida abierta: escribí y te contesto</span>
            </div>
            <div className="contacto">
              <FormularioContacto contacto={contacto} />

              <aside className="contacto__aside">
                <div className="panel panel--capped side-block">
                  <h3>Contacto directo</h3>
                  <a className="side-link" href={`mailto:${contacto.destinatario}`}>
                    <span>{contacto.destinatario}</span>
                    <Icon name="mail" size={14} />
                  </a>
                </div>

                <div className="panel panel--capped side-block">
                  <h3>Disponibilidad</h3>
                  <p className="muted" style={{ fontSize: '0.875rem' }}>
                    UTC−3. Part-time remoto, respuesta en 24-48 h.
                  </p>
                </div>

                <div className="panel panel--capped side-block">
                  <h3>Enlaces</h3>
                  <div className="stack" style={{ gap: '0.5rem' }}>
                    {enlaces.slice(0, 4).map((e) => (
                      <a
                        key={e.id}
                        className="side-link"
                        href={e.url}
                        target={e.url.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer noopener"
                      >
                        <span className="row" style={{ gap: '0.5rem' }}>
                          <Icon name={e.icono} size={16} />
                          {e.nombre}
                        </span>
                        <Icon name="external" size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}