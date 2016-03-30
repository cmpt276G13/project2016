require 'test_helper'

class ItemsShowTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
    @item = @items[@items.keys[0]]
  end
  
  test "item display" do
    log_in_as(@admin)
    get item_path(@items.keys[0])
    assert_template 'items/show'
    assert_select 'title', full_title(@items.keys[0])
    assert_select 'h1', @items.keys[0]
    assert_select 'p', @item["description"]
    assert_select 'p', "Price: " + @item["price"].to_s + " G"
    assert_select 'a[href=?]', items_path, text: "Back", count: 1
    assert_select 'input[type=?]', "number"
    assert_select 'input[type=?]', "submit", value: "Buy"
  end
end
