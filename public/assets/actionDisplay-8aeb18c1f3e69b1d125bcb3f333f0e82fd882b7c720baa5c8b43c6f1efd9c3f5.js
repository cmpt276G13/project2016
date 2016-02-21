//an action display is a rectangular display that lists a bunch of possible actions a player can make
//it consists of a container that stores the text, and the texts that are supposed to be displayed
//it also contains information about what action is currently being selected, and a way to indicate what action is selected
function actionDisplay(x, y, width, height, actionTexts) {
    
    //background that is displayed behind all the text
    this.background = createTextboxBackground(x, y, width, height);
    this.background.fixedToCamera = true;
    
    //index of currently selected action (corresponds to the array of action texts)
    this.selectedAction = 0;
    
    //object that indicates what action is currently being selected
    //the constructor for graphics takes in a position, but the position actually sets the origin for hte graphics obejct
    //any draw positions will be relative to this origin, so set it to 0, 0
    this.selectionDisplay = game.add.graphics(0, 0);
    this.background.addChild(this.selectionDisplay);
    
    //the text that will be displayed
    this.actionTexts = createActionTexts(actionTexts, this.background);
};

//the actionBox will have a selected text that needs to be highlighted, and this function positions the highlight so that it's surroundign the selected text
actionDisplay.prototype.highlightSelectedAction = function() {
    
    this.selectionDisplay.visible = true;
    
    //first clear the previously drawn rectangle
    this.selectionDisplay.clear();
    
    //don't draw anything if there is no text
    if(this.selectedAction >= this.actionTexts.length) {
        
        return;
    }
    
    //clear resets line style, so set it again
    this.selectionDisplay.lineStyle(2, 0x0000FF, 1);
    
    //now draw a new rectangle around the current selection
    var xPosition = this.actionTexts[this.selectedAction].x;
    var yPosition = this.actionTexts[this.selectedAction].y;
    
    this.selectionDisplay.drawRect(xPosition, yPosition, 100, 30);
};

//users will be able to change their currently selected action
actionDisplay.prototype.selectNext = function() {
    
    this.selectedAction = (this.selectedAction + 1) % this.actionTexts.length;
};

actionDisplay.prototype.selectPrevious = function() {
    
    this.selectedAction = this.selectedAction - 1 < 0 ? this.actionTexts.length - 1 : this.selectedAction - 1;
};

//the actions available to the player, in text form
function createActionTexts(choices, actionDisplayBackground) {
    
    var textMargins = 10;
    var textSize = 28;
    
    var actionTexts = [];
    
    var i = 0;
    for(i = 0; i < choices.length; ++i) {
        
        actionTexts.push(game.add.text(textMargins, textMargins + i * textSize, choices[i], {fill: '#fff'} ));
        actionTexts[i].fontSize = 22;
        
        //by setting this text to the child of the action box, the text will be positioned relative to the action box instead of relative to the screen
        actionDisplayBackground.addChild(actionTexts[i]);
    }
    
    return actionTexts;
};

//onKeyDown listener for action Display objects
//this will assume the arrow keys is used to move, and it will move the current action selection for the given action display
function actionDisplayKeyDown(key, actionDisplay) {
        
    //move the players selection
    if(key.keyCode == Phaser.Keyboard.UP) {
        
        actionDisplay.selectPrevious();
    }
    
    if(key.keyCode == Phaser.Keyboard.DOWN) {
        
        actionDisplay.selectNext();
    }
};
