
    var _ = require('underscore');
    var AppComponent = require('./App.Component');

    /** Common superclass for all stores */
    module.exports = AppComponent.extend({

        /**
         * Overloads the parent 'setOptions' method to set the application in
         * the 'app' field of this object.
         */
        setOptions : function(options) {
            AppComponent.prototype.setOptions.apply(this, arguments);
            if (this.options.app) {
                this.app = this.options.app;
            }
        },

        /**
         * Declares new actions (intents) on this store. All actions are
         * available on the "action" field of this store.
         */
        _addActions : function(actions) {
            var that = this;
            if (!that.actions) {
                that.actions = {};
            }
            _.each(actions, function(action) {
                that.actions[action] = function(options) {
                    return that.app.intents.newIntent(action, options).promise;
                };
            });
        },

        /** Initializes this object. */
        initialize : function(options) {
            this.setOptions(options);
            this._initFields();
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
         * This method should initialize all internal fields of the store. It
         * should be overloaded in subclasses.
         */
        _initFields : function() {
        },

    });
