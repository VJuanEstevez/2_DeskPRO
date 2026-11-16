/**
 * Curated font stacks for the typography lab.
 *
 * Everything is built with locally available families (system fonts) so the
 * app stays offline friendly and never loads a third-party font file. Each
 * heading font declares the body fonts that pair well with it.
 */

export const HEADING_FONTS = [
  {
    id: 'editorial-serif',
    label: 'Serif editorial',
    stack: "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif",
    description: 'Clásica y cálida. Aporta carácter sin perder legibilidad.',
    bodyFonts: ['humanist-sans', 'verdana', 'system-sans'],
  },
  {
    id: 'humanist-sans',
    label: 'Sans humanista',
    stack: "Optima, 'Gill Sans', Candara, 'Segoe UI', system-ui, sans-serif",
    description: 'Trazos abiertos y proporciones amables, ideal para titulares cercanos.',
    bodyFonts: ['charter-serif', 'georgia-serif', 'palatino-serif', 'system-sans'],
  },
  {
    id: 'geometric-sans',
    label: 'Sans geométrica',
    stack: "'Avenir Next', Avenir, 'Century Gothic', Futura, 'Trebuchet MS', sans-serif",
    description: 'Formas circulares y aire contemporáneo. Funciona muy bien en tamaños grandes.',
    bodyFonts: ['charter-serif', 'georgia-serif', 'palatino-serif', 'system-sans'],
  },
  {
    id: 'grotesque-sans',
    label: 'Grotesca neutra',
    stack: "'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif",
    description: 'Sobria y directa. Deja que el contenido sea el protagonista.',
    bodyFonts: ['charter-serif', 'georgia-serif', 'palatino-serif', 'system-sans'],
  },
  {
    id: 'didone-serif',
    label: 'Serif didona',
    stack: "Didot, 'Bodoni MT', 'Times New Roman', serif",
    description: 'Alto contraste entre trazos. Elegante para portadas y titulares breves.',
    bodyFonts: ['system-sans', 'helvetica', 'humanist-sans'],
  },
  {
    id: 'slab-serif',
    label: 'Serif egipcia',
    stack: "Rockwell, 'Rockwell Nova', 'Courier New', Georgia, serif",
    description: 'Trazos gruesos y presencia sólida, con un punto industrial.',
    bodyFonts: ['system-sans', 'helvetica', 'humanist-sans'],
  },
  {
    id: 'mono-display',
    label: 'Monoespaciada',
    stack: "'SF Mono', ui-monospace, 'Cascadia Mono', Menlo, Consolas, monospace",
    description: 'Técnica y precisa. Perfecta para titulares con acento de sistema.',
    bodyFonts: ['charter-serif', 'georgia-serif', 'system-sans'],
  },
  {
    id: 'condensed-sans',
    label: 'Sans condensada',
    stack: "'Avenir Next Condensed', 'Helvetica Neue', 'Arial Narrow', sans-serif",
    description: 'Ocupa poco ancho y gana altura. Útil para titulares de varias líneas.',
    bodyFonts: ['charter-serif', 'georgia-serif', 'palatino-serif', 'system-sans'],
  },
];

export const BODY_FONTS = [
  {
    id: 'system-sans',
    label: 'Sans del sistema',
    stack: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    description: 'Neutra, eficiente y familiar en cualquier pantalla.',
  },
  {
    id: 'humanist-sans',
    label: 'Sans humanista',
    stack: "Optima, 'Gill Sans', Candara, 'Segoe UI', system-ui, sans-serif",
    description: 'Cálida y legible, con un tono más editorial que la sans del sistema.',
  },
  {
    id: 'helvetica',
    label: 'Grotesca neutra',
    stack: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    description: 'Compacta y limpia. Muy cómoda en bloques de texto cortos.',
  },
  {
    id: 'verdana',
    label: 'Verdana',
    stack: 'Verdana, Tahoma, Geneva, sans-serif',
    description: 'Amplia y de gran altura de x. Excelente para lectura en pantalla.',
  },
  {
    id: 'charter-serif',
    label: 'Serif Charter',
    stack: "Charter, 'Bitstream Charter', Cambria, Georgia, serif",
    description: 'Serif robusta, pensada para leer durante largos periodos.',
  },
  {
    id: 'georgia-serif',
    label: 'Serif Georgia',
    stack: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
    description: 'Familiar y muy legible, con un aire clásico y periodístico.',
  },
  {
    id: 'palatino-serif',
    label: 'Serif Palatino',
    stack: "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif",
    description: 'Proporciones renacentistas y un ritmo de lectura pausado.',
  },
  {
    id: 'mono-body',
    label: 'Monoespaciada',
    stack: "'SF Mono', ui-monospace, 'Cascadia Mono', Menlo, Consolas, monospace",
    description: 'Para textos breves, notas técnicas o datos que deben alinearse.',
  },
];

export const DEFAULT_TYPOGRAPHY = {
  headingFont: 'editorial-serif',
  bodyFont: 'humanist-sans',
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
