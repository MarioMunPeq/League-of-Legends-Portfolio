/**
 * Iconos de los materiales de Artesania, dibujados en SVG en linea.
 *
 * Antes se reutilizaban runas de CommunityDragon como icono: se rompia al no
 * existir el archivo y ademas cada lenguaje repetia el mismo dibujo. Aqui cada
 * material tiene su propio glifo, dentro de la misma placa cuadrada que usa el
 * cliente para sus objetos, y el color lo fija la categoria.
 */

export type MaterialIconName =
  // Lenguajes
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'java'
  | 'kotlin'
  | 'csharp'
  | 'sql'
  | 'html-css'
  // Interfaces
  | 'react'
  | 'threejs'
  | 'gsap'
  | 'mapbox'
  | 'css-arquitectura'
  | 'vite'
  | 'tailwind'
  | 'web-audio'
  | 'd3-force'
  | 'unity-godot'
  // Datos
  | 'zustand'
  | 'firebase'
  // Plataformas
  | 'liferay'
  | 'odoo'
  | 'pega'
  | 'power-platform'
  | 'android'
  // IA y datos
  | 'scikit-learn'
  | 'pandas'
  | 'pytorch'
  | 'ollama-groq'
  // Calidad
  | 'git'
  | 'pytest'
  | 'pwa'
  | 'a11y'
  | 'figma'

/** Placa del objeto: cuadrado con las esquinas cortadas, como en la tienda. */
const PLATE = 'M5 1.4h14l3.6 3.6v14L19 22.6H5l-3.6-3.6V5Z'

type Glyph = {
  fill?: boolean
  d?: string
  /** circulo */
  cx?: number
  cy?: number
  r?: number
  /** elipse */
  rx?: number
  ry?: number
  /** rectangulo */
  x?: number
  y?: number
  w?: number
  h?: number
  /** radio de las esquinas del rectangulo */
  rr?: number
  /** giro de la elipse alrededor de (12, 12) */
  rot?: number
}

/** Marcas de texto: TS, JS, Py, K. El resto son pictogramas. */
const MARKS: Partial<Record<MaterialIconName, string>> = {
  typescript: 'TS',
  javascript: 'JS',
  python: 'Py',
  kotlin: 'K',
}

