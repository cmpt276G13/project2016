//global text styles that can be used throughout the game
var messageStyle = {
    
    fill: 'white',
    fontSize: 18
}

var healthBarCaptionStyle = {
    
    fill: 'white',
    fontSize: 15,
    fontStyle: 'italic'
}

var statDisplayStyle = {
    
    fill: 'white',
    fontSize: 17
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

//attributeDisplayText displays an attribute along with its value, in teh following format:
//attributeName     attributeValue
//data in the configuration defines a rectangular cell where the attribute is displayed
//the name is positioned at the left edge, and the value is positioned at the right edge
function attributeDisplayText(configuration) {
    
    this.configuration = this.mergeConfigWithDefault(configuration);
    
    this.parentGraphics = game.add.graphics(this.configuration.x, this.configuration.y);
    
    this.name = game.add.text(0, 0, this.configuration.attributeName, this.configuration.textStyle);
    this.value = game.add.text(this.configuration.cellWidth, 0, this.configuration.attributeValue, this.configuration.textStyle);
    
    this.parentGraphics.addChild(this.name);
    this.parentGraphics.addChild(this.value);
    
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
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

attributeDisplayText.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

attributeDisplayText.prototype.destroy = function() {
    
    this.parentGraphics.destroy(true);
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
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

text.prototype.addParent = function(parent) {
    
    parent.addChild(this.text);
}

text.prototype.destroy = function() {
    
    this.parentGraphics.destroy(true);
}

//defines a list of objects that can be drawn onto the screen
//an object list can be viewed as a column in a table
//each cell in this table contains a single object
//newly added objects are appended to the bottom of the column
//in the configuration, the objectCreationFunction is an object constructor that is used to create new objects when the add object function is called
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
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

//objectConfigs must be an array of configurations
//each elemement of the array defiens a configuration for a new object
objectList.prototype.addObjects = function(objectConfigs) {
    
    for(var i = 0; i < objectConfigs.length; ++i) {

        this.addObject(objectConfigs[i]);
    }
}

//objectConfig must be a configuration
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

objectList.prototype.replaceObject = function(idObjectToReplace, configToReplaceWith) {
    
    if(idObjectToReplace >= this.objects.length) {
        
        return;
    }
    
    //remove objects that come after the replaced objects
    //remove the replaced object
    //add old objects back
    var objectsFollowingReplaced = this.objects.splice(idObjectToReplace + 1, this.objects.length);
    this.objects[idObjectToReplace].destroy();
    this.objects.pop();
    
    this.addObject(configToReplaceWith);
    this.objects = this.objects.concat(objectsFollowingReplaced);
}

objectList.prototype.addParent = function(parent) {
    
    parent.addChild(this.parentGraphics);
}

objectList.prototype.clear = function() {
    
    for(var i = 0; i < this.objects.length; ++i) {
        
        this.objects[i].destroy();
    }
    
    this.objects = [];
}

//object list that limits the number of viewable objects, and allows you to scroll through the objects
scrollableObjectList.prototype = Object.create(objectList.prototype);

//additional configuration, along with its parent's configurations
//viewableObjects: maximum number of objects that will be drawn at once
function scrollableObjectList(configuration) {
    
    objectList.call(this, configuration);
    
    //create a mask for the view region, so all obejcts outside this region will not be drawn
    this.createMask();
    
    this.parentGraphics.mask = this.mask;
}

scrollableObjectList.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        cellWidth: 0,
        cellHeight: 0,
        viewableObjects: 1,
        objectCreationFunction: {}
    };
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

scrollableObjectList.prototype.createMask = function() {
    
    this.mask = game.add.graphics(0, 0);
    
    var maskWidth = this.configuration.cellWidth;
    this.maskHeight = this.configuration.cellHeight * this.configuration.viewableObjects;
    
    this.mask.beginFill(0xffffff, 1);
    this.mask.drawRect(0, 0, maskWidth, this.maskHeight);
    this.mask.endFill();
    
    this.parentGraphics.addChild(this.mask);
}

scrollableObjectList.prototype.scrollDown = function() {
    
    //not enough objects to scroll
    if(this.objects.length <= this.configuration.viewableObjects) {
        
        return;
    }
    
    //prevent scrolling down beyond the last text
    if( this.mask.y + this.maskHeight >= this.objects.length * this.configuration.cellHeight) {
        
        return;
    }
    
    //move all the text up so it looks like it scrolled down
    //scroll down by 1 text
    this.parentGraphics.y -= this.configuration.cellHeight;
    
    //moving parent moves the mask up as well, so move the mask down
    this.mask.y += this.configuration.cellHeight;
    
}

scrollableObjectList.prototype.scrollUp = function() {
    
    //don't scroll up if you're already at the top
    if(this.mask.y <= 0) {
        
        return;
    }
    
    this.parentGraphics.y += this.configuration.cellHeight;
    this.mask.y -= this.configuration.cellHeight;
}

//a table of objects, each column in this table is an objectList
//this table behaves just like an objectList, except there are multiple named columns
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
    
    mergeObjects(defaultConfig, configuration);
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

//clears and removes all columns
objectTable.prototype.clear = function() {
    
    for(column in this.columns) {
        
        this.columns[column].clear();
    }
    
    this.columns = {};
}
