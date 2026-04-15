using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace IndexBoost.AspNetCore;

/// <summary>
/// Extension methods for registering IndexBoost middleware in ASP.NET Core.
/// </summary>
public static class IndexBoostExtensions
{
    /// <summary>
    /// Registers the IndexBoost HttpClient and options.
    /// Call this in Program.cs before <c>builder.Build()</c>.
    /// </summary>
    /// <example>
    /// builder.Services.AddIndexBoost(options =>
    /// {
    ///     options.Token = builder.Configuration["IndexBoost:Token"]!;
    /// });
    /// </example>
    public static IServiceCollection AddIndexBoost(
        this IServiceCollection services,
        Action<IndexBoostOptions> configure)
    {
        services.Configure(configure);
        services.AddHttpClient("IndexBoost", client =>
        {
            client.Timeout = TimeSpan.FromSeconds(35); // slightly above middleware timeout
        });
        return services;
    }

    /// <summary>
    /// Adds the IndexBoost render middleware to the pipeline.
    /// Should be placed as early as possible (before routing, auth, etc.).
    /// </summary>
    public static IApplicationBuilder UseIndexBoost(this IApplicationBuilder app)
        => app.UseMiddleware<IndexBoostMiddleware>();
}
