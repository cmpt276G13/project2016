class QuestsController < ApplicationController
  before_action :accept_once, only: :accept
  
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
end
