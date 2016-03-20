require 'test_helper'

class QuestTest < ActiveSupport::TestCase
  def setup
    @quest = Quest.new(
        name: "Example Quest",
        description: "Example Description",
        level_req: 1,
      )
    @q_kill = quests(:two)
    @q_gather = quests(:gather)
    @player = players(:michael)
  end
  
  test "should be valid" do
    assert @quest.valid?
  end
  
  test "name should be present" do
    @quest.name = "   "
    assert_not @quest.valid?
  end
  
  test "description should be present" do
    @quest.description = "   "
    assert_not @quest.valid?
  end
  
  test "level_req should be present" do
    @quest.level_req = "  "
    assert_not @quest.valid?
  end
  
  test "name should not be too long" do
    @quest.name = "a" * 51
    assert_not @quest.valid?
  end
  
  test "target should be present in SIT" do
    @q_kill.target = {}
    @q_gather.target = {}
    assert_not @q_kill.valid?
    assert_not @q_gather.valid?
  end
  
  test "rewards should be present in SIT" do
    @q_kill.rewards = {}
    @q_gather.rewards = {}
    assert_not @q_kill.valid?
    assert_not @q_gather.valid?
  end
  
  test "gather quest should take away target items" do
    
  end
end
