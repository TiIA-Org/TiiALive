# TiiA Live

TiiA Live is the public event site for DanteFDD. The homepage uses the official Twitch player as its main broadcast and supports three separately configured MediaMTX/HLS camera sources below it. Event configuration is stored in Supabase; donation, follower, subscription, and poll submission integrations are not currently connected.

## Development

Requirements: Node.js 20+, npm, Docker, Docker Compose, and OBS only when testing local ingest.

```bash
cd apps/web
npm install
npm run dev
```

Copy `.env.example` to a local `.env.local` and fill only the development values you have configured. For actual persistent-data or OAuth testing, use an isolated development Supabase project and a registered Twitch OAuth application. Do not use production credentials or stream publish keys in browser-visible environment variables.

To run the local MediaMTX development container:

```bash
docker compose up -d mediamtx
```

The Compose MediaMTX host is local development scaffolding. It does not configure public ingest, TLS, authentication, or production HLS delivery. The web Compose service runs `next dev`; it is not a production container.

## Verification

```bash
cd apps/web
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

The build fetches Google Fonts during compilation; environments without access to Google Fonts need network access or a separately reviewed self-hosted font change.

## Deployment

Keep Next.js on Vercel. Run continuous RTMP ingest and HLS packaging on a managed streaming provider or suitable external infrastructure, with HTTPS/CDN delivery. Configure persistent state and admin OAuth as described in [docs/deployment.md](docs/deployment.md). No production infrastructure, Vercel settings, or migrations are changed by this repository.

See [docs/architecture.md](docs/architecture.md), [docs/deployment.md](docs/deployment.md), and [docs/development.md](docs/development.md) for details. The older [project audit](docs/PROJECT_AUDIT_REPORT.md) is retained as a historical snapshot and is superseded by the current implementation and deployment documentation.
