# Spring (Java) Integration

**Categoria:** Backend Framework (Maven/Gradle)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ✅ Sim — pacote Maven `io.renderfy:renderfy-spring`

## Descrição

Spring Boot é o framework Java mais popular. A integração é um `Filter` ou `HandlerInterceptor` que detecta crawlers.

## Setup do usuário

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.renderfy</groupId>
    <artifactId>renderfy-spring</artifactId>
    <version>1.0.0</version>
</dependency>
```

```yaml
# application.yml
renderfy:
  token: ${INDEXBOOST_TOKEN}
  service-url: https://service.renderfy.io
  enabled: true
```

## Arquivos a criar

```
packages/renderfy-spring/                     — Maven package
  pom.xml
  src/main/java/io/renderfy/spring/
    RenderfyAutoConfiguration.java
    RenderfyFilter.java
    CrawlerDetector.java
    RenderfyProperties.java
  README.md
docs/docs/integrations/spring.md             — Documentação Docusaurus
```

## Tarefas

- [ ] Criar pacote Maven `renderfy-spring`
- [ ] Implementar `RenderfyFilter` (javax.servlet.Filter)
- [ ] Implementar `CrawlerDetector`
- [ ] Spring Boot auto-configuration
- [ ] Properties via `application.yml`
- [ ] Testes com JUnit
- [ ] Publicar no Maven Central
- [ ] Documentação Docusaurus
