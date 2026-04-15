# Rails (Ruby) Integration

**Categoria:** Backend Framework (gem)
**Prioridade:** Fase 2 — Frameworks
**Código Renderfy necessário:** ✅ Sim — criar gem `renderfy_rails` (RubyGems)

## Descrição

Ruby on Rails é o framework Ruby mais popular. A integração é um Rack middleware que detecta crawlers e faz proxy para o Renderfy.

## Como funciona

1. Gem adicionada ao `Gemfile`
2. Rack middleware registrado via `config.middleware.use`
3. Intercepta request, verifica `HTTP_USER_AGENT`
4. Se crawler, faz HTTP GET para `https://service.renderfy.io/{url}`
5. Retorna HTML renderizado

## Setup do usuário

```ruby
# Gemfile
gem 'renderfy_rails'
```

```bash
bundle install
```

```ruby
# config/environments/production.rb
config.middleware.use Rack::Renderfy, indexboost_token: ENV['INDEXBOOST_TOKEN']
```

## Arquivos a criar

```
packages/renderfy_rails/                      — Gem Ruby
  renderfy_rails.gemspec
  lib/
    renderfy_rails.rb                         — Main entry point
    rack/
      renderfy.rb                             — Rack middleware
    renderfy/
      crawler_detector.rb                    — User-agent detection
      client.rb                              — HTTP client
  spec/
    rack/renderfy_spec.rb
  README.md
docs/docs/integrations/rails.md              — Documentação Docusaurus
```

## Estrutura do middleware

```ruby
module Rack
  class Renderfy
    def initialize(app, options = {})
      @app = app
      @token = options[:indexboost_token]
      @service_url = options[:service_url] || 'https://service.renderfy.io'
    end

    def call(env)
      user_agent = env['HTTP_USER_AGENT'] || ''

      if crawler?(user_agent) && !static_file?(env['PATH_INFO'])
        url = "#{env['rack.url_scheme']}://#{env['HTTP_HOST']}#{env['REQUEST_URI']}"
        rendered = fetch_rendered(url)
        return rendered if rendered
      end

      @app.call(env)
    end
  end
end
```

## Tarefas

- [ ] Criar gem `renderfy_rails`
- [ ] Implementar Rack middleware (`Rack::Renderfy`)
- [ ] Implementar `CrawlerDetector`
- [ ] Implementar HTTP client (via `net/http` ou `faraday`)
- [ ] Gemspec com metadata
- [ ] Testes com RSpec
- [ ] `README.md`
- [ ] Publicar no RubyGems
- [ ] Documentação Docusaurus
- [ ] Testar com Rails 7+ real
