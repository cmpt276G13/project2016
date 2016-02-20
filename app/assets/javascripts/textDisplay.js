//global text styles that can be used throughout the game
var messageStyle = {
    
    fill: 'white',
    fontSize: 21
}

var healthBarCaptionStyle = {
    
    fill: 'white',
    fontSize: 18,
    fontStyle: 'italic'
}

var actionStyle = {
    
    fill: 'white',
    fontSize: 21
}

var damageStyle = {
    
    fill: 'red',
    fontSize: 20,
    stroke: 'white',
    strokeThickness: 4
}

//creates an attribute display text
//it looks like the following:
//'attributeName' 'some number of spaces' 'attributeValue'
//it creates a text display that shows the value of an attribute
//x, y are the top left position of the text
//width, height is the size of the region where the text is displayed
//width/height is used to align the attribute name to the left, and attribute value to the right
//attributName is a string, attributeValue is a string
//textStyle is the style you want to use on the text
//you can use one of the global styles listed above
function attributeDisplayText(attributeName, attributeValue, x, y, width, height, textStyle) {
    
    this.name = game.add.text(x, y, attributeName, textStyle);
    this.value = game.add.text(x + width, y, attributeValue, textStyle);
    
    //position the value text relative to its top right corner
    this.value.anchor.setTo(1, 0);
}

attributeDisplayText.prototype.addParent = function(parent) {
    
    parent.addChild(this.name);
    parent.addChild(this.value);
}

//object that stores attribute text and displays them as a table with the specified number of columns

//x,y are the top left position of the table
//cellWidth and cellHeight are the dimensions of each attribute display text
//columnSpacing is the horizontal gap between each cel
//rowSpacing is the vertical gap between each cel
function attributeDisplayTextTable(x, y, cellWidth, cellHeight, columnSpacing, rowSpacing) {
    
    this.x = x;
    this.y = y;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.columnSpacing = columnSpacing;
    this.rowSpacing = rowSpacing;
    
    this.columns = {};
}

//add the given attributeText to the given column
//column name is the name of the column to add the attribute to
//attributeName is name of the attribute you want to add, value is the value
//textStyle is the style to apply to the given attribute
//it will automatically position the attribute in the table
attributeDisplayTextTable.prototype.addAttribute = function(columnName, attributeName, attributeValue, textStyle) {
    
    //create the column as an array of attributes, if the array hasn't been initialized yet
    if(typeof this.columns[columnName] === "undefined") {
        
        this.columns[columnName] = [];
    }
    
    //you need to find the id of this column, that is, is this the first column, the second column, third...
    var columnId = 0;
    for(column in this.columns) {
        
        if(column == columnName) {
            
            break;
        }
        
        columnId += 1;
    }
    
    var xPos = this.x + columnId * (this.cellWidth + this.columnSpacing);
    //add this to the bottom of the column
    var yPos = this.y + this.columns[columnName].length * (this.cellHeight + this.rowSpacing);
    
    var attribute = new attributeDisplayText(attributeName, attributeValue, xPos, yPos, this.cellWidth, this.cellHeight, textStyle);
    this.columns[columnName].push(attribute);
}

//set the parent of all the action display texts
attributeDisplayTextTable.prototype.addParent = function(parent) {
    
    for(column in this.columns) {
        
        for(var i = 0; i < this.columns[column].length; ++i) {
            
            this.columns[column][i].addParent(parent);
        }
    }
}

//displays a column of text
//its like a single column of the attributedisplayTextTable, but its all text and not attributes
//x, y is the position to begin displaying the lisst of texts, each added text will be displayed underneath the one added before it
//cellWidth is the width of the region each text is displayed
//cellHeight is the height of the region each text is displayed
//text style is the style to apply to each text
function textList(x, y, cellWidth, cellHeight, textStyle) {
    
    //parent object so its easy to set the parent of new text objects
    this.parentGraphics = 
    this.x = x;
    this.y = y;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.textStyle = textStyle;
    
    //array of phaser texts to display
    this.texts = [];
};

//add the given array of texts to the list
//each item in texts should be a string
textList.prototype.addTexts = function(texts) {
    
    for(var i = 0; i < texts.length; ++i) {

        this.addText(texts[i]);
    }
}

//add the given text to the list
textList.prototype.addText = function(text) {
    
    var xPos = this.x;
    var yPos = this.y + this.texts.length * this.cellHeight;
    
    var newText = game.add.text(xPos, yPos, text, this.textStyle);
    
    this.texts.push(newText);
}

//add given object as parent to all texts
//function must be called everytime you add a new text, for now
textList.prototype.addParent = function(parent) {
    
    for(var i = 0; i < this.texts.length; ++i) {
        
        parent.addChild(this.texts[i]);
    }
}