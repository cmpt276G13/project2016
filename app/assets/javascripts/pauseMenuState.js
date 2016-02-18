var pauseMenuState = {
    
    subStates: [
        
        {name: "menuHome",
            functions: {
                
                onEnter: menuHomeEnter,
                onExit: menuHomeExit,
                onUpdate: menuHomeUpdate,
                onKeyDown: menuHomeKeyDown
            }
        }
    ],
    
    create: function() {
        
        //create a list of actions the player can select from
        this.menuActions = new actionDisplay(0, 0, 150, 350, ['stats', 'items', 'skills', 'back']);
        
        game.input.keyboard.addCallbacks(this, this.handleKeyDown);
        
        this.stateManager = new stateManager();
        this.stateManager.addFromTemplate(this.subStates, this);
        this.stateManager.exitAll();
        this.stateManager.changeState("menuHome");
    },
    
    update: function() {
        
        this.stateManager.onUpdate();
    },
    
    handleKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    }
};