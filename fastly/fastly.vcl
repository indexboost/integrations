// IndexBoost Render — Fastly VCL
// Upload this file as a custom VCL snippet in your Fastly service.
//
// Requirements:
//   - A Fastly service with custom VCL enabled
//   - An Edge Dictionary named "indexboost_config" with key "token" = your token
//   - A backend named "indexboost_render" pointing to render.getindexboost.com (port 443, TLS)
//
// Instructions:
//   1. In the Fastly UI, go to your service → Edit Configuration → Custom VCL
//   2. Upload this file as the "main" VCL
//   3. Create the Edge Dictionary:  Dictionaries → Create → name: indexboost_config
//   4. Add entry: key = token, value = your_token_here
//   5. Create backend: Hosts → Create host → render.getindexboost.com:443, TLS on, SNI
//   6. Activate the service version

// ── Crawler user-agent detection ──────────────────────────────────────────────
sub indexboost_is_crawler {
    if (req.http.User-Agent ~ "(?i)googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot|seobilitybot|seokicks-robot|ahrefsbot|semrushbot") {
        return(true);
    }
    return(false);
}

// ── Static asset detection ────────────────────────────────────────────────────
sub indexboost_is_static {
    if (req.url ~ "(?i)\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\?.*)?$") {
        return(true);
    }
    return(false);
}

// ── vcl_recv ──────────────────────────────────────────────────────────────────
sub vcl_recv {
    #FASTLY recv

    // Only intercept GET/HEAD from crawlers on non-static paths
    if (req.method == "GET" || req.method == "HEAD") {
        call indexboost_is_crawler;
        if (req.http.X-IndexBoost-IsCrawler == "1") {
            call indexboost_is_static;
            if (req.http.X-IndexBoost-IsStatic != "1") {
                // Rewrite request to IndexBoost render backend
                set req.backend = indexboost_render;

                // Build render URL: /?url=<encoded original URL>
                declare local var.original_url STRING;
                set var.original_url = "https://" + req.http.Host + req.url;

                set req.url = "/?url=" + urlencode(var.original_url);

                // Inject the auth token from the edge dictionary
                set req.http.X-INDEXBOOST-TOKEN = table.lookup(indexboost_config, "token");

                // Don't cache render responses by default (Fastly will still respect cache headers)
                set req.http.X-IndexBoost-Render = "1";

                return(pass);
            }
            unset req.http.X-IndexBoost-IsStatic;
        }
        unset req.http.X-IndexBoost-IsCrawler;
    }

    return(pass);
}

// ── vcl_hash ──────────────────────────────────────────────────────────────────
sub vcl_hash {
    #FASTLY hash
    set req.hash += req.url;
    set req.hash += req.http.host;
    return(hash);
}

// ── vcl_deliver ───────────────────────────────────────────────────────────────
sub vcl_deliver {
    #FASTLY deliver

    // Remove internal headers from the response
    unset resp.http.X-IndexBoost-Render;

    return(deliver);
}

// ── vcl_error ─────────────────────────────────────────────────────────────────
sub vcl_error {
    #FASTLY error

    // On render service error, fall back to origin
    if (req.http.X-IndexBoost-Render) {
        set req.backend = F_origin; // replace F_origin with your origin backend name
        return(restart);
    }

    return(deliver);
}
