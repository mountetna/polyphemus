require "action_controller"

require_relative "./job"

class Polyphemus
  class RedcapJob < Polyphemus::Job

    def validate
      raise Etna::BadRequest, "redcap_tokens must be an array of tokens." unless job_params[:redcap_tokens].is_a?(Array)
      raise Etna::BadRequest, "model_names must be \"all\" or an array of model names." unless job_params[:model_names].is_a?(Array) || "all" == job_params[:model_names]
    end

    def run
      if can_hijack?
        run_loading_in_thread
      else
        # Mostly for testing and as a basic fallback if we ever use a Rack server that
        #   doesn't support hijacking.
        return run_loading_inline
      end
    end

    private

    def commit?
      !!job_params[:commit]
    end

    def run_loading_in_thread
      # Rack hijacking technique found here:
      #   https://blog.chumakoff.com/en/posts/rails_sse_rack_hijacking_api
      # Will not play well with HTTP2.
      request_env['rack.hijack'].call
      stream = request_env['rack.hijack_io']

      send_headers(stream)

      Thread.new do
        launch_redcap_process(stream)
      end

      response.close
    end

    def run_loading_inline
      run_redcap_loader(STDOUT)
    end

    def run_redcap_loader(logger)
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: request_params[:project_name],
        model_names: job_params[:model_names],
        redcap_tokens: job_params[:redcap_tokens],
        dateshift_salt: Polyphemus.instance.config(:dateshift_salt).to_s,
        redcap_host: Polyphemus.instance.config(:redcap)[:host],
        magma_host: Polyphemus.instance.config(:magma)[:host]
      )

      magma_client = Etna::Clients::Magma.new(
        token: user.token,
        host: Polyphemus.instance.config(:magma)[:host])

      redcap_etl.run(magma_client: magma_client, commit: commit?, logger: logger)
    end

    def launch_redcap_process(stream)
      sse = ActionController::Live::SSE.new(stream, retry: 300, event: "REDCapLoadingProgress")

      run_redcap_loader(sse)
    rescue => e
      sse.write("#{e.message}\n#{e.backtrace}.")
    ensure
      sse.close
    end

    def can_hijack?
      request_env['rack.hijack?']
    end

    def send_headers(stream)
      headers = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/event-stream"
      ]
      stream.write(headers.map { |header| header + "\r\n" }.join)
      stream.write("\r\n")
      stream.flush
    rescue
      stream.close
      raise
    end
  end
end