# This command should probably be an ETL. We should convert if possible,
#   but I haven't done so because I can't tell what the "search and find
#   files" infrastructure should be.
# This command recursively searches a directory tree to find
#   rna_seq output files (that end with `_rna_seq_table.tsv`)
#   and puts those data into Magma records.

require 'csv'
require 'find'
require 'net/http'
require 'ostruct'
require_relative '../helpers'

class RnaSeqTsv
  attr_reader :tsv_params, :data
  def initialize(project_name, tsv_path)
    @tsv_path = tsv_path
    @project_name = project_name

    @data = {}
    process_tsv
  end

  def [](key)
    case key
    when :rna_seq_plate
      "Plate#{data[key]}"
    when :cell_number
      data[:cell_count]
    when :median_5prime_bias
      data[:median_5p_bias]
    when :median_3prime_bias
      data[:median_3p_bias]
    when :eisenberg_score
      data[:EHK]
    when :expressed_eisenberg_genes
      data[:expressed_EHK_genes]
    when :uniq_map_read_count
      data[:uniq_map_reads]
    when :input_read_count
      data[:input_reads]
    when :multimap_lte20_read_count
      data[:multimap_lte20_reads]
    when :multimap_gt20_read_count
      data[:multimapp_gt20_reads]
    when :chimeric_read_count
      data[:chimeric_reads]
    when :chromosomal_read_count
      data[:chromosomal]
    when :mitochondrial_read_count
      data[:mitochondrial]
    when :flag
      data[:low_exp_flag] if data[:low_exp_flag].downcase != 'false'
    else
      data[key]
    end
  end

  def process_tsv
    CSV.foreach(@tsv_path, col_sep: "\t") do |tsv_line|
      data[:ribosomal_read_count] = tsv_line[2] if tsv_line[0] == 'ribosomal_rna' && tsv_line[1] == 'reads'
      data[tsv_line[1].to_sym] = tsv_line[2] unless tsv_line[1].nil?
    end
  end

  def is_control?
    data[:sample].downcase.start_with?('control')
  end

  def is_jurkat?
    data[:sample].downcase.include?('jurkat')
  end

  def is_uhr?
    data[:sample].downcase.include?('uhr')
  end

  def tube_name
    # Have to account for the validation, mostly for control?

    return "Control_Jurkat.Plate#{data[:rna_seq_plate]}" if is_control? && is_jurkat?

    return "Control_UHR.Plate#{data[:rna_seq_plate]}" if is_control? && is_uhr?

    "#{data[:sample].upcase}.rna.#{data[:compartment].downcase}"
  end
end

class ProcessRnaSeqOutput < Struct.new(:magma_client, :project_name, :file_path, :execute, keyword_init: true)
  include WithLogger

  def initialize(**opts)
    super(**{project_name: 'ipi', execute: false}.update(opts))
  end

  def rna_seq_model
    @rna_seq_model ||= begin
      params = {
        model_name: 'rna_seq',
        record_names: [],
        attribute_names: 'all'
      }

      request = Etna::Clients::Magma::RetrievalRequest.new(
        project_name: project_name, **params)
      magma_client.retrieve(request).models.model('rna_seq')
    end
  end

  def load_rna_seq_output(filepath)
    puts "Processing file #{filepath}."
    rna_seq_tsv = RnaSeqTsv.new(project_name, filepath)
    upload_rna_seq(rna_seq_tsv)
  end

  def process_rna_seq
    Find.find(file_path) do |path|
      load_rna_seq_output(path) if path =~ /.*_rnaseq_table.tsv$/
    end
  end

  def upload_rna_seq(rna_seq_tsv)
    puts "Updating rna seq: #{rna_seq_tsv.tube_name}"
    doc = create_update_doc(rna_seq_tsv)
    puts doc
    if execute
      update_request = Etna::Clients::Magma::UpdateRequest.new(project_name: project_name)
      update_request.update_revision(
        'rna_seq',
        rna_seq_tsv.tube_name,
        doc)
      magma_client.update(update_request)
    end
  end

  def create_update_doc(rna_seq_tsv)
    doc = {}
    uneditable_attributes = ['created_at', 'updated_at', 'tube_name']
    uneditable_control_attributes = ['sample', 'compartment']
    rna_seq_model.template.attributes.attribute_keys.each do |attribute_name|
      next if uneditable_attributes.include?(attribute_name)
      next if rna_seq_tsv.is_control? && uneditable_control_attributes.include?(attribute_name)

      doc[attribute_name] = rna_seq_tsv[attribute_name.to_sym]
    end

    doc
  end
end