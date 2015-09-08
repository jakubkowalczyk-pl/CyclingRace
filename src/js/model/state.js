/**
 * @constructor
 */
var State = function(){
    /**
     * @param {string} name
     */
    this.name = State.LOADING;
};

State.MENU = 'Menu';
State.RACE = 'Race';
State.LOADING = 'Loading';

State.prototype = {
    constructor: State,
    
    /**
     * @param {string} name
     */
    set: function(name){
        this.name = name;
    }
};