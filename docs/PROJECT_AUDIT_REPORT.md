# TiiA Live — Technical Audit & Project Status Report

## 1. Executive summary

This repository contains a polished frontend mockup and a minimal streaming plumbing layer for a local MVP, but it does not yet implement the broader live-event platform described in the brief. The current codebase provides a static event landing page, a Next.js front-end, MediaMTX configuration for three RTMP/HLS paths, and a browser-based HLS player. The project already passes the repo’s static checks: unit tests pass, TypeScript passes, ESLint passes, and a production Next.js build completes successfully.

However, the evidence does not support the claim that the stated product is functionally complete. The current implementation demonstrates:

- a static event landing page,
- a single active HLS player path wired for `cam1`,
- placeholder UI for `cam2` and `cam3`,
- no real backend, database, or admin layer,
- no metrics, rankings, polls, or control panel,
- no automated production deployment, monitoring, CDN, or scaling infrastructure,
- no end-to-end verification of real RTMP publishing or simultaneous three-camera playback.

This is best described as a front-end MVP foundation, not a launch-ready streaming platform.

### Status summary

| Status | Count | Notes |
| --- | ---: | --- |
| Implemented | 5 | Landing page, static event sections, HLS URL plumbing, media player skeleton, local build/test checks |
| Partially implemented | 4 | MediaMTX stream paths, HLS frontend wiring, live-player status states, camera-area layout |
| Missing | 9 | Goals, challenges, scores, polls, admin panel, metrics logic, persistence, streaming ops, production hosting |
| Broken | 0 | No reproducible code-level failure was observed in the checked build/test pipeline |
| Unverified | 8 | Real RTMP publishing, real HLS playback, multi-camera multiview, public production readiness, seven-day event capacity |

---

## 2. Repository overview and detected technology stack

### Repository facts

- Root project scope: `tiia-live/`
- Frontend app: `tiia-live/apps/web/`
- Streaming media layer: `tiia-live/streaming/mediamtx/`
- Docker orchestration: `tiia-live/docker-compose.yml`
- Documentation: `tiia-live/docs/`

### Detected stack

- Frontend: Next.js 16.3.6, React 19.2.8, TypeScript 5
- Streaming player: `hls.js` 1.6.12
- Styling: Tailwind CSS 4 + custom CSS classes in the app
- Validation: Vitest 3, ESLint 9, `tsc --noEmit`
- Runtime environment: Node.js 20 alpine container for the web app
- Streaming server: MediaMTX via Docker image `bluenviron/mediamtx:latest`
- Local orchestration: Docker Compose

### Key evidence

- `tiia-live/apps/web/package.json` declares the app scripts and versions.
- `tiia-live/docker-compose.yml` defines a `web` service and a `mediamtx` service.
- `tiia-live/streaming/mediamtx/mediamtx.yml` configures RTMP and HLS endpoints.
- `tiia-live/README.md` describes the intended architecture as `OBS -> RTMP -> MediaMTX -> HLS -> Next.js -> Browser`.

The repository does not contain evidence of:

- a backend API server,
- a database (SQL or NoSQL),
- an auth/session system,
- any admin panel or CMS,
- any payment, donation, or Twitch API integration,
- any queue, cache, or monitoring service.

The code is intentionally front-end-oriented and intentionally avoids the broader production platform described in the client brief.

---

## 3. Actual architecture and data flow

### Observed architecture

The actual implementation matches this flow:

```text
OBS (not built in repo)
  -> RTMP to MediaMTX
  -> MediaMTX exposes HLS endpoints
  -> Next.js reads configured HLS URLs from environment variables
  -> Browser displays the configured player(s)
```

### Evidence

- `tiia-live/docker-compose.yml` exposes the live streaming stack:
  - `mediamtx` on `1935` (RTMP)
  - `mediamtx` on `8888` (HLS)
  - `web` on `3000`
- `tiia-live/streaming/mediamtx/mediamtx.yml` defines exactly three paths:
  - `cam1`
  - `cam2`
  - `cam3`
