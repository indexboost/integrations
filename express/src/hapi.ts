import type { Lifecycle, Plugin, Request, ResponseToolkit, Server } from "@hapi/hapi";
import { isCrawler, isStaticAsset } from "./detector.js";
import type { IndexBoostOptions } from "./types.js";

const RENDER_BASE = "https://render.getindexboost.com";

/**
 * Hapi plugin that intercepts crawler requests and returns rendered HTML
 * from the IndexBoost render service.
 *
 * @example
 * import Hapi from "@hapi/hapi";
 * import { indexBoostHapiPlugin } from "@indexboost/node/hapi";
 *
 * const server = Hapi.server({ port: 3000 });
 * await server.register({ plugin: indexBoostHapiPlugin, options: { token: process.env.INDEXBOOST_TOKEN } });
 */
export const indexBoostHapiPlugin: Plugin<IndexBoostOptions> = {
  name: "indexboost-render",
  version: "1.0.0",
  once: true,

  register(server: Server, options: IndexBoostOptions): void {
    if (!options.token) {
      throw new Error("[IndexBoost] token is required.");
    }

    const serviceUrl = (options.serviceUrl ?? RENDER_BASE).replace(/\/$/, "");
    const timeout = options.timeout ?? 30_000;

    server.ext("onPreResponse", async (request: Request, h: ResponseToolkit): Promise<Lifecycle.ReturnValue> => {
      const ua = request.headers["user-agent"] ?? "";

      if (request.method !== "get") return h.continue;
      if (isStaticAsset(request.path, options.ignoredExtensions)) return h.continue;
      if (!isCrawler(ua, options.crawlerPattern)) return h.continue;
      if (options.skip?.(request.raw.req)) return h.continue;

      const url = request.url;
      const fullUrl = `${url.protocol}//${url.host}${url.pathname}${url.search}`;

      try {
        const res = await fetch(
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

        if (!res.ok) return h.continue;

        return h.response(await res.text())
          .type("text/html; charset=utf-8")
          .header("X-IndexBoost-Rendered", "true");
      } catch {
        return h.continue;
      }
    });
  },
};
