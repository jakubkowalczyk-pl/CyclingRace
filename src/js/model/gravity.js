/**
 * @constructor
 * @param {object} gravity
 * @param {object} gravity.object
 * @param {number} gravity.object.speed
 */
var Gravity = function(gravity){
    /**
     * @type {number}
     */
    this.object = gravity.object;

    setInterval(function(){
        gravity.object.speed = Math.max(0, gravity.object.speed-1);
    }, 800);
};

Gravity.prototype = {
    constructor: Gravity
};