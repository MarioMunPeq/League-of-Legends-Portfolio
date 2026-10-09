/**
 * Verifica la hidratacion en un Chrome de verdad.
 *
 *   node scripts/check-hidratacion.mjs
 *
 * Levanta el build de `dist/` y carga la pagina con el protocolo DevTools,
 * recogiendo lo que el navegador dice por consola. Es la unica forma de
 * pillar un desajuste entre el HTML pre-renderizado y el primer render de
 * React: `tsc` y `vite build` pasan igual, y el sitio se queda en blanco.
 *
 * No hay dependencias: Node 24 ya trae WebSocket, que es lo que hace falta
 * para hablar con el DevTools.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const RAIZ = process.cwd()
const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean).find(existsSync)

const PUERTO_SITIO = 4173
const PUERTO_CDP = 9333
const URL_SITIO = `http://localhost:${PUERTO_SITIO}/League-of-Legends-Portfolio/`

if (!CHROME) {
  console.error('No encuentro Chrome. Define CHROME_PATH.')
  process.exit(1)
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------------------------------------- servidor */

const preview = spawn(
  process.execPath,
  [join(RAIZ, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview',
   '--port', String(PUERTO_SITIO), '--strictPort'],
  { cwd: RAIZ, stdio: 'ignore' },
)

/* ------------------------------------------------------------------ CDP */

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${PUERTO_CDP}`,
  '--user-data-dir=' + join(process.env.TEMP || '.', `cdp-${process.pid}`),
  'about:blank',
], { stdio: 'ignore' })

const limpiar = () => {
  try { preview.kill() } catch {}
  try { chrome.kill() } catch {}
}
process.on('exit', limpiar)

async function targetWS() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PUERTO_CDP}/json/list`)
      const lista = await r.json()
      const pag = lista.find((t) => t.type === 'page')
      if (pag?.webSocketDebuggerUrl) return pag.webSocketDebuggerUrl
    } catch {}
    await esperar(250)
  }
  throw new Error('Chrome no abrio el puerto de DevTools')
}

const url = await targetWS()
const ws = new WebSocket(url)
await new Promise((res, rej) => {
  ws.addEventListener('open', res, { once: true })
  ws.addEventListener('error', rej, { once: true })
})

let id = 0
const pendientes = new Map()
const problemas = []
const avisos = []

ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pendientes.has(msg.id)) {
    pendientes.get(msg.id)(msg.result)
    pendientes.delete(msg.id)
    return
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    problemas.push('EXCEPCION: ' + (msg.params.exceptionDetails?.exception?.description
      || msg.params.exceptionDetails?.text))
  }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const texto = (msg.params.args || [])
      .map((a) => a.value ?? a.description ?? a.unserializableValue ?? '')
      .join(' ')
    if (msg.params.type === 'error') problemas.push('CONSOLA error: ' + texto)
    else if (msg.params.type === 'warning') avisos.push('CONSOLA aviso: ' + texto)
  }
  if (msg.method === 'Log.entryAdded') {
    const e = msg.params.entry
    if (e.level === 'error') problemas.push(`LOG ${e.source}: ${e.text} ${e.url ?? ''}`)
  }
})

const enviar = (method, params = {}) =>
  new Promise((res) => {
    const n = ++id
    pendientes.set(n, res)
    ws.send(JSON.stringify({ id: n, method, params }))
  })

await enviar('Runtime.enable')
await enviar('Log.enable')
await enviar('Page.enable')
await enviar('Network.enable')

await enviar('Page.navigate', { url: URL_SITIO })
await esperar(4000)

const evaluar = async (expr) => {
  const r = await enviar('Runtime.evaluate', { expression: expr, returnByValue: true })
  return r?.result?.value
}

const h1Antes = await evaluar("document.querySelectorAll('h1').length")
const texto = await evaluar("document.body.innerText.replace(/\\s+/g,' ').trim().length")
const interactua = await evaluar(`(() => {
  const b = [...document.querySelectorAll('button,[role="button"],a')].find(e => e.textContent.trim().length > 0)
  if (!b) return 'sin botones'
  b.click()
  return 'click en: ' + b.textContent.trim().slice(0, 40)
})()`)

await esperar(1200)

const fallosRed = await evaluar(`JSON.stringify(
  performance.getEntriesByType('resource')
    .filter(r => r.responseStatus >= 400)
    .map(r => r.responseStatus + ' ' + r.name)
)`)

const imgOk = await evaluar(`(() => {
  const imgs = [...document.images]
  return JSON.stringify({ total: imgs.length, rotas: imgs.filter(i => i.complete && i.naturalWidth === 0).length })
})()`)

console.log('\n== HIDRATACION ==')
console.log('  h1 en el DOM            :', h1Antes)
console.log('  caracteres de texto     :', texto)
console.log('  interaccion             :', interactua)
console.log('  imagenes rotas          :', imgOk)
console.log('  recursos HTTP >= 400    :', fallosRed)
/*
 * Enlaces profundos. `useHashRoute` arranca siempre en `inicio` para que la
 * hidratacion cuadre con el HTML pre-renderizado, y recoge el hash despues, en
 * un efecto. Si ese efecto no llegara a correr, estas rutas caerian todas en
 * `inicio` en silencio y el fallo no se veria en el build.
 */
console.log('\n== ENLACES PROFUNDOS ==')
for (const [hash, esperado] of [
  ['#/perfil', 'Perfil'],
  ['#/coleccion', 'Coleccion'],
  ['#/jugar', 'Jugar'],
  ['#/inicio', 'Inicio'],
]) {
  await enviar('Page.navigate', { url: URL_SITIO + hash })
  await esperar(2200)
  const urlActual = await evaluar('location.hash')
  const h1s = await evaluar(
    "JSON.stringify([...document.querySelectorAll('h1')].map(e => e.innerText.trim().slice(0,40)))",
  )
  const coincide = String(urlActual) === hash
  console.log(`  ${hash.padEnd(12)} hash=${String(urlActual).padEnd(12)} h1=${h1s}  ${coincide ? 'ok' : 'REVISAR'} (se esperaba ${esperado})`)
  if (!coincide) problemas.push(`enlace profundo ${hash}: el hash quedo en ${urlActual}`)
}

console.log('\n== ERRORES ==')
console.log('  errores:', problemas.length ? '\n    ' + problemas.join('\n    ') : 'ninguno')
console.log('  avisos                  :', avisos.length ? '\n    ' + avisos.join('\n    ') : 'ninguno')

ws.close()
limpiar()
process.exit(problemas.length ? 1 : 0)
