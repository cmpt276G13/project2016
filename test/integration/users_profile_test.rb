require 'test_helper'

class UsersProfileTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end
  
  test "profile display" do
    get user_path(@user)
    assert_template 'users/show'
    assert_select 'title', full_title(@user.username)
    assert_select 'h1', text: @user.username
    assert_select 'h1>img.gravatar'
  end
end
