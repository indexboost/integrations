package com.example.indexboost;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Registers the {@link IndexBoostInterceptor} with Spring MVC.
 *
 * Set the INDEXBOOST_TOKEN environment variable (or Spring property) to enable.
 *
 * Example application.properties:
 *   indexboost.token=${INDEXBOOST_TOKEN:}
 */
@Configuration
public class IndexBoostConfig implements WebMvcConfigurer {

    @Value("${indexboost.token:${INDEXBOOST_TOKEN:}}")
    private String token;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        if (token != null && !token.isBlank()) {
            registry.addInterceptor(new IndexBoostInterceptor(token))
                    .addPathPatterns("/**");
        }
    }
}
