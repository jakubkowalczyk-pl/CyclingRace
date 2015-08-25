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