export type LanguageCode = 'en' | 'mnk' | 'wo' | 'dyo' | 'ff';

export interface Translation {
  id: string;
  sourceWord: string;
  targetWord: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  status: 'pending' | 'verified' | 'corrected';
  audioUrl?: string;
  generatedBy: 'ai' | 'api';
  createdAt: Date;
  verifiedAt?: Date;
  category?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export interface VerificationResult {
  translationId: string;
  isCorrect: boolean;
  correctedWord?: string;
  notes?: string;
  verifiedBy: string;
  verifiedAt: Date;
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export interface AudioData {
  translationId: string;
  audioUri: string;
  duration: number;
  recordedBy: string;
  verified: boolean;
}
