var _ = require('underscore');
var AppComponent = require('./App.Component');
var Mosaic = require('mosaic-commons');
var Teleport = require('mosaic-teleport');

/**
 * An common super-class for all APIs objects. It contains some utility methods
 * used to load information from the server.
 */
var Api = AppComponent.extend({

    /**
     * Constructor of this class. Initializes the internal cache for data loaded
     * from the server.
     */
    initialize : function(options) {
        this.setOptions(options);
        this.app = this.options.app;
        this._initFields();
        this.api = this._initApi(this.options.key);
    },

    // ------------------------------------------------------------------

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

    // ------------------------------------------------------------------

    /**
     * This method should initialize all internal fields of the store. It should
     * be overloaded in subclasses.
     */
    _initFields : function() {
    },

    /**
     * Initializes and returns an "api" field for this object. It replaces all
     * methods marked with the "intentHandler" flag by an intent calls with the
     * same name. The returned object contains all "public" methods (not started
     * with the "_" symbol).
     */
    _initApi : function(key) {
        var intents = this._getIntents();
        var methods = this._getApiMethods();
        this.api = intents.initApi(key, this, methods);
        return this.api;
    },

    /**
     * Returns a list of methods to expose in the 'api' object. Only these
     * methods will be available from the outside of this object.
     */
    _getApiMethods : function() {
        var methods = {};
        _.each(_.functions(this), function(name) {
            if (name[0] == '_') // Hide all "private" methods
                return;
            if (name.match(/^on.+$/)) // Hide all event handlers (onXxxx)
                return;
            methods[name] = true;
        });
        _.each(_.functions(AppComponent.prototype), function(name) {
            delete methods[name];
        }, this);
        return _.keys(methods).sort();
    },

    /** Returns an Intents manager instance associated with this object. */
    _getIntents : function() {
        var intentsRegistry = this.intents || this.options.intents;
        if (!intentsRegistry && this.app) {
            intentsRegistry = this.app.intents;
        }
        return intentsRegistry;
    },

    /**
     * Loads a set of GeoJSON arrays and merges them in one array. Returns a
     * promise with the merged result.
     */
    _loadAndMergeGeoJsonArrays : function(urls) {
        var that = this;
        if (_.isString(urls)) {
            urls = [ urls ];
        } else {
            urls = _.toArray(urls);
        }
        return Mosaic.P.all(_.map(urls, function(url) {
            return that._loadGeoJsonArray(url);
        })).then(function(list) {
            var result = [];
            _.each(list, function(array) {
                result = result.concat(array);
            });
            return result;
        });
    },

    /**
     * This method loads a GeoJSON object and transforms it to an array. Returns
     * a promise for the resulting array. Internally it calls the "_getJson"
     * method, so all parameters of the "_getJson" method are applicable for
     * this method as well.
     */
    _getGeoJsonArray : function(options) {
        return this._getJson(options).then(toArray);
    },

    /**
     * This method loads a GeoJSON object and transforms it to an array. Returns
     * a promise for the resulting array. Internally it calls the "_loadJson"
     * method, so all parameters of the "_loadJson" method are applicable for
     * this method as well.
     */
    _loadGeoJsonArray : function(options) {
        var path = _.isString(options) ? options : options.path;
        return this._loadJson(path).then(toArray);
    },

    /**
     * This method returns a promise for a JSON object loaded from the server
     * using internal cache (if the specified options does not contain "noCache"
     * or "force" flags). If the cache does not contain objects for the
     * specified flag then this method calls the "_loadJson" method to fetch
     * data from the server and puts the result in the cache for the future
     * re-use (if no "noCache" flag is defined in the method parameters).
     * 
     * @param options.path
     *                (mandatory) path of the data to load
     * @param options.force
     *                with this flag this method forces data re-loading from the
     *                server; the result of this operation is stored in the
     *                internal cache (if no "noCache" flag defined)
     * @param options.noCache
     *                if this flag is defined then data are loaded from the
     *                server and not stored in the internal cache; with this
     *                flag this method just calls the "_loadJson" method
     * @return a promise with the JSON object loaded from the server
     */
    _getJson : function(options) {
        var that = this;
        return Mosaic.P.then(function() {
            var path = options.path;
            var noCache = options.noCache;
            var forceReload = options.force;
            var result;
            var cache = that._cache = that._cache || {};
            if (!noCache && !forceReload) {
                result = cache[path];
            }
            if (result) {
                return result;
            }
            return that._loadJson(path).then(function(result) {
                if (!noCache) {
                    cache[path] = result;
                }
                return result;
            });
        });
    },

    /**
     * Loads a JSON object from the server using the specified path. The baseUrl
     * parameter for this operation is taken from application options.
     * 
     * @param path
     *                path to the JSON data on the server
     * @return a promise with the result of the loading operation
     */
    _loadJson : function(path) {
        var that = this;
        return Mosaic.P.then(function() {
            var baseUrl = that.app.options.baseUrl;
            var client = Teleport.HttpClient.newInstance({
                baseUrl : baseUrl
            });
            return client.exec({
                path : path,
                method : 'GET'
            });
        });
    },

});

Api.intent = function(m) {
    m.intentHandler = true;
    return m;
};

function toArray(obj) {
    if (!obj)
        return obj;
    if (_.isArray(obj))
        return obj;
    if (_.isArray(obj.features)) {
        return obj.features;
    }
    return obj;
}

Api.toArray = toArray;

module.exports = Api;
