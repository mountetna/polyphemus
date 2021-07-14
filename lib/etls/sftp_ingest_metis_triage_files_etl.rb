require_relative "../db_triage_file_etl"

class Polyphemus::SftpIngestMetisTriageFilesEtl < Polyphemus::DbTriageFileEtl
  def initialize
    @project_name = "triage"
    @bucket_name = "waiting_room"
    @table_name = :ingest_files
    super(
      project_bucket_pairs: [[@project_name, @bucket_name]],
      limit: 20,
      table_name: @table_name,
    )
  end

  def process(cursor, records)
    sftp_configs.each do |conf|
      host_matches = records.select do |record|
        conf[:host] == record[:host]
      end

      logger.info("Ingesting files from #{conf[:host]}: #{host_matches.map { |file| file[:name] }.join(", ")}...")

      workflow = Etna::Clients::Metis::IngestMetisDataWorkflow.new(
        metis_filesystem: metis_filesystem,
        ingest_filesystem: ingest_filesystem(conf),
        logger: logger,
      )
      workflow.copy_files(host_matches.map { |file| file[:name] })

      remove_ingested_files(host_matches)
    end

    logger.info("Done")
  end

  private

  def sftp_configs
    Polyphemus.instance.config(:ingest)[:sftp]
  end

  def remove_ingested_files(file_records)
    require_relative "../models/ingest_file"
    Polyphemus::IngestFile.where(id: file_records.map { |f| f[:id] })
      .all do |file|
      file.delete
    end
  end

  def ingest_filesystem(configuration)
    Etna::Filesystem::SftpFilesystem.new(
      host: configuration[:host],
      username: configuration[:username],
      password: configuration[:password],
    )
  end

  def metis_filesystem
    Etna::Filesystem::Metis.new(
      metis_client: metis_client,
      project_name: @project_name,
      bucket_name: @bucket_name,
    )
  end
end
