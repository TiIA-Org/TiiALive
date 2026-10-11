# Development Guide

## Local setup

```bash
cd apps/web
npm install
npm run dev
```

## Environment variables

Copy the sample file and adjust stream URLs if needed:

```bash
cp .env.example .env
```

## Frontend structure

- `app/` contains the route, layout, and metadata.
- `components/` contains reusable UI pieces.
- `lib/` holds the stream config and helper logic.

## Validation

```bash
npm run lint
npm run test
npm run build
```

## Notes

The site intentionally keeps stream configuration centralized to make future API or CMS integration straightforward.
