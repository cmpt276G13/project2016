require 'test_helper'

class PlayerTest < ActiveSupport::TestCase
  def setup
    @user = users(:michael)
    # This code is not idiomatically correct.
    @player = @user.build_player
  end
  
  test "should be valid" do
    assert @player.valid?
  end

  test "user id should be present" do
    @player.user_id = nil
    assert_not @player.valid?
  end
end
