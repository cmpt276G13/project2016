require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
  end
  
  test "should be valid" do
    assert @user.player.valid?
  end

  test "user id should be present" do
    @user.player.user_id = nil
    assert_not @user.player.valid?
  end
  
  test "should be able to accept new but not existing quest" do
    assert @user.player.can_accept?(quests(:two))
    assert_not @user.player.can_accept?(quests(:one))
  end
  
  test "should be able to accept quest with pre requisites" do
    assert @user.player.can_accept?(quests(:two))
  end
  
  test "should not be able to accept quest without pre requisites" do
    assert_not @user.player.can_accept?(quests(:three))
  end
end
