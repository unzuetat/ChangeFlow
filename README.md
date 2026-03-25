# ChangeFlow

**Configurable Change Governance Framework for Multi-Methodology IT Environments**

Supporting PRINCE2, PMI/PMBOK, and ITIL 4 — individually or combined.

[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=github-actions&logoColor=white)](#)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](#)

---

## The Problem

Organizations running both a project methodology (PRINCE2, PMI/PMBOK) and an operations methodology (ITIL) manage changes through two parallel, disconnected processes. Project changes affect live services without Operations knowing. Operational changes break project timelines without the PM knowing. And governance tools built for one framework can't be reused by teams using another.

This gap is especially dangerous in regulated and semi-public environments, where auditability isn't optional.

## What ChangeFlow Does

ChangeFlow is a **universal change governance framework** with a configurable methodology layer. The core engine handles the governance logic — lifecycle, classification, cross-domain routing, approval workflows, audit trail. On top of that, a **profile system** adapts the vocabulary, roles, and artifacts to your organization's chosen methodology.

**Select your profile. The governance adapts.**

| Profile | You'll see... |
|---|---|
| PRINCE2 + ITIL | Change Authority, Issue Register, Stage tolerances, Exceptions, CAB |
| PMI/PMBOK + ITIL | CCB, Change Log, Variance thresholds, Integrated Change Control, CAB |
| Hybrid | Mixed terminology from both project methodologies |
| Framework-agnostic | Generic terms — for organizations building their own approach |

### Core Capabilities (all profiles)

- **Single intake, dual processing** — every change enters once and is routed by scope (project / operational / cross-domain)
- **Cross-domain dependency awareness** — project changes assessed for operational impact and vice versa, as a mandatory gate
- **Dual approval for cross-domain changes** — both project and operational authorities must approve
- **Unified post-change review** — merging project lessons and operational PIR into one activity
- **AI augmentation (optional)** — classification suggestions, impact prediction, pattern detection. Always as recommendation, never as decision. Full rule-based fallback.

## Live Demo

🔗 **[changeflow.vercel.app](#)** *(coming soon)*

The demo runs with simulated data. No real organizational data is used. Switch between methodological profiles to see the same governance logic in different frameworks' language.

## Architecture

```
┌───────────────────────────────────────────────────────┐
│                   ChangeFlow Hub                       │
│                (React + TypeScript)                    │
├───────────────────────────────────────────────────────┤
│  Presentation Layer (profile-driven vocabulary)        │
├───────────────────────────────────────────────────────┤
│  Profile Engine                                        │
│  PRINCE2+ITIL │ PMI+ITIL │ Hybrid │ Generic           │
├───────────────────────────────────────────────────────┤
│  Universal Governance Engine                           │
│  7-stage lifecycle │ Cross-domain logic │ Risk model   │
├───────────────────────────────────────────────────────┤
│  Zustand State │ Simulated Data (JSON/TS)             │
├───────────────────────────────────────────────────────┤
│  AI Layer (optional — Claude API + rule-based fallback)│
└───────────────────────────────────────────────────────┘
```

**Key design decisions:**

- **Profile engine as a separate layer** — governance logic never changes. Adding a new methodology (e.g., Agile/SAFe) means adding a config file, not rewriting logic.
- **No backend** — client-side data, deployable to Vercel. Data layer is swappable to REST API for production.
- **AI is optional** — every feature has a deterministic fallback. Works without any API key.
- **Configuration-driven** — taxonomy, roles, workflows, and scoring are config files, not hardcoded.

## Documentation

The methodology documentation is the intellectual core of this project.

| Document | Description |
|---|---|
| [Governance Model](./docs/governance-model.md) | Universal change lifecycle — framework-agnostic, 7 stages, cross-domain integration |
| [Cross-Framework Equivalences](./docs/cross-framework-equivalences.md) | Three-way mapping: PRINCE2 ↔ PMI/PMBOK ↔ ITIL 4 for all change concepts |
| [Framework Profiles](./docs/framework-profiles.md) | Profile system design, configuration reference, how to add new profiles |
| [PRINCE2+ITIL Mapping](./docs/prince2-itil-mapping.md) | Detailed mapping for the PRINCE2+ITIL profile |
| [PMI+ITIL Mapping](./docs/pmi-itil-mapping.md) | Detailed mapping for the PMI+ITIL profile |
| [Change Taxonomy](./docs/change-taxonomy.md) | Shared classification scheme with decision tree |
| [AI Augmentation Policy](./docs/ai-augmentation-policy.md) | Where AI helps, where it doesn't, governance guardrails |
| [Migration Guide](./docs/migration-guide.md) | Demo → production: profile selection, data connection, go-live |

## Quick Start

```bash
# Clone
git clone https://github.com/unzuetat/changeflow.git
cd changeflow/app

# Install
npm install

# Run locally
npm run dev

# Run tests
npm run test

# Build
npm run build
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Data | JSON fixtures (typed — API-swappable) |
| Profiles | TypeScript config (one file per methodology) |
| AI (optional) | Claude API (Sonnet) + rule-based fallback |
| Testing | Vitest + Testing Library |
| CI/CD | GitHub Actions → Vercel |
| Docs | Markdown + Mermaid |

## Project Status

| Phase | Status |
|---|---|
| Phase 1 — Foundation (repo, docs, data model, profiles) | 🟡 In Progress |
| Phase 2 — Core Application (intake, assessment, workflow, dashboard) | ⬜ Planned |
| Phase 3 — Intelligence Layer (AI classification, similarity, risk scoring) | ⬜ Planned |
| Phase 4 — Scenario Engine & Polish | ⬜ Planned |
| Phase 5 — Hardening (tests, CI/CD, performance) | ⬜ Planned |

See [PROJECT_CHARTER.md](./PROJECT_CHARTER.md) for full timeline and deliverables.

## Why This Exists

Most governance tools and frameworks assume you've picked one methodology and you're sticking with it. Reality is messier: organizations use PRINCE2 for some projects and PMI for others, ITIL runs underneath everything, and the gap between project change control and operational change management is where things break.

ChangeFlow demonstrates that the governance logic is the same across methodologies — only the vocabulary differs. By abstracting the engine from the labels, it creates a framework that's genuinely reusable across organizations, regardless of their methodological choices.

The AI layer shows how augmentation fits *within* governance — supporting human decisions, not replacing them — which is exactly the challenge organizations face as they adopt AI tools.

---

## License

MIT

## Author

Built by [Unzuetat](https://github.com/unzuetat) — IT Project Manager & PMO (PMP®, PRINCE2®) exploring the intersection of multi-methodology governance and AI augmentation.
