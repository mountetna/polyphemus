require_relative 'ipi/ipi_helper'
require_relative 'etls/materialize_gne_magma_records_etl'
require_relative 'etls/sync_gne_metis_files_etl'
require_relative 'etls/magma/magma_etl_script_runner'
require_relative 'etls/redcap/redcap_etl_script_runner'
require_relative 'etls/ipi/ipi_load_magma_population_tables_etl'
require_relative 'etls/sftp_ingest_metis_triage_files_etl'
require_relative 'etls/sync_cat_files_etl'
require_relative 'etls/sftp_ingest_cat_to_c4_triage_files_etl'
require_relative 'etls/slack_notification_c4_triage_files_etl'
require_relative 'etls/slack_notification_metis_triage_files_etl'
