// =============================================================================
// ChangeFlow — localStorage Persistence Layer
// =============================================================================

import { defaultRoutingRules } from '../engine/routing-rules-default';
import type { RoutingRule, RoutingDecision } from '../types/routing';

const ROUTING_RULES_KEY = 'cf-routing-rules';
const ROUTING_HISTORY_KEY = 'cf-routing-history';
const HISTORY_CAP = 100;

// -----------------------------------------------------------------------------
// Routing Rules
// -----------------------------------------------------------------------------

export function loadRoutingRules(): RoutingRule[] {
  try {
    const raw = localStorage.getItem(ROUTING_RULES_KEY);
    if (!raw) return [...defaultRoutingRules];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...defaultRoutingRules];
    return parsed;
  } catch {
    return [...defaultRoutingRules];
  }
}

export function saveRoutingRules(rules: RoutingRule[]): void {
  try {
    localStorage.setItem(ROUTING_RULES_KEY, JSON.stringify(rules));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// -----------------------------------------------------------------------------
// Routing History
// -----------------------------------------------------------------------------

export function loadRoutingHistory(): RoutingDecision[] {
  try {
    const raw = localStorage.getItem(ROUTING_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveRoutingDecision(decision: RoutingDecision): void {
  try {
    const history = loadRoutingHistory();
    history.push(decision);
    // FIFO eviction: keep only the last HISTORY_CAP entries
    const trimmed = history.length > HISTORY_CAP
      ? history.slice(history.length - HISTORY_CAP)
      : history;
    localStorage.setItem(ROUTING_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// -----------------------------------------------------------------------------
// Export / Import for sharing rules between users
// -----------------------------------------------------------------------------

export function exportRulesJSON(): string {
  const rules = loadRoutingRules();
  return JSON.stringify(rules, null, 2);
}

export function importRulesJSON(json: string): { rules: RoutingRule[]; errors: string[] } {
  const errors: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { rules: [], errors: ['Invalid JSON format'] };
  }

  if (!Array.isArray(parsed)) {
    return { rules: [], errors: ['Expected a JSON array of routing rules'] };
  }

  const validRules: RoutingRule[] = [];
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    if (!item || typeof item !== 'object') {
      errors.push(`Item ${i}: not an object`);
      continue;
    }
    if (!('id' in item) || !('priority' in item) || !('conditions' in item) || !('result' in item)) {
      errors.push(`Item ${i}: missing required fields (id, priority, conditions, result)`);
      continue;
    }
    validRules.push(item as RoutingRule);
  }

  return { rules: validRules, errors };
}

// -----------------------------------------------------------------------------
// Reset
// -----------------------------------------------------------------------------

export function clearRoutingData(): void {
  localStorage.removeItem(ROUTING_RULES_KEY);
  localStorage.removeItem(ROUTING_HISTORY_KEY);
}
