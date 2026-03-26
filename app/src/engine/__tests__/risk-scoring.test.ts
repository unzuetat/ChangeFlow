import { describe, it, expect } from 'vitest';
import { calculateRiskScore, getRiskColor } from '../risk-scoring';
import { ChangeRecord } from '../../types';

const mockChange = (overrides: Partial<ChangeRecord>): ChangeRecord => ({
  id: 'CF-TEST',
  title: 'Test Change',
  description: 'A test change',
  status: 'submitted',
  type: 'normal',
  scope: 'project-only',
  risk: 'medium',
  category: 'application',
  origin: { type: 'project', referenceId: 'PRJ-001', referenceName: 'Test Project' },
  requesterId: 'P001',
  requestDate: '2026-01-15',
  assessment: null,
  approval: null,
  implementation: null,
  review: null,
  affectedServices: [],
  affectedProjects: [],
  relatedChanges: [],
  aiSuggestions: [],
  timeline: [],
  closedDate: null,
  ...overrides,
});

describe('calculateRiskScore', () => {
  it('returns a score between 0 and 100', () => {
    const change = mockChange({});
    const score = calculateRiskScore(change);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });

  it('scores low-risk project-only standard change as low', () => {
    const change = mockChange({
      risk: 'low',
      scope: 'project-only',
      type: 'standard',
      affectedServices: [],
      affectedProjects: [],
    });
    const score = calculateRiskScore(change);
    expect(score.level).toBe('low');
  });

  it('scores critical cross-domain emergency change as high or critical', () => {
    const change = mockChange({
      risk: 'critical',
      scope: 'cross-domain',
      type: 'emergency',
      affectedServices: ['SVC-001', 'SVC-002', 'SVC-003'],
      affectedProjects: ['PRJ-001', 'PRJ-002'],
    });
    const score = calculateRiskScore(change);
    expect(['high', 'critical']).toContain(score.level);
    expect(score.total).toBeGreaterThan(60);
  });

  it('cross-domain scores higher than project-only with same risk', () => {
    const projectOnly = mockChange({ scope: 'project-only', risk: 'medium' });
    const crossDomain = mockChange({ scope: 'cross-domain', risk: 'medium' });

    const scoreProject = calculateRiskScore(projectOnly);
    const scoreCross = calculateRiskScore(crossDomain);
    expect(scoreCross.total).toBeGreaterThan(scoreProject.total);
  });

  it('emergency type scores higher than standard with same risk', () => {
    const standard = mockChange({ type: 'standard', risk: 'medium' });
    const emergency = mockChange({ type: 'emergency', risk: 'medium' });

    const scoreStandard = calculateRiskScore(standard);
    const scoreEmergency = calculateRiskScore(emergency);
    expect(scoreEmergency.total).toBeGreaterThan(scoreStandard.total);
  });

  it('more affected services increases score', () => {
    const few = mockChange({ affectedServices: ['SVC-001'] });
    const many = mockChange({ affectedServices: ['SVC-001', 'SVC-002', 'SVC-003', 'SVC-004'] });

    const scoreFew = calculateRiskScore(few);
    const scoreMany = calculateRiskScore(many);
    expect(scoreMany.total).toBeGreaterThan(scoreFew.total);
  });

  it('includes breakdown with all factors', () => {
    const change = mockChange({});
    const score = calculateRiskScore(change);
    expect(score.breakdown.length).toBe(5);
    expect(score.breakdown.map((f) => f.name)).toContain('Declared risk level');
    expect(score.breakdown.map((f) => f.name)).toContain('Change scope');
    expect(score.breakdown.map((f) => f.name)).toContain('Change type');
  });

  it('includes a recommendation string', () => {
    const change = mockChange({});
    const score = calculateRiskScore(change);
    expect(score.recommendation.length).toBeGreaterThan(0);
  });
});

describe('getRiskColor', () => {
  it('returns colors for all levels', () => {
    expect(getRiskColor('low').bar).toBe('bg-green-500');
    expect(getRiskColor('medium').bar).toBe('bg-yellow-500');
    expect(getRiskColor('high').bar).toBe('bg-red-500');
    expect(getRiskColor('critical').bar).toBe('bg-red-700');
  });
});
