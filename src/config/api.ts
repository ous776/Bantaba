console.log('Environment variables:', {
  EXPO_PUBLIC_USE_BACKEND: process.env.EXPO_PUBLIC_USE_BACKEND,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
export const USE_BACKEND = process.env.EXPO_PUBLIC_USE_BACKEND === 'true';
