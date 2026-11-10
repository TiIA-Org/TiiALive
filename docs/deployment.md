# Deployment model

## Responsibilities

- **Vercel:** Next.js public site, authenticated admin routes, and server-side calls to Supabase and Twitch OAuth.
- **Supabase:** persistent event/configuration state and revocable admin sessions. The service-role key is server-only.
- **Streaming infrastructure:** MediaMTX or a managed streaming provider for RTMP ingest and HLS delivery. Vercel functions do not host MediaMTX or continuous ingest.
- **CDN/origin controls:** required for public HLS delivery at event scale. Production host, TLS, CORS, cache policy, ingest authentication, and origin restrictions must be configured on the media infrastructure.

## Local development

`docker compose up` is a development stack. It runs `next dev` and a `bluenviron/mediamtx:latest` container with local ports; it is not a production deployment recipe. Configure `NEXT_PUBLIC_STREAM_CAM1_URL`, `NEXT_PUBLIC_STREAM_CAM2_URL`, and `NEXT_PUBLIC_STREAM_CAM3_URL` only with safe playback URLs. These variables are public in the browser. Never put RTMP publish keys in `NEXT_PUBLIC_*` variables.

## Database setup

1. Create an isolated development or staging Supabase project.
2. Review and apply `supabase/migrations/202610160001_create_tiia_event_state.sql` to that non-production project.
3. Configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-only values. Do not use a `NEXT_PUBLIC_` prefix for the service-role key.
4. Verify reads, updates, optimistic version conflicts, admin session revocation, and backup/restore in staging.
5. Apply the migration to production only through the client’s approved change process after backup and review. This repository task has not run any migration.

The migration is additive and initializes only empty event arrays and disabled camera entries. Existing committed JSON remains as a local reference; it is no longer a runtime persistence layer.

## Admin sign-in

Admin login uses Twitch OAuth authorization-code flow with the minimum `openid` scope and verifies the token through Twitch’s `/validate` endpoint before comparing the returned user ID with `ADMIN_TWITCH_USER_ID`. Register a Twitch OAuth app and the exact callback `https://<approved-host>/api/admin/callback`; for local development use the corresponding local callback. Do not put OAuth secrets in client code. Add Preview and Production callback values in the Twitch developer console only after deciding which stable hostnames to support. See [Twitch authorization code flow](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/) and [token validation](https://dev.twitch.tv/docs/authentication/validate-tokens/).

The Twitch player uses Twitch's official `player.twitch.tv` embed with autoplay disabled by default. The browser reads its actual `window.location.hostname` after hydration and compares it against `/api/twitch-parent`; it never derives trust from `Host`, `Forwarded`, or `X-Forwarded-Host` request headers. The API allowlist contains exact hostnames from `TWITCH_PARENT_HOSTS` plus Vercel's exact `VERCEL_URL` and `VERCEL_BRANCH_URL` system values. Localhost is allowed only outside production. Wildcards and suffix matching are not accepted. Add the canonical production hostname and its `www` alias, if used, to `TWITCH_PARENT_HOSTS` in the relevant Vercel environment. Vercel Preview deployments use their exact generated deployment/branch hostname; the browser renders the iframe only when its current hostname matches an approved entry. Configure the Vercel system variables normally and do not manually copy a forwarded host into the allowlist.

The player container is responsive at a 16:9 ratio and provides a direct-channel fallback when the domain is not approved or the iframe reports an error. Twitch's player has documented minimum dimensions; verify the embed on narrow mobile devices and use the direct link if Twitch does not render at the device's available width. See the official [Twitch embed documentation](https://dev.twitch.tv/docs/embed/everything/).

## Vercel environment variables

Configure public values in Preview and Production only when known:

| Variable | Purpose | Visibility |
|---|---|---|
| `NEXT_PUBLIC_TWITCH_CHANNEL` | Public Twitch channel name; defaults to the existing `dantefdd` reference | Browser-visible |
| `NEXT_PUBLIC_STREAM_CAM1_URL` | Public HTTPS HLS playback URL for camera 1 | Browser-visible |
| `NEXT_PUBLIC_STREAM_CAM2_URL` | Public HTTPS HLS playback URL for camera 2 | Browser-visible |
| `NEXT_PUBLIC_STREAM_CAM3_URL` | Public HTTPS HLS playback URL for camera 3 | Browser-visible |
| `SUPABASE_URL` | Supabase project REST URL | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged REST access for the app’s server routes | Server-only secret |
| `TWITCH_CLIENT_ID` | Twitch OAuth application client ID | Server environment; public identifier but keep server-side here |
| `TWITCH_CLIENT_SECRET` | Twitch OAuth code exchange | Server-only secret |
| `ADMIN_TWITCH_USER_ID` | Stable Twitch user ID allowed to administer the event | Server-only configuration |
| `TWITCH_REDIRECT_URI` | Exact registered OAuth callback URI for that environment | Server-only configuration |

The example file leaves infrastructure values blank. No production domain, camera URL, database project, OAuth app, or credentials were inferred or inserted.

## Preview and production procedure

1. Apply the additive migration to an isolated staging project and configure Preview credentials.
2. Use a stable preview hostname and register its exact Twitch OAuth callback. Verify the channel identity and administrator Twitch ID independently.
3. Configure only staging HLS URLs and verify each path through actual RTMP-to-HLS playback and HTTPS browser playback.
4. Review the Vercel Preview site, admin authorization, database behavior, player states, keyboard/accessibility basics, and the test suite.
5. Confirm external media access control, CDN cache behavior, expected egress, monitoring, and operator ownership.
6. For production, back up the database, apply the additive migration through the approved process, configure Production values, and use a Vercel Preview deployment for final acceptance.
7. Promote only after authorized approval and a production smoke plan. No deployment or production change was performed during this implementation.

## Security and operational limits

Login attempts are counted in the shared Supabase rate-limit table, so the limit applies across serverless instances. An edge/WAF limit for `/api/admin/login` and `/api/admin/callback` remains recommended as an additional perimeter control. The current health endpoint reports web-process liveness only; MediaMTX ingest, database readiness, and individual HLS freshness require separate monitoring.

Use an independent monitoring and backup plan for streaming infrastructure and database. Keep web and media deployment/rollback independent. Do not roll back to a build that re-enables the former fixed-cookie admin behavior without first restricting admin routes at the edge.
