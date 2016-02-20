//create all of the required game states
//A game state is basically a collection of all of the objects that are currently on screen
//It also includes all the available functionality at any given time
//for example, games can have a menu state, here the users can click on different buttons to go to different screens
//it can have a gameplay state, where the actual gameplay happens

//Game states will progress as follows:
//start with the boot state, when the game first runs, we need to configure the screen size, and all other display information
//this state handles screen set up, and nothing else
var bootState = {
    
    //phaser allows users to specify special functiosn which are called during the game loop
    //for more information, check out: http://www.html5gamedevs.com/topic/1372-phaser-function-order-reserved-names-and-special-uses/
    create: function() {
        
        //define how the system should behave
        //use the arcade physics engine for collisin handling
        //I think p2 physics might be better because it offers pixel perfect collision detection, but we might not even need that so for now lets stick to somethign simple
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //we're done with this state, so let's go onto the loading state to load the game resources
        game.state.start('load');
        
        //capture all keys the game uses so it doesn't affect the browser
        game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.ENTER]);
    },
};