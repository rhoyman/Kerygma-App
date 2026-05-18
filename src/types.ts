/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActivityCategory = 'motivación' | 'activación' | 'exploración' | 'estructuración' | 'aplicación' | 'conclusión';

export interface Activity {
  id: string;
  title: string;
  category?: ActivityCategory;
  description: string;
  timing: string;
  resources: string;
  criteria?: string;
  exercises?: string;
  methodology?: string;
}

export interface UnitPlan {
  suggestedContent: string;
  justification?: string;
  methodology: string;
  finalProductMode: 'cumulative' | 'recopilatory';
  finalProductTitle?: string;
  finalProductDescription?: string;
  finalProduct: string;
  numberOfActivities?: number;
  numberOfSessions?: number;
  sessionDuration?: number;
}

export interface EvaluationInstrument {
  id: string;
  name: string;
  description: string;
  linkedActivitiesIds: string[];
  type?: 'Rúbrica' | 'Lista de Cotejo' | 'Prueba Escrita' | 'Escala de Valoración' | 'Diana de Autoevaluación' | 'Otro';
  content?: any; 
  canvaPrompt?: string; 
}

export interface EvaluationSection {
  instruments: EvaluationInstrument[];
  generalCriteria?: string;
}

export interface DiversityMeasure {
  id: string;
  type: 'TEA' | 'TDAH' | 'Alta Capacidad' | 'Discapacidad' | 'Otro';
  need: string;
  measure: string;
  methodologyAdjustments: string;
}

export interface DiversitySection {
  measures: DiversityMeasure[];
  generalObservations?: string;
}

export interface DocenteEvalSection {
  materiaResults?: string;
  metodosPedagogicos?: string;
  materialesRecursos?: string;
  eficaciaDiversidad?: string;
  instrumentosVariedad?: string;
  selectedCategories?: string[];
  reflectionQuestions?: { [key: string]: string[] };
}

export interface StudentGroup {
  id: string;
  userId: string;
  course: string;
  letter: string;
  school: string;
  stage?: 'Infantil' | 'Primaria' | 'Secundaria' | 'Bachillerato';
  studentDescription: string;
  needsDescription: string;
  municipality?: string;
  province?: string;
  address?: string;
  placeId?: string;
}

export interface CurriculumBlock {
  id: string;
  userId?: string;
  title?: string;
  stage: 'Infantil' | 'Primaria' | 'Secundaria' | 'Bachillerato';
  level: string; 
  initialized?: boolean;
  step: 'selection' | 'planning' | 'sequencing' | 'diversity' | 'evaluation' | 'docente_eval';
  creationMode?: 'curriculum' | 'content';
  materials?: string; 
  competenciasEspecíficas: Competencia[];
  saberesBásicos: SaberBásico[];
  planningNotes?: string;
  evaluationNotes?: string;
  plan?: UnitPlan;
  activities?: Activity[];
  evaluation?: EvaluationSection;
  docenteEval?: DocenteEvalSection;
  diversity?: DiversitySection;
  updatedAt?: any;
  selectedGroupIds?: string[];
  groupDiversity?: { [groupId: string]: DiversitySection };
}

export interface Competencia {
  id: string;
  description: string;
  criteriosEvaluación: Criterio[];
}

export interface Criterio {
  id: string;
  description: string;
  isMinimum: boolean;
  concreción?: string; 
  linkedSaberesIds?: string[];
  selected?: boolean;
}

export interface SaberBásico {
  id: string;
  category: string;
  description: string;
  isMinimum: boolean;
  concreción?: string;
  selected?: boolean;
}

export interface PlanningState {
  blocks: CurriculumBlock[];
}
