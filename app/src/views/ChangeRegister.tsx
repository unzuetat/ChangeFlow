import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { changes as seedChanges } from '../data/seed';
import { ChangeRecord, ChangeStatus, RiskLevel, ChangeScope, ChangeType } from '../types';
import SimilarityPanel from '../components/intelligence/SimilarityPanel';
import {
  ArrowRightLeft,
  Shield,
  FileText,
  Zap,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const stageColorMap: Record<string, string> = {
  draft:              'bg-gray-100 text-gray-600',
  submitted:          'bg-gray-200 text-gray-700',
  classified:         'bg-purple-100 text-purple-700',
  assessing:          'bg-orange-100 text-orange-700',
  assessed:           'bg-orange-50 text-orange-600',
  'pending-approval': 'bg-teal-100 text-teal-700',
  approved:           'bg-blue-100 text-blue-700',
  'approved-with-conditions': 'bg-blue-50 text-blue-600',
  rejected:           'bg-red-100 text-red-700',
  deferred:           'bg-yellow-100 text-yellow-700',
  implementing:       'bg-indigo-100 text-indigo-700',
  implemented:        'bg-green-100 text-green-700',
  'in-review':        'bg-green-50 text-green-600',
  closed:             'bg-gray-100 text-gray-500',
};

const riskColorMap: Record<string, string> = {
  low:      'bg-green-100 text-green-800',
  medium:   'bg-yellow-100 text-yellow-800',
  high:     'bg-red-100 text-red-700',
  critical: 'bg-red-200 text-red-900',
};

const scopeColorMap: Record<string, string> = {
  'project-only':     'bg-indigo-50 text-indigo-700',
  'operational-only': 'bg-emerald-50 text-emerald-700',
  'cross-domain':     'bg-pink-50 text-pink-700',
};

const scopeIcons: Record<string, typeof ArrowRightLeft> = {
  'project-only':     FileText,
  'operational-only': Shield,
  'cross-domain':     ArrowRightLeft,
};

const typeIcons: Record<string, typeof Zap> = {
  standard:  Shield,
  normal:    FileText,
  emergency: Zap,
};

type SortField = 'id' | 'risk' | 'status' | 'requestDate';
type SortDir = 'asc' | 'desc';

const riskOrder: Record<string, number> = { low: 0, medium: 1, high: 2, critical: 3 };

export default function ChangeRegister() {
  const { changes, setChanges, activeProfile } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (changes.length === 0) {
      setChanges(seedChanges);
    }
  }, []);

  const vocab = activeProfile.vocabulary;

  // Filter
  let filtered = changes.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !c.id.toLowerCase().includes(q) &&
        !c.title.toLowerCase().includes(q) &&
        !c.description.toLowerCase().includes(q)
      )
        return false;
    }
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterRisk !== 'all' && c.risk !== filterRisk) return false;
    if (filterScope !== 'all' && c.scope !== filterScope) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'id') cmp = a.id.localeCompare(b.id);
    else if (sortField === 'risk') cmp = riskOrder[a.risk] - riskOrder[b.risk];
    else if (sortField === 'status') cmp = a.status.localeCompare(b.status);
    else if (sortField === 'requestDate') cmp = a.requestDate.localeCompare(b.requestDate);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="inline ml-0.5" />
    ) : (
      <ChevronDown size={12} className="inline ml-0.5" />
    );
  };

  const uniqueStatuses = [...new Set(changes.map((c) => c.status))];

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, title, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cf-300 focus:border-cf-300"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Filter size={12} />
            <span>{filtered.length} of {changes.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cf-300"
          >
            <option value="all">All statuses</option>
            {uniqueStatuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/-/g, ' ')}
              </option>
            ))}
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cf-300"
          >
            <option value="all">All risk levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cf-300"
          >
            <option value="all">All scopes</option>
            <option value="project-only">{vocab.projectOnly}</option>
            <option value="operational-only">{vocab.operationalOnly}</option>
            <option value="cross-domain">{vocab.crossDomain}</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-cf-300"
          >
            <option value="all">All types</option>
            <option value="standard">{vocab.standardChange}</option>
            <option value="normal">{vocab.normalChange}</option>
            <option value="emergency">{vocab.emergencyChange}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[4.5rem_1fr_6rem_6rem_7rem_6.5rem] gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => toggleSort('id')}
            className="text-[11px] font-semibold text-gray-500 uppercase text-left hover:text-gray-700"
          >
            ID <SortIcon field="id" />
          </button>
          <span className="text-[11px] font-semibold text-gray-500 uppercase">
            Title
          </span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase text-center">
            Type
          </span>
          <button
            onClick={() => toggleSort('risk')}
            className="text-[11px] font-semibold text-gray-500 uppercase text-center hover:text-gray-700"
          >
            Risk <SortIcon field="risk" />
          </button>
          <span className="text-[11px] font-semibold text-gray-500 uppercase text-center">
            Scope
          </span>
          <button
            onClick={() => toggleSort('status')}
            className="text-[11px] font-semibold text-gray-500 uppercase text-center hover:text-gray-700"
          >
            Status <SortIcon field="status" />
          </button>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No changes match the current filters.
          </div>
        ) : (
          filtered.map((change) => {
            const ScopeIcon = scopeIcons[change.scope] || FileText;
            const TypeIcon = typeIcons[change.type] || FileText;
            const isExpanded = expandedId === change.id;

            return (
              <div key={change.id} className="border-b border-gray-50 last:border-0">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : change.id)}
                  className="grid grid-cols-[4.5rem_1fr_6rem_6rem_7rem_6.5rem] gap-2 px-4 py-3 items-center hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <span className="font-mono text-xs text-gray-400">
                    {change.id}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {change.title}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <TypeIcon size={14} className="text-gray-400" strokeWidth={1.8} />
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        riskColorMap[change.risk] || ''
                      }`}
                    >
                      {change.risk}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        scopeColorMap[change.scope] || ''
                      }`}
                    >
                      <ScopeIcon size={10} strokeWidth={2} />
                      {change.scope === 'project-only'
                        ? 'Project'
                        : change.scope === 'operational-only'
                        ? 'Ops'
                        : 'Cross'}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        stageColorMap[change.status] || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {change.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-gray-50/30">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-400 font-medium mb-1">Description</p>
                        <p className="text-gray-600">{change.description}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400 font-medium">Origin: </span>
                          <span className="text-gray-600">
                            {change.origin.type} — {change.origin.referenceName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Requested: </span>
                          <span className="text-gray-600">{change.requestDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Category: </span>
                          <span className="text-gray-600">{change.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Affected services: </span>
                          <span className="text-gray-600">
                            {change.affectedServices.length > 0
                              ? change.affectedServices.join(', ')
                              : 'None'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-medium">Affected projects: </span>
                          <span className="text-gray-600">
                            {change.affectedProjects.length > 0
                              ? change.affectedProjects.join(', ')
                              : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                      {/* Similarity detection */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <SimilarityPanel target={change} allChanges={changes} />
                    </div>
                    {/* Timeline */}
                    {change.timeline.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-400 font-medium text-xs mb-2">Timeline</p>
                        <div className="space-y-1.5">
                          {change.timeline.map((entry, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <span className="font-mono text-gray-300 shrink-0 w-20">
                                {entry.date}
                              </span>
                              <span
                                className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                                  stageColorMap[entry.stage] || 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {entry.stage.replace(/-/g, ' ')}
                              </span>
                              <span className="text-gray-600">{entry.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
