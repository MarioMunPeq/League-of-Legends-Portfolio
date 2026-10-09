import { useCallback, useMemo, useState } from 'react'
import { AudioProvider } from './hooks/AudioProvider'
import { useHashRoute } from './hooks/useHashRoute'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
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
/*
 * La capa movil se importa aqui, y no en main.tsx, para que salga la ultima en
 * el CSS empaquetado. App arrastra chrome.css y screens.css, que traen sus
 * propios breakpoints y declaran cosas como `.jugar__modes { overflow-x: auto }`.
 * Con el mismo peso especifico gana el Stylesheet inyectado despues, asi que
 * entrar antes haria que la version movil perdiese contra la de escritorio.
 */
import './styles/mobile.css'

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
      </div>

      {/*
       * Antes, entre el contenido y el borde inferior, habia un pie fijo con el
       * aviso legal y dos chapas (el nombre de invocador y el nivel). En vertical
       * se comia entre 150 y 200 px de las 844 de pantalla, en las cinco
       * pestañas, y las chapas repetian datos que ya salen en la barra superior
       * y en la ficha. El aviso se lee ahora en el panel social (escritorio) y en
       * la pestana de contacto de la ficha, en todos los anchos.
       */}

      {/*
       * La navegacion de las cuatro secciones. En escritorio la resuelven la
       * barra del cliente y el panel social, asi que esta barra se queda
       * oculta por CSS a partir de 768 px; solo aparece en movil, donde esas
       * dos piezas no caben y el pulgar llega al borde inferior.
       */}
      <BottomNav route={route} onNavigate={navigate} />
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
