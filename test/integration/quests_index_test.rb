require 'test_helper'

class QuestsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin     = users(:michael)
    @non_admin = users(:archer)
    @quest = quests(:one)
    @quest2 = quests(:two)
    @quest3 = quests(:three)
  end
  
  test "index as admin" do
    log_in_as(@admin)
    get quests_path
    assert_template 'quests/index'
    assert_select 'a[href=?]', new_quest_path, text: "Create New Quest"
    assert_select 'div.pagination'
    accepted_quests = @admin.player.quest_acceptances.count
    assert_select 'td', "Accepted", count: accepted_quests
    first_page_of_quests = Quest.paginate(page: 1)
    first_page_of_quests.each do |quest|
      assert_select 'a[href=?]', quest_path(quest), text: quest.name
      assert_select 'a[href=?]', edit_quest_path(quest), text: 'edit'
      assert_select 'a[href=?]', quest_path(quest), text: 'delete'
      unless quest == @quest || @quest2
        assert_select 'a[href=?]', quests_accept_path(quest), text: 'Accept'
      end
    end
  end
  
  test "previously accepted quest should not be accepted" do
    log_in_as(@admin)
    assert_no_difference "QuestAcceptance.count" do
      get quests_accept_path(@quest)
    end
  end
  
  test "should accept new quest" do
    log_in_as(@admin) 
    assert_difference "QuestAcceptance.count", 1 do
      get quests_accept_path(@quest3)
    end
    assert_template 'quests/index'
  end
  
  test 'index as non-admin' do
    log_in_as(@non_admin)
    get quests_path
    assert_select 'a[href=?]', new_quest_path, text: "Create New Quest", count: 0
    assert_select 'a', text: 'delete', count: 0
  end
end
