require 'test_helper'

class QuestsNewTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end
  
  test "invalid new quest information" do
    log_in_as(@user)
    get new_quest_path
    assert_no_difference 'Quest.count' do
      post quests_path, quest: { name: "",
                                 description: "",
                                 level_req: "", }
    end
    assert_template 'quests/new'
    assert_select 'div#error_explanation'
    assert_select 'div.alert-danger'
  end
  
  test "valid new quest information" do
    log_in_as(@user)
    get new_quest_path
    assert_difference 'Quest.count', 1 do
      post_via_redirect quests_path, quest: { name: "Quest",
                                              description: "Some Description",
                                              level_req: 2 }
    end
    assert_template 'quests/show'
    assert_not flash.empty?
  end
end
