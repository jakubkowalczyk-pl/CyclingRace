/**
 * @constructor
 * @param {object} resistanceForces
 * @param {object} resistanceForces.object
 * @param {number} resistanceForces.object.speed
 */
var ResistanceForces = function(resistanceForces){
    var self = this;
    
    /**
     * @type {number}
     */
    this.object = resistanceForces.object;
    
    /**
     * @type {Number}
     */
    this.ratio = .92;

    setInterval(function(){
        resistanceForces.object.speed *= self.ratio;
    }, 800);
};

ResistanceForces.prototype = {
    constructor: ResistanceForces
};