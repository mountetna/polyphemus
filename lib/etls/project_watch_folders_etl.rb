require_relative './add_watch_folder_base_etl'
require_relative './watch_etl_config'


class Polyphemus::ProjectWatchFoldersEtl < Polyphemus::AddWatchFolderBaseEtl
  attr_reader :config

  def initialize(config)
    @config = config
    super(bucket_watch_configs: config.bucket_configs)
  end

  def process_folder_contents(cursor, folders, watch_type)
    run_file_processors(cursor, folders, watch_type)
    run_folder_processors(cursor, folders, watch_type)
  end

  def run_file_processors(cursor, folders, watch_type)
    bucket_name = cursor[:bucket_name]

    processors = config.file_processors(bucket_name, watch_type)
    return if processors.empty?
    files = folders_files(cursor, folders)
    processors.each { |p| p.process(cursor, files) }
  end

  def run_folder_processors(cursor, folders, watch_type)
    bucket_name = cursor[:bucket_name]

    processors = config.folder_processors(bucket_name, watch_type)
    return if processors.empty?
    processors.each { |p| p.process(cursor, folders) }
  end
end