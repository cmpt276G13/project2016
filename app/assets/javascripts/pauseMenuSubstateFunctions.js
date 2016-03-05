function menuHomeEnter() {
    
    this.menuActions.resetSelection();
    this.menuActions.highlightSelectedAction();
};

function menuHomeExit() {
    
    this.menuActions.selectionDisplay.visible = false;
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
    }
}