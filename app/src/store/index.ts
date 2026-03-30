import { ProfileUser } from '../types/profile';
import { create } from 'zustand';
import { ChangeRecord } from '../types';
import { MethodologicalProfile, ProfileId } from '../types/profile';
import { RoutingRule, RoutingDecision } from '../types/routing';
import { getProfile } from '../profiles';
import { loadRoutingRules, loadRoutingHistory, saveRoutingRules, saveRoutingDecision as persistDecision } from '../lib/persistence';

interface ChangeFlowState {
  // Active methodological profile
  activeProfileId: ProfileId;
  activeProfile: MethodologicalProfile;

  // Data
  changes: ChangeRecord[];

  // Routing
  routingRules: RoutingRule[];
  routingHistory: RoutingDecision[];

  // UI state
  selectedChangeId: string | null;
  // Active simulated user (only for profiles with custom extension)
  activeUser: ProfileUser | null;

  // Actions
  setProfile: (id: ProfileId) => void;
  setChanges: (changes: ChangeRecord[]) => void;
  selectChange: (id: string | null) => void;
  setActiveUser: (user: ProfileUser | null) => void;
  setRoutingRules: (rules: RoutingRule[]) => void;
  addRoutingDecision: (decision: RoutingDecision) => void;
  loadPersistedData: () => void;
}

export const useStore = create<ChangeFlowState>((set) => ({
  // Default to PRINCE2+ITIL profile
  activeProfileId: 'prince2-itil',
  activeProfile: getProfile('prince2-itil'),

  changes: [],
  routingRules: loadRoutingRules(),
  routingHistory: [],
  selectedChangeId: null,
  activeUser: null,

  setProfile: (id: ProfileId) =>
    set({
      activeProfileId: id,
      activeProfile: getProfile(id),
    }),

  setChanges: (changes: ChangeRecord[]) => set({ changes }),

  selectChange: (id: string | null) => set({ selectedChangeId: id }),
  setActiveUser: (user: ProfileUser | null) => set({ activeUser: user }),

  setRoutingRules: (rules: RoutingRule[]) => {
    saveRoutingRules(rules);
    set({ routingRules: rules });
  },

  addRoutingDecision: (decision: RoutingDecision) => {
    persistDecision(decision);
    set((state) => ({
      routingHistory: [...state.routingHistory, decision],
    }));
  },

  loadPersistedData: () => {
    set({
      routingRules: loadRoutingRules(),
      routingHistory: loadRoutingHistory(),
    });
  },
}));
