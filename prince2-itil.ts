import { MethodologicalProfile } from '../types/profile';

export const prince2ItilProfile: MethodologicalProfile = {
  id: 'prince2-itil',
  name: 'PRINCE2 + ITIL 4',
  description: 'For organizations using PRINCE2 for project management and ITIL 4 for service management. Common in European organizations, public sector, and regulated environments.',
  projectMethodology: 'PRINCE2',
  operationsMethodology: 'ITIL 4',

  vocabulary: {
    standardChange: 'Standard Change',
    normalChange: 'Normal Change',
    emergencyChange: 'Emergency Change',
    projectOnly: 'Project Change',
    operationalOnly: 'Operational Change',
    crossDomain: 'Cross-domain Change',
    stageRequest: 'Capture Issue',
    stageClassify: 'Examine Issue',
    stageAssess: 'Assess Impact',
    stageApprove: 'Change Authority Decision',
    stageImplement: 'Execute Work Package',
    stageReview: 'Capture Lessons',
    stageClose: 'Close Issue',
    thresholdBreach: 'Exception',
    changeRegister: 'Issue Register',
    projectPlan: 'Stage Plan',
    phaseBoundary: 'Stage Gate',
    businessJustification: 'Business Case',
    postChangeReview: 'Lessons Learned',
  },

  roles: {
    projectApprovalAuthority: 'Change Authority (Project Board)',
    operationalApprovalAuthority: 'Change Advisory Board (CAB)',
    seniorProjectAuthority: 'Project Board',
    emergencyProjectAuthority: 'Project Board (Exception)',
    emergencyOpsAuthority: 'Emergency CAB (ECAB)',
    changeCoordinator: 'Project Support',
    projectAssessor: 'Project Manager',
    operationalAssessor: 'Change Manager',
    projectExecutive: 'Executive',
  },

  artifacts: {
    changeRecord: 'Issue (Request for Change)',
    changeRegister: 'Issue Register',
    impactAssessment: 'Issue Report',
    approvalRecord: 'Change Authority Decision',
    escalationReport: 'Exception Report',
    implementationPlan: 'Updated Stage Plan',
    backoutPlan: 'Exception Plan',
    postChangeReview: 'Lessons Log Entry',
    riskRegister: 'Risk Register',
    configurationRecords: 'Configuration Item Records',
  },

  escalation: {
    breachTerm: 'Exception',
    breachProcess: 'Exception Process (Directing a Project)',
    breachReport: 'Exception Report',
    breachAuthority: 'Project Board',
    breachOutcomes: [
      'Approve Exception Plan',
      'Amend project tolerances',
      'Request revised Stage Plan',
      'Premature close of the project',
    ],
  },
};
