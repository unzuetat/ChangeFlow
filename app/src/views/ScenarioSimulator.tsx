import { useState } from 'react';
import { useStore } from '../store';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ArrowRightLeft,
  Zap,
  Shield,
  FileText,
  XCircle,
  Info,
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: typeof ArrowRightLeft;
  iconColor: string;
  type: 'normal' | 'emergency' | 'standard';
  scope: 'project-only' | 'operational-only' | 'cross-domain';
  risk: 'low' | 'medium' | 'high' | 'critical';
  steps: ScenarioStep[];
}

interface ScenarioStep {
  stageKey: string;
  universal: string;
  narrative: string;
  keyDecision: string;
  outcome: string;
}

function buildScenarios(vocab: Record<string, string>, roles: Record<string, string>, artifacts: Record<string, string>, escalation: Record<string, string>): Scenario[] {
  return [
    {
      id: 'cross-domain-normal',
      title: 'Cross-domain Database Migration',
      description: 'A project needs to migrate a database that supports a live customer-facing service. Affects both the project timeline and operational SLAs.',
      icon: ArrowRightLeft,
      iconColor: 'text-pink-600',
      type: 'normal',
      scope: 'cross-domain',
      risk: 'high',
      steps: [
        {
          stageKey: 'stageRequest',
          universal: 'REQUEST',
          narrative: `The Project Manager submits a change request: "Migrate CRM database from on-premise to cloud." The ${artifacts.changeRecord || 'change record'} is created and logged in the ${artifacts.changeRegister || 'change register'}.`,
          keyDecision: 'Is this a valid change request with sufficient initial information?',
          outcome: 'Request accepted. Moves to classification.',
        },
        {
          stageKey: 'stageClassify',
          universal: 'CLASSIFY',
          narrative: `The ${roles.changeCoordinator || 'Change Coordinator'} classifies the change. The system detects that this database supports a live service (CRM Portal) — it's flagged as CROSS-DOMAIN. Type: Normal. Initial risk: High.`,
          keyDecision: 'Does this change affect live services AND an active project?',
          outcome: 'Cross-domain scope confirmed. Dual-track processing activated.',
        },
        {
          stageKey: 'stageAssess',
          universal: 'ASSESS',
          narrative: `Two parallel assessments begin. The ${roles.projectAssessor || 'Project Assessor'} evaluates project impact: 2-week schedule extension needed, no scope change, moderate cost. The ${roles.operationalAssessor || 'Operational Assessor'} evaluates service impact: 4-hour maintenance window required, potential SLA breach for CRM Portal.`,
          keyDecision: 'Is the combined impact acceptable? Are mitigation plans adequate?',
          outcome: 'Both assessments complete. Combined risk score: 62/100 (High). Rollback plan required.',
        },
        {
          stageKey: 'stageApprove',
          universal: 'APPROVE',
          narrative: `Because this is cross-domain, DUAL APPROVAL is required. The ${roles.projectApprovalAuthority || 'Project Approval Authority'} approves with condition: migration must happen outside business hours. The ${roles.operationalApprovalAuthority || 'Operational Approval Authority'} approves with condition: rollback must be tested before go-live.`,
          keyDecision: 'Do BOTH authorities approve? Neither can override the other.',
          outcome: 'Approved with conditions by both authorities.',
        },
        {
          stageKey: 'stageImplement',
          universal: 'IMPLEMENT',
          narrative: `Migration executed during the approved weekend window. The ${artifacts.implementationPlan || 'implementation plan'} is followed step by step. The ${artifacts.backoutPlan || 'rollback plan'} is on standby. Migration completes successfully at 3:47 AM with no service interruption.`,
          keyDecision: 'Is the implementation following the approved plan? Any deviations?',
          outcome: 'Implementation successful. No rollback needed.',
        },
        {
          stageKey: 'stageReview',
          universal: 'REVIEW',
          narrative: `Unified post-change review combining project lessons and operational PIR. The ${artifacts.postChangeReview || 'review report'} captures: migration took 2 hours less than estimated, SLA was maintained, one minor DNS issue was resolved on the fly.`,
          keyDecision: 'Was the change successful? What lessons should be captured?',
          outcome: 'Change successful. 3 lessons captured for future migrations.',
        },
        {
          stageKey: 'stageClose',
          universal: 'CLOSE',
          narrative: `All artifacts are complete. The ${artifacts.configurationRecords || 'configuration records'} are updated to reflect the new database location. The change record is formally closed.`,
          keyDecision: 'Are all artifacts complete and records updated?',
          outcome: 'Change closed. Total lifecycle: 18 days.',
        },
      ],
    },
    {
      id: 'emergency-security',
      title: 'Emergency Security Patch',
      description: 'A critical vulnerability is discovered in a production API. Immediate patching required — cannot wait for normal governance cycle.',
      icon: Zap,
      iconColor: 'text-orange-600',
      type: 'emergency',
      scope: 'cross-domain',
      risk: 'critical',
      steps: [
        {
          stageKey: 'stageRequest',
          universal: 'REQUEST',
          narrative: `Security team discovers CVE-2026-XXXX affecting the production payment API. An emergency change request is submitted immediately. The ${artifacts.changeRecord || 'change record'} is flagged as EMERGENCY.`,
          keyDecision: 'Does this qualify as an emergency? Is there an active or imminent threat?',
          outcome: 'Emergency confirmed. Compressed lifecycle activated.',
        },
        {
          stageKey: 'stageClassify',
          universal: 'CLASSIFY',
          narrative: `Rapid classification: Emergency type, cross-domain scope (affects live payment service + active checkout project), critical risk. Normal assessment is SKIPPED — goes directly to emergency approval.`,
          keyDecision: 'Is the emergency classification justified?',
          outcome: 'Emergency path confirmed. Skipping full assessment.',
        },
        {
          stageKey: 'stageApprove',
          universal: 'APPROVE',
          narrative: `Emergency authorities are invoked. ${roles.emergencyProjectAuthority || 'Emergency Project Authority'} and ${roles.emergencyOpsAuthority || 'Emergency Ops Authority'} both approve within 30 minutes via phone call. Verbal approval documented, written confirmation to follow.`,
          keyDecision: 'Do emergency authorities approve immediate action?',
          outcome: 'Emergency approval granted. Implementation authorized immediately.',
        },
        {
          stageKey: 'stageImplement',
          universal: 'IMPLEMENT',
          narrative: 'Security patch deployed to production at 14:23. Service monitored for 2 hours post-deployment. No issues detected. Vulnerability confirmed remediated.',
          keyDecision: 'Is the patch deployed successfully? Is the vulnerability resolved?',
          outcome: 'Patch successful. Vulnerability remediated.',
        },
        {
          stageKey: 'stageAssess',
          universal: 'RETROSPECTIVE ASSESS',
          narrative: `Within 5 business days, a full retrospective assessment is conducted. The ${artifacts.impactAssessment || 'impact assessment'} is completed after the fact, documenting what was done, what the actual impact was, and whether the emergency classification was justified.`,
          keyDecision: 'Was the emergency justified? What was the actual impact?',
          outcome: 'Emergency classification confirmed justified. No unintended side effects.',
        },
        {
          stageKey: 'stageReview',
          universal: 'REVIEW',
          narrative: `Post-change review identifies that the vulnerability existed for 3 weeks before detection. Recommendation: implement automated vulnerability scanning. ${artifacts.postChangeReview || 'Review report'} filed.`,
          keyDecision: 'How can we prevent this situation in the future?',
          outcome: '2 preventive actions identified and assigned.',
        },
        {
          stageKey: 'stageClose',
          universal: 'CLOSE',
          narrative: `All retrospective documentation complete. ${artifacts.configurationRecords || 'Configuration records'} updated. Emergency change formally closed.`,
          keyDecision: 'Is the retrospective documentation complete?',
          outcome: 'Emergency change closed. Total lifecycle: 4 days (including retrospective).',
        },
      ],
    },
    {
      id: 'rejected-change',
      title: 'Rejected Legacy API Retirement',
      description: 'Operations proposes retiring an old API. The change is rejected because it would break an active project dependency.',
      icon: XCircle,
      iconColor: 'text-red-600',
      type: 'normal',
      scope: 'cross-domain',
      risk: 'medium',
      steps: [
        {
          stageKey: 'stageRequest',
          universal: 'REQUEST',
          narrative: `The ${roles.operationalAssessor || 'Operational Assessor'} submits a request to retire the Legacy Payments API v1, which has been deprecated for 6 months. The ${artifacts.changeRecord || 'change record'} is created.`,
          keyDecision: 'Is this a valid change request?',
          outcome: 'Request accepted for classification.',
        },
        {
          stageKey: 'stageClassify',
          universal: 'CLASSIFY',
          narrative: `Classification reveals that Legacy API v1 is still used by the Mobile Checkout Project (PRJ-003). The system flags this as CROSS-DOMAIN — what seemed like a simple operational cleanup actually affects an active project.`,
          keyDecision: 'Does this operational change affect any active projects?',
          outcome: 'Cross-domain scope detected. This is where the gap between project and operations is bridged.',
        },
        {
          stageKey: 'stageAssess',
          universal: 'ASSESS',
          narrative: `The ${roles.operationalAssessor || 'Operational Assessor'} reports: API retirement would save infrastructure costs and reduce security surface. The ${roles.projectAssessor || 'Project Assessor'} reports: Mobile Checkout Project depends on API v1 — retirement would require 6 weeks of rework and delay the project launch by 2 months.`,
          keyDecision: 'Do the benefits of the change outweigh the impact on the project?',
          outcome: 'Assessments reveal a fundamental conflict between operational and project needs.',
        },
        {
          stageKey: 'stageApprove',
          universal: 'APPROVE',
          narrative: `The ${roles.operationalApprovalAuthority || 'Operational Approval Authority'} is inclined to approve — the API is a security risk. But the ${roles.projectApprovalAuthority || 'Project Approval Authority'} rejects — a 2-month delay to a revenue-generating project is unacceptable. Since cross-domain changes require BOTH approvals, the change is REJECTED.`,
          keyDecision: 'Both authorities must agree. One rejection = change rejected.',
          outcome: 'Change REJECTED. Dual approval requirement prevented a unilateral decision that would have broken the project.',
        },
        {
          stageKey: 'stageReview',
          universal: 'REVIEW',
          narrative: `Even rejected changes get reviewed. The review recommends: (1) Mobile Checkout Project adds API v2 migration to their backlog, (2) API v1 retirement is re-submitted after project launch in Q3, (3) interim security controls are applied to API v1.`,
          keyDecision: 'What follow-up actions come from this rejection?',
          outcome: '3 follow-up actions created. The rejection was the right governance outcome.',
        },
        {
          stageKey: 'stageClose',
          universal: 'CLOSE',
          narrative: `The change record is closed with status "Rejected". The ${artifacts.changeRegister || 'change register'} is updated. A new change request is expected after the project completes.`,
          keyDecision: 'Are the rejection reasons and follow-up actions documented?',
          outcome: 'Rejected change closed. Governance prevented cross-domain damage.',
        },
      ],
    },
  ];
}

