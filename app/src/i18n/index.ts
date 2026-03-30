import { create } from 'zustand';
import { es, Translations } from './es';
import { en } from './en';

export type LanguageId = 'en' | 'es';

export interface Language {
  id: LanguageId;
  name: string;
  label: string;
}

export const languages: Language[] = [
  { id: 'en', name: 'English', label: 'EN' },
  { id: 'es', name: 'Español', label: 'ES' },
];

const translationMap: Record<LanguageId, Translations> = { en, es };

interface I18nState {
  language: LanguageId;
  t: Translations;
  setLanguage: (lang: LanguageId) => void;
}

export const useI18n = create<I18nState>((set) => ({
  language: 'en',
  t: en,
  setLanguage: (lang: LanguageId) =>
    set({
      language: lang,
      t: translationMap[lang],
    }),
}));
