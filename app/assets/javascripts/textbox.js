//creates a text box at the given position
//this is just the background that text will be displayed on
function createTextboxBackground(x, y, width, height, centerToPoint) {
    
    var lineThickness = 3;
    
    //textbox positioning is affected by line thickness
    //the left, boddom, and right edges are misaligned
    var posX = x + lineThickness / 2;
    var posY = y;
    
    width -= lineThickness;
    height -= lineThickness;
    
    if(centerToPoint) {
        
        posX -= width / 2;
        posY -= height / 2;
    }
    
    var box = game.add.graphics(posX, posY);
    
    //first create the colored rectangle
    var fillColor = 0x000099;
    box.beginFill(fillColor, 0.7);
    
    //now create a border around it to make it look nice
    var lineColor = 0x888888;
    var boxRadius = lineThickness * 4;
    
    box.lineStyle(lineThickness, lineColor, 0.8);
    box.moveTo(boxRadius, 0);
    box.lineTo(width - boxRadius, 0);
    box.quadraticCurveTo(width, 0, width, boxRadius);
    box.lineTo(width, height - boxRadius);
    box.quadraticCurveTo(width, height, width - boxRadius, height);
    box.lineTo(boxRadius, height);
    box.quadraticCurveTo(0, height, 0, height - boxRadius);
    box.lineTo(0, boxRadius);
    box.quadraticCurveTo(0, 0, boxRadius, 0);
    box.endFill();
    
    return box;
};

//object that draws a text box onto the screen, and allows you to set the text that is displayed
//width is set by config
//heigh is automatically calculated
function textBox(config) {
    
    this.configuration = this.mergeConfigWithDefault(config);
    
    //text box background
    this.background = createTextboxBackground(this.configuration.x, this.configuration.y, this.configuration.width, this.configuration.height, this.configuration.centerToPoint);
    this.background.fixedToCamera = true;
    
    //text to display
    this.text = game.add.text(3, 3, "", messageStyle);
    this.background.addChild(this.text);
    
    //determine position of text
    if(this.configuration.horizontalAlign == "center") {
        
        this.text.x = this.background.width / 2;
        this.text.anchor.x = 0.5;
    }
    
    if(this.configuration.verticalAlign == "center") {
        
        this.text.y = this.background.height / 2;
        this.text.anchor.y = 0.5;
    }
};

textBox.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        centerToPoint: false,//whether the textbox should be centered to the given point
        horizontalAlign: "left", //one of left|center|right, aligns the text within the text box
        verticalAlign: "top" //one of top|center|bottom
    }
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

textBox.prototype.setText = function(newText) {
    
    this.text.text = newText;
};

textBox.prototype.show = function() {
    
    this.background.visible = true;
};

textBox.prototype.hide = function() {
    
    this.background.visible = false;
};