# IIS (Internet Information Services)

No package required — copy the `web.config` file.

See the full guide in [`iis/README.md`](./iis/README.md).

## Quick start

1. Copy [`iis/web.config`](./iis/web.config) into your application root.
2. Replace `YOUR_INDEXBOOST_TOKEN` with your actual token.
3. Ensure the `URL Rewrite` and `Application Request Routing` (ARR) IIS modules are installed.

## How it works

Uses IIS URL Rewrite rules to detect crawler requests and proxy them to `https://render.getindexboost.com/` with the required `X-INDEXBOOST-TOKEN` header.
