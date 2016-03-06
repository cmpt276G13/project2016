function menuHomeEnter() {
    
    this.menuActions.resetSelection();
    this.menuActions.highlightSelectedAction();
    this.statDisplay.background.visible = true;
    this.showMessage("Select an Action");
};

function menuHomeExit() {
    
    this.menuActions.selectionDisplay.visible = false;
    this.statDisplay.background.visible = false;
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
    
    this.itemDisplay.background.visible = true;
    
    //create an action text display to show all of the player's actions
    this.itemActionDisplay = new actionDisplay({x: 15, y: 60, width: this.itemDisplay.background.width / 2.5, height: this.itemDisplay.background.height - 100, objectCreationFunction: attributeDisplayText}, []);
    
    for(var item in player.items) {
        
        this.itemActionDisplay.addAction({attributeName: item, attributeValue: "x" + player.items[item].quantity} );
    }
    
    this.itemActionDisplay.addAction({attributeName: "Back"} );
    this.itemActionDisplay.eraseBackground();
    this.itemActionDisplay.highlightSelectedAction();
    this.itemActionDisplay.addParent(this.itemDisplay.background);
}

function viewItemsUpdate() {
    
    this.itemActionDisplay.highlightSelectedAction();
    
    if(this.itemActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
        
        this.hideMessage();
        return;
    }
    
    this.showMessage(game.cache.getJSON("itemData")[this.itemActionDisplay.getSelectedActionConfiguration().attributeName].description);
}

function viewItemsKeyDown(key) {
    
    actionDisplayKeyDown(key, this.itemActionDisplay);
    
    if(key.keyCode == Phaser.Keyboard.ESC) {
        
        this.stateManager.changeState("menuHome");
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
    
        if(this.itemActionDisplay.getSelectedActionConfiguration().attributeName == "Back") {
            
            this.stateManager.changeState("menuHome");
        }
    }
}

function viewItemsExit() {
    
    this.itemDisplay.background.visible = false;
    this.hideMessage();
    
    if(typeof this.itemActionDisplay !== "undefined") {
        
        this.itemActionDisplay.background.destroy();
    }
}