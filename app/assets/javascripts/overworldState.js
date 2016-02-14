//the gameplay state
//this is where the player will move around on the map
//the technical term is overworld, so thats the name i will use for this state

/*
    We will use the same substate system that the battle state uses.
    Currently the overworld is very simple and has no substates.
    eventually we will need to add different substates, so when we do we wil implement the system like it's implemented in the battle state.

*/
var overworldState = {
    
    //this object is where you should define all of the substates of the overworldState
    //any substate added here will be autoamtically added to the state manager
    
    //All functions in the substates can be found in overworldSubstateFunctions
    subStates: [
        
        //use as follows
        //any sub state you want to add, create a new object in this
        //each state object needs to itself be an object, containing two attributes, a name as a string, and an object containing all of the functions
        //the id of each function should be the name you want to give the function after it is turned into a state object
        
        //example
        //this state is for players to select a main action, either fight, run, or use items
        {name: "explore", //name of the state
            functions: { //list of functions available in this state
                //in this state i want to add a function called onEnter.
                //i want onEnter to refer to the exploreEnter function
                onEnter: exploreEnter,  //attribute name is the name i want to give the function. Attribute value is the function itself
                onExit: exploreExit,    //create a function called onExit. the function that is actually called will be the exploreExit function
                onKeyDown: exploreKeyDown,
                onKeystates: exploreKeystates,
                onUpdate: exploreUpdate
            }
        }
        
    ],
    
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
        
        //now create a state manager to handle all the game substates
        this.stateManager = new stateManager();
        this.stateManager.addFromTemplate(this.subStates, this);
        this.stateManager.exitAll();
        this.stateManager.changeState("explore");
    },
    
    //function that we will send to phaser to handle key press events
    handleKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    },
    
    //update function is where the game world is updated
    //here we need to handle input, update physics, and handle collision
    //phaser does the physics and collision for us, we jst need to specify what collides
    update: function() {
        
        this.stateManager.onUpdate();
        
        //next handle all the game's inputs
        //start with keystate inputs, explained in the keystate function
        //we don't have to worry about button press events since we created listener for those events
        //but we can't create a listener for state events
        this.stateManager.onKeystates();
    },
    
    //this function is called when we leave the currents tate
    //the battle state is a seperate state, and when we enter the battle state, this state will be destoryed
    //when this state is destoryed, all objects in this state will also be destoryed, hence the player is destoryed
    //we want to prevent that
    shutdown: function() {
        
        game.world.remove(player.sprite);
    },
};