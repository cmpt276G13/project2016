class PlayersController < ApplicationController
  def update
    @player = current_user.player
    item = {}
    amount = params[:player][:items].to_i
    item[params[:item_name]] = amount
    if @player.update_items!(item, gold: params[:gold].to_i * amount)
      flash[:success] = "Purchase Successful"
      redirect_to items_url
    else
      file = File.read("app/assets/items/items.json")
      @items = JSON.parse file
      render 'items/index'
    end
  end
end
