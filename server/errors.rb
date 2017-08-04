class Polyphemus
  class Error < StandardError
    attr_reader :level

    def initialize(msg="Polyphemus had an error")
      @level = Logger::WARN
      super
    end
  end

  class BadRequest < Polyphemus::Error
  end

  class ServerError < Polyphemus::Error
    def initialize(msg="Server error")
      super
      @level = Logger::ERROR
    end
  end
end
