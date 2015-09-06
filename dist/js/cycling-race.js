/*!
* CyclingRace v1.0.0
*
* Date: 2015-09-06
*/
( function() {
    "use strict";
    
    var app = angular.module('cyclingRace', []);
/**
 * @constructor
 * @param {object} onRouteObject={}
 * @param {Route} onRouteObject.route
 */
var OnRouteObject = function(onRouteObject){
    var self = this;
    
    /**
     * @type {Route}
     */
    this.route = onRouteObject.route;
    
    /**
     * @type {number}
     */
    this.speed = 0;
    
    /**
     * @type {number} in meters
     */
    this.distance = 0;

    /**
     * @type {Gravity}
     */
    this.gravity = new Gravity({
        object: this
    });
    
    /**
     * @type {Timer}
     */
    this.timer = new Timer();
    
    setInterval(function(){
        if(self.distance >= self.route.distance){
            //self.timer.stop();
        }
    }, 1000);
};

OnRouteObject.prototype = {
    constructor: OnRouteObject,

    pressBrake: function(){
        this.speed = 0;
    }
};
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
                move = Math.round((25 - 1.3 * this.rearDerailleur) + this.speed);

            this.prevCrankMove = currentTime;
            if(interval){
                this.cadence = Math.min(move / 360 * 60000 / interval, this.biker.maxCadence);
                this.speed += 0.1 * Math.sqrt(this.rearDerailleur) * interval / this.pressingInterval;
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
 * @constructor
 * @param {object} race={}
 * @param {Route} race.route
 * @param {Biker[]} race.bikers
 */
var Race = function(race){
    /**
     * @type {Route}
     */
    this.route = race.route;
    
    /**
     * @type {Biker[]}
     */
    this.bikers = race.bikers;
};

Race.prototype = {
    constructor: Race
};
/**
 * @constructor
 * @param {object} route={}
 * @param {number} route.distance
 */
var Route = function(route){
    /**
     * @type {number}
     */
    this.distance = route.distance;
};

Route.prototype = {
    constructor: Route
};
/**
 * @constructor
 */
var State = function(){
    /**
     * @param {string} name
     */
    this.name = State.MENU;
};

State.MENU = 'Menu';
State.RACE = 'Race';

State.prototype = {
    constructor: State,
    
    /**
     * @param {string} name
     */
    set: function(name){
        this.name = name;
    }
};
/**
 * @constructor
 */
var Timer = function(){
    /**
     * @type {Date}
     */
    this.value = new Date(0);
    
    /**
     * @type {number|null}
     */
    this.interval = null;
};

Timer.prototype = {
    constructor: Timer,
    
    start: function(){
        var self = this;
        
        this.interval = setInterval(function(){
            self.value.setMilliseconds(self.value.getMilliseconds() + 1000);
        }, 1000);
    },
    
    stop: function(){
        clearInterval(this.interval);
    }
};
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
/**
 * @construcotr
 * @param {Bike} bike
 */
var View = function( bike ){
    var self = this;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();    
    this.loader = new THREE.JSONLoader();
    this.sky = this.createSky();
    this.grass = this.createGrass();
    this.road = this.createRoad();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.body.appendChild( this.renderer.domElement );

    this.road.translateZ(0.000001);

    this.grass.add( this.road );

    this.grass.rotation.x = -Math.PI/2;
    this.grass.translateY(-0);

    this.scene.add( this.sky );
    this.sky.translateY(.5);
    this.scene.add( this.grass );
    
    this.createBike();

    this.camera.position.y = .2;
    this.camera.position.z = 4.99;
    this.camera.rotateX(-Math.PI/6);
            
    function render(){
        var offsetDiff = bike.speed * .001;

        self.road.texture.offset.y += offsetDiff;
        self.grass.texture.offset.y += offsetDiff;
        requestAnimationFrame( render );
        self.renderer.render( self.scene, self.camera );
    }

    render();
            
    this.control = new ViewControl({
        view: this
    });
    
    var light = new THREE.AmbientLight( 0xcfcfcf );
    this.scene.add( light );
};

View.prototype = {
    body: document.querySelectorAll('body')[0],

    createSky: function(){
        return new THREE.Mesh(
            new THREE.PlaneGeometry( 20, 1, 32 ),
            new THREE.MeshBasicMaterial({
                map: (function(){
                    var texture = THREE.ImageUtils.loadTexture( "./img/sky.jpg" );

                    texture.wrapS = THREE.RepeatWrapping; 
                    texture.wrapT = THREE.RepeatWrapping; 
                    texture.repeat.set( 1, .2001 );

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
            new THREE.PlaneGeometry( 12, 10, 32 ),
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
            new THREE.PlaneGeometry( .5, 10, 32 ),
            new THREE.MeshBasicMaterial({
                map: roadTexture
            })
        );

        road.texture = roadTexture;

        return road;
    },
    
    createBike: function(){
        var self = this;
        
        this.loader.load(
            './models/bike.json',
            function ( geometry, materials ) {
                var material = new THREE.MeshFaceMaterial( materials );
                var object = new THREE.Mesh( geometry, material );

                object.scale.x = object.scale.y = object.scale.z = .0125;
                self.road.add( object );
                object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                object.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
                object.position.y = -4.97;
                object.position.z = .069;
            }
        );
    },
    
    createTree: function(){
        var self = this;
        
        this.loader.load(
            './models/tree.json',
            function ( geometry, materials ) {
                var material = new THREE.MeshFaceMaterial( materials );
                var object = new THREE.Mesh( geometry, material );

                object.scale.x = object.scale.y = object.scale.z = .3;
                self.road.add( object );
                object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                object.position.y = 5.03;
                object.position.z = .069;
                object.position.x = .15;
                window.tree = object;
            }
        );
    }
};
app.directive('cyclingRace', [function(){
    return {
        link: function(scope){
            scope.state = new State();
            scope.State = State;
            
            /**
             * @type {Route}
             */
            scope.route = new Route({
                distance: 100
            });
            
            /**
             * @type {Biker[]}
             */
            scope.bikers = [];
            
            scope.bikers.push(new Biker({
                name: 'Player1',
                bike: new Bike({
                    route: scope.route
                })
            }));
            
            scope.bikers[0].bike.biker = scope.bikers[0];
            
            var race = new Race({
                bikers: scope.bikers,
                route: scope.route
            });
            
            var view = new View( scope.bikers[0].bike );
            
            /**
             * @type {Timer}
             */
            scope.timer = scope.bikers[0].bike.timer;
            
            setInterval(function(){
                scope.$digest();
            }, 100);
        }
    };
}]);
} )();