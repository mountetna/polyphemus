describe Polyphemus::CascadeMvirPatientWaiverToRestricted do
  let(:command) { Polyphemus.instance.commands[:cascade_mvir_patient_waiver_to_restricted] }

  context 'for restricting patients and pools' do
    let(:patients_to_restrict) {
      {
        'Sally': { name: 'Sally', restricted: false, consent: 'Full Study' },
        'Dan': { name: 'Dan', restricted: false, consent: 'Initial Waiver' },
        'Mike': { name: 'Mike', restricted: false, consent: 'No Samples/Data' }
      }
    }

    before(:each) do
      @all_updates = []

      WebMock.disable_net_connect!
      stub_magma_setup(patients_to_restrict)
      stub_magma_linked_pools('Sally', [])
      stub_magma_linked_pools('Dan', ['pool-a'])
      stub_magma_linked_pools('Mike', ['pool-d'])
      stub_magma_pool_state('pool-a', [false])
      stub_magma_pool_state('pool-d', [true])
      stub_metis_setup
    end

    after(:each) do
      WebMock.enable_net_connect!
    end


    it 'updates the restricted states correctly for pools and the patients' do
      stub_parent_exists({status: 422, bucket: RESTRICT_BUCKET})
      stub_create_folder({bucket: RESTRICT_BUCKET})
      stub_rename_folder({bucket: RELEASE_BUCKET})

      command.execute

      expect(@all_updates.inject({}) do |acc, n|
        n.keys.each do |k|
          (acc[k] ||= {}).update(n[k])
        end
        acc
      end).to eq({
        "cytof_pool" => {
          "pool-a" => {"restricted" => "true"},
          "pool-b" => {"restricted" => "false"}
        },
        "patient" => {
            "Mike" => {"restricted" => "true"},
            "Dan" => {"restricted" => "true"}
        }
      })
    end

    it 'correctly makes Metis calls to restrict patient and pool folders' do
      stub_parent_exists({status: 422, bucket: RESTRICT_BUCKET})
      stub_create_folder({bucket: RESTRICT_BUCKET})
      stub_rename_folder({bucket: RELEASE_BUCKET})

      command.execute

      # There are two folders in assay/processed and two in assay/raw for each patient, in the fixtures
      # This should ignore the "summary" sub-folder that is under a patient
      # There is one folder in assay/processed and one in assay/raw for each pool, in the fixtures
      # This should ignore the "summary" sub-folder that is under the pool
      expect(WebMock).to have_requested(:post, /#{METIS_HOST}\/#{PROJECT}\/folder\/create\/#{RESTRICT_BUCKET}/).times(10)
      expect(WebMock).to have_requested(:post, /#{METIS_HOST}\/#{PROJECT}\/folder\/rename\/#{RELEASE_BUCKET}/).times(10)
    end
  end

  context 'when releasing patients and pools' do
    let(:patients_to_release) {
      {
        'Danielle': { name: 'Danielle', restricted: true, consent: 'Full Study' },
        'Dan': { name: 'Dan', restricted: false, consent: 'Full Study' }
      }
    }

    before(:each) do
      @all_updates = []

      WebMock.disable_net_connect!

      stub_magma_setup(patients_to_release)
      stub_magma_linked_pools('Dan', ['pool-c'])
      stub_magma_linked_pools('Danielle', ['pool-b'])
      stub_magma_pool_state('pool-b', [true])
      stub_magma_pool_state('pool-c', [false])
      stub_metis_setup
    end

    it 'updates the restricted states correctly for pools and the patients' do
      stub_parent_exists({status: 422, bucket: RELEASE_BUCKET})
      stub_create_folder({bucket: RELEASE_BUCKET})
      stub_rename_folder({bucket: RESTRICT_BUCKET})

      command.execute

      expect(@all_updates.inject({}) do |acc, n|
        n.keys.each do |k|
          (acc[k] ||= {}).update(n[k])
        end
        acc
      end).to eq({
        "cytof_pool" => {
          "pool-b" => {"restricted" => "false"},
          "pool-c" => {"restricted" => "false"},
        },
        "patient" => {
            "Danielle" => {"restricted" => "false"}
        }
      })
    end

    it 'correctly makes Metis calls to release patient and pool folders' do
      stub_parent_exists({status: 422, bucket: RELEASE_BUCKET})
      stub_create_folder({bucket: RELEASE_BUCKET})
      stub_rename_folder({bucket: RESTRICT_BUCKET})

      command.execute

      # There are two folders in assay/processed and two in assay/raw for each patient, in the fixtures
      # This should ignore the "summary" sub-folder that is under a patient
      # There is one folder in assay/processed and one in assay/raw for each pool, in the fixtures
      # This should ignore the "summary" sub-folder that is under the pool
      expect(WebMock).to have_requested(:post, /#{METIS_HOST}\/#{PROJECT}\/folder\/create\/#{RELEASE_BUCKET}/).times(6)
      expect(WebMock).to have_requested(:post, /#{METIS_HOST}\/#{PROJECT}\/folder\/rename\/#{RESTRICT_BUCKET}/).times(6)

    end
  end
end
