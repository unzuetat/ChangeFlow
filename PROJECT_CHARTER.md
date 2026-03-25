# ChangeFlow — Project Charter

> **AI-Augmented Change Governance Framework for ITIL/PRINCE2 Environments**

---

## 1. Project Vision

Organizations running hybrid ITIL/PRINCE2 methodologies face a persistent gap: **change management lives in two disconnected worlds.** ITIL manages operational changes (RFCs, CAB approvals, deployment windows). PRINCE2 manages project-level changes (Issue Reports, Change Authority decisions, impact on Business Case). In practice, these processes run in parallel silos, creating blind spots, duplicated effort, and governance risk — especially in regulated or semi-public environments where auditability is non-negotiable.

**ChangeFlow** bridges this gap with a unified change governance framework, demonstrated through a functional web application. It models the full lifecycle of a change — from initial request through classification, impact assessment, approval workflow, implementation tracking, and post-implementation review — with the ITIL↔PRINCE2 integration baked into the process design, not bolted on.

The "AI-Augmented" layer is deliberate and bounded: AI assists with change classification, impact prediction, and pattern detection from historical data. Humans retain all decision authority. The framework is designed for environments where AI can support but never replace governance.

---

## 2. Problem Statement

| Symptom | Root Cause |
|---|---|
| A project change impacts live services but Operations learns about it at deployment | No systematic link between PRINCE2 Issue Register and ITIL Change Schedule |
| An infrastructure RFC breaks a project timeline but the PM finds out late | Change Advisory Board (CAB) has no visibility into active project dependencies |
| Lessons from past changes aren't applied to new ones | Lessons Learned and PIR (Post-Implementation Review) data exists but isn't searchable or connected |
| Change classification is inconsistent across teams | No shared taxonomy or decision criteria between project and operational change |
| Audit trail is fragmented across tools and documents | Governance data scattered between project logs, ITSM tool, emails, and spreadsheets |

---

## 3. Objectives

1. **Design** a unified change governance model that formally integrates ITIL Change Enablement with PRINCE2 Change Control, respecting both frameworks without bastardizing either.
2. **Build** a functional web application (ChangeFlow Hub) that demonstrates the model with simulated but realistic data — usable as a demo, a training tool, or a seed for real implementation.
3. **Document** the methodology as structured, versionable content (docs-as-code) — reusable across organizations, not locked in a PDF.
4. **Demonstrate** how AI augmentation fits responsibly within change governance: classification assistance, impact prediction, pattern matching from historical changes — always as recommendation, never as decision.

---

## 4. Scope

### In Scope

- Unified change lifecycle model (request → classify → assess → approve → implement → review)
- Mapping matrix: PRINCE2 artifacts ↔ ITIL artifacts at each lifecycle stage
- Role model: who does what across project and operational boundaries
- Change taxonomy: shared classification scheme usable by both worlds
- Impact assessment framework with cross-domain dependency awareness
- AI augmentation layer: classification suggestion, similar change detection, risk scoring
- Web application prototype with simulated scenarios
- Methodology documentation in markdown (docs-as-code)

### Out of Scope

- Integration with specific ITSM tools (ServiceNow, Jira Service Management, etc.) — the framework is tool-agnostic
- Financial/costing models
- Full ITIL or PRINCE2 implementation — only the change-related processes
- Production deployment with real organizational data (migration path documented but not executed)

---

## 5. Deliverables

### D1 — Methodology Documentation (`/docs`)

| Document | Description |
|---|---|
| `governance-model.md` | The unified change governance model: lifecycle, stages, gates, decision points |
| `itil-prince2-mapping.md` | Artifact-to-artifact mapping matrix with integration points |
| `role-model.md` | RACI across project and operational roles for each lifecycle stage |
| `change-taxonomy.md` | Classification scheme with decision tree |
| `ai-augmentation-policy.md` | Where AI assists, where it doesn't, and why — the governance guardrails |
| `migration-guide.md` | How to take this from demo to real implementation in an organization |

### D2 — ChangeFlow Hub Web Application (`/app`)

A React application (deployable on Vercel) that demonstrates the framework in action:

- **Change Request Intake** — Form with guided classification (AI-suggested category, manual override)
- **Impact Assessment View** — Cross-domain dependency map showing project and operational impact
- **Approval Workflow** — Visual workflow showing the change moving through gates, with role-based views
- **Change Dashboard** — Portfolio view of active changes with status, risk score, and timeline
- **Historical Analysis** — Browse past changes, see patterns, AI-detected similarities to current requests
- **Scenario Simulator** — Pre-loaded realistic scenarios that walk through the full lifecycle

Data is simulated but structurally realistic: change types, categories, risk levels, timelines, and dependencies modeled on patterns typical of IT organizations in semi-public/regulated environments.

### D3 — Repository & CI/CD

- Professional README with architecture diagram and quick-start
- GitHub Actions: lint, test, build, deploy to Vercel
- Structured commit history (conventional commits)
- Clear contribution guidelines

---

