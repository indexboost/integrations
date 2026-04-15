# Fastly

No npm package required — copy the Fastly VCL configuration.

See the full guide in [`fastly/README.md`](./fastly/README.md).

## Quick start

1. Copy the VCL snippets from [`fastly/`](./fastly/) into your Fastly service configuration.
2. Replace `YOUR_INDEXBOOST_TOKEN` with your actual token.
3. Deploy your Fastly service.

## How it works

Custom VCL detects crawler `User-Agent` strings at the edge and rewrites those requests to proxy through `https://render.getindexboost.com/` with your `X-INDEXBOOST-TOKEN` header.