- `tiia-live/apps/web/lib/config.ts` contains the public URLs:
  - `NEXT_PUBLIC_STREAM_CAM1_URL`
  - `NEXT_PUBLIC_STREAM_CAM2_URL`
  - `NEXT_PUBLIC_STREAM_CAM3_URL`
- `tiia-live/apps/web/components/VideoPlayer.tsx` loads these URLs through `hls.js` when the source contains `.m3u8`.

### What is actually flowing today

1. The app does not publish or ingest data itself. It expects an RTMP source to already exist.
2. MediaMTX turns RTMP into HLS.
3. The frontend reads the HLS URL from environment variables and renders a `<video>` element with `hls.js`.
4. The page text and layout are static. There is no real metadata feed, no real-time event state, and no server-side marketplace for metrics or rankings.

### Verified operational findings

- The MediaMTX configuration is structurally valid for three named stream paths.
- The frontend URL wiring is consistent with those paths.
- The repository explicitly uses `localhost` URLs, which are only valid on a single machine or local network unless the app is deployed behind a trusted public host.

### Unverified operational findings

- No RTMP stream was published during this audit, so no real HLS playlist was observed.
- No actual browser playback of a live stream was verified.
- No simultaneous multi-feed validation was performed.

---

## 4. Implementation inventory

### Implemented

- Event landing page and landing-page branding in `apps/web/app/page.tsx` and `apps/web/components/Hero.tsx`
- A `VideoPlayer` component using `hls.js` in `apps/web/components/VideoPlayer.tsx`
- Standalone HLS URL configuration in `apps/web/lib/config.ts`
- A `CameraGrid` layout with a main camera and supporting camera cards in `apps/web/components/CameraGrid.tsx`
- Local validation pipeline (`test`, `typecheck`, `lint`, `build`) in `apps/web/package.json`

### Partially implemented

- MediaMTX stream path configuration for `cam1`, `cam2`, and `cam3` in `streaming/mediamtx/mediamtx.yml`
- Frontend HLS URL consumption and status badges in `apps/web/components/VideoPlayer.tsx` and `apps/web/components/StreamStatus.tsx`
- Live camera area design and responsive layout shell in `apps/web/components/CameraCard.tsx` and related UI files
- Browser-side autoplay/mute behavior and offline/error states are partially handled for the player, but not robust against real-world stream interruptions

### Missing

- Embedded Twitch player or any actual Twitch API integration
- Individual camera selection / switching logic beyond a static layout
- Three-camera multiview implementation
- Event goals, challenges, unlock logic, or progression state
- Rankings, donation leaderboards, daily rankings, or overall event standings
- Statistics collection or aggregation from Twitch, donations, or any source
- Voting interface, vote persistence, or admin moderation
- Private/admin control panel with auth and authorization
- Any persistence layer, database, or server-side state
- Monitoring, alerts, health checks, failover, and backup procedures
- Public production deployment and CDN setup

### Broken or non-functional in practice

The repository does not contain a reproducible code-level failure from the repo’s unit tests or build, but the product requirements that are expected to work in the client brief are not implemented in a way that is trusted for live operation. In effect, the platform is presently a static front-end shell rather than a working end-to-end live site.

### Unverified

- Real stream publishing via OBS to RTMP
- Real stream availability through MediaMTX HLS endpoints
- Actual browser playback on desktop or mobile
- Simultaneous playback of all three feeds in one view
- Seven-day continuous operation readiness
- Public-facing deployment and load handling
- Audience capacity assumptions at 50, 150, and 500 concurrent viewers

---

## 5. Client requirements compliance matrix

