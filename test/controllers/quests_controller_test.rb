require 'test_helper'

class QuestsControllerTest < ActionController::TestCase
  def setup
    @user = users(:michael)
    @other_user = users(:archer)
  end
end
