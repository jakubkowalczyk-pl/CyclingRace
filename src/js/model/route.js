/**
 * @constructor
 * @param {object} route={}
 * @param {number} route.distance
 */
var Route = function(route){
    /**
     * @type {number}
     */
    this.distance = route.distance;
};

Route.prototype = {
    constructor: Route
};