# Nginx

No package required — copy the Nginx configuration file.

See the full guide in [`nginx/README.md`](./nginx/README.md).

## Quick start

1. Copy [`nginx/nginx.conf`](./nginx/nginx.conf) (or the relevant `location` block) into your Nginx site config.
2. Set your `INDEXBOOST_TOKEN` via an environment variable or directly in the config.
3. Reload Nginx: `nginx -s reload`

## How it works

The Nginx config adds a `location` block that intercepts requests from known crawlers and proxies them to `https://render.getindexboost.com/`, passing your token via the `X-INDEXBOOST-TOKEN` header. All other traffic is served normally.
