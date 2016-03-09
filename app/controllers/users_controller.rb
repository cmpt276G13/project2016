class UsersController < ApplicationController
  # logged_in_user is defined in sessions_helper.rb
  before_action :logged_in_user, only: [:edit, :update, :destroy]
  before_action :correct_user_or_admin,   only: [:edit, :update, :destroy]
  
  def index
    # Users are now by default ordered by points. Check user.rb.
    @users = User.paginate(page: params[:page], :per_page => User.per_page)
  end
  
  def show
    @user = User.find(params[:id])
    @player = @user.player
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    if @user.save
      @player = @user.create_player
      log_in @user
      flash[:success] = "Welcome to GeoHunter!"
      redirect_to @user # Change this if we want to redirect to a tutorial
    else
      render 'new'
    end
  end
  
  def edit
    @user = User.find(params[:id])
  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to @user
    else
      render 'edit'
    end
  end
  
  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "User deleted"
    redirect_to users_url
  end
  
  private
  
    def user_params
      params.require(:user).permit(:username, :email, :password,
                                    :password_confirmation)
    end
    
    # Functions to be run before this controller
    
    # Confirms the correct user.
    def correct_user_or_admin
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user) || current_user.admin?
    end
end
