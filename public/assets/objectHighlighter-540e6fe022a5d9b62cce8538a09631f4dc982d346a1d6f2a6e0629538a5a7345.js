//object that handles Phaser sprite highlighting
//it takes a list of phaser objects, and draws a border around a subset of objects in that list
//it then keeps a list of highlights, and can clear them and recreate them as needed
function objectHighlighter() {
    
    //each object will in the array has two properties
    //the first property is the object that will be highlighted
    //the second property is the phaser graphics object that does the highlighting
    //ex: highlights[0] = {object: someOrc, graphics: someGraphicsObject}
    this.highlights = [];
};

//takes the given PHASER GRAPHICS OBJECT and highlights it
//this object must be a phaser object that has the variables, x, y, width, and height
//and supports the function addchild()
objectHighlighter.prototype.addHighlight = function(objectToHighlight) {
    
    var highlightedObject = {};
    highlightedObject.object = objectToHighlight;
    
    //create the graphics object
    highlightedObject.graphics = game.add.graphics(0, 0);
    highlightedObject.object.addChild(highlightedObject.graphics);
    
    //style the highlight
    highlightedObject.graphics.lineStyle(2, 0xff0000, 1);
    
    //draw the highlight
    var width = objectToHighlight.width;
    var height = objectToHighlight.height;
    highlightedObject.graphics.drawRect(0, 0, width, height);
    
    this.highlights.push(highlightedObject);
};

objectHighlighter.prototype.clearHighlights = function() {
    
    for(var i = 0; i < this.highlights.length; ++i) {
        
        this.highlights[i].graphics.destroy();
    }
    
    this.highlights = [];
};

objectHighlighter.prototype.showHighlights = function() {
    
    for(var i = 0; i < this.highlights.length; ++i) {
        
        this.highlights[i].graphics.visible = true;
    }
};

objectHighlighter.prototype.hideHighlights = function() {
    
    for(var i = 0; i < this.highlights.length; ++i) {
        
        this.highlights[i].graphics.visible = false;
    }
};
