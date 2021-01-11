source 'https://rubygems.org'

gem 'rack'
gem 'sequel'
gem 'pg'
gem 'nokogiri'
gem 'puma', '5.0.2'
gem 'etna', git: 'https://github.com/mountetna/monoetna.git', branch: 'refs/artifacts/gem-etna/37bc12f74b21e28ebb1bdf175d9110d5b975f193'
gem 'actionpack' # For streaming the job controller results back...

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
