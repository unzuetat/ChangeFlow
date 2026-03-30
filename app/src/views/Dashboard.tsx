import { useI18n } from '../i18n';
import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { changes as seedChanges } from '../data/seed';
import { calculateRiskScore } from '../engine/risk-scoring';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Shield,
  Zap,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const stageColorMap: Record<string, string> = {
  draft:              'bg-gray-100 text-gray-600',
  submitted:          'bg-gray-200 text-gray-700',
  classified:         'bg-purple-100 text-purple-700',
  assessing:          'bg-orange-100 text-orange-700',
  assessed:           'bg-orange-50 text-orange-600',
  'pending-approval': 'bg-teal-100 text-teal-700',
  approved:           'bg-green-50 text-green-800',
  'approved-with-conditions': 'bg-blue-50 text-blue-700',
  rejected:           'bg-red-100 text-red-800',
  deferred:           'bg-yellow-100 text-yellow-800',
  implementing:       'bg-purple-50 text-purple-800',
  implemented:        'bg-green-100 text-green-800',
  'in-review':        'bg-green-50 text-green-700',
  closed:             'bg-gray-100 text-gray-500',
};

const riskColorMap: Record<string, string> = {
  low:      'bg-green-100 text-green-900',
  medium:   'bg-yellow-100 text-yellow-900',
  high:     'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900',
};

const scopeIcons: Record<string, typeof ArrowRightLeft> = {
  'project-only':     FileText,
  'operational-only': Shield,
  'cross-domain':     ArrowRightLeft,
};

function getRiskBarColor(score: number): string {
  if (score <= 20) return 'bg-green-600';
  if (score <= 45) return 'bg-yellow-600';
  if (score <= 70) return 'bg-red-600';
  return 'bg-red-800';
}

function getRiskTextColor(score: number): string {
  if (score <= 20) return 'text-green-700';
  if (score <= 45) return 'text-yellow-700';
  if (score <= 70) return 'text-red-700';
  return 'text-red-900';
}

