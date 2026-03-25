import { MethodologicalProfile } from '../types/profile';

export const pmiItilProfile: MethodologicalProfile = {
  id: 'pmi-itil',
  name: 'PMI/PMBOK + ITIL 4',
  description: 'For organizations using PMI/PMBOK standards for project management and ITIL 4 for service management. Common globally, especially in private sector and PMI-certified environments.',
  projectMethodology: 'PMI/PMBOK',
  operationsMethodology: 'ITIL 4',

  vocabulary: {
    standardChange: 'Pre-approved Change',
    normalChange: 'Change Request',
    emergencyChange: 'Expedited Change Request',
    projectOnly: 'Project Change',
    operationalOnly: 'Service Change',
    crossDomain: 'Integrated Change',
    stageRequest: 'Submit Change Request',
    stageClassify: 'Categorize Change',
    stageAssess: 'Perform Impact Analysis',
    stageApprove: 'CCB Decision',
    stageImplement: 'Direct & Manage Project Work',
    stageReview: 'Document Lessons Learned',
    stageClose: 'Close Change Request',
    thresholdBreach: 'Variance Beyond Threshold',
    changeRegister: 'Change Log',
    projectPlan: 'Project Management Plan',
    phaseBoundary: 'Phase Gate',
    businessJustification: 'Business Case',
    postChangeReview: 'Lessons Learned',
  },

  roles: {
    projectApprovalAuthority: 'Change Control Board (CCB)',
    operationalApprovalAuthority: 'Change Advisory Board (CAB)',
    seniorProjectAuthority: 'Project Sponsor / Steering Committee',
    emergencyProjectAuthority: 'Project Sponsor',
    emergencyOpsAuthority: 'Emergency CAB (ECAB)',
    changeCoordinator: 'PMO / Change Controller',
    projectAssessor: 'Project Manager',
    operationalAssessor: 'Change Manager',
    projectExecutive: 'Project Sponsor',
  },

  artifacts: {
    changeRecord: 'Change Request',
    changeRegister: 'Change Log',
    impactAssessment: 'Impact Analysis (Scope, Schedule, Cost, Quality)',
    approvalRecord: 'CCB Decision Record',
    escalationReport: 'Variance Report',
    implementationPlan: 'Updated Project Management Plan',
    backoutPlan: 'Contingency / Rollback Plan',
    postChangeReview: 'Lessons Learned Register Entry',
    riskRegister: 'Risk Register',
    configurationRecords: 'Organizational Process Assets (OPA)',
  },

  escalation: {
    breachTerm: 'Variance Beyond Threshold',
    breachProcess: 'Escalation to Sponsor / Steering Committee',
    breachReport: 'Variance Analysis',
    breachAuthority: 'Project Sponsor / Steering Committee',
    breachOutcomes: [
      'Approve corrective action',
      'Rebaseline the project',
      'Approve additional resources or time',
      'Terminate the project',
    ],
  },
};
