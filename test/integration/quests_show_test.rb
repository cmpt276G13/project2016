require 'test_helper'

class QuestsShowTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    @non_admin = users(:archer)
    @quest = quests(:one)
    @quest2 = quests(:two)
  end
  
  test "quest display accepted and as admin" do
    log_in_as(@admin)
    get quest_path(@quest)
    assert_template 'quests/show'
    assert_select 'title', full_title(@quest.name)
    assert_select 'h1', text: @quest.name
    assert_select 'td', 'Accepted', count: 1
    assert_select 'a[href=?]', quests_path, text: "Back", count: 1
  end
  
  test "quest display not accepted and not as admin" do
    log_in_as(@non_admin)
    get quest_path(@quest2)
    assert_template 'quests/show'
    assert_select 'title', full_title(@quest2.name)
    assert_select 'h1', text: @quest2.name
    assert_select 'a[href=?]', quests_accept_path(@quest2), text: 'Accept'
    assert_select 'a[href=?]', quests_path, text: "Back", count: 1
    # Could change decline to actually do something
    assert_select 'a[href=?]', quests_path, text:"Decline", count: 1
  end
end
