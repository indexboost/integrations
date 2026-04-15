# Docker

No special package required — use the provided Docker Compose configuration.

See the full guide in [`docker/README.md`](./docker/README.md).

## Quick start

1. Copy [`docker/docker-compose.yml`](./docker/docker-compose.yml) (or the relevant service block) into your project.
2. Set `INDEXBOOST_TOKEN` in your `.env` file or Docker environment.
3. Run: `docker compose up -d`

## How it works

The Docker Compose setup runs an Nginx sidecar that intercepts crawler traffic and proxies it to `https://render.getindexboost.com/`. Your main application container continues to serve all other requests normally.
