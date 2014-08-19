if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', './App.Component' ],
// Module
function(require) {
    var _ = require('underscore');
    var AppComponent = require('./App.Component');

    /** Common superclass for all stores */
    return AppComponent.extend({

        /** Initializes this object. */
        initialize : function(options) {
            this.setOptions(options);
            this.app = this.options.app;
            this._initIntents();
        },

        /** Notifies subscribers about changes */
        notify : function() {
            this.emit('changed');
        },
        /** Adds a new change listener */
        addChangeListener : function(listener, context) {
            this.on('changed', listener, context);
        },
        /** Removes a change listener */
        removeChangeListener : function(listener, context) {
            this.off('changed', listener, context);
        },

        /**
         * This method should register intents listeners to initialize internal
         * fields of the store. It should be overloaded in subclasses.
         */
        _initIntents : function() {
        },

    });
});
