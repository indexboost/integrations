# IndexBoost — Spring Boot

Serve rendered HTML to crawlers using a Spring MVC **HandlerInterceptor** that runs before every controller.

## Requirements

- Java 17+ (uses `java.net.http.HttpClient`)
- Spring Boot 3.x (Spring MVC — not WebFlux)

> For Spring WebFlux (reactive), use a `WebFilter` instead. See the note at the bottom.

## Setup

### 1. Copy the source files

```
src/main/java/com/example/indexboost/
├── IndexBoostInterceptor.java
└── IndexBoostConfig.java
```

Adjust the package name (`com.example.indexboost`) to match your project.

### 2. Set the token

Add to `application.properties`:

```properties
indexboost.token=${INDEXBOOST_TOKEN:}
```

Or set the environment variable:

```bash
export INDEXBOOST_TOKEN=your_token_here
```

Or in Docker / Kubernetes:

```yaml
env:
  - name: INDEXBOOST_TOKEN
    valueFrom:
      secretKeyRef:
        name: indexboost-secret
        key: token
```

### 3. Build and run

```bash
./mvnw spring-boot:run
# or
./gradlew bootRun
```

## How It Works

`IndexBoostConfig` registers `IndexBoostInterceptor` on all paths (`/**`). The interceptor's `preHandle()` method:

1. Checks the `User-Agent` — if not a crawler, returns `true` (continues to the controller).
2. Checks the path — if it's a static asset extension, returns `true`.
3. Fetches rendered HTML from `https://render.getindexboost.com/?url={encoded_url}` with `X-INDEXBOOST-TOKEN`.
4. Writes the HTML directly to the `HttpServletResponse` and returns `false` (stops the handler chain).
5. On any exception, returns `true` (falls through to the normal controller).

## Spring WebFlux Note

For reactive applications using WebFlux, implement a `WebFilter`:

```java
@Component
public class IndexBoostWebFilter implements WebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // same logic using WebClient instead of HttpClient
    }
}
```

## Configuration

| Property / Env Var | Required | Description |
|---|---|---|
| `INDEXBOOST_TOKEN` | ✅ | Your IndexBoost API token |
| `indexboost.token` | Optional | Spring property override |
