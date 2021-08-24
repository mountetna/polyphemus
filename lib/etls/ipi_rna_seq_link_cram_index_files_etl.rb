require_relative "./ipi_rna_seq_link_processed_files_base_etl"

class Polyphemus::IpiRnaSeqLinkCramIndexFilesEtl < Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl
  PATH_REGEX = /.*\/(?<record_name>.*)\/(?<original_file_name>.*\.deduplicated\.cram\.crai)$/

  def initialize
    super(
      attribute_name: "cram_index",
      path_regex: PATH_REGEX,
    )
  end
end