
export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export enum ConflictType {
  SOCIAL = 'Social',
  PROFESSIONAL = 'Professional',
  POWER_DYNAMICS = 'Power Dynamics',
  LEADERSHIP = 'Leadership',
  NEGOTIATION = 'Negotiation'
}

export enum CoreSkill {
  EMOTIONAL_CONTROL = 'Emotional Control',
  ASSERTIVENESS = 'Assertiveness',
  SOCIAL_INTELLIGENCE = 'Social Intelligence',
  BOUNDARY_SETTING = 'Boundary Setting',
  PERSUASION = 'Persuasion',
  STATUS_MANAGEMENT = 'Status Management'
}

export interface Choice {
  id: number;
  label: string;
  type: 'EMOTIONAL' | 'AVOIDANT' | 'STRATEGIC';
  text: string;
}

export interface SimulationLog {
  language: string;
  conflictType: ConflictType;
  intensityLevel: IntensityLevel;
  coreSkill: CoreSkill;
  strategicEssence: string;
}

export interface Simulation {
  id: string;
  title: string;
  role: string;
  scene: string;
  microExpressions: string;
  choices: Choice[];
  selectedChoiceId?: number;
  outcome?: string;
  analysis?: string;
  log?: SimulationLog;
}

export interface ArchiveEntry {
  language: string;
  conflictType: ConflictType;
  simulations: Simulation[];
}
