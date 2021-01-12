describe Polyphemus::RedcapEtlScriptRunner do
  context 'dateshifts' do
    before do
      stub_magma_models
      stub_redcap_data
      copy_redcap_project
    end

    it 'throws exception if salt when not provided' do
      expect {
        Polyphemus::RedcapEtlScriptRunner.new(
          project_name: 'test',
          model_names: "all",
          redcap_tokens: ["faketoken"],
          dateshift_salt: nil,
          redcap_host: REDCAP_HOST,
          magma_host: MAGMA_HOST
        )
      }.to raise_error(RuntimeError, "No dateshift_salt provided, please provide one.")
    end

    it 'uses the provided salt' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: "all",
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      system_config = redcap_etl.system_config

      expect(system_config[:dateshift_salt]).to eq('123')
    end
  end


  context 'redcap tokens' do
    before do
      stub_magma_models
      stub_redcap_data
      copy_redcap_project
    end

    it 'throws exception if not provided' do
      expect {
        Polyphemus::RedcapEtlScriptRunner.new(
          project_name: 'test',
          model_names: "all",
          redcap_tokens: [],
          dateshift_salt: "123",
          redcap_host: REDCAP_HOST,
          magma_host: MAGMA_HOST
        )
      }.to raise_error(RuntimeError, "Must provide at least one REDCap token.")
    end
  end

  context 'loads' do
    before do
      stub_magma_models
      stub_redcap_data
      copy_redcap_project
    end

    let(:raw_data) {
      JSON.parse(File.read('spec/fixtures/redcap_mock_data.json'), symbolize_names: true)
    }

    let(:raw_template) {
      JSON.parse(File.read('spec/fixtures/redcap_mock_metadata.json'), symbolize_names: true)
    }

    def data_for_id(id)
      raw_data.each do |record|
        return record if record[:record] == id
      end
      return nil
    end

    def template_for_field(field)
      raw_template.each do |record|
        return record if record[:field_name] == field
      end
      return nil
    end

    def temp_id(records, id)
      all_record_keys = []
      records.keys.each do |key|
        all_record_keys.concat(records[key].keys)
      end

      all_record_keys.each do |key|
        return key if key =~ /::temp-#{id}-.*/
      end
    end

    it 'all models' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: "all",
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      raw_data_456 = data_for_id('456')
      raw_data_000 = data_for_id('000')
      raw_data_123 = data_for_id('123')
      id_456 = temp_id(records, "456")
      id_000 = temp_id(records, "000")
      id_123 = "123"

      # Dateshift checks
      expect(records[:model_one][id_456][:birthday]).not_to eq(raw_data_456[:value])
      expect(records[:model_one][id_456][:birthday].start_with?('1899')).to eq(true)
      expect(records[:model_one][id_000][:graduation_date]).not_to eq(raw_data_000[:value])
      expect(records[:model_one][id_000][:graduation_date].start_with?('2021')).to eq(true)
      expect(records[:model_two][id_123][:yesterday]).not_to eq(raw_data_123[:value])
      expect(records[:model_two][id_123][:yesterday].start_with?('2019')).to eq(true)
    end

    it 'specific models' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_one"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_one)).to eq(true)
      expect(records[:model_one].keys.length).to eq(3)
      expect(records.keys.include?(:model_two)).to eq(false)
    end

    it 'form label attributes' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_two"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      raw_template_today = template_for_field('today')
      id_123 = "123"

      expect(records[:model_two][id_123][:label]).to eq(raw_template_today[:field_label])
    end

    it 'multiple REDCap projects' do
      stub_redcap_multi_project_records

      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_one"],
        redcap_tokens: ["faketoken","secondfaketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_one)).to eq(true)
      expect(records.keys.include?(:model_two)).to eq(false)

      expect(records[:model_one].keys.length).to eq(6)
    end

    it 'updates a specific record' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_two"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST,
        record_names: '123'
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_two)).to eq(true)
      expect(records[:model_two].keys.length).to eq(1)
      expect(records[:model_two].keys.first).to eq("123")

      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_two"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST,
        record_names: '321'
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_two)).to eq(true)
      expect(records[:model_two].keys.length).to eq(1)
      expect(records[:model_two].keys.first).to eq("321")
    end

    it 'updates records even if not in Magma' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_two"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_two)).to eq(true)
      expect(records[:model_two].keys.length).to eq(2)
      expect(records[:model_two].keys).to match_array(["123", "321"])
    end

    it 'updates only records in Magma' do
      redcap_etl = Polyphemus::RedcapEtlScriptRunner.new(
        project_name: 'test',
        model_names: ["model_two"],
        redcap_tokens: ["faketoken"],
        dateshift_salt: '123',
        redcap_host: REDCAP_HOST,
        magma_host: MAGMA_HOST,
        record_names: "existing"
      )

      magma_client = Etna::Clients::Magma.new(host: MAGMA_HOST, token: TEST_TOKEN)

      records = redcap_etl.run(magma_client: magma_client)

      expect(records.keys.include?(:model_two)).to eq(true)
      expect(records[:model_two].keys.length).to eq(1)
      expect(records[:model_two].keys).to eq(["123"])
    end
  end
end
