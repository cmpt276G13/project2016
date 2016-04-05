require 'test_helper'

class QuestsShowTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:michael)
    @non_admin = users(:archer)
    @quest = quests(:one)
    @quest2 = quests(:two)
    @quest_complete = quests(:quest_5)
    @quest20 = quests(:quest_20)
  end
  
  test "quest display accepted and as admin" do
    log_in_as(@admin)
    get quest_path(@quest20)
    assert_template 'quests/show'
    assert_select 'title', full_title(@quest20.name)
    assert_select 'h1', text: @quest20.name
    assert_select 'td', 'Accepted', count: 1
    assert_select 'a[href=?]', quests_path, text: "Back", count: 1
    assert_select 'a[href=?]', edit_quest_path(@quest20), text: 'Edit'
    assert_select 'a[href=?]', quest_path(@quest20), text: 'Delete'
  end
  
  test "quest display completed" do
    log_in_as(@admin)
    get quest_path(@quest_complete)
    assert_select 'input[type=?]', "submit", value: "Turn in", count: 1
  end
  
  test "quest display not accepted and not as admin" do
    log_in_as(@non_admin)
    get quest_path(@quest2)
    assert_template 'quests/show'
    assert_select 'title', full_title(@quest2.name)
    assert_select 'h1', text: @quest2.name
    @quest.rewards[:items].each do |key, value|
      assert_select 'p', value.to_s + " " + key.to_s
    end
    @quest.rewards[:stats].each do |key, value|
      assert_select 'p', value.to_s + " " + key.to_s
    end
    assert_select 'a[href=?]', edit_quest_path(@quest2), text: 'Edit', count: 0
    assert_select 'a[href=?]', quest_path(@quest2), text: 'Delete', count: 0
    assert_select 'a[href=?]', quests_accept_path(@quest2), text: 'Accept'
    assert_select 'a[href=?]', quests_path, text: "Back", count: 1
    # Could change decline to actually do something
    assert_select 'a[href=?]', quests_path, text:"Decline", count: 1
  end
end
