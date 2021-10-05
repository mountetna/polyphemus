# For now, this class is instantiated within ruby and managed in a static way.
# In the future, this object could be constructed by the executor based on project
# configuration, or pulled from several sources, or like whatever.  Doesn't matter.
# Point is, this is a good place for us to start modeling what project configuration
# looks like.
class Polyphemus::ProjectWatchFoldersConfig
  attr_reader :project_name

  def initialize(project_name:)
    @project_name = project_name
    @buckets = {}
    @file_processors = {}
    @folder_processors = {}
  end

  def bucket(bucket_name)
    @buckets[bucket_name] ||= Polyphemus::BucketWatchFoldersConfig.new(bucket_name: bucket_name, project_name: project_name)
  end

  def buckets
    @buckets.keys
  end

  def bucket_configs
    @buckets.values
  end

  # file_processors are objects receiving process(cursor, files)
  # In combination with ProjectWatchFilesEtl and ProjectWatchFoldersEtl,
  # this defines processes that handle files both as they are 'joined' to
  # a subject watch folder when a folder event occurs, but also processes
  # as the individual files change while still attached to a subject watch
  # folder.  Note that this processing currently does not provide 'undoing',
  # or following delete deltas.
  def process_watch_type_with(watch_type_config, *file_processors)
    (@file_processors[watch_type_config.truple] ||= []).push(*file_processors)
    watch_type_config
  end


  # folder_processors are objects receiving process(cursor, folders)
  # Unlike the above file processors, these only run from the watch folder etl
  # and only work on a filtered view of the folders.  These are executed only
  # when a new watch folder match is found, and not necessarily when an existing
  # watch folder is updated.
  def process_folders_with(watch_type_config, *folder_processors)
    (@folder_processors[watch_type_config.truple] ||= []).push(*folder_processors)
    watch_type_config
  end

  def file_processors(bucket_name, watch_type)
    watch_type = bucket(bucket_name).watcher(watch_type)
    @file_processors[watch_type.truple] ||= []
  end

  def folder_processors(bucket_name, watch_type)
    watch_type = bucket(bucket_name).watcher(watch_type)
    @folder_processors[watch_type.truple] ||= []
  end
end

class Polyphemus::BucketWatchFoldersConfig
  attr_reader :bucket_name, :project_name

  def initialize(bucket_name:, project_name:)
    @bucket_name = bucket_name
    @project_name = project_name
    @watches = {}
  end

  def cursor_pair
    [project_name, bucket_name]
  end

  def watcher(watch_type)
    @watches[watch_type] ||= Polyphemus::WatchTypeConfig.new(
      watch_type: watch_type,
      bucket_name: bucket_name,
      project_name: project_name
    )
  end

  def all_watch_types
    @watches.values.map(&:watch_type)
  end

  def find_matching_watches(path)
    @watches.values.select do |config|
      path =~ config.sum_watch_regex
    end
  end

  def sum_bucket_regex
    Regexp.union(@watches.values.map(&:sum_watch_regex))
  end
end

class Polyphemus::WatchTypeConfig
  attr_reader :watch_type, :project_name, :bucket_name, :regexes

  def initialize(project_name:, bucket_name:, watch_type:)
    @watch_type = watch_type
    @project_name = project_name
    @bucket_name = bucket_name
    @regexes = []
  end

  def truple
    [project_name, bucket_name, watch_type]
  end

  def watch(regex)
    @regexes << regex unless @regexes.include?(regex)
    # Reset so the next sum call recalculates
    @sum_watch_regex = nil
    self
  end

  def sum_watch_regex
    @sum_watch_regex ||= Regexp.union(regexes)
  end
end