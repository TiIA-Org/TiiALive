# Architecture

## Current MVP

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

The current version uses MediaMTX to accept RTMP streams and expose HLS endpoints to the frontend. The Next.js site reads the configured HLS URLs and renders them in the live page.

## Future Architecture

```text
OBS
 ↓
Primary + Backup
 ↓
Failover
 ↓
Streaming Layer
 ↓
CDN
 ↓
Website
```

This future layer is intentionally not implemented in the MVP. It would add redundancy, production routing, and scaled delivery to support a larger audience.
