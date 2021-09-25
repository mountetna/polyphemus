require_relative '../project_watch_folders_etl'

module Polyphemus
  module Ipi
    class WatchFoldersConfig < Polyphemus::ProjectWatchFoldersConfig
      def initialize
        super(project_name: 'ipi')

        process_watch_type_with(
          bucket('data').watcher('process_bulk_rna_seq_results').watch(/^bulkRNASeq\/.*\/results$/),
          Polyphemus::IpiRnaSeqAttributeProcessor.new,
            Polyphemus::IpiRnaSeqMatrixProcessor.new,
        )

        process_watch_type_with(
          bucket('data').watcher('link_processed_rna_seq_files').watch(/^bulkRNASeq\/.*\/output\/.*$/),
          Polyphemus::LinkerProcessor.new(linker: rna_seq_processed_linker, model_name: 'rna_seq')
        )

        process_watch_type_with(
          bucket('integral_data').watcher('link_rna_seq_raw_fastq_files').watch(/^.*\/BulkRNASeq\/.*$/),
          Polyphemus::LinkerProcessor.new(linker: rna_seq_fastq_linker, model_name: 'rna_seq')
        )
      end

      def rna_seq_processed_linker
        Polyphemus::IpiRnaSeqProcessedFilesLinker.new(project_name: project_name, bucket_name: 'data')
      end

      def rna_seq_fastq_linker
        Polyphemus::IpiRnaSeqRawFastqFilesLinker.new(project_name: project_name, bucket_name: 'integral_data')
      end
    end

    class IpiWatchFoldersEtl < Polyphemus::ProjectWatchFoldersEtl
      def initialize
        super(WatchFoldersConfig.new)
      end
    end
  end
end