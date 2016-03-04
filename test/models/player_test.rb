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
  
  test "quest should be accepted" do
    assert_difference 'QuestAcceptance.count', 1 do
      @user.player.accept(quests(:one))
    end
  end
end
