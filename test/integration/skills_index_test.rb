require 'test_helper'

class SkillsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @skill = @skills[@skills.keys[1]]
  end
  
  test "skills display" do
    log_in_as(@user)
    get skills_path
    assert_template 'skills/index'
    assert_select 'a[href=?]', skills_path, { text: "Skills"}, "No link to skills"
    assert_select 'a[href=?]', items_path, { text: "Items"}, "No link to items"
    assert_select 'h1', "Skills Shop"
    assert_select 'p', "Gold: " + @player.gold.to_s
  end
end
