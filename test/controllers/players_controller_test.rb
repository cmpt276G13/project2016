require 'test_helper'

class PlayersControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    @player = @user.player
    @broke_user = users(:archer)
    @broke_player = @broke_user.player
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse file
    @item = JSON.parse(file)["Small Potion"]
    @quest_complete = quests(:quest_5)
    request.env["HTTP_REFERER"] = items_url
  end
  
  test "should redirect update when not logged in" do
    patch :update, { player: { items: { @items.keys[0] => 1 } }, price: @item["price"], id: @user }
    assert_equal 'Please log in.', flash[:danger]
    assert_redirected_to login_url
  end
  
  test "should buy item" do
    log_in_as(@user)
    assert_difference '@player.reload.gold', -10 do
      patch :update, { player: { items: { @items.keys[0] => 1 } }, price: @item["price"], id: @user }
    end
    assert_equal 'Purchase Successful', flash[:success]
    assert_redirected_to items_url
  end
  
  test "should not buy item when not enough gold" do
    log_in_as(@broke_user)
    assert_no_difference '@broke_player.reload.gold' do
      patch :update, { player: { items: { @items.keys[0] => 1 } }, price: @item["price"], id: @broke_user }
    end
    assert_equal 'Not enough gold.', flash[:danger]
    assert_redirected_to items_url
  end
  
  test "should add items" do
    log_in_as(@user)
    assert_difference '@player.reload.items[@items.keys[0]].to_i', 1 do
      patch :update, { player: { items: { @items.keys[0] => 1 } }, id: @user }
    end
    assert_equal 'Purchase Successful', flash[:success]
    assert_redirected_to items_url
  end
  
  test "should patch completed quest" do
    log_in_as(@user)
    request.env["HTTP_REFERER"] = quests_url
    assert_difference "@player.reload.experience", 1 do
      patch :update , { player: { items: { "Small Potion" => 1 }, quest: @quest_complete, experience: 1 }, commit: "Turn in", id: @user }
    end
    assert @player.accepted?(@quest_complete).reload.turned_in?
    assert_redirected_to quests_url
  end
end
