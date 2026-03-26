import { useState, useEffect } from 'react';
import { classifyChange, getConfidenceColor, ClassificationSuggestion } from '../../engine/classification';
import { ChangeType, ChangeScope, RiskLevel, ChangeCategory } from '../../types';
import { BrainCircuit, Check, X } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  onAccept: (field: 'type' | 'risk' | 'category' | 'scope', value: string) => void;
}

export default function ClassificationPanel({ title, description, onAccept }: Props) {
  const [suggestion, setSuggestion] = useState<ClassificationSuggestion | null>(null);
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (title.length > 5 || description.length > 10) {
      const timer = setTimeout(() => {
        setSuggestion(classifyChange(title, description));
        setAccepted({});
        setDismissed({});
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSuggestion(null);
    }
  }, [title, description]);

  if (!suggestion) return null;

  const fields: {
    key: 'type' | 'risk' | 'category' | 'scope';
    label: string;
    value: string;
    confidence: number;
    reason: string;
  }[] = [
    { key: 'type', label: 'Type', value: suggestion.type.value, confidence: suggestion.type.confidence, reason: suggestion.type.reason },
    { key: 'risk', label: 'Risk', value: suggestion.risk.value, confidence: suggestion.risk.confidence, reason: suggestion.risk.reason },
    { key: 'category', label: 'Category', value: suggestion.category.value, confidence: suggestion.category.confidence, reason: suggestion.category.reason },
    { key: 'scope', label: 'Scope', value: suggestion.scope.value, confidence: suggestion.scope.confidence, reason: suggestion.scope.reason },
  ];

  const visibleFields = fields.filter((f) => !dismissed[f.key]);

  if (visibleFields.length === 0) return null;

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit size={14} className="text-purple-600" strokeWidth={1.8} />
        <span className="text-xs font-semibold text-purple-700">
          AI Classification Suggestions
        </span>
        <span className="text-[9px] text-purple-400 font-mono ml-auto">rule-based engine</span>
      </div>

      <div className="space-y-2">
        {visibleFields.map((field) => {
          const confColor = getConfidenceColor(field.confidence);
          const isAccepted = accepted[field.key];

          return (
            <div
              key={field.key}
              className={`bg-white rounded border px-3 py-2 flex items-center gap-3 ${
                isAccepted ? 'border-green-300 bg-green-50/50' : 'border-purple-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase w-16">{field.label}</span>
                  <span className="text-xs font-semibold text-gray-800">{field.value}</span>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${confColor}`}>
                    {field.confidence}%
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{field.reason}</p>
              </div>

              {!isAccepted && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      onAccept(field.key, field.value);
                      setAccepted((prev) => ({ ...prev, [field.key]: true }));
                    }}
                    className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors"
                    title="Accept suggestion"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setDismissed((prev) => ({ ...prev, [field.key]: true }))}
                    className="p-1 rounded hover:bg-red-100 text-red-400 transition-colors"
                    title="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {isAccepted && (
                <span className="text-[10px] font-semibold text-green-600 shrink-0">Applied</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
