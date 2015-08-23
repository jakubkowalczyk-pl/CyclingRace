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