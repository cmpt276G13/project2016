require 'test_helper'

class ItemsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    file = File.read("app/assets/items/items.json")
    all_items = JSON.parse file
    @items = Hash.new
    all_items.each do |key, value|
      if value["price"]
        @items[key] = value
      end
    end
  end
  
  test "index" do
    log_in_as(@admin)
    get items_path
    assert_select 'h1', "Item Shop"
    assert_select 'p', "Gold: " + @admin.player.gold.to_s
    assert_template 'items/index'
    assert_select 'a[href=?]', skills_path, { text: "Skills"}, "No link to skills"
    assert_select 'a[href=?]', items_path, { text: "Items"}, "No link to items"
    assert_select 'input[type=?]', "submit", count: @items.count
    assert_select 'input[type=?]', "number", count: @items.count
    @items.each do |name, array|
      assert_select 'a[href=?]', item_path(name), text: name
      assert_select 'td', "Price: " + array["price"].to_s + " G"
      assert_select 'input[type=?]', "hidden", value: array["price"]
    end
  end
end
