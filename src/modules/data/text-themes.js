/**
 * Sentence banks for the text generator. Every theme follows the same shape,
 * so the generator can mix openers, beats and closers without losing the tone.
 *
 * Templates accept three placeholders: {character}, {place} and {object}.
 */

export const TEXT_THEMES = [
  {
    id: 'sci-fi',
    label: 'Ciencia ficción',
    tagline: 'Futuros posibles, tecnología y preguntas incómodas',
    characters: ['Mara Voss', 'Elián Ríos', 'Nadia Kovács', 'Tomás Vela'],
    places: [
      'la estación orbital Ámbar',
      'la colonia de Nuevo Cádiz',
      'el cinturón de Kepler',
      'la ciudad sumergida de Lerna',
    ],
    objects: [
      'un archivo prohibido',
      'un núcleo de memoria',
      'una señal sin origen',
      'un prototipo de conciencia artificial',
    ],
    openers: [
      'En {place}, {character} encuentra {object} y decide guardar el secreto.',
      'La rutina de {character} se rompe cuando {object} empieza a emitir una frecuencia imposible.',
      'Nadie en {place} parece recordar la noche en que {character} llegó con {object} entre las manos.',
      'Cuando el sistema de {place} falla, {character} descubre que {object} no era parte del diseño.',
    ],
    beats: [
      'Las autoridades aseguran que todo está bajo control, pero {character} detecta mensajes que solo {object} puede descifrar.',
      'Una vieja aliada ofrece ayuda a cambio de algo que {character} juró no volver a usar.',
      'Cada respuesta abre una pregunta peor: si la señal viene del futuro, alguien tuvo que enviarla.',
      'El tiempo se agota y la única forma de detener la falla es desconectar aquello que mantiene con vida a la colonia.',
      'En los registros aparece un nombre borrado, el mismo que {character} lleva tatuado desde la infancia.',
      'La tripulación se divide entre revelar la verdad o conservar la calma hasta que llegue el relevo.',
    ],
    closers: [
      'Con la cuenta atrás en marcha, {character} deberá elegir entre la verdad y la última posibilidad de volver a casa.',
      'Lo que empezó como una anomalía se convierte en la primera prueba de que nadie está solo.',
      'Al final, la señal no pedía rescate: pedía permiso para quedarse.',
      'Y cuando la puerta se abre, {character} comprende que el futuro ya estaba allí, esperando.',
    ],
    titles: [
      'La última señal',
      'Órbita de cristal',
      'El archivo Ámbar',
      'Nadie está solo',
      'Memoria cero',
      'El futuro ya estaba allí',
    ],
  },
  {
    id: 'noir',
    label: 'Cine negro',
    tagline: 'Ciudades húmedas, secretos a media voz y deudas pendientes',
    characters: ['Vera Salgado', 'Julián Corso', 'Lola Mendieta', 'Bruno Cifuentes'],
    places: [
      'el puerto de la ciudad',
      'un club de jazz en la calle Mayor',
      'la comisaría del distrito 7',
      'un hotel de carretera',
    ],
    objects: [
      'una fotografía quemada',
      'un maletín sin dueño',
      'una grabación de voz',
      'una llave de habitación',
    ],
    openers: [
      'La noche en que {character} aceptó el caso, {place} olía a lluvia y a gasolina.',
      'En {place}, {character} encuentra {object} y comprende que alguien ha estado borrando sus pasos.',
      'Todo empieza con una llamada anónima y con {object} sobre la mesa de {character}.',
      'Cuando {character} llega a {place}, la persona con la que había quedado ya no respira.',
    ],
    beats: [
      'La versión oficial no encaja: los testigos cambian de historia cada vez que {character} vuelve a preguntar.',
      'Una deuda antigua vuelve a la superficie y arrastra consigo a la persona equivocada.',
      'La grabación revela una conversación que nadie debería haber oído, y ahora {character} también la ha oído.',
      'Cada pista conduce a {place}, pero allí nadie admite haber visto {object}.',
      'La policía quiere cerrar el caso; {character} solo necesita una noche más para demostrar que se equivocan.',
      'El silencio de la ciudad se rompe con un disparo que nadie quiere denunciar.',
    ],
    closers: [
      'Cuando amanece, {character} sabe que la verdad no le devolverá lo que perdió, pero al menos le dará un nombre.',
      'La ciudad sigue girando, indiferente, mientras {character} guarda {object} en el bolsillo y se aleja.',
      'No hay héroes en esta historia, solo personas que decidieron no mirar hacia otro lado.',
      'Y en {place}, alguien apaga la última luz sabiendo que la cuenta sigue abierta.',
    ],
    titles: [
      'Noche en el distrito 7',
      'La llave de la habitación 9',
      'Lluvia sobre el puerto',
      'El caso Salgado',
      'Nadie lo vio',
      'La última luz',
    ],
  },
  {
    id: 'adventure',
    label: 'Aventura',
    tagline: 'Mapas incompletos, rutas imposibles y tesoros que no son de oro',
    characters: ['Alba Ferrer', 'Mateo Quinn', 'Sira Ndiaye', 'Hugo Ballester'],
    places: [
      'una isla sin nombre',
      'el desfiladero de las Ánimas',
      'un templo cubierto por la selva',
      'el puerto de San Telmo',
    ],
    objects: ['un mapa incompleto', 'una brújula que no apunta al norte', 'una llave de piedra', 'un diario de viaje'],
    openers: [
      'El mapa que {character} heredó de su abuelo señalaba {place}, pero no aparecía en ningún atlas.',
      'Cuando la tormenta arrastra a {character} hasta {place}, la expedición ya no tiene vuelta atrás.',
      'En {place}, {character} encuentra {object} y una advertencia escrita en una lengua que nadie reconoce.',
      'La leyenda decía que {place} concedía un deseo; {character} solo quería encontrar a quien desapareció allí.',
    ],
    beats: [
      'La ruta se bifurca y cada camino exige un precio distinto: agua, tiempo o confianza.',
      'Un miembro de la expedición guarda silencio sobre {object}, y {character} empieza a sospechar.',
      'El terreno cede bajo sus pies y el grupo queda separado justo cuando la marea empieza a subir.',
      'En las paredes de {place} aparecen marcas frescas: alguien estuvo allí antes y dejó un mensaje.',
      'La brújula gira sin sentido y {character} comprende que el camino correcto es el que nadie quiere tomar.',
      'Un pacto con los habitantes de la zona obliga a {character} a elegir entre el tesoro y la promesa.',
    ],
    closers: [
      'Con el sol cayendo sobre {place}, {character} entiende que algunas riquezas solo valen si se comparten.',
      'La expedición vuelve sin {object}, pero con una historia que nadie creerá.',
      'Y en el mapa, el lugar que antes era una mancha ahora tiene un nombre: el de quien se atrevió a buscarlo.',
      'Al final, {character} no encuentra lo que buscaba, sino lo que necesitaba.',
    ],
    titles: [
      'El mapa incompleto',
      'La isla sin nombre',
      'La brújula del sur',
      'Bajo el templo',
      'La promesa del desfiladero',
      'Lo que queda del tesoro',
    ],
  },
  {
    id: 'drama',
    label: 'Drama',
    tagline: 'Regresos, silencios familiares y verdades que pesan',
    characters: ['Irene Alvarado', 'Samuel Rueda', 'Clara Ortiz', 'Daniel Sarmiento'],
    places: [
      'la casa familiar junto al río',
      'un pueblo que se vacía',
      'el hospital de la capital',
      'un teatro cerrado',
    ],
    objects: ['una carta sin abrir', 'un vestido heredado', 'una cinta de cassette', 'un cuaderno de cuentas'],
    openers: [
      'Cuando {character} vuelve a {place} después de veinte años, nadie le pregunta por qué se fue.',
      'En {place}, {character} encuentra {object} y recuerda una conversación que creía olvidada.',
      'La familia se reúne en {place} para decidir qué hacer con la casa, pero {character} se niega a firmar.',
      'Una llamada desde {place} obliga a {character} a enfrentarse a la persona que juró no volver a ver.',
    ],
    beats: [
      'Las viejas heridas se reabren durante la cena y cada silencio dice más que una acusación.',
      'La carta revela una verdad que cambia el lugar de todos en la familia.',
      'Mientras el pueblo se prepara para la fiesta, {character} busca {object} en habitaciones que ya no reconoce.',
      'Una decisión tomada hace años vuelve a estar sobre la mesa, y esta vez nadie puede evitarla.',
      '{character} descubre que {object} no era un recuerdo, sino una promesa pendiente.',
      'La enfermedad de un ser querido obliga a todos a hablar de lo que llevaban tiempo callando.',
    ],
    closers: [
      'Al amanecer, {character} comprende que volver no arregla el pasado, pero puede cambiar lo que viene.',
      'La casa queda en silencio, y por primera vez en años ese silencio no duele.',
      'Nadie dice «te perdono», pero alguien deja la puerta abierta.',
      'Y {character} se queda un rato más, solo para ver cómo entra la luz por la ventana.',
    ],
    titles: [
      'La casa junto al río',
      'La carta sin abrir',
      'Veinte años después',
      'El silencio de los Alvarado',
      'La puerta abierta',
      'Lo que no dijimos',
    ],
  },
  {
    id: 'comedy',
    label: 'Comedia',
    tagline: 'Planes absurdos, malentendidos y finales que nadie ensayó',
    characters: ['Rita Peláez', 'Nico Sanabria', 'Marisol K.', 'Fer Alcaraz'],
    places: [
      'una boda en el campo',
      'la oficina del tercer piso',
      'un mercado de barrio',
      'una residencia de estudiantes',
    ],
    objects: [
      'un bizcocho demasiado grande',
      'una maleta equivocada',
      'un disfraz de dinosaurio',
      'un contrato sin leer',
    ],
    openers: [
      'Todo lo que podía salir mal en {place} empieza a salir mal cuando {character} llega con {object}.',
      '{character} solo quería resolver un trámite rápido, pero terminó en {place} con {object} en las manos.',
      'La boda era perfecta hasta que {object} apareció flotando en la piscina.',
      'Nadie sabe cómo, pero {character} ha reservado {place} para una celebración que no existe.',
    ],
    beats: [
      'Para disimular, {character} inventa una coartada que crece hasta incluir a media ciudad.',
      'La persona equivocada recibe el mensaje equivocado y decide tomarse la revancha con entusiasmo.',
      'Cada intento de arreglarlo provoca una cadena de malentendidos más difícil de desmontar.',
      'Un invitado inesperado confunde a {character} con alguien importante y nadie se atreve a corregirlo.',
      'El grupo improvisa un plan que funciona solo porque nadie tiene tiempo de leerlo entero.',
      'Cuando parece que todo está perdido, {object} se convierte en la solución más absurda posible.',
    ],
    closers: [
      'Al final, la fiesta termina con todos bailando y nadie recuerda exactamente qué se celebraba.',
      '{character} sale de {place} con una multa, dos amigos nuevos y una historia para no contar en la cena.',
      'La verdad sale a la luz, pero para entonces ya nadie está dispuesto a renunciar al pastel.',
      'Y en el grupo de mensajes queda la prueba de que, a veces, el caos también sabe organizarse.',
    ],
    titles: [
      'Una boda muy imperfecta',
      'El bizcocho de la discordia',
      'Reserva para nadie',
      'Maleta equivocada',
      'La oficina del tercer piso',
      'Todo bajo control (más o menos)',
    ],
  },
  {
    id: 'horror',
    label: 'Terror',
    tagline: 'Casas que recuerdan, pueblos que callan y puertas que no estaban',
    characters: ['Elena Ríos', 'Marcos Vale', 'la señora Durán', 'Iván Sotelo'],
    places: [
      'una casa rural aislada',
      'el ala cerrada del sanatorio',
      'un bosque sin pájaros',
      'un pueblo junto al embalse',
    ],
    objects: [
      'una muñeca sin ojos',
      'una grabadora encendida',
      'una puerta que no estaba allí',
      'un espejo cubierto',
    ],
    openers: [
      'La primera noche en {place}, {character} escucha pasos en el piso de arriba.',
      'El pueblo entero evita hablar de {place}, y {character} comprende por qué cuando encuentra {object}.',
      'Cuando {character} llega a {place}, la puerta está abierta y dentro no hay nadie.',
      'La grabadora se enciende sola y reproduce una conversación que aún no ha ocurrido.',
    ],
    beats: [
      'Las marcas en la pared cambian de sitio cada vez que {character} aparta la mirada.',
      'Alguien ha dejado {object} en la habitación, aunque la habitación llevaba años cerrada.',
      'Los vecinos sonríen demasiado y repiten la misma frase cuando se les pregunta por los desaparecidos.',
      'Cada noche, la misma voz susurra un nombre distinto; la última vez pronunció el de {character}.',
      'La única salida del pueblo aparece cortada por la niebla, y el teléfono solo emite una respiración.',
      '{character} descubre que {object} esconde un registro de todos los que intentaron irse antes.',
    ],
    closers: [
      'Cuando la mañana llega, {character} ya no está seguro de haber salido de {place}.',
      'La casa queda vacía, pero la grabadora sigue encendida.',
      'Nadie vuelve a mencionar a {character}, y eso, en {place}, significa que algo ha terminado.',
      'Y en el espejo, por un instante, aparece alguien que no debería estar allí.',
    ],
    titles: [
      'La casa que respira',
      'No mires al espejo',
      'El pueblo sin pájaros',
      'La grabadora',
      'La última habitación',
      'Alguien llamó a la puerta',
    ],
  },
];

/**
 * @param {string} id
 * @returns {typeof TEXT_THEMES[number]}
 */
export function findTextTheme(id) {
  return TEXT_THEMES.find((theme) => theme.id === id) || TEXT_THEMES[0];
}
