import { ChangeRecord } from '../../types';
import { calculateRiskScore, getRiskColor } from '../../engine/risk-scoring';
import { ShieldAlert } from 'lucide-react';

interface Props {
  change: ChangeRecord;
}

export default function RiskScorePanel({ change }: Props) {
  const score = calculateRiskScore(change);
  const colors = getRiskColor(score.level);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <ShieldAlert size={14} className="text-cf-600" strokeWidth={1.8} />
        <span className="text-xs font-semibold text-gray-700">
          Composite Risk Score
        </span>
      </div>

      {/* Score display */}
      <div className={`${colors.bg} rounded-lg border border-gray-200 p-3`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${colors.text}`}>{score.total}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border border-current/20`}>
            {score.level} risk
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${score.total}%` }}
          />
        </div>

        <p className="text-xs text-gray-600 mt-2">{score.recommendation}</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-1.5">
        {score.breakdown.map((factor) => (
          <div key={factor.name} className="bg-white rounded-lg border border-gray-100 px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-gray-700">{factor.name}</span>
              <span className="text-[11px] font-mono text-gray-400">
                {factor.score} / {factor.maxScore}
              </span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-cf-400 transition-all"
                style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
