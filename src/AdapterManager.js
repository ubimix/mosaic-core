if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons' ],
// Module
function(require) {
    "use strict";

    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var Class = Mosaic.Class;

    /**
     * An adapter manager used to register/retrieve objects corresponding to the
     * types of adaptable object and the types of the target object. This object
     * is used by views to get view adapters.
     */
    var AdapterManager = Class.extend({
        TYPE_KEY_DELIM : '/',

        /** Initializes this object */
        initialize : function() {
            this._adapters = {};
            this._cache = {};
        },

        /**
         * Returns a key used to find adapters of one type to another.
         * 
         * @param from
         *            the type of the adaptable object
         * @param to
         *            type of the target object
         */
        _getKey : function(from, to) {
            var fromType = this.getTypeKey(from);
            var toType = this.getTypeKey(to);
            return fromType + '::' + toType;
        },

        /**
         * Registers a new adapter from one type to another.
         * 
         * @param from
         *            the type of the adaptable object
         * @param to
         *            type of the target object
         * @param adapter
         *            the adapter type
         */
        registerAdapter : function(from, to, adapter) {
            var key = this._getKey(from, to);
            this._adapters[key] = adapter;
            this._cache = {};
        },

        /** Returns an adapter of one object type to another type. */
        getAdapter : function(from, to) {
            var that = this;
            var cacheKey = that._getKey(from, to);
            var result = that._cache[cacheKey];
            if (!result && !_.has(that._cache, cacheKey)) {
                _.find(that._expandId(from), function(f) {
                    _.find(that._expandId(to), function(t) {
                        var key = that._getKey(f, t);
                        result = that._adapters[key];
                        return !!result;
                    });
                    return !!result;
                });
                that._cache[cacheKey] = result;
            }
            return result;
        },

        /**
         * Creates and returns a new adapter from one type to another. If the
         * registered adapter is a function then it is used as constructor to
         * create a new object.
         */
        newAdapterInstance : function(from, to, options) {
            var AdapterType = this.getAdapter(from, to);
            var result = null;
            if (_.isFunction(AdapterType)) {
                options = options || {};
                if (this._checkValidity(AdapterType, options)) {
                    if (_.isFunction(AdapterType.initialize)) {
                        AdapterType.initialize(options);
                    }
                    result = new AdapterType(options);
                    if (!this._checkValidity(result, options)) {
                        result = null;
                    }
                }
            } else {
                result = AdapterType;
            }
            return result;
        },

        /** Removes an adapter from one type to another. */
        removeAdapter : function(from, to) {
            var key = this._getKey(from, to);
            var result = this._adapters[key];
            delete this._adapters[key];
            delete this._cache[key];
            return result;
        },

        /**
         * Checks if option values are valid using validation methods on the
         * specified object
         */
        _checkValidity : function(obj, options) {
            if (!_.isFunction(obj.isValid))
                return true;
            var result = obj.isValid(options);
            return result;
        },

        /**
         * Expand the specified key to an array of keys taking into account
         * inheritance defined in the key.
         */
        _expandId : function(key) {
            if (!key)
                return [];
            var result = [];
            var handled = false;
            while (_.isFunction(key.getParent)) {
                handled = true;
                key = key.getParent();
                if (key) {
                    result.push(key);
                } else {
                    break;
                }
            }
            if (!handled && _.isString(key)) {
                key = this._normalizeTypeKey(key);
                var delim = this.TYPE_KEY_DELIM;
                var array = key.split(delim);
                while (array.length) {
                    var k = array.join(delim);
                    result.push(k);
                    array.pop();
                }
                result.push('');
            }
            return result;
        },

        /** Returns the type of the specified resource. */
        getTypeKey : function(obj) {
            var type;
            if (obj) {
                if (_.isString(obj)) {
                    type = obj;
                } else {
                    var cls = null;
                    if (_.isFunction(obj)) {
                        cls = obj;
                    } else if (_.isFunction(obj.getClass)) {
                        cls = obj.getClass();
                    }
                    var proto;
                    if (_.isFunction(cls)) {
                        proto = cls.prototype;
                    } else {
                        proto = obj.prototype;
                    }
                    type = proto.__type;
                    if (!type) {
                        type = obj.type = obj.type || _.uniqueId('type-');
                    }
                }
            }
            return this._normalizeTypeKey(type);
        },

        /**
         * Returns a normalized key used to put values in the internal index and
         * in the cache.
         */
        _normalizeTypeKey : function(key) {
            if (!_.isString(key))
                return key;
            if (key === '')
                return '';
            var delim = this.TYPE_KEY_DELIM;
            if (key.indexOf(delim) === 0) {
                key = delim.substring(delim.length);
            }
            if (key.lastIndexOf(delim) == key.length - delim.length) {
                key = key.substring(0, key.length - delim.length);
            }
            return key;
        }
    });

    return AdapterManager;

});
