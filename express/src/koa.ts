import type { Context, Middleware, Next } from "koa";
import { isCrawler, isStaticAsset } from "./detector.js";
import type { IndexBoostOptions } from "./types.js";

const RENDER_BASE = "https://render.getindexboost.com";

/**
 * Creates a Koa middleware that intercepts crawler requests and returns
 * rendered HTML from the IndexBoost render service.
 *
 * @example
 * import Koa from "koa";
 * import { createKoaMiddleware } from "@indexboost/node/koa";
 *
 * const app = new Koa();
 * app.use(createKoaMiddleware({ token: process.env.INDEXBOOST_TOKEN }));
 */
export function createKoaMiddleware(options: IndexBoostOptions): Middleware {
  if (!options.token) {
    throw new Error("[IndexBoost] token is required.");
  }

  const serviceUrl = (options.serviceUrl ?? RENDER_BASE).replace(/\/$/, "");
  const timeout = options.timeout ?? 30_000;

  return async function indexBoostKoaMiddleware(ctx: Context, next: Next): Promise<void> {
    const ua = ctx.get("user-agent") ?? "";

    if (ctx.method !== "GET" && ctx.method !== "HEAD") {
      return next();
    }

    const pathname = ctx.path;

    if (isStaticAsset(pathname, options.ignoredExtensions)) {
      return next();
    }

    if (!isCrawler(ua, options.crawlerPattern)) {
      return next();
    }

    if (options.skip?.(ctx.req)) {
      return next();
    }

    const protocol = ctx.protocol ?? "https";
    const host = ctx.host;
    const fullUrl = `${protocol}://${host}${ctx.originalUrl}`;

    try {
      const renderResponse = await fetch(
        `${serviceUrl}/?url=${encodeURIComponent(fullUrl)}`,
        {
          method: "GET",
          headers: {
            "X-INDEXBOOST-TOKEN": options.token,
            "X-Original-User-Agent": ua,
          },
          signal: AbortSignal.timeout(timeout),
        },
      );

      if (!renderResponse.ok) {
        return next();
      }

      ctx.set("Content-Type", "text/html; charset=utf-8");
      ctx.set("X-IndexBoost-Rendered", "true");
      ctx.body = await renderResponse.text();
    } catch {
      return next();
    }
  };
}
