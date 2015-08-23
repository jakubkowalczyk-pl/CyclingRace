/*!
* CyclingRace v1.0.0
* http://jgallery.jakubkowalczyk.pl/
*
* Date: 2015-08-21
*/
( function() {
    "use strict";
    
    var app = angular.module('cyclingRace', []);
app.factory('cyclingRace.Bike', ['cyclingRace.Pedal', 'cyclingRace.Control', '$interval', function(Pedal, Control, $interval){
    /**
     * @constructor
     */
    var Bike = function(){
        /**
         * @type {number}
         */
        this.speed = 0;
        
        /**
         * @type {Pedal}
         */
        this.leftPedal = new Pedal();
        
        /**
         * @type {Pedal}
         */
        this.rightPedal = new Pedal({
            position: 180
        });
        
        /**
         * @type {Control}
         */
        this.control = new Control({
            bike: this
        });
        
        /**
         * @type {Promise|null}
         */
        this.pressingLeftPedal = null;
        
        /**
         * @type {Promise|null}
         */
        this.pressingRightPedal = null;
    };
    
    Bike.prototype = {
        constructor: Bike,
        
        pressLeftPedal: function(){
            var bike = this;
            
            this.pressingLeftPedal = $interval(function(){
                bike.rotateCrank(bike.leftPedal);
            }, 40);
        },
        
        stopPressLeftPedal: function(){
            $interval.cancel(this.pressingLeftPedal);
        },
        
        pressRightPedal: function(){
            var bike = this;
            
            this.pressingRightPedal = $interval(function(){
                bike.rotateCrank(bike.rightPedal);
            }, 40);
        },
        
        stopPressRightPedal: function(){
            $interval.cancel(this.pressingRightPedal);
        },
        
        /**
         * @param {Pedal} pedal
         */
        rotateCrank: function(pedal){
            if(pedal.position < Pedal.POSITION_DOWN){
                this.leftPedal.position++;
                this.rightPedal.position++;
                if(this.leftPedal.position === 360){
                    this.leftPedal.position = 0;
                }
                if(this.rightPedal.position === 360){
                    this.rightPedal.position = 0;
                }
            }
        }
    };
    
    return Bike;
}]);
app.factory('cyclingRace.Biker', function(){
    /**
     * @constructor
     * @param {object} biker
     * @param {string} biker.name
     * @param {Bike} biker.bike
     */
    var Biker = function(biker){
        this.name = biker.name;
        this.bike = biker.bike;
    };
    
    Biker.prototype = {
        constructor: Biker
    };
    
    return Biker;
});
app.factory('cyclingRace.Control', function(){
    /**
     * @constructor
     * @param {object} control
     * @param {Bike} control.bike
     */
    var Control = function(control){
        angular.element(document).bind('keydown', function(event){
            switch(event.keyCode){
                case 37:
                    control.bike.pressLeftPedal();
                    break;
                case 39:
                    control.bike.pressRightPedal();
                    break;
            }
        }).bind('keyup', function(event){
            switch(event.keyCode){
                case 37:
                    control.bike.stopPressLeftPedal();
                    break;
                case 39:
                    control.bike.stopPressRightPedal();
                    break;
            }
        });
    };
    
    Control.prototype = {
        constructor: Control
    };
    
    return Control;
});
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
app.directive('cyclingRace', ['cyclingRace.Biker', 'cyclingRace.Bike', function(Biker, Bike){
    return {
        link: function(scope){
            /**
             * @type {Biker[]}
             */
            scope.bikers = [];
            
            scope.bikers.push(new Biker({
                name: 'Kubkuś',
                bike: new Bike()
            }));
        }
    };
}]);
} )();