function menuHomeEnter() {
    
    player.save();
    questManager.onInventoryCheck();
    this.menuActions.resetSelection();
    this.menuActions.highlightSelectedAction();
    this.statDisplay = this.createPlayerStatDisplay();
};

function menuHomeExit() {
    
    this.menuActions.selectionDisplay.visible = false;
    this.statDisplay.background.destroy();
    this.hideMessage();
};

function menuHomeUpdate() {
    
    this.menuActions.highlightSelectedAction();
    
    if(this.menuActions.getSelectedActionConfiguration().text == "Back") {
        
        this.showMessage("Return to game.");
    }
    
    if(this.menuActions.getSelectedActionConfiguration().text == "Items") {
        
        this.showMessage("View your items.");
    }
    
    if(this.menuActions.getSelectedActionConfiguration().text == "Skills") {
        
        this.showMessage("View your skills.");
    }
    
    if(this.menuActions.getSelectedActionConfiguration().text == "Quests") {
        
        this.showMessage("View all the quests you are undertaking.");
    }
};

function menuHomeKeyDown(key) {
    
    actionDisplayKeyDown(key, this.menuActions, true);
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        game.state.start("overworld");
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
    
        if(this.menuActions.getSelectedActionConfiguration().text == "Back") {
            
            game.state.start("overworld");
        }
        
        if(this.menuActions.getSelectedActionConfiguration().text == "Items") {
            
            this.stateManager.changeState("viewItems");
        }
        
        if(this.menuActions.getSelectedActionConfiguration().text == "Skills") {
            
            this.stateManager.changeState("viewSkills");
        }
        
        if(this.menuActions.getSelectedActionConfiguration().text == "Quests") {
            
            this.stateManager.changeState("viewQuests");
        }
    }
}

function viewItemsEnter() {
    
    this.itemDisplay = this.createPlayerItemDisplay();
    
    //create an action text display to show all of the player's actions
    this.itemActionDisplay = new actionDisplay({x: this.itemDisplay.background.width / 4, y: 60, width: this.itemDisplay.background.width / 2, height: this.itemDisplay.background.height - 100, objectCreationFunction: attributeDisplayText}, []);
    
    for(var item in player.items) {
        
        this.itemActionDisplay.addAction({attributeName: item, attributeValue: "x" + player.items[item].quantity} );
    }
    
    this.itemActionDisplay.addAction({attributeName: "Back"} );
    this.itemActionDisplay.eraseBackground();
    this.itemActionDisplay.addParent(this.itemDisplay.background);
    
    this.itemDisplay.selectingUsage = false;
    
    //create options for when player clicks on an item
    this.selectionOptionsDisplay = new actionDisplay({x: this.itemDisplay.background.width / 2.5, y: 100, width: 150, height: 110, viewableObjects: 8, objectCreationFunction: text}, [{text: "Use"}, {text: "Discard"}, {text: "Cancel"}]);
    this.selectionOptionsDisplay.addParent(this.itemDisplay.background);
    this.selectionOptionsDisplay.background.visible = false;
}

function viewItemsExit() {
    
    this.itemDisplay.background.destroy();
    this.hideMessage();
}

function viewItemsUpdate() {
    
    this.itemActionDisplay.highlightSelectedAction();
    
    if(this.itemActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
        
        this.showMessage("Return to main menu");
        return;
    }
    
    this.showMessage(game.cache.getJSON("itemData")[this.itemActionDisplay.getSelectedActionConfiguration().attributeName].description);
    
    if(this.itemDisplay.selectingUsage) {
        
        this.selectionOptionsDisplay.highlightSelectedAction();
    }
}

function viewItemsKeyDown(key) {
    
    if(this.itemDisplay.selectingUsage) {
        
        actionDisplayKeyDown(key, this.selectionOptionsDisplay, true);
        
    } else {
        
        actionDisplayKeyDown(key, this.itemActionDisplay, true);
    }
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        if(this.itemDisplay.selectingUsage) {
            
            this.itemDisplay.selectingUsage = false;
            this.selectionOptionsDisplay.background.visible = false;
            return;
        }
    
        this.stateManager.changeState("menuHome");
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER && this.itemDisplay.selectingUsage == false) {
        
        if(this.itemActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
            
            this.stateManager.changeState("menuHome");
            return;
        } 
        
        //chose an item
        this.itemDisplay.selectingUsage = true;
        this.selectionOptionsDisplay.background.visible = true;
        this.selectionOptionsDisplay.resetSelection();
        return;
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER && this.itemDisplay.selectingUsage) {
        
        if(this.selectionOptionsDisplay.getSelectedActionConfiguration().text == "Cancel") {
            
            this.itemDisplay.selectingUsage = false;
            this.selectionOptionsDisplay.background.visible = false;
            return;
        }
        
        if(this.selectionOptionsDisplay.getSelectedActionConfiguration().text == "Use" && player.items[this.itemActionDisplay.getSelectedActionConfiguration().attributeName].usable) {
            
            //player uses an item
            useItem(player, this.itemActionDisplay.getSelectedActionConfiguration().attributeName);
            
        } else if(this.selectionOptionsDisplay.getSelectedActionConfiguration().text == "Use" && !player.items[this.itemActionDisplay.getSelectedActionConfiguration().attributeName].usable) {
            
            var message = new textBox({x: 320, y: 300, width: 300, height: 20, showPressEnterMessage: false});
            message.setText("This item is not usable");
            game.time.events.add(2000, function(){this.background.destroy() }, message);
            return;
        }
        
        if(this.selectionOptionsDisplay.getSelectedActionConfiguration().text == "Discard") {
            
            //player uses an item
            discardItem(player, this.itemActionDisplay.getSelectedActionConfiguration().attributeName);
        }
        
        //replace text
        var itemName = this.itemActionDisplay.getSelectedActionConfiguration().attributeName;
        var itemQuantityString = this.itemActionDisplay.getSelectedActionConfiguration().attributeValue.substring(1);
        var itemQuantity = parseInt(itemQuantityString) - 1;
        itemQuantity = "x" + itemQuantity;
        this.itemActionDisplay.replaceSelectedAction({attributeName: itemName, attributeValue: itemQuantity});
        
        //if the previously used item has no quantity left, then re-enter item menu
        if(this.itemActionDisplay.getSelectedActionConfiguration().attributeValue == "x0") {
            
            this.stateManager.changeState("viewItems");
        }
        
        player.save();
    }
}

