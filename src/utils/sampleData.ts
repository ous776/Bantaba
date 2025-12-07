// Sample words organized by category for quick testing

export const SAMPLE_WORDS = {
  greetings: [
    'hello',
    'goodbye',
    'good morning',
    'good afternoon',
    'thank you',
    'please',
    'welcome',
  ],
  family: [
    'mother',
    'father',
    'brother',
    'sister',
    'child',
    'family',
    'friend',
  ],
  food: [
    'water',
    'rice',
    'fish',
    'meat',
    'bread',
    'fruit',
    'vegetable',
  ],
  numbers: [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
  ],
  verbs: [
    'go',
    'come',
    'see',
    'hear',
    'speak',
    'understand',
    'know',
    'want',
  ],
  nature: [
    'sun',
    'moon',
    'star',
    'water',
    'fire',
    'tree',
    'rain',
    'wind',
  ],
  body: [
    'head',
    'eye',
    'ear',
    'nose',
    'mouth',
    'hand',
    'foot',
    'heart',
  ],
  colors: [
    'red',
    'blue',
    'green',
    'yellow',
    'black',
    'white',
    'brown',
  ],
};

export const getAllSampleWords = (): string[] => {
  return Object.values(SAMPLE_WORDS).flat();
};

export const getSampleWordsByCategory = (category: keyof typeof SAMPLE_WORDS): string[] => {
  return SAMPLE_WORDS[category] || [];
};
