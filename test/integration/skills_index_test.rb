require 'test_helper'

class SkillsIndexTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/skills/skills.json")
    all_skills = JSON.parse file
    @skills = Hash.new
    all_skills.each do |key, value|
      if value["price"] && @player.skills.exclude?(key)
        @skills[key] = value
      end
    end
  end
  
  test "skills display" do
    log_in_as(@user)
    get skills_path
    assert_template 'skills/index'
    assert_select 'a[href=?]', skills_path, { text: "Skills"}, "No link to skills"
    assert_select 'a[href=?]', items_path, { text: "Items"}, "No link to items"
    assert_select 'h1', "Skills Shop"
    assert_select 'p', "Gold: " + @player.gold.to_s
    assert_select 'input[type=?]', "submit", count: @skills.count
    @skills.each do |name, array|
      assert_select 'a[href=?]', skill_path(name), text: name
      assert_select 'td', array["manaCost"].to_s + " MP"
      assert_select 'input[type=?]', 'hidden', value: array["price"]
      assert_select 'input[type=?]', 'hidden', value: name
      assert_select 'input[type=?]', 'submit', value: "Buy"
    end
  end
end
