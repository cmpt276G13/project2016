require 'test_helper'

class ItemsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
  end
  
  test "index" do
    log_in_as(@admin)
    get items_path
    assert_template 'items/index'
    @items.each do |name, array|
      assert_select 'a[href=?]', item_path(name), text: name
    end
  end
end
