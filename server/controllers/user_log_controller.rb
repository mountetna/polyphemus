# This controller serves as an intermediary to Janus logging services.
class UserLogController < Polyphemus::Controller

  def run()
    # Depending on whether we get token or email/password combo we perform different
    # checks.
    if @action == 'log_in'
      # Check that the email/password is present.
      check_params('email', 'password')
    else
      # Check that a token is present.
      check_param('token')
    end

    # The data being sent back to the client should already be in a JSON format.
    return send(@action)
  end

  def log_in()
      #check_admin

      janus_request(
        'login', 
        token: nil,
        email: @params['email'], 
        pass: @params['password']
      )
  end

  def check_log()
    # Check if the user is an administrator.
    #check_admin

    janus_request('check')
  end

  def log_out()
    janus_request('logout')
  end
end
