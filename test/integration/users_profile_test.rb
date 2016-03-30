require 'test_helper'

class UsersProfileTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
  end
  
  test "profile display" do
    get user_path(@user)
    assert_template 'users/show'
    assert_select 'title', full_title(@user.username)
    assert_select 'h1', text: @user.username
    assert_select 'h1>img.gravatar'
    assert_select 'td', text: "Health: " + @player.health.to_s + "/" + @player.max_health.to_s
    assert_select 'td', text: "Gold: " + @player.gold.to_s
  end
end
