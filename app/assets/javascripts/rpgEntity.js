//given an attacker's power attribute, and a defender's defense attribute, this function will calculate the damage received by teh defender
//attackPower is a number, and you can use any entity attribute to represent the power
//for example, a normal attack might use an etities strength, while a magic attack might use their magic power
//same applies for the defender
//this is a general use function meant to calcualte damage for any time of object
//this can be extended to incorporate a damage range so it can calculate a random damage
function determineDamage(attack, defender, attackType) {
    
    var defense = defender.defense;
    
    if(attackType == "magic") {
        
        defense = defender.magicDefense;
    }
    
    return Math.floor(clamp(attack.power - defense / 2, 1, attack.power));
}

function rpgEntity() {
    
    //all stats here are defaults, they will all be overridden when data is loaded from the database, or monster json files.
    this.maxHealth = 25;
    this.health = 25;
    this.maxMana = 25;
    this.mana = 25;
    this.magicPower = 10;
    this.magicDefense = 10;
    this.strength = 10;
    this.defense = 10;
    this.level = 1;
    this.name = "Player";//default name is set to player. monster data loaded from json files will set thier name, player will load his name from database
    this.shouldDelete = false;
    
    //store the last attack used by this entity
    //this will be an attack object as defined below
    //this is used to animate attacks after they are used, and for damage calculation
    this.lastUsedAttack = {};
};

//uses the given attackData to create an attack, and sets lastUsedAttack to the created attack
//when the attack animations finishes, lastUSedAttack will have a flag that to indicate the attack display is complete
rpgEntity.prototype.useAttack = function(targets, attackData) {
    
    //for skills that have mutliple targets, the targetPosition will be the average position
    var x = 0;
    var y = 0;
    
    for(var i = 0; i < targets.length; ++i) {
        
        x += targets[i].sprite.x;
        y += targets[i].sprite.y;
    }
    
    x /= targets.length > 0 ? targets.length : 1;
    y /= targets.length > 0 ? targets.length : 1;
    
    var attack = createAttack(this, {x: x, y: y}, attackData);
    attack.isFinished = false;
    this.lastUsedAttack = attack;
    attack.onUse(this);
};

rpgEntity.prototype.getHit = function(damageReceived) {
    
    this.health = clamp(this.health - damageReceived, 0, this.maxHealth);
};

rpgEntity.prototype.capStats = function() {
    
    this.health = Math.min(this.health, this.maxHealth);
}

function markForDeletion() {
    
    this.shouldDelete = true;
};

//makes monster start their death animation, sets the call back function
function startDeathAnimation(dyingEntity) {
    
    //start death animation, make entity fade to black as well
    //when it finishes fading, it will be marked for deletion
    tween = game.add.tween(dyingEntity.sprite).to({alpha: 0});
    tween.onComplete.add(markForDeletion, dyingEntity);
    tween.delay(600);
    tween.start();
    dyingEntity.sprite.animations.play("dying");
};

//creates an attack object given the attack data below
//this function will set up all the animation call backs for the animation to play
//user and target are rpg entities
//all skills should also have a onUse function, that defines what happens whwen it is called
//this would just put the skill at its starting location, and begin the appropriate animation
//the on use function will take in the user rpg entity as an argument
function createAttack(user, targetPosition, attackData) {
    
    var attack = {};
    
    //create a copy of attackData because you don't want to modify the original skill
    for(trait in attackData) {
        
        attack[trait] = attackData[trait];
    }
    
    attack.onUse = function(user){user.sprite.animations.play(attack.userAnimation)};
    
    //if the attack doesn't have an animation, no need to create its own animation
    //instead it uses the user's attack animation, and when the animaton finishes, the attack is finished
    if(attack.hasOwnAnimation == false) {
        
        user.sprite.animations.getAnimation(attack.userAnimation).onComplete.addOnce(function(){this.isFinished = true;}, attack);
        
        return attack;
    }
    
    //load spritesheet for animation
    //set position to whereever the casted spell should start
    var sprite = game.add.sprite(user.sprite.x, user.sprite.y, attack.spriteKey, 0);
    attack.sprite = sprite;
    
    //setup the animation
    var create = sprite.animations.add("create", attack.animations["create"].frames, attack.animations["create"].speed);
    var update = sprite.animations.add("update", attack.animations["update"].frames, attack.animations["update"].speed);
    var destroy = sprite.animations.add("destroy", attack.animations["destroy"].frames, attack.animations["destroy"].speed);
    
    create.onComplete.addOnce(function(){this.sprite.animations.play("update"); }, attack);
    destroy.onComplete.addOnce(function(){this.isFinished = true; this.sprite.destroy()}, attack);
    
    //setup behaviour 
    if(attackData.behaviour == "projectile") {
        
        update.loop = true;
        
        //when fireball is created, fly towards target
        var tween = game.add.tween(sprite);
        
        tween.to({x: targetPosition.x, y: targetPosition.y});
        tween.onComplete.addOnce(function(){this.sprite.animations.play("destroy");}, attack);
        attack.tween = tween;
        
        update.onStart.addOnce(function(){this.tween.start() }, attack);
        
        //begin creating fireball while user is doing his casting animation
        user.sprite.animations.getAnimation(attack.userAnimation).onStart.addOnce(function(){this.sprite.animations.play("create") }, attack)
    }
    
    //power of the attack is calculated based on what type of attack it is
    //physical and magic attacks result in different power calculation
    if(attack.attackType == "physical") {
        
        attack.power = attack.power + user.strength / 2;
        
    } else if(attack.attackType == "magic") {
        
        attack.power = attack.power + user.magicPower / 2;
    }
    
    return attack;
};



