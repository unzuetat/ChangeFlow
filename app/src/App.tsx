import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './views/Dashboard';
import TranslatorView from './views/TranslatorView';
import PlaceholderView from './views/PlaceholderView';

const pageTitles: Record<string, string> = {
  '/':           'Dashboard',
  '/changes':    'Change Register',
  '/intake':     'New Change Request',
  '/workflow':   'Workflow Viewer',
  '/translator': 'Governance Translator',
  '/settings':   'Settings',
};

export default function App() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'ChangeFlow';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/translator" element={<TranslatorView />} />
            <Route path="/changes" element={<PlaceholderView name="Change Register" />} />
            <Route path="/intake" element={<PlaceholderView name="New Change Request" />} />
            <Route path="/workflow" element={<PlaceholderView name="Workflow Viewer" />} />
            <Route path="/settings" element={<PlaceholderView name="Settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
