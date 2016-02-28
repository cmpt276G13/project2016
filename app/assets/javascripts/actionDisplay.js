//an action display is a rectangular display that lists a bunch of possible actions a player can make
//it consists of a container that stores the text, and the texts that are supposed to be displayed
//it also contains information about what action is currently being selected, and a way to indicate what action is selected
//actionTexts MUST BE an array of configurations for the texts you wish to use
//the configuration can be either {text: } OR {attributeName: , attributeValue: }
//all other configurations are ignored
function actionDisplay(configuration, actionTexts) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    
    //background that is displayed behind all the text
    this.background = createTextboxBackground(this.configuration.x, this.configuration.y, this.configuration.width, this.configuration.height);
    this.background.fixedToCamera = true;
    
    //index of currently selected action (corresponds to the array of action texts), used to get the string of the selected action
    this.idSelectedAction = 0;
    
    //id used to determine position of the selection bar
    //this is a value between 0 and viewableObjects - 1
    this.idActionToHighlight = 0;
    
    //the text that will be displayed
    this.actionTextList = new scrollableObjectList({x: 5, y: 5, cellWidth: this.configuration.width - 10, cellHeight: 28,
                                                    objectCreationFunction: this.configuration.objectCreationFunction, viewableObjects: this.configuration.viewableObjects}); //createActionTexts(actionTexts, this.background);
    
    //add all the texts
    for(var i = 0; i < actionTexts.length; ++i) {
        
        actionTexts[i]["textStyle"] = actionStyle;
        this.actionTextList.addObject(actionTexts[i]);
    }
    //this.actionTextList.addObjec(actionTexts, actionStyle);
    this.actionTextList.addParent(this.background);
    
    //object that indicates what action is currently being selected
    //the constructor for graphics takes in a position, but the position actually sets the origin for hte graphics obejct
    //any draw positions will be relative to this origin, so set it to 0, 0
    this.selectionDisplay = game.add.graphics(0, 0);
    this.background.addChild(this.selectionDisplay);
};

actionDisplay.prototype.mergeConfigWithDefault = function(configuration) {
    
    var config = {
        
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        viewableObjects: 5,
        objectCreationFunction: text
    }
    
    $.extend(config, configuration);
    
    return config;
}

actionDisplay.prototype.addAction = function(actionConfig) {
    
    actionConfig["textStyle"] = actionStyle;
    this.actionTextList.addObject(actionConfig);
}

actionDisplay.prototype.clearActions = function() {
    
    this.actionTextList.clear();
    this.idActionToHighlight = 0;
    this.idSelectedAction = 0;
}

//the actionBox will have a selected text that needs to be highlighted, and this function positions the highlight so that it's surroundign the selected text
actionDisplay.prototype.highlightSelectedAction = function() {
    
    this.selectionDisplay.visible = true;
    
    //first clear the previously drawn rectangle
    this.selectionDisplay.clear();
    
    //don't draw anything if there is no text
    if(this.idActionToHighlight >= Math.min(this.actionTextList.objects.length, this.configuration.viewableObjects)) {
        
        return;
    }
    
    //clear resets line style, so set it again
    this.selectionDisplay.lineStyle(2, 0x000000, 2);
    
    //now draw a new rectangle around the current selection
    var xPosition = this.actionTextList.objects[this.idActionToHighlight].configuration.x + this.actionTextList.configuration.x;
    var yPosition = this.actionTextList.objects[this.idActionToHighlight].configuration.y + this.actionTextList.configuration.y;
    
    this.selectionDisplay.drawRect(xPosition, yPosition, this.actionTextList.configuration.cellWidth, this.actionTextList.configuration.cellHeight);
};

//users will be able to change their currently selected action
actionDisplay.prototype.selectNext = function() {
    
    this.idActionToHighlight += 1;
    this.idSelectedAction += 1;
    
    if(this.idActionToHighlight >= Math.min(this.configuration.viewableObjects, this.actionTextList.objects.length)) {
        
        this.idActionToHighlight = Math.min(this.configuration.viewableObjects, this.actionTextList.objects.length) - 1;
        this.actionTextList.scrollDown();
    }
    
    if(this.idSelectedAction >= this.actionTextList.objects.length) {
        
        this.idSelectedAction = this.actionTextList.objects.length - 1;
    }
    
};

actionDisplay.prototype.selectPrevious = function() {
    
    this.idActionToHighlight -= 1;
    this.idSelectedAction -= 1;
    
    if(this.idActionToHighlight < 0) {
        
        this.idActionToHighlight = 0;
        this.actionTextList.scrollUp();
    }
    
    if(this.idSelectedAction < 0) {
        
        this.idSelectedAction = 0;
    }
};

actionDisplay.prototype.getSelectedActionConfiguration = function() {
    
    if(this.idSelectedAction >= this.actionTextList.objects.length) {
        
        return "";
    }
    
    return this.actionTextList.objects[this.idSelectedAction].configuration;
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