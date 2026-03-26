import { describe, it, expect } from 'vitest';
import { findSimilarChanges, getSimilarityLabel } from '../similarity';
import { ChangeRecord } from '../../types';

const mockChange = (overrides: Partial<ChangeRecord>): ChangeRecord => ({
  id: 'CF-TEST',
  title: 'Test Change',
  description: 'A test change description',
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

describe('findSimilarChanges', () => {
  it('returns empty array when no other changes exist', () => {
    const target = mockChange({ id: 'CF-001' });
    const results = findSimilarChanges(target, [target]);
    expect(results).toHaveLength(0);
  });

  it('finds changes with same category', () => {
    const target = mockChange({ id: 'CF-001', category: 'security' });
    const similar = mockChange({ id: 'CF-002', category: 'security' });
    const different = mockChange({ id: 'CF-003', category: 'network' });

    const results = findSimilarChanges(target, [target, similar, different]);
    const ids = results.map((r) => r.change.id);
    expect(ids).toContain('CF-002');
  });

  it('scores title similarity higher than category alone', () => {
    const target = mockChange({
      id: 'CF-001',
      title: 'Database migration to cloud',
      category: 'data',
    });
    const titleMatch = mockChange({
      id: 'CF-002',
      title: 'Database migration from legacy',
      category: 'infrastructure',
    });
    const categoryMatch = mockChange({
      id: 'CF-003',
      title: 'Something completely different',
      category: 'data',
    });

    const results = findSimilarChanges(target, [target, titleMatch, categoryMatch]);
    expect(results.length).toBeGreaterThan(0);
    if (results.length >= 2) {
      expect(results[0].change.id).toBe('CF-002');
    }
  });

  it('detects shared affected services', () => {
    const target = mockChange({
      id: 'CF-001',
      affectedServices: ['SVC-001', 'SVC-002'],
    });
    const overlapping = mockChange({
      id: 'CF-002',
      affectedServices: ['SVC-002', 'SVC-003'],
    });

    const results = findSimilarChanges(target, [target, overlapping]);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].reasons.some((r) => r.includes('service'))).toBe(true);
  });

  it('respects maxResults parameter', () => {
    const target = mockChange({ id: 'CF-001', category: 'security' });
    const others = Array.from({ length: 10 }, (_, i) =>
      mockChange({ id: `CF-${i + 10}`, category: 'security' })
    );

    const results = findSimilarChanges(target, [target, ...others], 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });
});

describe('getSimilarityLabel', () => {
  it('returns correct label for high score', () => {
    expect(getSimilarityLabel(0.8).text).toBe('Very similar');
  });

  it('returns correct label for medium score', () => {
    expect(getSimilarityLabel(0.5).text).toBe('Similar');
  });

  it('returns correct label for low score', () => {
    expect(getSimilarityLabel(0.2).text).toBe('Loosely related');
  });
});
