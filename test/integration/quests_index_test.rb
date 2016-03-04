require 'test_helper'

class QuestsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @admin     = users(:michael)
    @non_admin = users(:archer)
  end
  
  test "index" do
    log_in_as(@admin)
    get quests_path
    assert_select 'div.pagination'
    first_page_of_quests = Quest.paginate(page: 1)
    first_page_of_quests.each do |quest|
      assert_select 'a[href=?]', quest_path(quest), text: quest.name
      # assert_select 'a[href=?]', , text: 'Accept'
      assert_select 'a[href=?]', quest_path(quest), text: 'delete'
    end
  end
end
