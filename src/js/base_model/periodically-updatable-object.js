/**
 * @constructor
 */
var PeriodicallyUpdatableObject = function(){
    var self = this;
    
    PeriodicUpdater.add(function(){
        self.periodicallyUpdate();
    });
};

PeriodicallyUpdatableObject.prototype = {
    constructor: PeriodicallyUpdatableObject
};