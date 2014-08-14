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

        /** Initializes this object */
        initialize : function() {
            this._adapters = {};
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
            var fromType = getTypeId(from);
            var toType = getTypeId(to);
            return fromType + '-' + toType;
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
        },

        /** Returns an adapter of one object type to another type. */
        getAdapter : function(from, to) {
            var key = this._getKey(from, to);
            return this._adapters[key];
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
        }
    });

    /** Returns the type of the specified resource. */
    AdapterManager.getTypeId = getTypeId;
    function getTypeId(obj) {
        var type;
        if (_.isString(obj)) {
            type = obj;
        } else {
            var o = obj;
            if (_.isFunction(obj)) {
                o = obj.prototype;
            }
            type = o.type = o.type || _.uniqueId('type-');
        }
        return type;
        //            
        // var typeId;
        // if (_.isString(obj)) {
        // typeId = obj;
        // } else if (obj.type) {
        // typeId = obj.type;
        // }
        // if (!_.isString(typeId)) {
        // var type;
        // if (_.isFunction(obj)) {
        // type = _.isFunction(obj.getClass) ? obj.getClass()
        // : obj['class'];
        // }
        // if (type) {
        // typeId = type._typeId;
        // }
        // }
        // return typeId;
    }

    return AdapterManager;

});
