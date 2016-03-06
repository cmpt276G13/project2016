class PlayersController < ApplicationController
  attr_accessor :player
  
  def update
    @player = current_user.player
    self.player[params[:player[:item_name]]] = params[:player[:item_amount]]
    if @player.update_items(player_params)
      
    end
  end
  
  private
    
    def player_params
      params.require(self.player).permit(:item_name)
    end
end
