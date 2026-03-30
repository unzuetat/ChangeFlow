// =============================================================================
// ChangeFlow — Default Routing Rules
// =============================================================================
// Best-practice routing rules based on PRINCE2 + ITIL 4 governance.
// These rules use abstract role keys (keyof ProfileRoles) so they
// produce the correct approver names regardless of active profile.
// =============================================================================

import type { RoutingRule } from '../types/routing';

export const defaultRoutingRules: RoutingRule[] = [
  {
    id: 'rule-emergency-crossdomain',
    name: 'Emergency cross-domain',
    description: 'Emergency changes affecting both project and operations require expedited dual approval from senior authorities.',
    priority: 100,
    conditions: {
      changeType: ['emergency'],
      scope: ['cross-domain'],
    },
    result: {
      primaryApprover: 'emergencyProjectAuthority',
      secondaryApprover: 'emergencyOpsAuthority',
      notify: ['changeCoordinator', 'projectExecutive'],
    },
    enabled: true,
  },
  {
    id: 'rule-emergency-other',
    name: 'Emergency (single domain)',
    description: 'Emergency changes within a single domain are routed to the emergency operational authority for rapid approval.',
    priority: 90,
    conditions: {
      changeType: ['emergency'],
    },
    result: {
      primaryApprover: 'emergencyOpsAuthority',
      notify: ['changeCoordinator', 'projectExecutive'],
    },
    enabled: true,
  },
  {
    id: 'rule-crossdomain-highrisk',
    name: 'Cross-domain high risk',
    description: 'Cross-domain changes with high or critical risk require senior project authority plus operational approval.',
    priority: 80,
    conditions: {
      scope: ['cross-domain'],
      riskLevel: ['high', 'critical'],
    },
    result: {
      primaryApprover: 'seniorProjectAuthority',
      secondaryApprover: 'operationalApprovalAuthority',
      notify: ['changeCoordinator', 'projectAssessor'],
    },
    enabled: true,
  },
  {
    id: 'rule-crossdomain-normal',
    name: 'Cross-domain normal',
    description: 'Cross-domain changes with low or medium risk need dual approval from both project and operational authorities.',
    priority: 70,
    conditions: {
      scope: ['cross-domain'],
    },
    result: {
      primaryApprover: 'projectApprovalAuthority',
      secondaryApprover: 'operationalApprovalAuthority',
      notify: ['changeCoordinator'],
    },
    enabled: true,
  },
  {
    id: 'rule-operational',
    name: 'Operational change',
    description: 'Operational-only changes are routed to the operational approval authority (CAB).',
    priority: 50,
    conditions: {
      scope: ['operational-only'],
    },
    result: {
      primaryApprover: 'operationalApprovalAuthority',
      notify: ['changeCoordinator'],
    },
    enabled: true,
  },
  {
    id: 'rule-project-highrisk',
    name: 'Project high risk',
    description: 'Project-only changes with high or critical risk are escalated to senior project authority.',
    priority: 40,
    conditions: {
      scope: ['project-only'],
      riskLevel: ['high', 'critical'],
    },
    result: {
      primaryApprover: 'seniorProjectAuthority',
      notify: ['changeCoordinator', 'projectAssessor'],
    },
    enabled: true,
  },
  {
    id: 'rule-project-normal',
    name: 'Project normal',
    description: 'Project-only changes with low or medium risk are approved by the standard project approval authority.',
    priority: 30,
    conditions: {
      scope: ['project-only'],
    },
    result: {
      primaryApprover: 'projectApprovalAuthority',
      notify: ['changeCoordinator'],
    },
    enabled: true,
  },
  {
    id: 'rule-catchall',
    name: 'Default routing',
    description: 'Catch-all: changes that do not match any specific rule are routed to the change coordinator for manual triage.',
    priority: 10,
    conditions: {},
    result: {
      primaryApprover: 'changeCoordinator',
      notify: ['projectExecutive'],
    },
    enabled: true,
  },
];
