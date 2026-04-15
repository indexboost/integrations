# Ruby on Rails — `indexboost-rails`

**RubyGems package:** [`indexboost-rails`](https://rubygems.org/gems/indexboost-rails)

See the full guide in [`rails/README.md`](./rails/README.md).

## Quick start

```ruby
# Gemfile
gem 'indexboost-rails'
```

```bash
bundle install
```

```ruby
# config/application.rb
config.middleware.use IndexBoost::Rails::Middleware
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## How it works

The Rack middleware detects crawler `User-Agent` strings and proxies those requests to `https://render.getindexboost.com/`. Regular traffic is served by your Rails application.
