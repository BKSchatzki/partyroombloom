import 'server-only';

export const REQUIRED_ENV_KEYS = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'AUTH_GOOGLE_REDIRECT_URI',
] as const;
export const OPTIONAL_ENV_KEYS = ['SITE_URL'] as const;

export type RequiredEnvKey = (typeof REQUIRED_ENV_KEYS)[number];
export type OptionalEnvKey = (typeof OPTIONAL_ENV_KEYS)[number];

type EnvValidationResult = {
  ok: boolean;
};

const validateUrlEnv = (
  value: string,
  allowedProtocols: readonly string[]
): EnvValidationResult => {
  try {
    const url = new URL(value);
    return { ok: allowedProtocols.includes(url.protocol) };
  } catch {
    return { ok: false };
  }
};

const validateGoogleRedirectUri = (value: string): EnvValidationResult => {
  try {
    const url = new URL(value);
    return {
      ok:
        ['http:', 'https:'].includes(url.protocol) &&
        url.pathname === '/login/google/callback' &&
        url.search === '' &&
        url.hash === '',
    };
  } catch {
    return { ok: false };
  }
};

const requiredEnvValidators: Record<RequiredEnvKey, (value: string) => EnvValidationResult> = {
  DATABASE_URL: (value) => validateUrlEnv(value, ['postgres:', 'postgresql:']),
  OPENAI_API_KEY: () => ({ ok: true }),
  AUTH_GOOGLE_ID: () => ({ ok: true }),
  AUTH_GOOGLE_SECRET: () => ({ ok: true }),
  AUTH_GOOGLE_REDIRECT_URI: validateGoogleRedirectUri,
};

const optionalEnvValidators: Record<OptionalEnvKey, (value: string) => EnvValidationResult> = {
  SITE_URL: (value) => validateUrlEnv(value, ['http:', 'https:']),
};

const DEFAULT_SITE_URL = 'https://partyroombloom.vercel.app';

export const getOptionalEnv = (key: string) => {
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
};

export const getRequiredEnv = (key: RequiredEnvKey) => {
  const value = getOptionalEnv(key);
  if (!value) {
    throw new Error(`${key} is not configured.`);
  }
  if (!requiredEnvValidators[key](value).ok) {
    throw new Error(`${key} is not valid.`);
  }
  return value;
};

export const getSiteUrl = () => {
  const value = getOptionalEnv('SITE_URL');
  if (!value) {
    return DEFAULT_SITE_URL;
  }
  if (!optionalEnvValidators.SITE_URL(value).ok) {
    throw new Error('SITE_URL is not valid.');
  }
  return value;
};

export const getRequiredEnvStatus = () => {
  const missing: RequiredEnvKey[] = [];
  const invalid: Array<RequiredEnvKey | OptionalEnvKey> = [];

  REQUIRED_ENV_KEYS.forEach((key) => {
    const value = getOptionalEnv(key);
    if (!value) {
      missing.push(key);
      return;
    }

    if (!requiredEnvValidators[key](value).ok) {
      invalid.push(key);
    }
  });

  OPTIONAL_ENV_KEYS.forEach((key) => {
    const value = getOptionalEnv(key);
    if (value && !optionalEnvValidators[key](value).ok) {
      invalid.push(key);
    }
  });

  return {
    configured: missing.length === 0 && invalid.length === 0,
    invalidCount: invalid.length,
    missingCount: missing.length,
  };
};
