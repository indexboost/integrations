# Akamai EdgeWorkers

No npm package required — deploy the EdgeWorkers script.

See the full guide in [`akamai/README.md`](./akamai/README.md).

## Quick start

1. Package [`akamai/src/main.js`](./akamai/src/main.js) and deploy it as an Akamai EdgeWorker.
2. Set `INDEXBOOST_TOKEN` as an EdgeWorker variable or embed it in the config.
3. Activate on your Akamai property.

## How it works

The EdgeWorker runs on the Akamai network, detects crawler `User-Agent` strings, and proxies those requests to `https://render.getindexboost.com/`. Human traffic passes through unchanged.
