source "https://rubygems.org"

# --- Core Jekyll ---
gem "jekyll", "~> 4.4"
gem "minima", "~> 2.5"

# --- Plugins (grouped for Jekyll) ---
group :jekyll_plugins do
  gem "jekyll-archives-v2"
  gem "jekyll-email-protect"
  gem "jekyll-feed"
  gem "jekyll-get-json"
  gem "jekyll-imagemagick"
  gem "jekyll-jupyter-notebook"
  gem "jekyll-link-attributes"
  gem "jekyll-minifier"
  gem "jekyll-paginate-v2"
  gem "jekyll-regex-replace"
  gem "jekyll-scholar", "~> 6.3.3"   # explicitly pin for stability
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-tabs"
  gem "jekyll-terser", git: "https://github.com/RobertoJBeltran/jekyll-terser.git"
  gem "jekyll-toc"
  gem "jekyll-twitter-plugin"
  gem "jemoji"
  gem "jekyll-include-cache"
end

# --- Optional (asset bundling) ---
gem "jekyll-assets", "~> 1.0"

# --- Supporting dependencies ---
group :other_plugins do
  gem "css_parser"
  gem "feedjira"
  gem "httparty"
  gem "observer"
  gem "ostruct"
end

# --- Compatibility fixes ---
gem "webrick"                          # required for Ruby 3.x
gem "public_suffix", ">= 6.0"
gem "google-protobuf", ">= 4.33.0"
gem "bibtex-ruby", "4.4.6"             # ✅ fixes "Proc object without block" bug

# --- Windows file monitoring ---
gem "wdm", ">= 0.1.0" if Gem.win_platform?
