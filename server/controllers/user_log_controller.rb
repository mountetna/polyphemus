# This controller serves as an intermediary to Janus logging services.
class UserLogController < BasicController

  def run()
    # Depending on whether we get token or email/pass combo we perform different
    # checks.
    if @action == 'log_in'
      # Check that the email/pass is present.
      check_params('email', 'pass')
    else
      # Check that a token is present.
      check_param('token')
    end

    # The data being sent back to the client should already be in a JSON format.
    return send(@action)
  end

  def log_in()
      check_admin

      janus_request(
        'login', 
        token: nil,
        email: @params['email'], 
        pass: @params['pass']
      )
  end

  def check_log()
    # Check if the user is an administrator.
    check_admin

    janus_request('check')
  end

  def log_out()
    janus_request('logout')
  end
end
