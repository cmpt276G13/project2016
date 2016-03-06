class PlayersController < ApplicationController
  def update
    @player = current_user.player
    item = {}
    item[params[:item_name]] = params[:player][:items]
    if @player.update_items!(item)
      flash[:success] = "Purchase Successful"
      redirect_to items_url
    end
  end
end
