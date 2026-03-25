import { MethodologicalProfile, ProfileId } from '../types/profile';
import { prince2ItilProfile } from './prince2-itil';
import { pmiItilProfile } from './pmi-itil';

// All available profiles
export const profiles: Record<ProfileId, MethodologicalProfile> = {
  'prince2-itil': prince2ItilProfile,
  'pmi-itil': pmiItilProfile,
  'hybrid': {
    ...prince2ItilProfile,
    id: 'hybrid',
    name: 'Hybrid (PRINCE2 + PMI + ITIL)',
    description: 'For organizations using a mix of PRINCE2 and PMI practices alongside ITIL. Uses the most commonly recognized term from either framework.',
    projectMethodology: 'PRINCE2 / PMI Hybrid',
  },
  'generic': {
    ...prince2ItilProfile,
    id: 'generic',
    name: 'Framework-Agnostic',
    description: 'Uses plain-language governance terms without framework-specific vocabulary. For organizations building their own methodology or not formally aligned to any standard.',
    projectMethodology: 'Generic',
    operationsMethodology: 'Generic',
    vocabulary: {
      standardChange: 'Standard Change',
      normalChange: 'Normal Change',
      emergencyChange: 'Emergency Change',
      projectOnly: 'Project Change',
      operationalOnly: 'Operational Change',
      crossDomain: 'Cross-domain Change',
      stageRequest: 'Submit Request',
      stageClassify: 'Classify Change',
      stageAssess: 'Assess Impact',
      stageApprove: 'Approve Change',
      stageImplement: 'Implement Change',
      stageReview: 'Review Change',
      stageClose: 'Close Change',
      thresholdBreach: 'Threshold Breach',
      changeRegister: 'Change Register',
      projectPlan: 'Project Plan',
      phaseBoundary: 'Phase Boundary',
      businessJustification: 'Business Justification',
      postChangeReview: 'Post-Change Review',
    },
    roles: {
      projectApprovalAuthority: 'Project Approval Board',
      operationalApprovalAuthority: 'Operations Approval Board',
      seniorProjectAuthority: 'Senior Management',
      emergencyProjectAuthority: 'Senior Management (Emergency)',
      emergencyOpsAuthority: 'Emergency Operations Authority',
      changeCoordinator: 'Change Coordinator',
      projectAssessor: 'Project Manager',
      operationalAssessor: 'Operations Assessor',
      projectExecutive: 'Project Executive',
    },
    artifacts: {
      changeRecord: 'Change Record',
      changeRegister: 'Change Register',
      impactAssessment: 'Impact Assessment',
      approvalRecord: 'Approval Record',
      escalationReport: 'Escalation Report',
      implementationPlan: 'Implementation Plan',
      backoutPlan: 'Back-out Plan',
      postChangeReview: 'Post-Change Review Report',
      riskRegister: 'Risk Register',
      configurationRecords: 'Configuration Records',
    },
    escalation: {
      breachTerm: 'Threshold Breach',
      breachProcess: 'Escalation to Senior Management',
      breachReport: 'Escalation Report',
      breachAuthority: 'Senior Management',
      breachOutcomes: [
        'Approve recovery plan',
        'Adjust project boundaries',
        'Allocate additional resources',
        'Terminate the initiative',
      ],
    },
  },
};

// Helper to get a profile by ID
export function getProfile(id: ProfileId): MethodologicalProfile {
  return profiles[id];
}

// List all available profiles (for the selector UI)
export function listProfiles(): MethodologicalProfile[] {
  return Object.values(profiles);
}
