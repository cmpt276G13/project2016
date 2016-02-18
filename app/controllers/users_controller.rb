class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    if @user.save
      log_in @user
      flash[:success] = "Welcome to GeoHunter!"
      redirect_to @user # Change this if we want to redirect to a tutorial
    else
      render 'new'
    end
  end
  
  def edit
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      # Handle a successful update.
    else
      render 'edit'
    end
  end
  
  private
  
    def user_params
      params.require(:user).permit(:username, :email, :password,
                                    :password_confirmation)
    end
end
