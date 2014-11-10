var Mosaic = require('mosaic-commons');
var _ = require('underscore');

/** This is a simple class used to manage dependencies between entities. */
var Dependencies = Mosaic.Class.extend({

    /**
     * Sets dependencies between modules using a map where keys are module names
     * and values are lists of dependencies. This method rises an exception if
     * user tries to set circular dependencies.
     * 
     * @param dependencies
     *                a map containing modules with the corresponding arrays of
     *                dependencies
     */
    setDependencies : function(dependencies) {
        _.each(dependencies, function(deps, module) {
            this.setDependency(module, deps);
        }, this);
    },

    /**
     * Sets new dependency for the specified module. This method rises an
     * exception if user tries to set circular dependencies.
     * 
     * @param key
     *                the key of the module
     * @param dependencies
     *                an array of dependencies for the specified module
     */
    setDependency : function(key, dependencies) {
        var that = this;
        if (!that._checkDependencies(key, dependencies)) {
            throw Mosaic.Errors.// 
            newError('Circular dependencies').code(400);
        }
        that._setDependencies(key, dependencies);
    },

    /**
     * Visits dependencies and notifies the given listener when the visitor
     * enters and exists from an entry.
     * 
     * @param key
     *                the key of an entry to visit
     */
    visit : function(key, listener) {
        if (listener.begin) {
            listener.begin(key);
        }
        var deps = this.getDependencies(key);
        _.each(deps, function(k) {
            this.visit(k, listener);
        }, this);
        if (listener.end) {
            listener.end(key);
        }
    },

    /**
     * Asynchronously executes "begin" and "end" actions in the specified
     * listener and return a promise with the results of the execution.
     * 
     * @param key
     *                the key of the action to launch; if this parameter is an
     *                array then all keys from this array will be executed
     * @param listener
     *                a listener object containing two methods: "begin" and
     *                "end"
     * @param listener.begin
     *                this method takes one parameter - the key of the current
     *                action
     * @param listener.end
     *                this method takes 3 parameters - 1) key of the action, 2)
     *                error thrown by previous actions or null 3) result of the
     *                previous action
     */
    callDependencies : function(key, listener) {
        var that = this;
        return Mosaic.P.then(function() {
            if (!_.isArray(key)) {
                return that._callDependencies({}, key, listener);
            } else {
                var promises = {};
                return Mosaic.P.all(_.map(key, function(k) {
                    return that._callDependencies(promises, k, listener);
                }));
            }
        });
    },

    /**
     * Returns all dependencies of an element with the specified key.
     */
    getDependencies : function(key) {
        return this._getDependencies(key);
    },

    /**
     * A list of all dependencies for the specified key in the order of their
     * resolving.
     */
    getAllDependencies : function(key) {
        var deps = [];
        this.visit(key, {
            end : function(k) {
                if (k !== key) {
                    deps.push(k);
                }
            }
        });
        return deps;
    },

    /**
     * Executes an action with the specified name and returns a promise with
     * results.
     * 
     * @param promises
     *                index of promises for already executed actions
     * @param key
     *                key of the action to execute
     * @param listener
     *                a listener object containing two methods "begin" and "end"
     * @param listener.begin
     *                this method takes one parameter - the key of the current
     *                action
     * @param listener.end
     *                this method takes 3 parameters - 1) key of the action, 2)
     *                error thrown by previous actions or null 3) result of the
     *                previous action
     */
    _callDependencies : function(promises, key, listener) {
        var that = this;
        return visit(key);
        function visit(k) {
            if (!promises[k]) {
                promises[k] = Mosaic.P.then(function() {
                    if (listener.begin)
                        return listener.begin(k);
                }).then(function() {
                    var deps = that.getDependencies(k);
                    if (!deps || !deps.length)
                        return;
                    return Mosaic.P.all(_.map(deps, visit));
                }).then(function(result) {
                    if (listener.end)
                        return listener.end(k, null, result);
                    else
                        return result;
                }, function(err) {
                    if (listener.end)
                        return listener.end(k, err, null);
                    else
                        throw err;
                });
            }
            return promises[k];
        }
    },

    /**
     * Returns true if the specified dependencies could be set for the given
     * key.
     * 
     * @param key
     *                the key to check
     * @param dependencies
     *                a list of dependencies to check
     */
    _checkDependencies : function(key, dependencies) {
        var that = this;
        var deps = _.isArray(dependencies) ? dependencies : [ dependencies ];
        return Dependencies.check(key, function(k) {
            if (k === key) {
                return deps;
            } else {
                return that.getDependencies(k);
            }
        });
    },

    /**
     * Returns all dependencies of an element with the specified key. This
     * method could be overloaded in subclasses.
     */
    _getDependencies : function(key) {
        if (!this._dependencies)
            return [];
        return this._dependencies[key] || [];
    },

    /**
     * Really sets dependencies for a module with the specified key. This method
     * could be overloaded in subclasses.
     * 
     * @param key
     *                for this key a list dependencies should be set
     * @param deps
     *                a list of dependencies
     */
    _setDependencies : function(key, deps) {
        if (!this._dependencies) {
            this._dependencies = [];
        }
        this._dependencies[key] = deps;
    },

});

/**
 * This static method checks that there is no circular dependencies between
 * entities.
 * 
 * @param key
 *                the key of the initial dependency
 * @param provider
 *                a function returning an array of all dependencies for the
 *                specified key
 */
Dependencies.check = function(key, provider) {
    var index = {};
    function isIndexed(k) {
        if (index[k])
            return true;
        try {
            index[k] = true;
            return !!_.find(provider(k), isIndexed);
        } finally {
            delete index[k];
        }
    }
    return !isIndexed(key);
};

module.exports = Dependencies;
