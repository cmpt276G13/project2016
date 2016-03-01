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
        
        display.playerHealth = new attributeDisplayText({attributeName: "HP:", attributeValue: player.health + "/ " + player.maxHealth, x: textOffset, y: textOffset + 45, cellWidth: 145, cellHeight: 20, textStyle: healthBarCaptionStyle});
        display.playerExp = new attributeDisplayText({attributeName: "EXP:", attributeValue: player.experience + "/ " + player.experienceToNextLevel, x: textOffset + display.background.width / 3 * 2, y: textOffset + 45, cellWidth: 145, cellHeight: 20, textStyle: healthBarCaptionStyle});
        
        display.attributeTable = new objectTable({x: display.background.width / 5, y: textOffset + 90, cellWidth: display.background.width / 4, cellHeight: 20, columnSpacing: 80, objectCreationFunction: attributeDisplayText} );
        display.attributeTable.addObject("left", {attributeName: "STR", attributeValue: player.strength, textStyle: statDisplayStyle} );
        display.attributeTable.addObject("right", {attributeName: "DEF", attributeValue: player.defense, textStyle: statDisplayStyle} );
        display.attributeTable.addObject("right", {attributeName: "MDEF", attributeValue: player.magicDefense, textStyle: statDisplayStyle} );
        display.attributeTable.addObject("left", {attributeName: "MATK", attributeValue: player.magicPower, textStyle: statDisplayStyle} );
        display.attributeTable.addObject("left", {attributeName: "GOLD", attributeValue: player.gold, textStyle: statDisplayStyle} );
        
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
        this.menuActions = new actionDisplay({x: 0, y: 0, width: 150, height: 350}, [{text: 'edit stats'}, {text: 'items'}, {text: 'skills'}, {text: 'back'}]);
        
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