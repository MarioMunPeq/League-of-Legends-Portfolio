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

type Props = {
  /** arranca en el modo confirmado desde la colección */
  modoInicial?: string | null
  onConfirmar: (modo: string) => void
}

/**
 * Jugar -> modos de partida, como la pantalla PvP del cliente: fichas de
 * modo con emblema, acordeon de tipos de partida a la izquierda y boton de
 * confirmar centrado abajo. Confirmar lleva a la coleccion, donde cada
 * campeon es un proyecto.
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
        <span className="tab" role="tab" aria-selected="true" tabIndex={-1}>
          PVP
        </span>
        <span className="spacer" />
        <span className="jugar__badge">
          <Icon name="crown" size={16} />
          COMPETITIVO
        </span>
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

      <div className="jugar__foot">
        <div className="jugar__copy">
          <p className="jugar__desc">{modo.descripcion}</p>
        </div>

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

      <div className="jugar__confirm">
        <button type="button" className="confirmar" onClick={confirmar} {...sound}>
          <span className="confirmar__x" aria-hidden="true">
            ✕
          </span>
          <span className="confirmar__label">CONFIRMAR</span>
        </button>

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