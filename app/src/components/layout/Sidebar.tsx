import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  List,
  GitBranch,
  Languages,
  ArrowLeftRight,
  Play,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/',          label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/changes',   label: 'Changes',      icon: List },
  { to: '/intake',    label: 'New Change',    icon: FilePlus },
  { to: '/workflow',  label: 'Workflow',      icon: GitBranch },
  { to: '/translator', label: 'Translator',  icon: Languages },
  { to: '/compare',    label: 'Compare',     icon: ArrowLeftRight },
  { to: '/simulator',  label: 'Simulator',   icon: Play },
];

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-30">
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-cf-700 tracking-tight">
          Change<span className="text-cf-400">Flow</span>
        </h1>
        <p className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-widest">
          Governance Framework
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cf-50 text-cf-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-cf-50 text-cf-700'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`
          }
        >
          <Settings size={18} strokeWidth={1.8} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
