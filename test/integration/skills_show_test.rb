require 'test_helper'

class SkillsShowTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @player = @user.player
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @skill = @skills[@skills.keys[1]]
  end
  
  test "skill display" do
    
  end
end
