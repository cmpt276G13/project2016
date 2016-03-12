class GamesController < ApplicationController
    before_action :logged_in_user, only: [:index, :save] #im not even sure how they'll get to the save without being logged in, but i'll put it here anyways
    
    #whatever route contains the game should send in the database information for the current player
    def index
        #eg. if i want he game to play in the index, i want to send the player's data to the index html file
        #note that Player is assumed to be a model
        
        #@player = Player.find(name of player, or some other way to identify him)
        @currentUser = current_user
        
        if request.referer != (hub_url || game_url)
            redirect_to hub_path
        end
        
        @latitude = get_user_location[:latitude]
        @longitude = get_user_location[:longitude]
    end
    
    def save 
       
       current_user.player.update_attributes(player_params)
       
       current_user.player.items = params[:items] #permit keeps removing items even though its specified, access items directly from parameters
       current_user.player.save
       
       #save player's quest progress
       questProgressData = params[:quest_progress]
       
       questProgressData.each do |key, progressData|
           
           quest = current_user.player.quest_acceptances.find_by(quest_id: key)
           quest.completed = progressData["completed"]
           quest.progress = progressData["progress"]
           quest.save
       end
       
    end
    
    def player_params
       
       params.permit(:level, :health, :strength, :defense, :experience, :gold, :experience_to_next_level, :max_health, :deaths, :items) 
    end
end
