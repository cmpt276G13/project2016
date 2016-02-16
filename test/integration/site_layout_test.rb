require 'test_helper'

class SiteLayoutTest < ActionDispatch::IntegrationTest
  
  test "layout links" do
    get root_path
    assert_template 'static_pages/index'
    assert_select "a[href=?]", root_path
    assert_select "a[href=?]", about_path
    get about_path
    assert_template 'static_pages/about'
    assert_select "title", full_title("About")
    get signup_path
    assert_template 'users/new'
    assert_select "title", full_title("Sign up")
  end
end
