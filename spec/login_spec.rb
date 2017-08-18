describe UserLogController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  it "should log you in" do
      allow_any_instance_of(UserLogController).to receive(:current_user).and_return(user)
    json_post(:login, email: 'polyphemus@mount.etna', password: 'midas-has-donkey-ears')
  end
end
