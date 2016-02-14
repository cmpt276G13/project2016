//creates a text box at the given position
//this is just the background that text will be displayed on
function createTextboxBackground(x, y, width, height) {
    
    var box = game.add.graphics(x, y);
    
    //first create the colored rectangle
    var fillColor = 0x000099;
    box.beginFill(fillColor, 0.4);
    box.drawRect(0, 0, width, height);
    box.endFill();
    
    //now create a border around it to make it look nice
    var lineThickness = 3;
    var lineColor = 0x888888;
    
    box.lineStyle(lineThickness, lineColor, 0.8);
    box.x = x + lineThickness / 2;
    box.lineTo(width - lineThickness, 0);
    box.lineTo(width - lineThickness, height - lineThickness);
    box.lineTo(0, height - lineThickness);
    box.lineTo(0, 0);
    
    return box;
};

//object that draws a text box onto the screen, and allows you to set the text that is displayed
//text will be centerd onto the given rectangular bounds
function textBox(x, y, width, height) {
    
    //text box background
    this.background = createTextboxBackground(x, y, width, height);
    this.background.fixedToCamera = true;
    
    //text to display
    this.text = game.add.text(0, 0, "Message");
    this.text.x = this.background.width / 2;
    this.text.y = this.background.height / 2;
    this.text.anchor.y = 0.5;
    this.text.anchor.x = 0.5;
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