const GLYPHS: Record<MaterialIconName, Glyph[]> = {
  /* ---------------------------------------------------------- Lenguajes */
  typescript: [],
  javascript: [],
  python: [],
  java: [
    { d: 'M5.5 8.5h10V13a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V8.5Z' },
    { d: 'M15.5 9.6H17a2.4 2.4 0 0 1 0 4.8h-1.5' },
    { d: 'M5 19.4h11' },
  ],
  kotlin: [
    { d: 'M12 4.6 17.6 8v8L12 19.4 6.4 16V8Z' },
    { d: 'M12 8.4v7.2M9.4 12l5.2-3.6M9.4 12l5.2 3.6', rot: 0 },
  ],
  csharp: [
    { d: 'M9.8 5.6 8.2 18.4' },
    { d: 'M15.6 5.6 14 18.4' },
    { d: 'M5.6 10h12.2' },
    { d: 'M4.8 14.2H17' },
  ],
  sql: [
    { d: 'M6 7.6c0-1.4 2.7-2.6 6-2.6s6 1.2 6 2.6-2.7 2.6-6 2.6-6-1.2-6-2.6Z' },
    { d: 'M6 7.6v8.8c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V7.6' },
    { d: 'M6 12c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6' },
  ],
  'html-css': [{ d: 'M9 8 5.8 12 9 16' }, { d: 'M15 8l3.2 4L15 16' }, { d: 'M13.4 6.6 10.6 17.4' }],

  /* ---------------------------------------------------------- Interfaces */
  react: [
    { cx: 12, cy: 12, rx: 7.4, ry: 2.9 },
    { cx: 12, cy: 12, rx: 7.4, ry: 2.9, rot: 60 },
    { cx: 12, cy: 12, rx: 7.4, ry: 2.9, rot: 120 },
    { cx: 12, cy: 12, r: 1.8, fill: true },
  ],
  threejs: [
    { d: 'M12 4.8 18.4 8.4v7.2L12 19.2 5.6 15.6V8.4Z' },
    { d: 'M5.6 8.4 12 12l6.4-3.6' },
    { d: 'M12 12v7.2' },
  ],
  gsap: [
    { d: 'M17.4 12a5.4 5.4 0 1 1-1.8-4.1' },
    { d: 'M17.8 6v3.4h-3.4' },
    { cx: 12, cy: 12, r: 1.7, fill: true },
  ],
  mapbox: [
    { d: 'M4.8 7.4 9.8 5.6l4.4 1.8 5-1.8v10.6l-5 1.8-4.4-1.8-5 1.8Z' },
    { d: 'M9.8 5.6v10.6M14.2 7.4v10.6' },
    { cx: 12, cy: 11.4, r: 1.5, fill: true },
  ],
  'css-arquitectura': [
    { d: 'M12 4.6 18.6 8.2 12 11.8 5.4 8.2Z' },
    { d: 'M5.4 11.6 12 15.2l6.6-3.6' },
    { d: 'M5.4 15 12 18.6l6.6-3.6' },
  ],
  vite: [
    { d: 'M12 4.4 19 9v6l-7 4.6L5 15V9Z' },
    { d: 'M12.9 8.2 10.2 12.6h1.7l-.9 3.4 2.9-4.6h-1.8Z', fill: true },
  ],
  tailwind: [
    { d: 'M4 13.4c2.4-2.9 4-2.9 6 0s3.6 2.9 5.4 0 2.6-2.4 4.6-1.2' },
    { d: 'M4 18.2c2.4-2.9 4-2.9 6 0s3.6 2.9 5.4 0 2.6-2.4 4.6-1.2' },
  ],
  'web-audio': [
    { d: 'M4.6 9.4h2.8l4.2-3.6v12.4l-4.2-3.6H4.6Z' },
    { d: 'M14.6 9.6v4.8' },
    { d: 'M16.8 7.6v8.8' },
    { d: 'M19 10.6v2.8' },
  ],
  'd3-force': [
    { d: 'M12 7.2 6.2 11.6M12 7.2l5.8 4.4M12 7.2v9M12 16.2l-5.8 1.4M12 16.2l5.8 1.4' },
    { cx: 12, cy: 6.8, r: 1.9, fill: true },
    { cx: 5.6, cy: 12, r: 1.7, fill: true },
    { cx: 18.4, cy: 12, r: 1.7, fill: true },
    { cx: 12, cy: 16.6, r: 1.9, fill: true },
  ],
  'unity-godot': [
    {
      d: 'M7.6 8.8h8.8a4 0 0 1 4 4v1.6a2.6 2.6 0 0 1-4.6 1.7L14.6 15H9.4l-1.2 1.1A2.6 2.6 0 0 1 3.6 14.4v-1.6a4 4 0 0 1 4-4Z',
    },
    { d: 'M7 12.2v2.6M5.7 13.5h2.6' },
    { cx: 15.6, cy: 12.4, r: 0.9, fill: true },
    { cx: 17.8, cy: 14.1, r: 0.9, fill: true },
  ],

  /* ---------------------------------------------------------------- Datos */
  zustand: [
    { d: 'M4.6 8.6h14.8v9.8H4.6z' },
    { d: 'M3 5.4h18l-1.2 3.2H4.2Z' },
    { d: 'M12.6 10.4 9.9 13.4h1.6l-.7 2.6 2.5-3.4h-1.7Z', fill: true },
  ],
  firebase: [
    {
      d: 'M12 4.4c3 3.3 5.6 5.4 5.6 9.2a5.6 5.6 0 0 1-11.2 0c0-2.3 1-3.9 2.5-5.3.3 1.2 1 2 1.9 2.4.5-2.3-.2-4.3 1.2-6.3Z',
    },
  ],

  /* ---------------------------------------------------------- Plataformas */
  liferay: [{ d: 'M12 4.4 17.8 7.8v7.6L12 18.8 6.2 15.4V7.8Z' }, { d: 'M10.4 8.6v6.2h3.6' }],
  odoo: [{ cx: 12, cy: 12, r: 6.6 }, { cx: 12, cy: 12, r: 2.5, fill: true }],
  pega: [{ cx: 12, cy: 12, r: 6.6 }, { d: 'M9.6 14.8V9.2h2.9a2.6 2.6 0 0 1 0 5.2H9.6' }],
  'power-platform': [{ d: 'M12 4.2v7.4' }, { d: 'M8 7.2a5.6 5.6 0 1 0 8 0' }],
  android: [
    { d: 'M7 11.6a5 5 0 0 1 10 0v3H7Z' },
    { d: 'M5.2 14.6v3M18.8 14.6v3' },
    { d: 'M9.6 6.6 8.2 4.8M14.4 6.6l1.4-1.8' },
    { cx: 10, cy: 12.8, r: 0.85, fill: true },
    { cx: 14, cy: 12.8, r: 0.85, fill: true },
  ],

  /* ----------------------------------------------------------- IA y datos */
  'scikit-learn': [
    { cx: 7.2, cy: 7.6, r: 1.2, fill: true },
    { cx: 9.6, cy: 11.6, r: 1.2, fill: true },
    { cx: 7, cy: 16.4, r: 1.2, fill: true },
    { cx: 16.6, cy: 8.6, r: 1.2, fill: true },
    { cx: 15, cy: 13.4, r: 1.2, fill: true },
    { cx: 17, cy: 17, r: 1.2, fill: true },
    { d: 'M12 5.4v13.2' },
  ],
  pandas: [
    { d: 'M4.6 18.4V5.2' },
    { d: 'M4.6 18.4h14.8' },
    { d: 'M8.4 16.4v-5' },
    { d: 'M12.6 16.4V8.4' },
    { d: 'M16.8 16.4V6.2' },
  ],
  pytorch: [
    { d: 'M7 8.4 13.2 9.9M7 11.8l6.2 1.6M7 15.2l6.2-1.6M13.6 11.2 18 12.4' },
    { cx: 5.6, cy: 7.4, r: 1.5 },
    { cx: 5.6, cy: 12, r: 1.5 },
    { cx: 5.6, cy: 16.6, r: 1.5 },
    { cx: 13.6, cy: 10.6, r: 1.5 },
    { cx: 13.6, cy: 15, r: 1.5 },
    { cx: 18.4, cy: 12.8, r: 1.5, fill: true },
  ],
  'ollama-groq': [
    { x: 6.4, y: 6.4, w: 11.2, h: 11.2, rr: 2.4 },
    { d: 'M12 3.4v3M12 17.6v3M3.4 12h3M17.6 12h3' },
    { d: 'M12.8 9.4 10.3 13h1.7l-.8 2.6 2.6-3.8h-1.8Z', fill: true },
  ],

  /* -------------------------------------------------------------- Calidad */
  git: [
    { cx: 7.4, cy: 6, r: 2.2 },
    { cx: 7.4, cy: 18, r: 2.2 },
    { cx: 17, cy: 10.4, r: 2.2 },
    { d: 'M7.4 8.2v7.6' },
    { d: 'M17 12.6c0 3.4-3.2 4.3-5.8 5.1' },
  ],
  pytest: [
    { d: 'M10 4.6v5.2L5.9 16.8a2 0 0 0 1.7 3h8.8a2 0 0 0 1.7-3L14 9.8V4.6' },
    { d: 'M8.8 4.6h6.4' },
    { d: 'm10.4 14.9 1.9 1.9 3.3-3.5' },
  ],
  pwa: [
    { x: 6, y: 4.4, w: 12, h: 15.2, rr: 2.6 },
    { d: 'M15.4 11.8a3.2 3.2 0 1 1-1.3-2.6' },
    { d: 'M15.8 6.8v2.6h-2.6' },
    { d: 'M10 17.4h4' },
  ],
  a11y: [
    { cx: 12, cy: 5.2, r: 1.7, fill: true },
    { d: 'M4.8 9.2h14.4' },
    { d: 'M12 9.2v5.4' },
    { d: 'M12 14.6 9.3 19.6' },
    { d: 'M12 14.6l2.7 5' },
  ],
  figma: [
    { x: 6.4, y: 4, w: 5.4, h: 5.4, rr: 1.7 },
    { x: 6.4, y: 9.3, w: 5.4, h: 5.4, rr: 1.7 },
    { x: 6.4, y: 14.6, w: 5.4, h: 5.4, rr: 1.7 },
    { cx: 15.6, cy: 6.7, r: 2.7 },
    { cx: 15.6, cy: 12, r: 2.7 },
  ],
}

