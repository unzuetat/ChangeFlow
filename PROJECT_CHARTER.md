# ChangeFlow — Project Charter

> **Configurable Change Governance Framework for Multi-Methodology IT Environments**
>
> Supporting PRINCE2, PMI/PMBOK, and ITIL 4 — individually or combined

---

## 1. Project Vision

Every IT organization manages change. But the *way* they manage it depends on which methodology they've adopted — PRINCE2, PMI/PMBOK, ITIL, or (very commonly) a hybrid of two or more. Each framework has its own vocabulary, roles, artifacts, and processes for handling change. And in most organizations, **the project side and the operations side speak different languages**, even when they're managing the same change.

**ChangeFlow** solves this with a different approach: instead of building a governance model locked to one framework, it provides a **universal change governance engine** that speaks multiple methodological languages. The core lifecycle is framework-agnostic — it captures the shared logic that all frameworks agree on. On top of that core, you configure which methodology your organization uses, and the system presents the right vocabulary, roles, artifacts, and workflows.

Think of it as a governance model with a language selector. The destination is the same (well-governed change). The signs along the road speak your language.

**The "AI-Augmented" layer** is deliberate and bounded: AI assists with classification, impact prediction, and pattern detection. Humans retain all decision authority. The framework works fully without AI — augmentation is optional, not required.

---

## 2. Problem Statement

| Symptom | Root Cause |
|---|---|
| A project change impacts live services but Operations learns about it at deployment | No systematic link between project change control and operational change management |
| An infrastructure change breaks a project timeline but the PM finds out late | Change advisory processes have no visibility into active project dependencies |
| Organizations using PRINCE2 can't reuse governance tools built for PMI (and vice versa) | Change governance tools are locked to one methodology's vocabulary and assumptions |
| Lessons from past changes aren't applied to new ones | Post-implementation review data exists but isn't connected or searchable |
| Audit trail is fragmented across tools and documents | Governance data scattered across project logs, ITSM tools, emails, and spreadsheets |
| Teams adopting a new framework must rebuild governance from scratch | No abstraction layer separating governance logic from methodology-specific details |

---

## 3. Objectives

1. **Design** a universal change governance model that captures the shared logic across PRINCE2, PMI/PMBOK, and ITIL 4 — then maps methodology-specific vocabulary, roles, and artifacts as configurable layers on top.
2. **Build** a functional web application (ChangeFlow Hub) that demonstrates the model with simulated data, where users can switch between methodological profiles and see the governance adapt.
3. **Document** the methodology as structured, versionable content (docs-as-code) — covering the universal model, each framework's mapping, and the integration logic.
4. **Demonstrate** responsible AI augmentation within change governance: classification, prediction, and pattern matching — always as recommendation, never as decision.

---

## 4. The Multi-Framework Approach

### How It Works

ChangeFlow separates change governance into two layers:

**Layer 1 — Universal Governance Engine (framework-agnostic)**
The 7-stage change lifecycle, the cross-domain dependency logic, the risk scoring model, the audit trail structure, and the approval escalation rules. This layer captures what *every* framework agrees on: changes need to be requested, classified, assessed, approved, implemented, reviewed, and closed. The logic here doesn't change regardless of methodology.

**Layer 2 — Methodological Profile (configurable)**
The vocabulary, role names, artifact names, document templates, and framework-specific process nuances. This layer is a configuration choice — you select your profile and the system adapts.

### Available Profiles

| Profile | Project Methodology | Operations Methodology | Best For |
|---|---|---|---|
| **PRINCE2 + ITIL** | PRINCE2 (Change Authority, Issue Register, Stage Gates) | ITIL 4 (CAB, Change Schedule, RFC) | European organizations, public sector, regulated environments |
| **PMI + ITIL** | PMI/PMBOK (CCB, Change Log, Integrated Change Control) | ITIL 4 (CAB, Change Schedule, RFC) | Global organizations, private sector, PMI-certified environments |
| **Hybrid** | Mixed PRINCE2 + PMI terminology | ITIL 4 | Organizations with mixed methodology adoption |
| **Framework-agnostic** | Generic terms (Approval Board, Change Record) | Generic terms | Organizations without formal methodology or building their own |

### Why This Matters

- **For adoption:** An organization using PMI doesn't need to learn PRINCE2 vocabulary to use ChangeFlow (and vice versa). They configure their profile and the system speaks their language.
- **For the author's positioning:** This demonstrates understanding *above* any single framework — the ability to see the shared patterns across methodologies and abstract them into a reusable model.
- **For migration:** When moving from demo to production, the organization selects their profile as part of setup. The governance logic doesn't change — only the labels do.

---

## 5. Scope

### In Scope

