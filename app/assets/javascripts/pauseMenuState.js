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

        display.playerName = game.add.text(display.background.width / 2, textOffset, player.name, statDisplayStyle);
        display.playerName.anchor.setTo(0.5, 0);
        display.playerLevel = game.add.text(display.background.width / 2, textOffset + 17, "LV   " + player.level, statDisplayStyle);
        display.playerLevel.anchor.setTo(0.5, 0);
        
        display.playerHealth = new attributeDisplayText('HP:', player.health + "/ " + player.maxHealth, textOffset, textOffset + 45, 145, 20, healthBarCaptionStyle);
        display.playerExp = new attributeDisplayText("EXP:", player.experience + "/ " + player.experienceToNextLevel, textOffset + display.background.width / 3 * 2, textOffset + 45, 145, 20, healthBarCaptionStyle);
        
        display.attributeTable = new attributeDisplayTextTable(display.background.width / 5, textOffset + 90, display.background.width / 4, 20, 80, 5);
        display.attributeTable.addAttribute("left", "STR", player.strength, statDisplayStyle);
        display.attributeTable.addAttribute("right", "DEF", player.defense, statDisplayStyle);
        display.attributeTable.addAttribute("left", "GOLD", player.gold, statDisplayStyle);
        
        display.background.addChild(display.playerName);
        display.background.addChild(display.playerLevel);
        display.attributeTable.addParent(display.background);
        
        barConfig = {
            
            maxHealth: player.maxHealth,
            x: textOffset,
            y: textOffset + 63,
            
            bg: {
                
                color: 'darkred'
            },
            
            bar: {
                
                applyGradient: true,
                gradientStart: '#00ff00',
                gradientEnd: '#7af5f5'
            }
        };
        
        display.healthBar = new HealthBar(game, barConfig);
        display.healthBar.setValueNoTransition(player.health);
        display.healthBar.addParent(display.background);
        
        barConfig.maxHealth = player.experienceToNextLevel;
        barConfig.x = display.background.width / 3 * 2 + textOffset;
        barConfig.bg.color = '0x111111';
        barConfig.bar.gradientStart = '#ffff00';
        barConfig.bar.gradientEnd = '#7af588';
        
        display.expBar = new HealthBar(game, barConfig);
        display.expBar.setValueNoTransition(player.experience);
        display.expBar.addParent(display.background);
        
        display.playerHealth.addParent(display.background);
        display.playerExp.addParent(display.background);
        
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
        
        lastState = "pauseMenu";
    },
    
    update: function() {
        
        this.stateManager.onUpdate();
    },
    
    handleKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    },
    
    shutdown: function() {
        
        game.world.remove(player.sprite);
    }
};