source "https://rubygems.org"

gem "rack"
gem "sequel"
gem "pg"
gem "puma", ">=5.0.2"
gem "etna", path: "/etna"
gem "actionpack" # For streaming the job controller results back...
gem "aspera-cli", ">=4.1.0"
gem "rake" # for mimemagic??
gem "mimemagic", "~>0.3.10" # for aspera-cli
gem "concurrent-ruby"
gem "yabeda"
gem "yabeda-prometheus"
gem "yabeda-puma-plugin"
gem "rsync", "~> 1.0", ">= 1.0.9"

group :development, :test do
  gem "rack-test", require: "rack/test"
  gem "rspec"
  gem "simplecov"
  gem "pry"
  gem "pry-byebug"
  gem "webmock"
  gem "debase"
  gem "database_cleaner", "1.8.5"
  gem "vcr"
  gem "timecop"
  gem "factory_bot"
end
