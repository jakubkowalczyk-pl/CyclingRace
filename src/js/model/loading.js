/**
 * @constructor
 */
var Loading = function(){
    /**
     * @type {Boolean}
     */
    this.complete = false;
    
    this.deferred = Q.defer();
};

Loading.prototype = {
    constructor: Loading,
    
    markAsCompleted: function(){
        this.complete = true;
        this.deferred.resolve();
    },
    
    /**
     * @returns {Boolean}
     */
    isCompleted: function(){
        return this.complete;
    },
    
    /**
     * @returns {Promise}
     */
    whenCompleted: function(){
        return this.deferred.promise;
    }
};