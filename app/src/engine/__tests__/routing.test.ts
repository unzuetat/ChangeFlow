import { describe, it, expect } from 'vitest';
import { matchRoutingRule, resolveRoutingDecision, routeChange, validateRoutingRule } from '../routing';
import { defaultRoutingRules } from '../routing-rules-default';
import type { RoutingRule, RoutingInput } from '../../types/routing';
import type { MethodologicalProfile } from '../../types/profile';

// Minimal PRINCE2+ITIL profile for testing role resolution
const testProfile: MethodologicalProfile = {
  id: 'prince2-itil',
  name: 'PRINCE2 + ITIL 4',
  description: 'Test profile',
  projectMethodology: 'PRINCE2',
  operationsMethodology: 'ITIL 4',
  vocabulary: {} as MethodologicalProfile['vocabulary'],
  roles: {
    projectApprovalAuthority: 'Change Authority (Project Board)',
    operationalApprovalAuthority: 'Change Advisory Board (CAB)',
    seniorProjectAuthority: 'Project Board (Executive)',
    emergencyProjectAuthority: 'Project Board (Exception)',
    emergencyOpsAuthority: 'Emergency CAB (ECAB)',
    changeCoordinator: 'Project Support / Change Manager',
    projectAssessor: 'Project Manager',
    operationalAssessor: 'Change Manager / Technical Assessor',
    projectExecutive: 'Executive',
  },
  artifacts: {} as MethodologicalProfile['artifacts'],
  escalation: {} as MethodologicalProfile['escalation'],
};

const baseInput: RoutingInput = {
  scope: 'project-only',
  type: 'normal',
  category: 'application',
  risk: 'medium',
  originType: 'project',
  affectedSystems: ['application'],
};

// =============================================================================
// matchRoutingRule tests
// =============================================================================