export default function Dashboard() {
  const { changes, setChanges, activeProfile } = useStore();
  const { t } = useI18n();
  const [riskOpen, setRiskOpen] = useState(false);

  useEffect(() => {
    if (changes.length === 0) {
      setChanges(seedChanges);
    }
  }, []);

  const total = changes.length;
  const active = changes.filter((c) => !['closed', 'rejected'].includes(c.status)).length;
  const emergency = changes.filter((c) => c.type === 'emergency').length;
  const crossDomain = changes.filter((c) => c.scope === 'cross-domain').length;
  const highRisk = changes.filter((c) => c.risk === 'high' || c.risk === 'critical').length;
  const closed = changes.filter((c) => c.status === 'closed').length;

  const riskScores = changes.map((c) => ({
    id: c.id,
    score: calculateRiskScore(c).total,
  }));
  const avgRisk = riskScores.length > 0
    ? Math.round(riskScores.reduce((sum, r) => sum + r.score, 0) / riskScores.length)
    : 0;

  const riskLabelFn = (score: number): string => {
    if (score <= 20) return t.risk.low;
    if (score <= 45) return t.risk.medium;
    if (score <= 70) return t.risk.high;
    return t.risk.critical;
  };

  const riskMap: Record<string, string> = {
    low: t.risk.low,
    medium: t.risk.medium,
    high: t.risk.high,
    critical: t.risk.critical,
  };

  const statCards = [
    { label: t.dashboard.total,       value: total,       color: 'border-t-cf-500' },
    { label: t.dashboard.active,      value: active,      color: 'border-t-green-600' },
    { label: t.dashboard.emergency,   value: emergency,   color: 'border-t-orange-500' },
    { label: t.dashboard.crossDomain, value: crossDomain, color: 'border-t-pink-600' },
    { label: t.dashboard.critical,    value: highRisk,    color: 'border-t-red-600' },
    { label: t.dashboard.closed,      value: closed,      color: 'border-t-green-700' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {statCards.map(({ label, value, color }) => (
          <div
            key={label}
            className={`bg-white rounded border border-gray-200 border-t-2 ${color} p-3`}
          >
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <div className="text-[10px] text-gray-400 mt-1">{label}</div>
          </div>
        ))}
        <div
          onClick={() => setRiskOpen(!riskOpen)}
          className="bg-white rounded border border-gray-200 border-t-2 border-t-yellow-600 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className={`text-2xl font-semibold ${getRiskTextColor(avgRisk)}`}>{avgRisk}</div>
              <div className="text-[10px] text-gray-400 mt-1">{t.dashboard.avgRisk}</div>
            </div>
            {riskOpen
              ? <ChevronUp size={12} className="text-gray-400 mt-1" />
              : <ChevronDown size={12} className="text-gray-400 mt-1" />
            }
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-sm mt-2">
            <div className={`h-full rounded-sm ${getRiskBarColor(avgRisk)}`} style={{ width: `${avgRisk}%` }} />
          </div>
        </div>
      </div>

      {riskOpen && (
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-700 mb-3">{t.dashboard.riskScorePerChange}</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {riskScores.map(({ id, score }) => (
              <div key={id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-mono text-gray-400">{id}</span>
                  <span className={`text-[11px] font-semibold ${getRiskTextColor(score)}`}>{score}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-sm">
                  <div className={`h-full rounded-sm ${getRiskBarColor(score)}`} style={{ width: `${score}%` }} />
                </div>
                <div className="text-[9px] text-gray-400 mt-1">{riskLabelFn(score)}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
            <span className="text-[9px] text-green-700">{t.risk.low} 0-20</span>
            <span className="text-[9px] text-yellow-700">{t.risk.medium} 21-45</span>
            <span className="text-[9px] text-red-700">{t.risk.high} 46-70</span>
            <span className="text-[9px] text-red-900">{t.risk.critical} 71+</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <span className="text-xs font-semibold text-gray-700">{t.dashboard.changeRegister}</span>
        </div>
        <div>
          {changes.map((change) => {
            const ScopeIcon = scopeIcons[change.scope] || FileText;
            return (
              <div
                key={change.id}
                className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
              >
                <span className="font-mono text-[11px] text-gray-400 w-14 shrink-0">{change.id}</span>
                <ScopeIcon size={13} className="text-gray-400 shrink-0" strokeWidth={1.8} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{change.title}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm ${riskColorMap[change.risk] || ''}`}>
                  {riskMap[change.risk] || change.risk}
                </span>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-sm whitespace-nowrap ${stageColorMap[change.status] || 'bg-gray-100 text-gray-600'}`}>
                  {change.status.replace(/-/g, ' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
          {t.dashboard.lifecycleTitle}
        </div>
        <div className="flex items-center gap-1">
          {([
            ['stageRequest', 'REQUEST', '#868e96'],
            ['stageClassify', 'CLASSIFY', '#ae3ec9'],
            ['stageAssess', 'ASSESS', '#f76707'],
            ['stageApprove', 'APPROVE', '#1098ad'],
            ['stageImplement', 'IMPLEMENT', '#4263eb'],
            ['stageReview', 'REVIEW', '#2b8a3e'],
            ['stageClose', 'CLOSE', '#495057'],
          ] as const).map(([key, universal, color], i, arr) => (
            <div key={key} className="flex items-center gap-1 flex-1">
              <div className="flex-1 text-center py-1.5 bg-gray-50 rounded-sm border-t-2" style={{ borderTopColor: color }}>
                <div className="text-[8px] text-gray-400 uppercase">{universal}</div>
                <div className="text-[10px] font-medium text-gray-600 mt-0.5">
                  {activeProfile.vocabulary[key]}
                </div>
              </div>
              {i < arr.length - 1 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" className="shrink-0"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
