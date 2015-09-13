/**
 * @type {PeriodicUpdater}
 */
var PeriodicUpdater = (function(){
    /**
     * @constructor
     */
    var PeriodicUpdater = function(){
        var self = this;
        
        this.update = function(){};
        setInterval(function(){
            self.update();
        }, 40);
    };

    PeriodicUpdater.prototype = {
        constructor: PeriodicUpdater,

        /**
         * @param {Function} fn
         */
        add: function(fn){
            var update = angular.copy(this.update);

            this.update = function(){
                update();
                fn();
            };
        }
    };

    return new PeriodicUpdater();
})();