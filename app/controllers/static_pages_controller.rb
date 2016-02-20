class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  
  def index
    
  end
  
  def hub
    @user_location = get_user_location
  end
end
