//object that covers the whole screen with a coloured rectangle
//usefull for transition effects
//color is the hexa decimal colour to fill the screen with
//DO NOT CREATE AN INSTANCE OF THIS OBJECT UNTIL YOU WANT TO COVER THE SCREEN
//when this is created, phaser will draw it ontop of the entire screen, so make sure it is created last
function cover(color) {
    
    this.graphics = game.add.graphics(0, 0);
    this.graphics.beginFill(color);
    this.blackCover.graphics.drawRect(0, 0, game.scale.width, game.scale.height);
    this.blackCover.graphics.endFill();
};

//effect that makes the screen slowly fade to black
//duration specifies how long the fade should last, in milliseconds
function fadeToBlack(duration) {
    
    this.cover = new cover(0x000000);
    this.cover.graphics.alpha = 0;
    
    this.tween = game.add.tween(this.cover.graphics);
    this.tween.to({alpha: 1}, duration);
};

//set a function to call when the fade effect finishes
//you can give a function and a context to call the function in
fadeToBlack.prototype.setOnExit(func, context) {
    
    this.tween.onComplete.add(func, context);
}

//begin the fade
fadeToBlack.prototype.start() {
    
    this.tween.start();
}