// =============================================================================
// ChangeFlow — Profile Type Definitions
// =============================================================================
// A Profile is a "language pack" for a methodology.
// It maps universal ChangeFlow terms to framework-specific vocabulary.
// The governance ENGINE stays the same. The LABELS change.
// =============================================================================

export type ProfileId = 'prince2-itil' | 'pmi-itil' | 'hybrid' | 'generic';

export interface MethodologicalProfile {
  id: ProfileId;
  name: string;                        // e.g., "PRINCE2 + ITIL 4"
  description: string;
  projectMethodology: string;          // e.g., "PRINCE2", "PMI/PMBOK"
  operationsMethodology: string;       // e.g., "ITIL 4"

  // Vocabulary mappings — universal term → framework-specific term
  vocabulary: ProfileVocabulary;

  // Role name mappings
  roles: ProfileRoles;

  // Artifact name mappings
  artifacts: ProfileArtifacts;

  // Escalation-specific terminology
  escalation: ProfileEscalation;
}

// -----------------------------------------------------------------------------
// Vocabulary — how we label governance concepts
// -----------------------------------------------------------------------------

export interface ProfileVocabulary {
  // Change types
  standardChange: string;              // "Standard Change" / "Pre-approved Change"
  normalChange: string;                // "Normal Change" / "Change Request"
  emergencyChange: string;             // "Emergency Change" / "Expedited Change"

  // Scope labels
  projectOnly: string;                 // "Project Change" / "Internal Change"
  operationalOnly: string;             // "Operational Change" / "Service Change"
  crossDomain: string;                 // "Cross-domain Change" / "Integrated Change"

  // Lifecycle stage display names
  stageRequest: string;
  stageClassify: string;
  stageAssess: string;
  stageApprove: string;
  stageImplement: string;
  stageReview: string;
  stageClose: string;

  // Key concepts
  thresholdBreach: string;             // "Exception" (PRINCE2) / "Variance Breach" (PMI)
  changeRegister: string;              // "Issue Register" / "Change Log" / "Change Schedule"
  projectPlan: string;                 // "Stage Plan" / "Project Management Plan"
  phaseBoundary: string;               // "Stage Gate" / "Phase Gate"
  businessJustification: string;       // "Business Case" / "Business Case" / "Value Stream"
  postChangeReview: string;            // "Lessons Learned" / "Lessons Learned" / "PIR"
}

// -----------------------------------------------------------------------------
// Roles — who does what, in framework language
// -----------------------------------------------------------------------------

export interface ProfileRoles {
  projectApprovalAuthority: string;    // "Change Authority" / "CCB"
  operationalApprovalAuthority: string; // "CAB" in all profiles
  seniorProjectAuthority: string;      // "Project Board" / "Sponsor/Steering Committee"
  emergencyProjectAuthority: string;   // "Project Board" / "Sponsor"
  emergencyOpsAuthority: string;       // "ECAB" in all profiles
  changeCoordinator: string;           // "Project Support" / "PMO" / "Change Manager"
  projectAssessor: string;             // "Project Manager"
  operationalAssessor: string;         // "Change Manager" / "Technical Assessor"
  projectExecutive: string;            // "Executive" / "Project Sponsor"
}

// -----------------------------------------------------------------------------
// Artifacts — what documents/records are called
// -----------------------------------------------------------------------------

export interface ProfileArtifacts {
  changeRecord: string;                // "Issue" / "Change Request" / "RFC"
  changeRegister: string;              // "Issue Register" / "Change Log" / "Change Schedule"
  impactAssessment: string;            // "Issue Report" / "Impact Analysis" / "Change Assessment"
  approvalRecord: string;              // "Change Authority Decision" / "CCB Decision" / "CAB Authorization"
  escalationReport: string;            // "Exception Report" / "Variance Report"
  implementationPlan: string;          // "Updated Stage Plan" / "Updated PM Plan" / "Implementation Plan"
  backoutPlan: string;                 // "Exception Plan" / "Contingency Plan" / "Remediation Plan"
  postChangeReview: string;            // "Lessons Log Entry" / "Lessons Learned" / "PIR Report"
  riskRegister: string;                // "Risk Register" / "Risk Register" / "Risk Assessment"
  configurationRecords: string;        // "CI Records" / "OPA" / "CMDB"
}

// -----------------------------------------------------------------------------
// Escalation — how threshold breaches are described
// -----------------------------------------------------------------------------

export interface ProfileEscalation {
  breachTerm: string;                  // "Exception" / "Variance beyond threshold"
  breachProcess: string;               // "Exception Process" / "Escalation to Sponsor"
  breachReport: string;                // "Exception Report" / "Variance Analysis"
  breachAuthority: string;             // "Project Board" / "Sponsor/Steering Committee"
  breachOutcomes: string[];            // What can the authority decide?
}
