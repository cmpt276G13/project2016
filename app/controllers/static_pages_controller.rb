class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  
  def index
    @users = User.order_by_points.first(10)
  end
  
  def hub
    @user_location = get_user_location
  end
end
