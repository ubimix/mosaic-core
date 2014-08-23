/*!
 * mosaic-core v0.0.2 | License: MIT 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mosaic-commons"), require("underscore"), require("mosaic-teleport"), require("leaflet"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["mosaic-commons", "underscore", "mosaic-teleport", "leaflet", "react"], factory);
	else if(typeof exports === 'object')
		exports["mosaic-core"] = factory(require("mosaic-commons"), require("underscore"), require("mosaic-teleport"), require("leaflet"), require("react"));
	else
		root["mosaic-core"] = factory(root["mosaic-commons"], root["underscore"], root["mosaic-teleport"], root["leaflet"], root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_23__, __WEBPACK_EXTERNAL_MODULE_24__) {
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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(2), __webpack_require__(3), __webpack_require__(4),
	        __webpack_require__(5), __webpack_require__(6), __webpack_require__(7), __webpack_require__(8),
	        __webpack_require__(9), __webpack_require__(10), __webpack_require__(11),
	        __webpack_require__(12), __webpack_require__(13),
	        __webpack_require__(14),
	        // './TemplateDataSetView', './TemplateView', './TemplateViewManager',
	        __webpack_require__(15), __webpack_require__(16), __webpack_require__(17), __webpack_require__(18),
	        __webpack_require__(19), __webpack_require__(20) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var Mosaic = __webpack_require__(1);
	    Mosaic.App = __webpack_require__(2);
	    Mosaic.App.Actions = __webpack_require__(3);
	    Mosaic.App.Api = __webpack_require__(4);
	    Mosaic.App.Component = __webpack_require__(5);
	    Mosaic.App.Store = __webpack_require__(6);

	    Mosaic.Leaflet = {
	        ReactMap : __webpack_require__(12),
	        FeatureBuilder : __webpack_require__(14),
	    };

	    Mosaic.Core = {
	        DataSet : __webpack_require__(8),
	        TreeNode : __webpack_require__(19),
	        AbstractSet : __webpack_require__(7),
	        AdapterManager : __webpack_require__(15),
	        CompositeDataSet : __webpack_require__(9),
	        DataSetView : __webpack_require__(10),
	        Dependencies : __webpack_require__(16),
	        Intents : __webpack_require__(17),
	        LeafletDataSetView : __webpack_require__(11),
	        LeafletDataSubsetView : __webpack_require__(13),
	        LeafletFeatureBuilder : __webpack_require__(14),
	        // TemplateDataSetView : require('./TemplateDataSetView'),
	        // TemplateView : require('./TemplateView'),
	        // TemplateViewManager : require('./TemplateViewManager'),

	        ReactDataSetMixin : __webpack_require__(20),
	        ViewManager : __webpack_require__(18),

	    };
	    return Mosaic.Core;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


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
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(17) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var Mosaic = __webpack_require__(1);
	    var Intents = __webpack_require__(17);

	    /**
	     * An application main class. It is the common superclass for all classes
	     * implementing applications.
	     */
	    return Mosaic.Class.extend(Mosaic.Events.prototype, {

	        /** Constructor of this class. It initializes application modules. */
	        initialize : function(options) {
	            this.setOptions(options);
	            this.intents = new Intents();
	            this.initModules();
	        },

	        /**
	         * Starts the application. This method pre-loads initial data and
	         * activate views.
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
	         * Pre-loads data for this application and optionally returns a promise
	         * with results.
	         */
	        preloadData : function() {
	        },

	        /**
	         * This function should load and initialize all modules of this
	         * application.
	         */
	        initModules : function() {
	        },

	        /** Removes modules of this applications. */
	        deleteModules : function() {
	        },

	        /**
	         * This method should initialize main views of this application. This
	         * method is called after initial application data are loaded. The
	         * specified error parameter is defined if there is an error while data
	         * loading. This method should visualize an error message in this case.
	         */
	        initViews : function(error) {
	        },

	        /** Closes all views of this application. */
	        deleteViews : function() {
	        }

	    });

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(5) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var _ = __webpack_require__(21);
	    var AppComponent = __webpack_require__(5);

	    /** Common superclass for all stores */
	    return AppComponent.extend({

	    });
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1), __webpack_require__(22),
	        __webpack_require__(5) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var _ = __webpack_require__(21);
	    var AppComponent = __webpack_require__(5);
	    var Mosaic = __webpack_require__(1);

	    /**
	     * An common super-class for all APIs objects. It contains some utility
	     * methods used to load information from the server.
	     */
	    return AppComponent.extend({

	        /**
	         * Constructor of this class. Initializes the internal cache for data
	         * loaded from the server.
	         */
	        initialize : function() {
	            AppComponent.prototype.initialize.apply(this, arguments);
	            this._cache = {};
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

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var Mosaic = __webpack_require__(1);

	    /**
	     * An application component. It is the common superclass for all classes
	     * using the application as an execution context.
	     */
	    return Mosaic.Class.extend(Mosaic.Events.prototype, {

	        initialize : function(options) {
	            this.setOptions(options);
	            this.app = this.options.app;
	        },

	    });

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(5) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    var _ = __webpack_require__(21);
	    var AppComponent = __webpack_require__(5);

	    /** Common superclass for all stores */
	    return AppComponent.extend({

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
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(21);

	    /** Objects of this type are used to keep information about data set entries */
	    var SetEntry = Mosaic.Class.extend(// 
	    Mosaic.Events.prototype, Mosaic.Events, {
	        initialize : function(options) {
	            _.extend(this, options);
	        }
	    });

	    /**
	     * This is an abstract set used to manage of key/value pairs and generate
	     * notifications about new/updated/removed entries in this set. To perform
	     * notifications this class uses the "_onEnter", "_onUpdate" and "_onExit"
	     * methods respectively. This class should be extended to add custom
	     * behaviour for each type of changes.
	     */
	    var AbstractSet = Mosaic.Class.extend(//
	    Mosaic.Events.prototype, Mosaic.Events, {

	        /**
	         * Class constructor.
	         * 
	         * 
	         * @param options.getId
	         *            this optional method is used to retrieve object
	         *            identifiers
	         */
	        initialize : function(options) {
	            this.setOptions(options);
	            if (_.isFunction(this.options.getKey)) {
	                this.getKey = this.options.getKey;
	            }
	            this._index = {};
	        },

	        /**
	         * Sets a new array of objects and calls onEnter, onUpdate and onExit
	         * methods for each entry; each index contains keys and the
	         * corresponding index entries with "key", "obj" and "idx" fields (where
	         * "key" is the key of the object; "obj" the object itself and "idx" the
	         * index of this object in the list). This method returns reference to
	         * this instance to allow methods call chaining.
	         */
	        _setObjects : function(objects) {
	            var that = this;
	            var array = _.toArray(objects);
	            var newIndex = {};
	            var event = {
	                enter : {},
	                update : {},
	                exit : {}
	            };
	            _.each(array, function(d, i) {
	                var key = that.getKey(d);
	                var entry;
	                if (_.has(that._index, key)) {
	                    entry = that._onUpdate(that._index[key]) || entry;
	                    delete that._index[key];
	                    event.update[entry.key] = entry;
	                } else {
	                    entry = that._newSetEntry({
	                        key : key,
	                        obj : d,
	                        idx : i
	                    });
	                    entry = that._onEnter(entry) || entry;
	                    event.enter[entry.key] = entry;
	                }
	                newIndex[key] = entry;
	            });
	            _.each(that._index, function(entry) {
	                event.exit[entry.key] = that._onExit(entry) || entry;
	            });
	            that._index = newIndex;
	            return event;
	        },

	        /** Creates and returns a SetEntry instance. */
	        _newSetEntry : function(options) {
	            return new SetEntry(options);
	        },

	        /**
	         * This method returns index entries containing the data, the
	         * corresponding key and position of the data object in the array.
	         */
	        _getIndexEntries : function(key) {
	            if (key) {
	                if (_.isArray(key)) {
	                    return _.map(key, function(k) {
	                        return this._index[k];
	                    }, this);
	                } else {
	                    return this._index[key];
	                }
	            } else {
	                return _.values(this._index);
	            }
	        },

	        /**
	         * This method returns an index entry corresponding to the specified
	         * key.
	         */
	        _getIndexEntry : function(key) {
	            return this._index[key];
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

	        /**
	         * This method is called when a new object is added to the index.
	         * 
	         * @param entry
	         *            an index entry object containing the index, its position
	         *            and the corresponding key
	         */
	        _onEnter : function(entry) {
	            entry.emit('enter');
	            return entry;
	        },

	        /**
	         * This method is called when an object is removed from the index.
	         * 
	         * @param entry
	         *            an index entry object containing the index, its position
	         *            and the corresponding key
	         */
	        _onExit : function(entry) {
	            entry.emit('exit');
	            return entry;
	        },

	        /**
	         * This method is called to notify about updated (already existing in
	         * index) objects.
	         * 
	         * @param entry
	         *            an index entry object containing the index, its position
	         *            and the corresponding key
	         */
	        _onUpdate : function(entry) {
	            entry.emit('update');
	            return entry;
	        },

	        /** Gets the index of an entry with the specified key. */
	        getIndex : function(key) {
	            var entry = key ? this._index[key] : null;
	            return entry ? entry.idx : -1;
	        },

	        /**
	         * Returns <code>true</code> if this set contains the specified key.
	         */
	        hasKey : function(key) {
	            return _.has(this._index, key);
	        }
	    });
	    AbstractSet.SetEntry = SetEntry;

	    return AbstractSet;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(7), __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var AbstractSet = __webpack_require__(7);
	    var _ = __webpack_require__(21);

	    /**
	     * This class represents a data set. Each dataset manages a set of objects
	     * with unique keys. The "setData" of this class accepts an array of objects
	     * and sends notifications about changes with this data set to the
	     * registered listener. This listener could be registered using the
	     * "setListener" method or it can be defined as a parameter of the class
	     * constructor.
	     */
	    var DataSet = AbstractSet.extend({

	        /**
	         * Class constructor.
	         * 
	         * 
	         * @param options.getId
	         *            this optional method is used to retrieve object
	         *            identifiers
	         */
	        initialize : function(options) {
	            AbstractSet.prototype.initialize.apply(this, arguments);
	            this._open = false;
	        },

	        /**
	         * Opens this data set - registeres data set listeners and sets the
	         * initial data.
	         */
	        open : function() {
	            if (this._open)
	                return false;
	            this.triggerMethod('open');
	            if (this.options.data) {
	                this.setData(this.options.data);
	            }
	            this._open = true;
	            return true;
	        },

	        /** Closes this dataset. It removes all registered listeners. */
	        close : function() {
	            if (!this._open)
	                return false;
	            this.setData([]);
	            this.triggerMethod('close');
	            this._open = false;
	            return true;
	        },

	        /**
	         * Sets a new array of objects and generates an "update" event
	         * containing the "enter", "exit" and "update" indexes; each index
	         * contains keys and the corresponding index entries with "key", "obj"
	         * and "idx" fields (where "key" is the key of the object; "obj" the
	         * object itself and "idx" the index of this object in the list). This
	         * method returns reference to this instance to allow methods call
	         * chaining.
	         */
	        setData : function(data) {
	            this.triggerMethod('update:begin');
	            var event = this._setObjects(data);
	            this.triggerMethod('update', event);
	            this.triggerMethod('update:end');
	            return this;
	        },

	        /**
	         * This method returns an object with the specified key or the full
	         * array of all objects if such a key is not defined.
	         */
	        getData : function(key) {
	            if (key) {
	                var entry = this._index[key];
	                return entry ? entry.obj : null;
	            } else {
	                return _.map(this._index, function(entry) {
	                    return entry.obj;
	                });
	            }
	        },

	        /**
	         * This method returns an index entries containing the data, the
	         * corresponding key and position of the data object in the array.
	         */
	        getDataEntries : function(key) {
	            if (key) {
	                var entry = this._index[key];
	                return entry;
	            } else {
	                return _.values(this._index);
	            }
	        },

	        /** Returns position of the specified entity in this dataset. */
	        getDataIndex : function(d) {
	            var key = this.getKey(d);
	            return this.getIndex(key);
	        },

	    });

	    return DataSet;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(8) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var _ = __webpack_require__(21);
	    var DataSet = __webpack_require__(8);

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
	            if (!DataSet.prototype.open.apply(this, arguments))
	                return false;
	            _.each(this.options.dataSets, function(dataSet) {
	                dataSet.on('update', this._filterDataSets);
	            }, this);
	            this._filterDataSets();
	            return true;
	        },

	        /** Closes this dataset. It removes all registered listeners. */
	        close : function() {
	            if (!DataSet.prototype.close.apply(this, arguments))
	                return false;
	            _.each(this.options.dataSets, function(dataSet) {
	                dataSet.off('update', this._filterDataSets);
	            }, this);
	            DataSet.prototype.setData.call(this, []);
	            return true;
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
	                    var entry = dataSet.getDataEntries(key);
	                    return entry;
	                });
	                var obj = this._filterData(key, array);
	                if (obj) {
	                    data.push(obj);
	                }
	            }, this);
	            DataSet.prototype.setData.call(this, data);
	        },

	        /**
	         * Filters/merges individual index entries corresponding to the same
	         * key.
	         * 
	         * @param array
	         *            an array of index entries from all datasets corresponding
	         *            to the same key; each entry contains the "obj", "idx" and
	         *            "key" fields.
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1), __webpack_require__(7) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(21);
	    var AbstractSet = __webpack_require__(7);

	    /**
	     * Subclasses of this type are used to visualize data set content.
	     */
	    /**
	     * This mixin contains common methods used to visualize data set content.
	     */
	    var DataSetView = AbstractSet.extend({

	        /**
	         * Constructor of this class. This method expects that the parameters
	         * contain a "dataSet" field. These fields "onEnter", "onUpdate" and
	         * "onExit" are used to provide/manage features on the map.
	         * 
	         * @param options.dataSet
	         *            a mandatory data set object
	         */
	        initialize : function(options) {
	            AbstractSet.prototype.initialize.apply(this, arguments);
	            this._onDataSetUpdate = _.bind(this._onDataSetUpdate, this);
	            if (!this.options.dataSet) {
	                throw new Error('Data set is not defined.');
	            }
	        },

	        /**
	         * Returns a key for the specified object. This method uses the "getKey"
	         * method of the underlying data set.
	         */
	        getKey : function(d) {
	            return this.getDataSet().getKey(d);
	        },

	        /**
	         * "Opens" this view and notify about all already existing nodes.
	         */
	        open : function() {
	            if (this._open)
	                return false;
	            var dataSet = this.getDataSet();
	            dataSet.on('update:end', this._onDataSetUpdate);
	            this._setData(dataSet.getData());
	            this._open = true;
	            return true;
	        },

	        /**
	         * Removes this view and unsubscribe from data set notifications.
	         */
	        close : function() {
	            if (!this._open)
	                return false;
	            var dataSet = this.getDataSet();
	            this._setData([]);
	            dataSet.off('update:end', this._onDataSetUpdate);
	            this._open = false;
	            return true;
	        },

	        /** Returns the underlying dataset */
	        getDataSet : function() {
	            return this.options.dataSet;
	        },

	        /** Rebuild views corresponding to the specified data entries. */
	        _setData : function(data) {
	            var that = this;
	            that.triggerMethod('update:begin');
	            that._setObjects(data);
	            that.triggerMethod('update:end');
	            return this;
	        },

	        /**
	         * Handles data set update notifications and render individual views.
	         */
	        _onDataSetUpdate : function(e) {
	            var dataSet = this.getDataSet();
	            var data = dataSet.getData();
	            this._setData(data);
	        },

	    });

	    return DataSetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(23), __webpack_require__(10) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var L = __webpack_require__(23);
	    var DataSetView = __webpack_require__(10);

	    /**
	     * A Leaflet layer providing automatic rendering of data from a dataset.
	     * This class uses the "onEnter", "onUpdate" and "onExit" callbacks to
	     * generate visible features on the map. Use the "LeafletFeatureBuilder"
	     * class to simplify creation of leaflet features in these callbacks.
	     */
	    var LeafletDataSetView = DataSetView.extend({

	        initialize : function(options) {
	            DataSetView.prototype.initialize.apply(this, arguments);
	            // this._onZoomEnd = _.debounce(_.bind(this._onZoomEnd, this), 200);
	            this._onZoomEnd = _.bind(this._onZoomEnd, this);
	        },

	        /**
	         * This method is used by Leaflet when this layer is inserted in the
	         * map.
	         */
	        onAdd : function(map) {
	            this._map = map;
	            this._map.on('zoomend', this._onZoomEnd);
	            this._layer = new L.featureGroup();
	            this._map.addLayer(this._layer);
	            this.open();
	            this._onZoomEnd();
	        },

	        /**
	         * This method is called by Leaflet to remove this layer from the map.
	         */
	        onRemove : function(map) {
	            this.close();
	            this._map.removeLayer(this._layer);
	            this._map.off('zoomend', this._onZoomEnd);
	            delete this._map;
	            delete this._layer;
	        },

	        /**
	         * Creates a new view and attaches it to the specified index entry.
	         */
	        _onEnter : function(entry) {
	            entry.layer = this._newLeafletLayer(entry);
	            if (entry.layer) {
	                this._layer.addLayer(entry.layer);
	            }
	            entry.emit('enter');
	            return entry;
	        },

	        /**
	         * Destroys a view in the specified index entry. This method should be
	         * overloaded in subclasses.
	         */
	        _onExit : function(entry) {
	            if (entry.layer) {
	                this._layer.removeLayer(entry.layer);
	            }
	            entry.emit('exit');
	            return entry;
	        },

	        /**
	         * Creates and returns a new leaflet layer for the specified entry. This
	         * method should be overloaded in subclasses to create real map
	         * entities.
	         */
	        _newLeafletLayer : function(entry) {
	        },

	        /** This method is called when the map changes its zoom level. */
	        _onZoomEnd : function() {
	            var that = this;
	            var zoom = that._map.getZoom();
	            _.each(that._index, function(entry) {
	                entry.emit('zoomend', {
	                    entry : entry,
	                    zoom : zoom
	                });
	            });
	        }

	    });

	    return LeafletDataSetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @jsx React.DOM
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(24), __webpack_require__(23) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    'use strict';
	    var _ = __webpack_require__(21);
	    var React = __webpack_require__(24);
	    var L = __webpack_require__(23);

	    return React.createClass({
	        displayName : 'ReactMap',
	        render : function() {
	            return (React.DOM.div({
	                ref : 'container',
	                id : this.props.id,
	                className : this.props.className
	            }));
	        },
	        componentDidMount : function() {
	            var container = this.refs.container.getDOMNode();
	            this.map = this._newMap(container);
	            if (this.props.onMapAdd) {
	                this.props.onMapAdd(this.map);
	            }
	        },
	        componentWillUnmount : function() {
	            if (this.props.onMapRemove) {
	                this.props.onMapRemove(this.map);
	            }
	            this.map.remove();
	            delete this.map;
	        },
	        _newMap : function(container) {
	            var mapOptions = this.props.options || {};
	            var map = L.map(container, {
	                zoomControl : false
	            });
	            var options = _.extend({}, mapOptions.zoomControl);
	            options = _.defaults(options, {
	                position : 'topright'
	            });

	            // Set the initial view of this map
	            var zoomControl = L.control.zoom(options);
	            map.addControl(zoomControl);
	            var center = mapOptions.center;
	            if (_.isArray(center)) {
	                center = L.latLng(center[1], center[0]);
	            }
	            var zoom = mapOptions.zoom;
	            if (center && zoom !== undefined) {
	                map.setView(center, zoom);
	            }
	            return map;
	        }
	    });

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(10) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var DataSetView = __webpack_require__(10);

	    /**
	     * This class manages entries of sub-sets of a data set. It does not
	     * add/remove features on the map, it just changes their representation.
	     */
	    var LeafletDataSubsetView = DataSetView.extend({

	        /**
	         * Creates a new view and attaches it to the specified index entry.
	         */
	        _onEnter : function(entry) {
	            var parentView = this.options.parent;
	            if (parentView) {
	                var parentEntry = parentView._getIndexEntry(entry.key);
	                // Copies all fields from a view found in the parent
	                _.extend(entry, parentEntry);
	            }
	            entry.emit('enter');
	            return entry;
	        },

	        /**
	         * This method is used by Leaflet when this layer is inserted in the
	         * map.
	         */
	        onAdd : function(map) {
	            this.open();
	        },

	        /** This method is called by Leaflet to remove this layer from the map. */
	        onRemove : function(map) {
	            this.close();
	        }

	    });

	    return LeafletDataSubsetView;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(1), __webpack_require__(23) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var L = __webpack_require__(23);
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
	                        return this._handlers[key];
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    "use strict";

	    var _ = __webpack_require__(21);
	    var Mosaic = __webpack_require__(1);
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

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1), __webpack_require__(7) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(21);

	    /** This is a simple class used to manage dependencies between entities. */
	    var Dependencies = Mosaic.Class.extend({

	        /**
	         * Sets dependencies between modules using a map where keys are module
	         * names and values are lists of dependencies. This method rises an
	         * exception if user tries to set circular dependencies.
	         * 
	         * @param dependencies
	         *            a map containing modules with the corresponding arrays of
	         *            dependencies
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
	         *            the key of the module
	         * @param dependencies
	         *            an array of dependencies for the specified module
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
	         *            the key of an entry to visit
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
	         *            the key of the action to launch; if this parameter is an
	         *            array then all keys from this array will be executed
	         * @param listener
	         *            a listener object containing two methods: "begin" and
	         *            "end"
	         * @param listener.begin
	         *            this method takes one parameter - the key of the current
	         *            action
	         * @param listener.end
	         *            this method takes 3 parameters - 1) key of the action, 2)
	         *            error thrown by previous actions or null 3) result of the
	         *            previous action
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
	         * A list of all dependencies for the specified key in the order of
	         * their resolving.
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
	         *            index of promises for already executed actions
	         * @param key
	         *            key of the action to execute
	         * @param listener
	         *            a listener object containing two methods "begin" and "end"
	         * @param listener.begin
	         *            this method takes one parameter - the key of the current
	         *            action
	         * @param listener.end
	         *            this method takes 3 parameters - 1) key of the action, 2)
	         *            error thrown by previous actions or null 3) result of the
	         *            previous action
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
	         *            the key to check
	         * @param dependencies
	         *            a list of dependencies to check
	         */
	        _checkDependencies : function(key, dependencies) {
	            var that = this;
	            var deps = _.isArray(dependencies) ? dependencies
	                    : [ dependencies ];
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
	         * Really sets dependencies for a module with the specified key. This
	         * method could be overloaded in subclasses.
	         * 
	         * @param key
	         *            for this key a list dependencies should be set
	         * @param deps
	         *            a list of dependencies
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
	     *            the key of the initial dependency
	     * @param provider
	     *            a function returning an array of all dependencies for the
	     *            specified key
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

	    return Dependencies;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1), __webpack_require__(16) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(21);
	    var Dependencies = __webpack_require__(16);

	    /**
	     * This class manages intents. Each intent is a deferred object containing
	     * the following fields and method: 1) "promise"
	     */
	    var Intents = Mosaic.Class.extend({

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

	    return Intents;
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1), __webpack_require__(15) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {
	    "use strict";

	    var _ = __webpack_require__(21);
	    var Mosaic = __webpack_require__(1);
	    var AdapterManager = __webpack_require__(15);

	    /**
	     * Instances of this type manage visual widgets for resources shown in
	     * various contexts. For example a person profile in a contact list has much
	     * less details than the same user profile shown on a separate page. So
	     * resource visualization depends on the <em>context</em> and on the
	     * <em>type</em> of each resource. This class manages adapters for
	     * resource types in their respective contexts.
	     */
	    var ViewManager = Mosaic.Class.extend({

	        initialize : function(options) {
	            this.setOptions(options);
	            this._adapterManager = this.options.adapterManager || // 
	            new AdapterManager();
	            if (this.options.getResourceType) {
	                this.getResourceType = this.options.getResourceType;
	            }
	        },

	        /**
	         * Registers visualization widget for all resources of the specified
	         * type shown in the contexts with the given viewType.
	         */
	        registerView : function(viewType, resourceType, View) {
	            this._adapterManager.registerAdapter(viewType, resourceType, View);
	        },

	        /** Creates and returns a new view for the specified resource type. */
	        newView : function(viewType, resourceType, options) {
	            return this._adapterManager.newAdapterInstance(viewType,
	                    resourceType, options);
	        },

	        /**
	         * Returns the type of the specified object. This method should be
	         * overloaded in subclasses or in the constructor parameters.
	         */
	        getResourceType : function(d) {
	            return d.type || '';
	        },

	    });

	    return ViewManager;

	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21), __webpack_require__(1) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var Mosaic = __webpack_require__(1);
	    var _ = __webpack_require__(21);
	    /* ------------------------------------------------- */

	    /**
	     * Tree structure.
	     */
	    var TreeNode = Mosaic.Class.extend(//
	    Mosaic.Events.prototype, Mosaic.Events, {

	        /** Initializes this class */
	        initialize : function(options) {
	            this.setOptions(options);
	            this._children = {};
	        },

	        /** Returns a parent for this node. */
	        getParent : function() {
	            return this.parent;
	        },

	        /** Returns a key associated with this tree node */
	        getKey : function() {
	            return this.options.key;
	        },

	        /**
	         * Adds the specified subnode to this tree node.
	         */
	        add : function(key, node) {
	            var that = this;
	            that.remove(key);
	            node.parent = this;
	            that._children[key] = node;
	            node._notify('add', {});
	        },

	        /**
	         * Returns an child tree node corresponding to the specified key. If
	         * there is no such a sub-node and the flag "create" is true then a new
	         * subnode is created.
	         */
	        get : function(key, create) {
	            var that = this;
	            var result = that._children[key];
	            if (!result && create) {
	                result = that._newChild(key);
	                that.add(key, result);
	            }
	            return result;
	        },

	        /**
	         * Returns all child nodes corresponding to the specified keys or all
	         * children if keys are not defined.
	         */
	        getAll : function() {
	            var that = this;
	            var keys = _.toArray(arguments);
	            var results = [];
	            that._forEach(keys, function(child) {
	                results.push(child);
	            });
	            return results;
	        },

	        /**
	         * Returns keys of all children of this tree node. This method keeps the
	         * internal order of elements.
	         */
	        getAllKeys : function() {
	            var that = this;
	            return _.keys(that._children);
	        },

	        /**
	         * Returns true if this node is a parent of the specified tree node.
	         */
	        isParentOf : function(node, includeThis) {
	            var n = includeThis !== false ? node : node.getParent();
	            var result = false;
	            while (n) {
	                result = (n === this);
	                if (result)
	                    break;
	                n = n.getParent();
	            }
	            return result;
	        },

	        /**
	         * Finds and returns a child in this node or in a sub-nodes
	         * corresponding to the specified key.
	         */
	        find : function(key) {
	            var that = this;
	            var thisKey = that.getKey();
	            var result;
	            if (key == thisKey) {
	                result = that;
	            } else {
	                that._forEach([], function(child) {
	                    result = child.find(key);
	                    return !result;
	                });
	            }
	            return result;
	        },

	        /**
	         * Removes an item corresponding to the specified key from this group.
	         */
	        remove : function(key) {
	            var that = this;
	            var child = that._children[key];
	            if (child) {
	                child._notify('remove', {});
	                delete that._children[key];
	            }
	            return child;
	        },

	        /**
	         * Calls the specified callback for all nodes.
	         */
	        visit : function(visitor) {
	            var that = this;
	            var visit = true;
	            if (_.isFunction(visitor.before)) {
	                visit = visitor.before(that) !== false;
	            }
	            if (visit) {
	                _.each(that._children, function(child) {
	                    child.visit(visitor);
	                });
	            }
	            if (_.isFunction(visitor.after)) {
	                visitor.after(that);
	            }
	        },

	        /**
	         * Calls the specified callback for all slots corresponding to the given
	         * keys. If no keys are specified then this method iterates over all
	         * slots.
	         */
	        _forEach : function(keys, callback) {
	            var index = 0;
	            function visit(child) {
	                var stop = false;
	                if (child) {
	                    var cont = callback.call(that, child, index);
	                    stop = (cont === false);
	                }
	                index++;
	                return stop;
	            }
	            var that = this;
	            if (_.isFunction(keys)) {
	                callback = keys;
	                keys = [];
	            }
	            if (!keys || !keys.length) {
	                _.find(that._children, visit);
	            } else {
	                _.find(keys, function(key) {
	                    var child = that._children[key];
	                    return visit(child);
	                });
	            }
	        },

	        /**
	         * Notifies all listeners of this node and all parent nodes about the
	         * specified event.
	         */
	        _notify : function(eventKey, event) {
	            var node = this;
	            event.node = node;
	            while (node) {
	                node.triggerMethod(eventKey, event);
	                if (event.stopPropagation)
	                    break;
	                node = node.getParent();
	            }
	        },

	        /**
	         * Creates and returns a new tree node corresponding to the specified
	         * key
	         */
	        _newChild : function(key) {
	            var Type = this.getClass();
	            return new Type({
	                key : key
	            });
	        },
	    });

	    /* -------------------------------------------------------------- */

	    /**
	     * This mixin is used to add status management for Mosaic.TreeNode
	     * instances.
	     */
	    TreeNode.TreeNodeStatusMixin = {

	        /** Defaults status value */
	        _status : 'inactive',

	        /**
	         * Returns a "status" of this tree node. Status value reflects the state
	         * of this node which depends on the usage of this tree.
	         */
	        getStatus : function() {
	            return this._status || '';
	        },

	        /**
	         * Returns a "status" of this tree node. Status value reflects the state
	         * of this node which depends on the usage of this tree.
	         */
	        setStatus : function(status, options) {
	            var prevStatus = this._status;
	            var updated = prevStatus != status;
	            if (updated || options && options.force) {
	                this._status = status;
	                this._notify('status', _.extend({}, options, {
	                    prevStatus : prevStatus
	                }));
	            }
	        },

	        /** Returns true if this node is active */
	        isActive : function() {
	            return this._status == 'active';
	        },

	        /**
	         * Activates this node.
	         */
	        activate : function(options) {
	            this.setStatus('active', options);
	        },

	        /**
	         * Deactivates this node.
	         */
	        deactivate : function(options) {
	            this.setStatus('inactive', options);
	        },

	        /**
	         * Returns statistics about all states of child items. The returned
	         * object maps status to lists of child node keys.
	         */
	        getStats : function() {
	            var that = this;
	            var result = {
	                all : []
	            };
	            that._forEach([], function(child) {
	                var key = child.getKey();
	                result.all.push(key);
	                var status = child.getStatus();
	                var array = result[status] = result[status] || [];
	                array.push(key);
	            });
	            return result;
	        },

	        /**
	         * This method is notified when the status of a child node is changed.
	         * It checks this tree node is in the exclusive mode and in this case
	         * deactivates all other nodes.
	         */
	        onStatus : (function() {
	            // Returns a new event with a flag that this is an
	            // "internal"
	            // event fired by this method; This flag is used to
	            // avoid
	            // infinite event loops.
	            function newEvent() {
	                return {
	                    internal : true
	                };
	            }
	            // Activates all node before and deactivates after
	            // already
	            // active subnode
	            function activateBefore(child, stage) {
	                if (stage == 'before') {
	                    child.activate(newEvent());
	                } else if (stage == 'after') {
	                    child.deactivate(newEvent());
	                }
	            }
	            // Deactivates all node before and deactivates after
	            // already
	            // active subnode
	            function activateAfter(child, stage) {
	                if (stage == 'before') {
	                    child.deactivate(newEvent());
	                } else if (stage == 'after') {
	                    child.activate(newEvent());
	                }
	            }
	            // Deactivate all subnodes but the already active one
	            function exclusive(child, stage) {
	                if (stage == 'before' || stage == 'after') {
	                    child.deactivate(newEvent());
	                }
	            }
	            // Activates/deactivates child nodes for this tree node
	            function handleChildren(that, evt) {
	                var checkMode;
	                if (that.options.mode == 'activateBefore') {
	                    checkMode = activateBefore;
	                } else if (that.options.mode == 'activateAfter') {
	                    checkMode = activateAfter;
	                } else if (that.options.mode == 'exclusive' || //
	                that.options.exclusive !== false) {
	                    checkMode = exclusive;
	                }
	                if (checkMode) {
	                    var stage = 'before';
	                    var f = function(child) {
	                        if (stage == 'before' && //
	                        child.isParentOf(evt.node, true)) {
	                            stage = 'in';
	                        }
	                        checkMode(child, stage);
	                        if (stage == 'in') {
	                            stage = 'after';
	                        }
	                    };
	                    that._forEach([], f);
	                }
	            }
	            return function(evt) {
	                var that = this;
	                if (evt.node != that) {
	                    // One of sub-nodes was activated
	                    if (evt.node.isActive() && !evt.internal) {
	                        handleChildren(that, evt);
	                        that.activate();
	                    }
	                } else {
	                    // Deactivating of this node
	                    if (!that.isActive() && that.options.deactivateAll) {
	                        that.visit({
	                            after : function(child) {
	                                child.deactivate(newEvent());
	                            }
	                        });
	                    }
	                }
	            };
	        })(),
	    };

	    return TreeNode;
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;if (false) {
	    var define = require('amdefine')(module);
	}
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, __webpack_require__(21) ], __WEBPACK_AMD_DEFINE_RESULT__ = (function(require) {

	    var _ = __webpack_require__(21);

	    /**
	     * This is a common mixin used by React classes to add automatic binding for
	     * DataSets.
	     */
	    return {

	        getDataSet : function() {
	            return this.props.dataSet;
	        },

	        componentWillMount : function() {
	            var dataSet = this.getDataSet();
	            dataSet.on('update:end', this._onUpdate);
	        },

	        componentWillUnmount : function() {
	            var dataSet = this.getDataSet();
	            dataSet.off('update:end', this._onUpdate);
	        },

	        _onUpdate : function() {
	            var that = this;
	            that.setState(that._newState());
	        },

	        getInitialState : function() {
	            return this._newState();
	        },

	        _newState : function() {
	            return {};
	        },

	        renderChildren : function() {
	            var dataSet = this.getDataSet();
	            var list = _.map(dataSet._getIndexEntries(), function(entry) {
	                return this.renderChild(entry);
	            }, this);
	            return list;
	        },

	    };
	}.apply(null, __WEBPACK_AMD_DEFINE_ARRAY__)), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_21__;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_24__;

/***/ }
/******/ ])
});
