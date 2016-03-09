require 'test_helper'

class QuestTest < ActiveSupport::TestCase
  def setup
    @quest = Quest.new(
        name: "Example Quest",
        description: "Example Description",
        level_req: 1,
      )
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
end
