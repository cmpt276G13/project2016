require 'test_helper'

class QuestsControllerTest < ActionController::TestCase
  def setup
    @admin = users(:michael)
    @non_admin = users(:archer)
    @quest = quests(:one)
  end
  
  test "should redirect index when not logged in" do
    get :index
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect show when not logged in" do
    get :show, id: @quest
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect edit when not logged in" do
    get :edit, id: @quest
    assert_not flash.empty?
    assert_redirected_to login_url
  end
  
  test "should redirect edit when logged in as non-admin" do
    log_in_as(@non_admin)
    get :edit, id: @quest
    assert_redirected_to quests_url
  end
  
  test "should redirect update when not logged in" do
    patch :update, id: @quest, quest: { name: @quest.name, 
                              description: @quest.description, 
                              level_req: @quest.level_req }
    assert_equal "Please log in.", flash[:danger]
    assert_redirected_to login_url
  end
  
  test "should redirect update when logged in as non-admin" do
    log_in_as(@non_admin)
    patch :update, id: @quest, quest: { name: @quest.name, 
                              description: @quest.description, 
                              level_req: @quest.level_req }
    assert flash.empty?
    assert_redirected_to quests_url
  end
  
  test "should redirect destroy when not logged in" do
    assert_no_difference 'Quest.count' do
      delete :destroy, id: @quest
    end
    assert_redirected_to login_url
  end

  test "should redirect destroy when logged in as a non-admin" do
    log_in_as(@non_admin)
    assert_no_difference 'Quest.count' do
      delete :destroy, id: @quest
    end
    assert_redirected_to quests_url
  end
  
  test "should redirect accept when not logged in" do
    assert_no_difference 'QuestAcceptance.count' do
      get :accept, id: @quest
    end
    assert_redirected_to login_url
  end
  
  test "should have back button in edit" do
    log_in_as(@admin)
    request.env["HTTP_REFERER"] = quests_url
    get :edit, id: @quest
    assert_select 'a[href=?]', quests_url, text: "Back"
    
    request.env["HTTP_REFERER"] = edit_quest_url(@quest)
    get :edit, id: @quest
    assert_select 'a[href=?]', edit_quest_url(@quest), text: "Back"
  end
end
