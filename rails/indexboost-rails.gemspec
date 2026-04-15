Gem::Specification.new do |spec|
  spec.name        = "indexboost-rails"
  spec.version     = "1.0.0"
  spec.authors     = ["IndexBoost"]
  spec.email       = ["support@getindexboost.com"]
  spec.summary     = "IndexBoost Render middleware for Ruby on Rails"
  spec.description = "Rack middleware that intercepts crawler requests and serves rendered HTML from render.getindexboost.com."
  spec.homepage    = "https://getindexboost.com/docs/integrations/rails"
  spec.license     = "MIT"

  spec.required_ruby_version = ">= 3.1"
  spec.files = Dir["lib/**/*", "README.md", "*.gemspec"]

  spec.add_dependency "rack", ">= 2.0"

  spec.add_development_dependency "rack-test"
  spec.add_development_dependency "minitest"
end
