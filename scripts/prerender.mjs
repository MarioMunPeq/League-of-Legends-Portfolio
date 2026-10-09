/**
 * Pre-renderiza la pantalla de inicio dentro del HTML del build.
 *
 *   npm run prerender
 *
 * El problema que resuelve: la pagina es una SPA, asi que el HTML que descarga
 * Google (y el que leen los crawlers al compartir un enlace, que no ejecutan
 * JavaScript) era solo `<div id="root"></div>`. Sin texto ni un solo <h1>, el
 * sitio se indexaba como una pagina vacia.
 *
 * Como los datos salen de `proyectos.json` y no de una API, no hay nada que
 * esperar: se renderiza en Node durante el build y se deja escrito en el HTML.
 * El navegador despues hidrata ese mismo arbol (ver `main.tsx`), de modo que no
 * se descarga el bundle dos veces ni se repinta la pagina.
 *
 * El resultado se guarda en `.prerender/body.html` y lo lee el plugin
 * `open-graph` de vite.config.ts, que lo inyecta en el sitio de
 * `<div id="root"></div>`.
 *
 * En dev no se ejecuta: `vite dev` sirve el HTML a pelo y lo monta React, que
 * es lo que se quiere al desarrollar.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SALIDA = join(RAIZ, '.prerender')
const BUNDLE = join(SALIDA, 'entry-prerender.js')
const HTML = join(SALIDA, 'body.html')

/*
 * Se lanza la MISMA configuracion del sitio (`--config vite.config.ts`) para que
 * el bundle de Node herede el mismo `base` que el sitio final. Es lo que hace
 * que las rutas de las imagenes salgan con el prefijo
 * `/League-of-Legends-Portfolio/` y no con un 404 al desplegar.
 *
 * `--outDir` queda fuera de `dist/` a proposito: si no, el build de Pages
 * publicaria tambien este bundle de servidor, que no le sirve a nadie.
 */
execFileSync(
  process.execPath,
  [
    join(RAIZ, 'node_modules', 'vite', 'bin', 'vite.js'),
    'build',
    '--ssr',
    'src/entry-prerender.tsx',
    '--outDir',
    SALIDA,
    '--emptyOutDir',
  ],
  { cwd: RAIZ, stdio: 'inherit' },
)

if (!existsSync(BUNDLE)) {
  let generado = []
  try {
    generado = readdirSync(SALIDA)
  } catch {
    /* el directorio ni existe: el mensaje de abajo ya lo dice */
  }
  throw new Error(
    `El build SSR no produjo ${BUNDLE}. Genero: ${generado.join(', ') || '(nada)'}`,
  )
}

const { render } = await import(pathToFileURL(BUNDLE).href)
const html = render()

if (!html.trim()) throw new Error('El prerender devolvio una cadena vacia')

/*
 * El <h1> es el motivo de todo esto. Si la pantalla de inicio dejara de
 * emitirlo, el sitio volveria a indexarse sin ninguno: preferible que el
 * build falle aqui y no que se descubra en el buscador.
 */
const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
if (!h1) {
  throw new Error('El HTML pre-renderizado no contiene ningun <h1>')
}

mkdirSync(SALIDA, { recursive: true })
writeFileSync(HTML, html)

const kb = Math.round((Buffer.byteLength(html) / 1024) * 10) / 10
const texto = h1[1].replace(/<[^>]+>/g, '').trim()

console.log(`\n  .prerender/body.html  ${kb} KB`)
console.log(`  <h1> ${texto.slice(0, 72)}`)

/*
 * El bundle de Node ya no hace falta para nada. Se borra para que no aparezca
 * en el arbol del repositorio ni se confunda con codigo del sitio; el HTML que
 * produce se queda, que es lo que consumen los crawlers.
 */
rmSync(BUNDLE, { force: true })
