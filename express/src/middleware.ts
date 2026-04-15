import type { NextFunction, Request, Response } from "express";
import { isCrawler, isStaticAsset } from "./detector.js";
import type { IndexBoostOptions } from "./types.js";

const RENDER_BASE = "https://render.getindexboost.com";

/**
 * Creates an Express middleware that intercepts crawler requests and returns
 * rendered HTML from the IndexBoost render service.
 *
 * @example
 * import express from "express";
 * import { createMiddleware } from "@indexboost/node";
 *
 * const app = express();
 * app.use(createMiddleware({ token: process.env.INDEXBOOST_TOKEN }));
 */
export function createMiddleware(options: IndexBoostOptions) {
  if (!options.token) {
    throw new Error("[IndexBoost] token is required.");
  }

  const serviceUrl = (options.serviceUrl ?? RENDER_BASE).replace(/\/$/, "");
  const timeout = options.timeout ?? 30_000;

  return async function indexBoostMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const ua = req.headers["user-agent"] ?? "";

      // Only intercept GET/HEAD requests
      if (req.method !== "GET" && req.method !== "HEAD") {
        return next();
      }

      const pathname = req.path || (req.url?.split("?")[0] ?? "/");

      // Skip static assets
      if (isStaticAsset(pathname, options.ignoredExtensions)) {
        return next();
      }

      // Check crawler
      if (!isCrawler(ua, options.crawlerPattern)) {
        return next();
      }

      // Custom skip logic
      if (options.skip?.(req)) {
        return next();
      }

      // Build the full URL of the requested page
      const protocol = req.protocol || (req.secure ? "https" : "http");
      const host = req.get("host") ?? req.hostname;
      const fullUrl = `${protocol}://${host}${req.originalUrl ?? req.url}`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      let renderResponse: Response | globalThis.Response;
      try {
        renderResponse = await fetch(
          `${serviceUrl}/?url=${encodeURIComponent(fullUrl)}`,
          {
            method: "GET",
            headers: {
              "X-INDEXBOOST-TOKEN": options.token,
              "X-Original-User-Agent": ua,
            },
            signal: controller.signal,
          },
        );
      } catch {
        clearTimeout(timer);
        // Render service unreachable — fall through to the app
        return next();
      }

      clearTimeout(timer);

      if (!renderResponse.ok) {
        return next();
      }

      const html = await (renderResponse as globalThis.Response).text();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-IndexBoost-Rendered", "true");
      res.send(html);
    } catch {
      // Never crash the app
      next();
    }
  };
}
