/**
 * IndexBoost Render — Akamai EdgeWorkers
 *
 * Deploy this script as an Akamai EdgeWorker using the EdgeWorkers API or
 * the Akamai Control Center UI.
 *
 * Required Property Manager behaviors (configure in Property Manager):
 *   - EdgeWorkers behavior: assign this EdgeWorker ID to the default rule
 *   - Variables: PMUSER_INDEXBOOST_TOKEN (set as a Property Manager variable,
 *     mark as sensitive/hidden)
 *
 * The EdgeWorker intercepts onClientRequest and proxies crawler traffic
 * to the IndexBoost render service.
 */

import { HtmlRewriter } from "html-rewriter";
import { httpRequest } from "http-request";
import { createResponse } from "create-response";
import { UserVariables } from "user-variables";

const RENDER_BASE = "https://render.getindexboost.com";

const CRAWLER_RE =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot/i;

const STATIC_RE =
  /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$/i;

export async function onClientRequest(request) {
  const ua = request.getHeader("User-Agent")?.[0] ?? "";
  const path = request.path ?? "/";

  // Only intercept crawlers on non-static paths
  if (!CRAWLER_RE.test(ua) || STATIC_RE.test(path)) {
    return; // let Akamai handle normally
  }

  // Read the token from a Property Manager variable
  const token = UserVariables.get("PMUSER_INDEXBOOST_TOKEN") ?? "";
  if (!token) return;

  const scheme = request.scheme ?? "https";
  const host = request.host ?? "";
  const querystring = request.query ? `?${request.query}` : "";
  const targetUrl = `${scheme}://${host}${path}${querystring}`;

  try {
    const encodedUrl = encodeURIComponent(targetUrl);
    const renderUrl = `${RENDER_BASE}/?url=${encodedUrl}`;

    const res = await httpRequest(renderUrl, {
      method: "GET",
      headers: { "X-INDEXBOOST-TOKEN": [token] },
      timeout: 10000,
    });

    if (res.status >= 200 && res.status < 300) {
      const html = await res.text();
      request.respondWith(
        createResponse(200, { "Content-Type": ["text/html; charset=utf-8"] }, html)
      );
      return;
    }
  } catch {
    // Fall through to normal Akamai delivery
  }
}
