import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// https://vite.dev/config/
// GitHub Pages sirve el proyecto bajo /<nombre-del-repo>/. Con las rutas
// absolutas de /assets el build local funciona pero en Pages daria 404, asi
// que base lleva el prefijo del despliegue. Para servirlo en otro sitio,
// cambiar el valor (o pasarlo por --base en el build).
const REPO = 'League-of-Legends-Portfolio'

/** Origen publico. Es el unico dato que no se puede deducir del repositorio. */
const ORIGEN = 'https://marmunpeq.github.io'

const OG = {
  titulo: 'Un portfolio con la estética de League of Legends',
  descripcion:
    'Cada pantalla replica una sección real del cliente de League of Legends, con sus piezas ' +
    'y el código abierto que usa Riot. Proyecto fan, no afiliado a Riot Games.',
  alt: 'Retrato de Sett a la derecha y, sobre el fondo oscuro de la interfaz del cliente, el titular «Un portfolio con la estética de League of Legends».',
}

/**
 * Inserta las etiquetas de previsualizacion en el <head>.
 *
 * Los crawlers de WhatsApp, LinkedIn, X o Slack NO ejecutan JavaScript: leen el
 * HTML tal cual y de ahi sacan la imagen y el texto del enlace. Por eso van en
 * el HTML y no se calculan en React.
 *
 * Lo delicado es que `og:image` tiene que ser una URL ABSOLUTA. Un crawler que
 * recibe `og.png` no lo resuelve contra el sitio que se esta compartiendo (no
 * sabe de donde vino el enlace) y se queda sin imagen. El prefijo sale de
 * `base`, que ya lleva el nombre del repositorio: si el repo se renombra, las
 * etiquetas lo siguen sin que nadie tenga que acordarse.
 *
 * Solo en build: en desarrollo `og:url` apuntaria a la URL publica, que no es
 * la que se esta mirando, y los validadores avisarian en falso.
 */
function openGraph(): Plugin {
  let base = '/'

  return {
    name: 'open-graph',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml(html) {
      const raiz = base.endsWith('/') ? base : `${base}/`
      const relativa = (p: string) => `${raiz}${p}`
      const absoluta = (p: string) => `${ORIGEN}${raiz}${p}`
      const url = absoluta('')

      return {
        html,
        tags: [
          { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: relativa('favicon.svg') } },
          { tag: 'link', attrs: { rel: 'apple-touch-icon', href: relativa('apple-touch-icon.png') } },
          { tag: 'link', attrs: { rel: 'canonical', href: url } },

          { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
          { tag: 'meta', attrs: { property: 'og:site_name', content: 'xNaque · Portfolio' } },
          { tag: 'meta', attrs: { property: 'og:locale', content: 'es_ES' } },
          { tag: 'meta', attrs: { property: 'og:title', content: OG.titulo } },
          { tag: 'meta', attrs: { property: 'og:description', content: OG.descripcion } },
          { tag: 'meta', attrs: { property: 'og:url', content: url } },
          { tag: 'meta', attrs: { property: 'og:image', content: absoluta('og.png') } },
          { tag: 'meta', attrs: { property: 'og:image:secure_url', content: absoluta('og.png') } },
          { tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
          { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
          { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
          { tag: 'meta', attrs: { property: 'og:image:alt', content: OG.alt } },

          { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
          { tag: 'meta', attrs: { name: 'twitter:title', content: OG.titulo } },
          { tag: 'meta', attrs: { name: 'twitter:description', content: OG.descripcion } },
          { tag: 'meta', attrs: { name: 'twitter:image', content: absoluta('og.png') } },
          { tag: 'meta', attrs: { name: 'twitter:image:alt', content: OG.alt } },
        ],
      }
    },
  }
}

export default defineConfig({
  base: `/${REPO}/`,
  plugins: [react(), openGraph()],
})
