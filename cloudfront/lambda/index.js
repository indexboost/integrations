"use strict";

const RENDER_BASE = "https://render.getindexboost.com";

// Replace with your IndexBoost token (store in SSM Parameter Store and inject at deploy time)
const INDEXBOOST_TOKEN = process.env.INDEXBOOST_TOKEN || "YOUR_TOKEN_HERE";

const CRAWLER_RE =
  /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot/i;

const STATIC_RE =
  /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$/i;

/**
 * Lambda@Edge viewer-request handler.
 * Deploy this function to the CloudFront distribution as a Viewer Request trigger.
 *
 * @param {import('aws-lambda').CloudFrontRequestEvent} event
 * @param {import('aws-lambda').Context} _context
 * @returns {Promise<import('aws-lambda').CloudFrontRequest | import('aws-lambda').CloudFrontResultResponse>}
 */
exports.handler = async (event, _context) => {
  const cf = event.Records[0].cf;
  const request = cf.request;
  const headers = request.headers;

  const ua =
    (headers["user-agent"] && headers["user-agent"][0]
      ? headers["user-agent"][0].value
      : "") ?? "";

  const uri = request.uri ?? "/";
  const querystring = request.querystring ? `?${request.querystring}` : "";
  const host =
    headers["host"] && headers["host"][0] ? headers["host"][0].value : "";

  // Only intercept crawlers on non-static paths
  if (!CRAWLER_RE.test(ua) || STATIC_RE.test(uri)) {
    return request;
  }

  const targetUrl = `https://${host}${uri}${querystring}`;

  try {
    const https = require("https");
    const html = await fetchRendered(https, targetUrl, INDEXBOOST_TOKEN);

    return {
      status: "200",
      statusDescription: "OK",
      headers: {
        "content-type": [{ key: "Content-Type", value: "text/html; charset=utf-8" }],
        "x-rendered-by": [{ key: "X-Rendered-By", value: "indexboost" }],
      },
      body: html,
    };
  } catch {
    // Fall through to the origin on any error
    return request;
  }
};

/**
 * @param {typeof import('https')} https
 * @param {string} targetUrl
 * @param {string} token
 * @returns {Promise<string>}
 */
function fetchRendered(https, targetUrl, token) {
  return new Promise((resolve, reject) => {
    const encodedUrl = encodeURIComponent(targetUrl);
    const renderUrl = `${RENDER_BASE}/?url=${encodedUrl}`;
    const parsed = new URL(renderUrl);

    const opts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: "GET",
      headers: { "X-INDEXBOOST-TOKEN": token },
      timeout: 10000,
    };

    const req = https.request(opts, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`Render service returned ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });

    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    req.end();
  });
}
