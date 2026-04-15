# IndexBoost.AspNetCore

IndexBoost Render middleware for **ASP.NET Core 8+**.

## Installation

```bash
dotnet add package IndexBoost.AspNetCore
```

## Setup

```csharp
// Program.cs
using IndexBoost.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Register IndexBoost services
builder.Services.AddIndexBoost(options =>
{
    options.Token = builder.Configuration["IndexBoost:Token"]!;
});

var app = builder.Build();

// Add middleware as early as possible
app.UseIndexBoost();

app.MapControllers();
app.Run();
```

```json
// appsettings.json (or use environment variables)
{
  "IndexBoost": {
    "Token": "your_token_here"
  }
}
```

Or via environment variables:

```bash
IndexBoost__Token=your_token_here
```

## Options

| Option | Default | Description |
|---|---|---|
| `Token` | **required** | Render token from app.getindexboost.com |
| `ServiceUrl` | `https://render.getindexboost.com` | Override render URL |
| `Enabled` | `true` | Enable/disable |
| `Timeout` | `30s` | Render request timeout |
| `CrawlerPattern` | built-in | Custom crawler Regex pattern |
| `IgnoredPaths` | `["/api", "/admin"]` | Path prefixes to skip |

## Azure App Service

Add `INDEXBOOST__TOKEN` as an Application Setting in the Azure Portal. The double underscore `__` maps to nested config keys.

## License

MIT
