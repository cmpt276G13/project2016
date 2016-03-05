class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  def index
    @users = User.order_by_points.first(10)
  end
  
  def hub
    @user_location = get_user_location
    
    @vancouver = {:title => "Vancouver, Canada", :lat => 49.2827, :lng => -123.1207}
    @paris = {:title => "Paris, France", :lat => 48.8567, :lng => 2.3508}
    @tokyo = {:title => "Tokyo, Japan", :lat => 35.6833, :lng => 139.6833}
    @cairo = {:title => "Cairo, Egypt", :lat => 30.0500, :lng => 31.2333}
    @sydney = {:title => "Sydney, Australia", :lat => -33.8650, :lng => 151.2094}
    @brasilia = {:title => "Brasilia, Brazil", :lat => -15.7939, :lng => -47.8828}

  end
end
