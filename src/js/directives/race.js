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