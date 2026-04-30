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
  finalProductMode: 'cumulative' | 'compilatory';
  finalProductTitle?: string;
  finalProductDescription?: string;
  finalProduct: string;
  numberOfActivities?: number;
}

export interface CurriculumBlock {
  id: string;
  userId?: string;
  title?: string;
  stage: 'Infantil' | 'Primaria' | 'Secundaria' | 'Bachillerato';
  level: string; 
  initialized?: boolean;
  step: 'selection' | 'planning' | 'sequencing';
  creationMode?: 'curriculum' | 'content';
  materials?: string; 
  competenciasEspecíficas: Competencia[];
  saberesBásicos: SaberBásico[];
  plan?: UnitPlan;
  activities?: Activity[];
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
