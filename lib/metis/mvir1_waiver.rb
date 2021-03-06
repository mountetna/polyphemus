require 'etna'
require_relative '../commands'

class Mvir1Waiver
  include WithEtnaClients
  include WithLogger

  def initialize(metis_client:, project_name: 'mvir1')
    @metis_client = metis_client
    @project_name = project_name.to_s
    @release_bucket_name = bucket_name(:release_bucket)
    @restrict_bucket_name = bucket_name(:restrict_bucket)
    @release_folders = @metis_client.folders(
      project_name: @project_name, bucket_name: @release_bucket_name)
    @restrict_folders = @metis_client.folders(
      project_name: @project_name, bucket_name: @restrict_bucket_name)
  end

  def patient_name_regex(patient_name)
    # This expects a Patient name like MVIR1-HS10,
    #   not an assay name, like MVIR1-HS10-D4BLD1-CYM2
    /.*\/#{patient_name}-[\w-]+$/
  end

  def pool_regex(pool_name)
    # Slightly different regex for pools because we should be able
    #   to get the whole pool_name instead of a patient_name
    #   that we can't match to folder names.
    /.*\/#{pool_name}$/
  end

  def restrict_patient_data(patient_name)
    @metis_client.rename_folders_by_regex(
      project_name: @project_name,
      source_bucket: @release_bucket_name,
      source_folders: @release_folders,
      dest_bucket: @restrict_bucket_name,
      regex: patient_name_regex(patient_name))
  end

  def release_patient_data(patient_name)
    @metis_client.rename_folders_by_regex(
      project_name: @project_name,
      source_bucket: @restrict_bucket_name,
      source_folders: @restrict_folders,
      dest_bucket: @release_bucket_name,
      regex: patient_name_regex(patient_name))
  end

  def restrict_pool_data(pool_name)
    @metis_client.rename_folders_by_regex(
      project_name: @project_name,
      source_bucket: @release_bucket_name,
      source_folders: @release_folders,
      dest_bucket: @restrict_bucket_name,
      regex: pool_regex(pool_name))
  end

  def release_pool_data(pool_name)
    @metis_client.rename_folders_by_regex(
      project_name: @project_name,
      source_bucket: @restrict_bucket_name,
      source_folders: @restrict_folders,
      dest_bucket: @release_bucket_name,
      regex: pool_regex(pool_name))
  end

  private

  def bucket_name(bucket_name)
    Polyphemus.instance.config(:metis)[bucket_name]
  end
end