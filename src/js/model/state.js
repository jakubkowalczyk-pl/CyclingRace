/**
 * @constructor
 */
var State = function(){
    /**
     * @param {string} name
     */
    this.name = State.MENU;
};

State.MENU = 'Menu';
State.RACE = 'Race';

State.prototype = {
    constructor: State,
    
    /**
     * @param {string} name
     */
    set: function(name){
        this.name = name;
    }
};