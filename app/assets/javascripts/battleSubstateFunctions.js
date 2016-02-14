/*
The following functions are meant to be added to the BATTLE STATE's subState manager for different states.
the reason they are outside here is because i made a system in the battle state to easily add states and functions, but
to do that you need to use premade functions
functions delared as object properties are created at run time
meaning i can't assign functions to objects if the functions are declared as object properties
so i'm defining these functions outside here, instead of in teh battle state object

These functions probably WILL NOT work outside of the battle state, because they all use properties declared inside the battle state object (using the this context reference)

just pretend these functions are in the battle state, because when they're called, the context will be set to the battle state
*/

/*

The current State order is as follows

selectMainAction:  here player selects to fight, use items or run
    selectFightAction: if player chooses to fight, this state allows players to choose to attack, or use skills
    
if player chooses to attack

playerSelectTarget: choose an monster to attack (if we have multiple monsters)

after an monster is chosen

playerAttack: plays the player attacking animation, animate skills, etc, it will automatically leave this state because of a listener event attached to player animation
playerAttackResults: this displays what happened with the player's attack, wether it hit or miss, how much damage it did
cullDeadMonsters: here the game cecks if any monsters died, if they did then the game starts the enemeis' death animation, once their animation finishes it goes to next state, and removes monsters
    
    if all monsters are dead, it will go to the victory state, which displays some message, and then exits battle

monsterTurn: the current monster, marked by curerntMonster, chooses an action
monsterAttack: if monster chose to attack it will play attack animation, same as player
monsterAttackResults: same as player

then it goes back to selectMAinAction

*/
function selectMainActionEnter() {
    
    this.mainActionsDisplay.selectedAction = 0;
    this.mainActionsDisplay.selectionDisplay.visible = true;
            
    this.showMessage("Select an action");
};

function selectMainActionExit() {
    
    this.mainActionsDisplay.selectionDisplay.visible = false;
    this.hideMessage();
};

function selectMainActionKeyDown(key) {
    
    actionDisplayKeyDown(key, this.mainActionsDisplay);
    
    //execute the action the user has chosen
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        //we would like to return to the main map if player selected run
        if(this.mainActionsDisplay.actionTexts[this.mainActionsDisplay.selectedAction].text == "run") {
            
            game.state.start('overworld');
        }
        
        if(this.mainActionsDisplay.actionTexts[this.mainActionsDisplay.selectedAction].text == "fight") {
            
            this.stateManager.changeState("selectFightAction");
        }
    }
};

function selectMainActionUpdate() {
    
    this.mainActionsDisplay.highlightSelectedAction();
};

function selectFightActionEnter() {
    
    this.fightActionsDisplay.selectedAction = 0;
    this.fightActionsDisplay.background.visible = true;
            
    this.showMessage("Select an action");
};

function selectFightActionExit() {
    
    this.fightActionsDisplay.background.visible = false;
    this.hideMessage();
};

function selectFightActionKeyDown(key) {
    
    actionDisplayKeyDown(key, this.fightActionsDisplay);
        
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        //we would like to return to the main map if player selected run
        if(this.fightActionsDisplay.actionTexts[this.fightActionsDisplay.selectedAction].text == "cancel") {
            
            this.stateManager.changeState("selectMainAction");
        }
        
        if(this.fightActionsDisplay.actionTexts[this.fightActionsDisplay.selectedAction].text == "attack" && this.monsters.length > 0) {
            
            player.useAttack(new basicAttack());
            this.stateManager.changeState("playerSelectTarget");
        }
    }
};

function selectFightActionUpdate() {
    
    this.fightActionsDisplay.highlightSelectedAction();
};

function playerSelectTargetEnter() {
    
    this.monsterSelector.startSelectionProcess(this.monsters, player.lastUsedAttack.targetsHit);
    this.showMessage("Select " + player.lastUsedAttack.targetsHit.toString() + " monster(s) to attack");
};

function playerSelectTargetExit() {

    this.monsterSelector.highlighter.hideHighlights();
    this.hideMessage();
};

