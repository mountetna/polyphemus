class NetworkUtilsController
  def initialize(request, action, logger)
    @request = request
    @params = request.POST()
    @action = action
    @logger = logger
  end

  def run()
    return { :success=> true, :msg=> 'Network Utils.' }
  end
end