function viewSkillsEnter() {
    
   this.skillDisplay = this.createPlayerSkillDisplay();
    
    //create an action text display to show all of the player's actions
    this.skillActionDisplay = new actionDisplay({viewableObjects: 8, x: this.skillDisplay.background.width / 4, y: 60, width: this.skillDisplay.background.width / 2, height: this.skillDisplay.background.height - 100, objectCreationFunction: attributeDisplayText}, []);
    
    for(var i = 0; i < player.skills.length; ++i) {
        
        var skillName = player.skills[i]
        this.skillActionDisplay.addAction({attributeName: skillName, attributeValue: game.cache.getJSON("skillData")[skillName].manaCost + " MP"} );
    }
    
    this.skillActionDisplay.addAction({attributeName: "Back"} );
    this.skillActionDisplay.eraseBackground();
    this.skillActionDisplay.addParent(this.skillDisplay.background);
}

function viewSkillsUpdate() {
    
    this.skillActionDisplay.highlightSelectedAction();
    
    if(this.skillActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
        
        this.showMessage("Return to main menu.");
        return;
    }
    
    this.showMessage(game.cache.getJSON("skillData")[this.skillActionDisplay.getSelectedActionConfiguration().attributeName].description);
}

function viewSkillsKeyDown(key) {
    
    actionDisplayKeyDown(key, this.skillActionDisplay, true);
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
    
        this.stateManager.changeState("menuHome");
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        if(this.skillActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
            
            this.stateManager.changeState("menuHome");
            return;
        } 
    }
}

function viewSkillsExit() {
    
    this.skillDisplay.background.destroy();
    this.hideMessage();
}

function viewQuestsEnter() {
    
    this.showMessage("Select a quest to view a detailed description of it.\nPress Back to return to the main menu.");
    questManager.onInventoryCheck();
    this.questDisplay = this.createPlayerQuestDisplay();
    
    //create an action text display to show all of the player's quests
    this.questActionDisplay = new actionDisplay({viewableObjects: 7, x: this.questDisplay.background.width / 4, y: 60, width: this.questDisplay.background.width / 2, height: this.questDisplay.background.height - 100, cellHeight: 43, objectCreationFunction: questDisplaySummary}, []);
    
    for(questID in player.quests) {
        
        this.questActionDisplay.addAction({quest: player.quests[questID]} );
    }
    
    var backQuest = {name: "Back", type: "null"};
    this.questActionDisplay.addAction({quest: backQuest});
    this.questActionDisplay.eraseBackground();
    this.questActionDisplay.addParent(this.questDisplay.background);
    
    //background for detailed quest description
    this.detailedQuestDescriptionBackground = createTextboxBackground(250, 100, 400, 400, false);
    this.detailedQuestDescriptionBackground.visible = false;
}

function viewQuestsUpdate() {
    
    this.questActionDisplay.highlightSelectedAction();
}

function viewQuestsKeyDown(key) {
    
    if(!this.detailedQuestDescriptionBackground.visible) {
        
        actionDisplayKeyDown(key, this.questActionDisplay, true);
    }
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        if(!this.detailedQuestDescriptionBackground.visible) {
            
            this.stateManager.changeState("menuHome");
            return;
        }
        
        this.detailedQuestDescriptionBackground.visible = false;
        return;
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER && !this.detailedQuestDescriptionBackground.visible) {
        
        if(this.questActionDisplay.getSelectedActionConfiguration().quest.name == "Back") {
            
            this.stateManager.changeState("menuHome");
            return;
        }
        
        //selected a quest, show a detailed description of it
        this.detailedQuestDescription = new questDisplay({quest: this.questActionDisplay.getSelectedActionConfiguration().quest, 
            cellWidth: 400, cellHeight: 400
        });
        
        this.detailedQuestDescription.addParent(this.detailedQuestDescriptionBackground);
        this.detailedQuestDescriptionBackground.visible = true;
        return;
        
    } else if(key.keyCode == Phaser.Keyboard.ENTER && this.detailedQuestDescriptionBackground.visible) {
        
        this.detailedQuestDescriptionBackground.visible = false;
        this.detailedQuestDescription.destroy();
    }
}

function viewQuestsExit() {
    
    this.questDisplay.background.destroy();
    
    if(typeof this.detailedQuestDescriptionBackground !== "undefined") {
        
        this.detailedQuestDescriptionBackground.destroy();
    }
}