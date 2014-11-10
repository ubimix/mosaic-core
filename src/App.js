var Mosaic = require('mosaic-commons');
var Intents = require('./Intents');

/**
 * An application main class. It is the common superclass for all classes
 * implementing applications.
 */
module.exports = Mosaic.Class.extend(Mosaic.Events.prototype, {

    /** Constructor of this class. It initializes application modules. */
    initialize : function(options) {
        this.setOptions(options);
        this.intents = new Intents();
        this.initModules();
    },

    /**
     * Starts the application. This method pre-loads initial data and activate
     * views.
     */
    start : function() {
        var that = this;
        return Mosaic.P.then(function() {
            return that.preloadData();
        }).then(function() {
            return that.initViews();
        }, function(err) {
            return that.initViews(err);
        });
    },

    /** Stops this application and cleans up associated resources */
    stop : function() {
        var that = this;
        return Mosaic.P.then(function() {
            return that.deleteViews();
        }).then(function() {
            return that.deleteModules();
        });
    },

    /**
     * Pre-loads data for this application and optionally returns a promise with
     * results.
     */
    preloadData : function() {
    },

    /**
     * This function should load and initialize all modules of this application.
     */
    initModules : function() {
    },

    /** Removes modules of this applications. */
    deleteModules : function() {
    },

    /**
     * This method should initialize main views of this application. This method
     * is called after initial application data are loaded. The specified error
     * parameter is defined if there is an error while data loading. This method
     * should visualize an error message in this case.
     */
    initViews : function(error) {
    },

    /** Closes all views of this application. */
    deleteViews : function() {
    }

});
