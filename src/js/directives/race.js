app.directive('cyclingRace', ['cyclingRace.Biker', 'cyclingRace.Bike', function(Biker, Bike){
    return {
        link: function(scope){
            /**
             * @type {Biker[]}
             */
            scope.bikers = [];
            
            scope.bikers.push(new Biker({
                name: 'Kubkuś',
                bike: new Bike()
            }));
        }
    };
}]);