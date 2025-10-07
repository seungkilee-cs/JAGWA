# Jagwa Weather App Status & Roadmap

## Current State (October 7, 2025)
- UI built with Vite-powered Svelte SPA (`jagwa-frontend/`)
- Core data flows provided by `weatherService.ts` using OpenWeatherMap current, forecast, and air quality endpoints
- Reactive app state handled via `weatherStore.ts` (`weatherData`, `isLoading`, `error`, `unit`)
- Main experience (`App.svelte`) covers location search, unit toggle, current conditions, hourly precipitation chart, and AQI badge
- Components implemented: `LocationSearch`, `WeatherDisplay`, `UnitToggle`, `PrecipitationChart` (Chart.js), `AQIDisplay`

## Observed Gaps & Risks
- No persistent store for forecasts/AQI; kept in component state inside `App.svelte`
- Loading/error UX minimal; no skeletons or retry guidance
- Chart.js bundle loaded globally each mount; no lazy loading or teardown on prop change
- Missing UV index feature from product goals; no alerts or daily forecast views yet
- No tests (unit, integration, or e2e). Limited type coverage for API responses
- API key expected in `VITE_WEATHER_API_KEY` but `.env` guidance sparse
- Not yet migrated to SvelteKit per longer-term plan; routing/auth scaffolding absent

## Implementation Roadmap

### Phase 1 — Stabilize Current SPA (Week 1)
- Harden `App.svelte` state: move forecast/AQI into Svelte stores, add dedicated loading/error views
- Expand `weatherService.ts` typings and error handling (status-specific messaging, retries/backoff placeholder)
- Document environment setup in `jagwa-frontend/README.md` (API key instructions, dev scripts)

### Phase 2 — Metrics Enhancements (Weeks 2-3)
- Implement UV index retrieval and component (extend store + service)
- Add precipitation amount visualization (line or stacked bars for rain vs. snow)
- Introduce daily forecast summary cards and sunrise/sunset indicators
- Create accessibility pass: keyboard nav, color contrast tweaks (AQI chip, chart palette)

### Phase 3 — Platform Upgrade (Weeks 4-5)
- Scaffold SvelteKit project with routing and server-side rendering
- Migrate existing components and stores; configure load functions for data fetching
- Share state via `+layout.ts` or endpoints; evaluate caching strategy (OpenWeatherMap rate limits)

### Phase 4 — Testing & Automation (Weeks 6-7)
- Add unit tests (Vitest) for stores/services
- Introduce component testing (Playwright or Testing Library) for key flows (search, unit toggle)
- Set up CI workflow (GitHub Actions) with linting, tests, and bundle size reporting
- Plan deployment story (Netlify/Vercel or AWS Amplify per broader stack)

### Stretch Goals
- Offline-first caching using Service Worker & IndexedDB (weather snapshots)
- Adaptive layouts for tablet use (aligns with iPadOS target noted in earlier planning)
- Notification pipeline for severe weather alerts via AWS backend once available
