require_relative "etl"
require_relative "time_scan_based_etl_scanner"

class Polyphemus
  class DbTriageFileBaseEtlCursor < EtlCursor
    def initialize(job_name:, project_name:, bucket_name:)
      raise "project_name cannot be nil" if project_name.nil?
      raise "bucket_name cannot be nil" if bucket_name.nil?
      super("#{job_name}_triage_ingest_#{project_name}_#{bucket_name}")
      self[:project_name] = project_name
      self[:bucket_name] = bucket_name
    end

    def reset!
      super { self[:seen_ids] = [] }
    end
  end

  # Abstract base class for an ETL that scans the Polyphemus
  #   database for newly updated files that have been
  #   flagged for triage ingestion.
  class DbTriageFileBaseEtl < Etl
    # Subclasses should provide default values here, since commands are constructed
    def initialize(project_bucket_pairs:, column_name:, limit: 20, timeout: nil)
      file_cursors = project_bucket_pairs.map do |project_name, bucket_name|
        DbTriageFileBaseEtlCursor.new(job_name: self.class.name, project_name: project_name, bucket_name: bucket_name).load_from_db
      end

      @limit = limit
      @timeout = timeout
      @column_name = column_name

      super(
        cursor_group: EtlCursorGroup.new(file_cursors),
        scanner: TimeScanBasedEtlScanner.new.start_batch_state do |cursor|
          initialize_query(cursor)
        end.result_updated_at do |file|
          file[:updated_at]
        end.result_id do |file|
          "#{file[:host]}://#{file[:name]}"
        end.execute_batch_find do |query, i|
          query.limit(@limit * i)

          Polyphemus.instance.db.transaction do
            Polyphemus.instance.db.run("SET LOCAL statement_timeout = #{@timeout}") if @timeout
            Polyphemus.instance.db[query.sql].all
          end
        end,
      )
    end
  end
end