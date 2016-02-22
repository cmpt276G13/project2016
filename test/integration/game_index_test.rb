require 'test_helper'

class GameIndexTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @other_user = users(:archer)
  end
  
  test "should redirect game when not accesed from hub" do
    log_in_as(@user)
    get root_path
    get game_path
    assert_redirected_to hub_path
  end
  
  # Test is not working right now.
  # test "should go to game when accesed from hub" do
  #   log_in_as(@user)
  #   request.env['HTTP_REFERER'] = hub_url
  #   get game_path
  #   assert_redirected_to game_path
  # end
end
