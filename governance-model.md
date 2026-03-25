# Universal Change Governance Model

> ChangeFlow — Configurable Change Governance Framework

---

## 1. Purpose

This document defines the **universal change governance lifecycle** — the framework-agnostic core of ChangeFlow. It describes the stages, decision logic, cross-domain integration, and governance rules that apply regardless of which methodology an organization uses.

This model is deliberately methodology-neutral. It uses **universal terminology** throughout. When you read "Approval Authority" here, your organization might call that a "Change Authority" (PRINCE2), a "Change Control Board" (PMI), or a "Change Advisory Board" (ITIL) — the role is the same, the label comes from your selected profile. See [framework-profiles.md](./framework-profiles.md) for how universal terms map to each methodology.

---

## 2. The Integration Problem

In most IT organizations, change governance exists as two parallel worlds:

**The project world** manages changes that arise from project work: new requirements, scope adjustments, design decisions that deviate from the plan. The project methodology (PRINCE2, PMI/PMBOK, or other) defines how these are captured, assessed, and decided.

**The operations world** manages changes that affect live services: infrastructure upgrades, patches, configuration changes, deployments. ITIL (or equivalent) defines how these are requested, authorized, and implemented.

**The gap between these worlds** is where governance breaks down. A project decision to change a database schema is a project change to the PM — but it's also an operational change that affects a live service. An emergency infrastructure patch is an operational change to the CAB — but it might invalidate a project deliverable. These handoffs are typically informal: an email, a meeting mention, a Slack message. That informality is the root cause of most change-related failures in dual-methodology environments.

ChangeFlow closes this gap by treating every change as potentially cross-domain and routing it through a unified lifecycle that respects both worlds.

---

## 3. Design Principles

### 3.1 Single Entry, Dual Processing

Every change enters the system once, through a single intake process. The system determines whether it needs project-level governance, operational governance, or both. No duplicate data entry, no parallel tracking.

### 3.2 Shared Taxonomy, Separate Authority

Both worlds use the same classification scheme and risk criteria. But decision authority stays where it belongs: the project authority decides on project impact, the operational authority decides on service impact. Neither overrides the other. When both are affected, both must approve.

### 3.3 Dependency Awareness

Every change assessment includes a cross-domain dependency check. Project changes are assessed for operational impact. Operational changes are assessed for project impact. This is a mandatory gate, not an optional step.

### 3.4 Governance Proportionality

Not every change needs the full process. The model scales governance to risk: pre-authorized low-risk changes follow a streamlined path, high-risk or cross-domain changes get full assessment and dual approval. Classification drives the workflow.

### 3.5 Auditability by Design

Every decision, assessment, and state transition is recorded with who, when, why, and under what authority. The system captures the audit trail as a byproduct of the workflow — not as extra documentation work.

### 3.6 AI Assists, Humans Decide

Where AI augmentation is used (classification suggestion, impact prediction, pattern detection), it operates as recommendation only. Every AI output includes a confidence level and reasoning. The human decision-maker always has override authority and is always accountable. See [ai-augmentation-policy.md](./ai-augmentation-policy.md) for details.

### 3.7 Methodology Neutrality

The governance logic works identically regardless of which project methodology the organization uses. Methodology-specific vocabulary, roles, and artifacts are applied through the profile engine — they don't alter the underlying process.

---

## 4. Universal Terminology

Throughout this document, universal terms are used. Here's a quick reference of how they map to common frameworks (full mapping in [cross-framework-equivalences.md](./cross-framework-equivalences.md)):

| Universal Term (ChangeFlow) | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| Change Record | Issue (type: RFC) | Change Request in Change Log | Request for Change (RFC) |
| Project Approval Authority | Change Authority / Project Board | Change Control Board (CCB) | N/A (project side) |
| Operational Approval Authority | N/A (operations side) | N/A (operations side) | CAB / Change Manager |
| Change Coordinator | Project Support | PMO / Change Controller | Change Manager |
| Project Plan Reference | Stage Plan / Project Plan | Project Management Plan | N/A |
| Tolerance / Threshold Breach | Exception (tolerance exceeded) | Variance beyond threshold | N/A |
| Post-Change Review | Lessons Learned (Lessons Log) | Lessons Learned (part of Close) | Post-Implementation Review (PIR) |
| Change Register | Issue Register | Change Log | Change Schedule |

