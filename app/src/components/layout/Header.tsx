import { useStore } from '../../store';
import { listProfiles } from '../../profiles';
import { ProfileId } from '../../types/profile';

export default function Header({ title }: { title: string }) {
  const { activeProfileId, setProfile } = useStore();
  const allProfiles = listProfiles();

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-5 sticky top-0 z-20">
      <span className="text-sm font-semibold text-gray-800 pl-10 lg:pl-0">{title}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400 hidden sm:inline">Profile:</span>
        <select
          value={activeProfileId}
          onChange={(e) => setProfile(e.target.value as ProfileId)}
          className="text-[11px] font-semibold bg-cf-50 text-cf-800 border border-cf-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cf-300 cursor-pointer"
        >
          {allProfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
