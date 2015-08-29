/**
 * @constructor
 * @param {object} biker
 * @param {string} biker.name
 * @param {Bike} biker.bike
 */
var Biker = function(biker){
    this.name = biker.name;
    this.bike = biker.bike;
    this.maxCadence = 80;
};

Biker.prototype = {
    constructor: Biker
};