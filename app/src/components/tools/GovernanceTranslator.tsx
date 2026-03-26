import { useState, useRef, useEffect } from 'react';


// =============================================================================
// GOVERNANCE TRANSLATOR
// =============================================================================
// Two modes:
// 1. "Explain" — describe a problem in plain language, get official terms + explanation
// 2. "Translate" — enter a term from one framework, see equivalents in all others
// =============================================================================

// -----------------------------------------------------------------------------
// Knowledge base: all translatable terms with descriptions
// -----------------------------------------------------------------------------

interface TermEntry {
  universal: string;
  prince2: string;
  pmi: string;
  itil: string;
  description: string;
  keywords: string[]; // Plain-language words that map to this concept
}

const termDatabase: TermEntry[] = [
  {
    universal: 'Change Record',
    prince2: 'Issue (Request for Change)',
    pmi: 'Change Request',
    itil: 'Request for Change (RFC)',
    description: 'The formal record of a proposed change. This is the document that travels through the entire governance lifecycle — from request to closure. It captures what the change is, why it\'s needed, and accumulates all assessment, approval, and review data.',
    keywords: ['change', 'request', 'proposal', 'RFC', 'issue', 'ticket', 'ask for a change', 'want to change', 'need to modify', 'something needs changing'],
  },
  {
    universal: 'Project Approval Authority',
    prince2: 'Change Authority (Project Board)',
    pmi: 'Change Control Board (CCB)',
    itil: 'N/A (project-side role)',
    description: 'The person or group with authority to approve changes that affect the project. In some organizations the Project Manager has delegated authority for low-impact changes; bigger changes go to the board/committee.',
    keywords: ['who approves', 'approval', 'authorize', 'sign off', 'permission', 'who decides', 'board', 'committee', 'CCB', 'change authority'],
  },
  {
    universal: 'Operational Approval Authority',
    prince2: 'N/A (operations-side role)',
    pmi: 'N/A (operations-side role)',
    itil: 'Change Advisory Board (CAB)',
    description: 'The body that authorizes changes affecting live services and infrastructure. They assess operational risk, coordinate change windows, and ensure changes don\'t break running systems.',
    keywords: ['CAB', 'advisory board', 'operations approval', 'who approves infra', 'service change approval'],
  },
  {
    universal: 'Threshold Breach',
    prince2: 'Exception',
    pmi: 'Variance Beyond Threshold',
    itil: 'N/A (project-side concept)',
    description: 'When a change causes the project to exceed its agreed boundaries (budget, time, scope, risk, quality). This triggers an escalation — the project manager can\'t approve this alone, it needs to go to senior authority. It means "we\'re outside the safe zone and need a decision from above."',
    keywords: ['exception', 'exceeded', 'over budget', 'over time', 'out of scope', 'too risky', 'variance', 'breach', 'tolerance', 'off track', 'beyond limits', 'escalate', 'outside boundaries'],
  },
  {
    universal: 'Standard Change',
    prince2: 'Within PM delegated tolerance',
    pmi: 'Pre-approved in Change Management Plan',
    itil: 'Standard Change',
    description: 'A low-risk, repeatable change that has been done before and has a known procedure. It\'s pre-authorized — meaning it doesn\'t need to go through the full approval process every time. Examples: routine security patches, scheduled backups, standard user account creation.',
    keywords: ['routine', 'pre-approved', 'standard', 'repeatable', 'automatic', 'always done this way', 'low risk change', 'patch', 'regular maintenance'],
  },
  {
    universal: 'Normal Change',
    prince2: 'Issue Report → Change Authority',
    pmi: 'Change Request → CCB',
    itil: 'Normal Change → CAB',
    description: 'The default type for most changes. It needs to be assessed for impact and formally approved before implementation. Not urgent enough to skip the process, not routine enough to be pre-approved.',
    keywords: ['normal', 'regular change', 'needs approval', 'typical change', 'standard process'],
  },
  {
    universal: 'Emergency Change',
    prince2: 'Exception → Project Board',
    pmi: 'Expedited CCB Review',
    itil: 'Emergency Change → ECAB',
    description: 'A change that must be implemented urgently — typically because of a critical incident, security breach, or imminent service failure. It follows a compressed approval path (fewer people, faster decision) but requires a full retrospective review afterwards to make sure everything was done properly.',
    keywords: ['emergency', 'urgent', 'critical', 'immediately', 'P1', 'incident', 'security breach', 'can\'t wait', 'needs to happen now', 'crisis', 'ECAB'],
  },
  {
    universal: 'Cross-domain Change',
    prince2: 'Issue affecting both project and operations',
    pmi: 'Change impacting both project and service baselines',
    itil: 'RFC with project dependencies',
    description: 'A change that affects both the project world and the operations world. For example: a project needs to deploy a new database schema (project change) that also affects a live service (operational change). These are the most governance-intensive changes because BOTH approval authorities need to sign off.',
    keywords: ['affects both', 'project and operations', 'cross', 'dual approval', 'impacts services and project', 'deployment from project', 'goes to production'],
  },
  {
    universal: 'Impact Assessment',
    prince2: 'Issue Report / Impact Analysis',
    pmi: 'Impact Analysis (Scope, Schedule, Cost, Quality)',
    itil: 'Change Impact Assessment',
    description: 'The analysis of what a change will affect. On the project side: does it change the plan, timeline, budget, or business case? On the operations side: which services are affected, is there downtime, does it risk SLAs? For cross-domain changes, both assessments happen in parallel.',
    keywords: ['impact', 'analysis', 'assessment', 'what does it affect', 'consequences', 'risk assessment', 'evaluate', 'how bad is it', 'what breaks'],
  },
  {
    universal: 'Post-Change Review',
    prince2: 'Lessons Learned (Lessons Log)',
    pmi: 'Lessons Learned (Close Project or Phase)',
    itil: 'Post-Implementation Review (PIR)',
    description: 'After a change is implemented, this review checks: did it work? Were there surprises? What can we learn? In ChangeFlow, the project review (lessons learned) and the operational review (PIR) are merged into a single activity so nothing falls through the cracks.',
    keywords: ['review', 'lessons', 'PIR', 'post implementation', 'what went wrong', 'what went right', 'retrospective', 'after action', 'debrief', 'learn from'],
  },
  {
    universal: 'Change Register',
    prince2: 'Issue Register',
    pmi: 'Change Log',
    itil: 'Change Schedule',
    description: 'The master list of all changes. Every change that enters the system gets an entry here. It tracks the status of each change through the lifecycle. In PRINCE2 it\'s called the Issue Register, in PMI it\'s the Change Log, and in ITIL it\'s the Change Schedule (which also includes the forward timeline of planned changes).',
    keywords: ['register', 'log', 'list', 'schedule', 'all changes', 'master list', 'tracker', 'where are all the changes'],
  },
  {
    universal: 'Change Coordinator',
    prince2: 'Project Support',
    pmi: 'PMO / Change Controller',
    itil: 'Change Manager',
    description: 'The person or function that keeps the change governance process running smoothly. They route changes to the right assessors, ensure cross-domain changes are flagged, track deadlines, maintain the audit trail, and escalate when things get stuck. In practice, this role often sits in the PMO.',
    keywords: ['coordinator', 'PMO', 'change manager', 'project support', 'who tracks', 'who manages the process', 'facilitator'],
  },
  {
    universal: 'Back-out Plan',
    prince2: 'Exception Plan (rollback component)',
    pmi: 'Contingency / Rollback Plan',
    itil: 'Remediation Plan',
    description: 'The plan for what to do if the change goes wrong. How do we reverse it? How long will that take? What\'s the impact of rolling back? This is mandatory for any change that affects live services — you never deploy without knowing how to undo it.',
    keywords: ['rollback', 'back out', 'undo', 'reverse', 'what if it fails', 'contingency', 'remediation', 'plan B', 'recovery'],
  },
  {
    universal: 'Phase Boundary',
    prince2: 'Stage Gate (End Stage Assessment)',
    pmi: 'Phase Gate / Milestone Review',
    itil: 'N/A (project-side concept)',
    description: 'A formal checkpoint between phases/stages of a project where progress is reviewed, the next phase is planned, and a go/no-go decision is made. In ChangeFlow, the boundary review includes a summary of all changes processed during that phase and their impact on the next one.',
    keywords: ['stage gate', 'phase gate', 'milestone', 'checkpoint', 'end of phase', 'end of stage', 'review point', 'go no go'],
  },
  {
    universal: 'Business Justification',
    prince2: 'Business Case',
    pmi: 'Business Case / Benefits Management Plan',
    itil: 'Service Value',
    description: 'The reason why a project (or change) exists — what value does it deliver, what problem does it solve, and is it still worth doing? Changes that affect the business justification are serious because they might mean the project is no longer worth the investment.',
    keywords: ['business case', 'justification', 'why are we doing this', 'value', 'ROI', 'worth it', 'benefits', 'cost benefit'],
  },
  {
    universal: 'Configuration Records',
    prince2: 'Configuration Item Records',
    pmi: 'Organizational Process Assets (OPA)',
    itil: 'CMDB (Configuration Management Database)',
    description: 'The record of what your IT environment actually looks like — what systems exist, how they\'re configured, what depends on what. When a change is implemented, these records must be updated to reflect the new reality. The CMDB (ITIL term) is the most common implementation.',
    keywords: ['CMDB', 'configuration', 'what do we have', 'inventory', 'assets', 'dependencies', 'infrastructure map', 'CI records'],
  },
  {
    universal: 'Risk Register',
    prince2: 'Risk Register',
    pmi: 'Risk Register',
    itil: 'Risk Assessment (per RFC)',
    description: 'A log of identified risks — things that might go wrong. In the context of change governance, each change assessment identifies risks, and significant ones get added to the project\'s risk register. All three frameworks use the same term here (a rare moment of agreement).',
    keywords: ['risk', 'risk register', 'what could go wrong', 'threats', 'dangers', 'risk log'],
  },
  {
    universal: 'Escalation Report',
    prince2: 'Exception Report',
    pmi: 'Variance Report / Escalation to Sponsor',
    itil: 'N/A (handled within Change Enablement)',
    description: 'When a change triggers a threshold breach — meaning the project is going beyond its agreed boundaries — this report goes to senior authority explaining the situation, the options, and the recommendation. It\'s the formal "we need a decision from above" document.',
    keywords: ['escalation', 'exception report', 'variance report', 'need senior decision', 'above my authority', 'out of my hands'],
  },
];

