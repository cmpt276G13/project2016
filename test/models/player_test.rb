require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
    @quest = quests(:one)
    @quest2 = quests(:two)
    @quest3 = quests(:three)
    @quest6 = quests(:quest_2)
  end
  
  test "should be valid" do
    assert @user.player.valid?
  end

  test "user id should be present" do
    @user.player.user_id = nil
    assert_not @user.player.valid?
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
  
  test "should be able to accept quest or not" do
    assert @user.player.can_accept?(@quest2)
    assert @user.player.can_accept?(@quest6)
    assert_not @user.player.can_accept?(@quest)
  end
end
