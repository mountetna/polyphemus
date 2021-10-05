require_relative 'etls/stub_metis_file_etl'
require_relative 'etls/stub_magma_record_etl'
require_relative 'etls/materialize_gne_magma_records_etl'
require_relative 'etls/sync_gne_metis_files_etl'
require_relative 'etls/magma/magma_etl_script_runner'
require_relative 'etls/redcap/redcap_etl_script_runner'
require_relative 'etls/ipi/ipi_load_magma_population_tables_etl'
require_relative 'etls/sftp_ingest_metis_triage_files_etl'
require_relative 'etls/sync_cat_files_etl'
require_relative 'etls/ipi/ipi_rna_seq_create_record_names_etl'
require_relative 'etls/sftp_ingest_cat_to_c4_triage_files_etl'
require_relative 'etls/ipi/ipi_rna_seq_link_raw_fastq_files_etl'
require_relative 'etls/ipi/ipi_rna_seq_populate_attributes_etl'
require_relative 'etls/ipi/ipi_rna_seq_populate_matrices_etl'
require_relative 'etls/ipi/ipi_rna_seq_link_processed_files_etl'
require_relative 'etls/ipi/ipi_rna_seq_add_processed_files_watch_folders_etl'
require_relative 'etls/ipi/ipi_rna_seq_add_raw_fastq_files_watch_folders_etl'
require_relative 'etls/ipi/ipi_rna_seq_add_results_watch_folders_etl'
require_relative 'etls/metis/metis_propagate_folder_updated_at_etl'
require_relative 'etls/slack_notification_c4_triage_files_etl'
require_relative 'etls/slack_notification_metis_triage_files_etl'