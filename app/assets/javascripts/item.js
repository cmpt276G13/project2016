// //effects of a potion

// //define an item
// //items all have a name that is displayed
// //a description that is also displayed
// //and an id, used to access it from the database
// //basically loaded from the database
// function createItem(name, quantity) {
    
//     item = {};
//     //load object from json file
//     item = game.cache.json(name);
//     item.quantity = quantity;
    
//     return item;
// }

// //player load items function
// player.load(arrayOfItemsFromRails) {
    
//     //each element of array is {name, quantity}
//     for(var i = 0; i < arrayOfItemsFromRails.length; ++i) {
        
//         var name = arrayOfItemsFromRails[i].name;
//         var quantity = arrayOfItemsFromRails[i].quantity;
        
//         var item = createItem(name, quantity);
//         this.items[name] = item;
//     }
// }

// //potion in json file
// potion {
    
//     description: "a drink that restores 10 hp",
//     effect: "restoreStats",
    
//     //restore stats needs a stat parameter that
//     stats: {
        
//         health: 10
//     }
// }

// //item object in game
//  {
    
//   //stuff from the potion object
//   quantity: 2;
// }

// player.items = {
    
//     potion: {
        
//         //potion object above
//     }
// };

// rpgEntity.capStats = function() {
    
//     //go through all stats that have an upper limit and apply the limit
//     this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
//     this.currentMana = Math.min(this.currentMana, this.maxMana);
// }

// rpgEntity.restoreEntityStats = function(statObject) {
    
//     for(stat in statObject) {
        
//         this[stat] += statObject[stat];
//     }
    
//     this.capStats();
// }

// player.useItem("potion") {
    
//     var itemBeingUsed = this.items[itemName];
    
//     //determine what function should be called
//     if(itemBeingUsed.effect == restoreStats) {
        
//         this.restoreEntityStats(itemBeingUsed.stats);
//     }
// }


// //when player saves
// {
//     //create an array for the rails database
//     items = [];
    
//     for(item in this.items) {
        
//         var obj = {};
//         obj.name = item;
//         obj.quantity = this.items[item].quantity;
        
//         items.push(obj);
//     }
    
//     //send to rails
// }