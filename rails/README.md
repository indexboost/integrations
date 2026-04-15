# indexboost-rails

IndexBoost Render Rack middleware for **Ruby on Rails** and any Rack-compatible framework.

## Installation

```ruby
# Gemfile
gem "indexboost-rails"
```

```bash
bundle install
```

## Setup

```ruby
# config/application.rb
require "indexboost-rails"

module MyApp
  class Application < Rails::Application
    config.middleware.insert_before 0, IndexBoost::Middleware,
      token: ENV.fetch("INDEXBOOST_TOKEN")
  end
end
```

```bash
# .env
INDEXBOOST_TOKEN=your_token_here
```

## Options

| Option | Default | Description |
|---|---|---|
| `token` | **required** | Render token from app.getindexboost.com |
| `service_url` | `https://render.getindexboost.com` | Override render URL |
| `timeout` | `30` | HTTP timeout in seconds |
| `ignored_paths` | `[/^\/api\//, /^\/rails\//]` | Array of Regexp to skip |

## Sinatra / plain Rack

```ruby
require "indexboost-rails"

use IndexBoost::Middleware, token: ENV.fetch("INDEXBOOST_TOKEN")
```

## License

MIT
