# This class handles the http request and routing
class Polyphemus

  def initialize()

    @routes = {}
    @request = {}

    # Log file details
    path = ::File.dirname(::File.expand_path(__FILE__))
    log_file = ::File.join(path,'..','log','app.log')
    @app_logger = ::Logger.new(log_file, 5, 1048576)
    @app_logger.level = Logger::WARN
  end

  def call(env)
    # Parse the request
    @request = Rack::Request.new(env)
    route = @routes[[@request.request_method, @request.path]]

    if route
      begin
        Rack::Response.new(call_action_for(route))
      rescue Polyphemus::Error => err
        Rack::Response.new(send_err(err).to_json)
      end
    else
      Rack::Response.new('File not found.', 404)
    end
  end

  # Routes are added in the './routes.rb' file
  def add_route(method, path, handler)

    @routes[[method, path]] = handler
  end

  private 
  def call_action_for(route)
    controller, action = route.split('#')
    controller_class = Kernel.const_get(controller)
    controller_class.new(@request, action).run()
  end

  def send_err(err)
    ip = @request.env['HTTP_X_FORWARDED_FOR']
    ref = SecureRandom.hex(4)
    log_line = "#{ref} - #{e.message}, #{e.method}, #{ip}"

    case err.level
    when Logger::WARN
      @app_logger.warn(log_line)
    when Logger::ERROR
      @app_logger.error(log_line)
    end

    return { success: false, ref: ref }
  end
end