//attack type determines what stats to use for damage calculation
//it also determines which animation frame to use
//physical attacks have a different animation than magic attacks
var attackType = {
    
    PHYSICAL: 0,
    MAGIC: 1
};

/*

all the skills beyond this point should be in a json file
for now i'll leave it here
*/
//attack objects, for now i'll just have a basic attack
function basicAttack() {
    
    this.power = 5;
    this.targetsHit = 5;
    this.manaCost = 0;
    this.hasOwnAnimation = false;//skills that have their own animation require an additional sprite
    
    this.attackType = attackType.PHYSICAL;
    
    //flag used to check if the skill has finished animating, and we can move from the dispalying attack state to the attack results state
    this.isFinished = false;
    
    //since this skill doesn't have its own animations, we have no reason to define animation data
    //or how it behaves, since it has no sprite to manipulate
};

//we need to define how the skill behaves
//this is so we know when the skill finishes, and how to move it around
//some skills, like the fireball, should end when they hit their target
//other skillss might just play an animation and end when the animation finishes, without moving at all
//maybe they just appear on top of the target
//so we define a spellBehaviour
var skillBehaviour = {
    
    PROJECTILE: 0,
    STATIONARY: 1
};

//simple physical attack that requires a seperate animation
function slash() {
    
    this.power = 10;
    this.targetsHit = 2;
    this.manaCost = 4;
    this.hasOwnAnimation = true;
    
    this.attackType = attackType.PHYSICAL;
    
    //flag used to check if the skill has finished animating, and we can move from the dispalying attack state to the attack results state
    this.isFinished = false;
    
    //this string defines a key to the phaser resource cache
    //it refers to a sprite sheet that should be used for this attack
    this.spriteKey = 'slash';
    
    //skill needs its own animation
    //every skill animation has 3 parts
    //create is the animation that plays when the spell first starts
    //a update animation, that plays while the skill is still alive
    //and a destroy animation, that plays when the spell ends
    this.animations = {
        
        create: {frames: [0, 1, 2, 3, 4, 5], speed: 5},
        update: {frames: [6, 7, 8, 9, 10], speed: 5},
        destroy: {frames: [12, 13, 14, 15, 16], speed: 5}
    };
    
    //finally we need to define how the spell behaves
    //this is so we know when the spell finishes
    //some spells, like the fireball, should end when they hit their target
    //other spells might just play an animation and end when the animation finishes
    //so we define a spellType
    this.behaviour = skillBehaviour.STATIONARY;
};

//simple magic attaack, that is not goign to be put into the game.
//i have this here to show what properties a magic attack should have
function fireball() {
    
    this.power = 10;
    this.targetsHit = 2;
    this.manaCost = 3;
    this.hasOwnAnimation = true;
    
    this.attackType = attackType.MAGIC;
    
    this.isFinished = false;
    
    //this string defines a key to the phaser resource cache
    //it refers to a sprite sheet that should be used for this attack
    this.spriteKey = 'fireball';
    
    //skill needs its own animation
    //every skill animation has 3 parts
    //create is the animation that plays when the spell first starts
    //a update animation, that plays while the skill is still alive
    //and a destroy animation, that plays when the spell ends
    this.animations = {
        
        create: {frames: [0, 1, 2, 3, 4, 5], speed: 5},
        update: {frames: [6, 7, 8, 9, 10], speed: 5},
        destroy: {frames: [12, 13, 14, 15, 16], speed: 5}
    };
    
    this.behaviour = skillBehaviour.PROJECTILE;
};