---

## 5. Unified Change Lifecycle

The lifecycle has seven stages. Each stage is described in universal terms. The profile engine translates these into methodology-specific vocabulary.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  1.      │    │  2.      │    │  3.      │    │  4.      │
│ REQUEST  │───▶│ CLASSIFY │───▶│  ASSESS  │───▶│ APPROVE  │
│          │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  7.      │    │  6.      │    │  5.      │          │
│  CLOSE   │◀───│  REVIEW  │◀───│IMPLEMENT │◀─────────┘
│          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘
```

---

### Stage 1 — REQUEST

**Purpose:** Capture the change need with enough information to classify and route it.

**Who initiates:** Anyone — Project Manager, technical lead, operations staff, service desk, business stakeholder. The point is that the entry point is universal.

**Required information:**
- Description of the change (what and why)
- Origin context: which project, service, incident, or problem triggered this
- Requested timeline
- Initial requester assessment of urgency

**Cross-domain integration:**
The intake form captures origin context that links the change to both worlds. If a PM raises it, the system checks for affected services. If Operations raises it, the system checks for affected projects. This happens automatically based on the dependency data.

**Artifacts produced:**
- Change Record (unique ID, timestamp, requester, origin link)

**AI augmentation (optional):**
- Auto-suggest category based on description text
- Flag similar past changes with their outcomes

---

### Stage 2 — CLASSIFY

**Purpose:** Determine the type, risk level, scope, and governance path.

**Classification dimensions:**

| Dimension | Options | Determines |
|---|---|---|
| **Type** | Standard / Normal / Emergency | Workflow speed and approval path |
| **Scope** | Project-only / Operational-only / Cross-domain | Who assesses and who approves |
| **Risk** | Low / Medium / High / Critical | Depth of assessment required |
| **Category** | Infrastructure / Application / Security / Data / Network / Configuration | Technical expertise needed |

**Type definitions (universal — mapped to each methodology):**

- **Standard:** Pre-authorized, low-risk, repeatable. Known procedure, pre-approved. Follows streamlined path. In PRINCE2: within PM's delegated tolerance. In PMI: pre-approved in the Change Management Plan. In ITIL: Standard Change.

- **Normal:** Requires explicit assessment and approval. The default path. In PRINCE2: Issue Report → Change Authority. In PMI: Change Request → CCB. In ITIL: Normal Change → CAB.

- **Emergency:** Urgent implementation to resolve critical incident or prevent imminent harm. Expedited path with retrospective full assessment. In PRINCE2: Exception → Project Board. In PMI: Expedited CCB review. In ITIL: Emergency Change → ECAB.

**Scope determination — the core integration mechanism:**

```
IF change originates from project work:
    Check: Does implementation affect any live service?
        YES → Scope = Cross-domain
        NO  → Scope = Project-only

IF change originates from operations:
    Check: Does implementation affect any active project deliverable,
           timeline, or dependency?
        YES → Scope = Cross-domain
        NO  → Scope = Operational-only

IF change originates from incident/problem:
    Apply both checks above.
