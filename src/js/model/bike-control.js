/**
 * @constructor
 * @param {object} control
 * @param {Bike} control.bike
 */
var BikeControl = function(control){
    angular.element(document).bind('keydown', function(event){
        switch(event.keyCode){
            case 37: // Left arrow
                control.bike.turnLeft();
                break;
            case 39: // Right arrow
                control.bike.turnRight();
                break;
            case 88: // x
                control.bike.pressLeftPedal();
                break;
            case 67: // c
                control.bike.pressRightPedal();
                break;
            case 35: // End
                control.bike.pressBrake();
                break;
        }
    }).bind('keyup', function(event){
        switch(event.keyCode){
            case 88: // x
                control.bike.stopPressLeftPedal();
                break;
            case 67: // c
                control.bike.stopPressRightPedal();
                break;
            case 38: // Up arrow
                control.bike.rearDerailleurUp();
                break;
            case 40: // Down arrow
                control.bike.rearDerailleurDown();
                break;
        }
    });
};

BikeControl.prototype = {
    constructor: BikeControl
};