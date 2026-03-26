import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './views/Dashboard';
import TranslatorView from './views/TranslatorView';
import PlaceholderView from './views/PlaceholderView';
import ChangeRegister from './views/ChangeRegister';
import IntakeForm from './views/IntakeForm';
import WorkflowViewer from './views/WorkflowViewer';
import SettingsView from './views/SettingsView';
import ComparisonView from './views/ComparisonView';
import ScenarioSimulator from './views/ScenarioSimulator';

const pageTitles: Record<string, string> = {
  '/':           'Dashboard',
  '/changes':    'Change Register',
  '/intake':     'New Change Request',
  '/workflow':   'Workflow Viewer',
  '/translator': 'Governance Translator',
  '/compare':    'Framework Comparison',
  '/simulator':  'Scenario Simulator',
  '/settings':   'Settings',
};

export default function App() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'ChangeFlow';

  return (
   <div className="flex min-h-screen bg-gray-50 max-w-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Header title={title} />
     <main className="flex-1 p-6 max-w-[calc(100vw-15rem)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/translator" element={<TranslatorView />} />
            <Route path="/changes" element={<ChangeRegister />} />
            <Route path="/intake" element={<IntakeForm />} />
            <Route path="/workflow" element={<WorkflowViewer />} />
            <Route path="/compare" element={<ComparisonView />} />
            <Route path="/simulator" element={<ScenarioSimulator />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
