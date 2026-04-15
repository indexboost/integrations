# IIS Integration

**Categoria:** Web Server (config-only)
**Prioridade:** Fase 4 — Complementar
**Código Renderfy necessário:** ❌ Não — apenas URL Rewrite rules

## Descrição

IIS (Internet Information Services) é o web server da Microsoft para Windows Server. A integração usa o módulo URL Rewrite + Application Request Routing (ARR) para detectar crawlers e fazer proxy para o Renderfy.

## Pré-requisitos

- IIS Server com permissão admin
- [Microsoft URL Rewrite module](https://www.iis.net/downloads/microsoft/url-rewrite) instalado
- [Application Request Routing (ARR)](https://www.iis.net/downloads/microsoft/application-request-routing) instalado
- Token Renderfy

## Como funciona

1. ARR habilitado como proxy
2. Server variable `HTTP_X_INDEXBOOST_TOKEN` definida
3. URL Rewrite rule com condições:
   - `HTTP_USER_AGENT` matcha crawlers
   - URL **não** matcha extensões estáticas
4. Action: Rewrite para `https://service.renderfy.io/https://{HTTP_HOST}/{REQUEST_URI}`

## Arquivos a criar

```
docs/docs/integrations/iis.md               — Documentação Docusaurus
integrations/iis/web.config                  — Exemplo de web.config com rewrite rules
```

## Exemplo de web.config

```xml
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Renderfy Render" stopProcessing="true">
          <match url="^(?!.*\.(js|css|xml|png|jpg|jpeg|gif|pdf|txt|ico|svg|woff|ttf)$)(.*)$" />
          <conditions logicalGrouping="MatchAny">
            <add input="{HTTP_USER_AGENT}" pattern="googlebot|bingbot|gptbot|claudebot|..." />
          </conditions>
          <serverVariables>
            <set name="HTTP_X_INDEXBOOST_TOKEN" value="YOUR_TOKEN" />
          </serverVariables>
          <action type="Rewrite" url="https://service.renderfy.io/https://{HTTP_HOST}/{REQUEST_URI}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Tarefas

- [ ] Criar `web.config` exemplo completo
- [ ] Documentar setup passo-a-passo:
  - [ ] Habilitar ARR Proxy
  - [ ] Definir server variable
  - [ ] Criar rewrite rule
  - [ ] Configurar conditions
  - [ ] Set action
- [ ] Documentação Docusaurus
- [ ] Adicionar nota para Azure App Services (guia separado)
- [ ] Testar com IIS real (se possível)
