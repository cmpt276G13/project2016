//creates a text box at the given position
//this is just the background that text will be displayed on
function createTextboxBackground(x, y, width, height, centerToPoint) {
    
    var lineThickness = 3;
    
    var posX = x + lineThickness * 3;
    width -= lineThickness * 6;
    
    var posY = y - lineThickness * 3;
    
    if(centerToPoint) {
        
        posX -= width / 2;
        posY -= height / 2;
    }
    
    var box = game.add.graphics(posX, posY);
    
    //first create the colored rectangle
    var fillColor = 0x000099;
    box.moveTo(0, 0);
    box.beginFill(fillColor, 0.4);
    
    //now create a border around it to make it look nice
    var lineColor = 0x888888;
    
    box.lineStyle(lineThickness, lineColor, 0.8);
    box.x = posX + lineThickness / 2;
    box.quadraticCurveTo(width / 2, -lineThickness * 5, width - lineThickness, 0);
    box.quadraticCurveTo(width + lineThickness * 5, height / 2, width - lineThickness, height - lineThickness);
    box.quadraticCurveTo(width / 2, height + lineThickness * 5, 0, height - lineThickness);
    box.quadraticCurveTo(-lineThickness * 5, height / 2, 0, 0);
    box.endFill();
    
    return box;
};

//object that draws a text box onto the screen, and allows you to set the text that is displayed
//if centerToPoint is true, then x, y represents the center point of the textbox
function textBox(x, y, width, height, centerToPoint) {
    
    //text box background
    this.background = createTextboxBackground(x, y, width, height, centerToPoint);
    this.background.fixedToCamera = true;
    
    //text to display
    this.text = game.add.text(0, 0, "Message");
    this.text.x = this.background.width / 2;
    this.text.y = this.background.height / 2;
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.5;
    this.text.fill = 'white';
    
    this.background.addChild(this.text);
};

textBox.prototype.setText = function(newText) {
    
    this.text.text = newText;
};

textBox.prototype.show = function() {
    
    this.background.visible = true;
};

textBox.prototype.hide = function() {
    
    this.background.visible = false;
};