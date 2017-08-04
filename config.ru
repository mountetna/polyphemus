# The packages
require 'bundler'

Bundler.require(:default)

require 'json'
require 'digest'
require 'logger'
require 'net/http'
require 'openssl'
require 'securerandom'

# The details
require './server/secrets'

# The application
require './server/errors'
require './server/polyphemus'
require './server/routes'
require './server/controllers/polyphemus_controller'
require './server/controllers/user_log_controller'
require './server/controllers/client_controller'
require './server/controllers/network_utils_controller'
require './server/controllers/user_admin_controller'

use Rack::Static, urls: ['/css', '/js', '/fonts', '/img'], root: 'client'

run Polyphemus.new
