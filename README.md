# Renderfy — Integrations

Renderfy é um componente 100% server-side. Ele funciona independentemente do framework frontend (React, Angular, Vue, Svelte, etc.). O que importa é **como** os arquivos estáticos são servidos — e é nesse ponto que as integrações atuam.

## Como funciona

Cada integração intercepta requisições de crawlers (Googlebot, GPTBot, Bingbot, etc.) e redireciona essas requisições para o serviço Renderfy, que retorna HTML pré-renderizado. O fluxo é:

```
Crawler → [Integração] → Renderfy API → HTML renderizado → Crawler
Usuário normal → [Integração] → SPA/App original (sem alteração)
```

## Categorias de integração

### 🟢 Web Servers (config-only — sem código Renderfy)
Integrações baseadas em configuração do servidor. O usuário adiciona regras de rewrite/proxy no config do servidor.

| Integração | Tipo | Código necessário |
|---|---|---|
| [Nginx](./nginx.md) | Config | Não — apenas nginx.conf |
| [Apache](./apache.md) | Config | Não — apenas .htaccess |
| [IIS](./iis.md) | Config | Não — URL Rewrite rules |

### 🔵 CDN / Edge (config + worker script)
Integrações em CDNs que interceptam no edge antes de chegar ao origin server.

| Integração | Tipo | Código necessário |
|---|---|---|
| [Cloudflare](./cloudflare.md) | Worker (JS) | Worker script fornecido por nós |
| [CloudFront](./cloudfront.md) | Lambda@Edge | Lambda function fornecida por nós |
| [Fastly](./fastly.md) | VCL/Compute | VCL config fornecida por nós |
| [Akamai](./akamai.md) | EdgeWorkers | Config fornecida por nós |
| [Netlify](./netlify.md) | Edge Functions | _redirects / netlify.toml |

### 🟣 Node.js Middleware (pacote npm)
Middleware que se instala no servidor Node.js do usuário.

| Integração | Tipo | Código necessário |
|---|---|---|
| [Express.js](./express.md) | npm middleware | Sim — pacote `renderfy-node` |
| [Nuxt.js](./nuxt.md) | Nuxt module | Sim — pacote `renderfy-nuxt` |
| [Next.js](./nextjs.md) | Next middleware | Sim — pacote `renderfy-next` |
| [Koa](./koa.md) | Koa middleware | Sim — pacote `renderfy-node` |
| [Hapi](./hapi.md) | Hapi plugin | Sim — pacote `renderfy-node` |

### 🟡 Backend Frameworks (pacote/gem/pip)
Middleware nativo para frameworks backend populares.

| Integração | Tipo | Código necessário |
|---|---|---|
| [Rails (Ruby)](./rails.md) | Rack middleware | Sim — gem `renderfy_rails` |
| [Laravel (PHP)](./laravel.md) | HTTP middleware | Sim — pacote `renderfy/laravel` |
| [Symfony (PHP)](./symfony.md) | Event subscriber | Sim — pacote `renderfy/symfony` |
| [Django (Python)](./django.md) | WSGI middleware | Sim — pacote `renderfy-django` |
| [Spring (Java)](./spring.md) | Filter/Interceptor | Sim — pacote Maven |
| [ASP.NET (C#)](./aspnet.md) | DelegatingHandler | Sim — NuGet package |

### ⚪ Hosting Platforms (config-only)
Plataformas de hosting que usam configs específicas.

| Integração | Tipo | Código necessário |
|---|---|---|
| [Firebase](./firebase.md) | Cloud Functions | Cloud Function + Cloudflare |
| [Vercel](./vercel.md) | Edge Middleware | Sim — middleware.ts |
| [Docker](./docker.md) | Reverse proxy | Não — docker-compose config |

### 🔴 Plataformas No-Code
| Integração | Tipo | Código necessário |
|---|---|---|
| [Bubble.io](./bubble.md) | Cloudflare Worker | Via Cloudflare (sem código no Bubble) |

## Prioridades de implementação

### Fase 1 — Core (MVP)
1. **Nginx** — maior base de usuários
2. **Cloudflare** — CDN mais popular
3. **Express.js** — Node.js é o stack mais comum pra SPAs
4. **Apache** — segundo servidor web mais usado
5. **Docker** — self-hosted

### Fase 2 — Frameworks
6. **Laravel** — PHP líder de mercado
7. **Django** — Python líder de mercado
8. **Rails** — Ruby community
9. **Symfony** — PHP enterprise
10. **Next.js** — SSR/SSG combo

### Fase 3 — CDN / Edge
11. **CloudFront** — AWS ecosystem
12. **Fastly** — high-performance CDN
13. **Netlify** — JAMstack
14. **Vercel** — Next.js hosting
15. **Akamai** — enterprise CDN

### Fase 4 — Complementar
16. **Nuxt.js** — Vue ecosystem
17. **IIS** — Windows servers
18. **Spring (Java)** — enterprise Java
19. **ASP.NET** — .NET ecosystem
20. **Koa / Hapi** — Node.js alternativo
21. **Firebase** — Google hosting
22. **Bubble.io** — no-code
