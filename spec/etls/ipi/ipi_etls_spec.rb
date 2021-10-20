module IpiMetisEtlTestHelpers
  def folder(folder_path, updated_at = Time.now)
    @folder_id ||= 0
    Etna::Clients::Metis::Folder.new({
      folder_name: File.dirname(folder_path),
      folder_path: folder_path,
      updated_at: updated_at,
      id: (@folder_id += 1)
    })
  end

  def self.included(cls)
    cls.let(:files_etl) { Polyphemus::Ipi::IpiWatchFilesEtl.new }
    cls.let(:folders_etl) { Polyphemus::Ipi::IpiWatchFoldersEtl.new }
    cls.let(:project_name) { "ipi" }
    cls.let(:file_cursor) {
                            Polyphemus::MetisFileEtlCursor.new(
                              job_name: "test",
                              project_name: project_name,
                              bucket_name: bucket_name,
                            )
                          }
    cls.let(:folder_cursor) {
                              Polyphemus::MetisFolderEtlCursor.new(
                                job_name: "test",
                                project_name: project_name,
                                bucket_name: bucket_name,
                              )
                            }
    cls.let(:helper) { IpiHelper.new("lib/etls/renaming/projects/test_renames.json") }

    cls.before(:each) do
      allow(IpiHelper).to receive(:new).and_return(helper)

      stub_metis_setup
      copy_renaming_project

      stub_magma_update_json
      stub_magma_models(fixture: "spec/fixtures/magma_ipi_models_with_records.json")
    end
  end
end

