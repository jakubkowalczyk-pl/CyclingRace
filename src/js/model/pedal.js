app.factory('cyclingRace.Pedal', function(){
    /**
     * @constructor
     * @param {object} [pedal={}]
     * @param {number} [pedal.position=0] min 0, max 360 degrees
     */
    var Pedal = function(pedal){
        pedal = pedal || {};

        /**
         * @type {number}
         */
        this.position = pedal.position || 0;
    };

    /**
     * @type {number}
     */
    Pedal.POSITION_UP = 0;

    /**
     * @type {number}
     */
    Pedal.POSITION_DOWN = 180;

    Pedal.prototype = {
        constructor: Pedal
    };

    return Pedal;
});