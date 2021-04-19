require_relative '../magma_record_etl'

class Polyphemus::MaterializeGneMagmaRecordsEtl < Polyphemus::MagmaRecordEtl
  def initialize
    super(project_model_pairs: [['mvir1', 'patient']], attribute_names: ['name', 'updated_at'])
  end

  def process(cursor, records)
    record_names = records.map { |r| r.keys.first }
    logger.info("Processing patients #{record_names.join(', ')}...")
    workflow = Etna::Clients::Magma::MaterializeDataWorkflow.new(
        model_attributes_mask: MATERIALIZE_ATTRIBUTES,
        record_names: record_names,
        model_filters: {
            'immunoassay' => 'assay_type~^(?!Olink)',
            'patient' => 'comet_plus=true',
            'sc_rna_seq_pool' => 'biospecimen~.*Whole.*blood.*',
        },
        metis_client: metis_client, magma_client: magma_client, logger: logger,
        project_name: 'mvir1', model_name: 'patient', filesystem: filesystem)

    workflow.materialize_all("/Upload")
    logger.info("Done")
  end

  def filesystem
    @filesystem ||= Etna::Filesystem::Metis.new(metis_client: metis_client,
        project_name: 'mvir1', bucket_name: 'GNE_composite')
  end

  MATERIALIZE_ATTRIBUTES = {
      'patient' => [
          'created_at',
          'updated_at',
          'name',
          'timepoint',
          'status',
          'symptom',
          'history',
          'treatment',
          'testing',
          'impacc_id',
          'comet_id',
          'symptom_date',
          'height',
          'weight',
          'comet_plus',
          'hosp_los',
          'icu_los',
          'sex_at_birth',
          'vent_duration',
          'd2b_id',
          'race',
          'bmi',
          'ethnicity',
          'age',
          'english_proficiency',
          'covid_status',
          'admission_date',
          'hospital_site',
          'admission_level',
          'oxygen_homesupport',
          'discharge_icu',
          'discharge_icu_to',
          'discharg_icu_date',
          'discharge_date',
          'hospitalization_outcome',
          'hospitalization_outcome_other',
          'dead_after_discharge',
          'deceased',
          'date_of_death',
          'age_at_death',
          'cause_of_death',
          'cause_of_death_other',
          'pulmonary_infection',
          'non_pulmonary_infection',
          'date_of_birth',
          'consent',
          "hosp_transfer", "hosp_ed", "hosp_cause_other", "hosp_cause", "discharge_icu_date", "impacc_enrollment", "ta_collection_date", "escalation_date", "standard_collection_date", "nonpulm_pos_culture_source4", "infect_nonpulm_micro_4", "nonpulm_pos_culture_source3", "infect_nonpulm_micro_3", "nonpulm_pos_culture_source2", "infect_nonpulm_micro_2", "nonpulm_pos_culture_source1", "infect_nonpulm_micro", "nonpulm_infection_date", "nonpulm_infection_timing", "pulm_pos_culture_source", "positive_culture", "viral_pneumonia_type", "viral_pneumonia_date", "bacteria_pneumonia_date", "pneumonia_diagnosis_date", "pulm_infection_timing", "discharge_icu4_to", "discharge_icu4_date", "readmit_icu4_date", "readmit3_icu", "discharge_icu3_to", "discharge_icu3_date", "readmit_icu3_date", "readmit2_icu", "discharge_icu2_to", "discharge_icu2_date", "readmit_icu_date", "readmit_icu", "admit_icu_date", "admit_icu", "discharge_status", "oxygen_level", "discharge_o2", "social_admit", "primary_diag", "covid_pos", "ards_aecc", "ards_berlin",
        "admission_lab",
        "comorbidity",
        "symptom",
        "treatment",
      ],
      'sc_rna_seq_pool' => [
          'tenx_web_summary',
          'biospecimen',
          'tube_name',
          'sc_rna_seq',
          'cells_loaded',
          'chemistry',
          'genome',
          'gene_annotation',
          'tenx_metrics_csv',
          'raw_counts_h5',
          'filtered_counts_h5',
          'tenx_cloupe_file',
          'freemuxlet_sample_file',
          'freemuxlet_vcf_file',
      ],
      'history' => [
          'created_at',
          'updated_at',
          'name',
          'present',
      ],
      'status' => [
          'created_at',
          'updated_at',
          'name',
          'value',
      ],
      'symptom' => [
          'created_at',
          'updated_at',
          'name',
          'present',
          'bleeding_site',
          'other_name',
          'symptom_date',
          'symptom_reported_by',
      ],
      'testing' => [
          'created_at',
          'updated_at',
      ],
      'timepoint' => [
          'created_at',
          'updated_at',
          'name',
          'sc_rna_seq',
          'rna_seq',
          'clinical_lab',
          'day',
          'study_day',
          'patient_loc_today',
          'mech_vent_today',
          'immunoassay',
          'map',
          'map_low',
          'map_high',
          'o2therapy',
          'o2current',
          'o2high',
          "who_scale",
          "sofa_score",
        "sofa_urine",
        "sofa_renal",
        "sofa_gcs",
        "sofa_cardio",
        "sofa_liver",
        "sofa_coag",
        "sofa_resp_calc",
        "sofa_resp",
        "rrt_type",
        "rrt",
        "vasopressors_used",
        "ecmo_stop",
        "ecmo_start",
        "ecmo",
        "nippv"
      ],
      'treatment' => [
          'created_at',
          'updated_at',
          'name_hiv',
          'other_meds_study',
          'other_name',
          'other_study',
          'name',
          'dose',
          'start',
          'end',
          'study',
      ],
      'clinical_lab' => [
          'created_at',
          'updated_at',
          'time',
          'unit',
          'value',
          'name',
      ],
      'immunoassay' => [
          'created_at',
          'updated_at',
          'name',
          'assay_type',
          'biospecimen',
          'biospecimen_date',
          'analyte',
      ],
      'rna_seq' => [
          'tube_name',
          'biospecimen',
          'biospecimen_date',
          'gene_expression',
      ],
      'sc_rna_seq' => [
          'tube_name',
          'biospecimen_date',
          'sc_rna_seq_pool',
          'biospecimen',
          'cells_loaded',
          'chemistry',
          'genome',
          'gene_annotation',
          'tenx_metrics_csv',
          'tenx_web_summary',
          'raw_counts_h5',
          'filtered_counts_h5',
          'tenx_cloupe_file',
      ],
      'analyte' => [
          'created_at',
          'updated_at',
          'value',
          'unit',
          'alias',
          'analyte_name',
      ],
  }
end