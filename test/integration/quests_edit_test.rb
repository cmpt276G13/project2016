require 'test_helper'

class QuestsEditTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @quest = quests(:one)
  end
  
  test "unsuccessful edit" do
    log_in_as(@user)
    get edit_quest_path(@quest)
    assert_template 'quests/edit'
    patch quest_path(@quest), quest: { name: "",
                                       description: "",
                                       level_req: "" }
    assert_template 'quests/edit'
    assert_select 'div#error_explanation'
    assert_select 'div.alert-danger'
  end
  
  test "successful edit with friendly forwarding" do
    get edit_quest_path(@quest)
    log_in_as(@user)
    assert_redirected_to edit_quest_path(@quest)
    name = "Example Quest"
    description = "Fetch quest\n Do stuff with backstory."
    level_req = 1
    patch quest_path(@quest), quest: { name: name,
                                       description: description,
                                       level_req: level_req }
    assert_not flash.empty?
    assert_redirected_to @quest
    @quest.reload
    assert_equal name, @quest.name
    assert_equal description, @quest.description
    assert_equal level_req, @quest.level_req
  end
end