```

This scope determination is what prevents changes from falling through the gap between project and operations governance. It's the single most important mechanism in the model.

**Artifacts produced:**
- Updated Change Record with classification (type, scope, risk, category)
- Routing decision (governance path)

**AI augmentation (optional):**
- Classification suggestion with confidence score
- Risk recommendation based on historical patterns
- Automatic scope determination via dependency graph

---

### Stage 3 — ASSESS

**Purpose:** Evaluate impact, risk, resources, implementation approach, and back-out plan. Assessment depth scales with risk and scope.

**Assessment framework:**

| Assessment Area | Project-only | Operational-only | Cross-domain |
|---|---|---|---|
| Impact on project plan / schedule | ✅ Required | ⬜ N/A | ✅ Required |
| Impact on business case / objectives | ✅ Required | ⬜ N/A | ✅ Required |
| Impact on live services | ⬜ N/A | ✅ Required | ✅ Required |
| Impact on SLAs / service agreements | ⬜ N/A | ✅ Required | ✅ Required |
| Technical risk assessment | ✅ Required | ✅ Required | ✅ Required |
| Resource & effort estimate | ✅ Required | ✅ Required | ✅ Required |
| Implementation plan | ✅ Required | ✅ Required | ✅ Required |
| Back-out / rollback plan | ⚠️ If deployment | ✅ Required | ✅ Required |
| Cross-domain dependency check | ⬜ N/A | ⬜ N/A | ✅ Required |
| Change window identification | ⬜ N/A | ✅ Required | ✅ Required |
| Threshold / tolerance check | ✅ Required | ⬜ N/A | ✅ Required |

**Cross-domain assessment process:**

For cross-domain changes, assessment happens **in parallel**, not sequentially:
1. The Project Assessor evaluates project impact (plan, business case, tolerances/thresholds)
2. The Operational Assessor evaluates service impact (services, SLAs, dependencies)
3. Both assessments are combined into a **unified impact statement**
4. If combined risk exceeds predefined thresholds, automatic escalation triggers

**Threshold / tolerance check (universal concept):**

Every project methodology has a concept of acceptable deviation boundaries:
- **PRINCE2** calls these *tolerances* — breach triggers an Exception
- **PMI/PMBOK** calls these *variance thresholds* — breach triggers a change request or escalation
- **ChangeFlow universal term:** *threshold breach*

If the change causes a project to exceed its thresholds, the model flags this and triggers the appropriate escalation for the selected profile — the Project Board receives an Exception Report (PRINCE2) or the CCB/Sponsor receives a variance analysis (PMI). The underlying logic is the same: "this change pushes the project beyond its agreed boundaries, higher authority must decide."

**Artifacts produced:**
- Impact Assessment (unified, covering both domains where applicable)
- Risk score (quantified)
- Implementation Plan
- Back-out Plan
- Escalation Report (if threshold breach)
- Recommendation to approval authority

**AI augmentation (optional):**
- Predicted risk score based on historical outcomes
- Automatic dependency detection from service-project mapping
- Similar change lookup with outcome data

---

### Stage 4 — APPROVE

**Purpose:** Authorize (or reject/defer) the change based on the assessment.

**Approval authority by scope and type:**

| | Standard | Normal | Emergency |
|---|---|---|---|
| **Project-only** | Project Manager (within thresholds) | Project Approval Authority | Senior Project Authority (escalation) |
| **Operational-only** | Pre-authorized (auto-approve) | Operational Approval Authority | Emergency Operational Authority |
| **Cross-domain** | PM + Pre-authorized | Project Authority + Operational Authority | Senior Project Authority + Emergency Ops Authority |

**What these universal roles map to:**

| Universal Role | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| Project Manager (within thresholds) | PM within delegated tolerance | PM within authority in Change Mgmt Plan | N/A |
| Project Approval Authority | Change Authority (Project Board or delegated) | Change Control Board (CCB) | N/A |
| Senior Project Authority | Project Board (Exception decision) | Project Sponsor / Steering Committee | N/A |
| Operational Approval Authority | N/A | N/A | CAB / Change Manager |
| Emergency Operational Authority | N/A | N/A | ECAB / Emergency Change Manager |

**Critical rule for cross-domain changes:** Both authorities must approve. If one approves and one rejects, the change is deferred until the conflict is resolved. Neither overrides the other.

**Approval decisions:**
- **Approved** — proceed as planned
- **Approved with conditions** — proceed with specified modifications
- **Deferred** — not now, reassess at specified date/trigger
- **Rejected** — with documented rationale

**Artifacts produced:**
- Approval Record (decision, authority, rationale, conditions)
- Updated Change Record with approval status
- Scheduled implementation window (if approved)

---

### Stage 5 — IMPLEMENT

**Purpose:** Execute the change according to the approved plan.

**Implementation tracking:**
- Status updates at predefined checkpoints
- Deviation from plan triggers reassessment (not automatic rollback)
- Communication to all affected stakeholders (project team and operations)

**Cross-domain coordination:**
Implementation status is visible to both the PM (in project plan context) and Operations (in change schedule context). If implementation affects the project plan, the PM updates accordingly. If it affects service availability, the change schedule is updated.

**Artifacts produced:**
- Implementation log (actions taken, timestamps, personnel)
- Deviation record (if any)
- Stakeholder notifications

---

### Stage 6 — REVIEW

**Purpose:** Verify the change achieved its objective and capture lessons.

**Review framework:**

| Review Question | Source |
|---|---|
| Did the change achieve its stated objective? | Requester / PM |
| Were there unplanned impacts on services? | Operations / Monitoring |
| Were there unplanned impacts on project deliverables? | PM / Project Team |
| Did implementation follow the approved plan? | Implementation log |
| What worked well / what didn't? | All involved parties |
| Are there follow-up actions required? | Assessment |

**This stage merges activities that are traditionally separate:**

| Framework | What they call this | What it covers | ChangeFlow approach |
|---|---|---|---|
| PRINCE2 | Lessons Learned (Lessons Log) | Process effectiveness, project impact | Merged into unified review |
| PMI/PMBOK | Lessons Learned (Close Project or Phase) | What went right/wrong, recommendations | Merged into unified review |
| ITIL 4 | Post-Implementation Review (PIR) | Service impact, operational success | Merged into unified review |

By combining them, the organization gets a **single, complete review** that covers both project and operational dimensions. One review, multiple destinations: it feeds into the project's lessons log (PRINCE2/PMI) and the operational improvement register (ITIL) simultaneously.

**Artifacts produced:**
- Unified Post-Change Review
- Lessons entries (routed to appropriate registers per profile)
- Follow-up action items (if any)

**AI augmentation (optional):**
- Comparison of predicted vs actual impact
- Pattern detection across reviews
- Lessons matching for future similar changes

---

### Stage 7 — CLOSE

**Purpose:** Formally close the change record and verify completeness.

**Closure checklist:**
- [ ] Implementation verified as successful (or rollback completed)
- [ ] Post-Change Review completed
- [ ] All artifacts attached to change record
- [ ] Project documentation updated (if project-scope)
- [ ] Service documentation updated (if operational-scope)
- [ ] Lessons registered
- [ ] Follow-up actions assigned and tracked
- [ ] Change Record status set to Closed

**Cross-domain closure:**
Closure updates both the project change register and the operational change schedule. Cross-references are maintained in both directions.

**Artifacts produced:**
- Closed Change Record (complete audit trail)
- Updated registers on both sides

---

## 6. Emergency Change Path

Emergency changes follow a compressed lifecycle with retrospective governance:

```
REQUEST → CLASSIFY (emergency) → RAPID ASSESS → EMERGENCY APPROVE → IMPLEMENT → FULL REVIEW → CLOSE
                                                                                      │
                                                                              Retrospective full
                                                                              assessment within
                                                                              5 business days