## 6. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  ChangeFlow Hub                      │
│               (React + Tailwind CSS)                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Change   │  │ Impact   │  │ Approval          │  │
│  │ Intake   │  │ Assess.  │  │ Workflow Viewer   │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Dashboard│  │ History  │  │ Scenario          │  │
│  │ & KPIs   │  │ Analysis │  │ Simulator         │  │
│  └──────────┘  └──────────┘  └───────────────────┘  │
│                                                      │
├─────────────────────────────────────────────────────┤
│              State Management (Zustand)              │
├─────────────────────────────────────────────────────┤
│           Simulated Data Layer (JSON/TS)             │
│    ┌────────────────────────────────────────────┐   │
│    │  Change Records │ Scenarios │ Historical   │   │
│    │  Role Config    │ Taxonomy  │ Dependencies │   │
│    └────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│         AI Augmentation Layer (optional)             │
│    Classification │ Similarity │ Risk Scoring        │
│    (Claude API or rule-based fallback)               │
└─────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **No backend required** — all data is client-side (JSON fixtures + Zustand state). This keeps deployment simple and avoids infrastructure dependencies. When migrating to real data, the data layer swaps to an API connector.
- **AI layer is optional** — every AI feature has a rule-based fallback. The app works without an API key. This is deliberate: it demonstrates that the governance framework has value independent of AI, and AI enhances rather than replaces it.
- **Configuration-driven** — taxonomy, roles, workflow stages, and scoring weights are defined in config files, not hardcoded. Migration = change the config.

---

## 7. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18 + TypeScript | Type safety, component model, ecosystem |
| Styling | Tailwind CSS | Rapid iteration, consistent design system |
| State | Zustand | Lightweight, no boilerplate, easy to swap later |
| Data | JSON fixtures + TypeScript interfaces | Simulated but strongly typed — ready to swap for API |
| AI (optional) | Claude API (Sonnet) | Classification, similarity, risk scoring |
| AI fallback | Rule-based engine (TypeScript) | Works offline, no API dependency |
| Testing | Vitest + Testing Library | Fast, modern, good DX |
| CI/CD | GitHub Actions → Vercel | Automated deploy on push to main |
| Docs | Markdown + Mermaid diagrams | Versionable, renderable on GitHub |

---

## 8. Phases & Milestones

### Phase 1 — Foundation (Weeks 1–2)
- [ ] Repository setup (monorepo structure, CI/CD, linting)
- [ ] Methodology docs: governance model + ITIL/PRINCE2 mapping
- [ ] Data model design (TypeScript interfaces for all entities)
- [ ] Simulated dataset: 30–50 realistic change records across categories
- [ ] Basic app scaffold with routing and layout

### Phase 2 — Core Application (Weeks 3–5)
- [ ] Change Request Intake (form + classification logic)
- [ ] Impact Assessment View (dependency visualization)
- [ ] Approval Workflow Viewer (stage-gate visualization)
- [ ] Change Dashboard (portfolio view with filters and risk indicators)
- [ ] Methodology docs: role model + change taxonomy

### Phase 3 — Intelligence Layer (Weeks 6–7)
- [ ] AI classification engine (Claude API + rule-based fallback)
- [ ] Historical similarity detection
- [ ] Risk scoring model
- [ ] Methodology docs: AI augmentation policy

### Phase 4 — Polish & Scenario Engine (Weeks 8–9)
- [ ] Scenario Simulator (guided walkthroughs)
- [ ] Historical Analysis view
- [ ] Responsive design pass
- [ ] Methodology docs: migration guide

### Phase 5 — Hardening (Week 10)
- [ ] Test coverage (unit + integration)
- [ ] README final version with architecture diagram
- [ ] Performance audit
- [ ] Final deployment + demo recording (optional)

---

## 9. Simulated Data Design Principles

The simulated data must be **structurally identical** to what real data would look like, so migration is a data swap, not a redesign.

- **Change types** reflect real IT operations: infrastructure upgrades, application deployments, security patches, configuration changes, network modifications, database migrations
- **Risk levels** follow ITIL standard model (low/medium/high/emergency) with quantified scoring criteria
- **Project context** uses PRINCE2 structure: stages, tolerances, exception scenarios
- **Dependencies** model realistic cross-system impacts (e.g., a database migration affects three applications and one active project)
- **Timelines** follow realistic patterns including CAB schedules, change windows, and blackout periods
- **Outcomes** include successes, partial failures, rollbacks, and escalations — not just happy paths

---

## 10. Migration Path (Demo → Real)

The framework is designed for migration by swapping three layers:

| Layer | Demo Mode | Production Mode |
|---|---|---|
| Data | JSON fixtures | REST API / ITSM connector (ServiceNow, Jira SM, etc.) |
| Auth | None (demo) | SSO / LDAP (organizational identity) |
| AI | Optional Claude API | Internal LLM or Claude API with organizational data |

**What stays the same:** governance model, workflow logic, taxonomy, UI components, role model, documentation. This is the whole point — the framework is the product, the data source is pluggable.

---

## 11. Success Criteria

- [ ] A non-technical stakeholder can open the demo and understand the change lifecycle in under 5 minutes
- [ ] The methodology docs are comprehensive enough to brief a real implementation without the author in the room
- [ ] The repo demonstrates professional engineering practices (typed code, tests, CI/CD, clean history)
- [ ] The AI augmentation layer works but the app is fully functional without it
- [ ] A potential employer or client visiting the GitHub repo understands both the domain expertise and the technical capability within 60 seconds

---

## 12. Repo Structure

```
changeflow/
├── README.md                    # Professional entry point
├── PROJECT_CHARTER.md           # This document
├── docs/
│   ├── governance-model.md
│   ├── itil-prince2-mapping.md
│   ├── role-model.md
│   ├── change-taxonomy.md
│   ├── ai-augmentation-policy.md
│   └── migration-guide.md
├── app/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── views/               # Page-level views
│   │   ├── store/               # Zustand state management
│   │   ├── data/                # Simulated data fixtures
│   │   ├── engine/              # Classification, scoring, workflow logic
│   │   ├── ai/                  # AI integration layer (optional)
│   │   ├── types/               # TypeScript interfaces
│   │   └── config/              # Taxonomy, roles, workflow config
│   ├── tests/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml               # Lint, test, build, deploy
└── LICENSE
```

---

*ChangeFlow is a framework demonstration project. Simulated data is structurally realistic but does not represent any specific organization.*
