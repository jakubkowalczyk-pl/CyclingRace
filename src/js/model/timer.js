/**
 * @constructor
 */
var Timer = function(){
    /**
     * @type {Date}
     */
    this.value = new Date(0);
    
    /**
     * @type {number|null}
     */
    this.interval = null;
};

Timer.prototype = {
    constructor: Timer,
    
    start: function(){
        var self = this;
        
        this.interval = setInterval(function(){
            self.value.setMilliseconds(self.value.getMilliseconds() + 1000);
        }, 1000);
    },
    
    stop: function(){
        clearInterval(this.interval);
    }
};