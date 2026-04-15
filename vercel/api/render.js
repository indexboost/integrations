// IndexBoost Render — Vercel Edge Function
//
// Place this file at: api/render.js (or api/render.ts)
// Then configure vercel.json (see vercel.json in this folder) to route
// crawler requests through it.
//
// Replace:
//   INDEXBOOST_TOKEN environment variable → set in Vercel Dashboard
//     (Project → Settings → Environment Variables)

export const config = {
  runtime: "edge",
};

const RENDER_BASE = "https://render.getindexboost.com";

const CRAWLERS =
  /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/i;

const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i;

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export default async function handler(request) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") || "";
  const token = process.env.INDEXBOOST_TOKEN;

  // Must be a GET request and a crawler
  if (request.method !== "GET" || STATIC_EXTENSIONS.test(url.pathname) || !CRAWLERS.test(ua)) {
    return new Response("Not a crawler", { status: 400 });
  }

  if (!token) {
    console.error("[IndexBoost] INDEXBOOST_TOKEN is not configured.");
    return new Response("Configuration error", { status: 500 });
  }

  // Reconstruct the original URL from the x-original-url header set in vercel.json
  const originalUrl = request.headers.get("x-original-url") || url.toString();

  try {
    const renderResponse = await fetch(
      `${RENDER_BASE}/?url=${encodeURIComponent(originalUrl)}`,
      {
        headers: {
          "X-INDEXBOOST-TOKEN": token,
          "X-Original-User-Agent": ua,
        },
      },
    );

    if (!renderResponse.ok) {
      return new Response("Render service error", { status: 502 });
    }

    const html = await renderResponse.text();

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-IndexBoost-Rendered": "true",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("[IndexBoost] Render error:", err);
    return new Response("Upstream error", { status: 502 });
  }
}
