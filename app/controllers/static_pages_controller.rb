class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: [:hub, :tutorial_page]
  def index
    # Users are now by default ordered by points. Check user.rb.
    @users = User.first(10)
  end
  
  def hub
    #@user_location = get_user_location
    #@latitude = @user_location[:latitude]
    #@longitude = @user_location[:longitude]
  end
  def gameinfo
  end
end
