import { Competencia, SaberBásico, Criterio } from "../types";

export const STAGES = ["Infantil", "Primaria", "Secundaria", "Bachillerato"] as const;

export const STAGE_LEVELS: Record<string, string[]> = {
  "Infantil": ["3 años", "4 años", "5 años"],
  "Primaria": ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria"],
  "Secundaria": ["1º ESO", "2º ESO", "3º ESO", "4º ESO"],
  "Bachillerato": ["1º Bachillerato", "2º Bachillerato"]
};

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
