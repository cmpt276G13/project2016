//the gameplay state
//this is where the player will move around on the map
//the technical term is overworld, so thats the name i will use for this state

/*
    We will use the same substate system that the battle state uses.
    Currently the overworld is very simple and has no substates.
    eventually we will need to add different substates, so when we do we wil implement the system like it's implemented in the battle state.

*/
var overworldState = {
    
    generateTilemap: function() {
        
        //we already loaded the tilemap data in the load state, we just need to set them to a phaser object
        this.map = game.add.tilemap('level');
        
        //we have loaded the tile data, but we haven't given it an image to use
        //here we set an image for each tileset in the tilemap (a tileset is an image containing all of the tiles for a given level)
        //every map has different tile sets, and each of these tilesets have their own names, the names are set using Tiled level editor,
        //and they can be viewd in the map.json file, under tilesets: name:
        //here we match the name of the tileset, to the name of a preloaded tileset image
        //since i named the tileset and the image the same thing, you won't be able to tell which name refers to what
        //the first argument is the name of the tileset that was set in the Tiled level editor
        //the second argument is the key to an image that was loaded by in the load state
        this.map.addTilesetImage('TileSet', 'tileset');
        
        //the tilemaps have been created, but they won't draw until we turn them into viewable layers
        //create a layer for EVERY SINGLE layer in the actual tile map
        //i created two tile layers, the background layer and the solid layer
        //background layer is just the background, the solid layer are tiles that the player collides with
        //its important to have them seperate
        //though its not required
        
        //backround layer
        //the argument to the createLayer function is the name of the layer set by the Tiled level editor
        //the data for this layer can be viewed in the levle editor, or you can look at the map.json file
        this.background = this.map.createLayer('Background');
        this.solid = this.map.createLayer('solid');
        
        //the default game world size is the same as the canvas size
        //however we want the plaeyr ot be able to move around the entire world
        //so we must set the size of the gameworld to the size of the tilemap, that way the game world isn't too big or small
        this.background.resizeWorld();
        
        //phaser doesn't actually know anything about tile layers and collision, it just creates drawable tiles
        //now we need to specify that the tiles in the solid layer should actually collide with stuff
        //the first two arguments give a range of tile IDs that you want to set collision info to
        //the third argument sets whether or not the tile should collide
        //the last argument is the layer that you want to get tiles from
        this.map.setCollisionBetween(1, 10000, true, 'solid');
    },
    
    create: function() {
        
        //misc instructions, ignore
        document.getElementById("additional").innerHTML = "Use the arrow keys to move the player. Press Enter to enter battle";
		
        //Phaser draws objects in the order they are created (all applications have a rendering order, this is jsut phaser's order)
        //this means that objects created first will be drawn underneath objects created last
        //so we need to create background objects first
        
        //first we will create the tile map
        this.generateTilemap();
        
        //now we create the player
        //we already created a player sprite, but we told phaser not to draw him
        //we need to add him back to the game world for drawing
        game.add.existing(player.sprite);
        
        //we also want he camera to follow the player
        game.camera.follow(player.sprite);
        
        //this function makes phaser use arrow keys for movement
        //it creates a collection of keys that you can poll for events (look at update function for polling code)
        //polling a key means you check if a key is pressed, or released
        this.cursors = game.input.keyboard.createCursorKeys();
        player.cursors = this.cursors;
        player.x = 0;
        
        //make phaser use a call back listener
        //listener functions are functions that are called whenever a certain action happens
        //here we want phaser to call a special function everytime a key is pressed down
        //first argument is the context where the call back functiosn are run
        //basically its what the name of the object that the 'this' variable in the listener function refers to
        //second argument is the function to call when a key is pressed
        //there are two more arguments that i haven't used yet
        game.input.keyboard.addCallbacks(this, this.handleKeyDown);
    },
    
    //update function is where the game world is updated
    //here we need to handle input, update physics, and handle collision
    //phaser does the physics and collision for us, we jst need to specify what collides
    update: function() {
        
        //NORMALLY we do input handling before all physics and collision
        //but phaser saves some data in the collision handling that we sometimes need in the input handling
        //so when working with phaser, we will do collision handling first
        
        //this funciton tells phaser to collide two objects, or two groups of objects
        //i haven't created a group of objects explicitly, but the tile map layer is a group of objects generated by phaser
        //this is why we need a seperate layer for background and solid, i only want my player to collide with fenses or houses
        //not the grass
        game.physics.arcade.collide(player.sprite, this.solid);
        
        //next handle all the game's inputs
        //start with keystate inputs, explained in the keystate function
        //we don't have to worry about button press events since we created listener for those events
        //but we can't create a listener for state events
        this.handleStateInputs();
        
        //now we want to see if the player randomly encountered an monster, this will send us to the battle state
        //we only want to check if player encounterd an monster if he moved
        //for now its commentd out since I didn't create the battle state
        //basically if hte player travels a certain distance, we check if he should battle an monster
        /*if(player.sprite.body.deltaABSX() >= THRESHOLD || player.sprite.body.deltaABSY() >= THRESHOLD) {
            
            game.state.start('battle');
        }*/
    },
    
    handleStateInputs: function() {
        
        //input handling for player is done in this function
        //it might seem weird to have a function that jus calls another function
        //but this is a good way to organize your code for each section of the game.
        //we need to have a seperate section for input handling, so this function will contain all the code for input handling
        //but input handling can be broken down into different components, so each component will have its own input handling function
        this.handlePlayerKeystates();
        
        //after we can handle other key states, if there are any
    },
    
    handlePlayerKeystates: function() {
        
        //first we make player move and animate according to where he is moving
        //isDown is a bool value, that is true if the key is pressed down, and false otherwise
        //Checking if a key is pressed down or not is called checking a key state
        //Keystates only tell you if a button is pressed or not, 
        //it DOESN'T LET YOU HANDLE KEY PRESS EVENTS
        //this means if you want the player to attack when they press the attack button
        //if you check for keystate the game will make the player attack non stop, because you're not checking if the player pressed the attack button
        //you're only checking if the button is presed down
        //this might be confusing, but it'll make more sense with practice
        
        //for now disable diagnoal movement since i have no animation for diagnoal movement
        if((this.cursors.left.isDown || this.cursors.right.isDown) && (this.cursors.up.isDown || this.cursors.down.isDown)) {
            
            return;
        }
        
        if(this.cursors.left.isDown) {
        
            //move left, the sprite has a variable called body
            //this variable is a physics object that represents the object in the physics engine
            //by setting its velocity we can make it move
            player.sprite.body.velocity.x = -200;
            
            //run an animation, we created this animation already
            player.sprite.animations.play('left');
            
        } else if(this.cursors.right.isDown) {
            
            player.sprite.body.velocity.x = 200;
            player.sprite.animations.play('right');
            
        } else {
            
            //player isn't moving left or right, we have to set his velocity to 0 since the physcis engine isn't going to know when to stop moving
            player.sprite.body.velocity.x = 0;
            
            //only stop animation if the player is moving left or right
            //this is important because we don't want to stop animation when the player is moving up or down
            //because the player will never animate then
            if(player.sprite.animations.name == 'left' || player.sprite.animations.name == 'right') {
                
                //we stop the animation
                //the first argument is the name of the animtion yo uwant to stop
                //by setting to null, we stop the current animation
                //second argument tells phaser we want to stop the animation and start drawing the first frame of the animation
                //this way if player is standing still, he will face left or right, adn we won't have to determine which way he is facing
                player.sprite.animations.stop(null, true);
            }
        }
        
        if(this.cursors.up.isDown) {
            
            //IMPORTANT: IN COMPUTER GRAPHICS, THE POSTIIVE Y AXIS GOES DOWN, THE NEGATIVE Y AXIS GOES UP
            //THIS MEANS THAT UPWARDS IS NEGATIVE
            player.sprite.body.velocity.y = -200;
            player.sprite.animations.play('up');
            
        } else if(this.cursors.down.isDown) {
            
            player.sprite.body.velocity.y = 200;
            player.sprite.animations.play('down');
            
        } else {
            
            player.sprite.body.velocity.y = 0;
            
            if(player.sprite.animations.name == "up" || player.sprite.animations.name == 'down') {
                
                player.sprite.animations.stop(null, true);
            }
        }
    },
    
    //function that we will send to phaser to handle key press events
    handleKeyDown: function(key) {
        
        //if user presses the enter key we will enter the battle state
        if(key.keyCode == Phaser.Keyboard.ENTER) {
            
            game.state.start('battle');
        }
    },
    
    
    //this function is called when we leave the currents tate
    //the battle state is a seperate state, and when we enter the battle state, this state will be destoryed
    //when this state is destoryed, all objects in this state will also be destoryed, hence the player is destoryed
    //we want to prevent that
    shutdown: function() {
        
        game.world.remove(player.sprite);
    },
};