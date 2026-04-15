# IndexBoost — IIS (Internet Information Services)

Two integration options are provided for IIS, depending on your stack.

---

## Option A — ASP.NET Core on IIS (Recommended)

If you're running an **ASP.NET Core** application hosted on IIS (in-process or out-of-process), use the dedicated NuGet package:

👉 See [`integrations/aspnet/`](../aspnet/)

---

## Option B — Classic ASP.NET (System.Web) HTTP Module

For legacy **ASP.NET Framework** applications using `System.Web`.

### 1. Add the HTTP Module

Copy `IndexBoostModule.cs` into your project and register it in `web.config`:

```xml
<system.webServer>
  <modules>
    <add name="IndexBoostModule" type="YourNamespace.IndexBoostModule, YourAssemblyName" />
  </modules>
</system.webServer>
```

### 2. Set the environment variable

Set `INDEXBOOST_TOKEN` in IIS:

1. Open **IIS Manager**
2. Select your site → **Configuration Editor**
3. Navigate to `system.webServer/aspNetCore` or set via **Environment Variables** in the App Pool

Or in `web.config`:

```xml
<appSettings>
  <add key="INDEXBOOST_TOKEN" value="your_token_here" />
</appSettings>
```

Then update `IndexBoostModule.cs` to read from `ConfigurationManager.AppSettings["INDEXBOOST_TOKEN"]`.

---

## Option C — URL Rewrite Only (Static Sites / Pure Proxy)

For static sites or reverse-proxy setups without .NET, use the `web.config` URL Rewrite rules provided.

### Requirements

- [URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
- [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing)

### Limitation

IIS URL Rewrite does not natively support **adding custom request headers** (like `X-INDEXBOOST-TOKEN`) before forwarding. Use one of these workarounds:

- **ARR Server Farm**: configure the farm with the token header in the health probe or use ARR's URL Rewrite with a server variable.
- **Custom HTTP Module**: see `IndexBoostModule.cs` above.
- **Nginx/HAProxy in front**: run Nginx as a reverse proxy in front of IIS and use the Nginx integration.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | ✅ | Your IndexBoost API token |
