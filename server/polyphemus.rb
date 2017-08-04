# This class handles the http request and routing
class Polyphemus
  # Routes are added in the './routes.rb' file
  class Route
    def initialize method, action, &block
      @method = method
      @action = action
      @block = block
    end

    def call(app, request)
      if @action
        controller, action = @action.split('#')
        controller_class = Kernel.const_get(
          :"#{controller.camel_case}Controller"
        )
        app.logger.warn("Calling #{controller}##{action}")
        return Rack::Response.new(controller_class.new(request, action).run)
      elsif @block
        return app.instance_eval(@block)
      end
    end
  end
  class << self
    def route path, method=nil, action=nil, &block
      @routes ||= {}

      @routes[path] = Polyphemus::Route.new(
        method,
        action,
        &block
      )
    end

    def get path, action=nil, &block
      route(path, 'GET', action, &block)
    end
    
    def post path, action=nil, &block
      route(path, 'POST', action, &block)
    end

    def put path, action=nil, &block
      route(path, 'PUT', action, &block)
    end

    def delete path, action=nil, &block
      route(path, 'DELETE', action, &block)
    end

    attr_reader :routes
  end

  def initialize()
    @routes = {}
    @request = {}

    # Log file details
    path = ::File.dirname(::File.expand_path(__FILE__))
    log_file = ::File.join(path,'..','log','app.log')
    @app_logger = ::Logger.new(log_file, 5, 1048576)
    @app_logger.level = Logger::WARN
  end

  def logger
    @app_logger
  end

  def call(env)
    # Parse the request
    @request = Rack::Request.new(env)
    route = @routes[[@request.request_method, @request.path]]

    if self.class.routes.has_key? @request.path
      return self.class.routes[@request.path].call(self, @request)
    end

    [ 404, {}, ["There is no such path '#{@request.path}'"] ]
  end

  private 

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
