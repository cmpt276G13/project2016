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
    this.health = 20;
    this.strength = 10;
    this.defense = 10;
    this.level = 1;
    this.name = "Player";//default name is set to player. monster data loaded from json files will set thier name, player will load his name from database
    this.shouldDelete = false;
    
    //last used attack is the attribtues of the attack last used by this entity
    //this is used to save data about an attack, which is used for damage calculation during the damage calculation state
    //attack attributes are objects that can be found below
    this.lastUsedAttack = {};
};

//attack property holds different properties for an attack
//this is a way to seperate a skill's damage, number of monsters it hits, etc. from the skill animation and such
//the attack parameter is supposed to be some kind of skill, each skill will keep track of its traits
//i.e, if you had a magic skill called fireball, it would have the required attack properties
//the skill object wouldn't store the skill's base attributes (preset values that don't take the user's stats into account)
//and the attack property stores values after you take into account the user's level, strength, and so on
//so the user parameter is an rpgEntity object, but for now i'll ignore it
function attackProperty(attack, user) {
    
    this.power = attack.power + user.strength / 2;
    this.targetsHit = attack.targetsHit;
    this.manaCost = attack.manaCost;
};

//attack objects, for now i'll just have a basic attack
function basicAttack() {
    
    this.power = 5;
    this.targetsHit = 6;
    this.manaCost = 0;
};

//use attack simply sets the attributes of the last used attack
//it doesn't play any animations or anything
//its up to the application who called this function to play the appropriate animation
rpgEntity.prototype.useAttack = function(attack) {
    
    this.lastUsedAttack = new attackProperty(attack, this);
};

rpgEntity.prototype.getHit = function(damageReceived) {
    
    this.health = clamp(this.health - damageReceived, 0, this.health);
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