/** Tinte de cada categoria: el glifo hereda el color del contenedor. */
const COLOR_CATEGORIA: Record<string, string> = {
  Lenguajes: '#5aa9ff',
  Interfaces: '#3fc2d4',
  Datos: '#5fce7f',
  Plataformas: '#b98cff',
  'IA y datos': '#ff7d7d',
  Calidad: '#e0c184',
}

const colorCategoria = (categoria: string) => COLOR_CATEGORIA[categoria] ?? '#c8aa6e'

type Props = {
  name: MaterialIconName
  /** categoria del material: fija el color del glifo */
  categoria?: string
  size?: number
  className?: string
}

export function MaterialIcon({ name, categoria, size = 40, className }: Props) {
  const glifos = GLYPHS[name]
  const marca = MARKS[name]

  return (
    <svg
      className={`material-icon ${className ?? ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={categoria ? { color: colorCategoria(categoria) } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path className="material-icon__plate" d={PLATE} />
      {marca ? (
        <text className="material-icon__mark" x="12" y="16">
          {marca}
        </text>
      ) : (
        <g className="material-icon__glyph">
          {glifos.map((g, i) =>
            'd' in g ? (
              <path key={i} d={g.d} transform={g.rot ? `rotate(${g.rot} 12 12)` : undefined} />
            ) : 'cx' in g ? (
              g.rx !== undefined ? (
                <ellipse
                  key={i}
                  cx={g.cx}
                  cy={g.cy}
                  rx={g.rx}
                  ry={g.ry}
                  transform={g.rot ? `rotate(${g.rot} 12 12)` : undefined}
                />
              ) : (
                <circle key={i} cx={g.cx} cy={g.cy} r={g.r} className="material-icon__solid" />
              )
            ) : (
              <rect key={i} x={g.x} y={g.y} width={g.w} height={g.h} rx={g.rr} />
            ),
          )}
        </g>
      )}
    </svg>
  )
}