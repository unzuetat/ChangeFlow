import { ChangeRecord } from '../../types';
import { findSimilarChanges, getSimilarityLabel, SimilarityMatch } from '../../engine/similarity';
import { GitCompare, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

const statusIcons: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  closed:     { icon: CheckCircle2, color: 'text-green-500' },
  rejected:   { icon: XCircle, color: 'text-red-500' },
  approved:   { icon: CheckCircle2, color: 'text-blue-500' },
  implementing: { icon: Clock, color: 'text-indigo-500' },
};

interface Props {
  target: ChangeRecord;
  allChanges: ChangeRecord[];
}

export default function SimilarityPanel({ target, allChanges }: Props) {
  const matches = findSimilarChanges(target, allChanges);

  if (matches.length === 0) {
    return (
      <div className="bg-gray-50 rounded border border-gray-200 p-4 text-center">
        <GitCompare size={20} className="text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
        <p className="text-xs text-gray-400">No similar changes found in the register.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <GitCompare size={14} className="text-cf-600" strokeWidth={1.8} />
        <span className="text-xs font-semibold text-gray-700">
          Similar Changes Detected ({matches.length})
        </span>
      </div>

      {matches.map((match) => {
        const label = getSimilarityLabel(match.score);
        const statusInfo = statusIcons[match.change.status] || { icon: Clock, color: 'text-gray-400' };
        const StatusIcon = statusInfo.icon;

        return (
          <div
            key={match.change.id}
            className="bg-white rounded border border-gray-200 p-3"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400">{match.change.id}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${label.color}`}>
                  {label.text} ({Math.round(match.score * 100)}%)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <StatusIcon size={12} className={statusInfo.color} />
                <span className="text-[10px] text-gray-500">
                  {match.change.status.replace(/-/g, ' ')}
                </span>
              </div>
            </div>

            <p className="text-xs font-medium text-gray-700 mb-1.5">{match.change.title}</p>

            <div className="space-y-0.5">
              {match.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[11px]">
                  <AlertCircle size={10} className="text-gray-300 mt-0.5 shrink-0" />
                  <span className="text-gray-500">{reason}</span>
                </div>
              ))}
            </div>

            {match.change.status === 'rejected' && (
              <div className="mt-2 bg-red-50 border border-red-100 rounded px-2.5 py-1.5">
                <p className="text-[10px] font-semibold text-red-700">
                  Warning: This similar change was rejected.
                </p>
                <p className="text-[10px] text-red-600 mt-0.5">
                  Review the rejection reasons before proceeding with this request.
                </p>
              </div>
            )}

            {match.change.status === 'closed' && (
              <div className="mt-2 bg-green-50 border border-green-100 rounded px-2.5 py-1.5">
                <p className="text-[10px] font-semibold text-green-700">
                  Reference: This similar change was completed successfully.
                </p>
                <p className="text-[10px] text-green-600 mt-0.5">
                  Consider referencing its approach and lessons learned.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
