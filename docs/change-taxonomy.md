# Change Taxonomy — Classification Scheme & Decision Tree

> A shared classification system that works across all governance profiles.

---

## Overview

Every change in ChangeFlow is classified along four dimensions:

1. **Type** — How urgently does it need to be processed?
2. **Scope** — What domains does it affect?
3. **Risk** — How much could go wrong?
4. **Category** — What technical area does it touch?

These four dimensions are framework-agnostic. The labels may change per profile, but the underlying classification logic is universal.

---

## Dimension 1: Change Type

| Type | Description | Governance Path |
|---|---|---|
| **Standard** | Pre-approved, low-risk, repeatable. Follows a known procedure. | Abbreviated lifecycle: REQUEST → IMPLEMENT → CLOSE |
| **Normal** | Requires full assessment and approval. The default for most changes. | Full lifecycle: all 7 stages |
| **Emergency** | Cannot wait for the normal lifecycle. Addresses an active or imminent incident. | Compressed lifecycle: REQUEST → CLASSIFY → APPROVE → IMPLEMENT, then retrospective ASSESS + REVIEW within 5 business days |

### Decision Tree: What Type?
```
Is this change pre-approved and following a known procedure?
├── YES → Standard
└── NO
    ├── Is there an active incident or imminent threat requiring immediate action?
    │   ├── YES → Emergency
    │   └── NO → Normal
```

---

## Dimension 2: Change Scope

| Scope | Description | Approval Requirement |
|---|---|---|
| **Project-only** | Affects project deliverables, timeline, or resources. Does not touch live services. | Project approval authority only |
| **Operational-only** | Affects live services, infrastructure, or operational processes. Not tied to a project. | Operational approval authority only |
| **Cross-domain** | Affects both project deliverables AND live services. | Dual approval: both project AND operational authorities must approve |

### Decision Tree: What Scope?
```
Does this change affect any live service, infrastructure, or operational process?
├── YES
│   ├── Does it also affect an active project's deliverables, timeline, or resources?
│   │   ├── YES → Cross-domain
│   │   └── NO → Operational-only
└── NO
    ├── Does it affect an active project?
    │   ├── YES → Project-only
    │   └── NO → Reassess: if it affects neither, does it need governance?
```

**This is the core integration logic.** The scope determination at the CLASSIFY stage is what prevents changes from falling through the gap between project and operational governance.

---

## Dimension 3: Risk Level

| Level | Description | Governance Implications |
|---|---|---|
| **Low** | Minimal impact if something goes wrong. Easy to reverse. | Standard approval path |
| **Medium** | Moderate impact. Reversible but may cause temporary disruption. | Normal approval path with documented rollback plan |
| **High** | Significant impact. Could affect SLAs, timelines, or multiple stakeholders. | Enhanced governance: senior authority review, mandatory rollback plan |
| **Critical** | Severe impact. Could cause major service outage, data loss, or project failure. | Maximum governance: senior authority approval, mandatory rollback plan, dedicated implementation monitoring |

### Risk Assessment Factors

The composite risk score considers:

- **Declared risk level** — The requester's initial assessment (0-45 points)
- **Change scope** — Cross-domain carries more risk than single-domain (0-20 points)
- **Change type** — Emergency changes carry inherent risk from bypassing assessment (0-8 points)
- **Service impact breadth** — More affected services = higher risk (0-15 points)
- **Project impact breadth** — More affected projects = higher risk (0-12 points)

Total score maps to risk level: 0-20 Low, 21-45 Medium, 46-70 High, 71-100 Critical.

---

## Dimension 4: Technical Category

| Category | Description | Examples |
|---|---|---|
| **Infrastructure** | Servers, VMs, storage, cloud resources, hardware | Server migration, capacity upgrade, cloud provisioning |
| **Application** | Software, APIs, features, releases, code changes | New feature deployment, bug fix, API version upgrade |
| **Security** | Access control, encryption, vulnerabilities, compliance | Firewall rule change, certificate renewal, vulnerability patch |
| **Data** | Databases, schemas, migrations, analytics, backups | Schema migration, data warehouse ETL change, backup policy |
| **Network** | DNS, routing, load balancing, VPN, connectivity | DNS update, VLAN reconfiguration, load balancer rule change |
| **Configuration** | Settings, parameters, policies, toggles, thresholds | Feature flag toggle, environment variable change, policy update |

---

## AI-Assisted Classification

ChangeFlow includes a rule-based classification engine that analyzes the title and description of a change request and suggests values for all four dimensions. The engine uses keyword matching with weighted scoring.

Key principles:

- **Suggestions, not decisions.** Every AI suggestion can be accepted or dismissed by the user.
- **Confidence scores.** Each suggestion includes a confidence percentage. Low confidence means the engine found weak signals — the user should verify.
- **Deterministic fallback.** The engine uses keyword rules, not external AI APIs. It works offline, is auditable, and produces consistent results for the same input.
- **Human override always wins.** The user's manual selection overrides any AI suggestion.
