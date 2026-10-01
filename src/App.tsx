import { useCallback, useMemo } from 'react'
import { AudioProvider } from './hooks/AudioProvider'
import { useHashRoute } from './hooks/useHashRoute'
import { TopBar } from './components/layout/TopBar'
import { SocialPanel } from './components/layout/SocialPanel'
import { Inicio } from './components/screens/Inicio'
import { Perfil } from './components/screens/Perfil'
import { Coleccion } from './components/screens/Coleccion'
import { Artesania } from './components/screens/Artesania'
import { Seleccion } from './components/screens/Seleccion'
import { Lobby } from './components/screens/Lobby'
import { DetalleProyecto } from './components/screens/DetalleProyecto'
import raw from './data/proyectos.json'
import { CHAMPS } from './data/champs.generated'
import type { PortfolioData, Proyecto } from './data/types'
import { useAudio } from './hooks/useAudio'

const data = raw as PortfolioData

/** Campeones descargados que todavía no tienen ficha: salen bloqueados en Selección. */
const sinProyecto = CHAMPS.map((c) => c.name).filter(
  (champ) => !data.proyectos.some((p) => p.campeon === champ),
)

/**
 * Maestría por proyecto. Es la única cifra que el cliente inventa: el resto
 * de números del portfolio salen de proyectos.json. El orden refleja el
 * graphing de cada ficha, no una puntuación oficial.
 */
const MASTERY: Record<string, number> = {
  'proyecto-gambia': 9, // TFG con mención honorífica
  'dungeon-archive': 8,
  euromario: 8,
  'recomendador-campeones': 8,
  'cosmere-archive': 7,
  'vault-archive': 7,
  persona5: 6,
  'repository-library': 6,
  minecraft: 5,
  'papers-please': 5,
}

function Shell() {
  const { route, param, navigate } = useHashRoute()
  const { play } = useAudio()

  const proyecto = useMemo(
    () => (param ? data.proyectos.find((p) => p.id === param) : undefined),
    [param],
  )

  const abrirProyecto = useCallback(
    (proyecto: Proyecto) => {
      play('nav-click')
      navigate('coleccion', proyecto.id)
    },
    [play, navigate],
  )

  return (
    <div className="frame">
      <TopBar route={route} perfil={data.perfil} onNavigate={navigate} />

      <div className="frame__body">
        <main className="main" id="contenido">
          <div className="main__inner" key={param ?? route}>
            {param ? (
              <DetalleProyecto
                proyecto={proyecto}
                onVolver={() => navigate('coleccion')}
                onNavegar={navigate}
              />
            ) : route === 'inicio' ? (
              <Inicio data={data} onNavegar={navigate} />
            ) : route === 'perfil' ? (
              <Perfil data={data} />
            ) : route === 'coleccion' ? (
              <Coleccion
                proyectos={data.proyectos}
                mastery={MASTERY}
                onAbrir={abrirProyecto}
              />
            ) : route === 'artesania' ? (
              <Artesania materiales={data.materiales} />
            ) : route === 'seleccion' ? (
              <Seleccion
                proyectos={data.proyectos}
                restantes={sinProyecto}
                onAbrir={abrirProyecto}
                onNavegar={navigate}
              />
            ) : (
              <Lobby data={data} onNavegar={navigate} />
            )}
          </div>

          <footer className="footer">
            <p className="footer__disclaimer">
              <strong>Proyecto fan, no afiliado a Riot Games.</strong> League of Legends es una marca
              registrada de Riot Games. Este portfolio replica su interfaz con fines educativos y de
              portafolio; los               assets gráficos pertenecen a sus respectivos titulares.
            </p>
            <span className="chip">{data.perfil.summoner}</span>
            <span className="chip chip--gold">Nivel {data.perfil.nivel}</span>
          </footer>
        </main>

        <SocialPanel enlaces={data.enlaces} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <Shell />
    </AudioProvider>
  )
}
