/**
 * @construcotr
 */
var SkyView = function(){
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
    this.scene = new THREE.Scene();
    this.light = new THREE.AmbientLight( 0xcfcfcf );
    this.scene.add( this.light );
};

SkyView.prototype = {
    /**
     * @returns {Promise}
     */
    load: function(){
        var
            textureLoader = new THREE.TextureLoader(),
            deferred = Q.defer(),
            self = this;
        
        textureLoader.load( "./img/sky.jpg", function(t){
            self.sky = new THREE.Mesh(
                new THREE.PlaneGeometry( self.width / self.height, self.height / self.width ),
                new THREE.MeshBasicMaterial({ map: t })
            );
            self.sky.material.depthTest = false;
            self.sky.material.depthWrite = false;
            self.sky.position.z = -.4;
            self.sky.position.y = .2;
            self.scene.add(self.sky);
            deferred.resolve();
        });
        
        return deferred.promise;
    },
    
    /**
     * @returns {THREE.Scene}
     */
    getScene: function(){
        return this.scene;
    },
    
    /**
     * @returns {THREE.PerspectiveCamera}
     */
    getCamera: function(){
        return this.camera;
    }    
};