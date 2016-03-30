require 'test_helper'

class SkillsControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @skill = @skills[@skills.keys[1]]
  end
  
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect show when not logged in" do
    get :show, name: @skills.keys[1]
    assert_not flash.empty?
    assert_redirected_to login_url
  end
end
