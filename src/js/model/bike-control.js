/**
 * @constructor
 * @param {object} control
 * @param {Bike} control.bike
 */
var BikeControl = function(control){
    angular.element(document).bind('keydown', function(event){
        switch(event.keyCode){
            case 37:
                control.bike.pressLeftPedal();
                break;
            case 39:
                control.bike.pressRightPedal();
                break;
            case 35:
                control.bike.pressBrake();
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
            case 38:
                control.bike.rearDerailleurUp();
                break;
            case 40:
                control.bike.rearDerailleurDown();
                break;
        }
    });
};

BikeControl.prototype = {
    constructor: BikeControl
};