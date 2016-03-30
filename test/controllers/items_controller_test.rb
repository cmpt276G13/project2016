require 'test_helper'

class ItemsControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse file
    @item = @items[@items.keys[0]]
  end
  
  test "should get index when logged in" do
    log_in_as(@user)
    get :index
    assert_response :success
  end
  
  test "should get show when logged in" do
    log_in_as(@user)
    get :show, name: @items.keys[0]
    assert_response :success
  end
  
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect show when not logged in" do
    get :show, name: @items.keys[0]
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "back button should direct to referrer" do
    log_in_as(@user)
    request.env["HTTP_REFERER"] = items_url
    get :show, name: @items.keys[0]
    assert_select 'a[href=?]', items_url, text: "Back"
  end
end
