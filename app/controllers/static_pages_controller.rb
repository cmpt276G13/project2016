class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  def index
    @users = User.order_by_points.first(10)
  end
  
  def hub
    @user_location = get_user_location
    
    @vancouver_lat = 49.2827
    @vancouver_lng = -123.1207
    
    @paris_lat = 48.8567
    @paris_lng = 2.3508
    
    @tokyo_lat = 35.6833
    @tokyo_lng = 139.6833
    
    @sydney_lat = -33.8650
    @sydney_lng = 151.2094
    
    @cairo_lat = 30.0500
    @cairo_lng = 31.2333
    
    @brasilia_lat = -15.7939
    @brasilia_lng = -47.8828
  end
end