| Requirement group | Status | Evidence | Next action |
| --- | --- | --- | --- |
| Dedicated event landing page | Implemented | `apps/web/app/page.tsx`, `components/Hero.tsx`, `components/EventSection.tsx` | Keep and expand with event metadata/promo assets |
| Twitch embedded player | Missing | `streamerConfig.socials.twitch` is just a link, not an embedded player; no Twitch SDK or iframe found | Replace link with real embed or a proper live-player integration |
| Three independent live camera feeds | Partially implemented | `streaming/mediamtx/mediamtx.yml` defines 3 paths; `lib/config.ts` exposes 3 URLs; `CameraGrid` shows 3 cards | Validate actual stream availability and real feed connectivity |
| Individual camera selection | Missing | No stateful switching logic or camera toggle UI exists | Add user-selectable camera state and stream source controls |
| Three-camera multiview | Missing | No multiview layout or combined player logic found | Build a split-screen composition with synchronized feed states |
| PC and mobile support | Partially implemented | Responsive utility classes exist in the UI; no live validation was performed on mobile browsers | Validate on iOS/Android browsers and responsive breakpoints |
| Live status | Partially implemented | `StreamStatus.tsx` and `VideoPlayer.tsx` update status text from player events | Tie status to real server and player health rather than static UI text |
| Stream-duration counter | Missing | No timer or stream clock found in repo | Add frontend timer and start-time tracking source |
| Seven-day continuous operation readiness | Unverified | No health checks, failover, or automation were found | Define a real ops plan with monitoring and recovery |
| Donation goals | Missing | No donation/goals logic, assets, or data model found | Add backend or CMS-backed config and progress tracking |
| Follower goals | Missing | No follower metric source or UI | Connect to an approved social data source or manual managed dataset |
| Subscription goals | Missing | No subscription tracking found | Define source of truth and admin-editable goal model |
| Streaming-hours goals | Missing | No hours model or progress logic found | Add event-state tracker and challenge timers |
| Custom GTA-related challenges | Missing | No challenge data or unlock flow found | Build challenge schema and admin CRUD |
| Automatic challenge unlocks | Missing | No logic or state machine found | Add progression engine and persistence |
| Persistent configuration and progress | Missing | No database or persistence layer found | Add storage and admin edit workflow |
| Top supporters | Missing | No ranking data or UI found | Define ranking source and calculation rules |
| Donation rankings | Missing | No ranking integration found | Add approved source-of-truth feed |
| Daily rankings | Missing | No daily aggregation logic found | Add time-based leaderboard service |
| Overall event rankings | Missing | No ranking engine found | Add durable leaderboard model |
| Duplicate identity handling | Missing | No identity logic or dedupe model found | Define identity strategy before launch |
| Donations statistics | Missing | No donation metrics intake found | Add event data API or provider integration |
| Followers/statistics | Missing | No follower data source found | Connect to social analytics or manual model |
| Subscriptions statistics | Missing | No subscription metric source found | Implement service or external source integration |
| Viewers statistics | Missing | No viewer counter found | Add analytics provider or real metrics feed |
| Challenge progress stats | Missing | No progress tracking found | Add event state management and admin UI |
| Voting interface | Missing | No vote UI or APIs found | Add poll model and frontend with validation |
| Vote persistence | Missing | No persistence layer or server state found | Add durable store and dedupe rules |
| Duplicate-vote prevention | Missing | No vote dedupe logic found | Add client/server validation and rate limiting |
| Live results | Missing | No live vote result engine found | Add result aggregation and event updates |
| Administrative control of polls | Missing | No admin route or auth layer found | Add protected admin area and audit trail |
| Private control panel | Missing | No protected route or auth logic found | Add secure admin auth and dashboard |
| Authentication | Missing | No auth libraries or route guards found | Define auth provider and protected routes |
| Authorization | Missing | No role model or authorization layer found | Add admin roles and route protections |
| Production hosting readiness | Missing | No production deployment artifacts beyond local compose and docs | Add deployment pipeline and environment settings |
| HTTPS/domain config | Missing | Local `localhost` URLs are used; no public domain or TLS config found | Add reverse proxy/CDN and certificate management |
| CDN/video-delivery integration | Missing | No CDN config or edge service integration found | Add edge delivery layer for live HLS |
| Monitoring and alerts | Missing | No infra monitoring or health checks found | Add observability and alerting |
| Health checks | Missing | No health endpoint or container checks found | Add app and stream health probes |
| Failure recovery / failover | Missing | Nothing found outside design docs | Add targeted recovery workflow |
| Backups and recovery | Missing | No backup strategy or persistence found | Define retention and restoration plan |
| Credential security | Partially implemented | `.env.example` contains only URLs, no secrets; still no production secret management pattern | Establish secret stores and least-privilege access |
| Automated scaling and cost controls | Missing | No autoscaling or cost policy exists in repo | Add load tests and autoscaling policies |

