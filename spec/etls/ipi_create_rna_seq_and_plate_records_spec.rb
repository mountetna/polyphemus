describe Polyphemus::IpiCreateRnaSeqAndPlateRecordsEtl do
  before(:each) do
    stub_metis_setup
    stub_magma_models(fixture: "spec/fixtures/magma_ipi_models.json")
    @all_updates = []
  end

  def folder(folder_name, folder_path, updated_at = Time.now)
    Etna::Clients::Metis::Folder.new({
      folder_name: folder_name,
      folder_path: folder_path,
      updated_at: updated_at,
    })
  end

  def updates
    @all_updates.inject({}) do |acc, n|
      n.keys.each do |k|
        (acc[k] ||= {}).update(n[k])
      end
      acc
    end
  end

  it "creates containing records" do
    stub_magma_update
    stub_metis_scan([
      folder("IPIADR001.N1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.N1.rna.live"),
      folder("IPIADR001.T1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.T1.rna.live"),
      folder("IPIBLAD001.T1.rna.live", "bucket/plate2_rnaseq_new/output/IPIBLAD001.T1.rna.live"),
    ])

    etl = Polyphemus::IpiCreateRnaSeqAndPlateRecordsEtl.new

    etl.run_once

    # Make sure containing records are created
    expect(updates).to eq(
      { "experiment" => {
        "Adrenal" => { "name" => "Adrenal", "project" => "UCSF Immunoprofiler" },
        "Bladder" => { "name" => "Bladder", "project" => "UCSF Immunoprofiler" },
      }, "patient" => {
        "IPIADR001" => { "experiment" => "Adrenal", "name" => "IPIADR001" },
        "IPIBLAD001" => { "experiment" => "Bladder", "name" => "IPIBLAD001" },
      }, "project" => { "UCSF Immunoprofiler" => { "name" => "UCSF Immunoprofiler" } }, "sample" => {
        "IPIADR001.N1" => { "name" => "IPIADR001.N1", "patient" => "IPIADR001" },
        "IPIADR001.T1" => { "name" => "IPIADR001.T1", "patient" => "IPIADR001" },
        "IPIBLAD001.T1" => { "name" => "IPIBLAD001.T1", "patient" => "IPIBLAD001" },
      } }
    )
  end

  describe "create Magma records" do
    before(:each) do
      stub_magma_update_json
      stub_magma_models(fixture: "spec/fixtures/magma_ipi_models_with_records.json")
    end

    it "for all rna_seq" do
      stub_metis_scan([
        folder("IPIADR001.N1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.N1.rna.live"),
        folder("IPIADR001.T1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.T1.rna.live"),
        folder("IPIBLAD001.T1.rna.live", "bucket/plate2_rnaseq_new/output/IPIBLAD001.T1.rna.live"),
      ])

      etl = Polyphemus::IpiCreateRnaSeqAndPlateRecordsEtl.new

      etl.run_once

      # Make sure plates are created
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq_plate": {
                                       "Plate1": {},
                                       "Plate2": {},
                                     },
                                   },
                                 }))

      # Make sure rna_seq records are created
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "IPIADR001.N1.rna.live": {
                                         "rna_seq_plate": "Plate1",
                                         "sample": "IPIADR001.N1",
                                       },
                                       "IPIADR001.T1.rna.live": {
                                         "rna_seq_plate": "Plate1",
                                         "sample": "IPIADR001.T1",
                                       },
                                     },
                                   },
                                 }))
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "IPIBLAD001.T1.rna.live": {
                                         "rna_seq_plate": "Plate2",
                                         "sample": "IPIBLAD001.T1",
                                       },
                                     },
                                   },
                                 }))
    end

    it "does not create NASH / NAFLD samples" do
      stub_metis_scan([
        folder("IPIADR001.NASH1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.NASH1.rna.live"),
        folder("IPIADR001.NAFLD1.rna.live", "bucket/plate1_rnaseq_new/output/IPIADR001.NAFLD1.rna.live"),
      ])

      etl = Polyphemus::IpiCreateRnaSeqAndPlateRecordsEtl.new

      etl.run_once

      # No plates are 100% NASH / NAFLD, so this is okay
      # Make sure plates are created
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq_plate": {
                                       "Plate1": {},
                                     },
                                   },
                                 }))

      # Make sure NO rna_seq records are created
      expect(WebMock).not_to have_requested(:post, /#{MAGMA_HOST}\/update/)
                               .with(body: hash_including({
                                       "revisions": {
                                         "rna_seq": {
                                           "IPIADR001.NASH1.rna.live": {
                                             "rna_seq_plate": "Plate1",
                                             "sample": "IPIADR001.NASH1",
                                           },
                                         },
                                       },
                                     }))
      expect(WebMock).not_to have_requested(:post, /#{MAGMA_HOST}\/update/)
                               .with(body: hash_including({
                                       "revisions": {
                                         "rna_seq": {
                                           "IPIADR001.NAFLD1.rna.live": {
                                             "rna_seq_plate": "Plate1",
                                             "sample": "IPIADR001.NAFLD1",
                                           },
                                         },
                                       },
                                     }))
    end

    it "for control" do
      stub_metis_scan([
        folder("CONTROL_jurkat.plate1", "bucket/plate1_rnaseq_new/output/CONTROL_jurkat.plate1"),
        folder("CONTROL_uhr.plate2", "bucket/plate2_rnaseq_new/output/CONTROL_uhr.plate2"),
      ])

      etl = Polyphemus::IpiCreateRnaSeqAndPlateRecordsEtl.new

      etl.run_once

      # Make sure plates are created
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq_plate": {
                                       "Plate1": {},
                                       "Plate2": {},
                                     },
                                   },
                                 }))

      # Make sure Control record names work with validation and not attached to sample
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "Control_Jurkat.Plate1": {
                                         "rna_seq_plate": "Plate1",
                                       },
                                     },
                                   },
                                 }))
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
                           .with(body: hash_including({
                                   "revisions": {
                                     "rna_seq": {
                                       "Control_UHR.Plate2": {
                                         "rna_seq_plate": "Plate2",
                                       },
                                     },
                                   },
                                 }))
    end
  end

  def stub_metis_scan(change_list)
    allow_any_instance_of(Polyphemus::TimeScanBasedEtlScanner).to receive(:find_batch).and_return(change_list)
  end
end
