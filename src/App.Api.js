if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', 'mosaic-teleport',
        './App.Component' ],
// Module
function(require) {

    var _ = require('underscore');
    var AppComponent = require('./App.Component');
    var Mosaic = require('mosaic-commons');

    /**
     * An common super-class for all APIs objects. It contains some utility
     * methods used to load information from the server.
     */
    var Api = AppComponent.extend({

        /**
         * Constructor of this class. Initializes the internal cache for data
         * loaded from the server.
         */
        initialize : function() {
            AppComponent.prototype.initialize.apply(this, arguments);
            this._cache = {};
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
         * This method loads a GeoJSON object and transforms it to an array.
         * Returns a promise for the resulting array. Internally it calls the
         * "_getJson" method, so all parameters of the "_getJson" method are
         * applicable for this method as well.
         */
        _getGeoJsonArray : function(options) {
            return this._getJson(options).then(toArray);
        },

        /**
         * This method loads a GeoJSON object and transforms it to an array.
         * Returns a promise for the resulting array. Internally it calls the
         * "_loadJson" method, so all parameters of the "_loadJson" method are
         * applicable for this method as well.
         */
        _loadGeoJsonArray : function(options) {
            var path = _.isString(options) ? options : options.path;
            return this._loadJson(path).then(toArray);
        },

        /**
         * This method returns a promise for a JSON object loaded from the
         * server using internal cache (if the specified options does not
         * contain "noCache" or "force" flags). If the cache does not contain
         * objects for the specified flag then this method calls the "_loadJson"
         * method to fetch data from the server and puts the result in the cache
         * for the future re-use (if no "noCache" flag is defined in the method
         * parameters).
         * 
         * @param options.path
         *            (mandatory) path of the data to load
         * @param options.force
         *            with this flag this method forces data re-loading from the
         *            server; the result of this operation is stored in the
         *            internal cache (if no "noCache" flag defined)
         * @param options.noCache
         *            if this flag is defined then data are loaded from the
         *            server and not stored in the internal cache; with this
         *            flag this method just calls the "_loadJson" method
         * @return a promise with the JSON object loaded from the server
         */
        _getJson : function(options) {
            var that = this;
            return Mosaic.P.then(function() {
                var path = options.path;
                var noCache = options.noCache;
                var forceReload = options.force;
                var result;
                if (!noCache && !forceReload) {
                    result = that._cache[path];
                }
                if (result) {
                    return result;
                }
                return that._loadJson(path).then(function(result) {
                    if (!noCache) {
                        that._cache[path] = result;
                    }
                    return result;
                });
            });
        },

        /**
         * Loads a JSON object from the server using the specified path. The
         * baseUrl parameter for this operation is taken from application
         * options.
         * 
         * @param path
         *            path to the JSON data on the server
         * @return a promise with the result of the loading operation
         */
        _loadJson : function(path) {
            var that = this;
            return Mosaic.P.then(function() {
                var baseUrl = that.app.options.baseUrl;
                var client = Mosaic.Teleport.HttpClient.newInstance({
                    baseUrl : baseUrl
                });
                return client.exec({
                    path : path,
                    method : 'GET'
                });
            });
        },

    });

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

    return Api;
});