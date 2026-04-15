import type { Config, Context } from "@netlify/edge-functions";

const RENDER_BASE = "https://render.getindexboost.com";

const CRAWLER_RE =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot/i;

const STATIC_RE =
  /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$/i;

export default async function handler(
  request: Request,
  context: Context
): Promise<Response> {
  const ua = request.headers.get("user-agent") ?? "";
  const url = new URL(request.url);

  if (!CRAWLER_RE.test(ua) || STATIC_RE.test(url.pathname)) {
    return context.next();
  }

  const token = Netlify.env.get("INDEXBOOST_TOKEN");
  if (!token) return context.next();

  try {
    const encodedUrl = encodeURIComponent(request.url);
    const renderRes = await fetch(`${RENDER_BASE}/?url=${encodedUrl}`, {
      headers: { "X-INDEXBOOST-TOKEN": token },
    });

    if (!renderRes.ok) return context.next();

    const html = await renderRes.text();
    return new Response(html, {
      status: renderRes.status,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  } catch {
    return context.next();
  }
}

export const config: Config = {
  path: "/*",
  excludedPath: [
    "*.js",
    "*.css",
    "*.png",
    "*.jpg",
    "*.jpeg",
    "*.gif",
    "*.ico",
    "*.svg",
    "*.woff",
    "*.woff2",
    "*.ttf",
    "*.eot",
    "*.pdf",
    "*.map",
  ],
};
