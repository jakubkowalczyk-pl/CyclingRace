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