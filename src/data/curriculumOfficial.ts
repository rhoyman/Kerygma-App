import { Competencia, SaberBásico, Criterio } from "../types";

export const STAGES = ["Infantil", "Primaria", "Secundaria", "Bachillerato"] as const;

export const STAGE_LEVELS: Record<string, string[]> = {
  "Infantil": ["3 años", "4 años", "5 años"],
  "Primaria": ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria"],
  "Secundaria": ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
  "Bachillerato": ["1º Bachillerato", "2º Bachillerato"]
};

// 6 Competencias específicas LOMLOE Religión Primaria
export const COMPETENCIAS_PRIMARIA: Omit<Competencia, "criteriosEvaluación">[] = [
  {
    id: "ce-pri-1",
    description: "1. Descubrir, identificar y expresar los elementos clave de la dignidad y la identidad personal en situaciones vitales cercanas, a través de biografías inspiradoras y relatos bíblicos de alcance antropológico, para ir conformando la propia identidad y sus relaciones con autonomía, responsabilidad y empatía."
  },
  {
    id: "ce-pri-2",
    description: "2. Descubrir, reconocer y estimar la dimensión socioemocional expresada en la participación en diferentes estructuras de pertenencia, desarrollando destrezas y actitudes sociales teniendo en cuenta algunos principios generales de la ética cristiana, para la mejora de la convivencia y la sostenibilidad del planeta."
  },
  {
    id: "ce-pri-3",
    description: "3. Identificar e interpretar las situaciones que perjudican o mejoran la buena convivencia, analizándolas con las claves personales y sociales de la propuesta cristiana, para fomentar el crecimiento moral, la cooperación con los demás y el desarrollo de valores orientados al bien común."
  },
  {
    id: "ce-pri-4",
    description: "4. Comprender y admirar el patrimonio cultural en algunas de sus expresiones más significativas, disfrutando de su contemplación, analizando el universo simbólico y vital que transmiten, para valorar la propia identidad cultural, promover el diálogo intercultural y generar creaciones artísticas."
  },
  {
    id: "ce-pri-5",
    description: "5. Explorar, desarrollar y apreciar la propia interioridad y experiencia espiritual, reconociéndola en las propias emociones, afectos, símbolos y creencias, conociendo la experiencia de personajes relevantes de la tradición judeocristiana y de otras religiones, para favorecer el autoconocimiento personal, entender las vivencias de los otros y promover el diálogo y el respeto entre las diferentes tradiciones religiosas."
  },
  {
    id: "ce-pri-6",
    description: "6. Comprender los contenidos básicos del cristianismo, valorando su contribución a la sociedad, para disponer de una síntesis personal que permita dialogar, desde la propia identidad social y cultural, con otras tradiciones religiosas y áreas de conocimiento."
  }
];

// Criterios de evaluación para Primaria 1º
export const CRITERIOS_PRIMARIA_1: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.1", description: "1.1. Observar en los relatos y personajes bíblicos valores fundamentales del ser humano, relacionándolas con el desarrollo de su autonomía y responsabilidad en el grupo-clase.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.1", description: "2.1. Reconocer los vínculos y relaciones con los grupos de pertenencia, comparándolos con los de Jesús de Nazaret, identificando hábitos y principios que ayudan a generar un clima de afectividad, respeto, solidaridad e inclusión.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.1", description: "3.1. Visualizar e identificar qué situaciones cotidianas promueven una convivencia pacífica, a través de la escucha y análisis de relatos bíblicos, para aprender a resolver pacífica e inclusivamente los conflictos.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.1", description: "4.1. Relacionar algunos pasajes bíblicos con expresiones artísticas, sirviéndose de la observación y análisis, para potenciar la creatividad y la comunicación a través de diversos lenguajes.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.1", description: "5.1. Tomar conciencia de la propia interioridad a través de narraciones y biografías cristianas significativas, para favorecer el autoconocimiento personal y las vivencias de los otros.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.1", description: "6.1. Reconocer que Jesús de Nazaret es el centro del mensaje cristiano, valorando sus aportaciones para la persona y la sociedad en entornos diversos.", isMinimum: true }]
};

// Criterios de evaluación para Primaria 2º
export const CRITERIOS_PRIMARIA_2: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.2", description: "1.2. Reconocer algunas de las características que definen la autonomía personal, desarrollando un autoconcepto ajustado y una autoestima saludable, para la propia aceptación personal y para integrarse en los grupos de pertenencia con asertividad y responsabilidad, a la luz del Evangelio.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.2", description: "2.2. Apreciar y mostrar actitudes de respeto, mediación y cuidado del prójimo y de la naturaleza, derivadas del análisis de las palabras y acciones de Jesús de Nazaret.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.2", description: "3.2. Describir algunas situaciones cercanas de desamparo, fragilidad y vulnerabilidad, empatizando con las personas desfavorecidas y reconociendo la preferencia de Jesús de Nazaret por los que más sufren.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.2", description: "4.2. Descubrir cómo el pueblo cristiano muestra su fe en la vida diaria en diferentes fiestas y manifestaciones religiosas, comprendiendo el vínculo que las une al Evangelio y su actualización en la comunidad cristiana.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.2", description: "5.2. Identificar las propias emociones, sentimientos y vivencias religiosas, compartiéndolos y reconociéndolos en el otro, teniendo en cuenta la experiencia de personajes relevantes de la tradición judeocristiana.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.2", description: "6.2. Valorar la Biblia como libro sagrado y como narración del encuentro de Dios con la humanidad, descubriendo su lugar en la comunidad cristiana y en la cultura.", isMinimum: true }]
};

// Criterios de evaluación para Primaria 3º
export const CRITERIOS_PRIMARIA_3: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.3", description: "1.3. Reconocer y expresar a través de composiciones orales, escritas y artísticas los elementos clave de la dignidad y la identidad personal, relacionándolas con diferentes situaciones vitales, teniendo en cuenta biografías y relatos bíblicos de vocación y misión.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.3", description: "2.3. Adquirir destrezas y habilidades sociales que potencien su inclusión en el grupo y entornos culturales cercanos, a través de la lectura de pasajes bíblicos del Nuevo Testamento y el análisis de comportamientos de cuidado, responsabilidad, solidaridad y perdón.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.3", description: "3.3. Colaborar y promover con los demás el análisis de situaciones que perjudican o mejoran la convivencia y la puesta en marcha de acciones responsables que favorezcan la construcción de un mundo más equitativo e inclusivo.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.3", description: "4.3. Admirar diferentes expresiones del patrimonio cultural y de la religiosidad popular, reconociendo su belleza y su significado religioso y su vinculación con textos bíblicos, valorando su aportación a la identidad cultural.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.3", description: "5.3. Reconocer y valorar el encuentro con los demás como oportunidad para el desarrollo de la propia interioridad, teniendo como referencia los encuentros de Jesús de Nazaret.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.3", description: "6.3. Comprender la importancia de la alianza de Dios con el pueblo de Israel que tiene su continuación en Jesucristo, y sus aportaciones sociales y culturales en la historia.", isMinimum: true }]
};

// Criterios de evaluación para Primaria 4º
export const CRITERIOS_PRIMARIA_4: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.4", description: "1.4. Desarrollar sensibilidad sobre el valor de la vida y de la igual dignidad del ser humano, y su papel en el cuidado de la naturaleza, tomando como modelo personajes bíblicos y de la tradición cristiana.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.4", description: "2.4. Apreciar las relaciones sociales como fuente de felicidad y desarrollo personal, tomando como punto de partida los relatos sobre la comunidad de Jesús de Nazaret, los Apóstoles y la Iglesia, asumiendo responsabilidades en el cuidado de las personas y del planeta.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.4", description: "3.4. Distinguir algunos de los valores propios del cristianismo y su presentación en pasajes de los evangelios, para aplicar la cooperación y la mediación, la resolución pacífica de conflictos y la construcción del bien común en situaciones cercanas.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.4", description: "4.4. Observar en las celebraciones litúrgicas, los espacios sagrados y los sacramentos de la Iglesia elementos esenciales del cristianismo, poniéndolos en relación con la vida de Jesús y la tradición de la Iglesia.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.4", description: "5.4. Identificar las virtudes y actitudes que ayudan a un crecimiento personal y espiritual, a través del autoconocimiento y del acceso a otras experiencias de personajes de la tradición cristiana.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.4", description: "6.4. Valorar la Iglesia como comunidad que ha continuado con la misión de Jesús resucitado, desde las primeras comunidades cristianas hasta la actualidad, reconociendo sus celebraciones, tradiciones y contribuciones sociales.", isMinimum: true }]
};

