import { useState } from 'react';
import { listProfiles } from '../profiles';
import { MethodologicalProfile } from '../types/profile';
import { ArrowLeftRight, GitCompare, ChevronDown, ChevronUp } from 'lucide-react';

type ComparisonSection = 'stages' | 'roles' | 'artifacts' | 'escalation' | 'vocabulary';

const sectionLabels: Record<ComparisonSection, string> = {
  stages: 'Lifecycle Stage Names',
  roles: 'Role Mapping',
  artifacts: 'Artifact Names',
  escalation: 'Escalation Model',
  vocabulary: 'Key Vocabulary',
};

const stageKeys = [
  { key: 'stageRequest', universal: 'REQUEST' },
  { key: 'stageClassify', universal: 'CLASSIFY' },
  { key: 'stageAssess', universal: 'ASSESS' },
  { key: 'stageApprove', universal: 'APPROVE' },
  { key: 'stageImplement', universal: 'IMPLEMENT' },
  { key: 'stageReview', universal: 'REVIEW' },
  { key: 'stageClose', universal: 'CLOSE' },
] as const;

const roleKeys = [
  { key: 'projectApprovalAuthority', universal: 'Project Approval Authority' },
  { key: 'operationalApprovalAuthority', universal: 'Operational Approval Authority' },
  { key: 'seniorProjectAuthority', universal: 'Senior Project Authority' },
  { key: 'emergencyProjectAuthority', universal: 'Emergency Project Authority' },
  { key: 'emergencyOpsAuthority', universal: 'Emergency Ops Authority' },
  { key: 'changeCoordinator', universal: 'Change Coordinator' },
  { key: 'projectAssessor', universal: 'Project Assessor' },
  { key: 'operationalAssessor', universal: 'Operational Assessor' },
  { key: 'projectExecutive', universal: 'Project Executive' },
] as const;

const artifactKeys = [
  { key: 'changeRecord', universal: 'Change Record' },
  { key: 'changeRegister', universal: 'Change Register' },
  { key: 'impactAssessment', universal: 'Impact Assessment' },
  { key: 'approvalRecord', universal: 'Approval Record' },
  { key: 'escalationReport', universal: 'Escalation Report' },
  { key: 'implementationPlan', universal: 'Implementation Plan' },
  { key: 'backoutPlan', universal: 'Back-out Plan' },
  { key: 'postChangeReview', universal: 'Post-Change Review' },
  { key: 'riskRegister', universal: 'Risk Register' },
  { key: 'configurationRecords', universal: 'Configuration Records' },
] as const;

const vocabKeys = [
  { key: 'standardChange', universal: 'Standard Change' },
  { key: 'normalChange', universal: 'Normal Change' },
  { key: 'emergencyChange', universal: 'Emergency Change' },
  { key: 'projectOnly', universal: 'Project-only Scope' },
  { key: 'operationalOnly', universal: 'Operational-only Scope' },
  { key: 'crossDomain', universal: 'Cross-domain Scope' },
  { key: 'thresholdBreach', universal: 'Threshold Breach' },
  { key: 'changeRegister', universal: 'Change Register' },
  { key: 'projectPlan', universal: 'Project Plan' },
  { key: 'phaseBoundary', universal: 'Phase Boundary' },
  { key: 'businessJustification', universal: 'Business Justification' },
  { key: 'postChangeReview', universal: 'Post-Change Review' },
] as const;

