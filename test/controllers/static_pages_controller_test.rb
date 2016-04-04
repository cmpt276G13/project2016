require 'test_helper'

class StaticPagesControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
  end
  
  test "should get index and video" do
    get :index
    assert_response :success
    assert_select "iframe[src=?]", "https://www.youtube.com/embed/RgXeE7yqZ2E"
  end
  
  test "should get about" do
    get :about
    assert_response :success
  end
  
  test "should get hub when logged in" do
    log_in_as(@user)
    get :hub, id: @user
    assert_response :success
  end
  
  test "should redirect hub when not logged in" do
    get :hub, id: @user
    assert_not flash.empty?
    assert_redirected_to login_url
  end
end
