require_relative '../magma_record_etl'

class Polyphemus::StubMagmaRecordEtl < Polyphemus::MagmaRecordEtl
  def initialize
    super(project_model_pairs: [])
  end

  def process(cursor, files)
  end
end