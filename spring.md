# Spring Boot

No Maven/Gradle package required — copy the interceptor class.

See the full guide in [`spring/README.md`](./spring/README.md).

## Quick start

1. Copy [`spring/src/main/java/.../IndexBoostInterceptor.java`](./spring/src/main/java/) into your project.
2. Register the interceptor in your `WebMvcConfigurer`.
3. Set `INDEXBOOST_TOKEN` in `application.properties` or as an environment variable.

```properties
# application.properties
indexboost.token=${INDEXBOOST_TOKEN}
```

## How it works

A Spring `HandlerInterceptor` checks each request's `User-Agent`. Crawler requests are proxied to `https://render.getindexboost.com/` and the rendered HTML is returned. Human requests proceed normally.
