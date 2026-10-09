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

const AUTOR = 'Mario Muñoz Pequeño'

/**
 * Descripcion en castellano, entre 110 y 160 caracteres. Por encima de 160
 * WhatsApp y LinkedIn la cortan y el final se pierde a mitad de palabra.
 */
const DESCRIPCION =
  'Portfolio de desarrollo de Mario Muñoz Pequeño: diez proyectos presentados con la ' +
  'interfaz de League of Legends. Proyecto fan, no afiliado a Riot Games.'

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
 * Inserta los iconos, los datos estructurados y el cuerpo pre-renderizado.
 *
 * El bloque que se ve al compartir el enlace (`og:*`, `twitter:*` y el
 * `canonical`) NO se genera aqui: esta escrito a mano en `index.html`, que es
 * donde se lee y donde se cambia. Aqui solo queda lo que depende de `base` o de
 * los datos del proyecto.
 *
 * Los crawlers de WhatsApp, LinkedIn, X o Slack no ejecutan JavaScript, asi que
 * todo esto tiene que acabar en el HTML estatico; por eso se inserta en el
 * build y no en tiempo de ejecucion.
 *
 * Solo en build: en desarrollo `canonical` y JSON-LD apuntarian a la URL
 * publica, que no es la que se esta mirando, y los validadores avisarian en
 * falso.
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

      const meta = [
        // Iconos. Google no acepta SVG, asi que el .ico y el PNG van aunque
        // favicon.svg sea el que usan los navegadores modernos.
        `<link rel="icon" href="${relativa('favicon.svg')}" type="image/svg+xml" />`,
        `<link rel="icon" href="${relativa('favicon.ico')}" sizes="any" />`,
        `<link rel="icon" type="image/png" sizes="32x32" href="${relativa('favicon-32x32.png')}" />`,
        `<link rel="apple-touch-icon" href="${relativa('apple-touch-icon.png')}" />`,
        `<link rel="manifest" href="${relativa('site.webmanifest')}" />`,

        `<meta name="author" content="${AUTOR}" />`,
        `<meta name="description" content="${DESCRIPCION}" />`,

        /*
         * Deliberadamente NO hay aqui las etiquetas `og:*`, `twitter:*` ni el
         * `canonical`: viven escritas en `index.html`.
         *
         * Se movieron ahi para que el bloque que se lee al compartir un enlace
         * se pueda editar y revisar en el fichero donde uno lo mira, en vez de
         * estar escondido en la configuracion del build. Este plugin se queda
         * con lo que de verdad necesita conocer `base` y los datos del proyecto:
         * los iconos, el manifest, los datos estructurados y el cuerpo
         * pre-renderizado.
         *
         * Duplicarlas aqui daria dos `og:image` en el mismo HTML, y con ellos
         * distintos los crawlers cogen el que les da la gana.
         */

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
