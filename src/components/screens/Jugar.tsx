import { useState } from 'react'
import { MODOS } from '../../data/modos'
import { Icon } from '../ui/Icon'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import './screens.css'

type Props = {
  /** arranca en el modo confirmado desde la colección */
  modoInicial?: string | null
  onConfirmar: (modo: string) => void
}

/**
 * Jugar -> modos de partida, como la pantalla PvP del cliente: fichas de
 * modo con emblema, descripcion del modo elegido y boton de confirmar.
 * Confirmar lleva a la coleccion, donde cada campeon es un proyecto.
 */
export function Jugar({ modoInicial, onConfirmar }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('gold')
  const [elegido, setElegido] = useState(modoInicial ?? MODOS[0].id)

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

          <ol className="jugar__etapas">
            {modo.etapas.map((etapa, i) => (
              <li key={etapa}>
                <span className="jugar__etapa-num">{i + 1}</span>
                {etapa}
              </li>
            ))}
          </ol>
        </div>

        <button type="button" className="confirmar" onClick={confirmar} {...sound}>
          <span className="confirmar__x" aria-hidden="true">
            ✕
          </span>
          <span className="confirmar__label">CONFIRMAR</span>
        </button>
      </div>
    </div>
  )
}