// Criterios de evaluación para Primaria 5º
export const CRITERIOS_PRIMARIA_5: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.5", description: "1.5. Identificar los principios y virtudes que promueven y respetan la dignidad de todas las personas, reflexionando sobre experiencias personales y de aula, desarrollando autonomía, juicio crítico y responsabilidad.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.5", description: "2.5. Promover actitudes que impulsen la mejora de la convivencia y el cuidado del planeta, conociendo y aplicando algunos principios de la ética cristiana, plasmando sus conclusiones en diferentes soportes.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.5", description: "3.5. Reflexionar sobre algunos principios generales de la ética cristiana, conociendo su realización en biografías significativas y movimientos sociales, descubriendo cómo pueden ser puestos en práctica en nuestros entornos sociales cercanos y virtuales.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.5", description: "4.5. Comprender y valorar cómo el patrimonio religioso cristiano contribuye a la construcción de la identidad de las personas y de los pueblos, e inspira la expresión de la propia vivencia personal y social a través de diversos lenguajes.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.5", description: "5.5. Asumir el desarrollo de la interioridad como uno de los elementos fundamentales en la construcción del propio sistema de valores y creencias, mediante el análisis y la reflexión de textos bíblicos y de otras tradiciones religiosas.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.5", description: "6.5. Comprender las consecuencias éticas y morales, personales y sociales, del mensaje de Jesucristo para la construcción del propio sistema de valores y creencias y para la promoción del bien común.", isMinimum: true }]
};

// Criterios de evaluación para Primaria 6º
export const CRITERIOS_PRIMARIA_6: Record<string, Criterio[]> = {
  "ce-pri-1": [{ id: "crit-pri-1.6", description: "1.6. Expresar con autonomía a través de diversos lenguajes comunicativos la identidad personal reconociendo, desde la visión cristiana, la singularidad de todas las personas, desarrollando empatía y valorando la pluralidad.", isMinimum: true }],
  "ce-pri-2": [{ id: "crit-pri-2.6", description: "2.6. Participar en acciones solidarias y de servicio a la comunidad, reconociendo aquellos grupos sociales más vulnerables, teniendo en cuenta cómo Jesucristo cambió su realidad y las consecuencias que ello ha tenido para la historia de la humanidad.", isMinimum: true }],
  "ce-pri-3": [{ id: "crit-pri-3.6", description: "3.6. Cooperar activamente en la construcción de una convivencia pacífica y democrática reconociendo, en iniciativas y proyectos eclesiales, aquellos valores morales que promueven el bien común.", isMinimum: true }],
  "ce-pri-4": [{ id: "crit-pri-4.6", description: "4.6. Reconocer y apreciar, desde la propia identidad cultural, la pluralidad de tradiciones y expresiones presentes en el contexto social, promueviendo el respeto y el conocimiento mutuo que favorece el encuentro y el diálogo intercultural.", isMinimum: true }],
  "ce-pri-5": [{ id: "crit-pri-5.6", description: "5.6. Valorar la experiencia religiosa como desarrollo personal y social de la dimensión espiritual, interpretando y respetando lo religioso en la pluralidad de culturas y promoviendo el diálogo interreligioso.", isMinimum: true }],
  "ce-pri-6": [{ id: "crit-pri-6.6", description: "6.6. Conocer el Credo de la fe cristiana, poniéndolo en diálogo con otras áreas de conocimiento científico y cultural y con otras religiones.", isMinimum: true }]
};

// 6 Competencias específicas LOMLOE Religión Infantil
export const COMPETENCIAS_INFANTIL: Omit<Competencia, "criteriosEvaluación">[] = [
  {
    id: "ce-inf-1",
    description: "1. Descubrir, experimentar y expresar la identidad personal a través del conocimiento de su cuerpo y el desarrollo de sus capacidades afectivas y cualidades, mediante el acercamiento a figuras bíblicas y personas significativas, para adquirir autonomía en sus actividades cotidianas y hábitos básicos de relación."
  },
  {
    id: "ce-inf-2",
    description: "2. Reconocer, experimentar y apreciar las relaciones personales y con el entorno, desarrollando habilidades sociales y actitudes de respeto, a través de la escucha y comprensión de narraciones bíblicas, para promover valores de la vida en comunidad y contribuir así a la fraternidad humana."
  },
  {
    id: "ce-inf-3",
    description: "3. Observar, aceptar y disfrutar la diversidad personal y social descubriendo en sus entornos próximos situaciones en las que pueda cooperar en el cuidado de la casa común, desde el reconocimiento de los valores del mensaje y los hechos de Jesús de Nazaret, para generar espacios inclusivos y pacíficos de convivencia."
  },
  {
    id: "ce-inf-4",
    description: "4. Explorar y admirar diferentes entornos naturales, sociales, culturales y artísticos disfrutando de sus manifestaciones más significativas y descubriendo sus valores cristianos, para desarrollar creatividad, sensibilidad estética y sentido de pertenencia."
  },
  {
    id: "ce-inf-5",
    description: "5. Descubrir, manifestar y generar gusto por cultivar su interioridad, explorando pensamientos, emociones, sentimientos y vivencias, admirando diferentes expresiones de la tradición judeocristiana y otras tradiciones religiosas, para crecer con la libertad y seguridad necesarias que posibiliten el desarrollo de la dimensión espiritual y las bases del propio sistema de valores y creencias."
  },
  {
    id: "ce-inf-6",
    description: "6. Conocer y apreciar la figura de Jesús de Nazaret y de la comunidad eclesial, a través de relatos bíblicos y manifestaciones religiosas del entorno, para reconocer lo específico de la tradición cristiana en un contexto social de pluralidad religiosa."
  }
];

// Criterios de evaluación para Infantil 3 años
export const CRITERIOS_INFANTIL_3ANOS: Record<string, Criterio[]> = {
  "ce-inf-1": [{ id: "crit-inf-1.1", description: "1.1. Adquirir autonomía en el cuidado de su cuerpo y en la realización de sus actividades cotidianas, atendiendo a las indicaciones establecidas en común para el aula.", isMinimum: true }],
  "ce-inf-2": [{ id: "crit-inf-2.1", description: "2.1. Desarrollar hábitos de acogida y amabilidad aprendidos a través de cuentos y narraciones bíblicas sobre la vida en comunidad.", isMinimum: true }],
  "ce-inf-3": [{ id: "crit-inf-3.1", description: "3.1. Propiciar espacios inclusivos y pacíficos de convivencia, tomando como ejemplo las palabras y acciones de Jesús de Nazaret y reconociendo su importancia para la construcción de un mundo más fraterno y compasivo.", isMinimum: true }],
  "ce-inf-4": [{ id: "crit-inf-4.1", description: "4.1. Expresar en diversos lenguajes las costumbres sociales del entorno que reflejan la vivencia de valores cristianos, mostrando respeto y aprecio.", isMinimum: true }],
  "ce-inf-5": [{ id: "crit-inf-5.1", description: "5.1. Explorar el propio mundo imaginativo y simbólico y reconocer las propias emociones, descubriéndolo en momentos de silencio, quietud y espacios de reflexión guiada que permita descubrir la vida interior.", isMinimum: true }],
  "ce-inf-6": [{ id: "crit-inf-6.1", description: "6.1. Identificar a Jesús de Nazaret como el núcleo esencial del cristianismo a través de la escucha de narraciones bíblicas y la observación de tradiciones y obras artísticas.", isMinimum: true }]
};

// Criterios de evaluación para Infantil 4 años
export const CRITERIOS_INFANTIL_4ANOS: Record<string, Criterio[]> = {
  "ce-inf-1": [{ id: "crit-inf-1.2", description: "1.2. Reconocer hábitos básicos de relación tomando como referencia modelos cristianos y proponiendo actitudes para la vida en la familia y en la escuela.", isMinimum: true }],
  "ce-inf-2": [{ id: "crit-inf-2.2", description: "2.2. Adquirir valores de escucha y agradecimiento en sus relaciones sociales cercanas para relacionarse con los demás de manera asertiva.", isMinimum: true }],
  "ce-inf-3": [{ id: "crit-inf-3.2", description: "3.2. Reconocer sentimientos y actitudes que fomenten el respeto, la compasión y el perdón, observándolas en personajes de narraciones bíblicas.", isMinimum: true }],
  "ce-inf-4": [{ id: "crit-inf-4.2", description: "4.2. Conocer las manifestaciones culturales, religiosas y artísticas, despertando hábitos de admiración, respeto, diálogo intercultural y sentido de pertenencia.", isMinimum: true }],
  "ce-inf-5": [{ id: "crit-inf-5.2", description: "5.2. Identificar y expresar algunos sentimientos y convicciones, conociendo oraciones, canciones y prácticas religiosas, acogiéndolas con una actitud de asertividad y respeto.", isMinimum: true }],
  "ce-inf-6": [{ id: "crit-inf-6.2", description: "6.2. Distinguir las actitudes y valores propios de la vida cristiana, escuchando narraciones de los Evangelios y de los Hechos de los Apóstoles y apreciando las acciones de servicio en la vida en comunidad.", isMinimum: true }]
};

