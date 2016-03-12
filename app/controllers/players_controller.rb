class PlayersController < ApplicationController
  before_action :logged_in_user
  
  # It's a little convoluted when trying to add a hash
  def update
    @player = current_user.player
    message_success = "Quest Complete!"
    message_fail = "Cannot finish quest."
    if params[:commit] == "Turn in" 
      @player.turn_in(params[:player][:quest])
      @player.update(player_params)
      @player.level_up
    else # Else it is a purchase from the shop
      message_success = "Purchase Successful"
      message_fail = "Not enough gold."
    end
    if @player.update_items!(params[:player][:items], price: params[:price])
      flash[:success] = message_success
    else
      flash[:danger] = message_fail
    end
    redirect_to :back
  end
  
  private
  
    def player_params
      params.require(:player).permit(:gold, :strength, :defense,
                                :experience).except(:items)
    end
end
