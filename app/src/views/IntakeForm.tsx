import { useState } from 'react';
import { useStore } from '../store';
import { ChangeType, ChangeScope, RiskLevel, ChangeCategory } from '../types';
import ClassificationPanel from '../components/intelligence/ClassificationPanel';
import {
  Send,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Zap,
  Info,
} from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  type: ChangeType;
  scope: ChangeScope;
  risk: RiskLevel;
  category: ChangeCategory;
  originType: 'project' | 'operational' | 'incident' | 'business-request';
  originReference: string;
  justification: string;
}

const emptyForm: FormData = {
  title: '',
  description: '',
  type: 'normal',
  scope: 'project-only',
  risk: 'medium',
  category: 'application',
  originType: 'project',
  originReference: '',
  justification: '',
};

export default function IntakeForm() {
  const { activeProfile, changes, setChanges } = useStore();
  const vocab = activeProfile.vocabulary;
  const [form, setForm] = useState<FormData>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.description.trim()) return;

    const newId = `CF-${String(changes.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newChange = {
      id: newId,
      title: form.title,
      description: form.description,
      status: 'submitted' as const,
      type: form.type,
      scope: form.scope,
      risk: form.risk,
      category: form.category,
      origin: {
        type: form.originType,
        referenceId: form.originReference || 'N/A',
        referenceName: form.originReference || 'Direct submission',
      },
      requesterId: 'P001',
      requestDate: today,
      assessment: null,
      approval: null,
      implementation: null,
      review: null,
      affectedServices: [],
      affectedProjects: [],
      relatedChanges: [],
      aiSuggestions: [],
      timeline: [
        {
          date: today,
          stage: 'submitted' as const,
          actor: 'System',
          description: 'Change request submitted via intake form',
        },
      ],
      closedDate: null,
    };

    setChanges([...changes, newChange]);
    setSubmitted(true);
  }

  function handleReset() {
    setForm(emptyForm);
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded border border-gray-200 p-8 text-center">
          <CheckCircle2 size={40} className="text-green-600 mx-auto mb-3" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-gray-800 mb-2">Change request submitted</h3>
          <p className="text-xs text-gray-500 mb-1">
            <span className="font-mono font-semibold text-cf-800">
              CF-{String(changes.length).padStart(3, '0')}
            </span>{' '}
            — {form.title}
          </p>
          <p className="text-[10px] text-gray-400 mb-5">
            Next stage: <span className="font-semibold">{vocab.stageClassify}</span>
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium bg-cf-500 text-white rounded hover:bg-cf-600 transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* Profile context */}
      <div className="bg-cf-50 border border-cf-200 rounded px-3 py-2 flex items-start gap-2">
        <Info size={14} className="text-cf-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] font-semibold text-cf-800">
            Vocabulary: {activeProfile.name}
          </p>
          <p className="text-[10px] text-cf-600 mt-0.5">
            Form labels adapt to your active governance profile.
          </p>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-800">
          New {vocab.normalChange}
        </h3>

        {/* Title */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Brief description of the change..."
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300 focus:border-cf-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is this change, why is it needed, and what does it affect?"
            rows={4}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300 focus:border-cf-300 resize-none"
          />
        </div>

        {/* AI Classification */}
        <ClassificationPanel
          title={form.title}
          description={form.description}
          onAccept={(field, value) => {
            if (field === 'type') update('type', value as ChangeType);
            if (field === 'risk') update('risk', value as RiskLevel);
            if (field === 'category') update('category', value as ChangeCategory);
            if (field === 'scope') update('scope', value as ChangeScope);
          }}
        />

        {/* Type + Scope */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Change type</label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value as ChangeType)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            >
              <option value="standard">{vocab.standardChange}</option>
              <option value="normal">{vocab.normalChange}</option>
              <option value="emergency">{vocab.emergencyChange}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Scope</label>
            <select
              value={form.scope}
              onChange={(e) => update('scope', e.target.value as ChangeScope)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            >
              <option value="project-only">{vocab.projectOnly}</option>
              <option value="operational-only">{vocab.operationalOnly}</option>
              <option value="cross-domain">{vocab.crossDomain}</option>
            </select>
          </div>
        </div>

        {/* Cross-domain warning */}
        {form.scope === 'cross-domain' && (
          <div className="bg-pink-50 border border-pink-200 rounded px-3 py-2 flex items-start gap-2">
            <ArrowRightLeft size={14} className="text-pink-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-pink-800">Cross-domain change detected</p>
              <p className="text-[10px] text-pink-700 mt-0.5">
                Requires dual approval: {activeProfile.roles.projectApprovalAuthority} and {activeProfile.roles.operationalApprovalAuthority}.
              </p>
            </div>
          </div>
        )}

        {/* Emergency warning */}
        {form.type === 'emergency' && (
          <div className="bg-orange-50 border border-orange-200 rounded px-3 py-2 flex items-start gap-2">
            <Zap size={14} className="text-orange-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-orange-800">{vocab.emergencyChange} path</p>
              <p className="text-[10px] text-orange-700 mt-0.5">Compressed lifecycle. Full retrospective assessment required within 5 business days.</p>
            </div>
          </div>
        )}

        {/* Risk + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Initial risk assessment</label>
            <select
              value={form.risk}
              onChange={(e) => update('risk', e.target.value as RiskLevel)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', e.target.value as ChangeCategory)}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            >
              <option value="infrastructure">Infrastructure</option>
              <option value="application">Application</option>
              <option value="security">Security</option>
              <option value="data">Data</option>
              <option value="network">Network</option>
              <option value="configuration">Configuration</option>
            </select>
          </div>
        </div>

        {/* Risk warning */}
        {(form.risk === 'high' || form.risk === 'critical') && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 flex items-start gap-2">
            <AlertTriangle size={14} className="text-red-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-red-800">
                {form.risk === 'critical' ? 'Critical' : 'High'} risk — enhanced governance applies
              </p>
              <p className="text-[10px] text-red-700 mt-0.5">
                Requires approval from {activeProfile.roles.seniorProjectAuthority}.
                {form.risk === 'critical' && ' Mandatory rollback plan required.'}
              </p>
            </div>
          </div>
        )}

        {/* Origin */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Origin</label>
            <select
              value={form.originType}
              onChange={(e) => update('originType', e.target.value as FormData['originType'])}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            >
              <option value="project">Project</option>
              <option value="operational">Operational</option>
              <option value="incident">Incident</option>
              <option value="business-request">Business Request</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Reference (optional)</label>
            <input
              type="text"
              value={form.originReference}
              onChange={(e) => update('originReference', e.target.value)}
              placeholder="e.g. PRJ-042, INC-1234..."
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300"
            />
          </div>
        </div>

        {/* Business justification */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{vocab.businessJustification}</label>
          <textarea
            value={form.justification}
            onChange={(e) => update('justification', e.target.value)}
            placeholder="Why should this change be approved? What is the business value?"
            rows={3}
            className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-cf-300 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.description.trim()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-cf-500 text-white rounded hover:bg-cf-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={13} />
            Submit {vocab.normalChange}
          </button>
        </div>
      </div>
    </div>
  );
}
