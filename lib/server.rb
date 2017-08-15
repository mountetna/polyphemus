# This class handles the http request and routing
module Polyphemus
  class Server < Etna::Server
    # Page view end points
    get '/', 'client#browse'
    get '/logged-out', 'client#logged_out'
    get '/user-admin', 'client#user_admin'
    get '/network-utils', 'client#network_utils'

    # User logging end points
    post '/login', 'user_log#log_in'
    post '/logout', 'user_log#log_out'
    post '/check', 'user_log#check_log'

    # User administration end points
    post '/users', 'user_admin#users'
    post '/projects', 'user_admin#projects'
    post '/permissions', 'user_admin#permissions'
    post '/upload-permissions', 'user_admin#upload_permissions'
    post '/remove-permissions', 'user_admin#remove_permissions'

    # Invalidate all tokens in the system.
    # This could cause problems with Metis if there are active uploads.
    post '/logout-all', 'user_admin#logout_all'
  end
end
