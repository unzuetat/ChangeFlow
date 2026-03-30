// =============================================================================
// ChangeFlow — Core Type Definitions
// =============================================================================
// These types define the shape of ALL data in the system.
// They are framework-agnostic — the universal governance engine uses these.
// Profiles translate the LABELS, not the structure.
// =============================================================================

// -----------------------------------------------------------------------------
// Change Record — the central entity
// -----------------------------------------------------------------------------

export type ChangeType = 'standard' | 'normal' | 'emergency';

export type ChangeScope = 'project-only' | 'operational-only' | 'cross-domain';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ChangeCategory =
  | 'infrastructure'
  | 'application'
  | 'security'
  | 'data'
  | 'network'
  | 'configuration';

export type ChangeStatus =
  | 'draft'
  | 'submitted'
  | 'classified'
  | 'assessing'
  | 'assessed'
  | 'pending-approval'
  | 'approved'
  | 'approved-with-conditions'
  | 'rejected'
  | 'deferred'
  | 'implementing'
  | 'implemented'
  | 'in-review'
  | 'closed';

export type ApprovalDecision = 'approved' | 'approved-with-conditions' | 'deferred' | 'rejected';

export interface ChangeRecord {
  id: string;
  title: string;
  description: string;
  status: ChangeStatus;
  type: ChangeType;
  scope: ChangeScope;
  risk: RiskLevel;
  category: ChangeCategory;
  origin: ChangeOrigin;
  requesterId: string;
  requestDate: string;
  assessment: Assessment | null;
  approval: ApprovalRecord | null;
  implementation: ImplementationRecord | null;
  review: PostChangeReview | null;
  affectedServices: string[];
  affectedProjects: string[];
  affectedSystems?: import('./routing').AffectedSystem[];
  relatedChanges: string[];
  aiSuggestions: AISuggestion[];
  timeline: TimelineEntry[];
  closedDate: string | null;
}

export interface ChangeOrigin {
  type: 'project' | 'operational' | 'incident' | 'business-request';
  referenceId: string;
  referenceName: string;
}

// -----------------------------------------------------------------------------
// Assessment
// -----------------------------------------------------------------------------

export interface Assessment {
  projectImpact: ProjectImpact | null;
  operationalImpact: OperationalImpact | null;
  riskScore: number;
  effortEstimate: string;
  implementationPlan: string;
  backoutPlan: string;
  thresholdBreach: boolean;
  escalationRequired: boolean;
  assessedBy: string[];
  assessedDate: string;
  recommendation: ApprovalDecision;
}

export interface ProjectImpact {
  planImpact: 'none' | 'minor' | 'major';
  scheduleImpactDays: number;
  businessCaseImpact: 'none' | 'minor' | 'major';
  thresholdBreachDetails: string | null;
}

export interface OperationalImpact {
  affectedServices: ServiceImpact[];
  slaRisk: boolean;
  changeWindowRequired: boolean;
  proposedWindow: string | null;
  downtimeMinutes: number;
}

export interface ServiceImpact {
  serviceId: string;
  serviceName: string;
  impactLevel: 'none' | 'degraded' | 'outage';
  duration: string;
}

// -----------------------------------------------------------------------------
// Approval
// -----------------------------------------------------------------------------

export interface ApprovalRecord {
  decision: ApprovalDecision;
  projectApproval: SingleApproval | null;
  operationalApproval: SingleApproval | null;
  conditions: string | null;
  approvedDate: string;
  scheduledImplementation: string | null;
}

export interface SingleApproval {
  authorityId: string;
  authorityName: string;
  decision: ApprovalDecision;
  rationale: string;
  date: string;
}

// -----------------------------------------------------------------------------
// Implementation
// -----------------------------------------------------------------------------

export interface ImplementationRecord {
  startDate: string;
  endDate: string | null;
  implementerId: string;
  status: 'in-progress' | 'completed' | 'rolled-back' | 'partial';
  deviationFromPlan: boolean;
  deviationDetails: string | null;
  log: ImplementationLogEntry[];
}

export interface ImplementationLogEntry {
  timestamp: string;
  action: string;
  personnel: string;
  notes: string | null;
}

// -----------------------------------------------------------------------------
// Post-Change Review
// -----------------------------------------------------------------------------

export interface PostChangeReview {
  objectiveAchieved: boolean;
  unplannedServiceImpact: boolean;
  unplannedProjectImpact: boolean;
  followedApprovedPlan: boolean;
  lessonsLearned: string[];
  followUpActions: FollowUpAction[];
  reviewDate: string;
  reviewerId: string;
}

export interface FollowUpAction {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'closed';
}

// -----------------------------------------------------------------------------
// AI Augmentation
// -----------------------------------------------------------------------------

export interface AISuggestion {
  id: string;
  type: 'classification' | 'risk-score' | 'similar-change' | 'impact-prediction';
  suggestion: string;
  confidence: number;
  reasoning: string;
  accepted: boolean | null;
  overriddenBy: string | null;
}

// -----------------------------------------------------------------------------
// Audit Trail
// -----------------------------------------------------------------------------

export interface TimelineEntry {
  timestamp: string;
  stage: ChangeStatus;
  action: string;
  actor: string;
  details: string | null;
}

// -----------------------------------------------------------------------------
// Supporting Entities
// -----------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'closing' | 'closed';
  currentPhase: string;
  managerId: string;
  thresholds: ProjectThresholds;
}

export interface ProjectThresholds {
  scheduleDays: number;
  scopePercent: number;
  riskLevel: RiskLevel;
}

export interface Service {
  id: string;
  name: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  ownerId: string;
  slaTarget: string;
  dependsOn: string[];
  usedByProjects: string[];
}

export interface Person {
  id: string;
  name: string;
  role: string;
  department: 'project' | 'operations' | 'management' | 'technical';
}

// -----------------------------------------------------------------------------
// Governance Metrics
// -----------------------------------------------------------------------------

export interface GovernanceMetrics {
  changeSuccessRate: number;
  crossDomainDetectionRate: number;
  emergencyChangeRatio: number;
  meanTimeToApproveDays: number;
  retrospectiveCompliance: number;
  approvalConflictRate: number;
  reviewCompletionRate: number;
  lessonsAppliedRate: number;
}
