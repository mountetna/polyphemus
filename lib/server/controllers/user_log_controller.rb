# This controller serves as an intermediary to Janus logging services.
class UserLogController < Polyphemus::Controller
  def log_in()
      check_params('email', 'password')

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
    check_param('token')

    janus_request('check')
  end

  def log_out()
    janus_request('logout')
  end
end
