# NIKKE Damage Calculator

A Static Squad Damage Calculator that runs the existing Python simulation engine inside a web browser.

Hyper's Implementation: <https://HyperDM.github.io/nikke-calc/>

Original Fork: <https://moris-kr.github.io/nikke-calc/>

Based on: <https://github.com/Jgaram/nikke-calc>

## AI Agent Connection (MCP)
Register the public MCP address https://nikke-calc-mcp.onrender.com/mcp in ChatGPT or Claude.

In the calculator’s Convenience Features → MCP → AI Connection, enter the connection code you received.

When the AI makes a request, the open calculator browser performs the calculation, and Render relays the input and output.

Query/calculation requests first return a task ID, and the AI checks the completed result separately.

Keep your tab and device awake. Connections last 2 hours, and completed results are stored for 5 minutes.

⚠️ Anyone who knows the connection code can read and calculate your entire squad setup, so do not share it.
After use, disconnect to revoke permissions. Nicknames, account IDs, and cookies are not included in shared data.
Squad growth, formations, and calculation results pass through the AI service and the relay server, which temporarily stores them in memory.

See the [docs/MCP_SETUP.md] for instructions on connecting ChatGPT/Claude with your browser.
Local stdio MCP (nikke_mcp/, Node.js 22+) calculates using the same TypeScript engine as the site, directly on your PC.
The public relay server does not provide a feature to execute calculations on your behalf. 

## Structure

calculator/, context/, data/: Calculation engine and original data

site/: Static web application built with Vite and TypeScript

site/public/calculator.worker.js: Web Worker that separates UI from sequential calculation execution

site/pybridge/bridge.py: Bridge that converts web requests into Python engine calls

site/scripts/sync-runtime.mjs: Synchronizes engine, data, character list, and images with the web runtime

worker/: BlablaLink query proxy (Cloudflare Workers), deployed separately from the site

.github/workflows/pages.yml: Automated testing, build, and GitHub Pages deployment

## Main Features

·Per-Character Overload Lines· Harmony Cubes (17 types) · Collectibles/Favorites · Skill Levels · Limit Breaks · Individual Control Cettings.
·Account Console Settings — apply Affection, Class and Manufacturer Console Values to all squad members.
·5-team mode and deck copy — duplicate one team’s formation and settings into another, then swap only the DPS unit for comparison.
·Per-character normal/skill damage breakdown — shows contribution ratios, normal attack vs skill damage proportions, and skill-specific damage/hit counts.
·Frame-level combat timeline graph.
·Export Detailed Reports as Images — generate results as a single PNG for copy or save (1-deck as vertical card, 5-deck as combined totals + 25 individual damages in one image).
·Burst gauge charge time adjustment — manually input fixed times instead of cumulative gauge to tune cycles.
·Import CSV from Let’sdoro and sync BlablaLink profiles to reflect actual growth state.
·Share squads via link/code, save formation presets, and compare deck rankings.

In the web version, the fixed Pyodide runs the Python engine inside a Web Worker. Standard web calculations run directly in the browser. If the optional AI connection is enabled, growth, formations, and calculation results pass through the AI service and Render relay server. Result cache is stored in the browser’s localStorage (up to 30 entries).
Currently, the selection list includes only real characters present in both data/parsed_nikke.json and data/parsed_skills.json. test_ data is excluded, and preview characters display a warning that their data is unverified. As of the current sync, 202 characters are supported.

## Local Execution

Node.js 22 or higher and Python 3 are required

```bash
cd site
npm install
npm run dev
```

Access the /nikke-calc/ path of the local address displayed by Vite.
For the first calculation, Pyodide will be downloaded, so an internet connection is required. Afterward, the browser cache will be used.

## Validation

Quick validation of the web application:

```bash
cd site
npm test -- --run
python3 scripts/test-bridge.py
npm run check-pages
npm run build
```

Full validation including the existing calculation engine:

```bash
python3 calculator/damage.py
python3 -m context.doclint
python3 -m context.snapshot
```

## Data Update

When the engine, data, or character images are changed, do not modify the generated files directly. Instead, re‑synchronize them using the following commands.

```bash
cd site
npm run sync-runtime
npm run check-runtime
```

`npm run dev`와 `npm run build`도 실행 전에 자동으로 런타임을 동기화합니다.

## Deployment

When you push to the `master` branch, GitHub Actions installs dependencies according to the lock file, runs tests and production builds, and only the site/dist directory that passes is deployed to GitHub Pages.

The default deployment path for Vite is /nikke-calc/.

### BlablaLink Integration (Optional)

The feature to fetch growth data via profile URL requires a proxy — the BlablaLink API does not enable CORS and demands a login session for queries, so a static site cannot call it directly.
The deployment procedure is described in [worker/README.md](worker/README.md). Once deployed, enter the desired address [site/.env.production](site/.env.production) of `VITE_BLABLA_PROXY`. This will add a BlablaLink Integration button to the site.

**BlablaLink Integration**
A button will appear.  
If the value is left empty, that button will not be rendered at all, and only the Let’sdoro CSV option will remain.

## License

The original calculation engine is available at <https://github.com/Jgaram/nikke-calc> and is released under the MIT License.
Since this repository is a fork, it follows the same MIT License, and the original copyright notice is included unchanged in [LICENSE](LICENSE).

    Copyright (c) 2026 Jgaram
    MIT License

## Notice

This repository and service are unofficial fan tools and are not affiliated with, nor approved by, SHIFT UP or Level Infinite.

All rights to the game data, characters, images, and related works of Goddess of Victory: NIKKE belong to SHIFT UP CORP. and Level Infinite.
The above license applies only to the calculator code and does not extend to the game assets.

Before public operation, separately confirm distribution rights for any assets and data you use.

Calculation results are for reference only — bugs or unverified game mechanics may still remain.
