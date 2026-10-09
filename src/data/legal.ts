/**
 * Aviso legal del portfolio.
 *
 * Vive aqui y no en el JSX porque aparece en dos sitios (el panel social de
 * escritorio y la pestaña de contacto de la ficha), y duplicar el texto en dos
 * componentes es como se acaba desincronizado.
 *
 * Antes estaba en un banner fijo al pie de todas las pantallas. Ocupaba media
 * columna en vertical y empujaba el contenido hacia abajo en cada una de las
 * cinco pestañas, sin aportar nada que el lector no supiera ya. Un aviso legal
 * no necesita presencia permanente: necesita estar a un clic y ser legible.
 */
export const AVISO_FAN =
  'Proyecto fan, no afiliado a Riot Games. League of Legends es una marca registrada de Riot Games. Este portfolio replica su interfaz con fines educativos y de portafolio; los assets gráficos pertenecen a sus respectivos titulares.'

/** Version corta, para el pie del panel social, donde no cabe el texto entero. */
export const AVISO_FAN_CORTO =
  'Proyecto fan, no afiliado a Riot Games. League of Legends es una marca registrada de Riot.'
