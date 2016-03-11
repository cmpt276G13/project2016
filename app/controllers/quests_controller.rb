class QuestsController < ApplicationController
  # logged_in_user is defined in sessions_helper.rb
  before_action :logged_in_user
  before_action :req_check, only: :accept
  before_action :admin, only: [:new, :create, :edit, :update, :destroy]
  
  def index
    @quests = Quest.paginate(page: params[:page], per_page: User.per_page)
  end
  
  def show
    @quest = Quest.find(params[:id])
  end
  
  def new
    @quest = Quest.new
  end
  
  def create
    @quest = Quest.new(quest_params)
    if @quest.save
      flash[:success] = "Quest successfully created!"
      redirect_to @quest
    else
      render 'new'
    end
  end
  
  def edit
    @quest = Quest.find(params[:id])
  end
  
  def update
    @quest = Quest.find(params[:id])
    if @quest.update_attributes(quest_params)
      flash[:success] = "Quest successfully updated."
      redirect_to @quest
    else
      render 'edit'
    end
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
    
    def quest_params
      params.require(:quest).permit(:name, :description, :level_req)
    end
  
    # Before methods
  
    # Prevent accepting the quest when conditions are not met.
    def req_check
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
