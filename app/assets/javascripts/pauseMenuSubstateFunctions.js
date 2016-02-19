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
    
        if(this.menuActions.actionTexts[this.menuActions.selectedAction].text == "back") {
            
            game.state.start("overworld");
        }
    }
}