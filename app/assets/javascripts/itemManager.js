//effects of a potion

//define an item
//items all have a name that is displayed
//a description that is also displayed
//and an id, used to access it from the database
//basically loaded from the database
function createItem(name, quantity) {
    
    var item = {};
    
    //load object from json file
    item = game.cache.getJSON("itemData")[name];
    item.quantity = quantity;
    
    return item;
}

//takes the given entity and applies the given item effect to the entity
//itemName is the name of the item being used
//also takes away the item from the entity's inventory
function useItem(entity, itemName) {
    
    if(entity.items[itemName].effect == "restoreStats") {
        
        restoreStatsOnUse(entity, entity.items[itemName].stats);
    }
    
    entity.items[itemName].quantity -= 1;
    
    if(entity.items[itemName].quantity <= 0) {
        
        delete entity.items[itemName];
    }
}

//call when a stat restoration item is used
function restoreStatsOnUse(entity, statsToRestore) {
    
    for(stat in statsToRestore) {
        
        entity[stat] += statsToRestore[stat];
    }
    
    //cap all entity stats, incase restoring the stat made it exceed the max value
    entity.capStats();
}