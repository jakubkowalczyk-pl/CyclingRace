/**
 * @constructor
 * @param {object} resistanceForces
 * @param {object} resistanceForces.object
 * @param {number} resistanceForces.object.speed
 */
var ResistanceForces = function(resistanceForces){
    /**
     * @type {number}
     */
    this.object = resistanceForces.object;

    setInterval(function(){
        resistanceForces.object.speed *= .92;
    }, 800);
};

ResistanceForces.prototype = {
    constructor: ResistanceForces
};