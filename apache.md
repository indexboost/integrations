# Apache

No package required — copy the Apache config file or `.htaccess` block.

See the full guide in [`apache/README.md`](./apache/README.md).

## Quick start

1. Copy [`apache/httpd-vhost.conf`](./apache/httpd-vhost.conf) rules into your virtual host config, **or** copy [`apache/.htaccess`](./apache/.htaccess) to your document root.
2. Set `INDEXBOOST_TOKEN` in your Apache environment (`SetEnv` or OS env).
3. Reload Apache: `apachectl graceful`

## How it works

Uses `mod_rewrite` and `mod_proxy` to detect crawler `User-Agent` strings and proxy those requests to `https://render.getindexboost.com/` with your token header.
