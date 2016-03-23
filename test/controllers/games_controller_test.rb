require 'test_helper'

class GamesControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    @other_user = users(:archer)
  end
  
  test "should redirect game when not accesed from hub" do
    log_in_as(@user)
    @request.env['HTTP_REFERER'] = root_url
    get :index
    assert_redirected_to hub_path
  end
  
  test "should go to game when accesed from hub" do
    log_in_as(@user)
    @request.env['HTTP_REFERER'] = hub_url
    get :index
    assert :success
    assert_select 'div', id: "Game"
  end
end