describe Polyphemus::Ipi::SingleCellLinkers do
  let(:etl) do
    class TestSingleCellConfig < Polyphemus::ProjectWatchFoldersConfig
      include Polyphemus::Ipi::SingleCellLinkers

      def initialize
        super(project_name: 'ipi')
        add_single_cell_linkers!
      end
    end

    class TestSingleCellWatchEtl < Polyphemus::ProjectWatchFoldersEtl
      def initialize
        super(TestSingleCellConfig.new)
      end
    end

    TestSingleCellWatchEtl.new
  end

  let(:project_name) { 'ipi' }
  let(:bucket_name) { 'data' }

  let(:cursor) do
    Polyphemus::MetisFolderEtlCursor.new(
      job_name: "test",
      project_name: project_name,
      bucket_name: bucket_name,
    )
  end

  it 'works' do
    VCR.use_cassette('ipi_sc_processed_linker.e2e') do
      metis_client = Etna::Clients::Metis.new(
        host: 'https://metis.ucsf.edu',
        token: ENV['TOKEN'] || TEST_TOKEN,
      )

      magma_client = Etna::Clients::Magma.new(
        host: 'https://magma.ucsf.edu',
        token: ENV['TOKEN'] || TEST_TOKEN,
      )

      allow(Etna::Clients::Metis).to receive(:new).and_return(metis_client)
      allow(Etna::Clients::Magma).to receive(:new).and_return(magma_client)

      update_request_raw = {}
      expect(magma_client).to receive(:update_json).twice.and_wrap_original do |m, request|
        update_request_raw.update(request.as_json)
      end

      test_root_folder_ids = metis_client.find(
        Etna::Clients::Metis::FindRequest.new(
          project_name: project_name,
          bucket_name: bucket_name,
          params: [Etna::Clients::Metis::FindParam.new(
            attribute: "name",
            predicate: "=",
            value: 'IPIPOOL001_P1_scRNA_XVIPBMC',
            type: "folder",
          )],
        )
      ).folders.all.map(&:id)

      test_folders = metis_client.find(
        Etna::Clients::Metis::FindRequest.new(
          project_name: project_name,
          bucket_name: bucket_name,
          params: [Etna::Clients::Metis::FindParam.new(
            attribute: "folder_id",
            predicate: "in",
            value: test_root_folder_ids,
            type: "folder",
          )],
        )
      ).folders.all

      etl.process(
        cursor,
        test_folders
      )

      expect(update_request_raw).to eql({
        project_name: 'ipi',
        revisions: {
          "sc_rna_seq_pool" => {
            "IPIPOOL001.P1.scrna.xvipbmc" => {
              "filtered_counts_h5" => { "original_filename" => "filtered_feature_bc_matrix.h5", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/filtered_feature_bc_matrix.h5" },
              "processed_robject_rdata" => { "original_filename" => "IPIPOOL001.P1.scRNA.XVIPBMC_scTransformed_processed.RData", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/automated_processing/IPIPOOL001.P1.scRNA.XVIPBMC_scTransformed_processed.RData" },
              "processed_umap" => { "original_filename" => "IPIPOOL001.P1.scRNA.XVIPBMC_umap.pdf", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/automated_processing/IPIPOOL001.P1.scRNA.XVIPBMC_umap.pdf" },
              "processing_pipeline_parameters" => { "original_filename" => "cutoffs.yml", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/automated_processing/cutoffs.yml" },
              "raw_counts_h5" => { "original_filename" => "raw_feature_bc_matrix.h5", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/raw_feature_bc_matrix.h5" },
              "tenx_aligned_bam" => { "original_filename" => "possorted_genome_bam.bam", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/possorted_genome_bam.bam" },
              "tenx_aligned_bam_index" => { "original_filename" => "possorted_genome_bam.bam.bai", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/possorted_genome_bam.bam.bai" },
              "tenx_cloupe_file" => { "original_filename" => "cloupe.cloupe", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/cloupe.cloupe" },
              "tenx_metrics_csv" => { "original_filename" => "metrics_summary.csv", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/metrics_summary.csv" },
              "tenx_molecule_info_h5" => { "original_filename" => "molecule_info.h5", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/molecule_info.h5" },
              "tenx_web_summary" => { "original_filename" => "web_summary.html", "path" => "metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v3_chemistry/IPIPOOL001/IPIPOOL001_P1_scRNA_XVIPBMC/cellranger/web_summary.html" }
            }
          }
        },
      })

      update_request_raw.clear

      test_folders = metis_client.find(
        Etna::Clients::Metis::FindRequest.new(
          project_name: project_name,
          bucket_name: bucket_name,
          params: [Etna::Clients::Metis::FindParam.new(
            attribute: "name",
            predicate: "=",
            value: 'IPIHEP034.T1.scrna.cd45neg',
            type: "folder",
          )],
        )
      ).folders.all

      etl.process(
        cursor,
        test_folders
      )

      expect(update_request_raw).to eql({
        project_name: 'ipi',
        revisions: {
          "sc_rna_seq" => {
            "IPIHEP034.T1.scrna.cd45neg" => {
              "tenx_cloupe_file" => {"original_filename"=>"cloupe.cloupe", "path"=>"metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v2_chemistry/HEP/IPIHEP034.T1.scrna.cd45neg/cloupe.cloupe"},
              "tenx_metrics_csv" => {"original_filename"=>"metrics_summary.csv", "path"=>"metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v2_chemistry/HEP/IPIHEP034.T1.scrna.cd45neg/metrics_summary.csv"},
              "tenx_molecule_info_h5" => {"original_filename"=>"molecule_info.h5", "path"=>"metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v2_chemistry/HEP/IPIHEP034.T1.scrna.cd45neg/molecule_info.h5"},
              "tenx_web_summary" => {"original_filename"=>"web_summary.html", "path"=>"metis://ipi/data/single_cell_GEX/processed/3prime_GEX/v2_chemistry/HEP/IPIHEP034.T1.scrna.cd45neg/web_summary.html"}
            }
          }
        }
      })
    end
  end
end

describe Polyphemus::Ipi::IpiWatchFilesEtl do
  include IpiMetisEtlTestHelpers
  let(:etl) { files_etl }
  let(:cursor) { file_cursor }
  let(:folders) { [
  ] }

  before(:each) do
    Polyphemus::AddWatchFolderBaseEtl.new(
      bucket_watch_configs: folders_etl.config.bucket_configs
    ).process(
      folder_cursor,
      folders
    )
  end

  describe 'link_rna_seq_raw_fastq_files' do
    let(:bucket_name) { "integral_data" }
    let(:folders) { [
      folder("BulkRNASeq/PATIENT001.T1.comp")
    ] }

    describe 'updates magma records' do
      it "when scanner finds new files" do
        etl.process(cursor, [
          create_metis_file("PATIENT001.T1.comp.blahblah1.fastq.gz", "BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah1.fastq.gz", project_name: project_name, bucket_name: bucket_name),
          create_metis_file("PATIENT001.T1.comp.blahblah2.fastq.gz", "BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah2.fastq.gz", project_name: project_name, bucket_name: bucket_name),
          create_metis_file("PATIENT001.T1.comp.blahblah3.fastq.gz", "BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah3.fastq.gz", project_name: project_name, bucket_name: bucket_name),
        ])

        # Make sure rna_seq records are updated
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq": {
                "PATIENT001.T1.comp": {
                  "raw_fastq_files": [{
                    "path": "metis://ipi/integral_data/BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah1.fastq.gz",
                    "original_filename": "PATIENT001.T1.comp.blahblah1.fastq.gz",
                  }, {
                    "path": "metis://ipi/integral_data/BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah2.fastq.gz",
                    "original_filename": "PATIENT001.T1.comp.blahblah2.fastq.gz",
                  }, {
                    "path": "metis://ipi/integral_data/BulkRNASeq/PATIENT001.T1.comp/PATIENT001.T1.comp.blahblah3.fastq.gz",
                    "original_filename": "PATIENT001.T1.comp.blahblah3.fastq.gz",
                  }],
                },
              },
            },
          }))
      end
    end
  end

  describe 'link_processed_rna_seq_files' do
    let(:bucket_name) { "data" }
    let(:folders) { [
      folder("bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp")
    ] }

    describe 'updates magma records' do
      it "when scanner finds new files for file attribute" do
        etl.process(cursor, [
          create_metis_file("PATIENT001.T1.comp.deduplicated.cram", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.deduplicated.cram", project_name: project_name, bucket_name: bucket_name),
        ])

        # Make sure rna_seq records are updated
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq": {
                "PATIENT001.T1.comp": {
                  "cram": {
                    "path": "metis://ipi/data/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.deduplicated.cram",
                    "original_filename": "PATIENT001.T1.comp.deduplicated.cram",
                  },
                },
              },
            },
          }))

        # Make sure rna_seq records are updated
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/retrieve/)
          .with(body: hash_including({
            project_name: project_name,
            model_name: "rna_seq",
            page_size: 1,
            attribute_names: "all",
            record_names: ["PATIENT001.T1.comp"],
            hide_templates: true,
          }))
      end

      it "when scanner finds new files for file_collection attribute" do
        etl.process(cursor, [
          create_metis_file("PATIENT001.T1.comp.unmapped.1.fastq.gz", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.1.fastq.gz", project_name: project_name, bucket_name: bucket_name),
          create_metis_file("PATIENT001.T1.comp.unmapped.2.fastq.gz", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.2.fastq.gz", project_name: project_name, bucket_name: bucket_name),
        ])

        # Make sure rna_seq records are updated
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq": {
                "PATIENT001.T1.comp": {
                  "unmapped_fastqs": [{
                    "path": "metis://ipi/data/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.1.fastq.gz",
                    "original_filename": "PATIENT001.T1.comp.unmapped.1.fastq.gz",
                  }, {
                    "path": "metis://ipi/data/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.comp/PATIENT001.T1.comp.unmapped.2.fastq.gz",
                    "original_filename": "PATIENT001.T1.comp.unmapped.2.fastq.gz",
                  }],
                },
              },
            },
          }))
      end

      it "correctly ignores non-cancer files" do
        etl.process(cursor, [
          create_metis_file("PATIENT001.T1.NAFLD.blahblah3.junction", "bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.NAFLD/PATIENT001.T1.NAFLD.blahblah3.junction"),
        ])

        # Make sure rna_seq records are NOT updated
        expect(WebMock).not_to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq": {
                "PATIENT001.T1.NAFLD": {
                  "junction": {
                    "path": "metis://ipi/data/bulkRNASeq/plate1_blahblah/output/PATIENT001.T1.NAFLD/PATIENT001.T1.NAFLD.blahblah3.junction",
                    "original_filename": "PATIENT001.T1.NAFLD.blahblah3.junction",
                  },
                },
              },
            },
          }))
      end

      describe 'with tubes that need renaming' do
        let(:folders) { [
          folder("bulkRNASeq/plate1_blahblah/output/WRONG001.T1.rna.tumor")
        ] }
        it "correctly renames renamed tube_names" do
          etl.process(cursor, [
            create_metis_file("WRONG001.T1.rna.tumor.deduplicated.cram.crai", "bulkRNASeq/plate1_blahblah/output/WRONG001.T1.rna.tumor/WRONG001.T1.rna.tumor.deduplicated.cram.crai", project_name: project_name, bucket_name: bucket_name),
          ])

          # Make sure rna_seq records are updated for renamed patient, but pointing to the "wrong" file locations
          expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
            .with(body: hash_including({
              "revisions": {
                "rna_seq": {
                  "RIGHT001.T1.rna.tumor": {
                    "cram_index": {
                      "path": "metis://ipi/data/bulkRNASeq/plate1_blahblah/output/WRONG001.T1.rna.tumor/WRONG001.T1.rna.tumor.deduplicated.cram.crai",
                      "original_filename": "WRONG001.T1.rna.tumor.deduplicated.cram.crai",
                    },
                  },
                },
              },
            }))
        end
      end
    end
  end
