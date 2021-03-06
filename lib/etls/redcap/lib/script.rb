module Redcap
  class Script
    def initialize(model, script, template)
      @model = model
      @project = model.project
      @template = template
      @attributes ||= script[:attributes].map do |att_name, att_value|
        [ att_name, Redcap::Value.new(att_name, att_value, template) ]
      end.to_h
      @each_entities = script[:each]&.map do |ent|
        Redcap::Entity.create(ent)
      end
    end

    def fields
      @fields ||= @attributes.values.map(&:field_name).uniq
    end

    def each_entities
      @each_entities || @model.each_entities
    end

    def group_by_iter(eavs)
      fields, groups = eavs.group_by do |eav|
        each_entities.map do |ent|
          ent.key(eav)
        end
      end.reject do |record_id, record_eavs|
        record_id.any?(&:nil?)
      end.partition do |record_id, record_eavs|
        record_id.any?{|i| i == :field }
      end.map(&:to_h)

      unless fields.empty?
        groups.each do |record_id, record_eavs|
          masked_record_id = record_id.map.with_index do |id, i|
            each_entities[i].is_a?(Redcap::Entity::Field) ? :field : id
          end
          record_eavs.concat(fields[masked_record_id]) if fields[masked_record_id]
        end
      end

      groups
    end

    def redcap_records
      return @redcap_records if @redcap_records

      eavs = @project.eav_records.select do | eav|
        fields.include?(eav[:field_name])
      end

      return {} unless eavs

      @redcap_records = group_by_iter(eavs).map do |record_id, record_eavs|
        [
          record_id,
          Redcap::Record.new(
            record_eavs,
            @project.flat_records[record_id]
          ).record
        ]
      end.to_h.compact

      return @redcap_records
    end

    def inverse_load
      update = {}

      @model.existing_records.each do |magma_record_name, magma_record|

        next unless @attributes.values.all?{|v| v.valid_magma?(magma_record) }
        redcap_record = redcap_records[ @model.redcap_id(magma_record_name, magma_record) ]

        next unless redcap_record

        update.merge!(
          magma_record_name => update_record(magma_record_name, redcap_record)
        )
      end

      return patched(update)
    end

    def load
      update = {}

      redcap_records.each do |record_id, redcap_record|
        magma_record_name = @model.identifier(*record_id)

        next unless magma_record_name

        next unless @attributes.values.all?{|v| v.valid_redcap?(redcap_record) }

        update.merge!(
          magma_record_name => update_record(magma_record_name, redcap_record)
        )
      end

      return patched(update)
    end

    def update_record(magma_record_name, redcap_record)
      @attributes.map do |att_name, att_value|
        next unless @model.has_attribute?(att_name)

        next if att_value.none?

        [
          att_name,
          @model.cast_type(
            att_value.to_value(redcap_record, magma_record_name),
            att_name, magma_record_name
          )
        ]
      end.compact.to_h
    end

    def patched(update)
      update.each do |id, record|
        record.compact! unless @project.strict

        @model.patch(id, record) unless record.empty?
      end

      update.select do |id,record|
        !record.empty?
      end.to_h
    end
  end
end
