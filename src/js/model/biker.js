app.factory('cyclingRace.Biker', function(){
    /**
     * @constructor
     * @param {object} biker
     * @param {string} biker.name
     * @param {Bike} biker.bike
     */
    var Biker = function(biker){
        this.name = biker.name;
        this.bike = biker.bike;
    };
    
    Biker.prototype = {
        constructor: Biker
    };
    
    return Biker;
});