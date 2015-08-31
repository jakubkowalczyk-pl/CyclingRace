/**
 * @constructor
 * @param {object} bike
 * @param {Route} bike.route
 */
var Bike = function(bike){
    var self = this;
    
    /**
     * @type {number}
     */
    this.speed = 0;

    /**
     * Number of rotates per second
     * @type {number}
     */
    this.cadence = 0;
    
    /**
     * @type {number} in meters
     */
    this.distance = 0;

    /**
     * The highest gear in rear derailleur
     * @type {number}
     */
    this.maxRearDerailleur = 10;

    /**
     * Current gear in rear derailleur
     * @type {number}
     */
    this.rearDerailleur = 1;

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
     * @type {number|null}
     */
    this.pressingLeftPedal = null;

    /**
     * @type {number|null}
     */
    this.pressingRightPedal = null;

    /**
     * @type {number}
     */
    this.pressingInterval = 40;

    /**
     * @type {Biker|null}
     */
    this.biker = null;

    /**
     * @type {Gravity}
     */
    this.gravity = new Gravity({
        object: this
    });
    
    /**
     * @type {Route}
     */
    this.route = bike.route;
    console.log(this.route);
    
    /**
     * @type {Timer}
     */
    this.timer = new Timer();
    
    this.timer.start();
    setInterval(function(){
        self.distance += self.speed * 1000 / 60 / 60 / 25;
        if(self.distance >= self.route.distance){
            self.timer.stop();
        }
    }, 40);
};

Bike.prototype = {
    constructor: Bike,

    pressLeftPedal: function(){
        var bike = this;

        if(this.pressingRightPedal){
            this.stopPressPedals();
        }
        else if(!this.pressingLeftPedal){
            this.pressingLeftPedal = setInterval(function(){
                bike.rotateCrank(bike.leftPedal);
            }, this.pressingInterval);
        }
    },

    stopPressLeftPedal: function(){
        clearInterval(this.pressingLeftPedal);
        this.pressingLeftPedal = null;
        this.cadence = 0;
    },

    pressRightPedal: function(){
        var bike = this;

        if(this.pressingLeftPedal){
            this.stopPressPedals();
        }
        else if(!this.pressingRightPedal){
            this.pressingRightPedal = setInterval(function(){
                bike.rotateCrank(bike.rightPedal);
            }, this.pressingInterval);
        }
    },

    stopPressRightPedal: function(){
        clearInterval(this.pressingRightPedal);
        this.pressingRightPedal = null;
        this.cadence = 0;
    },

    pressBrake: function(){
        this.speed = 0;
    },

    rearDerailleurUp: function(){
        this.rearDerailleur = Math.min(this.rearDerailleur+1, this.maxRearDerailleur);
    },

    rearDerailleurDown: function(){
        this.rearDerailleur = Math.max(this.rearDerailleur-1, 1);
    },

    /**
     * @param {Pedal} pedal
     */
    rotateCrank: function(pedal){
        if(pedal.position < Pedal.POSITION_DOWN){
            var move = Math.round((10 + this.speed)/this.rearDerailleur*2);

            this.cadence = Math.min(move / 360 * 60000 / this.pressingInterval, this.biker.maxCadence);
            this.speed += 0.1 * Math.sqrt(this.rearDerailleur);
            this.leftPedal.position += move;
            this.rightPedal.position += move;
            if(pedal.position > Pedal.POSITION_DOWN){
                pedal.position = Pedal.POSITION_DOWN;
            }
            if(this.leftPedal.position >= 360){
                this.leftPedal.position = 0;
            }
            if(this.rightPedal.position >= 360){
                this.rightPedal.position = 0;
            }
        }
        else {
            this.cadence = 0;
        }
    },

    stopPressPedals: function(){
        this.stopPressLeftPedal();
        this.stopPressRightPedal();
    }
};