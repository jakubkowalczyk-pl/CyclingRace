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

    this.bikeModel = view.bike;
    this.loading = view.loading;

    this.scene = new Physijs.Scene();
    this.scene.fog = new THREE.FogExp2(0x35B4E0, .05);
    this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.loader = new THREE.JSONLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.renderer.setSize( width, height );
    this.body.appendChild( this.renderer.domElement );

    this.skyView = new SkyView();
    
    this.createRoute().then(function(){
        return self.createBike();
    }).then(function(bike){
        self.bike = bike;
        
        return self.skyView.load();
    }).then(function(){
        self.loading.markAsCompleted();
        render();
    });

    this.camera.position.y = View.CAMERA_POSITION_Y_DEFAULT;
    this.camera.position.z = View.CAMERA_POSITION_Z_DEFAULT;
    
    this.renderer.setClearColor(0x01ADDF, 1);
            
    this.raycaster = new THREE.Raycaster();
    
    function render(){
        var
            bike = self.bikeModel,
            cameraPosition = self.camera.position,
            cameraDiffDistance = .00008 * Math.abs(Math.min(bike.leftPedal.position, bike.rightPedal.position) - Pedal.POSITION_DOWN/2);

        self.raycaster.setFromCamera( { x: 0, y: -1 }, self.camera );
	self.bikeModel.onRoad = self.raycaster.intersectObjects( [self.road] ).length === 1;
        self.grass.position.x = -bike.translate.x;
        self.grass.position.z = bike.translate.y;
        cameraPosition.y = View.CAMERA_POSITION_Y_DEFAULT + cameraDiffDistance;
        if(!bike.onRoad){
           cameraPosition.y += Math.random() * .007; 
        }
        if(bike.leftPedal.position < bike.rightPedal.position){
            cameraPosition.x = .00008 * Math.cos(bike.rotate.y) * (Math.min(bike.leftPedal.position, bike.rightPedal.position) - Pedal.POSITION_DOWN/2);
            cameraPosition.z = .00008 * Math.sin(bike.rotate.y) * (Math.min(bike.leftPedal.position, bike.rightPedal.position) - Pedal.POSITION_DOWN/2);
        }
        else{
            cameraPosition.x = .00008 * Math.cos(bike.rotate.y) * (Pedal.POSITION_DOWN/2 - Math.min(bike.leftPedal.position, bike.rightPedal.position));
            cameraPosition.z = .00008 * Math.sin(bike.rotate.y) * (Pedal.POSITION_DOWN/2 - Math.min(bike.leftPedal.position, bike.rightPedal.position));            
        }
        cameraPosition.z += -View.BIKE_POSITION_Y_DEFAULT + View.BIKE_CAMERA_DISTANCE * Math.cos(-bike.rotate.y);
        cameraPosition.x += View.BIKE_CAMERA_DISTANCE * Math.sin(-bike.rotate.y);
        self.bike.position.x = bike.translate.x;
        self.bike.position.y = bike.translate.y + View.BIKE_POSITION_Y_DEFAULT;
        self.camera.rotation.y = -bike.rotate.y;
        self.bike.rotation.y = bike.rotate.y;
        requestAnimationFrame( render );
        self.renderer.autoClear = false;
        self.renderer.clear();
        self.renderer.render( self.skyView.getScene(), self.skyView.getCamera() );
        self.renderer.render( self.scene, self.camera );
    }
    
    this.control = new ViewControl({
        view: this
    });
    
    var light = new THREE.AmbientLight( 0xcfcfcf );
    this.scene.add( light );
};

View.CAMERA_POSITION_Y_DEFAULT = .2;
View.CAMERA_POSITION_Z_DEFAULT = 5.1;
View.BIKE_POSITION_Y_DEFAULT = -4.97;
View.BIKE_CAMERA_DISTANCE = View.CAMERA_POSITION_Z_DEFAULT + View.BIKE_POSITION_Y_DEFAULT;

View.prototype = {
    body: document.querySelectorAll('body')[0],
    
    /**
     * @param {Object} params
     * @param {Number} params.width
     * @param {Number} params.height
     * @returns {Promise}
     */
    createGrass: function(params){
        var deferred = Q.defer();
    
        this.textureLoader.load( "./img/grass.jpg", function(texture){
            texture.wrapS = THREE.RepeatWrapping; 
            texture.wrapT = THREE.RepeatWrapping; 
            texture.repeat.set( params.width, params.height*6 );
            deferred.resolve(new Physijs.BoxMesh(
                new THREE.PlaneGeometry( params.width, params.height ),
                new THREE.MeshBasicMaterial({
                    map: texture
                })
            ));
        });

        return deferred.promise;
    },

    /**
     * @param {Object} params
     * @param {Number} params.width
     * @param {Number} params.height
     * @returns {Promise}
     */
    createRoad: function(params){
        var deferred = Q.defer();
    
        this.textureLoader.load( "./img/Asphalt-913.jpg", function(texture){
            texture.wrapS = THREE.RepeatWrapping; 
            texture.wrapT = THREE.RepeatWrapping; 
            texture.repeat.set( params.width*4, params.height*6 );
            deferred.resolve(new Physijs.BoxMesh(
                new THREE.PlaneGeometry( params.width, params.height ),
                new THREE.MeshBasicMaterial({
                    map: texture
                })
            ));
        });

        return deferred.promise;
    },
    
    /**
     * @returns {Promise}
     */
    createRoute: function(){
        var
            deferred = Q.defer(),
            self = this;
        
        this.createGrass({
            width: 25,
            height: 100
        }).then(function(object){
            self.grass = object;
            self.grass.rotation.x = -Math.PI/2;
            
            return self.createRoad({
                width: .5,
                height: 100
            });
        }).then(function(object){
            self.road = object;
            self.road.translateZ(0.0004);
            self.grass.add( self.road );
            self.scene.add( self.grass );
            deferred.resolve();
        });
        
        return deferred.promise;
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
                var object = new Physijs.BoxMesh( geometry, material );

                object.scale.x = object.scale.y = object.scale.z = .0125;
                self.road.add( object );
                object.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2);
                object.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI);
                object.position.y = View.BIKE_POSITION_Y_DEFAULT;
                object.position.z = .069;
                deferred.resolve(object);
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