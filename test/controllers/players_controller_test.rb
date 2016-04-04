require 'test_helper'

class PlayersControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    @player = @user.player
    @broke_user = users(:archer)
    @broke_player = @broke_user.player
    @rich_user = users(:lana)
    @rich_player = @rich_user.player
    file = File.read("app/assets/items/items.json")
    @items = JSON.parse file
    @item = @items[@items.keys[0]]
    @quest_complete = quests(:quest_5)
    request.env["HTTP_REFERER"] = items_url
    
    @SKILLID = 3
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @skill = @skills[@skills.keys[@SKILLID]]
  end
  
  test "should redirect update when not logged in" do
    patch :update, { player: { items: { @items.keys[0] => 1 } }, price: @item["price"], id: @user }
    assert_equal 'Please log in.', flash[:danger]
    assert_redirected_to login_url
  end
  
  test "should buy item" do
    log_in_as(@user)
    assert_difference '@player.reload.gold', -30 do
      patch :update, { player: { items: { @items.keys[0] => 3 } }, price: @item["price"], id: @user }
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
      patch :update , { player: { items: { @items.keys[0] => 1 }, quest: @quest_complete, experience: 1 }, commit: "Turn in", id: @user }
    end
    assert @player.accepted?(@quest_complete).turned_in?
    assert_redirected_to quests_url
  end
  
  test "should buy skills" do
    log_in_as(@rich_user)
    request.env["HTTP_REFERER"] = skills_url
    assert_not @rich_player.skills.include? @skills.keys[@SKILLID]
    assert_difference "@rich_player.reload.gold", -@skill[:price].to_i do
      patch :update, { player: { skills: @skills.keys[@SKILLID] }, price: @skill[:price], id: @rich_user }
    end
    assert @rich_player.reload.skills.include? @skills.keys[@SKILLID]
    assert_equal 'Purchase Successful', flash[:success]
    assert_redirected_to skills_url
  end
  
  test "should not buy skills when poor" do
    log_in_as(@broke_user)
    request.env["HTTP_REFERER"] = skills_url
    assert_no_difference "@broke_player.reload.gold" do
      patch :update, { player: { skills: @skills.keys[@SKILLID] }, price: @skill[:price], id: @broke_user }
    end
    assert_not flash.empty?
    assert_equal @broke_player.skills, @broke_player.reload.skills
    assert_redirected_to skills_url
  end
end
