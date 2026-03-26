import { ChangeRecord } from '../types';

export interface RiskScore {
  total: number;
  breakdown: RiskFactor[];
  level: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
}

const riskBaseScore: Record<string, number> = {
  low: 5,
  medium: 15,
  high: 30,
  critical: 45,
};

const typeMultiplier: Record<string, number> = {
  standard: 0.5,
  normal: 1,
  emergency: 1.5,
};

const scopeScore: Record<string, number> = {
  'project-only': 5,
  'operational-only': 10,
  'cross-domain': 20,
};

export function calculateRiskScore(change: ChangeRecord): RiskScore {
  const factors: RiskFactor[] = [];

  const baseRisk = riskBaseScore[change.risk] || 15;
  factors.push({
    name: 'Declared risk level',
    score: baseRisk,
    maxScore: 45,
    description: `${change.risk} risk — base score`,
  });

  const scope = scopeScore[change.scope] || 5;
  factors.push({
    name: 'Change scope',
    score: scope,
    maxScore: 20,
    description: change.scope === 'cross-domain'
      ? 'Cross-domain changes carry higher governance risk'
      : `${change.scope.replace(/-/g, ' ')} scope`,
  });

  const multiplier = typeMultiplier[change.type] || 1;
  const typeScore = Math.round(5 * multiplier);
  factors.push({
    name: 'Change type',
    score: typeScore,
    maxScore: 8,
    description: change.type === 'emergency'
      ? 'Emergency changes bypass normal assessment — higher inherent risk'
      : `${change.type} change type`,
  });

  const serviceCount = change.affectedServices.length;
  const serviceScore = Math.min(serviceCount * 4, 15);
  factors.push({
    name: 'Service impact breadth',
    score: serviceScore,
    maxScore: 15,
    description: serviceCount === 0
      ? 'No services directly affected'
      : `${serviceCount} service${serviceCount > 1 ? 's' : ''} affected`,
  });

  const projectCount = change.affectedProjects.length;
  const projectScore = Math.min(projectCount * 4, 12);
  factors.push({
    name: 'Project impact breadth',
    score: projectScore,
    maxScore: 12,
    description: projectCount === 0
      ? 'No projects directly affected'
      : `${projectCount} project${projectCount > 1 ? 's' : ''} affected`,
  });

  const total = Math.min(
    factors.reduce((sum, f) => sum + f.score, 0),
    100
  );

  let level: RiskScore['level'];
  let recommendation: string;

  if (total <= 20) {
    level = 'low';
    recommendation = 'Standard approval path. Minimal additional oversight needed.';
  } else if (total <= 45) {
    level = 'medium';
    recommendation = 'Normal approval path. Ensure impact assessment is thorough.';
  } else if (total <= 70) {
    level = 'high';
    recommendation = 'Enhanced governance required. Senior authority review recommended. Mandatory rollback plan.';
  } else {
    level = 'critical';
    recommendation = 'Maximum governance controls. Requires senior authority approval, mandatory rollback plan, and dedicated implementation monitoring.';
  }

  return { total, breakdown: factors, level, recommendation };
}

export function getRiskColor(level: string): { bg: string; text: string; bar: string } {
  switch (level) {
    case 'low':      return { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' };
    case 'medium':   return { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    case 'high':     return { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' };
    case 'critical': return { bg: 'bg-red-100', text: 'text-red-900', bar: 'bg-red-700' };
    default:         return { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-500' };
  }
}