const stageColors: Record<string, string> = {
  stageRequest:   'border-l-gray-400 bg-gray-50',
  stageClassify:  'border-l-purple-400 bg-purple-50/30',
  stageAssess:    'border-l-orange-400 bg-orange-50/30',
  stageApprove:   'border-l-teal-400 bg-teal-50/30',
  stageImplement: 'border-l-blue-400 bg-blue-50/30',
  stageReview:    'border-l-green-400 bg-green-50/30',
  stageClose:     'border-l-gray-400 bg-gray-50/30',
};

export default function ScenarioSimulator() {
  const { activeProfile } = useStore();
  const vocab = activeProfile.vocabulary as unknown as Record<string, string>;
  const roles = activeProfile.roles as unknown as Record<string, string>;
  const artifacts = activeProfile.artifacts as unknown as Record<string, string>;
  const escalation = activeProfile.escalation as unknown as Record<string, string>;

  const scenarios = buildScenarios(vocab, roles, artifacts, escalation);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  function selectScenario(scenario: Scenario) {
    setActiveScenario(scenario);
    setCurrentStep(0);
  }

  function reset() {
    setActiveScenario(null);
    setCurrentStep(0);
  }

  if (!activeScenario) {
    return (
      <div className="space-y-4">
        <div className="bg-cf-50 border border-cf-200 rounded px-4 py-3 flex items-start gap-3">
          <Info size={16} className="text-cf-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-cf-700">
              Scenario Simulator — {activeProfile.name}
            </p>
            <p className="text-xs text-cf-600 mt-0.5">
              Walk through pre-built governance scenarios step by step. All terminology reflects your active profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <button
                key={scenario.id}
                onClick={() => selectScenario(scenario)}
                className="bg-white rounded border border-gray-200 p-4 text-left hover:border-cf-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={18} className={scenario.iconColor} strokeWidth={1.8} />
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-cf-700 transition-colors">
                    {scenario.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-3">{scenario.description}</p>
                <div className="flex gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {scenario.type}
                  </span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">
                    {scenario.scope.replace(/-/g, ' ')}
                  </span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                    {scenario.risk}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-3 text-[10px] text-cf-600 font-medium group-hover:text-cf-700">
                  <Play size={10} />
                  <span>{scenario.steps.length} steps — Start walkthrough</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const step = activeScenario.steps[currentStep];
  const stageName = vocab[step.stageKey] || step.universal;
  const colorClass = stageColors[step.stageKey] || 'border-l-gray-400 bg-gray-50';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
            title="Back to scenarios"
          >
            <RotateCcw size={16} />
          </button>
          <div>
            <h3 className="text-sm font-bold text-gray-800">{activeScenario.title}</h3>
            <p className="text-[10px] text-gray-400">
              {activeProfile.name} — Step {currentStep + 1} of {activeScenario.steps.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {activeScenario.type}
          </span>
          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">
            {activeScenario.scope.replace(/-/g, ' ')}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {activeScenario.steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex-1 h-2 rounded-full transition-all ${
              i === currentStep
                ? 'bg-cf-500'
                : i < currentStep
                ? 'bg-cf-200'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Current step */}
      <div className={`rounded-xl border border-gray-200 border-l-4 ${colorClass} p-5`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-mono text-gray-400 uppercase">{step.universal}</span>
          <span className="text-gray-300">·</span>
          <span className="text-xs font-bold text-gray-800">{stageName}</span>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mt-3 mb-4">{step.narrative}</p>

        <div className="bg-white/60 rounded-lg border border-gray-200 p-3 mb-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1">Key Decision</p>
          <p className="text-xs text-gray-700 font-medium">{step.keyDecision}</p>
        </div>

        <div className="bg-white/60 rounded-lg border border-gray-200 p-3">
          <p className="text-[10px] font-semibold text-green-600 uppercase mb-1">Outcome</p>
          <p className="text-xs text-gray-700 font-medium">{step.outcome}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          Previous
        </button>

        <span className="text-xs text-gray-400">
          {currentStep + 1} / {activeScenario.steps.length}
        </span>

        {currentStep < activeScenario.steps.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg bg-cf-600 text-white hover:bg-cf-700 transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        ) : (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-4 py-2 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            <RotateCcw size={12} />
            Back to Scenarios
          </button>
        )}
      </div>
    </div>
  );
}
