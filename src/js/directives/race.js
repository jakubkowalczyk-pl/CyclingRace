app.directive('cyclingRace', [function(){
    return {
        link: function(scope){
            /**
             * @type {Date}
             */
            scope.time = new Date(0);
            
            /**
             * @type {Biker[]}
             */
            scope.bikers = [];
            
            scope.bikers.push(new Biker({
                name: 'Player1',
                bike: new Bike()
            }));
            
            scope.bikers[0].bike.biker = scope.bikers[0];
            
            /**
             * @type {Route}
             */
            scope.route = new Route({
                distance: 5000
            });
            
            new Race({
                bikers: scope.bikers,
                route: scope.route
            });
            
            var view = new View( scope.bikers[0].bike );
    
            function render(){
                requestAnimationFrame( render );
                view.renderer.render( view.scene, view.camera );
            }

            render();
            
            setInterval(function(){
                scope.time.setMilliseconds(scope.time.getMilliseconds() + 40);
                scope.$digest();
            }, 40);
        }
    };
}]);