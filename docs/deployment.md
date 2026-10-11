# Deployment Guide

## Local deployment

```bash
docker compose up -d
```

## Web service

The web service runs on port `3000` and should be used for local preview and frontend checks.

## MediaMTX service

MediaMTX listens on:
- RTMP: `1935`
- HLS: `8888`

## Production notes

This MVP is intended for local or staging use. Production deployment should layer in a CDN, monitoring, and failover strategy before exposing the platform to a large audience.