```

**Key rules:**
- Emergency classification requires documented justification (critical incident, security breach, imminent service loss)
- Approval can come from a single authorized individual if the full authority body is unavailable
- Implementation proceeds with minimum viable assessment
- **Full retrospective assessment** must be completed within 5 business days
- If retrospective reveals misclassification, this is flagged as a process improvement item

**How each methodology handles this:**

| Aspect | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| Emergency authority | Project Board (Exception) | Sponsor or designated CCB member | ECAB / Emergency Change Manager |
| Trigger | Tolerance breach or critical issue | Critical variance or risk event | Major incident or P1 |
| Retrospective requirement | Exception Report + Lessons | Variance analysis + Lessons Learned | PIR mandatory for all emergency changes |

ChangeFlow unifies these into a single emergency path that respects each methodology's expectations.

---

## 7. Governance Metrics

| Metric | Description | Target |
|---|---|---|
| **Change Success Rate** | % of changes achieving objective without unplanned impact | > 85% |
| **Cross-domain Detection Rate** | % of changes correctly identified as cross-domain at classification | > 90% |
| **Emergency Change Ratio** | % of changes classified as emergency | < 10% |
| **Mean Time to Approve** | Average time from request to approval decision | < 5 business days (normal) |
| **Retrospective Compliance** | % of emergency changes with completed retrospective review | 100% |
| **Approval Conflict Rate** | % of cross-domain changes where authorities disagree | Tracked (reduction trend) |
| **Review Completion Rate** | % of non-standard changes with completed post-change review | > 90% |
| **Lessons Applied Rate** | % of flagged lessons that influenced a subsequent change | Tracked (improvement trend) |

---

## 8. Escalation Model

| Condition | Escalation Path |
|---|---|
| Cross-domain approval conflict | Joint meeting of both authorities within 3 business days |
| Threshold breach detected during assessment | Escalation per methodology profile (Exception / Variance escalation) |
| Emergency misclassification detected retrospectively | Process improvement item to governance function |
| AI recommendation overridden 3+ consecutive times for same category | Review AI model calibration for that category |
| Change failure impacts service agreements | Escalate to service management + PM (if cross-domain) |

---

## 9. How Profiles Apply to This Model

This governance model is the **engine**. Profiles are the **dashboard display**.

When an organization configures ChangeFlow with a specific profile:

1. **All stage names stay the same** (Request, Classify, Assess, Approve, Implement, Review, Close)
2. **Role labels change** — "Project Approval Authority" becomes "Change Authority" (PRINCE2) or "CCB" (PMI)
3. **Artifact labels change** — "Change Record" becomes "Issue" (PRINCE2) or "Change Request" (PMI) or "RFC" (ITIL)
4. **Escalation triggers adapt** — "threshold breach" becomes "Exception" (PRINCE2) or "variance beyond threshold" (PMI)
5. **Document templates adapt** — the assessment report uses the profile's expected structure and terminology
6. **The underlying logic never changes** — a cross-domain change still needs dual approval, regardless of what you call the approving bodies

This separation is what makes ChangeFlow reusable across organizations without rebuilding anything.

---

## 10. Relationship to Existing Frameworks

ChangeFlow does not replace ITIL, PRINCE2, or PMI/PMBOK. It operates as an **integration and abstraction layer**:

```
┌─────────────────────────────────────────────────────────┐
│            Project Methodology (choose one)              │
│   PRINCE2          │  PMI/PMBOK        │  Other          │
│   Project Board    │  CCB / Sponsor    │  Custom roles   │
│   Issue Register   │  Change Log       │  Custom docs    │
│   Stage Gates      │  Phase Gates      │  Custom gates   │
├─────────────────────────────────────────────────────────┤
│              ChangeFlow Governance Model                  │
│   Universal Lifecycle │ Shared Taxonomy │ Cross-domain    │
│   Assessment │ Dual Approval │ Unified Review │ Audit     │
│   Trail │ Profile Engine │ AI Augmentation (optional)     │
├─────────────────────────────────────────────────────────┤
│            Operations Methodology                        │
│   ITIL 4                                                 │
│   CAB │ Change Schedule │ Service Catalogue │ CMDB       │
└─────────────────────────────────────────────────────────┘
```

Organizations continue using their existing processes. ChangeFlow adds the connective tissue: cross-domain checks, shared taxonomy, unified lifecycle, and the profile engine that lets the same logic speak different methodological languages.

---

*This governance model is part of the ChangeFlow framework. See [framework-profiles.md](./framework-profiles.md) for profile configuration, [cross-framework-equivalences.md](./cross-framework-equivalences.md) for the three-way mapping table, and [prince2-itil-mapping.md](./prince2-itil-mapping.md) / [pmi-itil-mapping.md](./pmi-itil-mapping.md) for framework-specific details.*
