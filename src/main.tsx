import { hydrateRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/riot.css'
import { Root } from './root'

/*
 * `hydrateRoot` y no `createRoot(...).render()`.
 *
 * El HTML que llega ya viene con la pantalla de inicio escrita dentro (la deja
 * el paso de prerender del build). `createRoot` la borraria sin mirarla y
 * despues repintaria todo desde cero: el visitante veria un instante la pagina
 * montada y luego el mismo contenido aparecer de nuevo. `hydrateRoot` reutiliza
 * ese HTML y solo engancha los eventos, que es lo que hace falta.
 *
 * El arbol tiene que coincidir exacto con el que genero el prerender, por eso
 * los dos importan el mismo componente de `root.tsx`.
 */
hydrateRoot(document.getElementById('root')!, <Root />)
