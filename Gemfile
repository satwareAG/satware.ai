source "https://rubygems.org"

# Jekyll and core dependencies
gem "jekyll", "~> 4.4.1"


# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.5"

# Required for SCSS processing
gem "jekyll-sass-converter", "~> 2.2"
# Remove the sass-embedded gem
# gem "sass-embedded", "~> 1.83.4"



# Jekyll and core dependencies

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Required for Ruby 3.0+
gem "webrick", "~> 1.9"

# Für Deployment auf GitHub Pages nützliche Gems
gem "kramdown-parser-gfm", "~> 1.1"
