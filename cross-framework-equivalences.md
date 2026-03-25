# Cross-Framework Equivalences: PRINCE2 ↔ PMI/PMBOK ↔ ITIL 4

> ChangeFlow — Configurable Change Governance Framework

---

## 1. Purpose

This document provides the three-way mapping between PRINCE2, PMI/PMBOK (7th Edition), and ITIL 4 for all concepts related to change governance. It serves two purposes: as a reference for understanding how the same governance concept appears in different methodological languages, and as the foundation for ChangeFlow's profile engine — the mechanism that lets the application display the correct vocabulary for each organization's chosen methodology.

---

## 2. Change Process Equivalences

### 2.1 How Each Framework Handles Change

| Aspect | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| **Change process name** | Change Control (part of Managing Product Delivery / Controlling a Stage) | Perform Integrated Change Control (Process 4.6) | Change Enablement (Practice) |
| **Where it lives** | Issue and Change Control procedure | Integration Management knowledge area | Service Management Practices |
| **Scope of "change"** | Changes to baselined products within a project | Changes to any project document, deliverable, or baseline | Changes to IT services, infrastructure, or any CI |
| **Fundamental philosophy** | Changes are managed through the Issue Register; every change is an Issue first | Changes are formally controlled through an integrated process tied to the Project Management Plan | Changes are enabled (not just controlled) to maximize value while managing risk |
| **Trigger** | Issue raised (can be RFC, Off-Specification, or Problem/Concern) | Change request submitted (can come from any source) | RFC submitted (can originate from incident, problem, project, or business need) |

### 2.2 Lifecycle Stage Mapping

| ChangeFlow Stage | PRINCE2 Activity | PMI/PMBOK Activity | ITIL 4 Activity |
|---|---|---|---|
| **1. Request** | Capture Issue (Issue Register) | Submit Change Request (Change Log) | Submit RFC (Change Schedule) |
| **2. Classify** | Examine & categorize Issue (RFC / Off-Spec / Problem-Concern) | Categorize change request, evaluate priority | Categorize RFC (standard / normal / emergency), assess risk level |
| **3. Assess** | Assess impact on Project Plan, Stage Plan, Business Case, tolerances | Analyze impact on project baselines (scope, schedule, cost, quality) | Assess impact on services, SLAs, CMDB, change schedule |
| **4. Approve** | Change Authority decides (Project Board or delegated) | CCB decides (or PM within delegated authority) | CAB authorizes (or Change Manager for standard) |
| **5. Implement** | Update plans, execute within Work Package | Update Project Management Plan, execute approved change | Deploy change within approved window |
| **6. Review** | Capture Lessons Learned (Lessons Log) | Document Lessons Learned (part of Close Project or Phase) | Post-Implementation Review (PIR) |
| **7. Close** | Update Issue Register (closed), update Configuration Item Records | Update Change Log (closed), archive records | Close RFC in Change Schedule, update CMDB |

---

## 3. Role Equivalences

### 3.1 Decision Authority Roles

| ChangeFlow Universal | PRINCE2 | PMI/PMBOK | ITIL 4 | Notes |
|---|---|---|---|---|
| **Project Approval Authority** | Change Authority (Project Board, or delegated to PM/Stage-level) | Change Control Board (CCB) | N/A (project-side role) | The body that approves project-scoped changes |
| **Operational Approval Authority** | N/A (operations-side role) | N/A (operations-side role) | Change Advisory Board (CAB) / Change Manager | The body that approves operational changes |
| **Senior Project Authority** | Project Board (Executive + Senior User + Senior Supplier) | Project Sponsor / Steering Committee | N/A | Escalation point for threshold breaches |
| **Emergency Authority (Project)** | Project Board (Exception decision) | Sponsor or designated CCB member | N/A | Fast-track project approval for emergencies |
| **Emergency Authority (Operations)** | N/A | N/A | Emergency CAB (ECAB) | Fast-track operational approval for emergencies |

### 3.2 Operational Roles

| ChangeFlow Universal | PRINCE2 | PMI/PMBOK | ITIL 4 | Notes |
|---|---|---|---|---|
| **Change Requester** | Person raising an Issue | Person submitting a Change Request | RFC Initiator | Anyone can raise a change |
| **Change Coordinator** | Project Support | PMO / Change Controller / PM | Change Manager | Tracks, routes, ensures compliance |
| **Project Assessor** | Project Manager | Project Manager / relevant functional manager | N/A | Assesses project-side impact |
| **Operational Assessor** | N/A | N/A | Change Manager / Technical assessor | Assesses service-side impact |
| **Implementer** | Team Manager / specialist | Work Package owner / team member | Release & Deployment team | Executes the change |
| **Reviewer** | PM + Project Assurance | PM + quality function | Change Manager + Service Owner | Conducts post-change review |
| **Project Executive** | Executive (Project Board Chair) | Project Sponsor | N/A | Ultimate project-level accountability |

