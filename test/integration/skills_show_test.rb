require 'test_helper'
include ActionView::Helpers::NumberHelper

class SkillsShowTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @SKILL = "Fire Slash"
    @skill = @skills[@SKILL]
  end
  
  test "unbought skill display" do
    log_in_as(@user)
    get skill_path(@SKILL)
    assert_template 'skills/show'
    assert_select 'a[href=?]', skills_path, { text: "Skills"}, "No link to skills"
    assert_select 'a[href=?]', items_path, { text: "Items"}, "No link to items"
    assert_select 'title', full_title(@SKILL)
    assert_select 'h1', @SKILL
    assert_select 'p', @skill["description"].split("\n\n")[0]
    assert_select 'p', @skill["description"].split("\n\n")[1]
    assert_select 'p', "Price: " + number_with_delimiter(@skill["price"]) + " G"
    assert_select 'p', "Cost: " + number_with_delimiter(@skill["manaCost"]) + " MP"
    assert_select 'input[type=?]', "hidden", value: @skill["price"]
    assert_select 'input[type=?]', "hidden", value: @SKILL
    assert_select 'input[type=?]', "submit", value: "Buy"
  end
  
  test "bought skill display" do
    log_in_as(@user)
    get skill_path(@player.skills[0])
    assert_template 'skills/show'
    assert_select 'input', count: 0
    assert_select 'input[type=?]', "hidden", false
    assert_select 'input[type=?]', "submit", false
  end
end
