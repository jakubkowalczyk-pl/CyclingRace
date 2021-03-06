/**
 * @constructor
 * @param {object} onRouteObject={}
 * @param {Route} onRouteObject.route
 */
var OnRouteObject = function(onRouteObject){
    var self = this;
    
    /**
     * @type {Route}
     */
    this.route = onRouteObject.route;
    
    /**
     * @type {number}
     */
    this.speed = 0;
    
    /**
     * @type {number} in meters
     */
    this.distance = 0;

    /**
     * @type {ResistanceForces}
     */
    this.resistanceForces = new ResistanceForces({
        object: this
    });
    
    /**
     * @type {Boolean}
     */
    this.onRoad = true;
    
    /**
     * @type {Timer}
     */
    this.timer = new Timer();
    
    setInterval(function(){
        if(self.distance >= self.route.distance){
            self.timer.stop();
        }
    }, 1000);
};

OnRouteObject.prototype = {
    constructor: OnRouteObject,

    pressBrake: function(){
        this.speed = 0;
    }
};