// Criterios de evaluación para Infantil 5 años
export const CRITERIOS_INFANTIL_5ANOS: Record<string, Criterio[]> = {
  "ce-inf-1": [{ id: "crit-inf-1.3", description: "1.3. Expresar las capacidades afectivas y cualidades reconociendo posibilidades y limitaciones, utilizándolos para su cuidado y el de su entorno y para afrontar dificultades.", isMinimum: true }],
  "ce-inf-2": [{ id: "crit-inf-2.3", description: "2.3. Generalizar actitudes de respeto y mediación para generar vínculos significativos de amistad y afecto, escuchando con atención relatos bíblicos en los que se considere la importancia de la fraternidad en la comunidad cristiana y en las relaciones sociales.", isMinimum: true }],
  "ce-inf-3": [{ id: "crit-inf-3.3", description: "3.3. Comprender actitudes de cooperación para la consecución de espacios pacíficos de convivencia, escuchando narraciones y relatos bíblicos que propongan modelos de respeto a la diversidad y de fraternidad.", isMinimum: true }],
  "ce-inf-4": [{ id: "crit-inf-4.3", description: "4.3. Desarrollar la capacidad artística y la sensibilidad estética en armonía con su propia identidad personal y cultural.", isMinimum: true }],
  "ce-inf-5": [{ id: "crit-inf-5.3", description: "5.3. Describir las creencias y valores, propias y de otros, comunicándolas con seguridad a través de diversos lenguajes, reconociendo el silencio y la oración como elementos de la experiencia espiritual y religiosa.", isMinimum: true }],
  "ce-inf-6": [{ id: "crit-inf-6.3", description: "6.3. Reconocer y respetar los valores, actitudes y características básicas del cristianismo y de otras religiones.", isMinimum: true }]
};

