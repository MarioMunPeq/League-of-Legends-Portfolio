import { useState } from 'react'
import { GoldButton } from './GoldButton'
import { Icon } from './Icon'
import { useAudio } from '../../hooks/useAudio'
import type { PortfolioData } from '../../data/types'
import '../screens/screens.css'

type Props = {
  contacto: PortfolioData['contacto']
  /** nombre de cuenta, para los textos del panel */
  summoner: string
}

/**
 * Contacto sin correo. El portfolio no publica ninguna direccion: el visitante
 * llega a GitHub o LinkedIn, que es adonde se escribe de verdad. No hay
 * formulario porque sin servidor un `mailto:` seria un correo disfrazado.
 */
export function FormularioContacto({ contacto, summoner }: Props) {
  const { play } = useAudio()
  const [copiado, setCopiado] = useState<string | null>(null)

  const handle = summoner.toLowerCase()

  const copiar = async (id: string, texto: string) => {
    play('click')
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(id)
    } catch {
      // sin permiso de portapapeles el enlace sigue sirviendo: no es fatal
      setCopiado(null)
    }
  }

  return (
    <div className="contacto__panel">
      <h3>CONTACTOS</h3>
      <p className="muted" style={{ fontSize: '0.875rem' }}>
        No hay formulario porque no hay correo publicado. Si queres escribirme, estos son los dos
        canales abiertos; en ambos soy <strong>{handle}</strong>.
      </p>

      <div className="contacto__redes">
        <a
          className="contacto__red"
          href={contacto.github}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="contacto__red-icon">
            <Icon name="github" size={22} />
          </span>
          <span className="contacto__red-text">
            <span className="contacto__red-label">GitHub</span>
            <span className="contacto__red-valor">{handle}</span>
          </span>
          <Icon name="external" size={14} />
        </a>

        <a
          className="contacto__red"
          href={contacto.linkedin}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="contacto__red-icon">
            <Icon name="linkedin" size={22} />
          </span>
          <span className="contacto__red-text">
            <span className="contacto__red-label">LinkedIn</span>
            <span className="contacto__red-valor">Desarrollador web · DAM</span>
          </span>
          <Icon name="external" size={14} />
        </a>
      </div>

      <div className="row" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          className="btn btn--gold btn--lg"
          href={contacto.linkedin}
          target="_blank"
          rel="noreferrer noopener"
        >
          ESCRIBIR POR LINKEDIN
        </a>
        <GoldButton variant="ghost" onClick={() => void copiar('git', handle)}>
          {copiado === 'git' ? 'COPIADO' : 'COPIAR USUARIO'}
        </GoldButton>
      </div>

      <p className="muted" style={{ fontSize: '0.75rem' }}>
        Sin formulario ni correo: el contacto ocurre enteramente dentro de estas dos plataformas.
      </p>

      {/*
        El aviso legal vive aqui. Antes estaba en un banner fijo al pie de todas
        las pantallas, que en vertical se comia una parte importante del alto y
        se repetia cinco veces sin aportar nada. Esta pestana es donde tiene
        sentido: es la unica seccion que habla de quien firma el trabajo.
      */}
      <p className="contacto__legal">
        <strong>Proyecto fan, no afiliado a Riot Games.</strong> League of Legends es una marca
        registrada de Riot Games. Este portfolio replica su interfaz con fines educativos y de
        portafolio; los assets gráficos pertenecen a sus respectivos titulares.
      </p>
    </div>
  )
}