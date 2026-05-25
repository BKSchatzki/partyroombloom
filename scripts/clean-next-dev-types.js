const { rmSync } = require('node:fs');
const { join } = require('node:path');

// `next typegen` refreshes production route types, but stale dev route types can
// remain after deleting a route. Remove generated dev types before source checks.
rmSync(join(__dirname, '..', '.next', 'dev', 'types'), {
  force: true,
  recursive: true,
});