function playerSelectTargetKeyDown(key) {
    
    if(key.keyCode == Phaser.Keyboard.UP || key.keyCode == Phaser.Keyboard.LEFT) {
        
        this.monsterSelector.selectPrevious(this.monsters);
    }
    
    if(key.keyCode == Phaser.Keyboard.DOWN || key.keyCode == Phaser.Keyboard.RIGHT) {
        
        this.monsterSelector.selectNext(this.monsters);
    }
    
    if(key.keyCode == Phaser.Keyboard.ENTER) {
        
        this.monsterSelector.addCurrentSelection(this.monsters);
    }
    
    if(this.monsterSelector.isSelectionFinished()) {
                
        this.stateManager.changeState("playerAttack");
    }
};

function playerSelectTargetUpdate() {
    
    
};

function playerAttackEnter() {
    
    this.showMessage("You Attack!");
    
    //when player finishes his attack animation we will damage the monster
    player.sprite.events.onAnimationComplete.add(function(){this.stateManager.changeState("playerAttackResults"); }, this);
    player.sprite.animations.play("attack");
};

function playerAttackExit() {
    
    player.sprite.events.onAnimationComplete.removeAll();
    this.hideMessage();
};


function playerAttackResultsEnter() {
    
    //damage all the monsters
    var indicesDamagedMonsters = this.monsterSelector.selectedMonstersIndices;
    
    for(var i = 0; i < indicesDamagedMonsters.length; ++i) {
        
        var damage = this.determineAttackResults(player.lastUsedAttack, this.monsters[indicesDamagedMonsters[i]]);
    
        //get damage received by this entity
        this.damageTexts.push(this.createDamageText(this.monsters[indicesDamagedMonsters[i]], damage) );
    }
};

function playerAttackResultsExit() {
    
    this.clearDamageTexts();
    this.hideMessage();
};

function playerAttackResultsUpdate() {
    
    var moveToNextState = this.finishedDisplayingResults();
    
    if(moveToNextState) {
        
        this.stateManager.changeState("cullDeadMonsters");
    }
};

function cullDeadMonstersEnter() {
    
    this.startMonsterDeathAnimation();
};

function cullDeadMonstersExit() {
    
    this.hideMessage();
};

function cullDeadMonstersUpdate() {
    
    var removedAllMarkedEntites = this.deleteMarkedEntities(this.monsters);
            
    if(removedAllMarkedEntites && this.monsters.length == 0) {
        
        //go to victory
        this.stateManager.changeState("selectMainAction");
    }
    
    if(removedAllMarkedEntites && this.monsters.length > 0) {
        
        //monster turn start
        this.currentMonster = 0;
        this.stateManager.changeState("monsterTurn");
    }
};

function monsterTurnEnter() {
    
    //randomly determine what the monster should do
    //for now he just attacks
    this.monsters[this.currentMonster].sprite.events.onAnimationComplete.add(function(){this.stateManager.changeState("monsterAttackResults"); } , this);
    this.monsters[this.currentMonster].sprite.animations.play("attack");
    this.monsters[this.currentMonster].useAttack(new basicAttack());
    
    this.showMessage(this.monsters[this.currentMonster].name + " attacks!");
};

function monsterTurnExit() {
    
    if(this.currentMonster < this.monsters.length) {
        
        this.monsters[this.currentMonster].sprite.events.onAnimationComplete.removeAll();
    }

    this.hideMessage();
};

function monsterAttackResultsEnter() {
    
    var damage = this.determineAttackResults(this.monsters[this.currentMonster].lastUsedAttack, player);
    this.damageTexts.push(this.createDamageText(player, damage) );
};

function monsterAttackResultsExit() {
    
    playerAttackResultsExit.call(this);
};

function monsterAttackResultsUpdate() {
    
    var moveToNextState = this.finishedDisplayingResults();
    
    if(!moveToNextState) {
        
        return;
    }
    
    this.currentMonster += 1;
    
    //no more monsters, move back to player's turn
    if(this.currentMonster >= this.monsters.length) {
    
        this.stateManager.changeState("selectMainAction");
        return;
    }
    
    //monster left, start his turn
    this.stateManager.changeState("monsterTurn");
};