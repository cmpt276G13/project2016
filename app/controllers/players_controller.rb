class PlayersController < ApplicationController
  before_action :logged_in_user
  
  # It's a little convoluted when trying to add a hash
  def update
    @player = current_user.player
    message_success = "Quest Complete!"
    message_fail = "Cannot finish quest."
    if params[:commit] == "Turn in" # From button text
      @player.turn_in(params[:player][:quest])
      player_params.each do |key, value|
        @player.increment(key, value.to_i)
      end
      @player.level_up
    else # Else it is a purchase from the shop
      message_success = "Purchase Successful"
      message_fail = "Not enough gold."
    end
    if @player.update_serializations!(params[:player][:skills], price: params[:price])
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
