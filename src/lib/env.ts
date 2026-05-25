import 'server-only';

export const REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'AUTH_GOOGLE_REDIRECT_URI',
] as const;

export type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];

export const getRequiredEnv = (key: RequiredEnvKey) => {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new Error(`${key} is not configured.`);
  }
  return value;
};

export const getRequiredEnvStatus = () => {
  const missing = REQUIRED_ENV_KEYS.filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
  });

  return {
    configured: missing.length === 0,
    missingCount: missing.length,
  };
};