### 3.3 The Change Coordinator — Key Integration Role

This role deserves special attention because it's the person (or function) that makes cross-domain integration work in practice:

| Responsibility | How PRINCE2 sees it | How PMI sees it | How ITIL sees it |
|---|---|---|---|
| Ensure correct scope classification | Project Support function | PMO governance function | Change Manager responsibility |
| Route cross-domain changes to both tracks | Part of Issue & Change Control procedure | Part of Integrated Change Control | Part of Change Enablement workflow |
| Escalate approval conflicts | Escalation to Project Board | Escalation to Sponsor/Steering Committee | Escalation to IT Director / Service Owner |
| Maintain audit trail | Configuration management duty | PMO documentation duty | Change Manager duty |
| Report governance metrics | Highlight Reports / End Stage Reports | Status Reports / Performance Reports | Change Enablement metrics |

In practice, this role often sits in the PMO — which makes it a natural fit for the person implementing ChangeFlow.

---

## 4. Artifact Equivalences

### 4.1 Change Record Equivalences

| ChangeFlow Universal | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| **Change Record** | Issue (type: Request for Change) in Issue Register | Change Request in Change Log | Request for Change (RFC) in Change Schedule |
| **Classification Record** | Issue examination notes (type, severity, priority) | Change categorization (corrective, preventive, defect repair, update) | RFC categorization (standard, normal, emergency) + risk level |
| **Impact Assessment** | Impact analysis section of Issue Report | Impact analysis (scope, schedule, cost, quality, risk baselines) | Change impact assessment (services, SLAs, CMDB) |
| **Approval Record** | Change Authority decision recorded in Issue Register | CCB decision recorded in Change Log | CAB authorization recorded in Change Schedule |
| **Implementation Plan** | Updated Stage Plan / Work Package | Updated Project Management Plan (relevant baselines) | Change implementation plan with deployment window |
| **Back-out Plan** | Part of Exception Plan (if needed) | Part of risk response / contingency | Remediation / rollback plan (mandatory for normal+) |
| **Post-Change Review** | Lessons Learned entry (Lessons Log) | Lessons Learned (Close Project/Phase) | Post-Implementation Review (PIR) |
| **Escalation Report** | Exception Report (tolerance breach) | Variance Report / Escalation to Sponsor | N/A (handled within Change Enablement) |

### 4.2 Register and Log Equivalences

| ChangeFlow Universal | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| **Change Register** | Issue Register | Change Log | Change Schedule |
| **Risk Register** | Risk Register | Risk Register | Risk assessment per RFC |
| **Lessons Register** | Lessons Log | Lessons Learned Register | Continual Improvement Register |
| **Configuration Records** | Configuration Item Records | Organizational Process Assets | CMDB (Configuration Management Database) |
| **Quality Records** | Quality Register | Quality Reports | Service validation records |

### 4.3 Plan-Level Equivalences

| ChangeFlow Universal | PRINCE2 | PMI/PMBOK | ITIL 4 |
|---|---|---|---|
| **Project-level plan** | Project Plan | Project Management Plan | N/A (project side) |
| **Stage/Phase-level plan** | Stage Plan | Phase-specific subsidiary plans | N/A (project side) |
| **Team-level plan** | Team Plan / Work Package | Work Package / Activity list | N/A (project side) |
| **Exception/Recovery plan** | Exception Plan | Updated baselines + corrective actions | N/A (project side) |
| **Change schedule** | N/A (operations side) | N/A (operations side) | Change Schedule / Forward Schedule of Changes |

---

## 5. Process Concept Equivalences

### 5.1 Key Concept Mapping

| Concept | PRINCE2 | PMI/PMBOK | ITIL 4 | ChangeFlow Universal |
|---|---|---|---|---|
| **Acceptable deviation boundaries** | Tolerances (time, cost, scope, risk, quality, benefit) | Variance thresholds / control limits | Risk appetite per change type | Thresholds |
| **Boundary exceeded → escalate** | Exception | Variance beyond threshold → escalate | Risk exceeds appetite → escalate | Threshold breach |
| **Pre-authorized changes** | PM delegated authority within tolerance | PM authority defined in Change Management Plan | Standard Change (pre-authorized) | Standard type |
| **Change categories (PMI-specific)** | N/A (all are Issues) | Corrective action, Preventive action, Defect repair, Updates | N/A (type + category) | Type + Category |
| **Formal project checkpoints** | Stage Gates (End Stage Assessment) | Phase Gates / Milestone reviews | N/A | Phase boundaries |
| **Business justification** | Business Case (living document, reviewed at each stage) | Business Case / Benefits Management Plan | Service value streams | Business case |
| **Configuration management** | Configuration Management Strategy | Configuration Management Plan | CMDB + Configuration Management practice | Configuration tracking |

