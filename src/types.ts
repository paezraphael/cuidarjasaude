/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// GitHub Issues & Backlog Types
export type IssueLabel = 'MVP' | 'frontend' | 'backend' | 'UX' | 'accessibility' | 'bug' | 'enhancement';

export type IssueStatus = 'backlog' | 'in-progress' | 'review' | 'done';

export type IssuePriority = 'high' | 'medium' | 'low';

export interface GitHubIssue {
  id: string;
  number: number;
  title: string;
  description: string;
  epic: string;
  status: IssueStatus;
  priority: IssuePriority;
  labels: IssueLabel[];
  estimatedDays: number;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  progress: number;
}

// System Architecture Types
export interface ArchModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  subsystems: string[];
  scalability: string;
}

export interface IntegrationAPI {
  name: string;
  provider: string;
  purpose: string;
  type: 'free' | 'paid' | 'hybrid';
  details: string;
}

// MVP Schedule Day Types
export interface MVPDay {
  day: number;
  title: string;
  objectives: string[];
  tasks: {
    title: string;
    type: 'frontend' | 'backend' | 'ux' | 'infra';
    mandatory: boolean;
  }[];
  validationMethod: string;
}

// Health Unit Sim Type
export interface HealthUnit {
  id: string;
  name: string;
  type: 'Hospital SUS' | 'UPA' | 'UBS' | 'Farmácia Popular';
  distance: string;
  waitingTime: string;
  accessibleEntrance: boolean;
  elevators: boolean;
  adaptedToilets: boolean;
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

// Public Transit Sim Type
export interface TransitLine {
  id: string;
  code: string;
  name: string;
  etaMinutes: number;
  accessibleRamp: boolean;
  wheelchairSpaces: number;
  sensoryGuided: boolean;
}
