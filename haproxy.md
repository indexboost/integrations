# HAProxy

No package required — copy the HAProxy configuration file.

See the full guide in [`haproxy/README.md`](./haproxy/README.md).

## Quick start

1. Copy [`haproxy/haproxy.cfg`](./haproxy/haproxy.cfg) rules into your HAProxy config.
2. Replace `YOUR_INDEXBOOST_TOKEN` with your actual token.
3. Reload HAProxy: `haproxy -f /etc/haproxy/haproxy.cfg -sf $(cat /run/haproxy.pid)`

## How it works

Uses HAProxy ACLs to detect crawler `User-Agent` strings and proxy matching requests to `https://render.getindexboost.com/` with the `X-INDEXBOOST-TOKEN` header.
