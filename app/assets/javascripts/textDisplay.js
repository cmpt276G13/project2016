//global text styles that can be used throughout the game
var messageStyle = {
    
    fill: 'white',
    fontSize: 21
}

var healthBarCaptionStyle = {
    
    fill: 'white',
    fontSize: 15,
    fontStyle: 'italic'
}

var statDisplayStyle = {
    
    fill: 'white',
    fontSize: 20
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
//see mergeConfigWithDefault for possible data that can be provided in the configuration
function attributeDisplayText(configuration) {
    
    this.config = this.mergeConfigWithDefault(configuration);
    
    this.parentGraphics = game.add.graphics(this.config.x, this.config.y);
    
    this.name = game.add.text(0, 0, this.config.attributeName, this.config.textStyle);
    this.value = game.add.text(this.config.width, 0, this.config.attributeValue, this.config.textStyle);
    
    this.parentGraphics.addChild(this.name);
    this.parentGraphics.addChild(this.value);
    
    //position the value text relative to its top right corner
    this.value.anchor.setTo(1.0, 0);
}

attributeDisplayText.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        attributeName: "",
        attributeValue: "",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        textStyle: {}
    }
    
    $.extend(defaultConfig, configuration);
    
    return defaultConfig;
}

attributeDisplayText.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

//displays a column of text
//its like a single column of the attributedisplayTextTable, but its all text and not attributes
//x, y is the position to begin displaying the lisst of texts, each added text will be displayed underneath the one added before it
//cellWidth is the width of the region each text is displayed
//cellHeight is the height of the region each text is displayed
function attributeDisplayTextList(x, y, cellWidth, cellHeight) {
    
    //parent object so its easy to set the parent of new text objects
    this.parentGraphics = game.add.graphics(x, y);
    this.x = x;
    this.y = y;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    
    //array of phaser texts to display
    this.texts = [];
};

//add the given array of texts to the list
//each item in texts should be a string
//text style is the style to apply to each text
attributeDisplayTextList.prototype.addTexts = function(texts, textStyle) {
    
    for(var i = 0; i < texts.length; ++i) {

        this.addText(texts[i], textStyle);
    }
}

//add the given text to the list
//text style is the style to apply to the text
attributeDisplayTextList.prototype.addText = function(text, textStyle) {
    
    var xPos = this.x;
    var yPos = this.y + this.texts.length * this.cellHeight;
    
    var newText = game.add.text(xPos, yPos, text, textStyle);
    this.parentGraphics.addChild(newText);
    
    this.texts.push(newText);
}

//add given object as parent to all texts
//function must be called everytime you add a new text, for now
attributeDisplayTextList.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

//object that stores attribute text and displays them as a table with the specified number of columns

//x,y are the top left position of the table
//cellWidth and cellHeight are the dimensions of each attribute display text
//columnSpacing is the horizontal gap between each cel
//rowSpacing is the vertical gap between each cel
function attributeDisplayTextTable(x, y, cellWidth, cellHeight, columnSpacing, rowSpacing) {
    
    this.parentGraphics = game.add.graphics(x, y);
    // this.x = x;
    // this.y = y;
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
    
    var xPos = columnId * (this.cellWidth + this.columnSpacing);
    //add this to the bottom of the column
    var yPos = this.columns[columnName].length * (this.cellHeight + this.rowSpacing);
    
    var attribute = new attributeDisplayText(attributeName, attributeValue, xPos, yPos, this.cellWidth, this.cellHeight, textStyle);
    attribute.addParent(this.parentGraphics);
    this.columns[columnName].push(attribute);
}

//set the parent of all the action display texts
attributeDisplayTextTable.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

//wrapper for phaser texts
//used so texts and attributes can be created using a common interface
function text(configuration) {
    
    this.config = this.mergeConfigWithDefault(configuration);
    
    this.text = game.add.text(this.configuration.x, this.configuration.y, this.configuration.text, this.configuration.textStyle);
}

text.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        text: "",
        x: 0,
        y: 0,
        textStyle: {}
    }
    
    $.extend(defaultConfig, configuration);
    
    return defaultConfig;
}

text.prototype.addParent = function(parent) {
    
    parent.addChild(this.text);
}

//displays a column of text
//its like a single column of the attributedisplayTextTable, but its all text and not attributes
//x, y is the position to begin displaying the lisst of texts, each added text will be displayed underneath the one added before it
//cellWidth is the width of the region each text is displayed
//cellHeight is the height of the region each text is displayed
function textList(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    
    //parent object so its easy to set the parent of new text objects
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    
    //array of phaser texts to display
    this.texts = [];
};

textList.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0,
        textCreationFunction: {}
    };
    
    $.extend(defaultConfig, configuration);
    
    return defaultConfig;
}

//use the given configurations to create texts 
textList.prototype.addTexts = function(textConfigs) {
    
    for(var i = 0; i < texts.length; ++i) {

        this.addText(texts[i], textStyle);
    }
}

//add the given text to the list
textList.prototype.addText = function(textConfig) {
    
    var xPos = this.configuration.x;
    var yPos = this.configuration.y + this.texts.length * this.configuration.cellHeight;
    
    textConfig.x = xPos;
    textConfig.y = yPos;
    textConfig.cellWidth = this.configuration.cellWidth;
    textConfig.cellHeight = this.configuration.cellHeight;
    
    var newText = new this.configuration.textCreationFunction(textConfig);
    newText.addParent(this.parentGraphics);
    
    this.texts.push(newText);
}

//add given object as parent to all texts
//function must be called everytime you add a new text, for now
textList.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

//a table of text, like the table of attribute texts, but with normal texts instead
//usefull for displaying skills, items, inventory, and other stuff that aren't attributes
//internally it'll use an array of text lists
//x ,y is the position of the tbale
//cellwidth and cell height is the size of each cell in the table
//textStyle is the style to applpy to each text
function textTable(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    
    this.columns = {};
}

textTable.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0,
        textCreationFunction: {}
    }
    
    $.extend(defaultConfig, configuration);
    return defaultConfig;
}

//add the given text to the given column
//column name is the name of the column to add the text to
//text is the text to add
//textStyle is the style to apply to the given attribute
//it will automatically position the text in the table
textTable.prototype.addText = function(columnName, textConfig) {
    
    //create the column as a text list, if the list hasn't been initialized yet
    if(typeof this.columns[columnName] === "undefined") {
        
        this.createColumn(columnName);
    }
    
    this.columns[columnName].addText(textConfig);
}

//texts should to an array of strings
textTable.prototype.addTexts = function(columnName, textConfigs) {
    
    //create the column as a text list, if the list hasn't been initialized yet
    if(typeof this.columns[columnName] === "undefined") {
        
        this.createColumn(columnName);
    }
    
    this.columns[columnName].addTexts(textConfigs);
}

textTable.prototype.createColumn = function(columnName) {
    
    //count number of columns the table has
    var columns = 0;
    
    for(column in this.columns) {
        
        columns += 1;
    }
    
    var columnX = this.configuration.cellWidth * columns;
    var columnY = 0;
    
    var config = this.configuration;
    config.x = columnX;
    config.y = columnY;
    
    this.columns[columnName] = new textList(config);
    this.columns[columnName].addParent(this.parentGraphics);
}

//set the parent of all the action display texts
textTable.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}
