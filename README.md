# IndexBoost — Integrations

IndexBoost is a 100% server-side render cache. It works independently of your frontend framework (React, Angular, Vue, Svelte, etc.). What matters is **how** traffic is routed — and that is exactly what these integrations do.

## How it works

Each integration intercepts requests from web crawlers (Googlebot, GPTBot, ClaudeBot, Bingbot, etc.) and forwards them to the IndexBoost render service, which returns fully rendered HTML. Regular user traffic passes through to your app unchanged.

```
Crawler  → [Integration] → render.getindexboost.com → Rendered HTML → Crawler
User     → [Integration] → Your app (no change)
```

All integrations authenticate with a single header: `X-INDEXBOOST-TOKEN`.
Get your token at **[app.getindexboost.com](https://app.getindexboost.com) → Sites → your site → Render Tokens**.

---

## Integration categories

### 🟢 Web servers (config-only)

| Integration | Files |
|---|---|
| [Nginx](./nginx/) | `nginx-spa.conf`, `nginx-php.conf`, `nginx-proxy.conf` |
| [Apache](./apache/) | `.htaccess`, `httpd-vhost.conf` |
| [HAProxy](./haproxy/) | `haproxy.cfg` |
| [IIS](./iis/) | `web.config`, `IndexBoostModule.cs` |

### 🔵 CDN / Edge

| Integration | Package / Files |
|---|---|
| [Cloudflare Workers](./cloudflare/) | `worker.js` + `wrangler.toml` |
| [CloudFront Lambda@Edge](./cloudfront/) | `lambda/index.js` |
| [Netlify Edge Functions](./netlify/) | `netlify/edge-functions/render.ts` |
| [Fastly VCL](./fastly/) | `fastly.vcl` |
| [Akamai EdgeWorkers](./akamai/) | `src/main.js` |
| [Vercel](./vercel/) | `api/render.js` + `vercel.json` |

### 🟣 Node.js

| Integration | npm package | Adapters |
|---|---|---|
| [Express](./express/) | [`@indexboost/node`](https://www.npmjs.com/package/@indexboost/node) | Express, Koa, Hapi |
| [Next.js](./nextjs/) | [`@indexboost/next`](https://www.npmjs.com/package/@indexboost/next) | App Router, Pages Router |
| [Nuxt 3](./nuxt/) | [`@indexboost/nuxt`](https://www.npmjs.com/package/@indexboost/nuxt) | Nitro server middleware |

### 🟡 Backend frameworks

| Integration | Package |
|---|---|
| [Laravel (PHP)](./laravel/) | [`indexboost/laravel`](https://packagist.org/packages/indexboost/laravel) |
| [Symfony (PHP)](./symfony/) | Event subscriber (copy to `src/`) |
| [Django (Python)](./django/) | [`indexboost-django`](https://pypi.org/project/indexboost-django/) |
| [Rails (Ruby)](./rails/) | [`indexboost-rails`](https://rubygems.org/gems/indexboost-rails) |
| [Spring Boot (Java)](./spring/) | Copy `IndexBoostInterceptor.java` |
| [ASP.NET Core (C#)](./aspnet/) | [`IndexBoost.AspNetCore`](https://www.nuget.org/packages/IndexBoost.AspNetCore) |

### ⚪ Hosting platforms

| Integration | Notes |
|---|---|
| [Firebase Hosting](./firebase/) | Cloud Function as render proxy |
| [Docker](./docker/) | Nginx sidecar via docker-compose |

### 🔴 No-code

| Integration | Notes |
|---|---|
| [Bubble.io](./bubble/) | Route via Cloudflare Worker in front of Bubble |

---

## API contract

All integrations call the same endpoint:

```
GET https://render.getindexboost.com/?url={encoded_url}
X-INDEXBOOST-TOKEN: <your_token>
```

The service returns fully rendered HTML with status 200 on success, or a non-2xx status on error — in which case all integrations fall back to the origin transparently.

---

## Repository structure

```
akamai/          Akamai EdgeWorkers JS
apache/          Apache .htaccess + VirtualHost
aspnet/          ASP.NET Core NuGet package
bubble/          Bubble.io no-code guide
cloudflare/      Cloudflare Worker + wrangler.toml
cloudfront/      AWS Lambda@Edge
django/          indexboost-django pip package
docker/          Docker Compose + Nginx sidecar
express/         @indexboost/node (Express / Koa / Hapi)
fastly/          Fastly VCL
firebase/        Firebase Hosting + Cloud Function
haproxy/         HAProxy config
iis/             IIS web.config + HTTP Module
laravel/         indexboost/laravel Composer package
nextjs/          @indexboost/next
nginx/           Nginx configs (SPA / PHP / Proxy)
nuxt/            @indexboost/nuxt
rails/           indexboost-rails gem
spring/          Spring Boot interceptor
symfony/         Symfony EventSubscriber
vercel/          Vercel Edge Function
```

---

## Publishing

Packages are published automatically via GitHub Actions when a version tag is pushed:

| Tag pattern | Registry | Package |
|---|---|---|
| `node/v*` | npm | `@indexboost/node` |
| `next/v*` | npm | `@indexboost/next` |
| `nuxt/v*` | npm | `@indexboost/nuxt` |
| `django/v*` | PyPI | `indexboost-django` |
| `rails/v*` | RubyGems | `indexboost-rails` |
| `aspnet/v*` | NuGet | `IndexBoost.AspNetCore` |
| `laravel/v*` | Packagist | `indexboost/laravel` |

Example: `git tag node/v1.2.0 && git push origin node/v1.2.0`

---

## License

MIT — © IndexBoost


