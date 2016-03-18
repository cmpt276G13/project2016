require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
    @player = @user.player
    @quest = quests(:one)
    @quest2 = quests(:two)
    @quest3 = quests(:three)
    @quest_complete = quests(:quest_5)
    @quest6 = quests(:quest_6)
    @quest_new = quests(:quest_20)
  end
  
  test "should be valid" do
    assert @user.player.valid?
  end
  
  test "experience should be a positive integer or 0" do
    @player.experience = 0
    assert @player.valid?
    @player.experience = 4.3
    assert_not @player.valid?
    @player.experience = -1
    assert_not @player.valid?
    @player.experience = "invalid"
    assert_not @player.valid?
  end
  
  test "should update items through adding, and change gold" do
    amount = 5
    price = 10
    assert_difference '@player.reload.items["Small Potion"].to_i', 5 do
      assert_difference '@player.reload.gold', -amount * price do
        assert @player.update_items!({ "Small Potion" => amount }, price: price)
      end
    end
  end
  
  test "should turn in quest" do
    assert_not @player.quest_acceptances.find_by(quest_id: @quest_complete).turned_in?
    @player.turn_in(@quest_complete)
    assert @player.quest_acceptances.find_by(quest_id: @quest_complete).turned_in?
  end
  
  test "should be accepted existing but not new quest" do
    assert @user.player.accepted?(@quest)
    assert_not @user.player.accepted?(@quest2)
  end
  
  test "should be able to accept quest with quest pre requisites" do
    assert @user.player.quest_req_met?(@quest2)
  end
  
  test "should not be able to accept quest without quest pre requisites" do
    assert_not @user.player.quest_req_met?(@quest3)
  end
  
  test "should be turned in" do
    assert @user.player.turned_in?(@quest)
  end
  
  test "should not be turned in" do
    assert_not @user.player.turned_in?(@quest_complete)
  end
  
  test "should be complete" do
    assert @user.player.completed?(@quest_complete)
    assert @user.player.completed?(@quest)
  end
  
  test "should not be complete" do
    assert_not @user.player.completed?(@quest_new)
  end
  
  test "should be able to accept quest or not" do
    assert @user.player.can_accept?(@quest2)
    assert @user.player.can_accept?(@quest6)
    assert_not @user.player.can_accept?(@quest)
  end
  
  test "should level up" do
    @player.update(experience: @player.experience_to_next_level)
    assert_difference "@player.reload.level", 1 do
      @player.level_up
    end
  end
  
  test "should initialize progress" do
    @player.init_progress(@quest_new)
    q_acceptance = @player.quest_acceptances.find_by(quest_id: @quest_new)
    @quest_new.target.each_key do |target|
      assert q_acceptance.progress[target]
    end
  end
end
