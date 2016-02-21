//given an attacker's power attribute, and a defender's defense attribute, this function will calculate the damage received by teh defender
//attackPower is a number, and you can use any entity attribute to represent the power
//for example, a normal attack might use an etities strength, while a magic attack might use their magic power
//same applies for the defender
//this is a general use function meant to calcualte damage for any time of object
//this can be extended to incorporate a damage range so it can calculate a random damage
function determineDamage(attackPower, defenderDefense) {
    
    return Math.floor(clamp(attackPower - defenderDefense / 2, 1, attackPower));
}

function rpgEntity() {
    
    //all stats here are defaults, they will all be overridden when data is loaded from the database, or monster json files.
    this.maxHealth = 25;
    this.health = 25;
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

//sets the last used attack to the given attack
//The attack should be created with createAttack()
//calculates the power of the attack based on the entities stats
rpgEntity.prototype.useAttack = function(attack) {
    
    this.lastUsedAttack = attack;
    
    //power of the attack is calculated based on what type of attack it is
    //physical and magic attacks result in different power calculation
    if(this.lastUsedAttack.attackType == attackType.PHYSICAL) {
        
        this.lastUsedAttack.power = attack.power + this.strength / 2;
        
    } else if(this.lastUsedAttack.attackType == attackType.MAGIC) {
        
        //this.lastUsedAttack.power = attack.power + this.magicPower / 2;
    }
};

rpgEntity.prototype.getHit = function(damageReceived) {
    
    this.health = clamp(this.health - damageReceived, 0, this.maxHealth);
};

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
function createAttack(user, target, attackData) {
    
    //if the attack doesn't have an animation, no need to create its own animation
    //instead it uses the user's attack animation, and when the animaton finishes, the attack is finished
    if(attackData.hasOwnAnimation == false) {
        
        user.sprite.animations.getAnimation("attack").onComplete.addOnce(function(){this.isFinished = true;}, attackData);
        attackData.onUse = function(user){user.sprite.animations.play('attack')};
        
        return attackData;
    }
    
    //load spritesheet for animation
    var sprite = game.add.sprite(0, 0, attackData.spriteKey, 0);
    
    //setup the animation
    var create = sprite.add.animations.add("create", attackData.animations["create"].frames, attackData.animations["create"].speed);
    var update = sprite.add.animations.add("update", attackData.animations["update"].frames, attackData.animations["update"].speed);
    var destroy = sprite.add.animations.add("destroy", attackData.animations["destroy"].frames, attackData.animations["destroy"].speed);
    
    //setup the animation call backs
    create.onComplete.addOnce(function(){this.animations.play("update"); }, sprite);
    update.onComplete.addOnce(function(){this.animations.play("destroy"); }, sprite);
    destroy.onComplete.addOnce(function(){this.isFinished = true; this.sprite.destroy()}, attackData);
    
    attackData.sprite = sprite;
    
    //setup the onUse function
    //attackData.onUse = function(user){user.sprite.animati}
    
    //setup the behaviour
    /*
    We can worry about this stuff once we have skills
    if(attackData.behaviour == skillBehaviour.PROJECTILE) {
        
        
    }
    
    */
    
    return attackData;
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
