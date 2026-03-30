// =============================================================================
// ChangeFlow — Routing Engine
// =============================================================================
// Pure functions that determine WHO approves each change and WHY.
// No side effects, no store imports. Everything passed as arguments.
// =============================================================================

import type { MethodologicalProfile, ProfileRoles } from '../types/profile';
import type {
  RoutingRule,
  RoutingConditions,
  RoutingInput,
  RoutingDecision,
} from '../types/routing';

// -----------------------------------------------------------------------------
// matchRoutingRule — find the highest-priority rule that matches the change
// -----------------------------------------------------------------------------

function conditionMatches<T>(conditionValues: T[] | undefined, actual: T): boolean {
  if (!conditionValues || conditionValues.length === 0) return true; // wildcard
  return conditionValues.includes(actual);
}

function conditionMatchesArray<T>(conditionValues: T[] | undefined, actual: T[]): boolean {
  if (!conditionValues || conditionValues.length === 0) return true; // wildcard
  if (actual.length === 0) return true; // no actual values = wildcard match
  return conditionValues.some(cv => actual.includes(cv));
}

function ruleMatchesChange(conditions: RoutingConditions, input: RoutingInput): boolean {
  return (
    conditionMatches(conditions.scope, input.scope) &&
    conditionMatches(conditions.changeType, input.type) &&
    conditionMatches(conditions.category, input.category) &&
    conditionMatches(conditions.riskLevel, input.risk) &&
    conditionMatches(conditions.originTeam, input.originType) &&
    conditionMatchesArray(conditions.affectedSystems, input.affectedSystems)
  );
}

export function matchRoutingRule(
  input: RoutingInput,
  rules: RoutingRule[]
): RoutingRule | null {
  const enabledRules = rules.filter(r => r.enabled);

  // Sort by priority descending (stable sort preserves insertion order for ties)
  const sorted = [...enabledRules].sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    if (ruleMatchesChange(rule.conditions, input)) {
      return rule;
    }
  }

  return null;
}

// -----------------------------------------------------------------------------
// resolveRoutingDecision — resolve abstract role keys to human-readable names
// -----------------------------------------------------------------------------

function resolveRoleKey(key: keyof ProfileRoles, profile: MethodologicalProfile): string {
  const name = profile.roles[key];
  if (!name) {
    return `[Unknown role: ${key}]`;
  }
  return name;
}

function buildReason(rule: RoutingRule, input: RoutingInput): string {
  const parts: string[] = [];

  const c = rule.conditions;
  if (c.changeType?.length) {
    parts.push(`type is ${input.type}`);
  }
  if (c.scope?.length) {
    parts.push(`scope is ${input.scope}`);
  }
  if (c.riskLevel?.length) {
    parts.push(`risk is ${input.risk}`);
  }
  if (c.category?.length) {
    parts.push(`category is ${input.category}`);
  }
  if (c.originTeam?.length) {
    parts.push(`origin is ${input.originType}`);
  }
  if (c.affectedSystems?.length) {
    parts.push(`systems: ${input.affectedSystems.join(', ')}`);
  }

  if (parts.length === 0) {
    return `Matched catch-all rule "${rule.name}"`;
  }

  return `Matched "${rule.name}" because ${parts.join(', ')}`;
}

export function resolveRoutingDecision(
  changeId: string,
  matchedRule: RoutingRule | null,
  input: RoutingInput,
  profile: MethodologicalProfile
): RoutingDecision {
  if (!matchedRule) {
    return {
      changeId,
      matchedRuleId: null,
      ruleName: 'Fallback',
      primaryApprover: resolveRoleKey('changeCoordinator', profile),
      secondaryApprover: null,
      notify: [resolveRoleKey('projectExecutive', profile)],
      reason: 'No specific routing rule matched. Routed to default coordinator for manual triage.',
      decidedAt: new Date().toISOString(),
      fallback: true,
    };
  }

  const result = matchedRule.result;

  return {
    changeId,
    matchedRuleId: matchedRule.id,
    ruleName: matchedRule.name,
    primaryApprover: resolveRoleKey(result.primaryApprover, profile),
    secondaryApprover: result.secondaryApprover
      ? resolveRoleKey(result.secondaryApprover, profile)
      : null,
    notify: result.notify.map(key => resolveRoleKey(key, profile)),
    reason: buildReason(matchedRule, input),
    decidedAt: new Date().toISOString(),
    fallback: false,
  };
}

// -----------------------------------------------------------------------------
// routeChange — convenience entry point
// -----------------------------------------------------------------------------

export function routeChange(
  changeId: string,
  input: RoutingInput,
  rules: RoutingRule[],
  profile: MethodologicalProfile
): RoutingDecision {
  const matchedRule = matchRoutingRule(input, rules);
  return resolveRoutingDecision(changeId, matchedRule, input, profile);
}

// -----------------------------------------------------------------------------
// validateRoutingRule — check a rule for common mistakes
// -----------------------------------------------------------------------------

export function validateRoutingRule(
  rule: RoutingRule
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Cross-domain rules should have a secondary approver
  if (
    rule.conditions.scope?.includes('cross-domain') &&
    !rule.result.secondaryApprover
  ) {
    warnings.push(
      `Rule "${rule.name}" targets cross-domain changes but has no secondary approver. Cross-domain changes typically require dual approval.`
    );
  }

  // Empty conditions at low priority is a catch-all (intentional)
  // but at high priority it shadows other rules
  const hasConditions = Object.values(rule.conditions).some(
    v => Array.isArray(v) && v.length > 0
  );
  if (!hasConditions && rule.priority > 50) {
    warnings.push(
      `Rule "${rule.name}" has no conditions but high priority (${rule.priority}). It will match everything and shadow lower-priority rules.`
    );
  }

  return { valid: true, warnings };
}
