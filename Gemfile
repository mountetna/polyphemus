source 'https://rubygems.org'

gem 'rack'
gem 'sequel'
gem 'pg'
gem 'nokogiri'
gem 'puma', '5.0.2'
gem 'etna', git: 'https://github.com/mountetna/monoetna.git', branch: 'refs/artifacts/gem-etna/d5d71184e3b1c4b641aa8962db5ac0f159ba871c'
gem 'actionpack' # For streaming the job controller results back...
gem 'aspera-cli'

group :development, :test do
  gem 'rack-test', require: "rack/test"
  gem 'rspec'
  gem 'simplecov'
  gem 'pry'
  gem 'pry-byebug'
  gem 'webmock'
  gem 'debase'
  gem 'database_cleaner'
  gem 'vcr'
end
