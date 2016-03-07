//assign the quest with the given ID to the player
function assignQuest(player, questID) {
    
    if(typeof player.quests[questID] !== "undefined") {
        
        //quest already exists
        return;
    }
    
    //player doesn't have quest yet, so give him the quest
    player.quests[questID] = game.cache.getJSON("questData")[questID];
        
    //now create a progress variable according to the type of quest it it
    if(player.quests[questID].type == "kill" || player.quests[questID].type == "gather") {
        
        player.quests[questID].targetsAcquired = 0;
    }
    
    player.quests[questID].completed = false;
}

//functions that should be called when the player does stuff that could change his progress on a quest
var questManager = {
    
    // onGetItem(itemName, quantity) {
        
    //     //go through the player's items and update any quest progress that requires that item
    //     scanInventoryForQuestCompletion();
    // }
    
    // scanInventoryForQuestCompletion() {
        
    //     for(item in player.items) {
            
    //         for(quest in player.quests) {
                
    //             if(player.quests[quest].type == "gather") {
                    
    //                 checkGatherQuestProgress(item, player.items[item].quantity, player.quests[quest]);
    //             }
    //         }
    //     }
    // }
    
    // //checks if the given gather quest requires the given item
    // //if it does, the quest progress will be updated according to the amount of items there are
    // checkGatherQuestProgress(itemName, itemQuantity, player.quests[quest]) {
        
    //     if(itemName == player.quests[quest].targetName) {
            
    //         player.quests[quest].targetsAcquired = itemQuantity;
    //         player.quests[quest].completed = (itemQuantity == player.quests[quest].targetAmount);
    //     }
    // }
}

//when player kills a monster, call this function to update his quests
questManager.prototype.onKillMonster = function(monsterName, quantity) {
    
    for(questName in player.quests) {
        
        var quest = player.quests[questName];
        
        //this isn't a killing quest, no need to update it
        //or quest is already complete so no need to handle it again
        if(quest.type != "kill" || quest.completed == true) {
            
            continue;
        }
        
        //killing quest, but wrong target, skip
        if(quest.targetName != monsterName) {
            
            continue;
        }
        
        //killed the monster for this quest, make player progress on the quest
        quest.targetsAcquired += quantity;
        
        //don't let player's progress exceed required number of monster
        if(quest.targetsAcquired >= quest.targetAmount) {
            
            quest.completed = true;
            quest.targetsAcquired = quest.targetAmount;
            
            //optionally for later
            //queue completed quests to display message to player
            //this.recentlyCompletedQuests.push(quest);
        }
    }
}