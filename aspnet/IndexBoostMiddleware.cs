using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IndexBoost.AspNetCore;

/// <summary>
/// ASP.NET Core middleware that intercepts crawler requests and returns
/// rendered HTML from the IndexBoost render service.
/// </summary>
public sealed partial class IndexBoostMiddleware
{
    [GeneratedRegex(
        @"googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot",
        RegexOptions.IgnoreCase | RegexOptions.Compiled)]
    private static partial Regex CrawlerPattern();

    [GeneratedRegex(
        @"\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$",
        RegexOptions.IgnoreCase | RegexOptions.Compiled)]
    private static partial Regex StaticExtensions();

    private readonly RequestDelegate _next;
    private readonly IndexBoostOptions _options;
    private readonly ILogger<IndexBoostMiddleware> _logger;
    private readonly HttpClient _http;
    private readonly Regex _crawlerRegex;

    public IndexBoostMiddleware(
        RequestDelegate next,
        IOptions<IndexBoostOptions> options,
        ILogger<IndexBoostMiddleware> logger,
        IHttpClientFactory httpClientFactory)
    {
        _next    = next;
        _options = options.Value;
        _logger  = logger;
        _http    = httpClientFactory.CreateClient("IndexBoost");

        _crawlerRegex = _options.CrawlerPattern is not null
            ? new Regex(_options.CrawlerPattern, RegexOptions.IgnoreCase | RegexOptions.Compiled)
            : CrawlerPattern();
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!ShouldRender(context))
        {
            await _next(context);
            return;
        }

        var html = await FetchRenderedAsync(context);
        if (html is null)
        {
            await _next(context);
            return;
        }

        context.Response.StatusCode  = StatusCodes.Status200OK;
        context.Response.ContentType = "text/html; charset=utf-8";
        context.Response.Headers["X-IndexBoost-Rendered"] = "true";
        context.Response.Headers["Cache-Control"]         = "public, max-age=3600";
        await context.Response.WriteAsync(html, context.RequestAborted);
    }

    private bool ShouldRender(HttpContext ctx)
    {
        if (!_options.Enabled || string.IsNullOrEmpty(_options.Token)) return false;

        if (!HttpMethods.IsGet(ctx.Request.Method)) return false;

        var path = ctx.Request.Path.Value ?? string.Empty;
        if (StaticExtensions().IsMatch(path)) return false;

        foreach (var ignored in _options.IgnoredPaths)
        {
            if (path.StartsWith(ignored, StringComparison.OrdinalIgnoreCase)) return false;
        }

        var ua = ctx.Request.Headers.UserAgent.ToString();
        return _crawlerRegex.IsMatch(ua);
    }

    private async Task<string?> FetchRenderedAsync(HttpContext ctx)
    {
        var req         = ctx.Request;
        var scheme      = req.Scheme;
        var host        = req.Host.Value;
        var pathAndQuery = req.PathBase + req.Path + req.QueryString;
        var fullUrl     = $"{scheme}://{host}{pathAndQuery}";
        var serviceUrl  = _options.ServiceUrl.TrimEnd('/');
        var renderUrl   = $"{serviceUrl}/?url={Uri.EscapeDataString(fullUrl)}";

        using var message = new HttpRequestMessage(HttpMethod.Get, renderUrl);
        message.Headers.Add("X-INDEXBOOST-TOKEN", _options.Token);
        message.Headers.Add("X-Original-User-Agent", req.Headers.UserAgent.ToString());

        try
        {
            using var cts      = CancellationTokenSource.CreateLinkedTokenSource(ctx.RequestAborted);
            cts.CancelAfter(_options.Timeout);

            using var response = await _http.SendAsync(message, cts.Token);
            if (!response.IsSuccessStatusCode) return null;

            return await response.Content.ReadAsStringAsync(ctx.RequestAborted);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogWarning(ex, "[IndexBoost] Render request failed for {Url}", fullUrl);
            return null;
        }
    }
}
