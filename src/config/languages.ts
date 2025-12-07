import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    region: 'International',
  },
  {
    code: 'mnk',
    name: 'Mandinka',
    nativeName: 'Mandinka',
    flag: '🇬🇲',
    region: 'Gambia, Senegal, Guinea',
  },
  {
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wolof',
    flag: '🇸🇳',
    region: 'Senegal, Gambia, Mauritania',
  },
  {
    code: 'dyo',
    name: 'Jola',
    nativeName: 'Joola',
    flag: '🇸🇳',
    region: 'Senegal, Gambia, Guinea-Bissau',
  },
  {
    code: 'ff',
    name: 'Fula',
    nativeName: 'Fulfulde',
    flag: '🇬🇳',
    region: 'West Africa',
  },
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLocalLanguages = (): Language[] => {
  return SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'en');
};
