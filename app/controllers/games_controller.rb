class GamesController < ApplicationController
    
    #whatever route contains the game should send in the database information for the current player
    def index
        
        #eg. if i want he game to play in the index, i want to send the player's data to the index html file
        #note that Player is assumed to be a model
        
        #@player = Player.find(name of player, or some other way to identify him)
    end
end
