import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import datos from './src/data/proyectos.json' with { type: 'json' }

// https://vite.dev/config/
// GitHub Pages sirve el proyecto bajo /<nombre-del-repo>/. Con las rutas
// absolutas de /assets el build local funciona pero en Pages daria 404, asi
// que base lleva el prefijo del despliegue. Para servirlo en otro sitio,
// cambiar el valor (o pasarlo por --base en el build).
const REPO = 'League-of-Legends-Portfolio'

/**
 * Origen publico. Es el unico dato que no se puede deducir del repositorio.
 *
 * OJO: el usuario de GitHub Pages es `mariomunpeq` (con "i"). Un typo aqui
 * (p. ej. `marmunpeq`) no rompe el build: las etiquetas se generan igual, pero
 * apuntan a un host que no existe, asi que `og:image` da 404 y TODA la
 * previsualizacion al compartir el enlace sale sin foto. Es el fallo mas caro
 * del archivo porque no se ve hasta que el enlace ya esta publicado.
 */
const ORIGEN = 'https://mariomunpeq.github.io'

/** Cuenta de X/Twitter que se atribuye el contenido al compartirlo. */
const TWITTER = '@Snakeyesmp'

const AUTOR = 'Mario Muñoz Pequeño'

/**
 * Descripcion en castellano, entre 110 y 160 caracteres. Por encima de 160
 * WhatsApp y LinkedIn la cortan y el final se pierde a mitad de palabra.
 */
const DESCRIPCION =
  'Portfolio de desarrollo de Mario Muñoz Pequeño: diez proyectos presentados con la ' +
  'interfaz de League of Legends. Proyecto fan, no afiliado a Riot Games.'

const OG = {
  titulo: 'Un portfolio con la estética de League of Legends',
  descripcion:
    'Cada pantalla replica una sección real del cliente de League of Legends, con sus piezas ' +
    'y el código abierto que usa Riot. Proyecto fan, no afiliado a Riot Games.',
  alt: 'Retrato de Sett a la derecha y, sobre el fondo oscuro de la interfaz del cliente, el titular «Un portfolio con la estética de League of Legends».',
}

/** GitHub Pages sirve el proyecto con una redireccion 301 a esta forma. */
const SITE = `${ORIGEN}/${REPO}/`

/**
 * Datos estructurados. El grafo va aparte del HTML porque `Person` (quien es)
 * y `WebSite` (que es) no se pertainen: Google muestra el perfil del autor en
 * los resultados, que es justo lo que aporta en un portfolio.
 *
 * El `ItemList` sale de proyectos.json, no escrito a mano, para que anadir un
 * proyecto no obligue a tocar este archivo.
 */
function jsonLd(): string {
  const proyectos = [...datos.proyectos].sort((a, b) => a.orden - b.orden)

  const grafo = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE}#persona`,
        name: AUTOR,
        alternateName: ['MarioMunPeq', 'xNaque'],
        url: SITE,
        description: DESCRIPCION,
        sameAs: [
          'https://github.com/MarioMunPeq',
          'https://x.com/Snakeyesmp',
          'https://mariomunpeq.is-a.dev/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}#web`,
        url: SITE,
        name: 'xNaque · Portfolio',
        inLanguage: 'es',
        description: DESCRIPCION,
        publisher: { '@id': `${SITE}#persona` },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE}#proyectos`,
        name: 'Proyectos',
        numberOfItems: proyectos.length,
        itemListElement: proyectos.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            name: p.titulo,
            description: p.claim,
            url: (p.enlaces[0] ?? {}).url ?? SITE,
            dateCreated: p.anio,
            keywords: p.tags.join(', '),
            creator: { '@id': `${SITE}#persona` },
          },
        })),
      },
    ],
  }

  /*
   * `<` se escapa a < para que un texto con `</script>` dentro no
   * cierre el propio script del JSON-LD. Solo affects al HTML, no al valor
   * que lee el parser de Google.
   */
  return JSON.stringify(grafo, null, 2).replace(/</g, '\\u003c')
}

/** Ruta del HTML pre-renderizado que deja `npm run prerender`. */
const PRERENDER = resolve(import.meta.dirname, '.prerender/body.html')

/**
 * Inserta las etiquetas de previsualizacion y el cuerpo pre-renderizado.
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

      const meta = [
        // Iconos. Google no acepta SVG, asi que el .ico y el PNG van aunque
        // favicon.svg sea el que usan los navegadores modernos.
        `<link rel="icon" href="${relativa('favicon.svg')}" type="image/svg+xml" />`,
        `<link rel="icon" href="${relativa('favicon.ico')}" sizes="any" />`,
        `<link rel="icon" type="image/png" sizes="32x32" href="${relativa('favicon-32x32.png')}" />`,
        `<link rel="apple-touch-icon" href="${relativa('apple-touch-icon.png')}" />`,
        `<link rel="manifest" href="${relativa('site.webmanifest')}" />`,
        `<link rel="canonical" href="${SITE}" />`,

        `<meta name="author" content="${AUTOR}" />`,
        `<meta name="description" content="${DESCRIPCION}" />`,

        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="xNaque · Portfolio" />`,
        `<meta property="og:locale" content="es_ES" />`,
        `<meta property="og:title" content="${OG.titulo}" />`,
        `<meta property="og:description" content="${OG.descripcion}" />`,
        `<meta property="og:url" content="${SITE}" />`,
        `<meta property="og:image" content="${absoluta('og.png')}" />`,
        `<meta property="og:image:secure_url" content="${absoluta('og.png')}" />`,
        `<meta property="og:image:type" content="image/png" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="${OG.alt}" />`,

        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:site" content="${TWITTER}" />`,
        `<meta name="twitter:creator" content="${TWITTER}" />`,
        `<meta name="twitter:title" content="${OG.titulo}" />`,
        `<meta name="twitter:description" content="${OG.descripcion}" />`,
        `<meta name="twitter:image" content="${absoluta('og.png')}" />`,
        `<meta name="twitter:image:alt" content="${OG.alt}" />`,

        `<script type="application/ld+json">\n${jsonLd()}\n</script>`,
      ].join('\n    ')

      /*
       * Se inserta el bloque justo despues de `</title>` y NO con el array
       * `tags` de Vite. Ese array antepone al principio del <head>, y como
       * index.html ya abre con `<meta charset>`, el charset se quedaba a
       * medias despues de veinte etiquetas: el navegador todavia lo respeta
       * (lee los primeros 1024 bytes) pero es mas lento y los validadores lo
       * marcan. Insertar por texto deja el charset primero, como debe ser.
       */
      let out = html.replace('</title>', `</title>\n    ${meta}`)

      if (existsSync(PRERENDER)) {
        const body = readFileSync(PRERENDER, 'utf8').trim()
        out = out.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      }

      return out
    },
  }
}

export default defineConfig({
  base: `/${REPO}/`,
  plugins: [react(), openGraph()],
})
