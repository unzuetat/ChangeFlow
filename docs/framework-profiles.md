# Framework Profiles — Configuration Reference

> How ChangeFlow adapts to your organization's methodology.

---

## What is a Profile?

A **profile** is a configuration layer that maps ChangeFlow's universal governance engine to the specific vocabulary, roles, and artifacts of your organization's chosen methodologies.

The governance logic — the 7-stage lifecycle, cross-domain detection, dual approval, threshold breach escalation — **never changes**. What changes is how it's **labeled**.

Think of it like a language pack: the machine works the same way, but the buttons are labeled in your language.

---

## Available Profiles

### PRINCE2 + ITIL 4

- **ID:** `prince2-itil`
- **Project methodology:** PRINCE2
- **Operations methodology:** ITIL 4
- **Best for:** European organizations, public sector, regulated environments, AXELOS-certified teams
- **Key characteristics:** Issue-based change tracking, Stage Gate boundaries, Exception-based escalation, Change Authority model

### PMI/PMBOK + ITIL 4

- **ID:** `pmi-itil`
- **Project methodology:** PMI/PMBOK
- **Operations methodology:** ITIL 4
- **Best for:** Global organizations, private sector, PMI-certified environments
- **Key characteristics:** Change Request model, Phase Gate boundaries, Variance-based escalation, CCB approval structure

### SAFe / Agile + ITIL 4

- **ID:** `safe-itil`
- **Project methodology:** SAFe / Agile
- **Operations methodology:** ITIL 4
- **Best for:** Organizations transitioning to agile delivery while maintaining operational governance
- **Key characteristics:** Backlog-driven change capture, PI Boundaries, Impediment escalation, RTE coordination, Lean Business Case justification

### Hybrid (PRINCE2 + PMI + ITIL)

- **ID:** `hybrid`
- **Project methodology:** PRINCE2 / PMI Hybrid
- **Operations methodology:** ITIL 4
- **Best for:** Organizations using a mix of PRINCE2 and PMI practices
- **Key characteristics:** Uses the most commonly recognized term from either framework

### Framework-Agnostic

- **ID:** `generic`
- **Project methodology:** Generic
- **Operations methodology:** Generic
- **Best for:** Organizations building their own methodology or not formally aligned to any standard
- **Key characteristics:** Plain-language terms, no framework-specific jargon

---

## Architecture: Three-Layer Separation
```
Layer 1: Universal Governance Engine (never changes)
         7-stage lifecycle, cross-domain logic, dual approval, escalation

Layer 2: Profile Configuration (swappable)
         Vocabulary, roles, artifacts, escalation terms

Layer 3: Data (swappable)
         Change records, projects, services, people
```

Migrating from demo to production means replacing Layers 2 and 3. Layer 1 stays intact.

---

## Profile Structure

Each profile implements the `MethodologicalProfile` interface:

- **vocabulary** — Maps universal stage names, change types, scope labels, and key concepts to framework-specific terms
- **roles** — Maps universal governance roles (approval authority, assessor, coordinator) to framework-specific role names
- **artifacts** — Maps universal document names (change record, impact assessment, escalation report) to framework-specific artifact names
- **escalation** — Defines how threshold breaches are named, processed, reported, and resolved

---

## Adding a New Profile

1. Create a new file in `app/src/profiles/` (e.g., `my-custom-profile.ts`)
2. Implement the `MethodologicalProfile` interface with your organization's vocabulary
3. Add the profile ID to the `ProfileId` type in `app/src/types/profile.ts`
4. Register it in `app/src/profiles/index.ts`
5. The entire application automatically adapts to the new profile

No code changes to the governance engine are needed. No UI changes. The profile system handles everything.

---

## Customization Points

| What you can customize | Where it lives |
|---|---|
| Stage names | `vocabulary.stageRequest` through `vocabulary.stageClose` |
| Change type labels | `vocabulary.standardChange`, `normalChange`, `emergencyChange` |
| Scope labels | `vocabulary.projectOnly`, `operationalOnly`, `crossDomain` |
| Role names | `roles.*` (9 configurable roles) |
| Artifact names | `artifacts.*` (10 configurable artifacts) |
| Escalation terminology | `escalation.*` (term, process, report, authority, outcomes) |
| Business justification label | `vocabulary.businessJustification` |
| Post-change review label | `vocabulary.postChangeReview` |
