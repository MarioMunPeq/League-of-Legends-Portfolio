import { useState } from 'react'
import { MODOS } from '../../data/modos'
import { Icon } from '../ui/Icon'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import './screens.css'

/** Los tipos de partida del cliente, en el acordeon de la izquierda. */
const COLAS = [
  { id: 'rapido', titulo: 'MODO RÁPIDO', nota: 'Reglas nuevas para partidas más rápidas' },
  { id: 'reclutamiento', titulo: 'RECLUTAMIENTO', nota: 'Busca a los cuatro proyectos de una vez' },
  { id: 'clasificatoria', titulo: 'CLASIFICATORIA', nota: 'Sin límite de tiempo para leer' },
]

/**
 * Pestañas de la cabecera del cliente. Solo PVP tiene contenido en el
 * portfolio: las demas se pintan igual que en la captura, pero sin pulsador.
 */
const PESTANAS = ['PVP', 'COOPERATIVA VS. IA', 'ENTRENAMIENTO']

/** A la derecha del filete, como en el cliente. */
const PERSONALIZADAS = ['CREAR PARTIDA PERSONALIZADA', 'UNIRSE A PARTIDA PERSONALIZADA']

type Props = {
  /** arranca en el modo confirmado desde la colección */
  modoInicial?: string | null
  onConfirmar: (modo: string) => void
}

/**
 * Jugar -> modos de partida, como la pantalla PvP del cliente: cabecera con los
 * tipos de partida, carrusel de cinco fichas de modo con su filete de oro
 * separando el grupo de TFT, panel con la descripcion y el acordeon de tipos
 * de partida a la izquierda, y boton de confirmar centrado abajo. Confirmar
 * lleva a la coleccion, donde cada campeon es un proyecto.
 */
export function Jugar({ modoInicial, onConfirmar }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('gold')
  const [elegido, setElegido] = useState(modoInicial ?? MODOS[0].id)
  const [abierta, setAbierta] = useState<string | null>(COLAS[0]?.id ?? null)

  const modo = MODOS.find((m) => m.id === elegido) ?? MODOS[0]

  const confirmar = () => {
    play('click')
    onConfirmar(modo.id)
  }

  return (
    <div className="jugar">
      <div className="jugar__tabs">
        {PESTANAS.map((p) => (
          <span key={p} className={`jugar__tab ${p === 'PVP' ? 'jugar__tab--on' : ''}`}>
            {p}
          </span>
        ))}

        <span className="jugar__sep" aria-hidden="true" />

        {PERSONALIZADAS.map((p) => (
          <span key={p} className="jugar__tab">
            {p}
          </span>
        ))}

        {/* el trofeo de la clasificatoria, en el extremo derecho de la cabecera */}
        <button
          type="button"
          className="jugar__trofeo"
          aria-label="Ver la clasificatoria"
          aria-expanded={abierta === 'clasificatoria'}
          onClick={() => setAbierta(abierta === 'clasificatoria' ? null : 'clasificatoria')}
          {...sound}
        >
          <Icon name="trophy" size={22} />
        </button>
      </div>

      {/* el fondo de montañas, como el de la pantalla de modos del cliente */}
      <div className="jugar__bg" aria-hidden="true" />

      <div className="jugar__modes" role="radiogroup" aria-label="Modos de partida">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={m.id === elegido}
            className={`mode ${m.id === elegido ? 'mode--active' : ''}`}
            onClick={() => {
              play('nav-click')
              setElegido(m.id)
            }}
            {...sound}
          >
            <img className="mode__icon" src={m.icono} alt="" />
            <span className="mode__jugadores">{m.jugadores}</span>
            <span className="mode__titulo">{m.titulo}</span>
          </button>
        ))}
      </div>

      {/* filete del cliente: separa el carrusel del panel de descripcion */}
      <div className="jugar__rule" aria-hidden="true" />

      <div className="jugar__body">
        <div className="jugar__panel">
          <p className="jugar__desc">{modo.descripcion}</p>

          <div className="jugar__rule jugar__rule--short" aria-hidden="true" />

          <div className="colas">
            {COLAS.map((c) => (
              <div key={c.id} className="colas__item">
                <button
                  type="button"
                  className="colas__head"
                  aria-expanded={abierta === c.id}
                  onClick={() => setAbierta(abierta === c.id ? null : c.id)}
                  {...sound}
                >
                  <span className="colas__bullet" aria-hidden="true">
                    {abierta === c.id ? '▴' : '◈'}
                  </span>
                  {c.titulo}
                </button>
                {abierta === c.id && <p className="colas__nota">{c.nota}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="jugar__confirm">
        {/* el boton entero (marco, flecha cian y la X) es el arte del cliente */}
        <button
          type="button"
          className="confirmar"
          aria-label="Confirmar y abrir la colección"
          onClick={confirmar}
          {...sound}
        />

        <ol className="jugar__etapas">
          {modo.etapas.map((etapa, i) => (
            <li key={etapa}>
              <span className="jugar__etapa-num">{i + 1}</span>
              {etapa}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}