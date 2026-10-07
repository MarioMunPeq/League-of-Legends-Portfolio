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

/**
 * Perfil: la ficha del jugador. El arte ocupa todo el bloque; abajo se reparten
 * en dos columnas, el panel de identidad a la izquierda y las cinco cifras a la
 * derecha, tal y como los compone el cliente. El contenido va debajo, a ancho
 * completo.
 */
export function Perfil({ data }: Props) {
  const { perfil, sobreMi, formacion, experiencia, hitos, hero, enlaces, contacto } = data
  const rangoTexto = `${rankLabel(perfil.rango)} ${perfil.division}`.trim()
  const portada = hero.portada ?? hero.champFavorito

  const mainRef = useRef<HTMLDivElement>(null)
  const [activa, setActiva] = useState(() => SECCIONES[0]?.id ?? 'sobre-mi')
  const sound = useButtonSound('grid')

  const crest = useMemo(() => crestPath(perfil.rango), [perfil.rango])

  /*
   * Las cinco cifras de la cabecera. `valor` a null es una insignia que el
   * cliente no sabe mostrar y dibuja como un interrogante dorado en vez de
   * un texto de reemplazo.
   */
  const cifras: {
    etiqueta: string
    valor: string | null
    emblema: string
    svg?: boolean
    apagado?: boolean
  }[] = [
    { etiqueta: '5V5 FLEXIBLE', valor: rangoTexto, emblema: crest, svg: true },
    {
      etiqueta: 'HONOR',
      valor: `NIVEL ${perfil.nivel}`,
      emblema: asset('assets/ui/honor/heart-miniicon.png'),
    },
    {
      etiqueta: 'PUNTUACIÓN DE MAESTRÍA',
      valor: String(perfil.maestria),
      emblema: asset('assets/mastery/mastery-mark.png'),
    },
    { etiqueta: 'TROFEO', valor: null, emblema: asset('assets/ranked/frame/ranked-emblem.png'), apagado: true },
    {
      etiqueta: 'ESTANDARTE MUNDIAL',
      valor: null,
      emblema: asset('assets/ranked/frame/member-banner.png'),
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
          <span className="perfil__gear" aria-hidden="true">
            <Icon name="settings" size={18} />
          </span>
        </div>

        {/* Panel de identidad y cifras: las dos mitades de la ficha del cliente. */}
        <div className="perfil__stage">
          <aside className="perfil__card">
            {/* El nivel va en su pastilla, con el disco de cuenta delante. */}
            <span className="perfil__levelchip">
              <span className="perfil__levelchip-mark" aria-hidden="true" />
              {perfil.nivel}
            </span>

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

            {/* el lema bajo el nombre, como el titulo de rango del cliente */}
            <p className="perfil__lema">Mente maestra</p>

            {/*
              Los tres huecos de runa. El cliente los deja vacios cuando la
              cuenta no tiene pagina montada, asi que aqui son solo aros.
            */}
            <div className="perfil__circles" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>

            <p className="perfil__title-line">{hero.eyebrow}</p>

            {/* el remate del panel y el boton de plegar, bajo la punta */}
            <span className="perfil__collapse" aria-hidden="true">
              <Icon name="caret" size={18} />
            </span>
          </aside>

          <div className="perfil__cifras">
            {cifras.map((c) => (
              <div key={c.etiqueta} className={`cifra ${c.apagado ? 'cifra--apagada' : ''}`}>
                <span className="cifra__etiqueta">{c.etiqueta}</span>
                {c.valor ? (
                  <span className="cifra__valor">{c.valor}</span>
                ) : (
                  <span className="cifra__valor cifra__valor--q" title="Sin mostrar">
                    ?
                  </span>
                )}
                <img
                  className={`cifra__emblema ${c.svg ? 'cifra__emblema--crest' : ''}`}
                  src={c.emblema}
                  alt=""
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="perfil__layout">
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
              <FormularioContacto contacto={contacto} summoner={perfil.summoner} />

              <aside className="contacto__aside">
                <div className="panel panel--capped side-block">
                  <h3>Disponibilidad</h3>
                  <p className="muted" style={{ fontSize: '0.875rem' }}>
                    UTC−3. Part-time remoto, respuesta en 24-48 h.
                  </p>
                </div>

                <div className="panel panel--capped side-block">
                  <h3>Enlaces</h3>
                  <div className="stack" style={{ gap: '0.5rem' }}>
                    {enlaces.map((e) => (
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