/**
 * Curated font stacks for the typography lab.
 *
 * Each heading declares the body fonts that pair well with it. Fonts are
 * referenced by name with local fallbacks so the app stays offline friendly
 * and never loads a third-party font file.
 */

export const HEADING_FONTS = [
  {
    id: 'playfair-display',
    label: 'Playfair Display',
    stack: "'Playfair Display', Georgia, 'Times New Roman', serif",
    description: 'Serif editorial de alto contraste. Elegante y con personalidad.',
    bodyFonts: ['source-sans-3', 'lato', 'montserrat-body', 'open-sans', 'raleway-body'],
  },
  {
    id: 'montserrat',
    label: 'Montserrat',
    stack: "'Montserrat', 'Avenir Next', 'Segoe UI', sans-serif",
    description: 'Sans geométrica urbana. Moderna, firme y muy versátil.',
    bodyFonts: ['merriweather-body', 'open-sans', 'roboto', 'lora-body', 'hind'],
  },
  {
    id: 'poppins',
    label: 'Poppins',
    stack: "'Poppins', 'Avenir Next', 'Segoe UI', sans-serif",
    description: 'Sans geométrica de trazos circulares. Alegre y contemporánea.',
    bodyFonts: ['inter', 'open-sans', 'roboto', 'lora-body', 'source-sans-3'],
  },
  {
    id: 'oswald',
    label: 'Oswald',
    stack: "'Oswald', 'Arial Narrow', 'Helvetica Neue', sans-serif",
    description: 'Sans condensada de fuerte presencia. Ideal para titulares breves.',
    bodyFonts: ['open-sans', 'roboto', 'lato', 'merriweather-body', 'source-sans-3'],
  },
  {
    id: 'raleway',
    label: 'Raleway',
    stack: "'Raleway', 'Avenir Next', 'Segoe UI', sans-serif",
    description: 'Sans fina y elegante. Muy legible en tamaños grandes.',
    bodyFonts: ['open-sans', 'lato', 'merriweather-body', 'roboto', 'libre-baskerville'],
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    stack: "'Merriweather', Georgia, 'Times New Roman', serif",
    description: 'Serif robusta y cálida. Transmite cercanía y autoridad.',
    bodyFonts: ['open-sans', 'montserrat-body', 'lato', 'roboto', 'source-sans-3'],
  },
  {
    id: 'anton',
    label: 'Anton',
    stack: "'Anton', 'Arial Narrow', Impact, sans-serif",
    description: 'Sans impactante y condensada. Titulares que no pasan desapercibidos.',
    bodyFonts: ['roboto', 'open-sans', 'montserrat-body', 'lato', 'work-sans'],
  },
  {
    id: 'lora',
    label: 'Lora',
    stack: "'Lora', Georgia, 'Times New Roman', serif",
    description: 'Serif de transición con un toque caligográfico. Muy legible.',
    bodyFonts: ['open-sans', 'lato', 'roboto', 'montserrat-body', 'source-sans-3'],
  },
  {
    id: 'futura',
    label: 'Futura',
    stack: "'Futura', 'Avenir Next', 'Century Gothic', sans-serif",
    description: 'Sans geométrica clásica. Formas puras y aire atemporal.',
    bodyFonts: ['garamond', 'bodoni', 'baskerville', 'source-sans-3', 'open-sans'],
  },
  {
    id: 'proxima-nova',
    label: 'Proxima Nova',
    stack: "'Proxima Nova', 'Avenir Next', 'Segoe UI', sans-serif",
    description: 'Sans humanista equilibrada. Neutral y muy cómoda de leer.',
    bodyFonts: ['georgia', 'merriweather-body', 'garamond', 'inter', 'source-serif-4'],
  },
];

