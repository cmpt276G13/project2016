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
    this.value = game.add.text(this.config.cellWidth, 0, this.config.attributeValue, this.config.textStyle);
    
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
        cellWidth: 0,
        cellHeight: 0,
        textStyle: {}
    }
    
    $.extend(defaultConfig, configuration);
    
    return defaultConfig;
}

attributeDisplayText.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

//wrapper for phaser texts
//used so texts and attributes can be created using a common interface
function text(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    
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


function objectList(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    
    this.objects = [];
};

objectList.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0,
        objectCreationFunction: {}
    };
    
    $.extend(defaultConfig, configuration);
    
    return defaultConfig;
}

objectList.prototype.addObjects = function(objectConfigs) {
    
    for(var i = 0; i < objectConfigs.length; ++i) {

        this.addObject(objectConfigs[i]);
    }
}

objectList.prototype.addObject = function(objectConfig) {
    
    var xPos = 0;
    var yPos = this.objects.length * this.configuration.cellHeight;
    
    objectConfig.x = xPos;
    objectConfig.y = yPos;
    objectConfig.cellWidth = this.configuration.cellWidth;
    objectConfig.cellHeight = this.configuration.cellHeight;
    
    var newObject = new this.configuration.objectCreationFunction(objectConfig);
    newObject.addParent(this.parentGraphics);
    
    this.objects.push(newObject);
}

objectList.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

function objectTable(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    
    this.columns = {};
}

objectTable.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0,
        columnSpacing: 20,
        objectCreationFunction: {}
    }
    
    $.extend(defaultConfig, configuration);
    return defaultConfig;
}

objectTable.prototype.addObject = function(columnName, objectConfig) {
    
    if(typeof this.columns[columnName] === "undefined") {
        
        this.createColumn(columnName);
    }
    
    this.columns[columnName].addObject(objectConfig);
}

objectTable.prototype.addObjects = function(columnName, objectConfigs) {
    
    //create the column as a object list, if the list hasn't been initialized yet
    if(typeof this.columns[columnName] === "undefined") {
        
        this.createColumn(columnName);
    }
    
    this.columns[columnName].addObjects(objectConfigs);
}

objectTable.prototype.createColumn = function(columnName) {
    
    //count number of columns the table has
    var columns = 0;
    
    for(column in this.columns) {
        
        columns += 1;
    }
    
    var columnX = (this.configuration.cellWidth + this.configuration.columnSpacing) * columns;
    var columnY = 0;
    
    var config = this.configuration;
    config.x = columnX;
    config.y = columnY;
    
    this.columns[columnName] = new objectList(config);
    this.columns[columnName].addParent(this.parentGraphics);
}

objectTable.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}
