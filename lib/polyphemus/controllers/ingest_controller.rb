require_relative "controller"

class IngestController < Polyphemus::Controller
  def list_hosts
    require_params(:project_name)

    success({ hosts: host_configs }.to_json, "application/json")
  rescue => e
    Polyphemus.instance.logger.log_error(e)
    return failure(422, e.message)
  end

  def list_dir
    require_params(:project_name, :folder_path, :ingest_host)
    require_valid_host

    success({ files: ingestable_files.map { |r| r.to_hash } }.to_json, "application/json")
  rescue => e
    Polyphemus.instance.logger.log_error(e)
    return failure(422, e.message)
  end

  def enqueue
    require_params(:project_name, :folder_path, :ingest_host)
    require_valid_host

    files = ingestable_files do |file|
      file.update(should_ingest: true)
      file.refresh
    end

    success({ files: files.map { |r| r.to_hash } }.to_json, "application/json")
  rescue => e
    Polyphemus.instance.logger.log_error(e)
    return failure(422, e.message)
  end

  private

  def host_configs
    Polyphemus.instance.config(:ingest).values.flatten.map do |config|
      {
        alias: config[:alias],
        host: config[:host],
        directories: directories(config[:host]),
      }
    end
  end

  def directories(host)
    Polyphemus::IngestFile.where(host: host).all.map do |file|
      ::File.dirname(file[:name])
    end.uniq.sort
  end

  def host
    @params[:ingest_host]
  end

  def folder_regex
    /^#{folder_path}/
  end

  def folder_path
    path = @params[:folder_path]
    return path if "/" == path[-1]

    "#{path}/"
  end

  def require_valid_host
    raise Etna::BadRequest, "Invalid ingest host." unless configured_hosts.include?(host)
  end

  def configured_hosts
    Polyphemus.instance.config(:ingest)[:sftp].map { |c| c[:host] }
  end

  def ingestable_files(&block)
    Polyphemus::IngestFile.where(
      host: host,
      name: folder_regex,
      ingested_at: nil,
      should_ingest: false,
      removed_from_source: false,
    ).all(&block)
  end
end