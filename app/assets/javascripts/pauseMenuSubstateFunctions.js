function menuHomeEnter() {
    
    this.menuActions.selectedAction = 0;
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
    if(key.keyCode == Phaser.Keyboard.ENTER) {
    
        if(this.menuActions.getSelectedActionString() == "back") {
            
            game.state.start("overworld");
        }
    }
}