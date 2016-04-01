require 'test_helper'

class SkillsControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    file = File.read("app/assets/skills/skills.json")
    @skills = JSON.parse file
    @skill = @skills[@skills.keys[3]]
  end
  
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect show when not logged in" do
    get :show, name: @skills.keys[3]
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "back button should direct to referrer" do
    log_in_as(@user)
    request.env["HTTP_REFERER"] = skills_url
    get :show, name: @skills.keys[3]
    assert_select 'a[href=?]', skills_url, text: "Back"
  end
end
