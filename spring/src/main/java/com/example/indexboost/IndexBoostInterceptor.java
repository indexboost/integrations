package com.example.indexboost;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.regex.Pattern;

/**
 * Spring MVC HandlerInterceptor that proxies crawler requests to the
 * IndexBoost render service and returns the rendered HTML.
 *
 * Register via {@link IndexBoostConfig}.
 */
public class IndexBoostInterceptor implements HandlerInterceptor {

    private static final String RENDER_BASE = "https://render.getindexboost.com";

    private static final Pattern CRAWLER_PATTERN = Pattern.compile(
        "googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot" +
        "|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|W3C_Validator|redditbot" +
        "|applebot|whatsapp|flipboard|tumblr|bitlybot|skypeuripreview|nuzzel|discordbot" +
        "|google-read-aloud|duckduckbot|kakaotalk|headlesschrome|lighthousebot" +
        "|seobilitybot|seokicks-robot|ahrefsbot|semrushbot",
        Pattern.CASE_INSENSITIVE
    );

    private static final Pattern STATIC_PATTERN = Pattern.compile(
        "\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|gz" +
        "|mp4|webm|mp3|ogg|wav|flac|avi|mov|wmv|swf|json|xml|txt|csv|rss|atom|map)(\\?.*)?$",
        Pattern.CASE_INSENSITIVE
    );

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();

    private final String token;

    public IndexBoostInterceptor(String token) {
        this.token = token;
    }

    @Override
    public boolean preHandle(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull Object handler
    ) throws Exception {
        if (token == null || token.isBlank()) return true;

        String ua = request.getHeader("User-Agent");
        if (ua == null || !CRAWLER_PATTERN.matcher(ua).find()) return true;

        String path = request.getRequestURI();
        if (STATIC_PATTERN.matcher(path).find()) return true;

        String targetUrl = buildTargetUrl(request);

        try {
            String encodedUrl = URLEncoder.encode(targetUrl, StandardCharsets.UTF_8);
            URI renderUri = URI.create(RENDER_BASE + "/?url=" + encodedUrl);

            HttpRequest req = HttpRequest.newBuilder()
                .uri(renderUri)
                .header("X-INDEXBOOST-TOKEN", token)
                .timeout(Duration.ofSeconds(10))
                .GET()
                .build();

            HttpResponse<String> res = HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofString());

            if (res.statusCode() >= 200 && res.statusCode() < 300) {
                response.setStatus(200);
                response.setContentType("text/html;charset=UTF-8");
                response.getWriter().write(res.body());
                response.getWriter().flush();
                return false; // stop handler chain — response already written
            }
        } catch (IOException | InterruptedException ignored) {
            // Fall through to normal Spring MVC handling
        }

        return true;
    }

    private static String buildTargetUrl(HttpServletRequest request) {
        StringBuilder url = new StringBuilder();
        url.append(request.getScheme()).append("://").append(request.getServerName());

        int port = request.getServerPort();
        if ((request.getScheme().equals("http") && port != 80) ||
            (request.getScheme().equals("https") && port != 443)) {
            url.append(":").append(port);
        }

        url.append(request.getRequestURI());

        String query = request.getQueryString();
        if (query != null && !query.isBlank()) {
            url.append("?").append(query);
        }

        return url.toString();
    }
}
