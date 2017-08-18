class UserAdminController < Polyphemus::Controller
  def run()
    # Check for the correct parameters.
    check_param(:token)

    # Check that the user is an admin (only admins allowed to use this class)
    check_admin

    # The data being sent back to the client should already be in a JSON format.
    return send(@action)
  end

  def users
    janus_request('get-users')
  end

  def projects
    janus_request('get-projects')
  end

  def permissions
    janus_request('get-permissions')
  end

  def upload_permissions
    check_param(:permissions)
    janus_request('upload-permissions', permissions: @params[:permissions])
  end

  def remove_permissions
    check_param(:permissions)
    janus_request('remove-permissions', permissions: @params[:permissions])
  end

  def logout_all
    janus_request('logout-all')
  end
end
