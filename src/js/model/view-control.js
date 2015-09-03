/**
 * @constructor
 * @param {object} control
 * @param {View} control.view
 */
var ViewControl = function(control){
    angular.element(document).bind('keydown', function(event){
        
        
        switch(event.keyCode){
            case 65: //a
                control.view.camera.position.x -= .1;
                break;
                
            case 68: //d
                control.view.camera.position.x += .1;
                break;
                
            case 87: //w
                control.view.camera.position.z -= .1;
                break;
                
            case 83: //s
                control.view.camera.position.z += .1;
                break;
                
            case 81: //q
                control.view.camera.rotation.y -= Math.PI/40;
                break;
                
            case 69: //e
                control.view.camera.rotation.y += Math.PI/40;
                break;
        }
    });
};

ViewControl.prototype = {
    constructor: ViewControl
};