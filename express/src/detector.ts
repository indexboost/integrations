/**
 * Default crawler User-Agent regexp.
 * Matches all major search engine bots, AI crawlers, and social media bots.
 */
export const DEFAULT_CRAWLERS =
  /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/i;

/**
 * Default static file extensions that should never be rendered.
 */
const DEFAULT_IGNORED_PATTERN =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/i;

/**
 * Returns `true` if the User-Agent string matches a known crawler.
 */
export function isCrawler(userAgent: string, pattern?: RegExp): boolean {
  if (!userAgent) return false;
  return (pattern ?? DEFAULT_CRAWLERS).test(userAgent);
}

/**
 * Returns `true` if the URL pathname refers to a static asset that
 * should never be rendered.
 */
export function isStaticAsset(pathname: string, extraExtensions?: string[]): boolean {
  if (DEFAULT_IGNORED_PATTERN.test(pathname)) return true;

  if (extraExtensions?.length) {
    const escaped = extraExtensions.map((e) => e.replace(/^\./, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const extra = new RegExp(`\\.(${escaped.join("|")})$`, "i");
    return extra.test(pathname);
  }

  return false;
}
