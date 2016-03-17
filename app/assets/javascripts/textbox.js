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
    box.beginFill(fillColor, 1);
    
    //now create a border around it to make it look nice
    var lineColor = 0xffffff;
    var boxRadius = lineThickness * 1.5;
    
    box.lineStyle(lineThickness, lineColor, 1);
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


//takes the given string and adds new lines to break the string into multiple lines, so that it will fit the given text width limit
function breakStringToFitWidthLimit(string, widthLimit) {
    
    //estimate how many letters can fit into a line
    var characterWidthInPixels = 8;
    var maxCharacterCountInLine = Math.floor(widthLimit / characterWidthInPixels);
    var averageCharacterCountInWord = 7;
    var minCharacterCountInLine = maxCharacterCountInLine - averageCharacterCountInWord;
    
    //add a new line everytime you pass word limit
    var charactersInCurrentLine = 0;
    
    for(var i = 0; i < string.length; ++i) {
        
        charactersInCurrentLine++;
        
        if(string.charAt(i) == "\n") {
            
            charactersInCurrentLine = 0;
        }
        
        if(string.charAt(i) != " ") {
            
            //not a word seperator, skip
            continue;
        }
        
        //word seperator, if we've reached enough words for this line, then start a new line
        if(charactersInCurrentLine >= minCharacterCountInLine) {
            
            //can't fit any more words onto this line, add a line break and start with next line
            string = string.substr(0, i) + '\n' + string.substr(i + 1);
            charactersInCurrentLine = 0;
        }
    }
    
    return string;
}

//object that draws a text box onto the screen, and allows you to set the text that is displayed
//width is set by config
//heigh is automatically calculated
//text box can display multiple 'pages' of text
//basically you can store multiple liens of text, and callign the showNextPage function will replace the current text with the next page of text
function textBox(config) {
    
    this.configuration = this.mergeConfigWithDefault(config);
    
    //text box background, set default height for now
    this.createNewBackground(this.configuration.height);
    
    //text to display, store as a scrollable object list so that multiple pages of text can be displayed
    this.textList = new scrollableObjectList({cellWidth: this.configuration.width, cellHeight: this.configuration.height, objectCreationFunction: text});
    this.textList.addParent(this.background);
    
    //this.alignText();
};

textBox.prototype.createNewBackground = function(height) {
    
    if(typeof this.background !== "undefined") {
        
        this.background.destroy(false);
    }
    
    this.background = createTextboxBackground(this.configuration.x, this.configuration.y, this.configuration.width, height, this.configuration.centerToPoint);
    this.background.fixedToCamera = true;
    
    //since hte background was reset, you need to reset the scrollable text list to have a new mask
    //this means you have to recreate the whole thing because you can't chnage the size after its created
    if(typeof this.textList !== "undefined") {
        
        this.recreateTextList({cellWidth: this.configuration.width, cellHeight: height, objectCreationFunction: text});
        this.textList.addParent(this.background);
    }
}

textBox.prototype.recreateTextList = function(configuration) {
    
    //store all saved objects
    var objectConfigurations = [];
    
    for(var i = 0; i < this.textList.objects.length; ++i) {
        
        objectConfigurations.push(this.textList.objects[i].configuration );
    }
    
    this.textList.destroy();
    this.textList = new scrollableObjectList(configuration);
    this.textList.addObjects(objectConfigurations);
}

textBox.prototype.updateHeight = function(newHeight) {
    
    //determine heigth according to size of text
    //make it sligntly larger for extra stuff
    this.createNewBackground(newHeight);
}

textBox.prototype.alignText = function() {
    
    if(this.configuration.horizontalAlign == "left") {
        
        this.text.x = 0;
        this.text.anchor.x = 0;
    }
    
    if(this.configuration.horizontalAlign == "center") {
        
        this.text.x = this.background.width / 2;
        this.text.anchor.x = 0.5;
    }
    
    if(this.configuration.horizontalAlign == "right") {
        
        this.text.x = this.background.width;
        this.text.anchor.x = 1;
    }
    
    if(this.configuration.verticalAlign == "top") {
        
        this.text.y = 0;
        this.text.anchor.y = 0;
    }
    
    if(this.configuration.verticalAlign == "center") {
        
        this.text.y = this.background.height / 2;
        this.text.anchor.y = 0.5;
    }
    
    if(this.configuration.verticalAlign == "bottom") {
        
        this.text.y = this.background.height;
        this.text.anchor.y = 1;
    }
}

textBox.prototype.mergeConfigWithDefault = function(configuration) {
    
    var defaultConfig = {
        
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fixedHeight: false,//whether the textbox height will stay the same regardless of the text being displayed.
        centerToPoint: false,//whether the textbox should be centered to the given point
        horizontalAlign: "left", //one of left|center|right, aligns the text within the text box
        verticalAlign: "top" //one of top|center|bottom
    }
    
    mergeObjects(defaultConfig, configuration);
    
    return defaultConfig;
}

textBox.prototype.addText = function(newText) {
    
    newText = breakStringToFitWidthLimit(newText, this.configuration.width);
    this.textList.addObject({text: newText, textStyle: messageStyle});
}

textBox.prototype.setText = function(newText) {
    
    this.textList.clear();
    this.addText(newText);
    
    if(!this.configuration.fixedHeight) {
        
        this.updateHeight(this.textList.objects[0].text.height);
        //this.alignText();
    }
};

textBox.prototype.show = function() {
    
    this.background.visible = true;
};

textBox.prototype.hide = function() {
    
    this.background.visible = false;
};