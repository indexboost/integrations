const functions = require("firebase-functions");
const fetch = require("node-fetch");

const RENDER_BASE = "https://render.getindexboost.com";

const CRAWLER_RE =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot/i;

const STATIC_RE =
  /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$/i;

exports.render = functions.https.onRequest(async (req, res) => {
  const ua = req.get("user-agent") ?? "";
  const path = req.path ?? "/";

  // Pass through non-crawlers and static assets
  if (!CRAWLER_RE.test(ua) || STATIC_RE.test(path)) {
    // Let Firebase Hosting serve the static file / SPA fallback
    // by returning a 404 here — Firebase will fall back to the static hosting
    res.status(404).send("Not handled by render");
    return;
  }

  const token = process.env.INDEXBOOST_TOKEN;
  if (!token) {
    res.status(404).send("Token not configured");
    return;
  }

  const host = req.get("host") ?? req.hostname;
  const protocol = req.protocol ?? "https";
  const targetUrl = `${protocol}://${host}${req.originalUrl}`;

  try {
    const encodedUrl = encodeURIComponent(targetUrl);
    const renderRes = await fetch(`${RENDER_BASE}/?url=${encodedUrl}`, {
      headers: { "X-INDEXBOOST-TOKEN": token },
      timeout: 10000,
    });

    if (!renderRes.ok) {
      res.status(404).send("Render service error");
      return;
    }

    const html = await renderRes.text();
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(html);
  } catch {
    res.status(404).send("Render unavailable");
  }
});