export const BODY_FONTS = [
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    stack: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans humanista abierta. Excelente para lectura prolongada.',
  },
  {
    id: 'lato',
    label: 'Lato',
    stack: "'Lato', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans cálida y sobria. Muy equilibrada en bloques de texto.',
  },
  {
    id: 'montserrat-body',
    label: 'Montserrat',
    stack: "'Montserrat', 'Avenir Next', 'Segoe UI', sans-serif",
    description: 'Sans geométrica. Aporta ritmo y presencia a los párrafos.',
  },
  {
    id: 'open-sans',
    label: 'Open Sans',
    stack: "'Open Sans', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans neutra y legible. Un comodín para cualquier pareja.',
  },
  {
    id: 'raleway-body',
    label: 'Raleway',
    stack: "'Raleway', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans ligera y elegante. Ideal con titulares editoriales.',
  },
  {
    id: 'merriweather-body',
    label: 'Merriweather',
    stack: "'Merriweather', Georgia, serif",
    description: 'Serif robusta. Da carácter a la lectura sin fatigar.',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    stack: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    description: 'Sans funcional y compacta. Muy presente en pantalla.',
  },
  {
    id: 'lora-body',
    label: 'Lora',
    stack: "'Lora', Georgia, serif",
    description: 'Serif con detalle caligográfico. Cálida y fluida.',
  },
  {
    id: 'hind',
    label: 'Hind',
    stack: "'Hind', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans de trazos suaves. Cómoda y discreta.',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: "'Inter', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans optimizada para interfaces. Muy clara a cualquier tamaño.',
  },
  {
    id: 'libre-baskerville',
    label: 'Libre Baskerville',
    stack: "'Libre Baskerville', Georgia, serif",
    description: 'Serif clásica de gran altura de x. Pausada y elegante.',
  },
  {
    id: 'work-sans',
    label: 'Work Sans',
    stack: "'Work Sans', 'Segoe UI', system-ui, sans-serif",
    description: 'Sans de diseño gráfico. Directa con un punto cálido.',
  },
  {
    id: 'garamond',
    label: 'Garamond',
    stack: "'Garamond', 'Iowan Old Style', Georgia, serif",
    description: 'Serif renacentista. Ligera, literaria y muy legible.',
  },
  {
    id: 'bodoni',
    label: 'Bodoni',
    stack: "'Bodoni', 'Bodoni MT', Didot, Georgia, serif",
    description: 'Serif didona de alto contraste. Sofisticada y delicada.',
  },
  {
    id: 'baskerville',
    label: 'Baskerville',
    stack: "'Baskerville', 'Iowan Old Style', Georgia, serif",
    description: 'Serif de transición. Equilibrio entre clasicismo y lectura.',
  },
  {
    id: 'georgia',
    label: 'Georgia',
    stack: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
    description: 'Serif familiar y robusta. Muy confiable en pantalla.',
  },
  {
    id: 'source-serif-4',
    label: 'Source Serif 4',
    stack: "'Source Serif 4', Georgia, serif",
    description: 'Serif contemporánea. Nítida y pensada para leer en digital.',
  },
];

export const DEFAULT_TYPOGRAPHY = {
  headingFont: 'playfair-display',
  bodyFont: 'source-sans-3',
  headingSize: 48,
  bodySize: 17,
  lineHeight: 1.6,
};

/**
 * @param {string} id
 * @returns {typeof HEADING_FONTS[number]}
 */
export function findHeadingFont(id) {
  return HEADING_FONTS.find((font) => font.id === id) || HEADING_FONTS[0];
}

/**
 * @param {string} id
 * @returns {typeof BODY_FONTS[number]}
 */
export function findBodyFont(id) {
  return BODY_FONTS.find((font) => font.id === id) || BODY_FONTS[0];
}

/**
 * Body fonts that work well with the selected heading font.
 * @param {string} headingId
 * @returns {typeof BODY_FONTS}
 */
export function selectBodyFonts(headingId) {
  const heading = findHeadingFont(headingId);
  const recommended = BODY_FONTS.filter((font) => heading.bodyFonts.includes(font.id));
  return recommended.length > 0 ? recommended : BODY_FONTS;
}
