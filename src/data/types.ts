export type ChampInfo = {
  attack: number
  defense: number
  magic: number
  difficulty: number
}

export type ChampSpell = {
  name: string
  icon: string
  description: string
}

export type Champ = {
  name: string
  displayName: string
  key: string
  title: string
  blurb: string
  tags: string[]
  info: ChampInfo
  /** el script solo baja el splash de los campeones que la app usa de fondo */
  hasSplash: boolean
  passive: {
    name: string
    icon: string
    description: string
  }
  spells: ChampSpell[]
}

export type Rango = 'hierro' | 'bronce' | 'plata' | 'oro' | 'platino' | 'esmeralda' | 'diamante'

export type Proyecto = {
  id: string
  /** clave de campeon en Data Dragon */
  campeon: string
  titulo: string
  claim: string
  descripcion: string
  /** papel asumido en el proyecto -> subtitulo de la pantalla de detalle */
  rol: string
  anio: string
  estado: 'En curso' | 'Estable' | 'En mantenimiento' | 'Archivado'
  stack: string[]
  tags: string[]
  metricas: { etiqueta: string; valor: string }[]
  highlights: string[]
  enlaces: { etiqueta: string; url: string }[]
  /** numero de partida en la coleccion, 1-indexado */
  orden: number
}

export type Material = {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  /**
   * El glifo sale de `MaterialIcon`: `id` es a la vez la clave del icono, de
   * modo que un material sin dibujo falla el validador de datos.
   */
  nivel: number
  destacado: boolean
}

export type EnlaceSocial = {
  id: string
  nombre: string
  handle: string
  url: string
  icono: 'github' | 'linkedin' | 'mail' | 'cv' | 'web'
  estado: 'En linea' | 'Ausente' | 'Ocupado'
}

export type Formacion = {
  periodo: string
  titulo: string
  centro: string
  detalle: string
}

export type Experiencia = {
  periodo: string
  puesto: string
  empresa: string
  resumen: string[]
}

export type Hito = {
  etiqueta: string
  valor: string
  descripcion: string
}

export type Perfil = {
  /** nombre real, como aparece en LinkedIn y en el CV */
  nombre: string
  /** handle publico: el mismo en GitHub y en el cliente */
  summoner: string
  nivel: number
  rango: Rango
  division: string
  /** puntos de maestria acumulados */
  maestria: number
  /** meses programando */
  meses: number
}

export type PortfolioData = {
  perfil: Perfil
  hero: {
    eyebrow: string
    titulo: string
    subtitulo: string
    descripcion: string
    /** campeon cuyo splash abre la pantalla de inicio */
    champFavorito: string
    /** campeon cuyo splash aparece en la ficha de perfil */
    portada?: string
    /**
     * Campeon del arte de fondo de Inicio. Va aparte de `champFavorito` porque
     * el fondo y el campeon que da nombre a la coleccion no tienen por que ser
     * el mismo: el arte es decoracion, la coleccion es contenido.
     */
    fondoInicio?: string
  }
  sobreMi: string[]
  formacion: Formacion[]
  experiencia: Experiencia[]
  hitos: Hito[]
  proyectos: Proyecto[]
  materiales: Material[]
  enlaces: EnlaceSocial[]
  contacto: {
    /** el portfolio no expone correo: el contacto es por GitHub o LinkedIn */
    github: string
    linkedin: string
  }
}
