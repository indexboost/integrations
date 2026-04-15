import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const RENDER_BASE = "https://render.getindexboost.com";

const DEFAULT_CRAWLERS =
  /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/i;

const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i;

export interface IndexBoostNextOptions {
  /**
   * Your IndexBoost render token.
   * Get it at app.getindexboost.com → Sites → your site → Render Tokens.
   */
  token: string;

  /**
   * Override the render service base URL.
   * @default "https://render.getindexboost.com"
   */
  serviceUrl?: string;

  /**
   * Custom regexp to match crawler User-Agents.
   * Replaces (not extends) the default pattern.
   */
  crawlerPattern?: RegExp;

  /**
   * Return `true` to skip render caching for a given request.
   *
   * @example
   * skip: (req) => req.nextUrl.pathname.startsWith('/admin')
   */
  skip?: (req: NextRequest) => boolean;

  /**
   * Timeout in milliseconds for render requests.
   * Note: Next.js Edge Runtime enforces its own limits (~30s).
   * @default 25000
   */
  timeout?: number;
}

/**
 * Creates a Next.js Middleware function that intercepts crawler requests and
 * returns rendered HTML from the IndexBoost render service.
 *
 * @example
 * // middleware.ts (project root)
 * import { createMiddleware } from "@indexboost/next";
 *
 * export const middleware = createMiddleware({
 *   token: process.env.INDEXBOOST_TOKEN!,
 * });
 *
 * export const config = {
 *   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
 * };
 */
export function createMiddleware(options: IndexBoostNextOptions) {
  if (!options.token) {
    throw new Error("[IndexBoost] token is required.");
  }

  const serviceUrl = (options.serviceUrl ?? RENDER_BASE).replace(/\/$/, "");
  const timeout = options.timeout ?? 25_000;
  const crawlerPattern = options.crawlerPattern ?? DEFAULT_CRAWLERS;

  return async function middleware(request: NextRequest): Promise<NextResponse> {
    const url = request.nextUrl;
    const ua = request.headers.get("user-agent") ?? "";

    // Only GET requests
    if (request.method !== "GET") {
      return NextResponse.next();
    }

    // Skip static assets
    if (STATIC_EXTENSIONS.test(url.pathname)) {
      return NextResponse.next();
    }

    // Skip Next.js internals
    if (
      url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/api/")
    ) {
      return NextResponse.next();
    }

    // Custom skip logic
    if (options.skip?.(request)) {
      return NextResponse.next();
    }

    // Not a crawler
    if (!crawlerPattern.test(ua)) {
      return NextResponse.next();
    }

    // ── Crawler detected — fetch rendered HTML ────────────────────────────

    const fullUrl = url.toString();

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
        // Fall through to Next.js on render error
        return NextResponse.next();
      }

      const html = await renderResponse.text();

      return new NextResponse(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-IndexBoost-Rendered": "true",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    } catch {
      // Render service error — fall through to Next.js
      return NextResponse.next();
    }
  };
}
