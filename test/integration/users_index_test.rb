require 'test_helper'

class UsersIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin     = users(:michael)
    @non_admin = users(:archer)
    @first_rank = users(:lana)
    @second_rank = users(:malory)
  end
  
  test "index including pagination and delete links and rankings" do
    get users_path # Test if non-logged in user can access rankings
    assert_template 'users/index'
    log_in_as(@admin)
    get users_path
    assert_select 'div.pagination'
    first_page_of_users = User.paginate(page: 1)
    all = User.all
    assert_equal all.index(@first_rank), 0 # first position
    assert_equal all.index(@second_rank), 1 # second position
    first_page_of_users.each do |user|
      assert_select 'a[href=?]', user_path(user), text: user.username
      assert_select 'td', "Points: " + (user.player.level - user.player.deaths).to_s , count: User.count('id')
      unless user == @admin
        assert_select 'a[href=?]', user_path(user), text: 'delete'
      end
    end
    assert_difference 'User.count', -1 do
      delete user_path(@non_admin)
    end
  end
  
  test "index as non-admin" do
    log_in_as(@non_admin)
    get users_path
    assert_select 'a', text: 'delete', count: 0
  end
end
