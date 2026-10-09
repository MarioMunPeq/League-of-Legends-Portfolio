/**
 * Genera los recursos que se ven al compartir el enlace.
 *
 *   public/og.png               1200x630, la previsualizacion de WhatsApp/LinkedIn
 *   public/apple-touch-icon.png  180x180, la ficha del icono en iOS
 *   public/icon-512.png          512x512, icono grande y PWA
 *   public/favicon.svg           vectorial, para los navegadores de escritorio
 *
 * Se dibuja con Chrome headless en vez de con un canvas porque el sitio tiene
 * tipografias propias (Beaufort y Spiegel, .otf) y arte real: asi la
 * previsualizacion usa exactamente las mismas piezas que la pagina, sin
 * depender de que el sistema tenga las fuentes ni de reimplementar el arte a
 * mano. Las .otf y las imagenes se incrustan como data URI, asi que el script
 * no necesita ningun servidor.
 *
 * No se ejecuta en el build: es una tarea manual, para cuando cambie el texto o
 * la portada. Los ficheros que genera si se versionan, porque son los que
 * consumen los crawlers.
 *
 *   node scripts/generar-og.mjs
 *
 * Si Chrome esta en una ruta rara: CHROME_PATH=/ruta/a/chrome node scripts/generar-og.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const RAIZ = resolve(process.cwd())
const PUB = join(RAIZ, 'public')

/* ------------------------------------------------------------------ chrome */

