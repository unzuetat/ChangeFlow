import { useStore } from '../store';
import { listProfiles } from '../profiles';
import { ProfileId } from '../types/profile';
import { Info, BookOpen, Users, FileText, AlertTriangle } from 'lucide-react';

export default function SettingsView() {
  const { activeProfileId, activeProfile, setProfile } = useStore();
  const allProfiles = listProfiles();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white rounded border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-800 mb-3">Active governance profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {allProfiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`text-left p-3 rounded border transition-all ${
                activeProfileId === p.id
                  ? 'border-cf-500 bg-cf-50 border-l-2 border-l-cf-500'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className={`text-[11px] font-semibold ${activeProfileId === p.id ? 'text-cf-800' : 'text-gray-700'}`}>{p.name}</p>
              <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-cf-50 border border-cf-200 rounded px-3 py-2 flex items-start gap-2">
        <Info size={14} className="text-cf-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[11px] font-semibold text-cf-800">{activeProfile.name}</p>
          <p className="text-[10px] text-cf-600 mt-0.5">{activeProfile.description}</p>
          <div className="flex gap-4 mt-2">
            <div>
              <span className="text-[8px] font-mono text-cf-400 uppercase">Project</span>
              <p className="text-[11px] font-semibold text-cf-800">{activeProfile.projectMethodology}</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-cf-400 uppercase">Operations</span>
              <p className="text-[11px] font-semibold text-cf-800">{activeProfile.operationsMethodology}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-xs font-semibold text-gray-800">Vocabulary mapping</span>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
          {([
            ['Standard Change', activeProfile.vocabulary.standardChange],
            ['Normal Change', activeProfile.vocabulary.normalChange],
            ['Emergency Change', activeProfile.vocabulary.emergencyChange],
            ['Project-only Scope', activeProfile.vocabulary.projectOnly],
            ['Operational-only Scope', activeProfile.vocabulary.operationalOnly],
            ['Cross-domain Scope', activeProfile.vocabulary.crossDomain],
            ['Threshold Breach', activeProfile.vocabulary.thresholdBreach],
            ['Change Register', activeProfile.vocabulary.changeRegister],
            ['Project Plan', activeProfile.vocabulary.projectPlan],
            ['Phase Boundary', activeProfile.vocabulary.phaseBoundary],
            ['Business Justification', activeProfile.vocabulary.businessJustification],
            ['Post-Change Review', activeProfile.vocabulary.postChangeReview],
          ] as const).map(([universal, mapped]) => (
            <div key={universal} className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">{universal}</span>
              <span className="text-gray-700 font-medium">{mapped}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={14} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-xs font-semibold text-gray-800">Lifecycle stage names</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {([
            ['REQUEST', activeProfile.vocabulary.stageRequest, '#868e96'],
            ['CLASSIFY', activeProfile.vocabulary.stageClassify, '#ae3ec9'],
            ['ASSESS', activeProfile.vocabulary.stageAssess, '#f76707'],
            ['APPROVE', activeProfile.vocabulary.stageApprove, '#1098ad'],
            ['IMPLEMENT', activeProfile.vocabulary.stageImplement, '#4263eb'],
            ['REVIEW', activeProfile.vocabulary.stageReview, '#2b8a3e'],
            ['CLOSE', activeProfile.vocabulary.stageClose, '#495057'],
          ] as const).map(([universal, mapped, color]) => (
            <div key={universal} className="space-y-1">
              <span className="w-2.5 h-2.5 rounded-full mx-auto block" style={{ backgroundColor: color }} />
              <span className="text-[8px] font-mono text-gray-400 block">{universal}</span>
              <span className="text-[10px] font-medium text-gray-700 block">{mapped}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-xs font-semibold text-gray-800">Role mapping</span>
        </div>
        <div className="grid grid-cols-1 gap-y-1 text-[11px]">
          {([
            ['Project Approval Authority', activeProfile.roles.projectApprovalAuthority],
            ['Operational Approval Authority', activeProfile.roles.operationalApprovalAuthority],
            ['Senior Project Authority', activeProfile.roles.seniorProjectAuthority],
            ['Emergency Project Authority', activeProfile.roles.emergencyProjectAuthority],
            ['Emergency Ops Authority', activeProfile.roles.emergencyOpsAuthority],
            ['Change Coordinator', activeProfile.roles.changeCoordinator],
            ['Project Assessor', activeProfile.roles.projectAssessor],
            ['Operational Assessor', activeProfile.roles.operationalAssessor],
            ['Project Executive', activeProfile.roles.projectExecutive],
          ] as const).map(([universal, mapped]) => (
            <div key={universal} className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">{universal}</span>
              <span className="text-gray-700 font-medium">{mapped}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-xs font-semibold text-gray-800">Artifact mapping</span>
        </div>
        <div className="grid grid-cols-1 gap-y-1 text-[11px]">
          {([
            ['Change Record', activeProfile.artifacts.changeRecord],
            ['Change Register', activeProfile.artifacts.changeRegister],
            ['Impact Assessment', activeProfile.artifacts.impactAssessment],
            ['Approval Record', activeProfile.artifacts.approvalRecord],
            ['Escalation Report', activeProfile.artifacts.escalationReport],
            ['Implementation Plan', activeProfile.artifacts.implementationPlan],
            ['Back-out Plan', activeProfile.artifacts.backoutPlan],
            ['Post-Change Review', activeProfile.artifacts.postChangeReview],
            ['Risk Register', activeProfile.artifacts.riskRegister],
            ['Configuration Records', activeProfile.artifacts.configurationRecords],
          ] as const).map(([universal, mapped]) => (
            <div key={universal} className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">{universal}</span>
              <span className="text-gray-700 font-medium">{mapped}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-gray-400" strokeWidth={1.8} />
          <span className="text-xs font-semibold text-gray-800">Escalation model</span>
        </div>
        <div className="grid grid-cols-1 gap-y-1 text-[11px] mb-3">
          {([
            ['Breach Term', activeProfile.escalation.breachTerm],
            ['Breach Process', activeProfile.escalation.breachProcess],
            ['Breach Report', activeProfile.escalation.breachReport],
            ['Breach Authority', activeProfile.escalation.breachAuthority],
          ] as const).map(([label, value]) => (
            <div key={label} className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400">{label}</span>
              <span className="text-gray-700 font-medium">{value}</span>
            </div>
          ))}
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-medium block mb-1">Possible outcomes:</span>
          <div className="space-y-0.5">
            {activeProfile.escalation.breachOutcomes.map((outcome, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px]">
                <span className="text-red-400 mt-0.5">•</span>
                <span className="text-gray-600">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center py-3">
        <p className="text-[9px] text-gray-300 font-mono">ChangeFlow v0.1.0 — Built by Unzuetat</p>
      </div>
    </div>
  );
}
