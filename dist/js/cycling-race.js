/*!
* CyclingRace v1.0.0
* http://jgallery.jakubkowalczyk.pl/
*
* Date: 2015-08-29
*/
( function() {
    "use strict";
    
    var app = angular.module('cyclingRace', []);
    
    var CyclingRace = {};
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
/**
 * @constructor
 * @param {object} biker
 * @param {string} biker.name
 * @param {Bike} biker.bike
 */
var Biker = function(biker){
    this.name = biker.name;
    this.bike = biker.bike;
    this.maxCadence = 80;
};

Biker.prototype = {
    constructor: Biker
};
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

Control.prototype = {
    constructor: Control
};
/**
 * @constructor
 * @param {object} gravity
 * @param {object} gravity.object
 * @param {number} gravity.object.speed
 */
var Gravity = function(gravity){
    /**
     * @type {number}
     */
    this.object = gravity.object;

    setInterval(function(){
        gravity.object.speed = Math.max(0, gravity.object.speed-1);
    }, 800);
};

Gravity.prototype = {
    constructor: Gravity
};
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
/**
 * @construcotr
 * @param {Bike} bike
 */
var View = function( bike ){
    var self = this;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.sky = this.createSky();
    this.grass = this.createGrass();
    this.road = this.createRoad();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.body.appendChild( this.renderer.domElement );

    this.road.translateZ(0.000001);

    this.grass.add( this.road );

    this.grass.rotateOnAxis(new THREE.Vector3(-1,0,0), 1.5);
    this.grass.translateY(-10);

    this.scene.add( this.sky );
    this.scene.add( this.grass );

    this.camera.position.z = 1.25;

    setInterval(function(){
        var offsetDiff = bike.speed * .001;
        
        self.road.texture.offset.y += offsetDiff;
        self.grass.texture.offset.y += offsetDiff;
    }, 40);
};

View.prototype = {
    body: document.querySelectorAll('body')[0],

    createSky: function(){
        return new THREE.Mesh(
            new THREE.PlaneGeometry( 10, 20, 32 ),
            new THREE.MeshBasicMaterial({
                map: (function(){
                    var texture = THREE.ImageUtils.loadTexture( "./img/sky.jpg" );

                    texture.wrapS = THREE.RepeatWrapping; 
                    texture.wrapT = THREE.RepeatWrapping; 
                    texture.repeat.set( 1, 4.001 );

                    return texture;
                })()
            })
        );
    },

    createGrass: function(){
        var grassTexture = (function(){
                    var texture = THREE.ImageUtils.loadTexture( "./img/grass.jpg" );

                    texture.wrapS = THREE.RepeatWrapping; 
                    texture.wrapT = THREE.RepeatWrapping; 
                    texture.repeat.set( 12, 60 );

                    return texture;
                })();

        var grass = new THREE.Mesh(
            new THREE.PlaneGeometry( 10, 20, 32 ),
            new THREE.MeshBasicMaterial({
                map: grassTexture
            })
        );

        grass.texture = grassTexture;

        return grass;
    },

    createRoad: function(){
        var roadTexture = (function(){
                    var texture = THREE.ImageUtils.loadTexture( "./img/Asphalt-913.jpg" );

                    texture.wrapS = THREE.RepeatWrapping; 
                    texture.wrapT = THREE.RepeatWrapping; 
                    texture.repeat.set( 2, 60 );

                    return texture;
                })();

        var road = new THREE.Mesh(
            new THREE.PlaneGeometry( .5, 20, 32 ),
            new THREE.MeshBasicMaterial({
                map: roadTexture
            })
        );

        road.texture = roadTexture;

        return road;
    }
};
app.directive('cyclingRace', [function(){
    return {
        link: function(scope){
            /**
             * @type {Biker[]}
             */
            scope.bikers = [];
            
            scope.bikers.push(new Biker({
                name: 'Player1',
                bike: new Bike()
            }));
            
            scope.bikers[0].bike.biker = scope.bikers[0];
            
            var view = new View( scope.bikers[0].bike );
    
            function render(){
                requestAnimationFrame( render );
                view.renderer.render( view.scene, view.camera );
            }

            render();
            
            setInterval(function(){
                scope.$digest();
            }, 40);
        }
    };
}]);
} )();