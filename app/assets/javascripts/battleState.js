//the battle state
//here players will battle some number of monsters
var battleState = {
    
    //this object is where you should define all of the substates of the battle system
    //any substate added here will be autoamtically added to the state manager
    
    //All functions in the substates can be found in battleSubstateFunctions
    subStates: [
        
        //use as follows
        //any sub state you want to add, create a new object in this
        //each state object needs to itself be an object, containing two attributes, a name as a string, and an object containing all of the functions
        //the id of each function should be the name you want to give the function after it is turned into a state object
        
        //example
        //this state is for players to select a main action, either fight, run, or use items
        {name: "selectMainAction", //name of the state
            functions: { //list of functions available in this state
                //in this state i want to add a function called onEnter.
                //i want onEnter to refer to the selectMainActionEnter function declared above
                onEnter: selectMainActionEnter,  //attribute name is the name i want to give the function. Attribute value is the function itself
                onExit: selectMainActionExit,    //create a function called onExit. the function that is actually called will be the selectMainActionExit function declared above
                onKeyDown: selectMainActionKeyDown,
                onUpdate: selectMainActionUpdate,
            }
        },
        
        //any time you want to add a new state, just add it like in the example above
        {name: "selectFightAction",
            functions: {
                
                onEnter: selectFightActionEnter,
                onExit: selectFightActionExit,
                onKeyDown: selectFightActionKeyDown,
                onUpdate: selectFightActionUpdate
            }
        },
        
        {name: "selectSkill",
            functions: {
                
                onEnter: selectSkillEnter,
                onExit: selectSkillExit,
                onKeyDown: selectSkillKeyDown,
                onUpdate: selectSkillUpdate
            }
        },
        
        {name: "selectItemAction",
            functions: {
                
                onEnter: selectItemActionEnter,
                onExit: selectItemActionExit,
                onKeyDown: selectItemActionKeyDown,
                onUpdate: selectItemActionUpdate
            }
        },
        
        {name: "playerRunAway",
            functions: {
                
                onEnter: playerRunAwayEnter
            }
        },
        
        {name: "playerSelectTarget",
            functions: {
                
                onEnter: playerSelectTargetEnter,
                onExit: playerSelectTargetExit,
                onKeyDown: playerSelectTargetKeyDown,
                onUpdate: playerSelectTargetUpdate
            }
        },
        
        {name: "playerAttack",
            functions: {
                
                onEnter: playerAttackEnter,
                onExit: playerAttackExit,
                onUpdate: playerAttackUpdate
            }
        },
        
        {name: "playerAttackResults",
            functions: {
                
                onEnter: playerAttackResultsEnter,
                onExit: playerAttackResultsExit,
                onUpdate: playerAttackResultsUpdate
            }
        },
        
        {name: "cullDeadMonsters",
            functions: {
                
                onEnter: cullDeadMonstersEnter,
                onExit: cullDeadMonstersExit,
                onUpdate: cullDeadMonstersUpdate
            }
        },
        
        {name: "playerUseItem",
            functions: {
                
                onEnter: playerUseItemEnter,
                onExit: playerUseItemExit,
                onUpdate: playerUseItemUpdate
            }
        },
        
        {name: "monsterTurn",
            functions: {
                
                onEnter: monsterTurnEnter,
                onExit: monsterTurnExit,
                onUpdate: monsterTurnUpdate
            }
        },
        
        {name: "monsterAttackResults",
            functions: {
                
                onEnter: monsterAttackResultsEnter,
                onExit: monsterAttackResultsExit,
                onUpdate: monsterAttackResultsUpdate
            }
        },
        
        {name: "playerDying",
            functions: {
                
                onEnter: playerDyingEnter
            }
        },
        
        {name: "victory",
            functions: {
                
                onEnter: victoryEnter,
                onKeyDown: victoryKeyDown
            }
        },
        
        {name: "defeat",
            functions: {
                
                onEnter: defeatEnter,
                onExit: defeatExit,
                onKeyDown: defeatKeyDown
            }
        },
        
        {name: "intro",
            functions:{
                
                onEnter: introEnter,
                onUpdate: introUpdate
            }
        },
        
        {name: "outro",
            functions: {
                
                onEnter: outroEnter
            }
        }
        
    ],
    
    //class that handles monster selection
    //it keeps track of selected monsters until the list is cleared
    //and it highlights the selected monsters
    monsterSelector: {
        
        highlighter: new objectHighlighter(),
        
        //each number in array represents the index of a monster that has been selected
        //once a monster is selected, it is added to the selected monsters indices list
        //this allows us to select multiple monsters
        selectedMonstersIndices: [],
        
        //currently targted monster, this is different from the selectedmonstersindice
        //monster with this target IS NOT SELECTED, it must be added to the list once player actually selects it
        currentSelection: 0,
        
        //this variable determines how many monsters you need to select, it is set with the beginSelectionProcess function
        //when this is set, every time the selector adds a monster, it will increase the number of selected mosnters
        //it will finish selection when the number of selected monsters is equal to this
        requiredSelections: 0,
        
        addSelection: function(idOfSelected, monsters) {
            
            //don't allow over selection
            if(idOfSelected >= monsters.length || this.selectedMonstersIndices.length == this.requiredSelections) {
                
                return;
            }
            
            //don't allow duplicate selections
            for(var index = 0; index < this.selectedMonstersIndices.length; ++index) {
                
                if(this.selectedMonstersIndices[index] == idOfSelected) {
                    
                    return;
                }
            }
            
            globalSfx.selectMonster.play();
            
            this.selectedMonstersIndices.push(idOfSelected);
            this.highlighter.addHighlight(monsters[idOfSelected].sprite);
        },
        
        addCurrentSelection: function(monsters) {
            
            this.addSelection(this.currentSelection, monsters);
        },
        
        startSelectionProcess: function(monsters, requiredSelections) {
            
            this.clearSelection();
            this.requiredSelections = Math.min(requiredSelections, monsters.length);
            this.currentSelection = 0;
            this.highlighter.showHighlights();
            this.highlightCurrentSelection(monsters);
        },
        
        selectNext: function(monsters) {
            
            this.currentSelection = (this.currentSelection + 1) % monsters.length;
            this.highlightAllSelections(monsters);
            
            globalSfx.highlightOption.play();
        },
        
        selectPrevious: function(monsters) {
            
            this.currentSelection -= 1;
            
            if(this.currentSelection < 0) {
                
                this.currentSelection = monsters.length - 1;
            }
            
            globalSfx.highlightOption.play();
            this.highlightAllSelections(monsters);
        },
        
        isSelectionFinished: function() {
            
            return this.selectedMonstersIndices.length === this.requiredSelections;
        },
        
        clearSelection: function() {
            
            this.selectedMonstersIndices = [];
            this.highlighter.clearHighlights();
        },
        
        highlightSelectedMonsters: function(monsters) {
            
            for(var i = 0; i < this.selectedMonstersIndices.length; ++i) {
                
                this.highlighter.addHighlight(monsters[this.selectedMonstersIndices[i]].sprite);
            }
        },
        
        highlightCurrentSelection: function(monsters) {
            
            this.highlighter.addHighlight(monsters[this.currentSelection].sprite);
        },
        
        highlightAllSelections: function(monsters) {
            
            this.highlighter.clearHighlights();
            
            this.highlightSelectedMonsters(monsters);
            
            this.highlightCurrentSelection(monsters);
        },
        
        getSelectedMonsters: function(monsters) {
            
            var selected = [];
            
            for(var i = 0; i < this.selectedMonstersIndices.length; ++i) {
                
                selected.push(  monsters[this.selectedMonstersIndices[i]] );
            }
            
            return selected;
        },
    },
    
    //load the data of the monsters the player has to fight
    loadMonsters: function() {
        
        //load all monsters that exist in this level
        var monsterNames = game.cache.getJSON(mapKeys.monsterListKey);
        
        //now turn the monster database to a javascript object, os we can find monsters in this database
        var monsterDatabase = game.cache.getJSON('monsterData');
        
        //determine how many monsters we should spawn
        var monstersToSpawn = getRandomInt(1, 3);
        var monsters = [];
        
        for(var i = 0; i < monstersToSpawn; ++i) {
            
            //now we want to randomly select a monster name from this list
            var id = 0;
            var monsterName = monsterNames.monsters[id];
            
            //now we can use this key to load the monster data
            //if you don't understand this notation, please search up javascript objects: http://www.w3schools.com/js/js_object_definition.asp, and follow the next 3 tutorials
            var monster = new rpgEntity();
            jQuery.extend(monster, monsterDatabase[monsterName]);
            
            //copy rewards seperately because the above extend function creates a reference to the original rewards
            //and when the copy is modified, so is the original, and i don't want that
            monster.rewards = {};
            jQuery.extend(monster.rewards, monsterDatabase[monsterName].rewards);
            
            //now scale monster to player's level
            scaleMonsterToPlayer(monster, player.level);
            scaleMonsterRewardsToLevel(monster, monsterDatabase[monsterName].rewards );
            
            var num = Math.max(Math.floor(monstersToSpawn / 2), 2);
            
            //position the monster somewhere offscreen
            monster.x = getRandomInt(100, 300) * -1;
            monster.y = getRandomInt(200, 400);
            monster.finishedPositioning = false;//need to call move monsters to position at some point
            
            monsters.push(monster);
        }
        
        return monsters;
    },
    
    generateMonsterSprites: function(monsters) {
        
        //all monsters have a key that can be used to get the name of the sprite for the monster
        //lets get this monsters image to draw
        //we can position the mosnter for battle as well
        var i = 0;
        for(i = 0; i < monsters.length; ++i) {
            
            monsters[i].sprite = game.add.sprite(monsters[i].x, monsters[i].y, monsters[i].imageKey, monsters[i].startingFrame);
            monsters[i].sprite.animations.play("stand");
            
            for(var j = 0; j < monsters[i].animations.length; ++j) {
                
                animation = monsters[i].animations[j];
                monsters[i].sprite.animations.add(animation.name, animation.frames, animation.speed, false);
            }
        }
    },
    
    //once monster sprites have been created, begin a transition effect for hte monters
    //this will make the monsters interpolate to their current position from an offscreen position
    moveMonstersToPosition: function() {
        
        for(var i = 0; i < this.monsters.length; ++i) {
            
            var num = Math.max(Math.floor(this.monsters.length / 2), 2);
            
            //position the monster somewhere on the screen
            var xTarget = 230 - (40 * this.monsters.length / 2) + i * 40;
            var yTarget = 265 + 50 * (i % num);
            
            this.monsters[i].sprite.position.y = yTarget;
            
            var tween = game.add.tween(this.monsters[i].sprite.position);
            
            tween.onComplete.add(function(){this.finishedPositioning = true;}, this.monsters[i]);
            tween.to({x: xTarget}, getRandomInt(300, 450), null, true);
        }
    },
    
    //looks for all dead monsters and plays their dying animation
    startMonsterDeathAnimation: function() {
        
        for(var i = 0; i < this.monsters.length; i++) {
            
            if(this.monsters[i].health != 0) {
                
                continue;
            }
            
            startDeathAnimation(this.monsters[i]);
        }
    },
    
    //deletes all entities marked for deletion
    //returns true if all dead entities have been deleted
    //false if there are entities that are still animating, and need to be deleted later
    deleteMarkedEntities: function(entities) {
        
        for(var i = 0; i < entities.length;) {
            
            if(entities[i].health != 0) {
                
                i += 1;
                continue;
            }

            if(!entities[i].shouldDelete) {
                
                return false;
            }
            
            //monster was killed, add to list of defeated monsters
            if(typeof this.defeatedMonsters[entities[i].name] === "undefined") {
                
                this.defeatedMonsters[entities[i].name ] = 0;
            }
            this.defeatedMonsters[entities[i].name] += 1;
            
            entities[i].sprite.destroy();
            entities.splice(i, 1);
            
        }
        return true;
    },
    
    //rewards received by the player when he kills an enemy
    //awarded at the end of the battle state (in the victory sub state)
    createRewards: function() {
        
        var rewards = {};
        rewards.experience = 0;
        rewards.gold = 0;
        
        //if we want monsters to give items when thjey die, then add item here
        //add as name: quantity
        rewards.items = {};
        
        //same for new skills
        //add a key to the skills object
        rewards.skills = [/*add skill keys, ex: 'fireball'  */];
        
        return rewards;
    },
    
    //finds all dead enemies and stores their rewards so we can give it to the player later
    storePlayerRewards: function() {
        
        for(var i = 0; i < this.monsters.length; i++) {
            
            if(this.monsters[i].health != 0) {
                
                continue;
            }
            
            this.rewards.experience += this.monsters[i].rewards.experience;
            this.rewards.gold += this.monsters[i].rewards.gold;
            
            for(item in this.monsters[i].rewards.items) {
                
                //determine if item drops
                var percentChanceToDrop = this.monsters[i].rewards.items[item];
                
                var dropItem = getRandomInt(0, 100) < percentChanceToDrop;
                
                if(!dropItem) {
                    
                    continue;
                }
                
                if(typeof this.rewards.items[item] === "undefined") {
                    
                    this.rewards.items[item] = 0;
                }
                
                this.rewards.items[item] += 1;
            }
        
            this.rewards.skills.concat(this.monsters[i].rewards.experience);
        }
    },
    
    applyRewardsToPlayer: function() {
        
        player.gold += this.rewards.gold;
        player.experience += this.rewards.experience;
        
        while(player.experience >= player.experienceToNextLevel) {
            
            player.levelUp();
            
            //start the level up effect, for now just display a message
            this.showMessage("You have leveled up!");
            this.updatePlayerStatDisplay();
        }
        
        for(item in this.rewards.items) {
            
            if(typeof player.items[item] === "undefined") {
                
                player.items[item] = createItem(item, 0);
            }
            
            player.items[item].quantity += Number(this.rewards.items[item]);
        }
    },
    
    createRewardsText: function() {
        
        this.rewardsTextbox = new textBox({x: game.scale.width / 2, y: game.scale.height / 2, width: game.scale.width / 3, height: game.scale.height / 6, centerToPoint: true, showPressEnterMessage: true} );
        var expGoldText = "Gained " + this.rewards.experience + " Experience\n"
        
        if(this.rewards.gold != 0) {
            
            expGoldText += "Gained " + this.rewards.gold + " Gold\n";
        }
        
        var itemsText = "";
        
        //add items
        for(item in this.rewards.items) {
            
            itemsText += "Gained " + item + "   x" + this.rewards.items[item] + "\n";
        }
        
        this.rewardsTextbox.setText(expGoldText);
        
        if(itemsText != "") {
            
            this.rewardsTextbox.addText(itemsText);
        }
    },
    
    //create a UI that displays the player's current stats
    generatePlayerStatDisplay: function(x, y, width, height){
        
        //container for the ui
        var statContainer = {};
        statContainer.textBox = createTextboxBackground(x, y, width, height);
        
        var barStyle = {
            
            x: 180,
            y: 26,
            width: 150,
            maxHealth: player.maxHealth,
            
            isFixedToCamera: true,
            
            animationDuration: 700,
            
            bg: {
                color: 'darkred'
            }
        };
        
        statContainer.playerHealthBar = new HealthBar(barStyle);
        statContainer.playerHealthBar.setValueNoTransition(player.health);
        statContainer.playerHealthBar.addParent(statContainer.textBox);
        
        barStyle.x += 170;
        barStyle.maxHealth = player.maxMana;
        barStyle.bg = {color: '#000033'};
        barStyle.bar = {gradientStart: '#00cdcd'};
        
        statContainer.playerManaBar = new HealthBar(barStyle);
        statContainer.playerManaBar.setValueNoTransition(player.mana);
        statContainer.playerManaBar.addParent(statContainer.textBox);
        
        statContainer.attributeTable = new objectTable({x: 10, y: 10, cellWidth: 150, cellHeight: 15, objectCreationFunction: attributeDisplayText});
        
        statContainer.attributeTable.addObject("name", {attributeName: "name:", attributeValue: player.name, textStyle: statDisplayStyle});
        statContainer.attributeTable.addObject("health", {attributeName: "HP:", attributeValue: player.health + "/ " + player.maxHealth, textStyle: healthBarCaptionStyle});
        statContainer.attributeTable.addObject("mana", {attributeName: "MP:", attributeValue: player.mana + "/ " + player.maxMana, textStyle: healthBarCaptionStyle});
        
        statContainer.attributeTable.addParent(statContainer.textBox);
        

        return statContainer;
    },
    
    updatePlayerStatDisplay: function() {
        
        this.playerStatDisplay.playerHealthBar.setValue(player.health);
        this.playerStatDisplay.playerManaBar.setValue(player.mana);
        
        this.playerStatDisplay.attributeTable.columns["health"].clear();
        this.playerStatDisplay.attributeTable.addObject("health", {attributeName: "HP:", attributeValue: player.health + "/ " + player.maxHealth, textStyle: healthBarCaptionStyle});
    
        this.playerStatDisplay.attributeTable.columns["mana"].clear();
        this.playerStatDisplay.attributeTable.addObject("mana", {attributeName: "MP:", attributeValue: player.mana + "/ " + player.maxMana, textStyle: healthBarCaptionStyle});
    },
    
    //saves the orientation of the player as it was in the overworld state, before the battle started
    //this is needed so we can restore the player back to his original position when the battle ends
    savePlayerOverworldOrientation: function() {
        
        this.playerPositionX = player.sprite.x;
        this.playerPositionY = player.sprite.y;
        this.playerAnimation = player.sprite.animations.name;
    },
    
    //loads the players overworld position so that he ends up exactly where he was before the battle started
    loadPlayerOverworldOrientation: function() {
        
        player.sprite.x = this.playerPositionX;
        player.sprite.y = this.playerPositionY;
        player.sprite.animations.play(this.playerAnimation);
        player.sprite.animations.stop(null, true);
    },
    
    //positions the player in the battle screen
    orientPlayerForBattle: function() {
        
        player.sprite.x = 570;
        player.sprite.y = 350;
        
        player.sprite.body.velocity.x = 0;
        player.sprite.body.velocity.y = 0;
        
        //player face left
        player.sprite.animations.play('left');
        player.sprite.animations.stop(null, true);
    },
    
    showMessage: function(message) {
        
        this.messageBox.show();
        this.messageBox.setText(message);
    },
    
    hideMessage: function() {
        
        this.messageBox.hide();
    },
    
    //makes the attack hit the defender
    //determines if the attack hit the defender
    //determines damage dealt
    determineAttackResults: function(attack, defender) {
        
        var damage = determineDamage(attack, defender);
        defender.getHit(damage);
        return damage;
    },
    
    //creates a damage text that displays the amount of damage the given entity received
    createDamageText: function(entity, damageReceived, textStyle) {
        
        var damageText = new Object();
        damageText.text = game.add.text(entity.sprite.width / 2, 0, damageReceived.toString(), textStyle);
        damageText.text.alpha = 0.3;
        damageText.text.anchor.setTo(0.5, 0);
        
        entity.sprite.addChild(damageText.text);
        
        var textTween = game.add.tween(damageText.text).to({y: -40, alpha: 1}, 1000, Phaser.Easing.Bounce.Out);
        textTween.start();
        
        damageText.tween = textTween;
        
        return damageText;
    },
    
    clearDamageTexts: function() {
        
        var i = 0;
        
        for(i = 0; i < this.damageTexts.length; i++) {
            
            this.damageTexts[i].text.destroy();
        }
        
        this.damageTexts = [];
    },
    
    //checks if all of the attack results texts have finished their tweening
    finishedDisplayingResults: function() {
        
        //if any text is still tweening, then we have to wait for it to finish
        var i = 0;
        
        for(i = 0; i < this.damageTexts.length; i++) {
            
            
            if(this.damageTexts[i].tween.isRunning) {
                
                return false;
            }
            
        }

        return true;
    },
    
    create: function() {
        
        globalBgm.overworld.stop();
        globalBgm.battle.play('', 0, globalBgm.volume);
        
        //misc instructions, ignore
        document.getElementById("additional").innerHTML = "select an action";
        
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
		this.text = game.add.text(0, 0, "BATTLe", style);
		
		//load random background
		backgroundId = getRandomInt(0, mapKeys.battleBackgroundKeys.length - 1);
		background = game.add.sprite(0, 0, mapKeys.battleBackgroundKeys[backgroundId]);
		background.width = game.scale.width;
		background.height = game.scale.height;
		
        //next we will create a monster
        //we might have a battle with multiple monsters, so the name is plural
        this.monsters = this.loadMonsters();
        
        //keeps track of all the monsters that the player has defeated
        //this object will contain, "monsterNAme": numberKilled
        this.defeatedMonsters = {};
        
        //we've only loaded the data for the mosnter, we now need to create an image so we can see them
        this.generateMonsterSprites(this.monsters);
        
        //now we want to reload the player
        game.add.existing(player.sprite);
        
        this.rewards = this.createRewards();
        
        //we also have to reposition the player since we are starting a battle
        //when we exit the battle, the player will be at a different position than when he started, so we need to save the players old position and orientation
        this.savePlayerOverworldOrientation();
        
        //set player to battle position, and orientation
        this.orientPlayerForBattle();
        
        //now we want to have some UI to display all the battle options
        
        //first we have to create the box where the UI is displayed
        
        var actionBoxWidth = game.scale.width / 3.5;
        var actionBoxHeight = 130;
        
        //create the ui that displays the player's stats
        this.playerStatDisplay = this.generatePlayerStatDisplay(actionBoxWidth, game.scale.height - actionBoxHeight, game.scale.width - actionBoxWidth, actionBoxHeight);
        
        this.mainActionsDisplay = new actionDisplay({x: 0, y: game.scale.height - actionBoxHeight, width: actionBoxWidth, height: actionBoxHeight, viewableObjects: 4}, [
                                        {text: 'fight'}, {text: 'items'}, {text: 'run'}, {text: 'option4'}, {text: 'option5'}, {text: 'option6'}]);
        this.fightActionsDisplay = new actionDisplay({x: game.scale.width / 3, y: game.scale.height - actionBoxHeight * 2 - 20, 
                                        width: game.scale.width / 3, height: actionBoxHeight}, [{text: 'attack'}, {text: 'skills'}, {text: 'cancel'}]);
                                        
        //action list when user selects items
        this.itemsDisplay = new actionDisplay({x: game.scale.width / 3, y: game.scale.height - actionBoxHeight * 2.2 - 30, width: game.scale.width / 3, height: actionBoxHeight * 1.4,
                                viewableObjects: 6, objectCreationFunction: attributeDisplayText}, []);
        
        this.skillsDisplay = new actionDisplay({x: game.scale.width / 3, y: game.scale.height - actionBoxHeight * 2.2 - 30, width: game.scale.width / 3, height: actionBoxHeight * 1.4,
                                viewableObjects: 6, objectCreationFunction: attributeDisplayText}, []);
        
        //add all of the player's skills to the display
        for(var i = 0; i < player.skills.length; ++i) {
            
            var name = player.skills[i];
            var cost = game.cache.getJSON("skillData")[name].manaCost;
            this.skillsDisplay.addAction({attributeName: name, attributeValue: cost + " MP"}  );
        }
    
        this.skillsDisplay.addAction({attributeName: "Cancel"});
        
        //again we want to add a listener for when the player presses on keys
        game.input.keyboard.callbackContext = this;
        game.input.keyboard.onDownCallback = this.onKeyDown;
        
        //we need a way to give messages to the player
        //we will create a text box at the top of the screen, it will only be visible when there is a message for the player to read
        this.messageBox = new textBox({x: 0, y: 0, width: game.scale.width, height: 40, horizontalAlign: "center", verticalAlign: "center"});
        
        //this contains text that will display the amount of damage an monster or player received after an attack
        //new text is added to it whenever an entity is damaged, and once the text finishes displaying, it will be deleted
        //damage texts will contain the text reprsenting the damage, and a phaser tween object
        //tween objects represent a linear interpolation between two object states, we will use it to animate the text
        this.damageTexts = [];
        
        this.stateManager = new stateManager();
        this.stateManager.addFromTemplate(this.subStates, this);
        this.stateManager.exitAll();
        this.stateManager.changeState("intro");
        
        lastState = "battle";
    },
    
    update: function() {
    
        this.stateManager.onUpdate();
    },
    
    onKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    },
    
    shutdown: function() {
        
        //now we also want the player ot return to whatever he was doing, so set him back to his original position
        this.loadPlayerOverworldOrientation();
        
        //once again we don't want the game to destroy the player
        game.world.remove(player.sprite);
        globalBgm.battle.stop();
    },
};