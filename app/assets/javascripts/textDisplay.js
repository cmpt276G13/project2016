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