---

## 6. Test commands and results

### Commands run

```bash
cd /Users/hbraz/Reps/AiiT/AiiT/tiia-live/apps/web
npm run test -- --run
npm run typecheck
npm run lint
npm run build
```

### Results

- `npm run test -- --run`: passed
  - 2 test files passed
  - 3 tests passed
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed

### Additional validation

```bash
cd /Users/hbraz/Reps/AiiT/AiiT/tiia-live
docker compose config
```

Result: Compose syntax is valid; both `mediamtx` and `web` services were recognized.

### Important limitation

No real RTMP stream was published and no HLS media was played during this audit. The steps above verify only the static codebase and the local configuration file syntax, not end-to-end live streaming behavior.

---

## 7. Critical defects and technical risks

### 1) Only one active feed is effectively wired into the page

Evidence: `CameraGrid.tsx` selects `mainCamera`, then maps `supportCameras` into `CameraCard`. In `CameraCard.tsx`, `isUpcoming` triggers the placeholder UI that reads “Coming soon,” and the real `VideoPlayer` is not rendered for the secondary cameras.

Impact: The product brief promises three-cam capability, but the current page only displays a real player for the primary stream. Secondary feeds are static placeholders.

### 2) No real source-of-truth for stream health

Evidence: `VideoPlayer.tsx` sets `status` based on browser events (`loadedmetadata`, `error`, and HLS fatal error events). It does not poll the server or verify playlist health from the origin.

Impact: `LIVE` status is UI-derived and can be misleading if the source is stale, the playlist is broken, or the server is ingesting but not delivering correctly.

### 3) No real multiview, no feed switching, no user selection

Evidence: There is no stateful camera selection mechanism or multiview composition in the app.

Impact: The client requirement for individual camera selection and multiview is not met regardless of the RTMP/HLS plumbing.

### 4) Localhost URLs are hardwired to local machine assumptions

Evidence: `apps/web/lib/config.ts` and `.env.example` default to `http://localhost:8888/...`.

Impact: This will fail in remote deployment unless the app is running on the same host or an equivalent DNS/proxy layer is configured.

### 5) No authentication, persistence, or admin protection

Evidence: There are no app routes, API handlers, or auth guards in the repo. No database or storage configuration was found.

Impact: Any realistic admin or community feature would need to be built from scratch with security rules and audit controls.

### 6) No evidence of load-capacity validation

Evidence: There is no load-test script, no benchmark data, and no production deployment configuration.

Impact: The target of 50/150/500 concurrent viewers cannot be claimed without real evidence.

### 7) Real streaming reliability remains unproven

Evidence: The project never ran a real RTMP publisher or a live HLS client test during the audit.

Impact: The main risk is not detection in code, but operational readiness: encoder setup, bitrate, bandwidth, latency, and network path still need to be validated.

---

## 8. Security assessment

