describe Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl do
  let(:cursor) {
    Polyphemus::MetisFileForMagmaModelEtlCursor.new(
      job_name: "test",
      project_name: "ipi",
      bucket_name: "test",
      model_name: "rna_seq",
    )
  }
  let(:helper) { IpiHelper.new("lib/etls/renaming/projects/test_renames.json") }

  before(:each) do
    allow(IpiHelper).to receive(:new).and_return(helper)
    stub_metis_setup
    copy_renaming_project
    @all_updates = []
  end

  def file(file_name, file_path, file_hash = SecureRandom.hex, updated_at = Time.now)
    Etna::Clients::Metis::File.new({
      file_name: file_name,
      file_path: file_path,
      updated_at: updated_at,
      file_hash: file_hash,
    })
  end

  describe "updates Magma records" do
    before(:each) do
      stub_magma_update_json
      stub_magma_models(fixture: "spec/fixtures/magma_ipi_models_with_records.json")
    end

    it "when scanner finds new files for file attribute" do
      etl = Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl.new(
        attribute_name: "cram",
        path_regex: /something/,
      )

      etl.process(cursor, mock_metis_files_for_record_scan(
        "PATIENT001.T1.comp", [
          file("PATIENT001.T1.comp.deduplicated.cram", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.deduplicated.cram"),
        ]
      ))

      # Make sure rna_seq records are updated
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "PATIENT001.T1.comp": {
                                         "cram": {
                                           "path": "metis://ipi/test/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.deduplicated.cram",
                                           "original_filename": "PATIENT001.T1.comp.deduplicated.cram",
                                         },
                                       },
                                     },
                                   },
                                 }))
    end

    it "when scanner finds new files for file_collection attribute" do
      etl = Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl.new(
        attribute_name: "unmapped_fastqs",
        path_regex: /something/,
      )

      etl.process(cursor, mock_metis_files_for_record_scan(
        "PATIENT001.T1.comp", [
          file("PATIENT001.T1.comp.unmapped.1.fastq.gz", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.1.fastq.gz"),
          file("PATIENT001.T1.comp.unmapped.2.fastq.gz", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.2.fastq.gz"),

        ]
      ))

      # Make sure rna_seq records are updated
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "PATIENT001.T1.comp": {
                                         "unmapped_fastqs": [{
                                           "path": "metis://ipi/test/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.1.fastq.gz",
                                           "original_filename": "PATIENT001.T1.comp.unmapped.1.fastq.gz",
                                         }, {
                                           "path": "metis://ipi/test/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.2.fastq.gz",
                                           "original_filename": "PATIENT001.T1.comp.unmapped.2.fastq.gz",
                                         }],
                                       },
                                     },
                                   },
                                 }))
    end

    it "correctly ignores non-cancer files" do
      etl = Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl.new(
        attribute_name: "junction",
        path_regex: /foo/,
      )

      etl.process(cursor, mock_metis_files_for_record_scan(
        "PATIENT001.T1.NAFLD", [
          file("PATIENT001.T1.NAFLD.blahblah3.junction", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.NAFLD/PATIENT001.T1.NAFLD.blahblah3.junction"),
        ]
      ))

      # Make sure rna_seq records are NOT updated
      expect(WebMock).not_to have_requested(:post, /#{MAGMA_HOST}\/update/)
                               .with(body: hash_including({
                                       "revisions": {
                                         "rna_seq": {
                                           "PATIENT001.T1.NAFLD": {
                                             "junction": {
                                               "path": "metis://ipi/test/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.NAFLD/PATIENT001.T1.NAFLD.blahblah3.junction",
                                               "original_filename": "PATIENT001.T1.NAFLD.blahblah3.junction",
                                             },
                                           },
                                         },
                                       },
                                     }))
    end

    it "correctly renames renamed tube_names" do
      etl = Polyphemus::IpiRnaSeqLinkProcessedFilesBaseEtl.new(
        attribute_name: "cram_index",
        path_regex: /blah/,
      )

      etl.process(cursor, mock_metis_files_for_record_scan(
        "WRONG001.T1.rna.tumor", [
          file("WRONG001.T1.rna.tumor.deduplicated.cram.crai", "bulkRNASeq/plate1_blahblah/output/WRONG001.T1.rna.tumor/WRONG001.T1.rna.tumor.deduplicated.cram.crai"),
        ]
      ))

      # Make sure rna_seq records are updated for renamed patient, but pointing to the "wrong" file locations
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "RIGHT001.T1.rna.tumor": {
                                         "cram_index": {
                                           "path": "metis://ipi/test/bulkRNASeq/plate1_blahblah/output/WRONG001.T1.rna.tumor/WRONG001.T1.rna.tumor.deduplicated.cram.crai",
                                           "original_filename": "WRONG001.T1.rna.tumor.deduplicated.cram.crai",
                                         },
                                       },
                                     },
                                   },
                                 }))
    end
  end
end