### 5.2 Change Classification Comparison

**PRINCE2 classifies issues into three types:**
- Request for Change (RFC) — proposed change to a baseline
- Off-Specification — something that doesn't meet specification (already happened or will happen)
- Problem/Concern — anything else that needs managing

**PMI/PMBOK classifies change requests into four types:**
- Corrective Action — realign future performance with the plan
- Preventive Action — reduce probability of negative future consequences
- Defect Repair — fix a verified defect in a component
- Updates — changes to formally controlled documents, plans, or baselines

**ITIL 4 classifies changes by type:**
- Standard Change — pre-authorized, low-risk, repeatable
- Normal Change — requires assessment and CAB authorization
- Emergency Change — must be implemented urgently for critical situations

**ChangeFlow reconciliation:**
ChangeFlow uses **Type** (Standard/Normal/Emergency) for workflow routing — aligned with ITIL and mappable to PRINCE2 and PMI concepts. It adds **Category** (infrastructure, application, security, etc.) for technical routing. The PMI-specific distinction between corrective, preventive, and defect repair is captured in the change description and assessment — it influences the "why" but not the governance path.

---

## 6. Process Integration Points by Stage

| ChangeFlow Stage | PRINCE2 Process(es) Active | PMI Process(es) Active | ITIL Practice(s) Active |
|---|---|---|---|
| **Request** | Controlling a Stage (CS) — capture Issue | Perform Integrated Change Control (4.6) — receive change request | Change Enablement — receive RFC |
| **Classify** | CS — examine Issue | 4.6 — categorize, assess impact type | Change Enablement — categorize, risk assess |
| **Assess** | CS — analyze impact; Directing a Project (DP) if Exception | 4.6 — evaluate impact on baselines | Change Enablement — assess impact on services |
| **Approve** | DP — Change Authority / Project Board decides | 4.6 — CCB or PM decides | Change Enablement — CAB or Change Manager authorizes |
| **Implement** | Managing Product Delivery (MP) — execute Work Package | Direct & Manage Project Work (4.3) — execute approved changes | Release Management / Deployment Management |
| **Review** | CS / Closing a Project (CP) — capture Lessons | Close Project or Phase (4.7) — Lessons Learned | Change Enablement — Post-Implementation Review |
| **Close** | CS — update Issue Register | 4.6 — update Change Log | Change Enablement — close RFC |

---

## 7. Escalation Path Comparison

| Trigger | PRINCE2 Path | PMI Path | ITIL Path | ChangeFlow Universal |
|---|---|---|---|---|
| **Threshold/tolerance breach** | Exception Report → Project Board decides (approve Exception Plan or premature close) | Variance report → Sponsor / Steering Committee (approve corrective action or rebaseline) | N/A (project side) | Escalation Report → Senior Project Authority |
| **Approval conflict (cross-domain)** | Project Board mediates | Sponsor / Steering Committee mediates | IT Director / Service Owner mediates | Joint escalation meeting within 3 business days |
| **Emergency change** | Exception process → Project Board (or delegated authority in extremis) | Expedited CCB → Sponsor if needed | ECAB (minimum quorum, can be a single authorized individual) | Emergency Authority approval + retrospective review |
| **Change failure** | Issue + Lessons Learned | Issue Log + Lessons Learned + corrective action | Major Incident if service-affecting + PIR + Problem Management | Post-change review + escalation if SLA impacted |

---

## 8. Using This Document

### For ChangeFlow profile configuration:
Each profile (PRINCE2+ITIL, PMI+ITIL, etc.) uses this mapping to translate universal terms in the governance engine into framework-specific labels. The profile configuration file references this document as its source of truth.

### For implementation:
When deploying ChangeFlow in a real organization, use the relevant column(s) to align ChangeFlow concepts with your existing documentation, tools, and training materials.

### For training:
This document works as a Rosetta Stone for teams transitioning between methodologies or working in multi-methodology environments. If you know PRINCE2 and need to understand the PMI equivalent of an Exception, look it up here.

---

*This equivalence mapping is part of the ChangeFlow framework. See [governance-model.md](./governance-model.md) for the universal lifecycle, [prince2-itil-mapping.md](./prince2-itil-mapping.md) for PRINCE2-specific details, and [pmi-itil-mapping.md](./pmi-itil-mapping.md) for PMI-specific details.*
