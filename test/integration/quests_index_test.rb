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
    assert_select 'div.pagination'
    accepted_quests = @admin.player.quest_acceptances.count
    assert_select 'td', "Accepted", count: accepted_quests
    first_page_of_quests = Quest.paginate(page: 1)
    first_page_of_quests.each do |quest|
      assert_select 'a[href=?]', quest_path(quest), text: quest.name
      assert_select 'a[href=?]', quest_path(quest), text: 'delete'
      unless quest == @quest || @quest2
        assert_select 'a[href=?]', quests_accept_path(quest), text: 'Accept'
      end
    end
    # Previously accepted quest should not be accepted.
    assert_no_difference "QuestAcceptance.count" do
      get quests_accept_path(@quest)
    end
    # Should accept new quest
    assert_difference "QuestAcceptance.count", 1 do
      get quests_accept_path(@quest3)
    end
    assert_redirected_to quests_path
    follow_redirect!
    assert_template 'quests/index'
  end
end
