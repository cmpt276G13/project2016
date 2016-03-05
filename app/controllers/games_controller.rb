class GamesController < ApplicationController
    before_action :logged_in_user, only: [:index, :save] #im not even sure how they'll get to the save without being logged in, but i'll put it here anyways
    
    #whatever route contains the game should send in the database information for the current player
    def index
        #eg. if i want he game to play in the index, i want to send the player's data to the index html file
        #note that Player is assumed to be a model
        
        #@player = Player.find(name of player, or some other way to identify him)
        @users = User.order_by_points.first(10)
        @currentUser = current_user
        
        if request.referer != (hub_url || game_url)
            redirect_to hub_path
        end
        
        @latitude = get_user_location[:latitude]
        @longitude = get_user_location[:longitude]
    end
    
    def save 
       
       current_user.player.update_attributes(player_params)
       
       puts "FOAFJALKDFJ:KALFJ:AJDF:LKJA:LDFJAL:DKFJ: LAKDJFLKAJF:LKAJF:LK AJDF:LAKDJF:LAKDFJL:AKDJF:LAKDJF:LADKFJ:ALKDFJ:LADKAKFJA:LKFJLADJFLKADJFLJ"
       puts params[:items]
       current_user.player.items = params[:items] #permit keeps removing items even though its specified, access items directly from parameters
       current_user.player.save
       #current_user.player.items ||= [1, 2, 3]
       #current_user.player.save
    end
    
    def player_params
       
       params.permit(:level, :health, :strength, :defense, :experience, :gold, :experience_to_next_level, :max_health, :deaths, :items) 
    end
end
