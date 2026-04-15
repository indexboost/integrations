namespace IndexBoost.AspNetCore;

/// <summary>
/// Configuration options for the IndexBoost render middleware.
/// </summary>
public sealed class IndexBoostOptions
{
    /// <summary>
    /// Your IndexBoost render token.
    /// Get it at app.getindexboost.com → Sites → your site → Render Tokens.
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Override the render service base URL.
    /// Default: https://render.getindexboost.com
    /// </summary>
    public string ServiceUrl { get; set; } = "https://render.getindexboost.com";

    /// <summary>
    /// Enable or disable the middleware without removing it from the pipeline.
    /// Default: true
    /// </summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// HTTP timeout for render requests.
    /// Default: 30 seconds
    /// </summary>
    public TimeSpan Timeout { get; set; } = TimeSpan.FromSeconds(30);

    /// <summary>
    /// Custom crawler User-Agent regex pattern.
    /// If null, the built-in pattern is used.
    /// </summary>
    public string? CrawlerPattern { get; set; }

    /// <summary>
    /// Path prefixes to skip (e.g. "/api", "/admin").
    /// Default: ["/api"]
    /// </summary>
    public IList<string> IgnoredPaths { get; set; } = ["/api", "/admin"];
}
