import { defineConfig } from 'vitest/config';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ID that changes with each build. Since calculator.worker.js is a public asset without a hash,
// this value is appended as a query so that the old worker isn’t reused from cache after a new deployment.
const buildId = JSON.stringify(Date.now().toString(36));

// Hash of the calculation engine (src/engine/) source. It’s included in the key for stored calculation results — so if the engine changes,
// old results won’t be reused. (The build ID changes with each deployment and always clears the cache, so it isn’t used here.)
const engineDir = join(import.meta.dirname, 'src', 'engine');
const engineHash = createHash('sha256');
for (const file of readdirSync(engineDir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts')).sort()) {
  engineHash.update(file).update(readFileSync(join(engineDir, file)));
}
const engineId = JSON.stringify(engineHash.digest('hex').slice(0, 12));

export default defineConfig({
  base: '/nikke-calc/',
  define: {
    __BUILD_ID__: buildId,
    __ENGINE_ID__: engineId,
  },
  test: {
    environment: 'node',
  /**
 * Upper limit (ms) for a single test. The default 5 seconds is **too short for this repository** — in `ui.test.ts`,
 * each test spins up the entire calculator screen (200 Nikke characters, dozens of panels), and then runs over a hundred tests in succession.
 * CI machines are three to four times slower than development machines. As a result, the note
 * “give 20 seconds to one slow test” had to be added three separate times, and each time deployment was blocked.
 *
 * So we raise it here all at once. Increasing the limit doesn’t make slow tests faster.
 */
    testTimeout: 20_000,
  },
});
