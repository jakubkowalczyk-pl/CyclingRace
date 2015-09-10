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