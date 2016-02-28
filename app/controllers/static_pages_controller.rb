class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  
  def index
<<<<<<< HEAD
    
=======
    @users = User.order_by_points.first(10)
>>>>>>> 9b2c87a9a450509f378d0626d19aeff90405107f
  end
  
  def hub
    @user_location = get_user_location
  end
end
