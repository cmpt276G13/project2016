require 'test_helper'

class ItemsShowTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
  end
  
  test "item display" do
    log_in_as(@admin)
    get item_path(@items.keys[0])
    assert_template 'items/show'
    assert_select 'title', full_title(@items.keys[0])
    assert_select 'h1', @items.keys[0]
    assert_select 'a[href=?]', items_path, text: "Back", count: 1
  end
end
