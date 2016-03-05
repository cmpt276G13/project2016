class QuestsController < ApplicationController
  # logged_in_user is defined in sessions_helper.rb
  before_action :logged_in_user, only: [:index, :show, :destroy]
  before_action :accept_once, only: :accept
  # before_action :admin, only: [:new, :create]
  
  def index
    # Change to only show ones that level_req are met
    @quests = Quest.paginate(page: params[:page], per_page: User.per_page)
  end
  
  def show
    @quest = Quest.find(params[:id])
  end
  
  def new
    @quest = Quest.new
  end
  
  def create
  
  end
  
  def edit
    @user = Quest.find(params[:id])
  end
  
  def update
    
  end
  
  def destroy
    Quest.find(params[:id]).destroy
    flash[:success] = "Quest deleted"
    redirect_to quests_url
  end
  
  # Accepts the given quest.
  def accept
    quest = Quest.find(params[:id])
    current_user.player.quests << quest
    redirect_to quests_url
  end
  
  private
  
    # Prevent accepting the quest more than once.
    def accept_once
      quest = Quest.find(params[:id])
      unless current_user.player.can_accept?(quest)
        redirect_to quests_url
      end
    end
    
    # Confirms admin.
    def admin
      redirect_to(quests_url) unless current_user.admin?
    end
end
