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
  
  # Test is not testing the right thing.
  # test "should go to game when accesed from hub" do
  #   log_in_as(@user)
  #   get hub_path
  #   get game_path
  #   assert_template 'games/index'
  # end
end
