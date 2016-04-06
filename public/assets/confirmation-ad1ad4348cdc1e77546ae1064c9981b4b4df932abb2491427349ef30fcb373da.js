//asks the player a questions and allows him to respond with yes or no
function confirmation(config) {
    
    this.configuration = this.mergeConfigWithDefault(config);
    
    //create textbox to display message
    this.configuration.fixedHeight = true;
    this.messageBox = new textBox(this.configuration);
    this.messageBox.setText(this.configuration.message);
    
    //create yes/no question box
    var selectionBoxConfig = {
        
        x: this.configuration.x + this.configuration.width - 75,
        y: this.configuration.y - this.configuration.yesNoBoxHeight,
        width: 75,
        height: this.configuration.yesNoBoxHeight,
        cellHeight: this.configuration.yesNoBoxCellHeight,
        viewableObjects: 2
    };
    
    this.selectionBox = new actionDisplay(selectionBoxConfig, [{text: "Yes"}, {text: "No"}]);
    this.selectionBox.highlightSelectedAction();
}

confirmation.prototype.mergeConfigWithDefault = function(configuration) {
    
    var config = {
        
        x: 0, //position of box that displays the question to the player
        y: game.scale.height - 100,
        width: game.scale.width,//width/height of box that displays question
        height: 100,
        yesNoBoxHeight: 60,//height of box that displays yes/no to player
        yesNoBoxCellHeight: 25,
        message: "Select yes or no." //message to display to player
    }
    
    $.extend(config, configuration);
    
    return config;
}

//returns the option selected if user presses enter
confirmation.prototype.onKeyDown = function(key) {
    
    actionDisplayKeyDown(key, this.selectionBox, true);
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        return this.selectionBox.getSelectedActionConfiguration().text;
    }
    
    return "";
}

confirmation.prototype.highlightSelectedAction = function() {
    
    this.selectionBox.highlightSelectedAction();
}

confirmation.prototype.destroy = function() {
    
    this.messageBox.background.destroy(true);
    this.selectionBox.background.destroy(true);
}
