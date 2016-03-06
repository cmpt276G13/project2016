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
  
  test "should be able to or not accept quest" do
    assert @user.player.can_accept?(quests(:three))
    assert_not @user.player.can_accept?(quests(:one))
  end
end
