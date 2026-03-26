import { describe, it, expect } from 'vitest';
import { classifyChange, getConfidenceColor } from '../classification';

describe('classifyChange', () => {
  it('classifies emergency security vulnerability', () => {
    const result = classifyChange(
      'Emergency security patch',
      'Critical vulnerability discovered in production payment API. Immediate patching required.'
    );
    expect(result.type.value).toBe('emergency');
    expect(result.category.value).toBe('security');
    expect(result.risk.value).toBe('critical');
  });

  it('classifies standard maintenance', () => {
    const result = classifyChange(
      'Routine certificate renewal',
      'Scheduled renewal of SSL certificates for the web servers. Standard maintenance procedure.'
    );
    expect(result.type.value).toBe('standard');
  });

  it('classifies infrastructure change', () => {
    const result = classifyChange(
      'Server migration to cloud',
      'Migrate the on-premise database server to AWS cloud infrastructure. Provision new VM with increased storage and memory.'
    );
    expect(result.category.value).toBe('infrastructure');
  });

  it('classifies network change', () => {
    const result = classifyChange(
      'DNS configuration update',
      'Update DNS records for the new load balancer. Modify subnet routing and VLAN configuration.'
    );
    expect(result.category.value).toBe('network');
  });

  it('classifies data change', () => {
    const result = classifyChange(
      'Database schema migration',
      'Migrate database schema to add new tables and indexes for the analytics data warehouse.'
    );
    expect(result.category.value).toBe('data');
  });

  it('detects cross-domain scope', () => {
    const result = classifyChange(
      'API upgrade affecting live service',
      'Upgrade the payment API which is a production service used by the checkout project. Affects both teams.'
    );
    expect(result.scope.value).toBe('cross-domain');
  });

  it('detects operational scope', () => {
    const result = classifyChange(
      'Service monitoring update',
      'Update operational monitoring thresholds for SLA availability targets on the infrastructure.'
    );
    expect(result.scope.value).toBe('operational-only');
  });

  it('returns confidence scores between 0 and 95', () => {
    const result = classifyChange('Test change', 'A generic test description');
    expect(result.type.confidence).toBeGreaterThanOrEqual(0);
    expect(result.type.confidence).toBeLessThanOrEqual(95);
    expect(result.risk.confidence).toBeGreaterThanOrEqual(0);
    expect(result.risk.confidence).toBeLessThanOrEqual(95);
  });

  it('returns reasons for all fields', () => {
    const result = classifyChange('Emergency server outage', 'Production server down');
    expect(result.type.reason.length).toBeGreaterThan(0);
    expect(result.risk.reason.length).toBeGreaterThan(0);
    expect(result.category.reason.length).toBeGreaterThan(0);
    expect(result.scope.reason.length).toBeGreaterThan(0);
  });

  it('defaults to normal/medium/application for vague input', () => {
    const result = classifyChange('Something', 'Do a thing');
    expect(result.type.value).toBe('normal');
    expect(result.risk.value).toBe('medium');
  });
});

describe('getConfidenceColor', () => {
  it('returns green for high confidence', () => {
    expect(getConfidenceColor(80)).toContain('green');
  });

  it('returns yellow for medium confidence', () => {
    expect(getConfidenceColor(50)).toContain('yellow');
  });

  it('returns gray for low confidence', () => {
    expect(getConfidenceColor(20)).toContain('gray');
  });
});
