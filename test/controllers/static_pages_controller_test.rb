require 'test_helper'

class StaticPagesControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
  end
  
  test "should get index" do
    get :index
    assert_response :success
  end
  
  test "should get about" do
    get :about
    assert_response :success
  end
  
  test "should redirect hub when not logged in" do
    get :hub, id: @user
    assert_not flash.empty?
    assert_redirected_to login_url
  end
end
