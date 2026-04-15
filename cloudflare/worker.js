/**
 * IndexBoost Render — Cloudflare Worker
 *
 * Intercepts crawler requests at the Cloudflare edge and returns
 * rendered HTML from render.getindexboost.com.
 *
 * Setup:
 *   1. Deploy this worker via Wrangler (see wrangler.toml) or the Cloudflare Dashboard
 *   2. Set the environment variable INDEXBOOST_TOKEN in:
 *        Cloudflare Dashboard → Workers & Pages → your worker → Settings → Variables
 *   3. Add a Route or use Workers Routes to apply this worker to your domain
 *
 * @see https://developers.cloudflare.com/workers/
 */

const RENDER_BASE = "https://render.getindexboost.com";

/** Crawler User-Agent patterns */
const CRAWLERS =
  /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/i;

/** Static file extensions that should never be rendered */
const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i;

export default {
  /**
   * @param {Request} request
   * @param {{ INDEXBOOST_TOKEN: string }} env
   * @param {ExecutionContext} ctx
   * @returns {Promise<Response>}
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const ua = request.headers.get("user-agent") || "";

    // Only intercept GET requests
    if (request.method !== "GET") {
      return fetch(request);
    }

    // Never render static assets
    if (STATIC_EXTENSIONS.test(url.pathname)) {
      return fetch(request);
    }

    // Avoid render loops — if the request was already rendered, pass through
    if (request.headers.get("x-indexboost-rendered") === "true") {
      return fetch(request);
    }

    // Not a crawler — serve normally
    if (!CRAWLERS.test(ua)) {
      return fetch(request);
    }

    // ── Crawler detected — fetch rendered HTML ────────────────────────────

    const token = env.INDEXBOOST_TOKEN;
    if (!token) {
      console.error("[IndexBoost] INDEXBOOST_TOKEN is not set. Falling back to origin.");
      return fetch(request);
    }

    const renderUrl = `${RENDER_BASE}/?url=${encodeURIComponent(url.toString())}`;

    try {
      const renderResponse = await fetch(renderUrl, {
        method: "GET",
        headers: {
          "X-INDEXBOOST-TOKEN": token,
          "X-Original-User-Agent": ua,
        },
        // Do not cache the proxy request itself at the CF edge level
        cf: { cacheEverything: false },
      });

      if (!renderResponse.ok) {
        console.warn(
          `[IndexBoost] Render service returned ${renderResponse.status} for ${url}. Falling back to origin.`,
        );
        return fetch(request);
      }

      const html = await renderResponse.text();

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-IndexBoost-Rendered": "true",
          // Cache rendered page at the edge for 1 hour
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          "Vary": "User-Agent",
        },
      });
    } catch (err) {
      console.error(`[IndexBoost] Render request failed: ${err}. Falling back to origin.`);
      return fetch(request);
    }
  },
};
