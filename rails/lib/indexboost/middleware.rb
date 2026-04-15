require "net/http"
require "uri"

module IndexBoost
  # Rack middleware that intercepts crawler requests and serves rendered
  # HTML from the IndexBoost render service.
  #
  # Usage in config/application.rb:
  #
  #   config.middleware.insert_before 0, IndexBoost::Middleware,
  #     token: ENV.fetch("INDEXBOOST_TOKEN")
  #
  class Middleware
    CRAWLERS = /googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|
                slurp|naverbot|yandexbot|baiduspider|facebookexternalhit|
                twitterbot|linkedinbot|whatsapp|telegrambot|applebot|rogerbot|
                semrushbot|ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot/ix

    STATIC_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|
                          ttf|eot|otf|pdf|zip|xml|map|txt|json|csv|gz|br)$/ix

    DEFAULT_SERVICE_URL = "https://render.getindexboost.com"

    # @param app   [#call]  The next Rack app
    # @param token [String] IndexBoost render token (required)
    # @option options [String]  :service_url  Override render URL
    # @option options [Integer] :timeout      HTTP timeout in seconds (default 30)
    # @option options [Array]   :ignored_paths Array of Regexp to skip
    def initialize(app, token:, **options)
      raise ArgumentError, "[IndexBoost] token is required" if token.nil? || token.empty?

      @app            = app
      @token          = token
      @service_url    = options.fetch(:service_url, DEFAULT_SERVICE_URL).chomp("/")
      @timeout        = options.fetch(:timeout, 30)
      @ignored_paths  = options.fetch(:ignored_paths, [%r{^/api/}, %r{^/rails/}])
    end

    def call(env)
      return @app.call(env) unless should_render?(env)

      html = fetch_rendered(env)
      return @app.call(env) if html.nil?

      [
        200,
        {
          "Content-Type"          => "text/html; charset=utf-8",
          "X-IndexBoost-Rendered" => "true",
          "Cache-Control"         => "public, max-age=3600",
        },
        [html],
      ]
    end

    private

    def should_render?(env)
      return false unless env["REQUEST_METHOD"] == "GET"

      path = env["PATH_INFO"].to_s
      return false if STATIC_EXTENSIONS.match?(path)

      @ignored_paths.each { |p| return false if p.match?(path) }

      ua = env["HTTP_USER_AGENT"].to_s
      CRAWLERS.match?(ua)
    end

    def fetch_rendered(env)
      scheme   = env["rack.url_scheme"] || "https"
      host     = env["HTTP_HOST"] || env["SERVER_NAME"]
      path     = env["REQUEST_URI"] || env["PATH_INFO"]
      full_url = "#{scheme}://#{host}#{path}"

      render_uri = URI("#{@service_url}/?url=#{URI.encode_uri_component(full_url)}")

      request = Net::HTTP::Get.new(render_uri)
      request["X-INDEXBOOST-TOKEN"]        = @token
      request["X-Original-User-Agent"]   = env["HTTP_USER_AGENT"].to_s

      http = Net::HTTP.new(render_uri.host, render_uri.port)
      http.use_ssl     = render_uri.scheme == "https"
      http.read_timeout = @timeout
      http.open_timeout = 10

      response = http.request(request)
      return nil unless response.is_a?(Net::HTTPSuccess)

      response.body
    rescue StandardError
      nil
    end
  end
end
