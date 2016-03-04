class QuestsController < ApplicationController
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
end
