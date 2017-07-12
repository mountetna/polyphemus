class Polyphemus
  class Error < StandardError
    attr_reader :level

    def initialize
      @level = Logger::WARN
      super
    end
  end

  class BadRequest < Error
  end

  class ServerError < Error
    def initialize
      super
      @level = Logger::ERROR
    end
  end
end
