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
        
        {name: "victory",
            functions: {
                
                onEnter: victoryEnter,
                onKeyDown: victoryKeyDown
            }
        },
        
        {name: "defeat",
            functions: {
                
                onEnter: defeatEnter,
                onExit: defeatExit
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
        },
        
        selectPrevious: function(monsters) {
            
            this.currentSelection -= 1;
            
            if(this.currentSelection < 0) {
                
                this.currentSelection = monsters.length - 1;
            }
            
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
            
            for(var i = 0; i < monsters.length; ++i) {
                
                selected.push(monsters[i]);
            }
            
            return selected;
        },
    },
    
    //rewards received by the player when he kills an enemy
    //awarded at the end of the battle state (in the victory sub state)
    rewards: {
        
        experience: 0,
        gold: 0,
        
        //if we want monsters to give items when thjey die, then we can add all items to this array
        items: [],
        
        //same for new skills
        //add a key to the skills object
        skills: [/*add skill keys, ex: 'fireball'  */]
    },
    
    //load the data of the monsters the player has to fight
    loadMonsters: function() {
        
        //here is where the monsters list we loaded previously, and the mosnter database come into play
        //we want to randomly generate a mosnter, so we will randomly select the name of a mosnter that can spawn in this map
        //generate the array of mosnter names
        //the getJSON function uses a key to a previously loaded json file
        //it then returns a java script object containing the data loaded in the file
        //please look up how JSON works if you are unfamiliar with it
        var monsterNames = game.cache.getJSON('monsterList');
        
        //now turn the monster database to a javascript object, os we can find monsters in this database
        var monsterDatabase = game.cache.getJSON('monsterData');
        
        //determine how many monsters we should spawn
        var monstersToSpawn = getRandomInt(1, 3);
        var monsters = [];
        
        for(var i = 0; i < monstersToSpawn; ++i) {
            
            //now we want to randomly select a monster name from this list
            //the object basiclaly has 1 element named monsters, which is an array of names
            //these names are actually keys to the database, so we can use it directly
            //randomly select monster name (for now just use the orc name since i haven't created the others)
            var id = 0;
            var monsterName = monsterNames.monsters[id];
            
            //now we can use this key to load the monster data
            //if you don't understand this notation, please search up javascript objects: http://www.w3schools.com/js/js_object_definition.asp, and follow the next 3 tutorials
            var monster = new rpgEntity();
            $.extend(monster, monsterDatabase[monsterName]);
            
            var num = Math.max(Math.floor(monstersToSpawn / 2), 2);
            
            //position the monster somewhere
            monster.x = 200 - (40 * monstersToSpawn / 2) + i * 40;
            monster.y = 200 + 50 * (i % num);
            
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
            
            for(var j = 0; j < monsters[i].animations.length; ++j) {
                
                animation = monsters[i].animations[j];
                monsters[i].sprite.animations.add(animation.name, animation.frames, animation.speed, false);
            }
        }
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
        
        player.sprite.x = 500;
        player.sprite.y = 250;
        
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
        
        var damage = determineDamage(attack.power, defender.defense);
        defender.getHit(damage);
        return damage;
    },
    
    //creates a damage text that displays the amount of damage the given entity received
    createDamageText: function(entity, damageReceived) {
        
        var damageText = new Object();
        damageText.text = game.add.text(entity.sprite.width / 2, 0, damageReceived.toString(), {fill: 'red'});
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
    
    createRewardsText: function() {
        
        this.rewardsTextbox = new textBox(game.scale.width / 2, game.scale.height / 2, game.scale.width / 3, game.scale.height / 6, true);
        var rewardsText = "Gained " + this.rewards.experience + " Experience\n";
        rewardsText += "Gained " + this.rewards.gold + " Gold\n";
        
        this.rewardsTextbox.setText(rewardsText);
        this.rewardsTextbox.text.fontSize = 20;
        this.rewardsTextbox.text.y = 0;
        this.rewardsTextbox.text.anchor.y = 0;
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
    
    //looks for all dead monsters and plays their dying animation
    startMonsterDeathAnimation: function() {
        
        for(var i = 0; i < this.monsters.length; i++) {
            
            if(this.monsters[i].health != 0) {
                
                continue;
            }
            
            startDeathAnimation(this.monsters[i]);
        }
    },
    
    //finds all dead enemies and stores their rewards so we can give it to the player later
   storePlayerRewards: function() {
        
        for(var i = 0; i < this.monsters.length; i++) {
            
            if(this.monsters[i].health != 0) {
                
                continue;
            }
            
            this.rewards.experience += this.monsters[i].rewards.experience;
            this.rewards.gold += this.monsters[i].rewards.gold;
            this.rewards.items.concat(this.monsters[i].rewards.items);
            this.rewards.skills.concat(this.monsters[i].rewards.experience);
        }
    },
    
    applyRewardsToPlayer: function() {
        
        player.gold += this.rewards.gold;
        player.experience += this.rewards.experience;
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
            
            entities[i].sprite.destroy();
            entities.splice(i, 1);
            
        }
        return true;
    },
    
    create: function() {
        
        //misc instructions, ignore
        document.getElementById("additional").innerHTML = "select an action";
        
        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
		this.text = game.add.text(0, 0, "BATTLe", style);
		
        //first we have to create a background to display
        //i haven't put in any background yet but just know that it has to be created first
        
        //next we will create a monster
        //we might have a battle with multiple monsters, so the name is plural
        //although right now it generates a single monster, later it might create an array of monsters
        this.monsters = this.loadMonsters();
        
        //we've only loaded the data for the mosnter, we now need to create an image so we can see them
        this.generateMonsterSprites(this.monsters);
        
        //now we want to reload the player
        game.add.existing(player.sprite);
        
        //we also have to reposition the player since we are starting a battle
        //when we exit the battle, the player will be at a different position than when he started, so we need to save the players old position and orientation
        this.savePlayerOverworldOrientation();
        
        //set player to battle position, and orientation
        this.orientPlayerForBattle();
        
        //now we want to have some UI to display all the battle options
        
        //first we have to create the box where the UI is displayed
        //if you look at final fantasy battles, there are blue rectangles that contain all the text
        //first is the rectangle that contains all the actions the player can take
        
        var actionBoxWidth = game.scale.width;
        var actionBoxHeight = 130;
        
        this.mainActionsDisplay = new actionDisplay(0, game.scale.height - actionBoxHeight, actionBoxWidth, actionBoxHeight, ['fight', 'items', 'run']);
        this.fightActionsDisplay = new actionDisplay(game.scale.width / 3, game.scale.height - actionBoxHeight - 20, game.scale.width / 3, actionBoxHeight, ['attack', 'skills', 'cancel']);
        
        //again we want to add a listener for when the player presses on keys
        game.input.keyboard.callbackContext = this;
        game.input.keyboard.onDownCallback = this.onKeyDown;
        
        //we need a way to give messages to the player
        //we will create a text box at the top of the screen, it will only be visible when there is a message for the player to read
        this.messageBox = new textBox(0, 0, game.scale.width, 50, false);
        
        //this contains text that will display the amount of damage an monster or player received after an attack
        //new text is added to it whenever an entity is damaged, and once the text finishes displaying, it will be deleted
        //damage texts will contain the text reprsenting the damage, and a phaser tween object
        //tween objects represent a linear interpolation between two object states, we will use it to animate the text
        this.damageTexts = [];
        
        this.stateManager = new stateManager();
        this.stateManager.addFromTemplate(this.subStates, this);
        this.stateManager.exitAll();
        this.stateManager.changeState("selectMainAction");
    },
    
    update: function() {
    
        this.stateManager.onUpdate();
    },
    
    onKeyDown: function(key) {
        
        this.stateManager.onKeyDown(key);
    },
    
    //this is a render (drawing) function
    //phaser draws all of our game objects automatically, however we might want to do our own rendering calls
    //in the render function we dont do any calculations at all
    //all math, physics, updating, should be done in the update function
    //only draw calls should be placed in this function
    render: function() {
        
        //i want to draw the selection box as a rectangle, since phaser doesn't do it automatically
        //we need to postiion the rectangle around the current selection, but in the render function we only draw, no calculations should be done here
    },
    
    shutdown: function() {
        
        //now we also want the player ot return to whatever he was doing, so set him back to his original position
        this.loadPlayerOverworldOrientation();
        
        //once again we don't want the game to destroy the player
        game.world.remove(player.sprite);
    },
};