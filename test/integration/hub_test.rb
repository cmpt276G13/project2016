require 'test_helper'

class HubTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse(file)
    @item = @items[@items.keys[0]]
  end
  
  test "hub display" do
    log_in_as(@user)
    amount = 1
    @player.items[@items.keys[0]] = amount # Check singularity
    @player.save
    get hub_path
    assert_template 'static_pages/hub'
    assert_template 'shared/_player_info'
    assert_select 'a[href=?]', item_path(@items.keys[0]), text: amount.to_s + " " + @items.keys[0]
    
    amount = 5
    @player.items[@items.keys[0]] = amount # Check plurality
    @player.save
    get hub_path
    assert_select 'a[href=?]', item_path(@items.keys[0]), text: amount.to_s + " " + @items.keys[0].pluralize
    
    @player.skills.each do |skill|
      assert_select 'a[href=?]', skill_path(skill), text: skill
    end
  end
end
