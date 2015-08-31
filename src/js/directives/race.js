app.directive('cyclingRace', [function(){
    return {
        link: function(scope){            
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
            
            /**
             * @type {Timer}
             */
            scope.timer = scope.bikers[0].bike.timer;
            
            setInterval(function(){
                scope.$digest();
            }, 40);
        }
    };
}]);