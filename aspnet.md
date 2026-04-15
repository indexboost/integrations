# ASP.NET Core — `IndexBoost.AspNetCore`

**NuGet package:** [`IndexBoost.AspNetCore`](https://www.nuget.org/packages/IndexBoost.AspNetCore)

See the full guide in [`aspnet/README.md`](./aspnet/README.md).

## Quick start

```bash
dotnet add package IndexBoost.AspNetCore
```

```csharp
// Program.cs
builder.Services.AddIndexBoost(options =>
{
    options.Token = builder.Configuration["INDEXBOOST_TOKEN"]!;
});

// ...

app.UseIndexBoost();
```

```bash
# Environment variable or appsettings.json
INDEXBOOST_TOKEN=your_token_here
```

## How it works

An ASP.NET Core middleware component detects crawler `User-Agent` strings and proxies those requests to `https://render.getindexboost.com/` via `HttpClient`. All other requests are passed to the next middleware in the pipeline.
