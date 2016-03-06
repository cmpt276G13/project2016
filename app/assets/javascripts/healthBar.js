/**
 Copyright (c) 2015 Belahcen Marwane (b.marwane@gmail.com)
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var HealthBar = function(providedConfig) {
    this.game = game;

    this.setupConfiguration(providedConfig);
    this.setPosition(this.config.x, this.config.y);
    this.drawBackground();
    this.drawHealthBar();
    this.setFixedToCamera(this.config.isFixedToCamera);
};
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.setupConfiguration = function (providedConfig) {
    this.config = this.mergeWithDefaultConfiguration(providedConfig);
    this.flipped = this.config.flipped;
};

//Added rectnagle radius property that defines how 'curved' the rectangle corners will be
//config can now accept radius as a parameter
//also defines a 'MaxHealth' parameter
//originally the health bar required setting a percentage value
//but that's annoying so i added maxHealth so you can set the health value directly
//note that the healthbar will never exceed its max value
//you must define a new max value if you want to change an entity's max health
HealthBar.prototype.mergeWithDefaultConfiguration = function(newConfig) {
    var defaultConfig= {
        width: 145,
        cellWidth: 145,
        height: 11,
        cellHeight: 11,
        radius: 6,//defines how curved the bar is
        maxHealth: 100,
        x: 0,
        y: 0,
        bg: {
            color: '#651828',
            gradientStart: 'white',
            gradientEnd: 'black',
            applyGradient: false
        },
        bar: {
            color: '#FEFF03',
            applyGradient: true,
            gradientStart: '#00ff00',
            gradientEnd: '#7af5f5'
        },
    
        animationDuration: 400,
        flipped: false,
        isFixedToCamera: false
    };
    
    //cellWidth overwrites width if width is not given, or width is bigger than cellwidth
    if(typeof newConfig !== "undefined" && typeof newConfig.cellWidth !== "undefined") {
        
        if(typeof newConfig.width === "undefined") {
            
            defaultConfig.width = newConfig.cellWidth;
            
        } else {
            
            defaultConfig.width = Math.min(newConfig.width, newConfig.cellWidth);
        }
    }
    
    return mergeObjects(defaultConfig, newConfig);
};

function mergeObjects(targetObj, newObj) {
    for (var p in newObj) {
        try {
            targetObj[p] = newObj[p].constructor==Object ? mergeObjects(targetObj[p], newObj[p]) : newObj[p];
        } catch(e) {
            targetObj[p] = newObj[p];
        }
    }
    return targetObj;
}

//Draw background and draw healtbar originally drew straight edged rectangles
//this has been changed to draw rounded edge rectnagles
//function to draw rounded edge is defined at the bottom of this page
HealthBar.prototype.drawBackground = function() {
    
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    
    if(this.config.bg.applyGradient) {
        
        //gradient effect, doesn't incorporate flipped
        var grd = bmd.ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
        
        grd.addColorStop(0, this.config.bg.gradientStart);
        grd.addColorStop(1, this.config.bg.gradientEnd);
        bmd.ctx.fillStyle = grd;
        
    } else {
        
        bmd.ctx.fillStyle = this.config.bg.color;
    }
    
    bmd.ctx.beginPath();
    drawRoundedRectangle(bmd.ctx, this.config);
    bmd.ctx.fill();

    this.bgSprite = this.game.add.sprite(this.x, this.y, bmd);
    //this.bgSprite.anchor.set(0.5);

    if(this.flipped){
        this.bgSprite.scale.x = -1;
    }
};

//changed
HealthBar.prototype.drawHealthBar = function() {
    
    var bmd = this.game.add.bitmapData(this.config.width, this.config.height);
    
    if(this.config.bar.applyGradient) {
        
        //gradient effect, doesn't incorporate flipped
        var grd = bmd.ctx.createLinearGradient(0, 0, this.config.width, this.config.height);
        
        grd.addColorStop(0, this.config.bar.gradientStart);
        grd.addColorStop(1, this.config.bar.gradientEnd);
        bmd.ctx.fillStyle = grd;
        
    } else {
        
        bmd.ctx.fillStyle = this.config.bar.color;
    }
    
    
    bmd.ctx.beginPath();
    drawRoundedRectangle(bmd.ctx, this.config);
    bmd.ctx.fill();

    this.barSprite = this.game.add.sprite(this.x /*- this.bgSprite.width/2*/, this.y, bmd);
    //this.barSprite.anchor.y = 0.5;

    if(this.flipped){
        this.barSprite.scale.x = -1;
    }
};

