# Environment Variables

Configure values separately for local development, Vercel Preview, and Vercel Production. Never put secrets in `NEXT_PUBLIC_*` variables or commit populated environment files.

| Variable | Required | Purpose and handling |
| --- | --- | --- |
| `NEXT_PUBLIC_TWITCH_CHANNEL` | No | Public Twitch channel name; defaults to `dantefdd`. Used for the official player and direct-channel fallback. |
| `TWITCH_PARENT_HOSTS` | For custom production hostnames | Comma-separated exact hostnames permitted as Twitch embed parents, such as `live.example.com,www.example.com`. Do not include a scheme, port, path, wildcard, or forwarded host value. This list is public configuration, not a secret. |
| `NEXT_PUBLIC_STREAM_CAM1_URL` | Optional locally; required when camera 1 is enabled | Public HLS playback URL. Use HTTPS in Preview/Production. Visible to browser clients. |
| `NEXT_PUBLIC_STREAM_CAM2_URL` | Optional locally; required when camera 2 is enabled | Public HLS playback URL. Use HTTPS in Preview/Production. Visible to browser clients. |
| `NEXT_PUBLIC_STREAM_CAM3_URL` | Optional locally; required when camera 3 is enabled | Public HLS playback URL. Use HTTPS in Preview/Production. Visible to browser clients. |
| `SUPABASE_URL` | Required by the configured event store | Supabase project URL. Server-side only. |
| `SUPABASE_SERVICE_ROLE_KEY` | Required by the configured event store | Privileged Supabase key. Server-only secret; never expose to browser code. |
| `TWITCH_CLIENT_ID` | Required for admin OAuth | Twitch OAuth application client ID. Server-side configuration. |
| `TWITCH_CLIENT_SECRET` | Required for admin OAuth | Twitch OAuth application secret. Server-only secret. |
| `ADMIN_TWITCH_USER_ID` | Required for admin OAuth | Stable Twitch user ID authorized to administer the event. Server-side configuration. |
| `TWITCH_REDIRECT_URI` | Required for admin OAuth | Exact registered OAuth callback URL for the environment. Server-side configuration. |

## Twitch Parent Host Strategy

Twitch requires a `parent` parameter matching the hostname that serves the embed. `/api/twitch-parent` returns the exact approved hostname list from server configuration; it does not read `Host`, `Forwarded`, or `X-Forwarded-Host` headers. The browser then reads `window.location.hostname` and renders the iframe only when that exact hostname matches the returned list.

- Local development allows `localhost` and `127.0.0.1` when `NODE_ENV` is not `production`.
- Vercel deployment URLs are included from the platform's exact `VERCEL_URL` and `VERCEL_BRANCH_URL` system values. Do not copy these from request headers or manually turn them into wildcard rules.
- Add the canonical production hostname and `www` alias, if used, to `TWITCH_PARENT_HOSTS` in the relevant Vercel environment.
- Configure only explicitly approved stable Preview aliases in `TWITCH_PARENT_HOSTS`; per-deployment Vercel hostnames are included automatically.
- The player remains disabled with a direct Twitch link when its current hostname is not approved or the allowlist endpoint is unavailable.

The hostnames are sent to the browser because Twitch's embed URL is public. Do not put credentials in this variable. Add or change the values in Vercel's Preview/Production environment settings, then redeploy. Verify each deployed hostname, including both canonical and `www`, in a real browser.

## Vercel System Values

`VERCEL_URL` and `VERCEL_BRANCH_URL` are supplied by Vercel and are not user-defined secrets. The API uses them at runtime to include the current deployment and branch alias exactly. For non-Vercel hosting, add each approved hostname to `TWITCH_PARENT_HOSTS`.

## Local Setup

Copy `.env.example` to `.env.local` and set only values needed for local work. Leave `TWITCH_PARENT_HOSTS` empty for localhost; local hostnames are added automatically outside production. Camera feeds remain independent of Twitch and require separate reachable HLS URLs.