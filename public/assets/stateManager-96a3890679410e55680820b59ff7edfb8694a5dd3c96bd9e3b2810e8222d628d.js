//a substate object that handles functionality during a state
//its pretty much just a container for different functions that are called during certain game states
//it also stores the context under which the given functions should be called
function subState() {
    
    
};

//adds a function of the given name to the state
//look at the state manager function calls to figure out what names to use
//generally it should be named on'Action'
subState.prototype.addFunction = function(functionName, functionImplementation, contextToCall) {
    
    //adds the given function as an object to the state
    //the object has two properties, the actual function, and the context to call the function in
    this[functionName] = {func: functionImplementation, context: contextToCall};
};

//a sub state system that can be used at each major game state
//ignore for now if you don't know what a game state is, and read below
function stateManager() {
    
    //associative array of states
    this.states = {};
    this.currentState = "";
};

//adds the given state to the state manager
//state name is the name used to identify the state (key to a hash)
//state is the state object
stateManager.prototype.addState = function(stateName, state) {
    
    this.states[stateName] = state;
};

//calls the exit function of all of the states
//its a good idea to call this once all the states have been created
stateManager.prototype.exitAll = function() {
    
    for(current in this.states) {
        
        if(typeof this.states[current].onExit !== "undefined") {
            
            this.states[current].onExit.func.call(this.states[current].onExit.context);
        }
    }
};

//switch from one state to another, this will exit current state, and switch to given state
//targetStateName is the name of the state you want to change to
//undefine behaviour if the target state hasn't been created
stateManager.prototype.changeState = function(targetStateName) {
    
    //first exit the current state
    this.onExit();
    this.currentState = targetStateName;
    
    if(typeof this.states[this.currentState].onEnter !== "undefined") {
        
        this.states[targetStateName].onEnter.func.call(this.states[targetStateName].onEnter.context);
    }
    
};

stateManager.prototype.onExit = function() {
    
    if(this.currentState != "" && typeof this.states[this.currentState].onExit !== "undefined") {
        
        this.states[this.currentState].onExit.func.call(this.states[this.currentState].onExit.context);
    }
};

//calls the update function of the current state
stateManager.prototype.onUpdate = function() {
    
    if(typeof this.states[this.currentState].onUpdate !== "undefined") {
        
        this.states[this.currentState].onUpdate.func.call(this.states[this.currentState].onUpdate.context);
    }
};

stateManager.prototype.onKeystates = function() {
    
    if(typeof this.states[this.currentState].onKeystates !== "undefined") {
        
        this.states[this.currentState].onKeystates.func.call(this.states[this.currentState].onKeystates.context);
    }
};

stateManager.prototype.onKeyDown = function(key) {
    
    if(typeof this.states[this.currentState].onKeyDown !== "undefined") {
        
        this.states[this.currentState].onKeyDown.func.call(this.states[this.currentState].onKeyDown.context, key);
    }
};


//add states when given a 'state template'.
//a state template is an array of objects, each object looks like this:
/*
name: "stateName"
functions: {
    functionName: functionToCall,
    functionName: functionToCall
}
*/
//for an example of a template, see battle state
//we will use state templates to quickly generate all the required states
//its not required, and you can manually create your own state objects
//but its a lot easier to just add states to the template, and this function will autoamitcally add the state to the manager
stateManager.prototype.addFromTemplate = function(template, context) {
        
    //go through all the states and add them
    for(var i = 0; i < template.length; ++i) {
        
        var state = new subState();
        
        //set the functions for this state
        for(functionName in template[i].functions) {
            
            state.addFunction(functionName, template[i].functions[functionName], context);
        }
        
        this.addState(template[i].name, state);
    }
};