export const SABERES_INFANTIL: SaberBásico[] = [
  // Bloque A
  { id: "sb-inf-a1", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.1. Progresiva autorregulación, responsabilidad, cuidado de sí mismo, en los hábitos básicos de relación.", isMinimum: true },
  { id: "sb-inf-a2", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.2. El cuidado y el respeto del cuerpo y de la naturaleza en la visión cristiana.", isMinimum: true },
  { id: "sb-inf-a3", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.3. El valor del ser humano, con sus límites y posibilidades, como hijo de Dios.", isMinimum: true },
  { id: "sb-inf-a4", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.4. La igualdad y dignidad de todos los seres humanos a la luz del Evangelio.", isMinimum: true },
  { id: "sb-inf-a5", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.5. Actitud de respeto ante la exteriorización de emociones, creencias, pensamientos, ilusiones y miedos de los demás.", isMinimum: true },
  { id: "sb-inf-a6", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.6. Comunicación de las propias emociones cuando perdonamos y somos perdonados.", isMinimum: true },
  { id: "sb-inf-a7", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.7. Cualidades y talentos personales propuestos en figuras bíblicas y otras biografías significativas.", isMinimum: true },
  { id: "sb-inf-a8", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.8. Relatos bíblicos y biografías de otros personajes de la cultura del entorno que ponen de manifiesto el valor de la interioridad y la experiencia religiosa.", isMinimum: true },
  { id: "sb-inf-a9", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.9. Valoración de la belleza y su capacidad para ser transmisora de un sentido de pertenencia y valores.", isMinimum: true },
  { id: "sb-inf-a10", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.10. Expresión creativa a través de diferentes lenguajes de su mundo interior, de lo que experimenta y admira.", isMinimum: true },
  { id: "sb-inf-a11", category: "Bloque A: El valor de la persona a la luz del mensaje cristiano: autonomía y comunicación", description: "A.11. Aprecio del silencio y la calma como herramientas para la identificación de emociones y sentimientos.", isMinimum: true },

  // Bloque B
  { id: "sb-inf-b1", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.1. Maneras y modos de comunicar las emociones propias en las relaciones interpersonales.", isMinimum: true },
  { id: "sb-inf-b2", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.2. Actitudes de autonomía, asertividad, respeto, empatía y cuidado de las personas y de la naturaleza, a la luz de la ética cristiana.", isMinimum: true },
  { id: "sb-inf-b3", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.3. Valoración de un clima de convivencia armónico, inclusivo y pacífico construido entre todos: el diálogo y la empatía.", isMinimum: true },
  { id: "sb-inf-b4", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.4. Actitudes de amabilidad, acogida y gratitud como expresión de respeto a los demás.", isMinimum: true },
  { id: "sb-inf-b5", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.5. Habilidades para la mediación y la resolución de conflictos: escucha activa, diálogo constructivo, asertividad y perdón.", isMinimum: true },
  { id: "sb-inf-b6", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.6. Valoración de las relaciones sociales, en especial de la amistad.", isMinimum: true },
  { id: "sb-inf-b7", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.7. Admiración y cuidado de la naturaleza como creación de Dios y casa común.", isMinimum: true },
  { id: "sb-inf-b8", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.8. La fraternidad humana: hijos y hermanos de un único Dios.", isMinimum: true },
  { id: "sb-inf-b9", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.9. Presentación de diversos relatos bíblicos que reflejen las acciones y sentimientos de Jesús de Nazaret hacia los más necesitados.", isMinimum: true },
  { id: "sb-inf-b10", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.10. Narraciones bíblicas que proponen el perdón, la misericordia y la solidaridad como características del Reino de Dios.", isMinimum: true },
  { id: "sb-inf-b11", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.11. La vida cristiana en comunidad.", isMinimum: true },
  { id: "sb-inf-b12", category: "Bloque B: Al encuentro y cuidado de los otros: crecer en comunión", description: "B.12. Actitudes de solidaridad y cooperación para una sociedad participativa e inclusiva.", isMinimum: true },

  // Bloque C
  { id: "sb-inf-c1", category: "Bloque C: Identidad cristiana y entorno social", description: "C.1. Identificación de costumbres sociales y manifestaciones culturales o artísticas, como expresión de la fe cristiana.", isMinimum: true },
  { id: "sb-inf-c2", category: "Bloque C: Identidad cristiana y entorno social", description: "C.2. Reconocimiento de símbolos propios de las fiestas religiosas.", isMinimum: true },
  { id: "sb-inf-c3", category: "Bloque C: Identidad cristiana y entorno social", description: "C.3. Las oraciones y prácticas cristianas más comunes en el entorno social.", isMinimum: true },
  { id: "sb-inf-c4", category: "Bloque C: Identidad cristiana y entorno social", description: "C.4. La Biblia como comunicación de Dios con las personas.", isMinimum: true },
  { id: "sb-inf-c5", category: "Bloque C: Identidad cristiana y entorno social", description: "C.5. Reconocimiento de Jesús de Nazaret como figura clave del cristianismo.", isMinimum: true },
  { id: "sb-inf-c6", category: "Bloque C: Identidad cristiana y entorno social", description: "C.6. La familia de Jesús y la relación de Jesús con sus discípulos.", isMinimum: true },
  { id: "sb-inf-c7", category: "Bloque C: Identidad cristiana y entorno social", description: "C.7. La figura de la Virgen María.", isMinimum: true },
  { id: "sb-inf-c8", category: "Bloque C: Identidad cristiana y entorno social", description: "C.8. La oración de Jesús.", isMinimum: true },
  { id: "sb-inf-c9", category: "Bloque C: Identidad cristiana y entorno social", description: "C.9. La relación de la persona con Dios y sus expresiones comunitarias: la Iglesia.", isMinimum: true },
  { id: "sb-inf-c10", category: "Bloque C: Identidad cristiana y entorno social", description: "C.10. Calendario litúrgico y celebraciones cristianas.", isMinimum: true },
  { id: "sb-inf-c11", category: "Bloque C: Identidad cristiana y entorno social", description: "C.11. La riqueza de la interculturalidad como oportunidad de desarrollo personal y social.", isMinimum: true }
];

export const SABERES_PRIMARIA_1_2: SaberBásico[] = [
  // Bloque A
  { id: "sb-pri-a1", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.1. Capacidades, potencialidades y limitaciones de cada ser humano.", isMinimum: true },
  { id: "sb-pri-a2", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.2. Vivencias y sentimientos de la experiencia interior y de la corporalidad.", isMinimum: true },
  { id: "sb-pri-a3", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.3. Valor intrínseco de toda persona, para el cristianismo como criatura de Dios.", isMinimum: true },
  { id: "sb-pri-a4", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.4. Exploración de personajes bíblicos y modelos cristianos y su búsqueda de la felicidad.", isMinimum: true },
  { id: "sb-pri-a5", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.5. Grupos de pertenencia: diferencias y relación con Jesús de Nazaret.", isMinimum: true },
  { id: "sb-pri-a6", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.6. La familia y la incorporación a la vida social en la visión cristiana.", isMinimum: true },
  { id: "sb-pri-a7", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.7. Potenciación de la propia creatividad mediante expresiones artísticas que reflejen el mensaje de diversos relatos bíblicos.", isMinimum: true },
  { id: "sb-pri-a8", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.8. Aprecio de momentos de silencio, interiorización y contemplación.", isMinimum: true },
  { id: "sb-pri-a9", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.9. Expresión, empleando diversos lenguajes, de la propia creencia, emociones y afectos.", isMinimum: true },
  { id: "sb-pri-a10", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.10. Reconocimiento de la oración como medio privilegiado de comunicación con Dios. El Padrenuestro.", isMinimum: true },

  // Bloque B
  { id: "sb-pri-b1", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.1. Apreciación del valor religioso y la riqueza cultural de la Navidad, Semana Santa y otras celebraciones como expresión de la identidad cultural de nuestra sociedad.", isMinimum: true },
  { id: "sb-pri-b2", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.2. Análisis y expresión del mensaje cristiano en la música, las artes y otras manifestaciones culturales y tradiciones del entorno.", isMinimum: true },
  { id: "sb-pri-b3", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.3. Valoración de la importancia de las celebraciones religiosas para las personas creyentes.", isMinimum: true },
  { id: "sb-pri-b4", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.4. Reconocimiento de la Biblia, Palabra de Dios en la vida de la Iglesia, como libro sagrado del cristianismo.", isMinimum: true },
  { id: "sb-pri-b5", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.5. La alianza de Dios con el pueblo de Israel y su proyecto de humanidad.", isMinimum: true },
  { id: "sb-pri-b6", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.6. Jesucristo, centro del mensaje cristiano.", isMinimum: true },
  { id: "sb-pri-b7", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.7. María, la Madre de Jesús.", isMinimum: true },
  { id: "sb-pri-b8", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.8. La Iglesia como familia que vive y celebra la Buena Noticia anunciada por Jesús de Nazaret.", isMinimum: true },
  { id: "sb-pri-b9", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.9. La Biblia como fuente de inspiración artística a lo largo de la historia.", isMinimum: true },
  { id: "sb-pri-b10", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.10. La belleza como expresión de la Creación y de la experiencia religiosa.", isMinimum: true },

  // Bloque C
  { id: "sb-pri-c1", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.1. El compromiso y responsabilidad del ser humano en el cuidado de la naturaleza y los seres vivos desde una visión cristiana.", isMinimum: true },
  { id: "sb-pri-c2", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.2. Gratitud hacia las personas que nos cuidan y hacia Dios Creador.", isMinimum: true },
  { id: "sb-pri-c3", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.3. Obras y palabras que muestran el amor de Jesús de Nazaret a todas las personas.", isMinimum: true },
  { id: "sb-pri-c4", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.4. El mandamiento del amor como máxima relacional del cristianismo.", isMinimum: true },
  { id: "sb-pri-c5", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.5. Actitudes y acciones que promueven la fraternidad.", isMinimum: true },
  { id: "sb-pri-c6", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.6. Hábitos y valores de respeto a la naturaleza como creada por Dios.", isMinimum: true },
  { id: "sb-pri-c7", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.7. Relatos evangélicos de compasión, misericordia y perdón.", isMinimum: true },
  { id: "sb-pri-c8", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.8. Biografías significativas que han favorecido la resolución pacífica de conflictos.", isMinimum: true },
  { id: "sb-pri-c9", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.9. Actitudes cotidianas que fomentan una convivencia pacífica.", isMinimum: true },
  { id: "sb-pri-c10", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.10. Respeto y valoración de las emociones, creencias, sentimientos y expresiones religiosas de otras personas.", isMinimum: true }
];

export const SABERES_PRIMARIA_3_4: SaberBásico[] = [
  // Bloque A
  { id: "sb-pri34-a1", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.1. La centralidad de la persona en el mensaje cristiano.", isMinimum: true },
  { id: "sb-pri34-a2", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.2. La dignidad del ser humano.", isMinimum: true },
  { id: "sb-pri34-a3", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.3. Relatos bíblicos de vocación y misión.", isMinimum: true },
  { id: "sb-pri34-a4", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.4. La importancia de la familia y la comunidad como fuente de felicidad.", isMinimum: true },
  { id: "sb-pri34-a5", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.5. Técnicas de mediación para la resolución pacífica de conflictos a la luz del Evangelio.", isMinimum: true },
  { id: "sb-pri34-a6", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.6. Las relaciones con los otros como oportunidad de autoconocimiento y crecimiento personal.", isMinimum: true },
  { id: "sb-pri34-a7", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.7. Toma de conciencia de la experiencia personal y del modo de relacionarnos con los demás y con Dios.", isMinimum: true },

  // Bloque B
  { id: "sb-pri34-b1", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.1. Identificación de diversos símbolos y tradiciones religiosas, en torno al calendario litúrgico y los sacramentos.", isMinimum: true },
  { id: "sb-pri34-b2", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.2. Transmisión del sentimiento religioso a través de la música y las artes.", isMinimum: true },
  { id: "sb-pri34-b3", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.3. Antiguo y Nuevo Testamento.", isMinimum: true },
  { id: "sb-pri34-b4", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.4. La importancia de la alianza de Dios con el pueblo de Israel.", isMinimum: true },
  { id: "sb-pri34-b5", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.5. La relación de Jesús con las personas de su tiempo.", isMinimum: true },
  { id: "sb-pri34-b6", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.6. Jesús anuncia el Reino de Dios: fraternidad y misericordia.", isMinimum: true },
  { id: "sb-pri34-b7", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.7. Relatos bíblicos que describen la vida de Jesús de Nazaret con los Apóstoles y las primeras comunidades cristianas.", isMinimum: true },
  { id: "sb-pri34-b8", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.8. María, Madre de la Iglesia.", isMinimum: true },
  { id: "sb-pri34-b9", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.9. La Iglesia, Pueblo de Dios, como comunidad que vive y celebra. El sacramento de la Eucaristía.", isMinimum: true },
  { id: "sb-pri34-b10", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.10. Aprecio de la importancia de vivir la fe en comunidad para la persona creyente.", isMinimum: true },
  { id: "sb-pri34-b11", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.11. La importancia del perdón para la construcción de relaciones sociales sólidas, solidarias y fraternas. El sacramento de la reconciliación.", isMinimum: true },
  { id: "sb-pri34-b12", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.12. Tipos de oración: características y diferencias.", isMinimum: true },
  { id: "sb-pri34-b13", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.13. Obras artísticas que representan momentos de la tradición bíblica y que son configuradoras de su identidad cultural.", isMinimum: true },
  { id: "sb-pri34-b14", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.14. Valor cultural y artístico del patrimonio de la diócesis.", isMinimum: true },

  // Bloque C
  { id: "sb-pri34-c1", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.1. El cuidado del entorno natural y social como casa común.", isMinimum: true },
  { id: "sb-pri34-c2", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.2. La propuesta moral cristiana para la vida en sociedad.", isMinimum: true },
  { id: "sb-pri34-c3", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.3. Hábitos y actividades para el logro de los objetivos de desarrollo sostenible a la luz de la ética cristiana.", isMinimum: true },
  { id: "sb-pri34-c4", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.4. Ética del cuidado: la responsabilidad, la compasión, el perdón y el amor.", isMinimum: true },
  { id: "sb-pri34-c5", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.5. Una mirada cristiana a la realidad: la toma de conciencia de las situaciones sociales injustas.", isMinimum: true },
  { id: "sb-pri34-c6", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.6. Proyectos de servicio y solidaridad promovidos por la Iglesia.", isMinimum: true },
  { id: "sb-pri34-c7", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.7. Actitudes de respeto e inclusión para crear entornos de convivencia intercultural.", isMinimum: true }
];

export const SABERES_PRIMARIA_5_6: SaberBásico[] = [
  // Bloque A
  { id: "sb-pri56-a1", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.1. La dignidad humana, la igualdad y la diferencia entre las personas.", isMinimum: true },
  { id: "sb-pri56-a2", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.2. Los derechos humanos en diálogo con la visión cristiana.", isMinimum: true },
  { id: "sb-pri56-a3", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.3. La responsabilidad personal y social desde el punto de vista cristiano.", isMinimum: true },
  { id: "sb-pri56-a4", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.4. Situaciones vitales que plantean preguntas existenciales o morales para la persona.", isMinimum: true },
  { id: "sb-pri56-a5", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.5. La influencia de las acciones individuales en la transformación social a la luz de la ética cristiana.", isMinimum: true },
  { id: "sb-pri56-a6", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.6. Valoración de la dimensión espiritual y religiosa en uno mismo y en los demás.", isMinimum: true },
  { id: "sb-pri56-a7", category: "Bloque A: Identidad personal y relaciones en diálogo con el mensaje cristiano", description: "A.7. Expresión, en diversos lenguajes de la propia vivencia personal, en torno a las festividades, tradiciones y celebraciones religiosas.", isMinimum: true },

  // Bloque B
  { id: "sb-pri56-b1", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.1. Ritos, tradiciones y fiestas de diversas religiones en torno al nacimiento, el matrimonio y la muerte, explicitando la aportación del cristianismo.", isMinimum: true },
  { id: "sb-pri56-b2", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.2. Obras de arte, composiciones musicales, y construcciones arquitectónicas representativas del cristianismo, comparadas con las de otras culturas y religiones.", isMinimum: true },
  { id: "sb-pri56-b3", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.3. La relación de Jesús con su Padre y con el Espíritu: Dios Trinidad.", isMinimum: true },
  { id: "sb-pri56-b4", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.4. La preferencia de Jesucristo por las personas marginadas.", isMinimum: true },
  { id: "sb-pri56-b5", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.5. La pasión, muerte y resurrección de Jesús y la celebración de la Pascua en la Iglesia.", isMinimum: true },
  { id: "sb-pri56-b6", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.6. El Credo de la Iglesia Católica.", isMinimum: true },
  { id: "sb-pri56-b7", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.7. La vida cristiana y la celebración de los sacramentos.", isMinimum: true },
  { id: "sb-pri56-b8", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.8. María, modelo de creyente.", isMinimum: true },
  { id: "sb-pri56-b9", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.9. Reconocimiento del papel de las mujeres en la Biblia y en la historia de la Iglesia.", isMinimum: true },
  { id: "sb-pri56-b10", category: "Bloque B: Cosmovisiones, tradición cristiana y cultura", description: "B.10. Reflexión y análisis sobre las experiencias religiosas narradas en diversos relatos bíblicos o recogidas en biografías significativas.", isMinimum: true },

  // Bloque C
  { id: "sb-pri56-c1", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.1. El mandamiento del amor como raíz de la ética cristiana y compromiso con el bien común.", isMinimum: true },
  { id: "sb-pri56-c2", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.2. Valores propios del Evangelio: las bienaventuranzas y el Reino de Dios.", isMinimum: true },
  { id: "sb-pri56-c3", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.3. La visión cristiana de la interdependencia, eco-dependencia e interrelación.", isMinimum: true },
  { id: "sb-pri56-c4", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.4. Análisis de situaciones cercanas de vulnerabilidad y diseño de propuestas transformadoras aplicando los principios de la ética cristiana.", isMinimum: true },
  { id: "sb-pri56-c5", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.5. Compromiso y transformación social en la acción de la Iglesia.", isMinimum: true },
  { id: "sb-pri56-c6", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.6. La responsabilidad y el respeto en el uso de los medios de comunicación y las redes sociales.", isMinimum: true },
  { id: "sb-pri56-c7", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.7. Pensamiento crítico y ético para la convivencia democrática.", isMinimum: true },
  { id: "sb-pri56-c8", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.8. Establecimiento de un primer diálogo fe y ciencia, desde el respeto, la curiosidad y la escucha.", isMinimum: true },
  { id: "sb-pri56-c9", category: "Bloque C: Habitar el mundo plural y diverso para construir la casa común", description: "C.9. Aprecio del diálogo intercultural e interreligioso para una convivencia pacífica y democrática.", isMinimum: true }
];

export const SABERES_BACHILLERATO: SaberBásico[] = [
  // Bloque A
  { id: "sb-bach-a1", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.1. Objetivos vitales, desarrollo de la vocación personal y proyecto profesional.", isMinimum: true },
  { id: "sb-bach-a2", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.2. La experiencia del encuentro con Dios a lo largo de la historia como fuente de desarrollo pleno de lo humano.", isMinimum: true },
  { id: "sb-bach-a3", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.3. Habilidades y destrezas para descubrir, analizar y valorar críticamente las diferentes pertenencias como medio de enriquecimiento personal.", isMinimum: true },
  { id: "sb-bach-a4", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.4. La visión integral de la persona en su dignidad y en su libertad según la antropología cristiana.", isMinimum: true },
  { id: "sb-bach-a5", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.5. La concepción del ser humano en otras cosmovisiones filosóficas y religiosas, en diálogo con la teología cristiana de las religiones.", isMinimum: true },
  { id: "sb-bach-a6", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.6. Proyectos personales y profesionales, en la vida eclesial y social, desarrollados en clave vocacional.", isMinimum: true },
  { id: "sb-bach-a7", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.7. La vida en sociedad, condición necesaria del desarrollo vital de la persona.", isMinimum: true },
  { id: "sb-bach-a8", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.8. Sentido artístico y creatividad en el diálogo fe-cultura.", isMinimum: true },
  { id: "sb-bach-a9", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.9. Aportaciones de la experiencia religiosa cristiana para una vida con sentido en diálogo con otros paradigmas.", isMinimum: true },
  { id: "sb-bach-a10", category: "Bloque A: La vida como vocación personal y profesional en diálogo con el humanismo cristiano", description: "A.10. Estrategias para el diálogo transdisciplinar y síntesis personal como aprendizaje a lo largo de la vida.", isMinimum: true },

  // Bloque B
  { id: "sb-bach-b1", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.1. Fenomenología de la experiencia religiosa: elementos propios y diferencias del cristianismo con otras tradiciones filosóficas y religiosas.", isMinimum: true },
  { id: "sb-bach-b2", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.2. Síntesis de la Historia de la Salvación en clave relacional y trinitaria.", isMinimum: true },
  { id: "sb-bach-b3", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.3. El anuncio del Reino de Dios y sus implicaciones personales, sociopolíticas y escatológicas.", isMinimum: true },
  { id: "sb-bach-b4", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.4. Humanismo cristiano: Jesucristo, salvación y modelo de humanity plena.", isMinimum: true },
  { id: "sb-bach-b5", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.5. Las manifestaciones sociales y culturales como expresión de los valores y creencias de la identidad de los pueblos.", isMinimum: true },
  { id: "sb-bach-b6", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.6. El cristianismo y su expresión artística en la música, la literatura y las artes.", isMinimum: true },
  { id: "sb-bach-b7", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.7. Habilidades para el análisis y la contemplación de obras de arte sobre relatos bíblicos, historia de la salvación y vida de Jesucristo.", isMinimum: true },
  { id: "sb-bach-b8", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.8. Experiencia espiritual y religiosa en figuras históricas de distintas tradiciones religiosas y culturales.", isMinimum: true },
  { id: "sb-bach-b9", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.9. Reconocimiento crítico en el entorno social y cultural de manifestaciones de la dimensión espiritual de la persona.", isMinimum: true },
  { id: "sb-bach-b10", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.10. Método teológico y método científico: contenidos y enfoques propios de cada disciplina.", isMinimum: true },
  { id: "sb-bach-b11", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.11. Relaciones ciencia y fe a lo largo de la historia y en la actualidad.", isMinimum: true },
  { id: "sb-bach-b12", category: "Bloque B: Diálogo fe-razón y fe-cultura", description: "B.12. Diálogo fe-razón en la historia de la ciencia, la filosofía y la teología.", isMinimum: true },

  // Bloque C
  { id: "sb-bach-c1", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.1. Valores sociales, pensamiento crítico y proyecto personal y profesional.", isMinimum: true },
  { id: "sb-bach-c2", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.2. Principios fundamentales de la doctrina social de la Iglesia (DSI).", isMinimum: true },
  { id: "sb-bach-c3", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.3. Estrategias para el análisis de los principales problemas sociales, políticos, económicos y ecológicos del mundo actual, a la luz de la doctrina social de la Iglesia y de otros humanismos.", isMinimum: true },
  { id: "sb-bach-c4", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.4. Las relaciones de la Iglesia con la organización política y democrática, en los niveles locales, estatales y globales, en su dimensión histórica y actual.", isMinimum: true },
  { id: "sb-bach-c5", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.5. Conocimiento y valoración de las diferentes iniciativas mundiales que buscan lanzar proyectos de futuro sostenible, en especial los objetivos de desarrollo sostenible (ODS).", isMinimum: true },
  { id: "sb-bach-c6", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.6. Proyectos sociales y de promoción humana de la Iglesia, en la historia y en el presente, y su aportación a la inclusión social y al bien común.", isMinimum: true },
  { id: "sb-bach-c7", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.7. Actitudes de diálogo y colaboración con otras religiones y culturas que posibiliten una convivencia pacífica y tolerante entre las distintas tradiciones.", isMinimum: true },
  { id: "sb-bach-c8", category: "Bloque C: Insertarse críticamente en la sociedad", description: "C.8. Principales desafíos de la humanidad y sus implicaciones éticas: valor de la vida, justicia, ecología, transhumanismo e inteligencia artificial, etc.", isMinimum: true }
];


// 6 Competencias específicas LOMLOE Religión ESO (Common for all ESO)
export const COMPETENCIAS_ESO: Omit<Competencia, "criteriosEvaluación">[] = [
  {
    id: "ce-eso-1",
    description: "1. Identificar, valorar y expresar los elementos clave de la dignidad e identidad personal a través de la interpretación de biografías significativas, para asumir la propia dignidad y aceptar la identidad personal, respetar la de los otros, y desarrollar con libertad un proyecto de vida con sentido."
  },
  {
    id: "ce-eso-2",
    description: "2. Valorar la condición relacional del ser humano, desarrollando destrezas y actitudes sociales orientadas a la justicia y a la mejora de la convivencia teniendo en cuenta el magisterio social de la Iglesia, para aprender a vivir con otros y contribuir a la fraternidad universal y la sostenibilidad del planeta."
  },
  {
    id: "ce-eso-3",
    description: "3. Asumir los desafíos de la humanidad desde una perspectiva inclusiva reconociendo las necesidades individuales y sociales, discerniéndolos con las claves del «Reino de Dios», para implicarse personal y profesionalmente en la transformación social y el logro del bien común."
  },
  {
    id: "ce-eso-4",
    description: "4. Interpretar y admirar el patrimonio cultural en sus diferentes expresiones, reconociendo que son portadoras de identidades y sentido, apreciando cómo el cristianismo se ha encarnado en manifestaciones diversas, para desarrollar sentido de pertenencia, participar en la construcción de la convivencia y promover el diálogo intercultural en el marco de los derechos humanos."
  },
  {
    id: "ce-eso-5",
    description: "5. Reconocer y apreciar la propia interioridad, la experiencia espiritual y religiosa, presente en todas las culturas y sociedades, comprendiendo la experiencia de personajes relevantes y valorando las posibilidades de lo religioso, para discernir posibles respuestas a las preguntas sobre el sentido de la vida, y favorecer el respeto entre las diferentes tradiciones religiosas."
  },
  {
    id: "ce-eso-6",
    description: "6. Identificar y comprender los contenidos esenciales de la Teología cristiana, contemplando y valorando la contribución de la tradición cristiana a la búsqueda de la verdad, para disponer de una síntesis del cristianismo que permita dialogar con otras tradiciones, paradigmas y cosmovisiones."
  }
];

// 6 Competencias específicas LOMLOE Religión Bachillerato
export const COMPETENCIAS_BACHILLERATO: Omit<Competencia, "criteriosEvaluación">[] = [
  {
    id: "ce-bach-1",
    description: "1 Comprender y asumir el proyecto vital personal, reconociendo las propias ideas y creencias, contrastándolas con la antropología cristiana y otras cosmovisiones, para insertarse en la vida adulta y en el mundo profesional."
  },
  {
    id: "ce-bach-2",
    description: "2 Reconocer y desplegar el carácter relacional del ser humano, como fundamento de los deberes y libertades, desarrollando actitudes cívicas y democráticas, contrastando el Evangelio con otros humanismos e ideologías contemporáneas, para aprender a vivir con otros y contribuir a la construcción de una sociedad inclusiva."
  },
  {
    id: "ce-bach-3",
    description: "3 Interpretar los desafíos democráticos, socioeconómicos y ecológicos, analizando sus causas y consecuencias desde la moral social de la Iglesia, discerniendo las propuestas sociopolíticas de las religiones y los movimientos sociales, para asumir la ecología integral y la responsabilidad personal y social en el cuidado de la vida y del planeta."
  },
  {
    id: "ce-bach-4",
    description: "4 Comprender y admirar el patrimonio cultural, interpretando su significado y expresiones con los métodos de análisis propios de cada disciplina, valorando críticamente las aportaciones del cristianismo en el desarrollo de los pueblos, para intervenir con criterio propio en el diálogo intercultural, la creación artística y en la construcción social del pensamiento."
  },
  {
    id: "ce-bach-5",
    description: "5 Valorar la dimensión espiritual como fuente de sentido y aprendizajes vitales, a través del análisis de las experiencias personales, del conocimiento de las tradiciones espirituales, y del diálogo interdisciplinar con otras visiones de la vida y del mundo, para descubrir las oportunidades personales, sociales y culturales de la experiencia espiritual como propuesta de plenitud de la vida personal y comunitaria."
  },
  {
    id: "ce-bach-6",
    description: "6 Conocer el método propio de la Teología y sus distintas especialidades analizando su lugar entre los saberes y disciplinas, estableciendo un diálogo transdisciplinar con las otras ciencias, para afrontar críticamente los desafíos éticos y la transformación social."
  }
];

// Criterios de evaluación para Bachillerato 1º
export const CRITERIOS_BACHILLERATO_1: Record<string, Criterio[]> = {
  "ce-bach-1": [{ id: "crit-bach-1.1", description: "1.1. Identificar e interpretar las ideas y creencias que conforman la identidad personal, contrastándolas con categorías fundamentales de la antropología cristiana (creación, imagen de Dios, libertad, pecado, finitud, etc.) y de otras cosmovisiones.", isMinimum: true }],
  "ce-bach-2": [{ id: "crit-bach-2.1", description: "2.1. Valorar, en el desarrollo de la identidad personal, la pertenencia a múltiples esferas sociales, promoviendo compromisos de respeto a la diversidad e inclusión en sociedades democráticas.", isMinimum: true }],
  "ce-bach-3": [{ id: "crit-bach-3.1", description: "3.1. Describir los retos políticos y económicos en entornos locales y globales, analizando sus causas y proponiendo posibles soluciones a la luz de la propuesta moral del Reino de Dios y de otras cosmovisiones.", isMinimum: true }],
  "ce-bach-4": [{ id: "crit-bach-4.1", description: "4.1. Valorar y admirar las diversas expresiones históricas del patrimonio común de la humanidad, analizando cómo el cristianismo se ha integrado en la historia, con luces y sombras, impregnando la cultura.", isMinimum: true }],
  "ce-bach-5": [{ id: "crit-bach-5.1", description: "5.1. Identificar la dimensión espiritual de la persona y la diversidad del hecho religioso, valorándola como una realidad presente en las culturas que se expresan de diferentes formas en las sociedades plurales.", isMinimum: true }],
  "ce-bach-6": [{ id: "crit-bach-6.1", description: "6.1. Reconocer las características propias del saber teológico, en cuanto a su método, fuentes y contenido, identificando las semejanzas y diferencias con otros saberes, en especial con la ciencia, y valorando sus aportaciones éticas.", isMinimum: true }]
};

// Criterios de evaluación para Bachillerato 2º
export const CRITERIOS_BACHILLERATO_2: Record<string, Criterio[]> = {
  "ce-bach-1": [{ id: "crit-bach-1.2", description: "1.2. Reconocer los elementos esenciales de un proyecto vital en clave vocacional y profesional desde la autonomy, la libertad y la responsabilidad social, con una actitud sincera de búsqueda de la verdad, teniendo en cuenta la propuesta cristiana y los valores sociales.", isMinimum: true }],
  "ce-bach-2": [{ id: "crit-bach-2.2", description: "2.2. Distinguir los principios fundamentales del mensaje social cristiano, contrastándolos con otros humanismos e ideologías contemporáneas, aplicándolos a diferentes situaciones sociales.", isMinimum: true }],
  "ce-bach-3": [{ id: "crit-bach-3.2", description: "3.2. Diseñar proyectos personales y comunitarios que promuevan la plenitud humana y la transformación social, cultivando la responsabilidad individual, la justicia social y la ecología integral.", isMinimum: true }],
  "ce-bach-4": [{ id: "crit-bach-4.2", description: "4.2. Participar activamente en la creación cultural con sentido crítico, desarrollando sentimientos de pertenencia a la propia tradición y construyendo la diversidad cultural desde criterios humanizadores propios del Evangelio.", isMinimum: true }],
  "ce-bach-5": [{ id: "crit-bach-5.2", description: "5.2. Valorar la experiencia cristiana manifestada en Jesucristo y en tantos testigos a lo largo de la historia, como respuesta plena a las cuestiones vitales y de sentido, en diálogo interdisciplinar con propuestas filosóficas diversas.", isMinimum: true }],
  "ce-bach-6": [{ id: "crit-bach-6.2", description: "6.2. Discernir los desafíos de la civilización actual, estableciendo las contribuciones que tanto la ciencia como la teología pueden realizar transformación social, desde una mutua colaboración.", isMinimum: true }]
};

// Criterios de evaluación para 1º ESO
export const CRITERIOS_ESO_1: Record<string, Criterio[]> = {
  "ce-eso-1": [{ id: "crit-1.1", description: "1.1 Describir y aceptar los rasgos y dimensiones fundamentales de la identidad personal, analizando relatos bíblicos de vocación y misión, así como otras biografías significativas.", isMinimum: true }],
  "ce-eso-2": [{ id: "crit-2.1", description: "2.1 Adquirir habilidades y actitudes de relación con otros, poniendo en práctica estrategias efectivas de reflexión y de comunicación, de ayuda mutua, de participación y de inclusión, orientadas a la mejora de la convivencia en la familia y en la escuela como expresión de la fraternidad universal.", isMinimum: true }],
  "ce-eso-3": [{ id: "crit-3.1", description: "3.1 Generar actitudes de justicia y solidaridad, respetando la diversidad y tomando conciencia de la responsabilidad compartida y la común pertenencia, en el horizonte del Reino de Dios.", isMinimum: true }],
  "ce-eso-4": [{ id: "crit-4.1", description: "4.1 Situar e interpretar las expresiones culturales y sus lenguajes en sus contextos históricos, apreciando su contribución a la identidad personal y social y a los Derechos Humanos, facilitando la convivencia y el diálogo intercultural.", isMinimum: true }],
  "ce-eso-5": [{ id: "crit-5.1", description: "5.1 Valorar la experiencia espiritual y religiosa como dimensión humana y social propia de todos los pueblos y culturas, conociendo la especificidad de la espiritualidad judeocristiana y de otras religiones.", isMinimum: true }],
  "ce-eso-6": [{ id: "crit-6.1", description: "6.1 Identificar a Jesucristo como núcleo esencial del cristianismo, y la Biblia como libro del Pueblo de Dios, valorando sus aportaciones a la vida de las personas y las sociedades.", isMinimum: true }]
};

// Criterios de evaluación para 2º ESO
export const CRITERIOS_ESO_2: Record<string, Criterio[]> = {
  "ce-eso-1": [{ id: "crit-1.2", description: "1.2 Identificar las características de la visión bíblica sobre el ser humano, relacionándola con la dignidad personal, reconociéndola en los otros.", isMinimum: true }],
  "ce-eso-2": [{ id: "crit-2.2", description: "2.2 Desarrollar empatía y reconocimiento de la diversidad personal y social, inspirándose en el ser relacional de Dios, manifestado en la historia de la salvación.", isMinimum: true }],
  "ce-eso-3": [{ id: "crit-3.2", description: "3.2 Analizar las necesidades sociales, identificando las situaciones de injusticia, violencia y discriminación, con sus causas, discerniéndolas según el proyecto del Reino de Dios, implicándose en propuestas de transformación social.", isMinimum: true }],
  "ce-eso-4": [{ id: "crit-4.2", description: "4.2 Razonar cómo la fe cristiana, en el presente y a lo largo de la historia, se ha hecho cultura, interpretando el patrimonio literario, artístico y cultural y valorándolo como expresión de la encarnación del mensaje cristiano en diferentes lenguajes.", isMinimum: true }],
  "ce-eso-5": [{ id: "crit-5.2", description: "5.2 Respetar las diferentes iglesias y tradiciones religiosas, conociendo y valorando las creencias, ritos, símbolos y principios de cada una de ellas, teniendo elementos de juicio personal que favorezcan el diálogo interreligioso.", isMinimum: true }],
  "ce-eso-6": [{ id: "crit-6.2", description: "6.2 Elaborar una primera síntesis de la fe cristiana, subrayando su capacidad para el diálogo entre la fe y la razón, entre la fe y la cultura, manteniendo las convicciones propias con pleno respeto a las de los otros.", isMinimum: true }]
};

// Criterios de evaluación para 3º ESO
export const CRITERIOS_ESO_3: Record<string, Criterio[]> = {
  "ce-eso-1": [{ id: "crit-1.3", description: "1.3 Reconocer los rasgos esenciales de la antropología cristiana, relacionándolos con los derechos fundamentales y la defensa de la dignidad humana, verificándolos en situaciones globales.", isMinimum: true }],
  "ce-eso-2": [{ id: "crit-2.3", description: "2.3 Asumir valores y actitudes de cuidado personal, de los otros, de la naturaleza y de los espacios comunes, favoreciendo actitudes de respeto, gratuidad, reconciliación, inclusión social y sostenibilidad.", isMinimum: true }],
  "ce-eso-3": [{ id: "crit-3.3", description: "3.3 Cooperar activamente en proyectos de cuidado y responsabilidad hacia el bien común, inspirados en la perspectiva cristiana, participando en acciones de mejora del entorno y en el planteamiento de las opciones profesionales.", isMinimum: true }],
  "ce-eso-4": [{ id: "crit-4.3", description: "4.3 Participar críticamente en la promoción de la diversidad cultural, expresando y aportando creativamente las experiencias propias, respetando las diferencias entre personas y comunidades.", isMinimum: true }],
  "ce-eso-5": [{ id: "crit-5.3", description: "5.3 Formular posibles respuestas a las preguntas de sentido, conociendo y valorando las aportaciones de las tradiciones religiosas, en especial la propuesta de sentido de la vida de Jesucristo, elaborando sus propias respuestas partiendo de un análisis crítico y la adaptación a su situación personal.", isMinimum: true }],
  "ce-eso-6": [{ id: "crit-6.3", description: "6.3 Reconocer la Iglesia, comunidad de los discípulos de Jesucristo, y su compromiso en la amistad social como núcleos esenciales del cristianismo, valorando críticamente su contribución cultural e histórica.", isMinimum: true }]
};

// Criterios de evaluación para 4º ESO
export const CRITERIOS_ESO_4: Record<string, Criterio[]> = {
  "ce-eso-1": [{ id: "crit-1.4", description: "1.4 Formular un proyecto personal de vida con sentido que responda a valores de cuidado propio, de los demás y de la naturaleza, respetando los de los otros, tomando como referencia a Jesucristo, siendo capaz de modular estas opciones en situaciones vitales complejas.", isMinimum: true }],
  "ce-eso-2": [{ id: "crit-2.4", description: "2.4 Cooperar a la construcción de sociedades justas y democráticas, fortaleciendo vínculos sociales e intergeneracionales, y las relaciones en modelos de interdependencia, analizando la realidad, teniendo en cuenta los principios y valores del magisterio social de la Iglesia y promoviendo el desarrollo humano integral.", isMinimum: true }],
  "ce-eso-3": [{ id: "crit-3.4", description: "3.4 Contribuir a la fraternidad universal, contrastando críticamente el paradigma científico tecnológico vigente y las narrativas de progreso, con la antropología, la moral y la escatología cristiana, respondiendo con sensibilidad e implicación a situaciones de empobrecimiento y vulnerabilidad.", isMinimum: true }],
  "ce-eso-4": [{ id: "crit-4.4", description: "4.4 Desarrollar sentido de pertenencia a una tradición cultural, con expresiones sociales, artísticas, éticas y estéticas, valorando adecuadamente su contribución en su momento histórico, relacionándolas con contextos actuales y promoviendo su memoria como legado vivo.", isMinimum: true }],
  "ce-eso-5": [{ id: "crit-5.4", description: "5.4 Favorecer la convivencia social en contextos plurales, respetando las opciones personales y generando espacios de diálogo y encuentro.", isMinimum: true }],
  "ce-eso-6": [{ id: "crit-6.4", description: "6.4 Poner en diálogo el saber religioso con otras disciplinas, tradiciones culturales, paradigmas científicos y tecnológicos y otras cosmovisiones, teniendo en cuenta los métodos propios de cada disciplina y respetando la pluralidad.", isMinimum: true }]
};

export const SABERES_ESO_1_2: SaberBásico[] = [
  // Bloque A
  { id: "sb-a-1", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.1. Rasgos y dimensiones fundamentales de la vida humana en relación con la visión cristiana de la persona.", isMinimum: true },
  { id: "sb-a-2", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.2. Relaciones fundamentales de la persona: consigo misma, con los demás, con la naturaleza y con Dios.", isMinimum: true },
  { id: "sb-a-3", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.3. Relatos bíblicos y biografías sobre vocación y misión.", isMinimum: true },
  { id: "sb-a-4", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.4. Habilidades y actitudes de escucha, empatía y expresión asertiva para una comunicación interpersonal.", isMinimum: true },
  { id: "sb-a-5", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.5. La espiritualidad y la experiencia religiosa como realización humana y social. Su relación con los sacramentos.", isMinimum: true },
  { id: "sb-a-6", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.6. Aprecio de la oración y la contemplación en la tradición judeocristiana y otras religiones como encuentro con la bondad, la verdad y la belleza y posibilidad para el diálogo intercultural e interreligioso.", isMinimum: true },
  
  // Bloque B
  { id: "sb-b-1", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.1. La Biblia, Palabra de Dios en palabras humanas que narra la relación entre Dios y su Pueblo, su composición y géneros literarios.", isMinimum: true },
  { id: "sb-b-2", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.2. Las claves bíblicas de Alianza, Pueblo, e Historia en la comprensión de la dimensión creatural y relacional de la persona y sus consecuencias.", isMinimum: true },
  { id: "sb-b-3", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.3. Jesucristo, revelación plena de Dios y acontecimiento y salvación para la humanidad.", isMinimum: true },
  { id: "sb-b-4", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.4. La propuesta ética y religiosa del Reino de Dios en sociedades plurales.", isMinimum: true },
  { id: "sb-b-5", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.5. María, Madre de Jesús y Madre de la Iglesia, testigo de la fe.", isMinimum: true },
  { id: "sb-b-6", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.6. La experiencia y las creencias cristianas expresadas en el Credo de la Iglesia Católica.", isMinimum: true },
  { id: "sb-b-7", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.7. Comprensión de los símbolos y las celebraciones de la liturgia cristiana, de los sacramentos y de su teología.", isMinimum: true },
  { id: "sb-b-8", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.8. Estrategias de análisis de obras de contenido religioso en distintos lenguajes, apreciando la aportación del cristianismo a la cultura.", isMinimum: true },

  // Bloque C
  { id: "sb-c-1", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.1. Jesucristo y su relación con los grupos sociales y religiosos de la época, y su opción preferencial por las personas más desfavorecidas.", isMinimum: true },
  { id: "sb-c-2", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.2. Dinámicas personales y sociales que dificultan o impiden la construcción del bien común, a la luz del Evangelio y de la Tradición cristiana.", isMinimum: true },
  { id: "sb-c-3", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.3. Las diversas iglesias y comunidades cristianas con sus propuestas éticas para la vida en sociedad.", isMinimum: true },
  { id: "sb-c-4", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.4. La valoración positiva de la Iglesia hacia la diversidad religiosa y sus expresiones.", isMinimum: true },
  { id: "sb-c-5", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.5. Situaciones cercanas de injusticia y exclusión analizadas críticamente desde el magisterio social de la Iglesia.", isMinimum: true },
  { id: "sb-c-6", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.6. Proyectos sociales de la Iglesia a lo largo de su historia y su aportación a la inclusión social y a la ecología integral.", isMinimum: true }
];

export const SABERES_ESO_3_4: SaberBásico[] = [
  // Bloque A
  { id: "sb34-a-1", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.1. Rasgos esenciales de la antropología cristiana en diálogo con la dignidad humana.", isMinimum: true },
  { id: "sb34-a-2", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.2. Situaciones vitales y preguntas existenciales en relación con la construcción del proyecto personal.", isMinimum: true },
  { id: "sb34-a-3", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.3. Jesucristo como referencia para el reconocimiento y valoración positiva de la dignidad humana y la solidaridad.", isMinimum: true },
  { id: "sb34-a-4", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.4. El Evangelio como respuesta a la búsqueda de sentido.", isMinimum: true },
  { id: "sb34-a-5", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.5. Estrategias de comunicación en distintos lenguajes de las propias ideas, creencias y experiencias en contextos interculturales.", isMinimum: true },
  { id: "sb34-a-6", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.6. Razonabilidad de la fe, desarrollo integral de la persona y fomento del bien común.", isMinimum: true },
  { id: "sb34-a-7", category: "A. Dignidad humana y proyecto personal en la visión cristiana de la vida.", description: "A.7. La transformación social como vocación personal y proyecto profesional.", isMinimum: true },
  
  // Bloque B
  { id: "sb34-b-1", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.1. La Iglesia como comunidad de los discípulos de Jesucristo.", isMinimum: true },
  { id: "sb34-b-2", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.2. Principios y valores de la enseñanza social de la Iglesia y su aplicación en sociedades democráticas.", isMinimum: true },
  { id: "sb34-b-3", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.3. La Biblia como fuente de conocimiento para entender la historia e identidad de Occidente y el diálogo intercultural.", isMinimum: true },
  { id: "sb34-b-4", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.4. La vida de la Iglesia como generadora de identidad y cultura a lo largo de la historia: análisis de sus contribuciones a la construcción social, política y cultural.", isMinimum: true },
  { id: "sb34-b-5", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.5. Respeto ante la belleza de las diversas manifestaciones culturales y religiosas como elemento de pertenencia y tradición cultural.", isMinimum: true },
  { id: "sb34-b-6", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.6. Valor de las prácticas espirituales del monacato, la mística y la devoción popular.", isMinimum: true },
  { id: "sb34-b-7", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.7. Aprecio de la relación del mensaje cristiano con la ciencia y la cultura como medio de enriquecimiento del conjunto de los saberes.", isMinimum: true },
  { id: "sb34-b-8", category: "B. Cosmovisión, identidad cristiana y expresión cultural.", description: "B.8. Figuras históricas y eclesiales comprometidas con el bien común.", isMinimum: true },

  // Bloque C
  { id: "sb34-c-1", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.1. Los derechos humanos y los objetivos de desarrollo sostenible en relación con el pensamiento social cristiano.", isMinimum: true },
  { id: "sb34-c-2", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.2. Proyectos eclesiales que trabajan la amistad social, la solidaridad intergeneracional y la sostenibilidad del planeta.", isMinimum: true },
  { id: "sb34-c-3", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.3. Propuestas de la ética social de la Iglesia aplicadas a los desafíos del mundo actual y al paradigma tecnocrático.", isMinimum: true },
  { id: "sb34-c-4", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.4. Actitudes y destrezas de diálogo ecuménico e interreligioso con pleno respeto a las convicciones propias y las de los otros.", isMinimum: true },
  { id: "sb34-c-5", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.5. El compromiso de las religiones en la construcción de la paz y la superación de la violencia y los fundamentalismos.", isMinimum: true },
  { id: "sb34-c-6", category: "C. Corresponsables en el cuidado de las personas y del planeta.", description: "C.6. La esperanza cristiana y la santidad.", isMinimum: true }
];