- Universal change lifecycle model (7 stages, framework-agnostic)
- Methodological profile system (PRINCE2+ITIL, PMI+ITIL, Hybrid, Generic)
- Mapping matrices: PRINCE2 ↔ PMI/PMBOK ↔ ITIL 4 (roles, artifacts, processes)
- Cross-domain dependency awareness (project ↔ operations)
- Change taxonomy: shared classification scheme usable across all profiles
- Impact assessment framework with cross-domain awareness
- AI augmentation layer: classification, similarity detection, risk scoring (optional)
- Web application prototype with simulated scenarios and profile switching
- Methodology documentation in markdown (docs-as-code)

### Out of Scope

- Integration with specific tools (ServiceNow, Jira, MS Project, etc.) — framework is tool-agnostic
- Financial/costing models
- Full implementation of ITIL, PRINCE2, or PMBOK — only change-related processes
- Production deployment with real organizational data (migration path documented but not executed)
- Agile-specific change processes (Scrum, SAFe) — potential future profile

---

## 6. Deliverables

### D1 — Methodology Documentation (`/docs`)

| Document | Description |
|---|---|
| `governance-model.md` | Universal change lifecycle: 7 stages, decision logic, cross-domain integration — framework-agnostic core |
| `framework-profiles.md` | How the profile system works, what changes per profile, configuration reference |
| `prince2-itil-mapping.md` | Detailed mapping for PRINCE2+ITIL profile: artifacts, roles, processes, vocabulary |
| `pmi-itil-mapping.md` | Detailed mapping for PMI/PMBOK+ITIL profile: artifacts, roles, processes, vocabulary |
| `cross-framework-equivalences.md` | Three-way comparison table: PRINCE2 ↔ PMI/PMBOK ↔ ITIL 4 for all change-related concepts |
| `change-taxonomy.md` | Shared classification scheme with decision tree (works across all profiles) |
| `ai-augmentation-policy.md` | Where AI assists, where it doesn't, governance guardrails |
| `migration-guide.md` | How to go from demo to real implementation — including profile selection |

### D2 — ChangeFlow Hub Web Application (`/app`)

A React application (deployable on Vercel) demonstrating the framework:

- **Profile Selector** — Choose your methodological profile; the entire UI adapts vocabulary and workflows
- **Change Request Intake** — Form with guided classification (AI-suggested category, manual override)
- **Impact Assessment View** — Cross-domain dependency map showing project and operational impact
- **Approval Workflow Viewer** — Visual workflow with role names and gates from the selected profile
- **Change Dashboard** — Portfolio view with status, risk score, and timeline
- **Historical Analysis** — Past changes, patterns, AI-detected similarities
- **Scenario Simulator** — Pre-loaded scenarios walking through the full lifecycle in the selected profile
- **Framework Comparison Mode** — Side-by-side view showing how the same change looks in different profiles

### D3 — Repository & CI/CD

- Professional README with architecture diagram and quick-start
- GitHub Actions: lint, test, build, deploy to Vercel
- Structured commit history (conventional commits)

---

## 7. Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                     ChangeFlow Hub                        │
│                  (React + TypeScript)                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              Presentation Layer                      │ │
│  │  Vocabulary, role names, artifact labels, workflow   │ │
│  │  visuals — all driven by the active profile          │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │           Methodological Profile Engine              │ │
│  │  PRINCE2+ITIL │ PMI+ITIL │ Hybrid │ Generic         │ │
│  │  Maps universal concepts → framework-specific terms  │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │         Universal Governance Engine                  │ │
│  │  7-stage lifecycle │ Cross-domain logic │ Risk model │ │
│  │  Audit trail │ Escalation rules │ Metrics            │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │              State Management (Zustand)              │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │           Simulated Data Layer (JSON/TS)             │ │
│  │  Change Records │ Scenarios │ Historical │ Config    │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │       AI Augmentation Layer (optional)               │ │
│  │  Classification │ Similarity │ Risk Scoring          │ │
│  │  (Claude API or rule-based fallback)                 │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Profile engine as a separate layer** — the universal governance logic never changes. The profile engine translates concepts into framework-specific vocabulary. Adding a new profile (e.g., Agile/SAFe) means adding a configuration file, not rewriting business logic.
- **No backend required** — all data is client-side (JSON fixtures + Zustand state). Keeps deployment simple. Data layer is swappable to an API connector for production.
- **AI layer is optional** — every AI feature has a rule-based fallback. The app works without any API key.
- **Configuration-driven** — taxonomy, roles, workflows, scoring weights, and profile mappings are all defined in config files, not hardcoded.

---

## 8. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18 + TypeScript | Type safety, component model, ecosystem |
| Styling | Tailwind CSS | Rapid iteration, consistent design system |
| State | Zustand | Lightweight, no boilerplate, easy to swap later |
| Data | JSON fixtures + TypeScript interfaces | Simulated but strongly typed — ready to swap for API |
| Profile Engine | TypeScript config files | One file per profile, hot-swappable |
| AI (optional) | Claude API (Sonnet) | Classification, similarity, risk scoring |
| AI fallback | Rule-based engine (TypeScript) | Works offline, no API dependency |
| Testing | Vitest + Testing Library | Fast, modern, good developer experience |
| CI/CD | GitHub Actions → Vercel | Automated deploy on push to main |
| Docs | Markdown + Mermaid diagrams | Versionable, renderable on GitHub |