HealthBar.prototype.setPosition = function (x, y) {
    this.x = x;
    this.y = y;

    if(this.bgSprite !== undefined && this.barSprite !== undefined){
        this.bgSprite.position.x = x;
        this.bgSprite.position.y = y;

        this.barSprite.position.x = x - this.config.width/2;
        this.barSprite.position.y = y;
    }
};

//sets the new current health value
//new function
HealthBar.prototype.setValue = function(newValue) {
    
    var percentHealth = newValue / this.config.maxHealth;
    this.setPercent(percentHealth * 100);
};

//sets the new current health value
//health bar won't animate to the given value, instead it will forcibly be set to it
//new function
HealthBar.prototype.setValueNoTransition = function(newValue) {
    
    var percentHealth = newValue / this.config.maxHealth;
    this.setPercentNoTransition(percentHealth * 100);
};

//set the new max health
//if setCurrentToMax is true, it will set the current health value to the new max
HealthBar.prototype.setMax = function(newMax, setCurrentToMax) {
    
    this.config.maxHealth = newMax;
    
    if(setCurrentToMax) {
        
        this.setPercent(100);
    }
}

//sets the health value to the given percent
HealthBar.prototype.setPercent = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;

    this.setWidth(newWidth);
};

//sets health value to the given percent
//does not animate the health bar
HealthBar.prototype.setPercentNoTransition = function(newValue){
    if(newValue < 0) newValue = 0;
    if(newValue > 100) newValue = 100;

    var newWidth =  (newValue * this.config.width) / 100;
    
    this.setWidthNoTransition(newWidth);
};

HealthBar.prototype.setWidth = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setWidthNoTransition = function(newWidth){
    if(this.flipped) {
        newWidth = -1 * newWidth;
    }
    this.barSprite.width = newWidth;
    //this.game.add.tween(this.barSprite).to( { width: newWidth }, this.config.animationDuration, Phaser.Easing.Linear.None, true);
};

HealthBar.prototype.setFixedToCamera = function(fixedToCamera) {
    this.bgSprite.fixedToCamera = fixedToCamera;
    this.barSprite.fixedToCamera = fixedToCamera;
};

//allow adding healthbar as a child to something else
//parent is a phaser graphics object capable of having a child
HealthBar.prototype.addParent = function(parent) {
    
    parent.addChild(this.bgSprite);
    parent.addChild(this.barSprite);
};

//uses the given canvasContext to draw a rounded rectangle to the canvas
//healthbarConfig is needed to get width, height, radius, etc
//call this function AFTER CALLING BEGIN PATH ON THE CANVAS CONTEXT
function drawRoundedRectangle(canvasContext, healthBarConfig) {
    
    canvasContext.moveTo(healthBarConfig.radius, 0);
    canvasContext.lineTo(healthBarConfig.width - healthBarConfig.radius, 0);
    canvasContext.quadraticCurveTo(healthBarConfig.width, 0, healthBarConfig.width, healthBarConfig.radius);
    canvasContext.lineTo(healthBarConfig.width, healthBarConfig.height - healthBarConfig.radius);
    canvasContext.quadraticCurveTo(healthBarConfig.width, healthBarConfig.height, healthBarConfig.width - healthBarConfig.radius, healthBarConfig.height);
    canvasContext.lineTo(healthBarConfig.radius, healthBarConfig.height);
    canvasContext.quadraticCurveTo(0, healthBarConfig.height, 0, healthBarConfig.height - healthBarConfig.radius);
    canvasContext.lineTo(0, healthBarConfig.radius);
    canvasContext.quadraticCurveTo(0, 0, healthBarConfig.radius, 0);
};