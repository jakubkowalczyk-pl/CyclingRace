/*!
* CyclingRace v1.0.0
*
* Date: 2015-09-13
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
     * @type {ResistanceForces}
     */
    this.gravity = new ResistanceForces({
        object: this
    });
    
    /**
     * @type {Timer}
     */
    this.timer = new Timer();
    
    setInterval(function(){
        if(self.distance >= self.route.distance){
            self.timer.stop();
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
 * @type {PeriodicUpdater}
 */
var PeriodicUpdater = (function(){
    /**
     * @constructor
     */
    var PeriodicUpdater = function(){
        var self = this;
        
        this.update = function(){};
        setInterval(function(){
            self.update();
        }, 40);
    };

    PeriodicUpdater.prototype = {
        constructor: PeriodicUpdater,

        /**
         * @param {Function} fn
         */
        add: function(fn){
            var update = angular.copy(this.update);

            this.update = function(){
                update();
                fn();
            };
        }
    };

    return new PeriodicUpdater();
})();
/**
 * @constructor
 */
var PeriodicallyUpdatableObject = function(){
    var self = this;
    
    PeriodicUpdater.add(function(){
        self.periodicallyUpdate();
    });
};

PeriodicallyUpdatableObject.prototype = {
    constructor: PeriodicallyUpdatableObject
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
 * @extends PeriodicallyUpdatableObject
 * @param {object} bike
 * @param {Route} bike.route
 */
var Bike = function(bike){    
    OnRouteObject.call(this, bike);
    PeriodicallyUpdatableObject.call(this);

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
     * @type {boolean}
     */
    this.pressingLeftPedal = false;

    /**
     * @type {boolean}
     */
    this.pressingRightPedal = false;

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
        if(this.pressingRightPedal){
            this.stopPressPedals();
        }
        else if(!this.pressingLeftPedal){
            this.pressingLeftPedal = true;
        }
    },

    stopPressLeftPedal: function(){
        this.pressingLeftPedal = false;
        this.cadence = 0;
        this.prevCrankMove = null;
    },

    pressRightPedal: function(){
        if(this.pressingLeftPedal){
            this.stopPressPedals();
        }
        else if(!this.pressingRightPedal){
            this.pressingRightPedal = true;
        }
    },

    stopPressRightPedal: function(){
        this.pressingRightPedal = false;
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
    },
    
    periodicallyUpdate: function(){
        var pedal = this.getWorkingPedal();
        
        if(pedal){
            this.rotateCrank(pedal);
        }
    },
    
    /**
     * @returns {Pedal}
     */
    getWorkingPedal: function(){
        if(this.pressingLeftPedal){
            return this.leftPedal;
        }
        else if(this.pressingRightPedal){
            return this.rightPedal;
        }
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
 */
var Loading = function(){
    /**
     * @type {Boolean}
     */
    this.complete = false;
    
    this.deferred = Q.defer();
};

Loading.prototype = {
    constructor: Loading,
    
    markAsCompleted: function(){
        this.complete = true;
        this.deferred.resolve();
    },
    
    /**
     * @returns {Boolean}
     */
    isCompleted: function(){
        return this.complete;
    },
    
    /**
     * @returns {Promise}
     */
    whenCompleted: function(){
        return this.deferred.promise;
    }
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
 * @param {object} resistanceForces
 * @param {object} resistanceForces.object
 * @param {number} resistanceForces.object.speed
 */
var ResistanceForces = function(resistanceForces){
    /**
     * @type {number}
     */
    this.object = resistanceForces.object;

    setInterval(function(){
        resistanceForces.object.speed *= .92;
    }, 800);
};

ResistanceForces.prototype = {
    constructor: ResistanceForces
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
    this.name = State.LOADING;
};

State.MENU = 'Menu';
State.RACE = 'Race';
State.LOADING = 'Loading';

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
 * @param {Object} view
 * @param {Bike} view.bike
 * @param {Loading} view.loading
 */
var View = function( view ){
    var
        self = this,
        width = window.innerWidth,
        height = window.innerHeight;

    this.bike = view.bike;
    this.loading = view.loading;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();    
    this.loader = new THREE.JSONLoader();
    this.sky = this.createSky();
    this.grass = this.createGrass();
    this.road = this.createRoad();

    this.renderer.setSize( width, height );
    this.body.appendChild( this.renderer.domElement );

    this.road.translateZ(0.000002);

    this.grass.add( this.road );

    this.grass.rotation.x = -Math.PI/2;

    this.scene.add( this.sky );
    this.sky.translateY(.5);
    this.scene.add( this.grass );
    
    this.createBike().then(function(){
        self.loading.markAsCompleted();
    });

    this.camera.position.y = View.CAMERA_POSITION_Y_DEFAULT;
    this.camera.position.z = 4.99;
    this.camera.rotateX(-Math.PI/6);
            
    function render(){
        var
            bike = self.bike,
            offsetDiff = bike.speed * .001,
            cameraPosition = self.camera.position,
            cameraDiffDistance = .00008 * Math.abs(Math.min(bike.leftPedal.position, bike.rightPedal.position) - Pedal.POSITION_DOWN/2);
    
        self.road.texture.offset.y += offsetDiff;
        self.grass.texture.offset.y += offsetDiff;
        cameraPosition.y = View.CAMERA_POSITION_Y_DEFAULT + cameraDiffDistance;
        if(bike.leftPedal.position < bike.rightPedal.position){
            cameraPosition.x = .00008 * (Math.min(bike.leftPedal.position, bike.rightPedal.position) - Pedal.POSITION_DOWN/2);
        }
        else{
            cameraPosition.x = .00008 * (Pedal.POSITION_DOWN/2 - Math.min(bike.leftPedal.position, bike.rightPedal.position));            
        }
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

View.CAMERA_POSITION_Y_DEFAULT = .2;

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
            new THREE.PlaneGeometry( 13, 10, 32 ),
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
    
    /**
     * @returns {Promise}
     */
    createBike: function(){
        var
            self = this,
            deferred = Q.defer();
        
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
                deferred.resolve();
            }
        );

        return deferred.promise;
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
            
            scope.Pedal = Pedal;
            
            /**
             * @type {Route}
             */
            scope.route = new Route({
                distance: 50
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
            
            var viewLoading = new Loading();
            
            var view = new View({
                bike: scope.bikers[0].bike,
                loading: viewLoading
            });
            
            viewLoading.whenCompleted().then(function(){
                scope.state.set(State.MENU);
                scope.$digest();
            });
            
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