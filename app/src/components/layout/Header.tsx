import { useStore } from '../../store';
import { listProfiles } from '../../profiles';
import { ExtendedMethodologicalProfile, ProfileUser } from '../../types/profile';
import { useI18n, languages } from '../../i18n';

export default function Header() {
  const { activeProfileId, activeProfile, setProfile, activeUser, setActiveUser } = useStore();
  const { language, setLanguage, t } = useI18n();
  const profiles = listProfiles();

  const extendedProfile = activeProfile as ExtendedMethodologicalProfile;
  const hasUsers = extendedProfile?.customExtension?.users && extendedProfile.customExtension.users.length > 0;
  const users = extendedProfile?.customExtension?.users || [];
  const departments = extendedProfile?.customExtension?.departments || [];

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProfileId = e.target.value as any;
    setProfile(newProfileId);
    setActiveUser(null);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (userId === '') {
      setActiveUser(null);
      return;
    }
    const user = users.find((u: ProfileUser) => u.id === userId) || null;
    setActiveUser(user);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-sm font-semibold text-gray-800 truncate">ChangeFlow</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-xs font-medium">
            {languages.map((lang, idx) => (
              <span key={lang.id} className="flex items-center">
                {idx > 0 && <span className="text-gray-300 mx-1">/</span>}
                <button
                  onClick={() => setLanguage(lang.id)}
                  className={`px-1 py-0.5 rounded transition-colors ${
                    language === lang.id
                      ? 'text-blue-700 font-bold'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {lang.label}
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <span className="text-xs text-gray-400 hidden sm:inline">{t.header.profile}:</span>
            <select
              value={activeProfileId}
              onChange={handleProfileChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {hasUsers && (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <span className="text-xs text-gray-400 hidden sm:inline">{t.header.user}:</span>
              <select
                value={activeUser?.id || ''}
                onChange={handleUserChange}
                className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[180px]"
              >
                <option value="">{t.header.selectUser}</option>
                {departments.map((dept) => (
                  <optgroup key={dept.id} label={dept.name}>
                    {users
                      .filter((u: ProfileUser) => u.department === dept.id)
                      .map((u: ProfileUser) => (
                        <option key={u.id} value={u.id}>{u.displayName}</option>
                      ))}
                  </optgroup>
                ))}
              </select>
              {activeUser && (
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                  activeUser.canApprove
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {activeUser.canApprove ? t.header.canApprove : t.header.escalatesToCoordinator}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