| Location | Category | Severity | Finding | Recommendation |
| --- | --- | --- | --- | --- |
| `docker-compose.yml` | Public service exposure | Medium | MediaMTX exposes `1935` and `8888` directly on the host; this is acceptable for local testing but not a secure public production pattern | Restrict exposure via reverse proxy, firewall rules, and private network isolation |
| `apps/web/lib/config.ts` | Local-only URL assumptions | Medium | `localhost` URLs are not production-safe | Use environment-based public hostnames, not machine-local defaults |
| `streaming/mediamtx/mediamtx.yml` | Unprotected publishing path | High | `source: publisher` and no auth configuration present for stream publish endpoints | Add auth, allowlists, access controls, and rate protections before public exposure |
| `.env.example` | Secret handling | Low | No secret values are stored, but the project relies on env-based configuration without a secret store pattern | Centralize secret retrieval in a controlled environment system |
| `apps/web` | Missing admin security | High | No auth, authorization, or protected routes were found | Add signed-in/admin protections before any admin functionality is built |
| General repo state | Missing input validation | High | No backend or API layer exists, but future API work will require validation and rate limiting | Add validation at all server edges |
| General repo state | Missing monitoring and auditability | High | No logs, metrics, or alerting pipeline found | Add structured logs, health checks, and audit records |

No secrets were printed or exposed in this report. The inspection focused on verifying the presence of secure architecture patterns rather than dumping credentials.

---

## 9. Production-readiness assessment

### Local development
Status: Ready for a local static prototype only.

Why: The app builds, runs, and exposes a clean landing page and stream configuration boundary. However, no live RTMP/HLS end-to-end flow was tested.

### Functional MVP demonstration
Status: Partially ready.

Why: The front-end and MediaMTX plumbing are there, but the real stream path is unverified and the user-facing product experience is still thin.

### Private client testing
Status: Not ready without a real stream source and more feature completion.

### Public production launch
Status: Not ready.

Why: Production launch requires licensing, secure publish controls, public hosting, CDN, monitoring, failover, and a verified live ingest pipeline.

### Seven-day continuous streaming event
Status: Not ready.

Why: The repository lacks critical operational controls and the necessary event state management.

---

## 10. Audience capacity and infrastructure assessment

This section distinguishes measured facts from estimates.

### Measured facts

- The repository defines a local web app and a local MediaMTX service.
- The app uses `hls.js`, which is compatible with browser HLS playback but requires the underlying origin to serve valid HLS playlists.
- No actual traffic or stream load tests were run.

### Estimated risks and bottlenecks

#### 50 concurrent viewers
Likely manageable only with a single low-bitrate stream and a trusted origin/CDN. The primary bottlenecks are:

- stream bitrate and resolution,
- origin bandwidth,
- browser HLS buffering behavior,
- whether the origin is public and stable.

#### 150 concurrent viewers
Likely requires a real CDN or edge delivery layer. Without a CDN, origin bandwidth and concurrent HLS connection limits may become the bottleneck.

#### 500 concurrent viewers
This is not credible without a verified edge-delivery architecture, CDN caching, and capacity testing. A single origin or small hosting provider is likely to fail under this load if multiple feeds are watched simultaneously.

### Operational bottlenecks likely to matter

- Origin upload capacity for RTMP ingest and HLS output
- Per-stream bitrate and stream resolution selection
- Browser CPU/network limits when playing multiple feeds at once
- HLS segment retention and playlist stability
- MediaMTX resource usage under long-running ingest
- Event behavior during encoder failure, stream gap, or network loss
- Recovery time during long-running sessions

No evidence in the repo supports a claim of safe operation for 50, 150, or 500 viewers.

---

## 11. Prioritized implementation roadmap

### P0 — Critical blockers

1. Verify the real RTMP-to-HLS path with a live publisher and a working HLS endpoint.
   - Expected outcome: real stream ingest and playback path works reliably
   - Dependencies: OBS or equivalent publisher, MediaMTX, public or local origin access
   - Suggested approach: test with one stream, then expand to three cam paths
   - Acceptance criteria: each stream produces a valid `.m3u8` playlist and loads in the browser
   - Effort: 8–20 engineering hours
   - Risks: encoder setup, origin latency, playlist instability

2. Implement actual camera selection and feed lifecycle logic.
   - Expected outcome: choose between camera streams in the UI
   - Dependencies: real stream availability and state management
   - Suggested approach: use a camera state model and proper stream fallback handling
   - Acceptance criteria: user can switch active feed without stale UI state
   - Effort: 6–14 engineering hours
   - Risks: browser autoplay restrictions and feed mismatch

