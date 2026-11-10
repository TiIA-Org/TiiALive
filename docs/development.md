# Development guide

## Local web app

```bash
cd apps/web
npm install
npm run dev
```

Copy the repository `.env.example` to `apps/web/.env.local` for local development. Keep server-only OAuth and Supabase keys out of `NEXT_PUBLIC_*` variables. Leave stream URL values empty until you have valid playback endpoints; empty feeds are displayed as not configured.

## Local stream testing

MediaMTX is configured by `streaming/mediamtx/mediamtx.yml`, and `docker compose up -d mediamtx` runs only the local media server. OBS can publish to the `cam1`, `cam2`, and `cam3` paths on local RTMP. Browser playback URLs must be set explicitly for the local host. This local setup is not safe for public deployment.

## Tests and checks

```bash
cd apps/web
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

Route and authentication tests use mocks and do not prove that Twitch OAuth, Supabase, or MediaMTX is configured. Validate those integrations against isolated staging services.

## Environment configuration

Variable names, server/public visibility, OAuth callback setup, and Preview/Production guidance are listed in [deployment.md](deployment.md). Do not copy production secrets into local development or commit environment files.