describe('matchRoutingRule', () => {
  it('returns highest priority matching rule', () => {
    const rules: RoutingRule[] = [
      { ...defaultRoutingRules[6], priority: 30 }, // project normal
      { ...defaultRoutingRules[7], priority: 10 }, // catch-all
    ];
    const input: RoutingInput = { ...baseInput, scope: 'project-only' };
    const result = matchRoutingRule(input, rules);
    expect(result?.id).toBe('rule-project-normal');
  });

  it('uses AND logic across condition fields', () => {
    const rule: RoutingRule = {
      id: 'test-and',
      name: 'Test AND',
      description: '',
      priority: 100,
      conditions: {
        scope: ['cross-domain'],
        riskLevel: ['high'],
      },
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    // scope matches but risk doesn't
    const input: RoutingInput = { ...baseInput, scope: 'cross-domain', risk: 'low' };
    expect(matchRoutingRule(input, [rule])).toBeNull();

    // both match
    const input2: RoutingInput = { ...baseInput, scope: 'cross-domain', risk: 'high' };
    expect(matchRoutingRule(input2, [rule])?.id).toBe('test-and');
  });

  it('uses OR logic within condition field arrays', () => {
    const rule: RoutingRule = {
      id: 'test-or',
      name: 'Test OR',
      description: '',
      priority: 100,
      conditions: { riskLevel: ['high', 'critical'] },
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    expect(matchRoutingRule({ ...baseInput, risk: 'high' }, [rule])?.id).toBe('test-or');
    expect(matchRoutingRule({ ...baseInput, risk: 'critical' }, [rule])?.id).toBe('test-or');
    expect(matchRoutingRule({ ...baseInput, risk: 'low' }, [rule])).toBeNull();
  });

  it('treats omitted condition fields as wildcards', () => {
    const rule: RoutingRule = {
      id: 'test-wildcard',
      name: 'Wildcard',
      description: '',
      priority: 100,
      conditions: {}, // no conditions = matches everything
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    expect(matchRoutingRule(baseInput, [rule])?.id).toBe('test-wildcard');
  });

  it('skips disabled rules', () => {
    const rule: RoutingRule = {
      id: 'test-disabled',
      name: 'Disabled',
      description: '',
      priority: 100,
      conditions: {},
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: false,
    };
    expect(matchRoutingRule(baseInput, [rule])).toBeNull();
  });

  it('uses stable sort for equal priority (first in array wins)', () => {
    const ruleA: RoutingRule = {
      id: 'first',
      name: 'First',
      description: '',
      priority: 50,
      conditions: {},
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    const ruleB: RoutingRule = {
      id: 'second',
      name: 'Second',
      description: '',
      priority: 50,
      conditions: {},
      result: { primaryApprover: 'projectExecutive', notify: [] },
      enabled: true,
    };
    expect(matchRoutingRule(baseInput, [ruleA, ruleB])?.id).toBe('first');
  });

  it('returns null for empty rules array', () => {
    expect(matchRoutingRule(baseInput, [])).toBeNull();
  });

  it('returns null when no rule matches', () => {
    const rule: RoutingRule = {
      id: 'no-match',
      name: 'No match',
      description: '',
      priority: 100,
      conditions: { scope: ['cross-domain'] },
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    expect(matchRoutingRule({ ...baseInput, scope: 'project-only' }, [rule])).toBeNull();
  });
});

// =============================================================================
// resolveRoutingDecision tests
// =============================================================================

describe('resolveRoutingDecision', () => {
  it('resolves role keys to PRINCE2+ITIL profile names', () => {
    const rule = defaultRoutingRules[3]; // cross-domain normal
    const input: RoutingInput = { ...baseInput, scope: 'cross-domain' };
    const decision = resolveRoutingDecision('CF-TEST', rule, input, testProfile);

    expect(decision.primaryApprover).toBe('Change Authority (Project Board)');
    expect(decision.secondaryApprover).toBe('Change Advisory Board (CAB)');
    expect(decision.fallback).toBe(false);
  });

  it('produces fallback decision when no rule matched', () => {
    const decision = resolveRoutingDecision('CF-TEST', null, baseInput, testProfile);

    expect(decision.primaryApprover).toBe('Project Support / Change Manager');
    expect(decision.fallback).toBe(true);
    expect(decision.matchedRuleId).toBeNull();
  });

  it('builds a non-empty reason string', () => {
    const rule = defaultRoutingRules[0]; // emergency cross-domain
    const input: RoutingInput = { ...baseInput, type: 'emergency', scope: 'cross-domain' };
    const decision = resolveRoutingDecision('CF-TEST', rule, input, testProfile);

    expect(decision.reason).toContain('emergency');
    expect(decision.reason).toContain('cross-domain');
  });

  it('sets decidedAt to a valid ISO string', () => {
    const decision = resolveRoutingDecision('CF-TEST', null, baseInput, testProfile);
    expect(() => new Date(decision.decidedAt)).not.toThrow();
    expect(new Date(decision.decidedAt).toISOString()).toBe(decision.decidedAt);
  });

  it('handles missing role key gracefully with [Unknown role] marker', () => {
    // Remove changeCoordinator entirely to trigger the unknown role path
    const brokenRoles = { ...testProfile.roles } as unknown as Record<string, string>;
    delete brokenRoles['changeCoordinator'];
    const brokenProfile = {
      ...testProfile,
      roles: brokenRoles as unknown as typeof testProfile.roles,
    };
    const decision = resolveRoutingDecision('CF-TEST', null, baseInput, brokenProfile);
    expect(decision.primaryApprover).toContain('[Unknown role');
  });
});

// =============================================================================
// routeChange integration tests (using default rules + seed scenarios)
// =============================================================================

describe('routeChange integration', () => {
  it('CF-0001: cross-domain + normal + high risk → senior project + operational', () => {
    const input: RoutingInput = {
      scope: 'cross-domain',
      type: 'normal',
      category: 'data',
      risk: 'high',
      originType: 'project',
      affectedSystems: ['database', 'application'],
    };
    const decision = routeChange('CF-0001', input, defaultRoutingRules, testProfile);

    expect(decision.primaryApprover).toBe('Project Board (Executive)');
    expect(decision.secondaryApprover).toBe('Change Advisory Board (CAB)');
    expect(decision.fallback).toBe(false);
  });

  it('CF-0002: operational-only + standard + low → operational authority', () => {
    const input: RoutingInput = {
      scope: 'operational-only',
      type: 'standard',
      category: 'security',
      risk: 'low',
      originType: 'operational',
      affectedSystems: ['application', 'security'],
    };
    const decision = routeChange('CF-0002', input, defaultRoutingRules, testProfile);

    expect(decision.primaryApprover).toBe('Change Advisory Board (CAB)');
    expect(decision.secondaryApprover).toBeNull();
    expect(decision.fallback).toBe(false);
  });

  it('CF-0003: emergency + cross-domain + critical → emergency authorities', () => {
    const input: RoutingInput = {
      scope: 'cross-domain',
      type: 'emergency',
      category: 'security',
      risk: 'critical',
      originType: 'incident',
      affectedSystems: ['database', 'security', 'infrastructure'],
    };
    const decision = routeChange('CF-0003', input, defaultRoutingRules, testProfile);

    expect(decision.primaryApprover).toBe('Project Board (Exception)');
    expect(decision.secondaryApprover).toBe('Emergency CAB (ECAB)');
    expect(decision.fallback).toBe(false);
  });

  it('CF-0004: project-only + normal + medium → project authority', () => {
    const input: RoutingInput = {
      scope: 'project-only',
      type: 'normal',
      category: 'application',
      risk: 'medium',
      originType: 'project',
      affectedSystems: ['application'],
    };
    const decision = routeChange('CF-0004', input, defaultRoutingRules, testProfile);

    expect(decision.primaryApprover).toBe('Change Authority (Project Board)');
    expect(decision.secondaryApprover).toBeNull();
    expect(decision.fallback).toBe(false);
  });

  it('CF-0005: cross-domain + normal + high + network → senior project + operational', () => {
    const input: RoutingInput = {
      scope: 'cross-domain',
      type: 'normal',
      category: 'network',
      risk: 'high',
      originType: 'business-request',
      affectedSystems: ['network', 'infrastructure'],
    };
    const decision = routeChange('CF-0005', input, defaultRoutingRules, testProfile);

    expect(decision.primaryApprover).toBe('Project Board (Executive)');
    expect(decision.secondaryApprover).toBe('Change Advisory Board (CAB)');
    expect(decision.fallback).toBe(false);
  });
});

// =============================================================================
// validateRoutingRule tests
// =============================================================================

describe('validateRoutingRule', () => {
  it('returns valid with no warnings for a well-formed rule', () => {
    const result = validateRoutingRule(defaultRoutingRules[0]);
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when cross-domain rule has no secondary approver', () => {
    const rule: RoutingRule = {
      id: 'test-warn',
      name: 'Bad cross-domain',
      description: '',
      priority: 50,
      conditions: { scope: ['cross-domain'] },
      result: { primaryApprover: 'changeCoordinator', notify: [] },
      enabled: true,
    };
    const result = validateRoutingRule(rule);
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('cross-domain');
  });
});
