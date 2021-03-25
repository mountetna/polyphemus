source 'https://rubygems.org'

gem 'rack'
gem 'sequel'
gem 'pg'
gem 'puma', '>=5.0.2'
gem 'etna', path: '/etna'
gem 'actionpack' # For streaming the job controller results back...
gem 'aspera-cli'
gem 'mimemagic', '0.3.7' # for aspera-cli
gem 'concurrent-ruby'

group :development, :test do
  gem 'rack-test', require: "rack/test"
  gem 'rspec'
  gem 'simplecov'
  gem 'pry'
  gem 'pry-byebug'
  gem 'webmock'
  gem 'debase'
  gem 'database_cleaner', '1.8.0'
  gem 'vcr'
end
