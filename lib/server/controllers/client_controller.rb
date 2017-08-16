# This should only server a single user status page.
class ClientController < Polyphemus::Controller
  def browse
    view :basic_view
  end

  def user_admin
    view :user_admin
  end

  def network_utils
    view :network_utils
  end

  def logged_out
    view :logged_out
  end
end
