import { create } from 'zustand';
import { ChangeRecord, GovernanceMetrics } from '../types';
import { MethodologicalProfile, ProfileId } from '../types/profile';
import { getProfile } from '../profiles';

interface ChangeFlowState {
  // Active methodological profile
  activeProfileId: ProfileId;
  activeProfile: MethodologicalProfile;

  // Data
  changes: ChangeRecord[];
  
  // UI state
  selectedChangeId: string | null;

  // Actions
  setProfile: (id: ProfileId) => void;
  setChanges: (changes: ChangeRecord[]) => void;
  selectChange: (id: string | null) => void;
}

export const useStore = create<ChangeFlowState>((set) => ({
  // Default to PRINCE2+ITIL profile
  activeProfileId: 'prince2-itil',
  activeProfile: getProfile('prince2-itil'),

  changes: [],
  selectedChangeId: null,

  setProfile: (id: ProfileId) =>
    set({
      activeProfileId: id,
      activeProfile: getProfile(id),
    }),

  setChanges: (changes: ChangeRecord[]) => set({ changes }),

  selectChange: (id: string | null) => set({ selectedChangeId: id }),
}));
