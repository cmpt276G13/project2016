function menuHomeEnter() {
    
    this.menuActions.resetSelection();
    this.menuActions.highlightSelectedAction();
    this.statDisplay = this.createPlayerStatDisplay();
    this.showMessage("Select an Action");
};

function menuHomeExit() {
    
    this.menuActions.selectionDisplay.visible = false;
    this.statDisplay.background.destroy();
    this.hideMessage();
};

function menuHomeUpdate() {
    
    this.menuActions.highlightSelectedAction();
};

function menuHomeKeyDown(key) {
    
    actionDisplayKeyDown(key, this.menuActions);
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        game.state.start("overworld");
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
    
        if(this.menuActions.getSelectedActionConfiguration().text == "back") {
            
            game.state.start("overworld");
        }
        
        if(this.menuActions.getSelectedActionConfiguration().text == "items") {
            
            this.stateManager.changeState("viewItems");
        }
    }
}

function viewItemsEnter() {
    
    this.itemDisplay = this.createPlayerItemDisplay();
    
    //create an action text display to show all of the player's actions
    this.itemActionDisplay = new actionDisplay({x: 15, y: 60, width: this.itemDisplay.background.width / 2.5, height: this.itemDisplay.background.height - 100, objectCreationFunction: attributeDisplayText}, []);
    
    for(var item in player.items) {
        
        this.itemActionDisplay.addAction({attributeName: item, attributeValue: "x" + player.items[item].quantity} );
    }
    
    this.itemActionDisplay.addAction({attributeName: "Back"} );
    this.itemActionDisplay.eraseBackground();
    this.itemActionDisplay.addParent(this.itemDisplay.background);
    
    this.itemDisplay.selectingUsage = false;
    
    //create options for when player clicks on an item
    this.selectionOptionsDisplay = new actionDisplay({x: this.itemDisplay.background.width / 2.5, y: 100, width: 150, height: 110, objectCreationFunction: text}, [{text: "Use"}, {text: "Discard"}, {text: "Cancel"}]);
    this.selectionOptionsDisplay.addParent(this.itemDisplay.background);
    this.selectionOptionsDisplay.background.visible = false;
}

function viewItemsUpdate() {
    
    this.itemActionDisplay.highlightSelectedAction();
    
    if(this.itemActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
        
        this.hideMessage();
        return;
    }
    
    this.showMessage(game.cache.getJSON("itemData")[this.itemActionDisplay.getSelectedActionConfiguration().attributeName].description);
    
    if(this.itemDisplay.selectingUsage) {
        
        this.selectionOptionsDisplay.highlightSelectedAction();
    }
}

function viewItemsKeyDown(key) {
    
    if(this.itemDisplay.selectingUsage) {
        
        actionDisplayKeyDown(key, this.selectionOptionsDisplay);
        
    } else {
        
        actionDisplayKeyDown(key, this.itemActionDisplay);
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
        
        if(this.selectionOptionsDisplay.getSelectedActionConfiguration().text == "Use") {
            
            //player uses an item
            useItem(player, this.itemActionDisplay.getSelectedActionConfiguration().attributeName);
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
    }
}

function viewItemsExit() {
    
    this.itemDisplay.background.destroy();
    this.hideMessage();
    
}