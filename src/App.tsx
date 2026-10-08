import { useCallback, useMemo, useState } from 'react'
import { AudioProvider } from './hooks/AudioProvider'
import { useHashRoute } from './hooks/useHashRoute'
import { TopBar } from './components/layout/TopBar'
import { SocialPanel } from './components/layout/SocialPanel'
import { Inicio } from './components/screens/Inicio'
import { Jugar } from './components/screens/Jugar'
import { Perfil } from './components/screens/Perfil'
import { Coleccion } from './components/screens/Coleccion'
import { Artesania } from './components/screens/Artesania'
import { DetalleProyecto } from './components/screens/DetalleProyecto'
import raw from './data/proyectos.json'
import type { PortfolioData, Proyecto } from './data/types'
import { useAudio } from './hooks/useAudio'

const data = raw as PortfolioData

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
  /** modo confirmado en la pantalla Jugar; se muestra como contexto en la coleccion */
  const [modo, setModo] = useState<string | null>(null)

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

  const jugar = useCallback(
    (id: string) => {
      setModo(id)
      navigate('coleccion')
    },
    [navigate],
  )

  return (
    <div className="frame">
      <TopBar
        route={route}
        perfil={data.perfil}
        enlaces={data.enlaces}
        onNavigate={navigate}
      />

      <div className="frame__body">
        <main className="main" id="contenido">
          <div className="main__inner" key={`${route}/${param ?? ''}`}>
            {/*
             * El parametro del hash solo es un id de proyecto en la coleccion.
             * En artesania es el grupo con el que se abre (`#/artesania/Lenguajes`),
             * asi que comprobar el parametro a secas mandaba a la ficha de un
             * proyecto inexistente.
             */}
            {route === 'coleccion' && param ? (
              <DetalleProyecto
                proyecto={proyecto}
                onVolver={() => navigate('coleccion')}
                onNavegar={navigate}
              />
            ) : route === 'inicio' ? (
              <Inicio data={data} onNavegar={navigate} onAbrir={abrirProyecto} modo={modo} />
            ) : route === 'jugar' ? (
              <Jugar modoInicial={modo} onConfirmar={jugar} />
            ) : route === 'perfil' ? (
              <Perfil data={data} />
            ) : route === 'coleccion' ? (
              <Coleccion
                proyectos={data.proyectos}
                mastery={MASTERY}
                modo={modo}
                onAbrir={abrirProyecto}
                onLimpiarModo={() => setModo(null)}
              />
            ) : (
              <Artesania materiales={data.materiales} grupoInicial={param} />
            )}
          </div>
        </main>

        <SocialPanel enlaces={data.enlaces} />

        <footer className="footer">
          <p className="footer__disclaimer">
            <strong>Proyecto fan, no afiliado a Riot Games.</strong> League of Legends es una marca
            registrada de Riot Games. Este portfolio replica su interfaz con fines educativos y de
            portafolio; los assets gráficos pertenecen a sus respectivos titulares.
          </p>
          <span className="chip">{data.perfil.summoner}</span>
          <span className="chip chip--gold">Nivel {data.perfil.nivel}</span>
        </footer>
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
