/*!
 * mosaic-core v0.0.0 | License: MIT 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mosaic-commons"), require("underscore"), require("leaflet"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["mosaic-commons", "underscore", "leaflet", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["mosaic-core"] = factory(require("mosaic-commons"), require("underscore"), require("leaflet"), require("jquery"));
	else
		root["mosaic-core"] = factory(root["mosaic-commons"], root["underscore"], root["leaflet"], root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	Mosaic.Core = module.exports = {
	    DataSet : __webpack_require__(2),
	    CompositeDataSet : __webpack_require__(3),
	    DataSetView : __webpack_require__(4),
	    DataSubsetView : __webpack_require__(5),
	    LeafletDataSetView : __webpack_require__(6),
	    LeafletDataSubsetView : __webpack_require__(7),
	    LeafletFeatureBuilder : __webpack_require__(8),
	    TemplateDataSetView : __webpack_require__(9),
	    TemplateView : __webpack_require__(10)
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(11) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(11);

	    /**
	     * This class represents a data set. Each dataset manages a set of objects
	     * with unique keys. The "setData" of this class accepts an array of objects
	     * and sends notifications about changes with this data set to the
	     * registered listener. This listener could be registered using the
	     * "setListener" method or it can be defined as a parameter of the class
	     * constructor.
	     */
	    var DataSet = Mosaic.Class.extend(Mosaic.Events.prototype, {

	        /**
	         * Class constructor.
	         * 
	         * 
	         * @param options.getId
	         *            this optional method is used to retrieve object
	         *            identifiers
	         * @param options.listener
	         *            the listener to set
	         */
	        initialize : function(options) {
	            Mosaic.Events.call(this);
	            this.setOptions(options);
	            if (_.isFunction(this.options.getKey)) {
	                this.getKey = this.options.getKey;
	            }
	            this._index = {};
	            this._data = [];
	        },

	        /**
	         * Opens this data set - registeres data set listeners and sets the
	         * initial data.
	         */
	        open : function() {
	            if (this.options.data) {
	                this.setData(this.options.data);
	            }
	        },

	        /** Closes this dataset. It removes all registered listeners. */
	        close : function() {
	        },

	        /**
	         * Sets a new array of objects and generates an "update" event
	         * containing the "enter", "exit" and "update" arrays. This method
	         * returns reference to this instance.
	         */
	        setData : function(data) {
	            var array = _.toArray(data);
	            var newIndex = {};
	            var newData = [];
	            var event = {
	                enter : [],
	                update : [],
	                exit : []
	            };
	            _.each(array, function(d, i) {
	                var key = this.getKey(d);
	                if (_.has(this._index, key)) {
	                    event.update.push(d);
	                    delete this._index[key];
	                } else {
	                    event.enter.push(d);
	                }
	                newIndex[key] = {
	                    d : d,
	                    i : i
	                };
	                newData.push(d);
	            }, this);
	            _.each(this._index, function(s) {
	                event.exit.push(s.d);
	            }, this);
	            this._index = newIndex;
	            this._data = newData;
	            this.emit('update', event);
	            return this;
	        },

	        /**
	         * This method returns an object with the specified key or the full
	         * array of all objects if such a key is not defined.
	         */
	        getData : function(key) {
	            if (key) {
	                var slot = this._index[key];
	                return slot ? slot.d : null;
	            } else {
	                return this._data;
	            }
	        },

	        /** Returns position of the specified entity in this dataset. */
	        getIndex : function(d) {
	            var key = this.getKey(d);
	            var slot = key ? this._index[key] : null;
	            return slot ? slot.i : -1;
	        },

	        /**
	         * This method returns a key for the specified object. By default this
	         * method returns the object itself. To change this behaviour this
	         * method could be overloaded in subclasses or a "getKey" function can
	         * be set in the constructor parameters.
	         */
	        getKey : function(d) {
	            return d;
	        },

	        /**
	         * This method returns a list of all object keys.
	         */
	        getKeys : function() {
	            return _.keys(this._index);
	        },

	    });

	    return DataSet;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(11), __webpack_require__(2) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(11);
	    var DataSet = __webpack_require__(2);

	    /**
	     * This class is used to merge multiple datasets in one based on common data
	     * keys.
	     */
	    var CompositeDataSet = DataSet.extend({

	        /**
	         * Constructor of this class.
	         * 
	         * @param options.getKey
	         *            an function returning the key in the merged results
	         * @param options.dataSets
	         *            a list of data sets used as a source of data objects
	         * @param options.merge
	         *            a function accepting an array of data entries from all
	         *            data sets corresponding to the same key
	         */
	        initialize : function(options) {
	            DataSet.prototype.initialize.apply(this, arguments);
	            this._filterDataSets = _.bind(this._filterDataSets, this);
	            this.setFilter(this.options.filterData || this.options.filter);
	            this.open();
	        },

	        /**
	         * Opens this data set - registeres data set listeners and launches the
	         * initial data merge.
	         */
	        open : function() {
	            _.each(this.options.dataSets, function(dataSet) {
	                dataSet.on('update', this._filterDataSets);
	            }, this);
	            this._filterDataSets();
	        },

	        /** Closes this dataset. It removes all registered listeners. */
	        close : function() {
	            _.each(this.options.dataSets, function(dataSet) {
	                dataSet.off('update', this._filterDataSets);
	            }, this);
	            DataSet.prototype.setData.call(this, []);
	        },

	        /** Sets a new filter and updates this data set. */
	        setFilter : function(filter) {
	            this._filter = filter;
	            this._filterDataSets();
	            return this;
	        },

	        /**
	         * This method all data sets. It calls the "_filterData" method for all
	         * objects corresponding to the same key from all datasets.
	         */
	        _filterDataSets : function() {
	            var keys = {};
	            var dataSets = this.options.dataSets;
	            _.each(dataSets, function(dataSet) {
	                _.each(dataSet.getKeys(), function(key) {
	                    keys[key] = true;
	                });
	            }, this);
	            var data = [];
	            _.each(_.keys(keys), function(key) {
	                var array = _.map(dataSets, function(dataSet) {
	                    var d = dataSet.getData(key);
	                    return d;
	                });
	                var d = this._filterData(key, array);
	                if (d) {
	                    data.push(d);
	                }
	            }, this);
	            DataSet.prototype.setData.call(this, data);
	        },

	        /**
	         * Filters/merges individual objects corresponding to the same key.
	         * 
	         * @param array
	         *            an array of objects from all datasets corresponding to the
	         *            same key
	         * @param key
	         *            the key of the data
	         */
	        _filterData : function(key, array) {
	            if (this._filter) {
	                return this._filter(key, array);
	            }
	            var args = [ {} ].concat(array);
	            return _.extend.call(null, args);
	        },

	        /**
	         * Overloads the parent "setData" method and rises an exception. This
	         * class should not accept direct data changes. It builds its data using
	         * parent data sets.
	         */
	        setData : function() {
	            throw new Error('This method ' + //
	            'should not be called directly. ' + //
	            'This dataset is a combination of parent datasets.');
	        }
	    });

	    /** This datasets choses for each key the first non-empty value. */
	    CompositeDataSet.OR = CompositeDataSet.extend({
	        /**
	         * This method returns the first non-empty value from the list of values
	         * corresponding to the specified key.
	         * 
	         * @param array
	         *            an array of objects from all datasets corresponding to the
	         *            same key
	         * @param key
	         *            the key of the data
	         */
	        _filterData : function(key, array) {
	            var result = _.find(array, function(val) {
	                return !!val;
	            });
	            return result;
	        },
	    });

	    /** This datasets selects only values existing all datasets. */
	    CompositeDataSet.AND = CompositeDataSet.extend({
	        /**
	         * This method returns the first non-empty value from the list of values
	         * corresponding to the specified key.
	         * 
	         * @param array
	         *            an array of objects from all datasets corresponding to the
	         *            same key
	         * @param key
	         *            the key of the data
	         */
	        _filterData : function(key, array) {
	            var result = null;
	            return !_.find(array, function(val) {
	                result = val;
	                return !val;
	            }) ? result : null;
	        },
	    });

	    return CompositeDataSet;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(11) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(11);

	    /**
	     * Subclasses of this type are used to visualize data set content.
	     */
	    /**
	     * This mixin contains common methods used to visualize data set content.
	     */
	    var DataSetView = Mosaic.Class.extend({

	        /**
	         * Constructor of this class. This method expects that the parameters
	         * contain a "dataSet" field. These fields "onEnter", "onUpdate" and
	         * "onExit" are used to provide/manage features on the map.
	         * 
	         * @param options.dataSet
	         *            a mandatory data set object
	         * @param options.onEnter
	         *            an optional callback method providing new features for the
	         *            map
	         * @param options.onUpdate
	         *            an optional callback method updating already existing
	         *            features
	         * @param options.onExit
	         *            an optional callback executed just before features removal
	         *            from the map
	         * 
	         */
	        initialize : function(options) {
	            var that = this;
	            that.setOptions(options);
	            options = that.getOptions();
	            that._onEnter = options.onEnter;
	            that._onExit = options.onExit;
	            that._onUpdate = options.onUpdate;
	        },

	        /**
	         * "Opens" this view and notify about all already existing nodes.
	         */
	        open : function() {
	            var dataSet = this.getDataSet();
	            this._onDataSetUpdate = _.bind(this._onDataSetUpdate, this);
	            this._onDataSetUpdate({
	                enter : dataSet.getData(),
	                update : [],
	                exit : [],
	            });
	            dataSet.on('update', this._onDataSetUpdate);
	        },

	        /**
	         * Removes this view and unsubscribe from data set notifications.
	         */
	        close : function() {
	            var dataSet = this.getDataSet();
	            dataSet.on('update', this._onDataSetUpdate);
	            this._onDataSetUpdate({
	                enter : [],
	                update : [],
	                exit : dataSet.getData()
	            });
	        },

	        /** Sets options (parameters) of this class. */
	        setOptions : function(options) {
	            this.options = _.extend(this.options || {}, options);
	        },

	        /**
	         * Returns options (parameters) of this instance. The returned value is
	         * used to retrieve the "dataSet" field as well as "onEnter", "onUpdate"
	         * and "onExit" handlers. This method could be overloaded in subclasses
	         * to re-define the source of these parameters.
	         */
	        getOptions : function() {
	            return this.options || {};
	        },

	        /** Returns the underlying dataset */
	        getDataSet : function() {
	            var options = this.getOptions();
	            return options.dataSet;
	        },

	        /**
	         * Handles data set notifications and dispatch calls to registered
	         * "onEnter", "onUpdate" and "onExit" handlers.
	         */
	        _onDataSetUpdate : function(e) {
	            var that = this;
	            var dataSet = that.getDataSet();
	            _.each(e.exit, function(d) {
	                var key = dataSet.getKey(d);
	                var view = that._getView(key);
	                if (!view)
	                    return;
	                if (that._onExit) {
	                    that._onExit(d, view);
	                }
	                that._removeView(key, view);
	            });
	            function visit(data, callback) {
	                if (!callback)
	                    return;
	                _.each(data, function(d) {
	                    var key = dataSet.getKey(d);
	                    var view = that._getView(key);
	                    view = callback.call(that, d, view);
	                    if (!view)
	                        return;
	                    that._setView(key, view);
	                });
	            }
	            visit(e.enter, that._onEnter);
	            visit(e.update, that._onUpdate);
	        },

	        /** Returns a view corresponding to the specified key. */
	        _getView : function(key) {
	            if (!this._index) {
	                return null;
	            }
	            return this._index[key];
	        },

	        /** Sets a new view corresponding to the specified key. */
	        _setView : function(key, view) {
	            if (!this._index) {
	                this._index = {};
	            }
	            this._index[key] = view;
	            return this;
	        },

	        /** Sets a new view corresponding to the specified key. */
	        _removeView : function(key, view) {
	            if (this._index) {
	                delete this._index[key];
	            }
	            return this;
	        },

	    });

	    return DataSetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(4) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var DataSetView = __webpack_require__(4);

	    /** Common superclass for subset views. */
	    var DataSubsetView = DataSetView.extend({

	        /** Returns a parent view */
	        _getParentView : function() {
	            var options = this.getOptions();
	            return options.parent;
	        },

	        /** Returns a view corresponding to the specified key. */
	        _getView : function(key) {
	            var parent = this._getParentView();
	            var view = null;
	            if (parent && parent._getView) {
	                view = parent._getView(key);
	            }
	            if (!view) {
	                view = DataSetView.prototype._getView.call(this, key);
	            }
	            return view;
	        },

	    });

	    return DataSubsetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(12), __webpack_require__(4) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var L = __webpack_require__(12);
	    var DataSetView = __webpack_require__(4);

	    /**
	     * A Leaflet layer providing automatic rendering of data from a dataset.
	     * This class uses the "onEnter", "onUpdate" and "onExit" callbacks to
	     * generate visible features on the map. Use the "LeafletFeatureBuilder"
	     * class to simplify creation of leaflet features in these callbacks.
	     */
	    var LeafletDataSetView = DataSetView.extend({

	        /**
	         * Sets a new view corresponding to the specified key.
	         */
	        _setView : function(key, view) {
	            var oldView = this._getView(key);
	            DataSetView.prototype._setView.apply(this, arguments);
	            if (oldView) {
	                this._layer.removeLayer(oldView);
	            }
	            this._layer.addLayer(view);
	            return this;
	        },

	        /** Sets a new view corresponding to the specified key. */
	        _removeView : function(key, view) {
	            DataSetView.prototype._removeView.apply(this, arguments);
	            this._layer.removeLayer(view);
	            return this;
	        },

	        /**
	         * This method is used by Leaflet when this layer is inserted in the
	         * map.
	         */
	        onAdd : function(map) {
	            this._map = map;
	            this._layer = new L.featureGroup();
	            this._map.addLayer(this._layer);
	            this.open();
	        },

	        /**
	         * This method is called by Leaflet to remove this layer from the map.
	         */
	        onRemove : function(map) {
	            this.close();
	            this._map.removeLayer(this._layer);
	            delete this._map;
	            delete this._layer;
	        },

	    });

	    return LeafletDataSetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(5) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var DataSubsetView = __webpack_require__(5);

	    /**
	     * This class manages entries of sub-sets of a data set. It does not
	     * add/remove features on the map, it just changes their representation.
	     */
	    var LeafletDataSubsetView = DataSubsetView.extend({

	        /**
	         * This method is used by Leaflet when this layer is inserted in the
	         * map.
	         */
	        onAdd : function(map) {
	            this._map = map;
	            this.open();
	        },

	        /** This method is called by Leaflet to remove this layer from the map. */
	        onRemove : function(map) {
	            this.close();
	            delete this._map;
	        },

	    });

	    return LeafletDataSubsetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(12) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var L = __webpack_require__(12);
	    var Mosaic = __webpack_require__(1);

	    var Config = Mosaic.Class.extend({

	        initialize : function(data, options) {
	            this.data = data;
	            _.extend(this, options);
	            var methods = [ 'onClick', 'onMouseOver', 'onMouseOut',
	                    'onDblClick', 'onMouseMove' ];
	            this._handlers = {};
	            _.each(methods, function(m) {
	                var key = m.toLowerCase().substring(2);
	                this[m] = function(handler) {
	                    if (handler !== undefined) {
	                        this._handlers[key] = handler;
	                        return this;
	                    } else {
	                        return this_handlers[key];
	                    }
	                };
	            }, this);
	        },

	        setOptions : function(opt) {
	            this.opt = opt;
	            return this;
	        },

	        getOptions : function() {
	            var args = _.toArray(arguments);
	            return this._getOrInvoke(this.opt, args) || {};
	        },

	        setMarker : function(m) {
	            this._marker = m;
	            return this;
	        },

	        getMarker : function() {
	            var args = _.toArray(arguments);
	            return this._getOrInvoke(this._marker, args);
	        },

	        build : function() {
	            var that = this;
	            var data = that.data;
	            var geom = data.geometry;
	            if (that._isEmptyGeometry(geom)) {
	                return false;
	            }
	            var options = that.getOptions(data);
	            var layer = L.GeoJSON.geometryToLayer(data, function(resource,
	                latlng) {
	                var marker = that.getMarker(latlng, options);
	                if (!marker) {
	                    marker = new L.Marker(latlng, options);
	                }
	                return marker;
	            }, L.GeoJSON.coordsToLatLng, options);
	            _.each(that._handlers, function(handler, event) {
	                layer.on(event, function(ev) {
	                    handler(data, ev);
	                });
	            });
	            return layer;
	        },

	        _getOrInvoke : function(val, args) {
	            if (_.isFunction(val)) {
	                return val.apply(val, args);
	            } else {
	                return val;
	            }
	        },

	        /**
	         * Returns <code>true</code> if the specified geometry is empty.
	         */
	        _isEmptyGeometry : function(geom) {
	            if (!geom || !geom.coordinates || //
	            !geom.coordinates.length)
	                return true;
	            if (geom.type == 'Point') {
	                if (!geom.coordinates[0] || !geom.coordinates[1])
	                    return true;
	            }
	            return false;
	        },

	    });

	    var LeafletFeatureBuilder = function(data, options) {
	        return new Config(data, options);
	    };

	    return LeafletFeatureBuilder;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(11), __webpack_require__(1), //
	__webpack_require__(4), __webpack_require__(10) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var _ = __webpack_require__(11);
	    var Mosaic = __webpack_require__(1);
	    var DataSetView = __webpack_require__(4);
	    var TemplateView = __webpack_require__(10);

	    var TemplateDataSetView = DataSetView.extend(TemplateView.prototype, {
	        initialize : function(options) {
	            DataSetView.prototype.initialize.apply(this, arguments);
	            TemplateView.prototype.initialize.apply(this, arguments);
	        },

	        onRenderBegin : function() {
	            this.open();
	        },

	        onRemove : function() {
	            this.close();
	        },

	        /**
	         * Sets a new view corresponding to the specified key.
	         */
	        _setView : function(key, view) {
	            var that = this;
	            var oldView = that._getView(key);
	            DataSetView.prototype._setView.apply(that, arguments);
	            if (oldView) {
	                oldView.remove();
	            }
	            view.render();
	            var element = that.getElement();
	            element.append(view.getElement());
	            return that;
	        },

	        /** Sets a new view corresponding to the specified key. */
	        _removeView : function(key, view) {
	            DataSetView.prototype._removeView.apply(this, arguments);
	            view.remove();
	            return this;
	        },

	    });
	    return TemplateDataSetView;
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(11), __webpack_require__(13), __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var _ = __webpack_require__(11);
	    var $ = __webpack_require__(13);
	    var Mosaic = __webpack_require__(1);

	    /**
	     * Template-based view. It uses HTML templates to represent information.
	     */
	    var TemplateView = Mosaic.Class.extend({

	        /** Name of this type */
	        type : 'TemplateView',

	        /**
	         * Trigger events and calls onXxx methods on this object.
	         */
	        triggerMethod : Mosaic.Events.triggerMethod,

	        /** Listens to events produced by external objects */
	        listenTo : Mosaic.Events.listenTo,

	        /**
	         * Removes all event listeners produced by external objects.
	         */
	        stopListening : Mosaic.Events.stopListening,

	        /** Initializes this object. */
	        initialize : function(options) {
	            Mosaic.Events.apply(this, arguments);
	            this.setOptions(options);
	            this.triggerMethod('initialize');
	        },

	        /**
	         * Returns the topmost DOM element of this view.
	         */
	        getElement : function() {
	            if (!this.$el) {
	                var el = this.options.el || '<div></div>';
	                this.$el = $(el);
	            }
	            return this.$el;
	        },

	        /**
	         * This is a default rendering method which is called if a method
	         * referenced in the "data-render" attribute was not found.
	         */
	        renderDefault : function(el, methodName) {
	            var err = new Error('[' + methodName + //
	            ']: Renderer method not found.');
	            console.log(err.stack, el);
	        },

	        /**
	         * This is a default method which is called after rendering if a method
	         * referenced in the "data-rendered" attribute was not found.
	         */
	        renderedDefault : function(el, methodName) {
	            var err = new Error('[' + methodName + ']: Method called ' + //
	            'after the rendering process ' + 'is not defined.');
	            console.log(err.stack, el);
	        },

	        /**
	         * Default method used to handle events for which no specific handlers
	         * were defined.
	         */
	        handleDefault : function(el, methodName) {
	            var err = new Error('[' + methodName + //
	            ']: A handler method with such a name ' + //
	            'was not found.');
	            console.log(err.stack, el);
	        },

	        /**
	         * Public method rendering the specified element. This method seeks all
	         * elements containing "data-render" attributes and calls functions
	         * Mosaic * referenced by this attribute. When the rendering process is
	         * finished then this method calls all functions referenced by the
	         * "data-rendered" attribute. Referenced functions should be defined in
	         * this view and they has to accept one parameter - a reference to the
	         * rendered element.
	         */
	        renderElement : function(elm, render) {
	            var list = [];
	            this._renderElement(elm, render, list);
	            // Notify about the end of the rendering process
	            _.each(list, function(e) {
	                this._callReferencedMethod(e, 'data-rendered',
	                        'renderedDefault');
	            }, this);
	        },

	        /**
	         * Binds event listeners to elements marked by "data-action-xxx"
	         * attributes (where "xxx" is the name of the action). The value of this
	         * action attributes should reference event listeners defined in this
	         * view. Example:
	         * <code>&lt;div data-action-click="sayHello">Hello&lt;/div></code>
	         */
	        bindListeners : function(elm, event, attrName) {
	            var element = elm[0];
	            if (!element)
	                return;
	            if (attrName === undefined) {
	                attrName = 'data-action-' + event;
	            }
	            var that = this;
	            var selector = '[' + attrName + ']';
	            elm.on(event, selector, function(ev) {
	                var e = $(ev.currentTarget);
	                var actionName = e.attr(attrName);
	                var action = that[actionName];
	                if (_.isFunction(action)) {
	                    action.call(that, ev, e);
	                } else {
	                    that.handleDefault(e, actionName);
	                }
	            });
	        },

	        /**
	         * This method renders this view. It performs the following actions: 1)
	         * it takes the topmost element of this class (using the "getElement"
	         * method) 2) If there is a "template" field defined in this object then
	         * it is used as a source for the underscore#template method to render
	         * the content; the result of template rendering is appended to the
	         * view's element. 3) This method calls all functions referenced in the
	         * "data-render" fields 4) After rendering it calls functions referenced
	         * in the "data-rendered" element attributes (to finalize the rendering
	         * process). 5) It attaches event listeners referenced by the
	         * "data-action-xxx" attributes.
	         */
	        render : function() {
	            var that = this;
	            that.triggerMethod('render:begin');
	            that._render();
	            that._bindEventListeners();
	            that.triggerMethod('render:end');
	            return this;
	        },

	        /**
	         * Removes all registered listeners and removes this view from DOM.
	         */
	        remove : function() {
	            this.triggerMethod('remove');
	            this.stopListening();
	            var element = this.getElement();
	            element.remove();
	            return this;
	        },

	        /* ----------------------------- */

	        /**
	         * This method calls a method of this view referenced by the specified
	         * element attribute.
	         */
	        _callReferencedMethod : function(elm, field, def) {
	            var result = null;
	            var methodName = elm.attr(field);
	            if (methodName) {
	                var method = this[methodName] || this[def];
	                elm.removeAttr(field);
	                if (method) {
	                    result = method.call(this, elm, methodName);
	                }
	            }
	            return result;
	        },

	        /**
	         * This internal method renders the specified element. It is called by
	         * the public "renderElement" method. This method seeks all elements
	         * containing "data-render" attributes and calls functions referenced by
	         * this attribute. When the rendering process is finished then this
	         * method calls all functions referenced by the "data-rendered"
	         * attribute. Referenced functions should be defined in this view and
	         * they has to accept one parameter - a reference to the rendered
	         * element.
	         */
	        _renderElement : function(elm, render, list) {
	            var visit = true;
	            if (render !== false) {
	                if (elm.attr('data-rendered')) {
	                    list.push(elm);
	                }
	                var result = this._callReferencedMethod(elm, 'data-render',
	                        'renderDefault');
	                visit = result !== false;
	            }
	            if (visit) {
	                var children = _.toArray(elm.children());
	                _.each(children, function(elm) {
	                    this._renderElement($(elm), true, list);
	                }, this);
	            }
	            this.triggerMethod('render');
	        },

	        /**
	         * Binds event listeners referenced in "data-action-xxx" element
	         * attributes (where "xxx" is "click", "mouseover", "mouseout", "focus",
	         * "blur", "keypress", "keydown", "keyup"...).
	         */
	        _bindEventListeners : function() {
	            var actions = [ 'click', 'mouseover', 'mouseout', 'focus', 'blur',
	                    'keypress', 'keydown', 'keyup' ];
	            var element = this.getElement();
	            _.each(actions, function(action) {
	                this.bindListeners(element, action);
	            }, this);
	        },

	        /**
	         * Renders the topmost element. This method is called from the public
	         * "render" method (see the description in this method). This method
	         * does not fires any events.
	         */
	        _render : function() {
	            var that = this;
	            var element = that.getElement();
	            that._renderTemplate();
	            if (that.className) {
	                element.attr('class', that.className);
	            }
	            that.renderElement(element);
	            return that;
	        },

	        /**
	         * Visualizes data using the internal template (if it is defined in this
	         * view).
	         */
	        _renderTemplate : function() {
	            var that = this;
	            var template = that.template;
	            if (!template)
	                return;
	            var options = _.extend({}, that.options, {
	                view : that
	            });
	            if (_.isString(template)) {
	                template = _.template(template);
	            }
	            var html = template(options);
	            var element = that.getElement();
	            element.html(html);
	        }

	    });

	    /**
	     * Extends the specified TemplateView object with the HTML content defined
	     * in the given element and with methods defined in "script" elements marked
	     * by attributes "data-type" equal to "methods" (for instance methods) and
	     * "const" for static methods.
	     */
	    TemplateView.extendViewType = function(e, View) {
	        e = $(e).clone();
	        View = View || this.extend({});

	        // Define static constants
	        var scripts = e.find('script[data-type="static"]');
	        _.each(elementToObject(scripts), function(obj) {
	            _.extend(View, obj);
	        }, this);
	        scripts.remove();

	        // Define template methods
	        scripts = e.find('script');
	        _.each(elementToObject(scripts), function(obj) {
	            _.extend(View.prototype, obj);
	        }, this);
	        // Remove all scripts
	        scripts.remove();

	        // The rest of the code is used as a template
	        var html = e.html();
	        html = trim(html);
	        if (html && html !== '') {
	            View.prototype.template = html;
	        }
	        return View;
	    };

	    function trim(str) {
	        if (!str)
	            return '';
	        str = str.replace(/^[\n\r\s]+|[\n\r\s]$/gim, '');
	        return str;
	    }

	    /**
	     * Converts the text content of the specified element into a JS object. This
	     * utility method could be used to convert JS code defined in
	     * <code>&lt;script>..&lt;script></code> elements into an object.
	     */
	    function elementToObject(e) {
	        var results = [];
	        var that = this;
	        e.each(function() {
	            try {
	                var text = $(this).text();
	                text = trim(text);
	                text = '( ' + text + ')';
	                var handle = eval;
	                var obj = handle(text);
	                if (_.isFunction(obj)) {
	                    obj = obj();
	                }
	                results.push(obj);
	            } catch (e) {
	                console.log('ERROR!', e.stack);
	            }
	        });
	        return results;
	    }

	    return TemplateView;
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }
/******/ ])
});
