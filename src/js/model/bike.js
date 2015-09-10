/**
 * @constructor
 * @extends OnRouteObject
 * @param {object} bike
 * @param {Route} bike.route
 */
var Bike = function(bike){    
    OnRouteObject.call(this, bike);

    /**
     * Number of rotates per second
     * @type {number}
     */
    this.cadence = 0;

    /**
     * The highest gear in rear derailleur
     * @type {number}
     */
    this.maxRearDerailleur = 10;

    /**
     * Current gear in rear derailleur
     * @type {number}
     */
    this.rearDerailleur = 4;

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
     * @type {BikeControl}
     */
    this.control = new BikeControl({
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
     * @type {Date|null}
     */
    this.prevCrankMove = null;
};

Bike.prototype = angular.extend(OnRouteObject.prototype, {
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
        this.prevCrankMove = null;
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
        this.prevCrankMove = null;
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
            var
                currentTime = new Date(),
                interval = this.prevCrankMove ? currentTime - this.prevCrankMove : 0,
                move = 1.5 * Math.round(.75 * (14 - 1.3 * this.rearDerailleur) + .15 * this.speed);

            this.prevCrankMove = currentTime;
            if(interval){
                this.cadence = Math.min(move / 360 * 60000 / interval, this.biker.maxCadence);
                this.speed += .01 * Math.sqrt(this.rearDerailleur) * this.cadence / 4 * interval / this.pressingInterval;
                this.distance += this.speed * interval / 3600;
            }
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
});