// -----------------------------------------------------------------------------
// Search logic
// -----------------------------------------------------------------------------

function searchTerms(query: string): TermEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return termDatabase
    .map((term) => {
      let score = 0;

      // Direct match on any framework term
      if (term.universal.toLowerCase().includes(q)) score += 10;
      if (term.prince2.toLowerCase().includes(q)) score += 10;
      if (term.pmi.toLowerCase().includes(q)) score += 10;
      if (term.itil.toLowerCase().includes(q)) score += 10;

      // Keyword match (plain language)
      for (const kw of term.keywords) {
        if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) {
          score += 5;
        }
      }

      // Partial word matching
      const words = q.split(/\s+/);
      for (const word of words) {
        if (word.length < 2) continue;
        if (term.description.toLowerCase().includes(word)) score += 2;
        for (const kw of term.keywords) {
          if (kw.toLowerCase().includes(word)) score += 3;
        }
      }

      return { term, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.term);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

type TranslatorMode = 'explain' | 'translate';

export default function GovernanceTranslator() {
  const [mode, setMode] = useState<TranslatorMode>('explain');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TermEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchTerms(query));
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const frameworkBadge = (framework: string, term: string) => {
    const colors: Record<string, string> = {
      'PRINCE2': 'bg-blue-100 text-blue-800 border-blue-200',
      'PMI': 'bg-amber-100 text-amber-800 border-amber-200',
      'ITIL': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Universal': 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
      <div className="flex items-start gap-2 py-1.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border shrink-0 ${colors[framework] || colors['Universal']}`}
        >
          {framework}
        </span>
        <span className="text-sm text-gray-700">{term}</span>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2 z-50"
        title="Governance Translator (Ctrl+K)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8l6 6" />
          <path d="M4 14l6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="M22 22l-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
        <span className="text-sm font-medium">Translator</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs bg-slate-700 rounded">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Governance Translator</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 text-sm"
            >
              ESC
            </button>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => { setMode('explain'); setQuery(''); }}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'explain'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🗣️ Explain in plain language
            </button>
            <button
              onClick={() => { setMode('translate'); setQuery(''); }}
              className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === 'translate'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔄 Translate a term
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="px-4 py-3 border-b border-gray-100">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'explain'
                ? 'Describe your situation... e.g. "the project went over budget and someone needs to decide"'
                : 'Type a term... e.g. "Exception", "CCB", "RFC", "PIR"'
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-gray-400"
          />
          {mode === 'explain' && (
            <p className="mt-1.5 text-xs text-gray-400">
              Describe a problem or situation in your own words — I'll map it to official framework terminology.
            </p>
          )}
          {mode === 'translate' && (
            <p className="mt-1.5 text-xs text-gray-400">
              Enter a term from any framework — I'll show you what it's called in all others.
            </p>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {results.length === 0 && query.length >= 2 && (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              No matching terms found. Try different words.
            </div>
          )}

          {results.map((term, i) => (
            <div
              key={i}
              className={`px-4 py-4 ${i > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}
            >
              {/* Universal concept name */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base font-semibold text-gray-900">
                  {term.universal}
                </span>
              </div>

              {/* Framework equivalents */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-3">
                {frameworkBadge('PRINCE2', term.prince2)}
                {frameworkBadge('PMI', term.pmi)}
                {frameworkBadge('ITIL', term.itil)}
              </div>

              {/* Description (always shown in explain mode, collapsible in translate mode) */}
              {mode === 'explain' ? (
                <p className="text-sm text-gray-600 leading-relaxed mt-2">
                  {term.description}
                </p>
              ) : (
                <details className="mt-1">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    What is this?
                  </summary>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1.5">
                    {term.description}
                  </p>
                </details>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {results.length === 0 && query.length < 2 && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              {mode === 'explain'
                ? 'Try: "who approves changes", "what if we go over budget", "how to undo a deployment"'
                : 'Try: "Exception", "CAB", "Change Log", "PIR", "CCB", "RFC"'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(mode === 'explain'
                ? ['who approves', 'over budget', 'rollback', 'emergency', 'lessons learned']
                : ['Exception', 'CAB', 'CCB', 'RFC', 'PIR', 'CMDB']
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-2.5 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
