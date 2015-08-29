/**
 * @constructor
 * @param {object} race={}
 * @param {Route} race.route
 * @param {Biker[]} race.bikers
 */
var Race = function(race){
    /**
     * @type {Route}
     */
    this.route = race.route;
    
    /**
     * @type {Biker[]}
     */
    this.bikers = race.bikers;
};

Race.prototype = {
    constructor: Race
};