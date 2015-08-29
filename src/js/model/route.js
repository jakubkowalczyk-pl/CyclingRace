/**
 * @constructor
 * @param {object} route={}
 * @param {number} route.distance
 */
var Route = function(route){
    /**
     * @type {number}
     */
    this.route = route.distance;
};

Route.prototype = {
    constructor: Route
};