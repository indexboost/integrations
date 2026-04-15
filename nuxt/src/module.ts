import { addServerMiddleware, createResolver, defineNuxtModule } from "@nuxt/kit";

export interface ModuleOptions {
  /**
   * Your IndexBoost render token.
   * Get it at app.getindexboost.com → Sites → your site → Render Tokens.
   * Defaults to the INDEXBOOST_TOKEN environment variable.
   */
  token?: string;

  /**
   * Override the render service base URL.
   * @default "https://render.getindexboost.com"
   */
  serviceUrl?: string;

  /**
   * Disable the module without removing it from the config.
   * @default false
   */
  enabled?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@indexboost/nuxt",
    configKey: "indexboost",
    compatibility: { nuxt: ">=3.0.0" },
  },
  defaults: {
    token: process.env.INDEXBOOST_TOKEN,
    serviceUrl: "https://render.getindexboost.com",
    enabled: true,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    const token = options.token ?? process.env.INDEXBOOST_TOKEN;

    if (!options.enabled) return;

    if (!token) {
      console.warn(
        "[IndexBoost] No token configured. Set indexboost.token in nuxt.config.ts " +
        "or the INDEXBOOST_TOKEN environment variable.",
      );
      return;
    }

    // Pass config to the server handler via runtime config
    nuxt.options.runtimeConfig = nuxt.options.runtimeConfig ?? {};
    (nuxt.options.runtimeConfig as Record<string, unknown>).indexboost = {
      token,
      serviceUrl: options.serviceUrl ?? "https://render.getindexboost.com",
    };

    // Register the Nitro server middleware (runs before routes)
    addServerMiddleware({
      name: "indexboost-render",
      handler: resolve("./runtime/middleware"),
    });
  },
});
