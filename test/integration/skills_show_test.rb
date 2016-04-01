require 'test_helper'

class SkillsShowTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @ID = 3
    @skill = @skills[@skills.keys[@ID]]
  end
  
  test "skill display" do
    log_in_as(@user)
    get skill_path(@skills.keys[@ID])
    assert_template 'skills/show'
    assert_select 'a[href=?]', skills_path, { text: "Skills"}, "No link to skills"
    assert_select 'a[href=?]', items_path, { text: "Items"}, "No link to items"
    assert_select 'title', full_title(@skills.keys[@ID])
    assert_select 'h1', @skills.keys[@ID]
    assert_select 'p', @skill["description"]
    assert_select 'p', "Price: " + @skill["price"].to_s + " G"
    assert_select 'input[type=?]', "hidden", value: @skill["price"]
    assert_select 'input[type=?]', "hidden", value: @skill.keys[@ID]
    assert_select 'input[type=?]', "submit", value: "Buy"
  end
end
