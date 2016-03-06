class PlayersController < ApplicationController
  before_action :logged_in_user
  
  def update
    @player = current_user.player
    item = {}
    amount = params[:player][:items].to_i
    item[params[:item_name]] = amount
    if @player.update_items!(item, gold: params[:gold].to_i * amount)
      flash[:success] = "Purchase Successful"
    else
      flash[:danger] = "Not enough gold."
    end
    redirect_to items_url
  end
end
