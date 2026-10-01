import { useMemo } from 'react'
import { champSplash } from '../../data/assets'
import { GoldButton } from '../ui/GoldButton'
import type { PortfolioData } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import { useAudio } from '../../hooks/useAudio'
import './screens.css'

type Props = {
  data: PortfolioData
  onNavegar: (route: Route) => void
}

export function Inicio({ data, onNavegar }: Props) {
  const { play } = useAudio()
  const { hero, perfil, proyectos, hitos } = data

  const fondo = useMemo(
    () => champSplash(hero.champFavorito),
    [hero.champFavorito],
  )

  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${fondo})` }}
        role="img"
        aria-label={`Arte de ${hero.champFavorito}, campeon favorito`}
      />
      <div className="hero__scrim" />

      <div className="hero__content">
        <p className="hero__eyebrow">{hero.eyebrow}</p>
            <h1 className="hero__title">{hero.titulo}</h1>
            <p className="hero__region">Valladolid · España</p>
        <p className="hero__subtitle">{hero.subtitulo}</p>
        <p className="hero__text">{hero.descripcion}</p>

        <div className="hero__actions">
          <GoldButton
            variant="play"
            size="lg"
            onClick={() => {
              play('nav-click')
              onNavegar('lobby')
            }}
          >
            {hero.ctaPrimario}
          </GoldButton>
          <GoldButton
            variant="ghost"
            size="lg"
            onClick={() => {
              play('nav-click')
              onNavegar('coleccion')
            }}
          >
            {hero.ctaSecundario}
          </GoldButton>
        </div>

        <div className="hero__facts">
          <div>
            <span className="hero__fact-value">{perfil.maestria}</span>
            <span className="hero__fact-label">Puntos de maestría</span>
          </div>
          <div>
            <span className="hero__fact-value">{proyectos.length}</span>
            <span className="hero__fact-label">Proyectos</span>
          </div>
          <div>
            <span className="hero__fact-value">{perfil.meses}</span>
            <span className="hero__fact-label">Meses programando</span>
          </div>
          <div>
            <span className="hero__fact-value">{hitos.length}</span>
            <span className="hero__fact-label">Hitos</span>
          </div>
        </div>
      </div>
    </section>
  )
}