export default function ComparisonView() {
  const allProfiles = listProfiles();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    allProfiles.slice(0, 3).map((p) => p.id)
  );
  const [openSections, setOpenSections] = useState<Record<ComparisonSection, boolean>>({
    stages: true,
    roles: true,
    artifacts: false,
    escalation: false,
    vocabulary: false,
  });

  function toggleProfile(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function toggleSection(section: ComparisonSection) {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }

  const selected = allProfiles.filter((p) => selectedIds.includes(p.id));

  function getValue(profile: MethodologicalProfile, section: string, key: string): string {
    if (section === 'stages' || section === 'vocabulary') {
      return (profile.vocabulary as Record<string, string>)[key] || '—';
    }
    if (section === 'roles') {
      return (profile.roles as Record<string, string>)[key] || '—';
    }
    if (section === 'artifacts') {
      return (profile.artifacts as Record<string, string>)[key] || '—';
    }
    return '—';
  }

  function renderTable(
    section: ComparisonSection,
    rows: readonly { key: string; universal: string }[]
  ) {
    if (!openSections[section]) return null;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-400 font-semibold w-44">
                Universal Term
              </th>
              {selected.map((p) => (
                <th key={p.id} className="text-left py-2 px-3 text-cf-700 font-semibold">
                  {p.projectMethodology}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const values = selected.map((p) => getValue(p, section, row.key));
              const allSame = values.every((v) => v === values[0]);

              return (
                <tr key={row.key} className="border-b border-gray-50">
                  <td className="py-2 px-3 text-gray-500 font-medium">{row.universal}</td>
                  {selected.map((p, i) => (
                    <td
                      key={p.id}
                      className={`py-2 px-3 ${
                        allSame
                          ? 'text-gray-400'
                          : 'text-gray-800 font-medium bg-yellow-50/50'
                      }`}
                    >
                      {values[i]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile selector */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <ArrowLeftRight size={16} className="text-cf-600" strokeWidth={1.8} />
          <h3 className="text-sm font-bold text-gray-800">Select Profiles to Compare</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {allProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProfile(p.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded border transition-all ${
                selectedIds.includes(p.id)
                  ? 'border-cf-400 bg-cf-50 text-cf-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {selected.length < 2 && (
          <p className="text-[10px] text-gray-400 mt-2">Select at least 2 profiles to compare.</p>
        )}
      </div>

      {selected.length >= 2 && (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] text-gray-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200" />
              <span>Terms differ across profiles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white border border-gray-200" />
              <span>Terms are identical</span>
            </div>
          </div>

          {/* Stages */}
          <div className="bg-white rounded border border-gray-200">
            <button
              onClick={() => toggleSection('stages')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-xs font-bold text-gray-700">{sectionLabels.stages}</span>
              {openSections.stages ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {renderTable('stages', stageKeys)}
          </div>

          {/* Roles */}
          <div className="bg-white rounded border border-gray-200">
            <button
              onClick={() => toggleSection('roles')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-xs font-bold text-gray-700">{sectionLabels.roles}</span>
              {openSections.roles ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {renderTable('roles', roleKeys)}
          </div>

          {/* Artifacts */}
          <div className="bg-white rounded border border-gray-200">
            <button
              onClick={() => toggleSection('artifacts')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-xs font-bold text-gray-700">{sectionLabels.artifacts}</span>
              {openSections.artifacts ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {renderTable('artifacts', artifactKeys)}
          </div>

          {/* Vocabulary */}
          <div className="bg-white rounded border border-gray-200">
            <button
              onClick={() => toggleSection('vocabulary')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-xs font-bold text-gray-700">{sectionLabels.vocabulary}</span>
              {openSections.vocabulary ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {renderTable('vocabulary', vocabKeys)}
          </div>

          {/* Escalation - special layout */}
          <div className="bg-white rounded border border-gray-200">
            <button
              onClick={() => toggleSection('escalation')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
            >
              <span className="text-xs font-bold text-gray-700">{sectionLabels.escalation}</span>
              {openSections.escalation ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
            </button>
            {openSections.escalation && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 px-3 text-gray-400 font-semibold w-44">Concept</th>
                      {selected.map((p) => (
                        <th key={p.id} className="text-left py-2 px-3 text-cf-700 font-semibold">
                          {p.projectMethodology}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['breachTerm', 'breachProcess', 'breachReport', 'breachAuthority'] as const).map((key) => {
                      const labels: Record<string, string> = {
                        breachTerm: 'Breach Term',
                        breachProcess: 'Breach Process',
                        breachReport: 'Breach Report',
                        breachAuthority: 'Breach Authority',
                      };
                      const values = selected.map((p) => p.escalation[key]);
                      const allSame = values.every((v) => v === values[0]);

                      return (
                        <tr key={key} className="border-b border-gray-50">
                          <td className="py-2 px-3 text-gray-500 font-medium">{labels[key]}</td>
                          {selected.map((p, i) => (
                            <td
                              key={p.id}
                              className={`py-2 px-3 ${
                                allSame ? 'text-gray-400' : 'text-gray-800 font-medium bg-yellow-50/50'
                              }`}
                            >
                              {values[i]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="py-2 px-3 text-gray-500 font-medium align-top">Outcomes</td>
                      {selected.map((p) => (
                        <td key={p.id} className="py-2 px-3 text-gray-600 align-top">
                          {p.escalation.breachOutcomes.map((o, i) => (
                            <div key={i} className="flex items-start gap-1 mb-0.5">
                              <span className="text-gray-300 mt-0.5">•</span>
                              <span>{o}</span>
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
