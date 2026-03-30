// =============================================================================
// ChangeFlow — Routing Engine Type Definitions
// =============================================================================
// The routing engine determines WHO approves each change and WHY.
// Rules use abstract role keys (keyof ProfileRoles) so the same rules
// work across all methodology profiles.
// =============================================================================

import type { ChangeType, ChangeScope, RiskLevel, ChangeCategory } from './index';
import type { ProfileRoles } from './profile';

// -----------------------------------------------------------------------------
// Affected Systems — categorical system types for routing conditions
// -----------------------------------------------------------------------------

export type AffectedSystem =
  | 'infrastructure'
  | 'application'
  | 'database'
  | 'network'
  | 'security'
  | 'cloud'
  | 'endpoint'
  | 'communications';

export const AFFECTED_SYSTEMS: AffectedSystem[] = [
  'infrastructure',
  'application',
  'database',
  'network',
  'security',
  'cloud',
  'endpoint',
  'communications',
];

// -----------------------------------------------------------------------------
// Routing Rule — configurable governance routing logic
// -----------------------------------------------------------------------------

export interface RoutingConditions {
  scope?: ChangeScope[];
  changeType?: ChangeType[];
  category?: ChangeCategory[];
  affectedSystems?: AffectedSystem[];
  originTeam?: ('project' | 'operational' | 'incident' | 'business-request')[];
  riskLevel?: RiskLevel[];
}

export interface RoutingResult {
  primaryApprover: keyof ProfileRoles;
  secondaryApprover?: keyof ProfileRoles;
  notify: (keyof ProfileRoles)[];
}

export interface RoutingRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  conditions: RoutingConditions;
  result: RoutingResult;
  enabled: boolean;
}

// -----------------------------------------------------------------------------
// Routing Decision — the output of the routing engine
// -----------------------------------------------------------------------------

export interface RoutingDecision {
  changeId: string;
  matchedRuleId: string | null;
  ruleName: string;
  primaryApprover: string;
  secondaryApprover: string | null;
  notify: string[];
  reason: string;
  decidedAt: string;
  fallback: boolean;
}

// -----------------------------------------------------------------------------
// Change data input for routing (subset of ChangeRecord fields)
// -----------------------------------------------------------------------------

export interface RoutingInput {
  scope: ChangeScope;
  type: ChangeType;
  category: ChangeCategory;
  risk: RiskLevel;
  originType: 'project' | 'operational' | 'incident' | 'business-request';
  affectedSystems: AffectedSystem[];
}
