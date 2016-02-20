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
    
    //create a box that displays the player's stats
    //this only shows basic stats, and doesn't isn't used to edit hte user's stats
    createPlayerStatDisplay: function() {
        
        //first the background that holds the text
        var display = {};
        display.background = createTextboxBackground(150, 0, game.scale.width - 150, 350, false);
        
        var textOffset = 15;
        var textStyle = {
            
            fill: 'white',
            fontSize: 18
        };
        
        display.playerName = game.add.text(display.background.width / 2, textOffset, player.name, textStyle);
        display.playerName.anchor.setTo(0.5, 0);
        display.playerLevel = game.add.text(display.background.width / 2, textOffset + 17, "LV   " + player.level, textStyle);
        display.playerLevel.anchor.setTo(0.5, 0);
        
        display.playerHealth = game.add.text(textOffset, textOffset + 45, "HP      " + player.health + "/ " + player.maxHealth, textStyle);
        display.playerExp = game.add.text(textOffset + display.background.width / 3 * 2, textOffset + 45, "EXP      " + player.experience + "/ " + player.experienceToNextLevel, textStyle);
        display.playerStrength = game.add.text(display.background.width /4 , textOffset + 90, "STR        " + player.strength, textStyle);
        display.playerDefense = game.add.text(display.background.width / 2, textOffset + 90, "DEF        " + player.defense, textStyle);
        display.playerGold = game.add.text(display.background.width / 5 * 4 , display.background.height - 30, "GOLD     " + player.gold, textStyle);
        display.playerGold.x = display.background.width - textOffset - display.playerGold.width;
        
        barConfig = {
            
            width: 145,
            height: 11,
            radius: 6,
            maxHealth: player.maxHealth,
            x: textOffset,
            y: textOffset + 63,
            
            bg: {
                
                color: 'darkred'
            },
            
            bar: {
                
                color: 'green'
            }
        };
        
        display.healthBar = new HealthBar(game, barConfig);
        display.healthBar.setValueNoTransition(player.health);
        display.healthBar.addParent(display.background);
        
        barConfig.maxHealth = player.experienceToNextLevel;
        barConfig.x = display.background.width / 3 * 2 + textOffset;
        barConfig.bg.color = '0x111111';
        barConfig.bar.color = 'teal';
        
        display.expBar = new HealthBar(game, barConfig);
        display.expBar.setValueNoTransition(player.experience);
        display.expBar.addParent(display.background);
        
        for(object in display) {
            
            if(display[object] != display.background && display[object] != display.healthBar&& display[object] != display.expBar) {
                
                display.background.addChild(display[object]);
            }
        }
        
        return display;
    },
    
    create: function() {
        
        //create a list of actions the player can select from
        this.menuActions = new actionDisplay(0, 0, 150, 350, ['edit stats', 'items', 'skills', 'back']);
        
        this.statDisplay = this.createPlayerStatDisplay();
        
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