# This controller serves as an intermediary to Janus logging services.
class UserLogController < BasicController

  def run()

    # The data being sent back to the client should already be in a JSON format.
    send(@action)
  end

  def log_in()

    # Check that the email and password are present.
    if @params.key?('email') && @params.key?('pass')

      data = { 

        :email=> @params['email'], 
        :pass=> @params['pass'], 
        :app_key=> Secrets::APP_KEY 
      }

      # Check if the user is an administrator.
      if admin_user?('/check-admin', data)

        return make_request(Conf::JANUS_ADDR+'/login', data)
      else

        return send_err(:BAD_REQ, 1, __method__)
      end
    else

      return send_err(:BAD_REQ, 0, __method__)
    end
  end

  def log_out()

    # Check for the correct parameters.
    if !@params.key?('token') then return send_err(:BAD_REQ, 0, __method__) end

    data = { :token=> @params['token'], :app_key=> Secrets::APP_KEY }
    return make_request(Conf::JANUS_ADDR+'/logout', data)
  end

  # This is use for external requests. There is another in the generic
  # controller that is used for internal requests.
  def check_log()

    # Check for the correct parameters.
    if !@params.key?('token') then return send_err(:BAD_REQ, 0, __method__) end

    data = { :token=> @params['token'], :app_key=> Secrets::APP_KEY }
    if admin_user?('/check-admin-token', data)

      return make_request(Conf::JANUS_ADDR+'/check', data)
    else

      return send_err(:BAD_REQ, 1, __method__)
    end
  end

  def admin_user?(uri, data)

    begin

      response = JSON.parse(make_request(Conf::JANUS_ADDR+uri, data))
      if response.key?('administrator') && response['administrator']

        return true
      else

        return false
      end
    rescue

      return false
    end
  end

  def make_request(url, data)

    m = __method__
    begin

      uri = URI.parse(url)
      https_conn = Net::HTTP.new(uri.host, uri.port)
      #https_conn.use_ssl = true
      #https_conn.verify_mode = OpenSSL::SSL::VERIFY_PEER

      request = Net::HTTP::Post.new(uri.path)
      request.set_form_data(data)

      response = https_conn.request(request)
      response_code = response.code.to_i()

      return (response_code == 200) ? response.body : send_err(:SERVER_ERR,0,m)
    rescue

      send_err(:SERVER_ERR, 1, m)
    end
  end
end