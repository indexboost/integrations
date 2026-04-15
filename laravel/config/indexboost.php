<?php

return [
    /*
    |--------------------------------------------------------------------------
    | IndexBoost Render Token
    |--------------------------------------------------------------------------
    | Get your token at app.getindexboost.com → Sites → your site → Render Tokens.
    */
    'token' => env('INDEXBOOST_TOKEN'),

    /*
    |--------------------------------------------------------------------------
    | Render Service URL
    |--------------------------------------------------------------------------
    */
    'service_url' => env('INDEXBOOST_SERVICE_URL', 'https://render.getindexboost.com'),

    /*
    |--------------------------------------------------------------------------
    | Enable / Disable
    |--------------------------------------------------------------------------
    */
    'enabled' => env('INDEXBOOST_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Request Timeout (seconds)
    |--------------------------------------------------------------------------
    */
    'timeout' => env('INDEXBOOST_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Crawler User-Agent Pattern
    |--------------------------------------------------------------------------
    | PCRE regex (without delimiters) matched case-insensitively.
    */
    'crawler_pattern' => 'googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot',

    /*
    |--------------------------------------------------------------------------
    | Ignored URI Patterns
    |--------------------------------------------------------------------------
    | Requests whose path matches any of these patterns will never be rendered.
    */
    'ignored_uris' => [
        '/^\/api\//',
        '/^\/admin\//',
    ],
];
