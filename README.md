# ChangeFlow

**Configurable Change Governance Framework for Multi-Methodology IT Environments**

ChangeFlow bridges the gap between project change management and operational change management. Organizations running both a project methodology (PRINCE2, PMI/PMBOK, or SAFe) and an operations methodology (ITIL) manage changes through two disconnected processes. Project changes affect live services without Operations knowing. Operational changes break project timelines without the PM knowing. ChangeFlow solves this with a unified governance engine that adapts its vocabulary to your methodology.

**[Live Demo →](https://changeflow.vercel.app)**

---

## The Problem

In most IT organizations, two parallel change processes exist:

- **Project side:** Changes governed by PRINCE2 (Issues, Change Authority, Exception Reports) or PMI (Change Requests, CCB, Variance Reports) or SAFe (Backlog Items, RTE, Impediment Escalation)
- **Operations side:** Changes governed by ITIL 4 (RFCs, CAB, PIR)

These processes don't talk to each other. A project team deploys a database migration without telling Operations. An operations team retires an API that a project depends on. The gap between these two worlds is where governance breaks down.

## The Solution

ChangeFlow provides a **universal governance engine** with a **configurable profile layer**:

- **One lifecycle** — 7 stages that every change follows: Request → Classify → Assess → Approve → Implement → Review → Close
- **One entry point** — Every change enters once. The system determines if it needs project governance, operational governance, or both
- **Cross-domain detection** — At classification, the system checks whether a change affects live services (if from a project) or active projects (if from operations)
- **Dual approval** — Cross-domain changes require approval from both project and operational authorities. Neither overrides the other
- **Your vocabulary** — Select your profile and the entire system adapts its terminology, roles, and artifacts

---

## Profiles

| Profile | Project Side | Operations Side | Best For |
|---|---|---|---|
| **PRINCE2 + ITIL 4** | PRINCE2 | ITIL 4 | European orgs, public sector, regulated |
| **PMI/PMBOK + ITIL 4** | PMI/PMBOK | ITIL 4 | Global, private sector, PMI-certified |
| **SAFe/Agile + ITIL 4** | SAFe / Agile | ITIL 4 | Orgs transitioning to agile delivery |
| **Hybrid** | PRINCE2 + PMI mix | ITIL 4 | Mixed methodology environments |
| **Framework-Agnostic** | Generic | Generic | Orgs building their own approach |

---

## Features

### Governance Engine
- **Single intake, dual processing** — every change enters once and is routed by scope
- **Cross-domain dependency awareness** — project changes assessed for operational impact and vice versa
- **Dual approval for cross-domain changes** — both authorities must approve
- **Emergency path** — compressed lifecycle with retrospective assessment within 5 business days
- **Threshold breach escalation** — automatic escalation when changes push projects beyond boundaries
- **Unified post-change review** — merging project lessons and operational PIR into one activity

### Intelligence Layer
- **AI Classification** — Rule-based engine analyzes change titles and descriptions, suggests type, risk, category, and scope with confidence scores. Every suggestion can be accepted or dismissed.
- **Composite Risk Scoring** — Calculates a 0-100 risk score from multiple factors: declared risk, scope, type, service breadth, project breadth. Includes visual breakdown of each factor.
- **Similarity Detection** — Compares changes against the full register using text similarity, category matching, and service overlap. Highlights rejected similar changes as warnings.

### Tools
- **Governance Translator** — Describe a problem in plain language, get official terms in PRINCE2, PMI, and ITIL. Or enter a framework term and see equivalents across all methodologies. 18 concepts mapped with fuzzy search.
- **Framework Comparison Mode** — Side-by-side comparison of vocabulary, roles, artifacts, and escalation models across all profiles. Differences highlighted automatically.
- **Scenario Simulator** — Walk through pre-built governance scenarios step by step: cross-domain database migration, emergency security patch, rejected change. All terminology adapts to your active profile.

### Application
- **Dashboard** — Portfolio overview with governance metrics, change list, and lifecycle visualization
- **Change Register** — Filterable table with search, expandable detail view, integrated risk scoring and similarity detection
- **Intake Form** — Profile-aware form with contextual alerts for cross-domain, emergency, and high-risk changes
- **Workflow Viewer** — Visual 7-stage lifecycle with stage detail, special paths (cross-domain, emergency, threshold breach)
- **Settings** — Complete profile inspector showing vocabulary, roles, artifacts, and escalation mappings
- **Responsive design** — Works on desktop, tablet, and mobile

---

## Architecture
```
┌─────────────────────────────────────────────┐
│            Presentation Layer                │
│  React 18 + TypeScript + Tailwind CSS       │
│  (vocabulary driven by active profile)       │
├─────────────────────────────────────────────┤
│         Profile Engine                       │
│  PRINCE2+ITIL │ PMI+ITIL │ SAFe+ITIL       │
│  Hybrid │ Generic                            │
├─────────────────────────────────────────────┤
│       Universal Governance Engine            │
│  7-stage lifecycle │ Cross-domain logic      │
├─────────────────────────────────────────────┤
│       Intelligence Layer                     │
│  Classification │ Risk Scoring │ Similarity  │
├─────────────────────────────────────────────┤
│  Zustand State │ Simulated Data (JSON/TS)   │
└─────────────────────────────────────────────┘
```

**Key design decisions:**
- Profile engine is a separate layer — governance logic never changes, only labels
- No backend — client-side data, deployable to Vercel
- AI is optional — every AI feature has a deterministic rule-based fallback
- Configuration-driven — taxonomy, roles, workflows are config files, not hardcoded
- Three-layer separation — engine (keep), profiles (customize), data (replace)

---

## Quick Start
```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To run tests:
```bash
npm test
```

---

## Documentation

| Document | Description |
|---|---|
| [Governance Model](docs/governance-model.md) | Universal 7-stage lifecycle, framework-agnostic core |
| [Framework Profiles](docs/framework-profiles.md) | How the profile system works, adding custom profiles |
| [PRINCE2+ITIL Mapping](docs/prince2-itil-mapping.md) | Detailed mapping for PRINCE2+ITIL profile |
| [PMI+ITIL Mapping](docs/pmi-itil-mapping.md) | Detailed mapping for PMI+ITIL profile |
| [Cross-Framework Equivalences](docs/cross-framework-equivalences.md) | Three-way Rosetta Stone: PRINCE2 ↔ PMI ↔ ITIL |
| [Change Taxonomy](docs/change-taxonomy.md) | Classification scheme with decision trees |
| [AI Augmentation Policy](docs/ai-augmentation-policy.md) | AI governance guardrails |
| [Migration Guide](docs/migration-guide.md) | How to go from demo to real implementation |

---

## Project Structure
```
changeflow/
├── docs/                          # Methodology documentation
│   ├── governance-model.md
│   ├── framework-profiles.md
│   ├── prince2-itil-mapping.md
│   ├── pmi-itil-mapping.md
│   ├── cross-framework-equivalences.md
│   ├── change-taxonomy.md
│   ├── ai-augmentation-policy.md
│   └── migration-guide.md
├── app/                           # React application
│   ├── src/
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── profiles/              # Methodology profile configurations
│   │   ├── engine/                # Intelligence layer
│   │   │   ├── similarity.ts      # Similarity detection
│   │   │   ├── risk-scoring.ts    # Composite risk scoring
│   │   │   ├── classification.ts  # AI classification
│   │   │   └── __tests__/         # Unit tests
│   │   ├── data/                  # Simulated data
│   │   ├── store/                 # Zustand state management
│   │   ├── components/            # Reusable components
│   │   │   ├── layout/            # Sidebar, Header
│   │   │   ├── tools/             # Governance Translator
│   │   │   └── intelligence/      # AI panels
│   │   └── views/                 # Page views
│   └── public/                    # Static assets
├── .github/workflows/ci.yml      # CI/CD pipeline
└── README.md
```

---

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Tailwind CSS** — Styling
- **Zustand** — State management
- **Vite** — Build tool
- **Vitest** — Testing
- **Lucide React** — Icons
- **GitHub Actions** — CI/CD
- **Vercel** — Hosting

---

## Author

Built by [Unzuetat](https://github.com/unzuetat) — IT Project Manager & PMO (PMP®, PRINCE2®) exploring the intersection of multi-methodology governance and AI augmentation.

---

## License

This project is shared as a professional portfolio piece and governance reference framework. See repository for details.
