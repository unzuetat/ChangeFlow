import { ArrowRightLeft, AlertTriangle, UserCheck, Bell, FileText } from 'lucide-react';
import type { RoutingDecision } from '../../types/routing';
import { useI18n } from '../../i18n';

interface Props {
  decision: RoutingDecision;
}

export default function RoutingResultPanel({ decision }: Props) {
  const { t } = useI18n();

  return (
    <div className={`rounded border p-4 space-y-3 ${
      decision.fallback
        ? 'bg-amber-50 border-amber-200'
        : 'bg-blue-50 border-blue-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <ArrowRightLeft size={14} className="text-blue-600" strokeWidth={1.8} />
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {t.routing.routingDecision}
        </span>
      </div>

      {/* Fallback warning */}
      {decision.fallback && (
        <div className="flex items-start gap-2 bg-amber-100 border border-amber-300 rounded p-2.5">
          <AlertTriangle size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <span className="text-xs text-amber-800">{t.routing.fallbackWarning}</span>
        </div>
      )}

      {/* Approvers */}
      <div className="space-y-2">
        {/* Primary approver */}
        <div className="flex items-center gap-2 bg-white rounded border border-gray-200 p-2.5">
          <UserCheck size={13} className="text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-10px text-gray-400 uppercase tracking-wide">
              {t.routing.primaryApprover}
            </div>
            <div className="text-xs font-semibold text-gray-800 truncate">
              {decision.primaryApprover}
            </div>
          </div>
        </div>

        {/* Secondary approver */}
        {decision.secondaryApprover && (
          <div className="flex items-center gap-2 bg-white rounded border border-gray-200 p-2.5">
            <UserCheck size={13} className="text-indigo-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-10px text-gray-400 uppercase tracking-wide">
                {t.routing.secondaryApprover}
              </div>
              <div className="text-xs font-semibold text-gray-800 truncate">
                {decision.secondaryApprover}
              </div>
            </div>
          </div>
        )}

        {/* Notify list */}
        {decision.notify.length > 0 && (
          <div className="flex items-start gap-2 bg-white rounded border border-gray-200 p-2.5">
            <Bell size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-10px text-gray-400 uppercase tracking-wide">
                {t.routing.notify}
              </div>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {decision.notify.map((name, i) => (
                  <span key={i} className="text-10px bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matched rule + reason */}
      <div className="bg-white rounded border border-gray-200 p-2.5 space-y-1">
        <div className="flex items-center gap-1.5">
          <FileText size={11} className="text-gray-400" />
          <span className="text-10px text-gray-400 uppercase tracking-wide">
            {t.routing.matchedRule}
          </span>
          <span className="text-10px font-medium text-gray-700">
            {decision.ruleName}
          </span>
        </div>
        <div className="text-10px text-gray-500 leading-relaxed">
          {decision.reason}
        </div>
      </div>
    </div>
  );
}