---

## 9. Phases & Milestones

### Phase 1 — Foundation (Weeks 1–2)
- [ ] Repository setup (structure, CI/CD, linting)
- [ ] Methodology docs: universal governance model + framework profiles design
- [ ] Data model design (TypeScript interfaces for all entities)
- [ ] Profile engine: configuration schema and first two profiles (PRINCE2+ITIL, PMI+ITIL)
- [ ] Simulated dataset: 30–50 realistic change records across categories
- [ ] Basic app scaffold with routing and layout

### Phase 2 — Core Application (Weeks 3–5)
- [ ] Profile Selector (switch methodology, UI adapts)
- [ ] Change Request Intake (form + classification logic)
- [ ] Impact Assessment View (dependency visualization)
- [ ] Approval Workflow Viewer (stage-gate visualization, profile-aware)
- [ ] Change Dashboard (portfolio view with filters and risk indicators)
- [ ] Methodology docs: cross-framework equivalences + change taxonomy

### Phase 3 — Intelligence Layer (Weeks 6–7)
- [ ] AI classification engine (Claude API + rule-based fallback)
- [ ] Historical similarity detection
- [ ] Risk scoring model
- [ ] Methodology docs: AI augmentation policy

### Phase 4 — Polish & Scenario Engine (Weeks 8–9)
- [ ] Scenario Simulator (guided walkthroughs per profile)
- [ ] Framework Comparison Mode (side-by-side view)
- [ ] Historical Analysis view
- [ ] Responsive design pass
- [ ] Methodology docs: migration guide

### Phase 5 — Hardening (Week 10)
- [ ] Test coverage (unit + integration)
- [ ] README final version with architecture diagram
- [ ] Performance audit
- [ ] Final deployment + demo recording (optional)

---

## 10. Simulated Data Design Principles

The simulated data must be **structurally identical** to real data, so migration is a data swap, not a redesign.

- **Change types** reflect real IT operations: infrastructure upgrades, application deployments, security patches, configuration changes, network modifications, database migrations
- **Risk levels** follow a universal model (low/medium/high/emergency) with quantified scoring
- **Project context** works with any methodology: stages (PRINCE2), phases (PMI), or generic milestones
- **Dependencies** model realistic cross-system impacts
- **Timelines** follow realistic patterns including approval cycles, change windows, and blackout periods
- **Outcomes** include successes, partial failures, rollbacks, and escalations — not just happy paths
- **Profile awareness** — the same change record can be displayed in any profile's vocabulary

---

## 11. Migration Path (Demo → Real)

| Layer | Demo Mode | Production Mode |
|---|---|---|
| Data | JSON fixtures | REST API / ITSM connector |
| Auth | None (demo) | SSO / LDAP |
| AI | Optional Claude API | Internal LLM or Claude API with organizational data |
| Profile | All profiles available for comparison | Selected profile for the organization |

**Migration steps:**
1. Select your methodological profile
2. Configure organization-specific parameters (role names, approval thresholds, risk criteria)
3. Connect data source (API to ITSM tool, project management tool, or both)
4. Import historical change data (optional, improves AI recommendations)
5. Go live

**What stays the same:** governance lifecycle, workflow logic, taxonomy structure, UI components, audit trail, documentation. The framework is the product. Everything else is pluggable.

---

## 12. Success Criteria

- [ ] A non-technical stakeholder can open the demo, select their methodology, and understand the change lifecycle in under 5 minutes
- [ ] The methodology docs are comprehensive enough to brief a real implementation without the author present
- [ ] The profile system demonstrably shows the same governance logic in different methodological languages
- [ ] The repo demonstrates professional engineering practices (typed code, tests, CI/CD, clean history)
- [ ] The AI augmentation layer works but the app is fully functional without it
- [ ] A potential employer or client visiting the GitHub repo understands both the domain expertise and the technical capability within 60 seconds

---

## 13. Repo Structure

```
changeflow/
├── README.md
├── PROJECT_CHARTER.md
├── docs/
│   ├── governance-model.md
│   ├── framework-profiles.md
│   ├── prince2-itil-mapping.md
│   ├── pmi-itil-mapping.md
│   ├── cross-framework-equivalences.md
│   ├── change-taxonomy.md
│   ├── ai-augmentation-policy.md
│   └── migration-guide.md
├── app/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   ├── data/
│   │   ├── engine/
│   │   ├── profiles/
│   │   ├── ai/
│   │   ├── types/
│   │   └── config/
│   ├── tests/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── .github/
│   └── workflows/
│       └── ci.yml
└── LICENSE
```

---

*ChangeFlow is a framework demonstration project. Simulated data is structurally realistic but does not represent any specific organization.*
