require 'test_helper'

class SkillsControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @ID = 3
    @skill = @skills[@skills.keys[@ID]]
  end
  
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect show when not logged in" do
    get :show, name: @skills.keys[@ID]
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "back button should direct to referrer" do
    log_in_as(@user)
    request.env["HTTP_REFERER"] = skills_url
    get :show, name: @skills.keys[@ID]
    assert_select 'a[href=?]', skills_url, text: "Back"
  end
  
  test "After buying item, back button should go to items index" do
    log_in_as(@user)
    request.env["HTTP_REFERER"] = skill_url(@skills.keys[@ID])
    get :show, name: @skills.keys[@ID]
    assert_select 'a[href=?]', skills_url, text: "Back"
  end
end
