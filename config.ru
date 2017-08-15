# The packages
require 'bundler'

Bundler.require(:default)

require 'json'
require 'yaml'
require 'digest'
require 'logger'
require 'net/http'
require 'openssl'
require 'securerandom'

# The details
require_relative './lib/server/secrets'

# The application
require_relative './lib/polyphemus'
require_relative './lib/server'
require_relative './lib/server/errors'
require_relative './lib/server/controllers/polyphemus_controller'
require_relative './lib/server/controllers/user_log_controller'
require_relative './lib/server/controllers/client_controller'
require_relative './lib/server/controllers/network_utils_controller'
require_relative './lib/server/controllers/user_admin_controller'

use Rack::Static, urls: ['/css', '/js', '/fonts', '/img'], root: 'client'

run Polyphemus::Server.new(YAML.load(File.read('config.yml')))
