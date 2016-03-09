require 'test_helper'

class ItemsControllerTest < ActionController::TestCase
  def setup
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse file
    @item = JSON.parse(file)["Small Potion"]
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
end
