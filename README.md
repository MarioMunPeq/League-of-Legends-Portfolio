# xNaque · Portfolio

Réplica de la interfaz del cliente de League of Legends como portfolio personal.
React + Vite + TypeScript, sin dependencias de UI externas.

## Comandos

```bash
npm install
npm run assets     # descarga los assets (idempotente; assets:force rehace todo)
npm run check      # verifica que toda referencia a /assets resuelva
npm run dev
npm run build      # check + tsc + vite build
npm run lint
```

## Estructura

```
lol-portfolio/
├─ public/assets/
│  ├─ champions/{square,splash}/   # 142 cuadrados + 11 splashes
│  ├─ ranked/{crest,frame}/        # 11 insignias vectoriales + marcos
│  ├─ mastery/                     # marcas de maestría
│  ├─ ui/{nav,roles,buttons,chrome,borders,meters,currency,hextech,states}
│  ├─ perks/{styles,trees,runes}/  # runas completas
│  ├─ spells/  passives/  items/  icons/
│  ├─ backgrounds/
│  └─ fonts/                       # spiegel + beaufortforlol
├─ public/audio/                   # 15 .ogg de hover/click
├─ src/
│  ├─ data/proyectos.json          # editable: perfil, proyectos, materiales, enlaces
│  ├─ data/{types,ranks,audio}.ts
│  ├─ data/champs.generated.ts     # lo escribe fetch-assets.mjs
│  ├─ components/
│  │  ├─ layout/  TopBar, SocialPanel
│  │  ├─ ui/      GoldButton, Fields, TabStrip, Icon
│  │  └─ screens/ Inicio, Perfil, Coleccion, Artesania, Seleccion, Lobby, DetalleProyecto
│  ├─ hooks/   AudioProvider, useAudio, useHashRoute
│  └─ styles/  tokens.css, riot.css
└─ scripts/  fetch-assets.mjs, assets.config.mjs, check-assets.mjs
```

## Mapeo cliente → portfolio

| Cliente | Pantalla | Contenido |
| --- | --- | --- |
| Barra superior | navegación | Inicio, Perfil, Campeones, Artesanía, Selección, Grupo |
| Inicio | `Inicio` | presentación con splash de fondo y CTA a contacto |
| Perfil | `Perfil` | about, hitos, experiencia, formación |
| Colección → Campeones | `Coleccion` | cada proyecto es un campeón, con su maestría |
| Artesanía / Botín | `Artesania` | stacks y tecnologías como materiales |
| Selección de campeón | `Seleccion` | elegir un campeón abre su proyecto |
| Lobby / grupo | `Lobby` | formulario de contacto |
| Barra social lateral | `SocialPanel` | enlaces externos como lista de amigos |

Las rutas son hash: `#/coleccion/orbe` abre la ficha de Orbe y funciona como deep link.

## Notas sobre los assets

- **Data Dragon**: los `.png` solo existen versionados (`/cdn/16.19.1/img/...`); los
  **splash `.jpg` solo existen sin versión** (`/cdn/img/champion/splash/X_0.jpg`).
  La ruta cruzada devuelve 403 en ambos sentidos.
- **Runas**: dan 403 en ddragon; salen de CommunityDragon (`perk-images/styles/...`).
- **Emblemas de rango**: `ranked-emblem/emblem-<rank>.png` son composiciones de
  1280x720 con el escudo diminuto al centro. La insignia que va junto al nivel usa los
  `ranked-mini-crests/*.svg`, que son vectores limpios de 20x20.
- **Splash**: solo se descargan los 11 que la app usa de fondo (los 10 proyectos más
  el héroe y la portada). Con los 173 serían ~28 MB; los cuadrados sí se bajan todos
  porque la grilla de Selección los necesita.
- **Nombres**: Data Dragon escribe `TahmKench`, `KSante`, `RekSai`. El mapeo a forma
  legible vive en `DISPLAY_NAMES` (`fetch-assets.mjs`); para los rangos, que en disco
  son ingleses y en interfaz son español, está `src/data/ranks.ts`.

## Personalización

Todo el contenido editable está en `src/data/proyectos.json`:

- `perfil` — nombre, nivel, rango, división, maestría
- `hero` — textos de la portada y fondos (`champFavorito`, `portada` son campeones)
- `proyectos[]` — un campeón por proyecto, con stack, métricas y enlaces
- `materiales[]` — tecnologías con nivel e icono (el icono es una runa de CommunityDragon)
- `enlaces[]` — los que aparecen en la barra social
- `contacto` — destinatario del formulario

Después de editar, `npm run check` valida que los campeones existan en el manifiesto
y que los iconos de materiales estén en disco.

El formulario de contacto abre el cliente de correo con `mailto:` y validación en el
navegador; no hay backend. Para Netlify Forms o Formspree habría que cambiar el
`enviar` de `src/components/screens/Lobby.tsx`.

## Aviso

Proyecto fan, no afiliado a Riot Games. League of Legends y todos sus personajes son
marcas de Riot Games. Los assets gráficos pertenecen a sus respectivos titulares.
