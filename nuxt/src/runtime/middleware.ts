import { defineEventHandler, sendStream, setResponseHeader } from "h3";

const CRAWLERS =
  /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/i;

const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i;

export default defineEventHandler(async (event) => {
  const url = event.node.req.url ?? "/";
  const pathname = url.split("?")[0];
  const ua = event.node.req.headers["user-agent"] ?? "";
  const method = event.node.req.method ?? "GET";

  // Only intercept GET, non-static
  if (method !== "GET" || STATIC_EXTENSIONS.test(pathname)) return;
  if (url.startsWith("/_nuxt/") || url.startsWith("/api/")) return;
  if (!CRAWLERS.test(ua)) return;

  // Read runtime config set by the module
  const config = (event.context.nitro?.runtimeConfig ?? {}) as {
    indexboost?: { token: string; serviceUrl: string };
  };
  const { token, serviceUrl = "https://render.getindexboost.com" } =
    config.indexboost ?? {};

  if (!token) return;

  const host =
    event.node.req.headers["x-forwarded-host"] ??
    event.node.req.headers.host ??
    "localhost";
  const proto =
    (event.node.req.headers["x-forwarded-proto"] as string) ?? "https";
  const fullUrl = `${proto}://${host}${url}`;

  try {
    const res = await fetch(
      `${serviceUrl.replace(/\/$/, "")}/?url=${encodeURIComponent(fullUrl)}`,
      {
        headers: {
          "X-INDEXBOOST-TOKEN": token,
          "X-Original-User-Agent": ua,
        },
        signal: AbortSignal.timeout(25_000),
      },
    );

    if (!res.ok) return;

    setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
    setResponseHeader(event, "X-IndexBoost-Rendered", "true");
    setResponseHeader(event, "Cache-Control", "public, max-age=3600, s-maxage=3600");

    await sendStream(event, res.body as NonNullable<typeof res.body>);
  } catch {
    // Fall through to Nuxt SSR/SSG
  }
});
