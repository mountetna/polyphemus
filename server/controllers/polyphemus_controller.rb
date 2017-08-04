class Polyphemus
  class Controller
    def initialize(request, action)
      @request = request
      @params = request.POST()
      @action = action
    end

    def check_param(*names)
      missing = names.reject { |name| @params.key?(name) }
      unless missing.empty?
        raise Polyphemus::BadRequest, "No param: #{missing.join(" ")}"
      end
    end
    alias_method :check_params, :check_param

    def check_admin
      response = JSON.parse(janus_request('check-admin-token'))
      raise unless response['administrator']
    rescue
      raise Polyphemus::BadRequest, "Not admin user" 
    end

    def janus_request(endpoint, data={})
      data = {
        token: @params['token'],
        app_key: Secrets::APP_KEY 
      }.merge(data).reject { |key,value| value.nil? }

      begin
        uri = URI.parse("#{Secrets::JANUS_ADDR}/#{endpoint}")
        https_conn = Net::HTTP.new(uri.host, uri.port)
        https_conn.use_ssl = true
        https_conn.verify_mode = OpenSSL::SSL::VERIFY_PEER

        request = Net::HTTP::Post.new(uri.path)
        request.set_form_data(data)

        response = https_conn.request(request)
        response_code = response.code.to_i()

        if response_code == 200
          return response.body
        else
          raise Polyphemus::ServerError, "Janus Server error: #{response.body}"
        end
      rescue Exception => e
        raise if e.is_a?(ServerError)
        raise Polyphemus::ServerError, "Connection error"
      end
    end
  end
end
