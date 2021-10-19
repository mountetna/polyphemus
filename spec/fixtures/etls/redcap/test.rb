# Define the new classes dynamically
define_model("ModelOne").class_eval do
  def identifier(record_name, redcap_record: nil)
    # Hardcode a temp id so that the offset is consistent. Makes
    #   testing less random.
    "::temp-#{record_name}-xyz"
  end

  def offset_id(record_name)
    record_name
  end
end

define_model("ModelTwo").class_eval do
  def identifier(record_name, redcap_record: nil)
    record_name
  end

  def offset_id(record_name)
    record_name
  end
end

define_model("Stats").class_eval do
  def patch(id, record)
    record[:model_two] = id.split("-")[1]
  end

  def offset_id(record_name)
    record_name
  end
end

define_model("Citation").class_eval do
  def redcap_id(record_name, record)
    record_name.split("-")[1..2]
  end

  def offset_id(record_name)
    record_name
  end
end

define_model("BadModel").class_eval do
  def identifier(record_name, redcap_record: nil)
    # Hardcode a temp id so that the offset is consistent. Makes
    #   testing less random.
    "::temp-#{record_name}-abc"
  end
end

define_model("ModelWithAlternateId").class_eval do
  def identifier(record_name, redcap_record: nil)
    # Hardcode a temp id so that the offset is consistent. Makes
    #   testing less random.
    raise ArgumentError, "Missing :date_of_birth in form" if redcap_record.nil? || redcap_record[:date_of_birth].nil?
  
    "::temp-#{redcap_record[:date_of_birth]}-abc"
  end
end