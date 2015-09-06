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