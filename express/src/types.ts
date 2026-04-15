import type { IncomingMessage } from "node:http";

export interface IndexBoostOptions {
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
   * Additional file extensions to skip (e.g. [".mp4", ".avif"]).
   * Merged with the built-in list.
   */
  ignoredExtensions?: string[];

  /**
   * Return `true` to skip render caching for a given request.
   * Runs after crawler detection — useful for excluding certain paths.
   *
   * @example
   * skip: (req) => req.path.startsWith('/admin')
   */
  skip?: (req: IncomingMessage) => boolean;

  /**
   * Timeout in milliseconds for render requests.
   * @default 30000
   */
  timeout?: number;
}