const CANDIDATOS = [
  process.env.CHROME_PATH,
  // Windows
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  // Linux
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const chrome = CANDIDATOS.find((p) => existsSync(p))
if (!chrome) {
  console.error(
    'No encuentro Chrome. Define CHROME_PATH con la ruta al ejecutable y vuelve a lanzar.',
  )
  process.exit(1)
}

/* --------------------------------------------------------------- recursos */

const dataURI = (abs) => `data:${TIPO[extension(abs)]};base64,${readFileSync(abs).toString('base64')}`

const TIPO = {
  '.otf': 'font/otf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}
const extension = (p) => {
  const i = p.lastIndexOf('.')
  return i < 0 ? '' : p.slice(i).toLowerCase()
}

const font = (n) => dataURI(join(PUB, 'assets', 'fonts', n))

/**
 * Los textos salen de proyectos.json, no estan escritos aqui a mano. Si un dia
 * se cambia el titular del sitio, la previsualizacion lo sigue sin que haya que
 * acordarse de tocar este fichero.
 */
const datos = JSON.parse(readFileSync(join(RAIZ, 'src', 'data', 'proyectos.json'), 'utf8'))

/*
 * El campeon del retrato es el que ya preside la portada del sitio
 * (`hero.portada`), no el del fondo de Inicio. Se cambia aqui y no en la
 * plantilla para que la eleccion siga siendo un dato y no una constante
 * escondida en un archivo de estilos.
 */
const campeon = datos.hero.portada
const splash = join(PUB, 'assets', 'champions', 'splash', `${campeon}.jpg`)
if (!existsSync(splash)) {
  console.error(`No encuentro el splash de ${campeon}. Revisa data.proyectos.json`)
  process.exit(1)
}

const CREST = join(PUB, 'assets', 'ui', 'chrome', 'league-logo-active.svg')

/* ------------------------------------------------------------------ render */

const TIPOGRAFIA = `
@font-face { font-family: 'Spiegel'; src: url('${font('spiegel-regular.otf')}') format('opentype'); font-weight: 400; }
@font-face { font-family: 'Spiegel'; src: url('${font('spiegel-semibold.otf')}') format('opentype'); font-weight: 600; }
@font-face { font-family: 'Beaufort'; src: url('${font('beaufortforlol-regular.otf')}') format('opentype'); font-weight: 400; }
@font-face { font-family: 'Beaufort'; src: url('${font('beaufortforlol-bold.otf')}') format('opentype'); font-weight: 700; }
@font-face { font-family: 'Beaufort'; src: url('${font('beaufortforlol-heavy.otf')}') format('opentype'); font-weight: 900; }
`

/*
 * Plantilla de 1200x630. El reparto es el de las piezas del cliente: el fondo es
 * el vacio (#010a13) con un halo cyan arriba a la izquierda, el retrato entra a
 * sangre por la derecha con un velo que lo funde con el fondo (nada de un
 * recorte rectangular, que delata la foto pegada), y el texto vive en una
 * columna con aire.
 *
 * El marco de esquinas son las cantoneras doradas del cliente, con el mismo
 * corte en bisel.
 */
const OG = `<!doctype html>
<html><head><meta charset="utf-8"><style>${TIPOGRAFIA}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    background:
      radial-gradient(ellipse 900px 600px at 8% -10%, rgba(5,150,170,0.20) 0%, transparent 60%),
      radial-gradient(ellipse 700px 500px at 90% 110%, rgba(200,170,110,0.10) 0%, transparent 62%),
      #010a13;
    font-family: 'Spiegel', sans-serif;
    color: #d8cfbc;
  }
  /* El retrato entra a sangre por la derecha. */
  .retrato {
    position: absolute; top: 0; right: 0; width: 640px; height: 630px;
    background-image: url('${dataURI(splash)}');
    background-size: cover; background-position: 78% 22%;
    filter: saturate(0.92) contrast(1.04) brightness(0.92);
    /*
     * Se funde con una mascara y no con un velo encima. Un velo es un rectangulo
     * opaco: aunque degrade, en el borde del retrato se nota el escalon donde el
     * negro plano del velo se junta con el negro del fondo. La mascara actua
     * sobre los pixeles del retrato, asi que no hay ninguna costura, solo una
     * aparicion progresiva.
     */
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 16%, #000 34%);
    mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 16%, #000 34%);
  }
  /* un ultimo velo, ya sin costura posible, para bajar el brillo detras del texto */
  .velo {
    position: absolute; top: 0; left: 0; width: 900px; height: 630px;
    background: linear-gradient(90deg, #010a13 0%, rgba(1,10,19,0.72) 34%, rgba(1,10,19,0) 62%);
  }
  /* filete vertical: separa sin cortar */
  .filete {
    position: absolute; top: 54px; left: 620px; width: 1px; height: 522px;
    background: linear-gradient(180deg, transparent, rgba(200,170,110,0.42) 22%, rgba(200,170,110,0.42) 78%, transparent);
  }
  /* cantoneras del cliente */
  .esquina { position: absolute; width: 34px; height: 34px; border: 2px solid rgba(200,170,110,0.55); }
  .esquina--a { top: 30px; left: 30px; border-right: 0; border-bottom: 0; }
  .esquina--b { top: 30px; right: 30px; border-left: 0; border-bottom: 0; }
  .esquina--c { bottom: 30px; left: 30px; border-right: 0; border-top: 0; }
  .esquina--d { bottom: 30px; right: 30px; border-left: 0; border-top: 0; }

  .columna {
    position: absolute; top: 0; left: 0; width: 620px; height: 630px;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 0 0 88px;
  }
  .marca { display: flex; align-items: center; gap: 14px; margin-bottom: 26px; }
  .marca img { width: 38px; height: 38px; }
  .marca span {
    font-family: 'Spiegel'; font-weight: 600; font-size: 17px;
    letter-spacing: 0.20em; text-transform: uppercase; color: #c8aa6e;
  }
  .titular {
    font-family: 'Beaufort'; font-weight: 700; font-size: 57px; line-height: 1.06;
    letter-spacing: 0.005em; color: #f0e6d2; text-wrap: balance;
  }
  .regla { width: 76px; height: 3px; margin: 30px 0 24px; background: #c8aa6e; box-shadow: 0 0 22px rgba(200,170,110,0.45); }
  .bajada { font-size: 21px; line-height: 1.52; color: #a09b8c; max-width: 470px; }
</style></head><body>
  <div class="retrato"></div>
  <div class="velo"></div>
  <div class="filete"></div>
  <span class="esquina esquina--a"></span><span class="esquina esquina--b"></span>
  <span class="esquina esquina--c"></span><span class="esquina esquina--d"></span>
  <div class="columna">
    <div class="marca">
      <img src="file:///${CREST.replace(/\\/g, '/')}" alt="" />
      <span>Portfolio de desarrollo</span>
    </div>
    <h1 class="titular">Un portfolio con la estética de League of Legends</h1>
    <div class="regla"></div>
    <p class="bajada">${datos.hero.subtitulo}</p>
  </div>
</body></html>`

/*
 * El icono, en SVG y de un solo trazo.
 *
 * La primera version era un `div` con `border` y `clip-path` en poligono, y
 * quedaba mal: al recortar las esquinas del borde se perdian las juntas y el
 * marco se veia como cuatro barras sueltas en vez de un aro continuo. Aqui el
 * aro es un octogono de verdad, dibujado con dos poligonos concentricos (el
 * exterior en oro, el interior del color del fondo), que es la unica forma de
 * que las esquinas del bisel se cierren.
 *
 * Ademas el PNG sale de rasterizar este mismo SVG, no de una maqueta en HTML:
 * antes los dos ficheros eran diseños separados y no coincidian entre si.
 */
function svgIcono(L) {
  const margen = Math.round(L * 0.055)
  const grosor = Math.max(2, Math.round(L * 0.016))
  const bisel = Math.round(L * 0.14)
  const M = margen
  const R = L - margen
  const octogono = (v) =>
    `M${M + bisel} ${v} H${R - bisel} L${R} ${v + bisel} V${R - bisel} ` +
    `L${R - bisel} ${R} H${M + bisel} L${M} ${R - bisel} V${M + bisel} Z`

  const interior = Math.round(grosor * 1.6)
  const mI = M + interior
  const rI = R - interior
  const bI = Math.max(2, bisel - interior)
  const octogonoInterior = (v) =>
    `M${mI + bI} ${v} H${rI - bI} L${rI} ${v + bI} V${rI - bI} ` +
    `L${rI - bI} ${rI} H${mI + bI} L${mI} ${rI - bI} V${mI + bI} Z`

  const escudo = Math.round(L * 0.46)
  const escudoX = Math.round((L - escudo) / 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${L}" height="${L}" viewBox="0 0 ${L} ${L}">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#12222f"/><stop offset="1" stop-color="#040c15"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.24" cy="0.06" r="0.95">
      <stop offset="0" stop-color="#0596aa" stop-opacity="0.40"/>
      <stop offset="1" stop-color="#0596aa" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${L}" height="${L}" fill="url(#fondo)"/>
  <rect width="${L}" height="${L}" fill="url(#halo)"/>
  <path d="${octogono(M)}" fill="#c8aa6e"/>
  <path d="${octogonoInterior(M)}" fill="url(#fondo)"/>
  <image x="${escudoX}" y="${escudoX}" width="${escudo}" height="${escudo}" xlink:href="data:image/svg+xml;base64,${readFileSync(CREST).toString('base64')}"/>
</svg>
`
}

/* --------------------------------------------------------------- escritura */

const tmp = join(tmpdir(), `og-${process.pid}`)
mkdirSync(tmp, { recursive: true })

function render(html, ancho, alto, salida) {
  // `salida` es absoluta y `join` no la resuelve, solo la pega: hay que quedarse
  // con el nombre del fichero para el temporal.
  const pagina = join(tmp, `${basename(salida)}.html`)
  writeFileSync(pagina, html)
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${ancho},${alto}`,
      '--virtual-time-budget=6000',
      `--screenshot=${salida}`,
      `file:///${pagina.replace(/\\/g, '/')}`,
    ],
    { stdio: 'ignore' },
  )
}

    /* El SVG se rasteriza metiendolo en una pagina minima, para poder reuse el mismo render. */
function renderSVG(svg, L, salida) {
  render(
    `<!doctype html><html><head><meta charset="utf-8"><style>
       html,body{margin:0;padding:0;background:#040c15;overflow:hidden}
       svg{display:block;width:${L}px;height:${L}px}
     </style></head><body>${svg}</body></html>`,
    L,
    L,
    salida,
  )
}

const salidas = [
  { html: OG, w: 1200, h: 630, salida: join(PUB, 'og.png') },
  { svg: 180, salida: join(PUB, 'apple-touch-icon.png') },
  { svg: 512, salida: join(PUB, 'icon-512.png') },
]

for (const s of salidas) {
  if (s.svg) {
    renderSVG(svgIcono(s.svg), s.svg, s.salida)
  } else {
    render(s.html, s.w, s.h, s.salida)
  }
  const kb = Math.round((readFileSync(s.salida).length / 1024) * 10) / 10
  const dim = s.svg ? `${s.svg}x${s.svg}` : `${s.w}x${s.h}`
  console.log(`  ${relative(RAIZ, s.salida)}  ${dim}  ${kb} KB`)
}

/*
 * El favicon es el mismo SVG del icono, vectorial y sin rasterizar: pesa menos
 * que un PNG y se ve nitido en pantallas de alta densidad.
 */
writeFileSync(join(PUB, 'favicon.svg'), svgIcono(512))
console.log('  public/favicon.svg  vector')

rmSync(tmp, { recursive: true, force: true })
console.log('\nlisto. Recuerda que las metas de index.html llevan la URL absoluta.')
