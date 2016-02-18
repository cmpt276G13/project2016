class StaticPagesController < ApplicationController
  def index
  end
  
  def hub
    @user_location = get_user_location
  end
end
