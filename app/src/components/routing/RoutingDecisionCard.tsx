import { UserCheck, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import type { RoutingDecision } from '../../types/routing';
import { useI18n } from '../../i18n';

interface Props {
  decision: RoutingDecision;
  changeTitle?: string;
}

export default function RoutingDecisionCard({ decision, changeTitle }: Props) {
  const { t } = useI18n();

  return (
    <div className={`bg-white rounded border p-2.5 flex items-center gap-3 ${
      decision.fallback ? 'border-l-2 border-l-amber-400' : 'border-l-2 border-l-blue-400'
    } border-gray-200`}>
      {/* Change ID */}
      <div className="flex-shrink-0">
        <span className="text-[10px] font-mono font-semibold text-gray-500">{decision.changeId}</span>
      </div>

      {/* Title (if provided) */}
      {changeTitle && (
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-700 truncate">{changeTitle}</p>
        </div>
      )}

      {/* Approvers */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <UserCheck size={11} className="text-blue-600" />
          <span className="text-[10px] text-gray-700 max-w-[120px] truncate">{decision.primaryApprover}</span>
        </div>
        {decision.secondaryApprover && (
          <>
            <ArrowRightLeft size={9} className="text-gray-300" />
            <span className="text-[10px] text-gray-500 max-w-[120px] truncate">{decision.secondaryApprover}</span>
          </>
        )}
        {decision.fallback && (
          <AlertTriangle size={11} className="text-amber-500" />
        )}
      </div>

      {/* Timestamp */}
      <div className="flex-shrink-0">
        <span className="text-[9px] text-gray-400">
          {new Date(decision.decidedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
