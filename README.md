# TiiA Live

## Description
TiiA Live is a live streaming MVP for streamer DanteFDD. It combines a premium landing page with a multi-camera HLS architecture built around MediaMTX and a Next.js frontend.

## Client
DanteFDD

## Architecture

```text
OBS
 ↓
RTMP
 ↓
MediaMTX
 ↓
HLS
 ↓
Next.js
 ↓
Browser
```

## Requirements
- Docker
- Docker Compose
- Node.js 20+
- OBS Studio

## Installation
1. Clone the repo.
2. Copy `.env.example` to `.env` if you need custom stream URLs.
3. Install frontend dependencies in `apps/web`:
   ```bash
   cd apps/web
   npm install
   ```
4. Start the stack:
   ```bash
   cd ../..
   docker compose up -d
   ```

## Running
```bash
docker compose up -d
```

## Development
```bash
cd apps/web
npm run dev
```

## OBS Configuration
Use one OBS instance per stream if you want three independent broadcast feeds. The streaming server is prepared for:
- `rtmp://localhost/cam1`
- `rtmp://localhost/cam2`
- `rtmp://localhost/cam3`

OBS stream setup examples:
- Server: `rtmp://localhost`
- Stream key: `cam1`
- Stream key: `cam2`
- Stream key: `cam3`

Important: three simultaneous RTMP outputs may require multiple OBS outputs, multiple OBS instances, a capture plugin, or a more capable encoding setup. This MVP focuses on preparing the server and frontend to accept the three feed paths.

## HLS Endpoints
- `http://localhost:8888/cam1/index.m3u8`
- `http://localhost:8888/cam2/index.m3u8`
- `http://localhost:8888/cam3/index.m3u8`

## Troubleshooting
- Stream offline: confirm the RTMP source is connected to the expected path.
- CORS: same-origin HLS requests in the browser usually work without extra CORS config.
- HLS not playing: check MediaMTX logs and the HLS URL path.
- Autoplay blocked: the player is muted by default to respect browser restrictions.
- MediaMTX not starting: verify docker ports 1935 and 8888 are free.
- Port occupied: change the published ports in `docker-compose.yml`.

## Production Roadmap
- V1: Local MVP
- V2: Cloud deployment
- V3: CDN
- V4: Monitoring
- V5: Failover
- V6: TiiA Live Platform

## Notes
This project intentionally avoids complex failover, backend auth, or cloud infrastructure in the MVP. It prepares for those features without implementing them yet.
