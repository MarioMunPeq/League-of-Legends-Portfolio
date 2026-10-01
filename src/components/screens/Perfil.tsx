import { champSplash } from '../../data/assets'
import { crestPath, rankLabel } from '../../data/ranks'
import { Icon } from '../ui/Icon'
import type { IconName } from '../ui/Icon'
import type { PortfolioData } from '../../data/types'
import './screens.css'

const HITO_ICONS = ['crown', 'spark', 'shield', 'play'] as const satisfies readonly IconName[]

type Props = {
  data: PortfolioData
}

export function Perfil({ data }: Props) {
  const { perfil, sobreMi, formacion, experiencia, hitos, hero } = data
  const rangoTexto = `${rankLabel(perfil.rango)} ${perfil.division}`.trim()
  const portada = hero.portada ?? hero.champFavorito

  return (
    <>
      <div className="perfil__banner">
        <img
          src={champSplash(portada)}
          alt={`Arte de ${portada} como fondo de la ficha`}
        />
        <div className="perfil__banner-fade" />
      </div>

      <div className="perfil__layout">
        <aside className="panel panel--capped perfil__card">
          <div className="perfil__emblem">
            <img
              className="perfil__emblem-crest"
              src={crestPath(perfil.rango)}
              alt={`Insignia de ${rangoTexto}`}
            />
            <span className="perfil__level">{perfil.nivel}</span>
          </div>

          <h1 className="perfil__name">{perfil.nombre}</h1>
          <p className="perfil__riotid">{perfil.summoner}</p>

          <p className="muted" style={{ fontSize: '0.875rem' }}>
            {hero.eyebrow}
          </p>

          <p className="perfil__title-line">
            {rangoTexto}
            <br />
            <span className="muted" style={{ fontSize: '0.8125rem' }}>
              Programando desde 2022
            </span>
          </p>

          <div className="chips" style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
            <span className="chip chip--gold">Nivel {perfil.nivel}</span>
            <span className="chip chip--cyan">Maestría {perfil.maestria}</span>
          </div>
        </aside>

        <div className="perfil__main">
          <section className="perfil__section perfil__about">
            <div className="section-title">
              <h2>SOBRE MÍ</h2>
              <span>quién está detrás de la cuenta</span>
            </div>
            {sobreMi.map((parrafo) => (
              <p key={parrafo.slice(0, 24)}>{parrafo}</p>
            ))}
          </section>

          <section className="perfil__section">
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

          <section className="perfil__section">
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

          <section className="perfil__section">
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
        </div>
      </div>
    </>
  )
}
