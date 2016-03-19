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
        },
        
        {name: "startGame",
            functions: {
                
                onEnter: startGameEnter,
                onExit: startGameExit,
                onUpdate: startGameUpdate
            }
        },
        
        {name: "exitBattle",
            functions: {
                
                onEnter: exitBattleEnter
            }
        },
        
        {name: "enterBattle",
            functions: {
                
                onEnter: enterBattleEnter
            }
        }
        
    ],
    
    generateTilemap: function() {
        
        //we already loaded the tilemap data in the load state, we just need to set them to a phaser object
        this.map = game.add.tilemap(mapKeys.mapKey);
        
        //add all tileset images to the tileset
        for(var i = 1; i <= mapKeys.tilesetKeys.length; ++i) {
            
            this.map.addTilesetImage('tileset' + i.toString(), mapKeys.tilesetKeys[i - 1]);
        }
        
        //load all layers
        this.background1 = this.map.createLayer('background1');
        this.background2 = this.map.createLayer('background2');
        this.solid = this.map.createLayer('solid');
        this.background1.resizeWorld();
        
        this.map.setCollisionBetween(1, 10000, true, 'solid');
    },
    
    create: function() {
        
        //misc instructions, ignore
        
        //first we will create the tile map
        this.generateTilemap();
        
        //like a spawn point
        //which i'll set manually since i didn't put one in the map
        this.spawnPoint = {x: 0, y: 0};
        
        game.add.existing(player.sprite);
        
        //create foreground here
        //NEEDS TO BE MADE AFTER PLAYER SO THAT THE FOREGROUND DRAWS ON TOP OF PLAYER
        this.foreground = this.map.createLayer('foreground');
        
        
        //we also want he camera to follow the player
        game.camera.follow(player.sprite);
        
        
        //this function makes phaser use arrow keys for movement
        //it creates a collection of keys that you can poll for events (look at update function for polling code)
        //polling a key means you check if a key is pressed, or released
        this.cursors = game.input.keyboard.createCursorKeys();
        player.cursors = this.cursors;
        player.x = 0;
        
        //make phaser use a call back listener
        game.input.keyboard.addCallbacks(this, this.handleKeyDown);
        
        //now create a state manager to handle all the game substates
        this.stateManager = new stateManager();
        this.stateManager.addFromTemplate(this.subStates, this);
        this.stateManager.exitAll();
        
        if(lastState == "load") {
            
            this.stateManager.changeState("startGame");
            
        } else if(lastState == "battle") {
            
            //we came here from some other ingame state
            //we need to check if we must respawn player
            if(player.health == 0) {
                
                player.respawn(this.spawnPoint);
                this.stateManager.changeState("startGame");
                
            } else {
                
                this.stateManager.changeState("exitBattle");
            }
            
        } else if(lastState == "pauseMenu") {
            
            this.stateManager.changeState("explore");
        }
        
        //save player data here for now, mostly because external states make changes to player
        //so instead of saving player in every single state, we will just save the player when he returns to the map
        player.save();
        questManager.onInventoryCheck();
        
        lastState = "overworld";
    },
    
    //function that we will send to phaser to handle key press events
    handleKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    },
    
    update: function() {
        
        this.stateManager.onUpdate();
        
        this.stateManager.onKeystates();
    },
    
    shutdown: function() {
        
        game.world.remove(player.sprite);
    }
};