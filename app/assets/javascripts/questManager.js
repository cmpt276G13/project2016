//create the quest with the given ID to the player
function assignQuest(questID) {
    
    //player doesn't have quest yet, so give him the quest
    quest = game.cache.getJSON("questData")[questID];
        
    //now create a progress variable according to the type of quest it it
    if(quest.type == "kill" || quest.type == "gather") {
        
        quest.targetsAcquired = 4;
    }
    
    quest.completed = false;
    return quest;
}

//object that displays a quest
//base class for other quests
//basic formatting is as follows
/*
Title
"In Progress"/"Completed"

Description

additional info, like monsters killed, or items collected

*/
var questDisplay = function(config) {
    
    this.configuration = this.mergeConfigWithDefault(config);
    
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    this.questName = game.add.text(0, 0, this.configuration.quest.name, questTitleStyle);
    
    var completionConfig = {};
    var completionString = "";
    
    if(this.configuration.quest.completed) {
        
        completionString = "Complete";
        completionConfig = questCompletedStyle;
        
    } else {
        
        completionString = "In Progress";
        completionConfig = questInProgressStyle;
    }
    
    this.questProgress = game.add.text(0, this.questName.height / 1.7, completionString, completionConfig);
    this.questDescription = game.add.text(0, this.questName.height * 1.2, this.configuration.quest.description, questDescriptionStyle);
    
    this.parentGraphics.addChild(this.questName);
    this.parentGraphics.addChild(this.questDescription);
    this.parentGraphics.addChild(this.questProgress);
    
    //create the quest titl
}

questDisplay.prototype.mergeConfigWithDefault = function(config) {
    
   var defaultConfig = {
        
        quest: {},
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0
    }
    
    mergeObjects(defaultConfig, config);
    return defaultConfig;
}

questDisplay.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

questDisplay.destroy = function() {
    
    this.parentGraphics.destroy();
}

//quest dispaly for quests that involve keeping track of a number of targets
questDisplayTargetCounter.prototype = Object.create(questDisplay.prototype);

function questDisplayTargetCounter(config) {
    
    questDisplay.call(this, config);
    
    //track the number of monsters killed
    var targetCount = this.configuration.quest.targetName + ":  " + this.configuration.quest.targetsAcquired + "/" + this.configuration.quest.targetAmount;
    this.questTarget = game.add.text(0, this.questDescription.y + this.questDescription.height, targetCount, healthBarCaptionStyle);
}

//functions that should be called when the player does stuff that could change his progress on a quest
var questManager = {
    
    //array of strings
    //each string corresponds to the name of a quest
    recentlyCompletedQuests: []
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
questManager.onKillMonster = function(monsterName, quantity) {
    
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
            this.recentlyCompletedQuests.push(quest.name);
        }
    }
}