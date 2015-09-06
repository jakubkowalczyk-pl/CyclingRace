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