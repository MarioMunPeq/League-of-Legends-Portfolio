import { asset } from '../../data/assets'
import { useAudio, useButtonSound } from '../../hooks/useAudio'

type Props = {
  /** etiqueta del boton; el cliente escribe JUGAR en mayusculas */
  label?: string
  size?: 'md' | 'lg'
  className?: string
  onClick: () => void
}

/**
 * La placa de jugar del cliente.
 *
 * El cliente no la pinta con un recorte suelto: son dos piezas pegadas, el
 * escudo de League (la L de oro sobre el globo cian, con su aro) y, a su
 * derecha, una placa oscura con el filo cian que acaba en punta. Aqui se compone
 * con CSS porque el recorte son dos poligonos y un pseudoelemento inset.
 *
 * Medidas de la captura (references/lobby.png): la placa son 240 x 80 px dentro
 * de una barra de 152, o sea 1.6 x 0.53 de la barra.
 */
export function PlayButton({ label = 'JUGAR', size = 'md', className = '', onClick }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('gold')
  return (
    <button
      type="button"
      className={`play${size === 'lg' ? ' play--lg' : ''}${className ? ` ${className}` : ''}`}
      onClick={() => {
        play('nav-click')
        onClick()
      }}
      {...sound}
    >
      <span className="play-crest" aria-hidden="true">
        <img src={asset('assets/ui/chrome/league-logo-active.svg')} alt="" />
      </span>
      <span className="play-plate">
        <span className="play-label">{label}</span>
      </span>
    </button>
  )
}