3. Build a real multiview experience for the three live feeds.
   - Expected outcome: split-screen or three-panel layout works on desktops and tablets
   - Dependencies: stable feed sources and responsive layout design
   - Acceptance criteria: all three feeds render and remain stable under load
   - Effort: 10–24 engineering hours
   - Risks: browser memory, GPU usage, and source bandwidth

### P1 — Required for launch

4. Add production-safe hosting, TLS, and public origin configuration.
5. Add monitoring, health checks, and alerting.
6. Add proper auth and admin protection for any control panel.
7. Add event-state management for goals, challenge progress, and duration tracking.
8. Add reliable persistence and content management for event state.

### P2 — Interactive features

9. Goals and challenge engine
10. Rankings and leaderboards
11. Donation and social metric integration
12. Polls and community voting
13. Admin CRUD for event configuration and content

### P3 — Scalability and optimization

14. CDN edge delivery for HLS
15. Cost-aware autoscaling and budget monitoring
16. Failover and redundancy design
17. Real load testing and capacity planning
18. Backup and recovery procedures

---

## 12. Estimated remaining engineering effort

This estimate covers the work needed to move the current static prototype closer to a launch-ready product.

| Workstream | Estimated effort |
| --- | ---: |
| Live-stream verification and reliability | 8–20 hours |
| Camera switching and multiview | 16–40 hours |
| Admin/auth/dashboard | 20–60 hours |
| Goals/challenges/rankings/statistics | 30–80 hours |
| Voting and community features | 20–50 hours |
| Production hosting, CDN, and scaling | 30–80 hours |
| Monitoring, alerting, and failover | 20–50 hours |
| QA, regression, and load tests | 20–60 hours |
| Total | 164–440+ engineering hours |

This is an engineering estimate, not a calendar estimate. The actual schedule depends on the product scope, client decisions, and the availability of external systems.

---

## 13. Questions requiring client decisions

1. Is the project intended to stay a local MVP, or does the client expect a public launch-ready product?
2. Are the three camera sources expected to be three truly independent live streams, or is one stream being used as a primary and two as backup/supplemental feeds?
3. Are the metrics sourced from Twitch APIs, an external donation platform, or a manual admin-managed dataset?
4. Does the client require a real admin panel, or is the brief only aspirational for future phases?
5. What is the priority: a demo for a single day, or a realistic seven-day continuous event with operational support?
6. What level of public audience is expected for the launch event, and what is the acceptable cost envelope?
7. Which external services are approved for donations, social stats, and public event management?

---

## 14. Final recommendation and launch blockers

### Recommendation

The repository should be treated as a promising front-end prototype and live-streaming foundation, not as a launch-ready system. The existing code proves that the project can display a branded landing page and route HLS URLs into a browser player, but the evidence is insufficient to support production claims.

### Launch blockers

- No verified real stream publishing path
- No proof of three live camera streams working simultaneously
- No real admin or auth system
- No event-state persistence or analytics pipeline
- No CDN, monitoring, or failover strategy
- No public hosting and secure publish controls
- No audience-capacity validation

### Five most important next actions

1. Verify a single live RTMP source produces a valid HLS stream and loads in the browser.
2. Confirm all three camera paths work independently and can be selected cleanly in the UI.
3. Decide the product boundary: minimal MVP demo vs. launch-ready seven-day event platform.
4. Define the data model and persistence strategy for goals, challenges, rankings, and polls.
5. Design the production architecture: secure streaming ingress, CDN, monitoring, and alerting before public readiness is considered.

---

## Final assessment

The repository is a credible local MVP foundation with a strong visual front end and a valid streaming architecture outline, but it does not yet satisfy the client brief in operational substance. The codebase is good enough for a prototype and for internal front-end review, but it is not ready for a public launch, seven-day continuous streaming, or a client-facing live event platform without further implementation and validation.

The strictest honest verdict is: a good front-end shell with incomplete product functionality and unverified live-stream operations.