end

describe Polyphemus::Ipi::IpiWatchFoldersEtl do
  include IpiMetisEtlTestHelpers
  let(:etl) { folders_etl }
  let(:files) { [] }
  let(:cursor) { folder_cursor }

  before(:each) do
    stub_request(:post, /#{METIS_HOST}\/#{project_name}\/find\/#{bucket_name}/)
      .to_return({
        status: 200,
        headers: {
          'Content-Type' => 'application/json'
        },
        body: {
                files: files,
                folders: [],
              }.to_json
      })
  end

  describe 'propagate folder updated at' do
    let(:bucket_name) { "data" }
    let(:etl) { Polyphemus::Ipi::IpiPropagateFolderUpdatedAt.new }
    it "touches children folders with updated_at older than parent" do
      now = DateTime.now
      Timecop.freeze(now - 100)

      stub_touch_folder(
        project: project_name,
        bucket: bucket_name,
      )
      stub_list_folder(
        url_verb: "list_by_id",
        project: project_name,
        bucket: bucket_name,
        response_body: {
          files: [],
          folders: [{
            project_name: project_name,
            bucket_name: bucket_name,
            folder_path: "output/PATIENT001.T1.comp",
            updated_at: (now - 200).iso8601,
          }],
        },
      )

      etl.process(cursor, [
        create_metis_folder("output", "output", updated_at: now - 100, id: 1, project_name: project_name, bucket_name: bucket_name),
      ])

      expect(WebMock).to have_requested(:get, /#{METIS_HOST}\/#{project_name}\/folder\/touch\/#{bucket_name}\/output\/PATIENT001.T1.comp/)

      Timecop.return
    end

    it "does not touch children folders with updated_at newer than parent" do
      now = DateTime.now
      Timecop.freeze(now - 100)

      stub_list_folder(
        url_verb: "list_by_id",
        project: project_name,
        bucket: bucket_name,
        response_body: {
          files: [],
          folders: [{
            project_name: project_name,
            bucket_name: bucket_name,
            folder_path: "output/PATIENT001.T1.comp",
            updated_at: (now - 10).iso8601,
          }],
        },
      )

      etl.process(cursor, [
        create_metis_folder("output", "output", updated_at: now - 100, id: 1, project_name: project_name, bucket_name: bucket_name),
      ])

      expect(WebMock).not_to have_requested(:get, /#{METIS_HOST}\/#{project_name}\/folder\/touch\/#{bucket_name}\/output\/PATIENT001.T1.comp/)

      Timecop.return
    end
  end

  describe 'process_bulk_rna_seq_results' do
    let(:bucket_name) { 'data' }

    describe "processes files in found folders" do
      let(:files) do
        [{
          file_name: "rnaseq_table.tsv",
          download_url: "/#{project_name}/download/rnaseq_table.tsv",
          bucket_name: bucket_name,
          project_name: project_name,
          folder_id: 1,
        }]
      end

      describe "for attributes" do
        it 'works' do
          stub_download_file(
            project: project_name,
            file_contents: ::File.read("./spec/fixtures/ipi_rna_seq_results.tsv"),
          )

          etl.process(cursor, [
            create_metis_folder("results", "bulkRNASeq/plate1_rnaseq_new/results", id: 1),
            create_metis_folder("results", "bulkRNASeq/plate2_rnaseq_new/results", id: 2),
          ])

          # Make sure rna_seq records are updated, once per rna_seq record. Only when file is found.
          #   Three valid records in the given response, so three updates.
          expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/).times(3)
        end
      end

      describe "for matrices" do
        let(:files) do
          [{
            file_name: "gene_counts_table.tsv",
            download_url: "/#{project_name}/download/gene_counts_table.tsv",
            bucket_name: bucket_name,
            project_name: project_name,
            folder_id: 1,
          }]
        end

        it 'works' do
          stub_download_file(
            project: project_name,
            file_contents: ::File.read("./spec/fixtures/ipi_gene_counts.tsv"),
          )

          etl.process(cursor, [
            create_metis_folder("results", "bulkRNASeq/plate1_rnaseq_new/results", id: 1),
            create_metis_folder("results", "bulkRNASeq/plate2_rnaseq_new/results", id: 2),
          ])

          # Make sure rna_seq records are updated, once per rna_seq record. Only when file is found.
          #   two records in the given response, so two updates.
          expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/).times(2)
        end
      end
    end

    it "for invalid NASH / NAFLD samples" do
      expect(Polyphemus::WatchFolder.count).to eq(0)

      etl.process(cursor, [
        create_metis_folder("results", "bulkRNASeq/plate1_rnaseq_new/results", id: 1),
        create_metis_folder("results", "bulkRNASeq/plate2_rnaseq_new/results", id: 2),
      ])

      expect(Polyphemus::WatchFolder.count).to eq(2)
    end
  end

  describe 'link_rna_seq_raw_fastq_files' do
    let(:bucket_name) { "integral_data" }
    let(:files) do
      [
        {
          file_name: "something.fastq.gz",
          folder_id: 1,
          bucket_name: bucket_name,
          project_name: project_name,
          file_path: "some_folder/BulkRNASeq/PATIENT001.T1.comp/something.fastq.gz"
        }
      ]
    end

    describe "create Polyphemus::WatchFile records" do
      it "for invalid NASH / NAFLD samples" do
        expect(Polyphemus::WatchFolder.count).to eq(0)

        etl.process(cursor, [
          create_metis_folder("IPIADR001.NASH1.rna.live", "some_folder/BulkRNASeq/IPIADR001.NASH1.rna.live", id: 1),
          create_metis_folder("IPIADR001.NAFLD1.rna.live", "some_folder/BulkRNASeq/IPIADR001.NAFLD1.rna.live", id: 2),
        ])

        expect(Polyphemus::WatchFolder.count).to eq(2)
      end

      it "for incorrectly named samples" do
        expect(Polyphemus::WatchFolder.count).to eq(0)

        etl.process(cursor, [
          create_metis_folder("WRONG001.T1.rna.tumor", "some_folder/BulkRNASeq/WRONG001.T1.rna.tumor", id: 1),
        ])

        expect(Polyphemus::WatchFolder.count).to eq(1)
      end
    end

    it "links files in found folders" do
      etl.process(cursor, [
        create_metis_folder("PATIENT001.T1.comp", "some_folder/BulkRNASeq/PATIENT001.T1.comp", id: 1),
        create_metis_folder("PATIENT001.N1.comp", "some_folder/BulkRNASeq/PATIENT001.N1.comp", id: 2),
        create_metis_folder("PATIENT002.T1.comp", "some_folder/BulkRNASeq/PATIENT002.T1.comp", id: 3),
      ])

      # Make sure rna_seq records are updated. Once per folder with files.
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
    end
  end

  describe 'link_processed_rna_seq_files' do
    let(:bucket_name) { "data" }

    let(:files) do
      [
        {
          file_name: "something.fastq.gz",
          folder_id: 1,
          bucket_name: bucket_name,
          project_name: project_name,
          file_path: "bulkRNASeq/plate1_rnaseq_new/output/PATIENT001.T1.comp/something.fastq.gz"
        }
      ]
    end

    describe 'magma record creation' do

      it "for all rna_seq" do
        etl.process(cursor, [
          folder("bulkRNASeq/plate1_rnaseq_new/output/IPIADR001.N1.rna.live"),
          folder("bulkRNASeq/plate1_rnaseq_new/output2/IPIADR001.T1.rna.live"),
          folder("bulkRNASeq/plate2_rnaseq_new/output/IPIBLAD001.T1.rna.live"),
        ])

        # Make sure plates are created
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq_plate": {
                "Plate1": {
                  "project": "UCSF Immunoprofiler",
                },
                "Plate2": {
                  "project": "UCSF Immunoprofiler",
                },
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
        etl.process(cursor, [
          folder("bulkRNASeq/plate1_rnaseq_new/output/IPIADR001.NASH1.rna.live"),
          folder("bulkRNASeq/plate1_rnaseq_new/output/IPIADR001.NAFLD1.rna.live"),
        ])

        # Plates created anyways ... no plate is purely ignored samples,
        #   so this is okay.
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq_plate": {
                "Plate1": {
                  "project": "UCSF Immunoprofiler",
                },
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
        etl.process(cursor, [
          folder("bulkRNASeq/plate1_rnaseq_new/output/CONTROL_jurkat.plate1"),
          folder("bulkRNASeq/plate2_rnaseq_new/output/CONTROL_uhr.plate2"),
        ])

        # Make sure plates are created
        expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/)
          .with(body: hash_including({
            "revisions": {
              "rna_seq_plate": {
                "Plate1": {
                  "project": "UCSF Immunoprofiler",
                },
                "Plate2": {
                  "project": "UCSF Immunoprofiler",
                },
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

    describe "create Polyphemus::WatchFile records" do
      it "for invalid NASH / NAFLD samples" do
        expect do
          etl.process(cursor, [
            create_metis_folder("IPIADR001.NASH1.rna.live", "bulkRNASeq/plate1_rnaseq_new/output/IPIADR001.NASH1.rna.live", id: 1),
            create_metis_folder("IPIADR001.NAFLD1.rna.live", "bulkRNASeq/plate1_rnaseq_new/output/IPIADR001.NAFLD1.rna.live", id: 2),
          ])
        end.to change { Polyphemus::WatchFolder.count }.to(2)
      end

      it "for incorrectly named samples" do
        expect(Polyphemus::WatchFolder.count).to eq(0)

        etl.process(cursor, [
          create_metis_folder("WRONG001.T1.rna.tumor", "bulkRNASeq/plate1_rnaseq_new/output/WRONG001.T1.rna.tumor", id: 1),
        ])

        expect(Polyphemus::WatchFolder.count).to eq(1)
      end
    end

    it "links files in found folders" do
      etl.process(cursor, [
        create_metis_folder("PATIENT001.T1.comp", "bulkRNASeq/plate1_rnaseq_new/output/PATIENT001.T1.comp", id: 1, project_name: project_name, bucket_name: bucket_name),
        create_metis_folder("PATIENT001.N1.comp", "bulkRNASeq/plate1_rnaseq_new/output/PATIENT001.N1.comp", id: 2, project_name: project_name, bucket_name: bucket_name),
        create_metis_folder("PATIENT002.T1.comp", "bulkRNASeq/plate2_rnaseq_new/output/PATIENT002.T1.comp", id: 3, project_name: project_name, bucket_name: bucket_name),
      ])
      # Make sure rna_seq records are created and updated.
      # Once per process per folder when files found.
      expect(WebMock).to have_requested(:post, /#{MAGMA_HOST}\/update/).times(2)
    end
  end
end