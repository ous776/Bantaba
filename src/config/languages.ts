import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'mnk',
    name: 'Mandinka',
    nativeName: 'Mandinka',
  },
  {
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wolof',
  },
  {
    code: 'jo',
    name: 'Jola',
    nativeName: 'Joola',
  },
  {
    code: 'ff',
    name: 'Fula',
    nativeName: 'Poullor',
  },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLocalLanguages = (): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en');
};
