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

//object that displays a quest summary
//basic formatting is as follows
/*
Title
"In Progress"/"Completed"

*/
var questDisplaySummary = function(config) {
    
    this.configuration = this.mergeConfigWithDefault(config);
    
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    this.questName = game.add.text(0, 0, this.configuration.quest.name, questTitleStyle);
    
    if(this.configuration.quest.type != "null") {
            
        var completionConfig = {};
        var completionString = "";
        
        if(this.configuration.quest.completed) {
            
            completionString = "Complete";
            completionConfig = questCompletedStyle;
            
        } else {
            
            completionString = "In Progress";
            completionConfig = questInProgressStyle;
        }
        
        this.questProgress = game.add.text(0, this.questName.height / 1.4, completionString, completionConfig);
        this.parentGraphics.addChild(this.questProgress);
    }
    
    this.parentGraphics.addChild(this.questName);
    
    //create the quest titl
}

questDisplaySummary.prototype.mergeConfigWithDefault = function(config) {
    
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

questDisplaySummary.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

questDisplaySummary.prototype.destroy = function() {
    
    this.parentGraphics.destroy();
}

questDisplay.prototype = Object.create(questDisplaySummary.prototype);

//displays entire quest info
/*
title
in progress / completed
description

progress info (items gathered, or mosnters killed, or whatever the object requires)

rewards
*/
function questDisplay(config) {
    
    questDisplaySummary.call(this, config);
    this.questName.x = this.configuration.cellWidth / 2;
    this.questName.anchor.x = 0.5;
    this.questProgress.x = this.configuration.cellWidth / 2;
    this.questProgress.anchor.x = 0.5;
    
    //create description
    this.questDescription = game.add.text(this.configuration.cellWidth / 2, this.questProgress.y + this.questProgress.height, this.configuration.quest.description, questDescriptionStyle);
    this.questDescription.anchor.x = 0.5;
    this.parentGraphics.addChild(this.questDescription);
    
    this.createProgressReport();
    
    this.createRewardsReport();
}

questDisplay.prototype.createProgressReport = function() {
    
    if(this.configuration.quest.type == "kill") {
        
        var progressString = this.configuration.quest.targetName + ":   " + this.configuration.quest.targetsAcquired + "/" + this.configuration.quest.targetAmount;
        this.progressReport = game.add.text(this.configuration.cellWidth / 2, this.questDescription.y + this.questDescription.height, progressString, questProgressStyle);
        this.progressReport.anchor.x = 0.5;
        this.parentGraphics.addChild(this.progressReport);
    }
}

questDisplay.prototype.createRewardsReport = function() {
    
    this.rewardsHeading = game.add.text(this.configuration.cellWidth / 2, this.progressReport.y + this.progressReport.height, "Rewards", questRewardsHeadingStyle);
    this.parentGraphics.addChild(this.rewardsHeading);
    this.rewardsHeading.anchor.x = 0.5;
    
    this.rewards = [];
    var rewardsCreated = 0;
    
    //list all the items
    for(item in this.configuration.quest.rewards.items) {
        
        var rewardString = item + "   x" + this.configuration.quest.rewards.items[item];
        var text = game.add.text(this.configuration.cellWidth / 2, this.rewardsHeading.y + this.rewardsHeading.height + 15 * rewardsCreated, rewardString, questProgressStyle);
        text.anchor.x = 0.5;
        rewardsCreated += 1;
        this.rewards.push(text);
        
        this.parentGraphics.addChild(text);
    }
    
    //list all the stats
    for(stat in this.configuration.quest.rewards.stats) {
        
        var rewardString = this.configuration.quest.rewards.stats[stat] + "     " + stat;
        var text = game.add.text(this.configuration.cellWidth / 2, this.rewardsHeading.y + this.rewardsHeading.height + 5 + 15 * rewardsCreated, rewardString, questProgressStyle);
        text.anchor.x = 0.5;
        rewardsCreated += 1;
        this.rewards.push(text);
        
        this.parentGraphics.addChild(text);
    }
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