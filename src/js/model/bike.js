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
         * Number of rotates per second
         * @type {number}
         */
        this.crankSpeed = 0;
        
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
        
        /**
         * @type {number}
         */
        this.pressingInterval = 40;
    };
    
    Bike.prototype = {
        constructor: Bike,
        
        pressLeftPedal: function(){
            var bike = this;
            
            if(this.pressingRightPedal){
                this.stopPressPedals();
            }
            else if(!this.pressingLeftPedal){
                this.pressingLeftPedal = $interval(function(){
                    bike.rotateCrank(bike.leftPedal);
                }, this.pressingInterval);
            }
        },
        
        stopPressLeftPedal: function(){
            $interval.cancel(this.pressingLeftPedal);
            this.pressingLeftPedal = null;
            this.crankSpeed = 0;
        },
        
        pressRightPedal: function(){
            var bike = this;
           
            if(this.pressingLeftPedal){
                this.stopPressPedals();
            }
            else if(!this.pressingRightPedal){
                this.pressingRightPedal = $interval(function(){
                    bike.rotateCrank(bike.rightPedal);
                }, this.pressingInterval);
            }
        },
        
        stopPressRightPedal: function(){
            $interval.cancel(this.pressingRightPedal);
            this.pressingRightPedal = null;
            this.crankSpeed = 0;
        },
        
        /**
         * @param {Pedal} pedal
         */
        rotateCrank: function(pedal){
            if(pedal.position < Pedal.POSITION_DOWN){
                var move = 10;
                
                this.crankSpeed = move / 360 * 60000 / this.pressingInterval;
                this.leftPedal.position += move;
                this.rightPedal.position += move;
                if(this.leftPedal.position >= 360){
                    this.leftPedal.position = 0;
                }
                if(this.rightPedal.position >= 360){
                    this.rightPedal.position = 0;
                }
            }
            else {
                this.crankSpeed = 0;
            }
        },
        
        stopPressPedals: function(){
            this.stopPressLeftPedal();
            this.stopPressRightPedal();
        }
    };
    
    return Bike;
}]);