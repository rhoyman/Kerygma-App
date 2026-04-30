/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurriculumBlock } from "../types";

export const DEFAULT_CURRICULUM: CurriculumBlock[] = [
  {
    id: "primaria-1",
    title: "La Alegría de ser Hijos de Dios",
    stage: "Primaria",
    level: "1º Primaria",
    initialized: true,
    step: "selection",
    creationMode: "curriculum",
    competenciasEspecíficas: [
      {
        id: "ce-1",
        description: "Descubrir la identidad en relación con los demás y con Dios.",
        criteriosEvaluación: [
          {
            id: "crit-1.1",
            description: "Identificar rasgos de la propia identidad y la de los demás.",
            isMinimum: true,
            concreción: "La alegría de ser hijos de Dios."
          },
          {
            id: "crit-1.2",
            description: "Diferenciar la propuesta cristiana de otras visiones de la realidad.",
            isMinimum: false
          }
        ]
      }
    ],
    saberesBásicos: [
      {
        id: "sb-1",
        category: "Identidad",
        description: "El ser humano como creación de Dios.",
        isMinimum: true,
        concreción: "Sentido del asombro ante la naturaleza."
      }
    ]
  },
  {
    id: "infantil-1",
    title: "Dios Padre nos regala la Vida",
    stage: "Infantil",
    level: "Infantil 5 años",
    initialized: true,
    step: "selection",
    creationMode: "curriculum",
    competenciasEspecíficas: [
      {
        id: "ce-inf-1",
        description: "Descubrir el entorno y la vida como regalo.",
        criteriosEvaluación: [
          {
            id: "crit-inf-1.1",
            description: "Agradecer los dones de la vida y el entorno.",
            isMinimum: true,
            concreción: "Celebración de la vida como regalo de Dios Padre."
          }
        ]
      }
    ],
    saberesBásicos: [
      {
        id: "sb-inf-1",
        category: "Vida",
        description: "Dios Padre nos quiere y nos cuida.",
        isMinimum: true
      }
    ]
  },
  {
    id: "secundaria-1",
    title: "La Dignidad Humana",
    stage: "Secundaria",
    level: "1º ESO",
    initialized: true,
    step: "selection",
    creationMode: "curriculum",
    competenciasEspecíficas: [
      {
        id: "ce-eso-1",
        description: "Analizar la realidad desde la cosmovisión cristiana.",
        criteriosEvaluación: [
          {
            id: "crit-eso-1.1",
            description: "Interpretar la vida como un don recibido.",
            isMinimum: true,
            concreción: "El valor de la vida humana y la dignidad de la persona."
          }
        ]
      }
    ],
    saberesBásicos: [
      {
        id: "sb-eso-1",
        category: "Cosmovisión",
        description: "El proyecto de Dios sobre la humanidad.",
        isMinimum: true
      }
    ]
  },
  {
    id: "bach-1",
    title: "Antropología y Bioética",
    stage: "Bachillerato",
    level: "1º Bachillerato",
    initialized: true,
    step: "selection",
    creationMode: "curriculum",
    competenciasEspecíficas: [
      {
        id: "ce-bach-1",
        description: "Fundamentar la dignidad humana en el marco de la antropología cristiana.",
        criteriosEvaluación: [
          {
            id: "crit-bach-1.1",
            description: "Argumentar el valor sagrado de la vida humana.",
            isMinimum: true,
            concreción: "Debate sobre bioética y dignidad desde la perspectiva de la fe."
          }
        ]
      }
    ],
    saberesBásicos: [
      {
        id: "sb-bach-1",
        category: "Antropología",
        description: "El ser humano, imagen y semejanza de Dios.",
        isMinimum: true
      }
    ]
  }
];
