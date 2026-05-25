const { spawnSync } = require('node:child_process');

const omittedDependencies = (process.env.npm_config_omit ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const shouldSkipHuskyInstall =
  process.env.CI === 'true' ||
  process.env.NODE_ENV === 'production' ||
  omittedDependencies.includes('dev');

if (shouldSkipHuskyInstall) {
  process.exit(0);
}

const result = spawnSync('husky', {
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
