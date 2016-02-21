class StaticPagesController < ApplicationController
  before_action :logged_in_user, only: :hub
  
  def index
    @users = User.includes(:player).order("players.level DESC, players.experience DESC")
  end
  
  def hub
    @user_location = get_user_location
    @users = User.includes(:player).order("players.level DESC, players.experience DESC")
  end
end
