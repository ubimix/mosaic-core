if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', './Dependencies' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');
    var Dependencies = require('./Dependencies');

    /**
     * This class manages intents. Each intent is a deferred object containing
     * the following fields and method: 1) "promise"
     */
    var Intents = Mosaic.Class.extend({

        /**
         * Initializes and returns an "api" for the specified object. It
         * replaces all methods marked with the "intentHandler" flag by an
         * intent calls with the name of this method. The returned object
         * contains all "public" methods (not started the with "_" symbol).
         */
        initApi : function(key, obj) {
            var api = {};
            var that = this;
            _.each(_.functions(obj), function(name) {
                if (name[0] == '_') //
                    return;
                var action = obj[name];
                if (action.intentHandler) {
                    // Register an intent handler
                    that.addIntentHandler(key, name, function(intent) {
                        return action.call(obj, intent);
                    });
                    // Add code to activate the intent; this code is called
                    // instead of the original method
                    obj[name] = function(options) {
                        options = options || {};
                        var intent = that.newIntent(name, options);
                        return intent.promise;
                    };
                }
                api[name] = obj[name] = _.bind(obj[name], obj);
            });
            return api;
        },

        /**
         * Creates and propagates a new intent.
         * 
         * @param intentKey
         *            key of the intent
         * @param params
         *            params of the intent
         */
        newIntent : function(intentKey, params) {
            var intent = new Intents.Intent(intentKey, params);
            try {
                var handlers = this._intentHandlers ? // 
                this._intentHandlers[intentKey] : null;
                _.each(handlers, function(handler, componentKey) {
                    intent._handleComponent(componentKey, handler);
                });
            } finally {
                intent._finalize();
            }
            return intent;
        },

        /**
         * Add intent handlers.
         * 
         * @param componentKey
         *            an optional key of a component registering handlers; this
         *            key could be used to manage dependencies to wait intent
         *            results
         * @param handlers
         *            a map containing intent keys and the corresponding
         *            handlers
         */
        addIntentHandlers : function(componentKey, handlers) {
            var args = _.toArray(arguments);
            handlers = args.pop();
            componentKey = this._checkComponentKey(args.pop());
            _.each(handlers, function(handler, intentKey) {
                this.addIntentHandler(componentKey, intentKey, handler);
            }, this);
        },

        /**
         * Adds a new handler for the specified type of intents.
         * 
         * @param componentKey
         *            an optional key of a component registering handlers; this
         *            key could be used to manage dependencies to wait intent
         *            results
         * @param intentKey
         *            intent key
         * @param handler
         *            handler function to add
         */
        addIntentHandler : function(componentKey, intentKey, handler) {
            var args = _.toArray(arguments);
            handler = args.pop();
            intentKey = args.pop();
            componentKey = this._checkComponentKey(args.pop());
            if (!this._intentHandlers) {
                this._intentHandlers = {};
            }
            var handlers = this._intentHandlers[intentKey] = //
            this._intentHandlers[intentKey] || {};
            handlers[componentKey] = handler;
        },

        /**
         * Removes all intent handlers specified in the given map.
         * 
         * @param componentKey
         *            an optional key of a component registered handlers
         * @param handlers
         *            a map containing intent keys and the corresponding
         *            handlers
         */
        removeIntentHandlers : function(componentKey, handlers) {
            if (!handlers) {
                handlers = componentKey;
                componentKey = null;
            }
            _.each(handlers, function(handler, intentKey) {
                this.removeIntentHandler(componentKey, intentKey, handler);
            }, this);
        },

        /**
         * Removes an intent handler for the specified type of intents.
         * 
         * @param componentKey
         *            an optional key of a component registered handlers
         * @param intentKey
         *            intent key
         * @param handler
         *            handler function to remove
         */
        removeIntentHandler : function(componentKey, intentKey, handler) {
            if (!this._intentHandlers)
                return;
            if (!handler) {
                handlers = intentKey;
                intentKey = componentKey;
                componentKey = null;
            }
            var handlers = this._intentHandlers[intentKey];
            var toRemove = [];
            if (componentKey) {
                _.each(handlers, function(h, k) {
                    if (handler === h) {
                        toRemove.push(k);
                    }
                });
            } else {
                toRemove.push(componentKey);
            }
            _.each(toRemove, function(k) {
                delete handlers[k];
            });
        },

        /**
         * Checks the specified component key and returns a random unique one if
         * the specified key is not defined.
         */
        _checkComponentKey : function(componentKey) {
            return componentKey || _.uniqueId('$$cmp-');
        },

    });

    /**
     * Intents implementation. It has the following all fields of a deferred
     * object (see Promises) and some specific fields like "intentKey":
     * <ul>
     * <li>"promise" - a promise field</li>
     * <li>"resolve" - <code>function(result){...}</code> - a function
     * resolving this intent </li>
     * <li>"reject" - <code>function(err){...}</code> - a function rejecting
     * this intent </li>
     * <li>"intentKey" - type (key) of this intent</li>
     * <li>"waitFor" - <code>function(dependencies){...}</code> - a function
     * allowing to wait while other components finish their handling of intent
     * results
     * </ul>
     */
    Intents.Intent = Mosaic.Class.extend({

        /** Initializes parameters of this intent. */
        initialize : function(intentKey, params) {
            this._deferred = Mosaic.P.defer();
            this._processed = Mosaic.P.defer();
            this.intentKey = intentKey;
            this.params = params;
            this.promise = this._deferred.promise;
            this.processed = this._processed.promise;
            this._handlerPromises = {};
            this._dependencies = new Dependencies();
            this._handled = false;
        },

        /** Resolves this intent with the specified value. */
        resolve : function(result) {
            this._handled = true;
            this._deferred.resolve(result);
            return this._deferred.promise;
        },

        /** Rejects this intent with the specified error. */
        reject : function(err) {
            this._handled = true;
            this._deferred.reject(err);
            return this._deferred.promise;
        },

        /** Executes "then" function of the promise. */
        then : function(resolved, rejected) {
            return this._deferred.promise.then(resolved, rejected);
        },

        /**
         * This method allows to wait for the results returned by the specified
         * components before executing handler actions.
         * 
         * @param dependencies
         *            an array of component keys to wait
         */
        waitFor : function(dependencies) {
            if (!this._componentKey) {
                throw new Error('Component handler is not defined. ' + //
                'This method could be called ' + //
                'only from an intent handler.');
            }
            var that = this;
            _.each(dependencies, function(dependencyKey) {
                that._dependencies.setDependency(dependencyKey);
            });
            return that._deferred.promise.then(function(result) {
                return Mosaic.P.all(_.map(dependencies, function(key) {
                    var promise = that._handlerPromises[key];
                    if (!promise) {
                        promise = Mosaic.P();
                    }
                    return promise;
                })).then(function() {
                    return result;
                });
            });
        },

        /**
         * Executes a handler of this intent.
         * 
         * @param componentKey
         *            key of the component handler
         * @param handler
         *            handler function
         */
        _handleComponent : function(componentKey, handler) {
            var that = this;
            var promise;
            try {
                that._componentKey = componentKey;
                promise = Mosaic.P.resolve(handler(that));
            } catch (err) {
                promise = Mosaic.P.reject(err);
            } finally {
                this._handlerPromises[componentKey] = promise;
                delete that._componentKey;
            }
        },

        /**
         * Finalizes this intent and resolves/reject it. If there is no handlers
         * resolved nor rejected this intent then this method resolves the
         * promise of this intent with an exception.
         */
        _finalize : function() {
            var that = this;
            if (!that._handled) {
                that.reject(new Error('An intent was not handled.'));
            }
            var finalize = function() {
                var componentKeys = _.keys(that._handlerPromises);
                return that._dependencies.callDependencies(componentKeys, {
                    end : function(key, err, res) {
                        if (err) {
                            throw err;
                        }
                        return that._handlerPromises[key];
                    }
                }).then(that._processed.resolve, that._processed.reject);
            };
            return that._deferred.promise.then(finalize, finalize).done();
        }
    });

    /**
     * A simple utility method marking the specified method with the
     * "intentHandler" flag.
     */
    Intents.handler = function(m) {
        m.intentHandler = true;
        return m;
    }

    return Intents;
});