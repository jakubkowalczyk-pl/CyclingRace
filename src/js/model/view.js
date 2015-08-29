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