require 'test_helper'

class ItemsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    @broke_user = users(:archer)
    @broke_player = @admin.player
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
    @item = @items["Small Potion"]
  end
  
  test "index" do
    log_in_as(@admin)
    get items_path
    assert_select 'p', "Gold: " + @admin.player.gold.to_s
    assert_template 'items/index'
    @items.each do |name, array|
      assert_select 'a[href=?]', item_path(name), text: name
      assert_select 'td', "Price: " + array["price"].to_s + " G"
    end
  end
  
  test "should not buy item when not enough gold" do
    log_in_as(@broke_user)
    assert_no_difference '@broke_player.reload.gold' do
      patch player_path(@broke_player), { player: { items: 1 }, item_name: @items.keys[0], gold: @item["price"], id: @broke_user }
    end
    assert_select 'div#error_explanation'
    assert_select 'div.alert-danger'
    assert_template 'items/index'
  end
end
