/*!
 * mosaic-core v0.0.22 | License: MIT 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("mosaic-commons"), require("underscore"), require("mosaic-teleport"), require("react"), require("leaflet"));
	else if(typeof define === 'function' && define.amd)
		define(["mosaic-commons", "underscore", "mosaic-teleport", "react", "leaflet"], factory);
	else if(typeof exports === 'object')
		exports["mosaic-core"] = factory(require("mosaic-commons"), require("underscore"), require("mosaic-teleport"), require("react"), require("leaflet"));
	else
		root["mosaic-core"] = factory(root["mosaic-commons"], root["underscore"], root["mosaic-teleport"], root["react"], root["leaflet"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_28__, __WEBPACK_EXTERNAL_MODULE_29__, __WEBPACK_EXTERNAL_MODULE_30__, __WEBPACK_EXTERNAL_MODULE_31__) {
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
	Mosaic.App = __webpack_require__(2);
	Mosaic.App.Actions = __webpack_require__(3);
	Mosaic.App.Api = __webpack_require__(4);
	Mosaic.App.Component = __webpack_require__(5);
	Mosaic.App.Store = __webpack_require__(6);
	
	Mosaic.React = {
	    FilterBox : __webpack_require__(7),
	    SearchBoxMixin : __webpack_require__(8),
	    PaginatedListView : __webpack_require__(9),
	    PopupPanel : __webpack_require__(10)
	};
	
	Mosaic.Leaflet = {
	    ReactMap : __webpack_require__(11),
	    FeatureBuilder : __webpack_require__(12),
	    UtfGrid : __webpack_require__(13),
	    MapViewport : __webpack_require__(14)
	};
	
	Mosaic.Core = {
	    DataSet : __webpack_require__(15),
	    ActivationTree : __webpack_require__(16),
	
	    AbstractSet : __webpack_require__(17),
	    AdapterManager : __webpack_require__(18),
	    CompositeDataSet : __webpack_require__(19),
	    DataSetView : __webpack_require__(20),
	    Dependencies : __webpack_require__(21),
	    Intents : __webpack_require__(22),
	    LeafletDataSetView : __webpack_require__(23),
	    LeafletDataSubsetView : __webpack_require__(24),
	    LeafletFeatureBuilder : __webpack_require__(12),
	    // TemplateDataSetView : require('./TemplateDataSetView'),
	    // TemplateView : require('./TemplateView'),
	    // TemplateViewManager : require('./TemplateViewManager'),
	
	    ReactDataSetMixin : __webpack_require__(25),
	    ViewManager : __webpack_require__(26),
	
	    URI : __webpack_require__(27)
	
	};
	module.exports = Mosaic;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var Intents = __webpack_require__(22);
	
	/**
	 * An application main class. It is the common superclass for all classes
	 * implementing applications.
	 */
	module.exports = Mosaic.Class.extend(Mosaic.Events.prototype, {
	
	    /** Constructor of this class. It initializes application modules. */
	    initialize : function(options) {
	        this.setOptions(options);
	        this.intents = new Intents();
	        this.initModules();
	    },
	
	    /**
	     * Starts the application. This method pre-loads initial data and activate
	     * views.
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
	     * Pre-loads data for this application and optionally returns a promise with
	     * results.
	     */
	    preloadData : function() {
	    },
	
	    /**
	     * This function should load and initialize all modules of this application.
	     */
	    initModules : function() {
	    },
	
	    /** Removes modules of this applications. */
	    deleteModules : function() {
	    },
	
	    /**
	     * This method should initialize main views of this application. This method
	     * is called after initial application data are loaded. The specified error
	     * parameter is defined if there is an error while data loading. This method
	     * should visualize an error message in this case.
	     */
	    initViews : function(error) {
	    },
	
	    /** Closes all views of this application. */
	    deleteViews : function() {
	    }
	
	});


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var AppComponent = __webpack_require__(5);
	
	/** Common superclass for all stores */
	module.exports = AppComponent.extend({});


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var AppComponent = __webpack_require__(5);
	var Mosaic = __webpack_require__(1);
	var Teleport = __webpack_require__(29);
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	
	/**
	 * An application component. It is the common superclass for all classes using
	 * the application as an execution context.
	 */
	module.exports = Mosaic.Class.extend(Mosaic.Events.prototype, {
	
	    initialize : function(options) {
	        this.setOptions(options);
	        this.app = this.options.app;
	    },
	
	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var AppComponent = __webpack_require__(5);
	
	/** Common superclass for all stores */
	module.exports = AppComponent.extend({
	
	    /**
	     * Overloads the parent 'setOptions' method to set the application in the
	     * 'app' field of this object.
	     */
	    setOptions : function(options) {
	        AppComponent.prototype.setOptions.apply(this, arguments);
	        if (this.options.app) {
	            this.app = this.options.app;
	        }
	    },
	
	    /**
	     * Declares new actions (intents) on this store. All actions are available
	     * on the "action" field of this store.
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
	     * This method should initialize all internal fields of the store. It should
	     * be overloaded in subclasses.
	     */
	    _initFields : function() {
	    },
	
	});


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var Mosaic = __webpack_require__(1);
	var React = __webpack_require__(30);
	
	/**
	 * Datamodel for the FilterBox component providing access to values to
	 * visualize.
	 */
	var FilterBoxModel = Mosaic.Class.extend(Mosaic.Events.prototype, {
	
	    initialize : function(options) {
	        this.values = [];
	        _.extend(this, options);
	    },
	    /** Sets a new list of value objects. */
	    set : function(values, notify) {
	        if (!_.isArray(values)) {
	            values = [];
	        }
	        this.values = values;
	        this._notify('set');
	        return this;
	    },
	    /** Returns a list of existing values. */
	    getAll : function() {
	        return this.values;
	    },
	    /** Adds a new text and creates a new tag object. */
	    add : function(text) {
	        this.values.push(this.newFilterValue(text));
	        this._notify('add');
	        return this;
	    },
	    /** Removes the specified value from the list. */
	    remove : function(tag) {
	        var len = this.values.length;
	        this.values = _.filter(this.values, function(t) {
	            return (t != tag);
	        });
	        if (this.values.length != len) {
	            this._notify('remove');
	        }
	        return this;
	    },
	    newFilterValue : function(text) {
	        return {
	            label : text
	        };
	    },
	    /** Updates focused status of the underlying input box. */
	    setFocused : function(focused, silent) {
	        var changed = false;
	        if (this._focused === focused) {
	            return;
	        }
	        changed = true;
	        this._focused = focused;
	        if (!silent) {
	            this.emit('focus', this._focused);
	        }
	    },
	    /** Returns <code>true</code> if the input is focused. */
	    isFocused : function() {
	        return !!this._focused;
	    },
	    /** Notifies subscribers about changes */
	    _notify : function(evt) {
	        if (evt) {
	            this.emit(evt);
	        }
	        this.emit('changed');
	        return this;
	    },
	    /** Adds a new change listener */
	    addChangeListener : function(listener, context) {
	        this.on('changed', listener, context);
	        return this;
	    },
	    /** Removes a change listener */
	    removeChangeListener : function(listener, context) {
	        this.off('changed', listener, context);
	        return this;
	    },
	});
	
	/**
	 * Allows to manage filtering boxes where filter criteria are added as tags to
	 * the list. This class expects the following parameters in the constructor:
	 * 
	 * @param model
	 *                the model object with the following fields/methods:
	 * @param model.getAll
	 *                this method returns all values in this filter
	 * @param model.add
	 *                this method adds a new text value to the filter list
	 * @param model.remove
	 *                removes the specified object from the internal list
	 * @param model.set
	 *                sets a new values; new values replace the old one
	 */
	module.exports = React.createClass({
	    displayName : 'React.FilterBox',
	    statics : {
	        Model : FilterBoxModel,
	        extendModel : function(options) {
	            return FilterBoxModel.extend(options);
	        }
	    },
	    /** Returns the initial state for this input box. */
	    getInitialState : function() {
	        return this._newState({});
	    },
	    /** This method registers an API listener. */
	    componentWillMount : function() {
	        this.props.model.addChangeListener(this._notifyUpdates);
	    },
	    /** Removes the registered API listener. */
	    componentWillUnmount : function() {
	        this.props.model.removeChangeListener(this._notifyUpdates);
	    },
	    componentDidMount : function() {
	        this.componentDidUpdate();
	    },
	    componentDidUpdate : function() {
	        if (this.props.model.isFocused()) {
	            var input = this.refs.input;
	            var node = input.getDOMNode();
	            node.focus();
	        }
	    },
	    /** Updates this view when model properties were changed. */
	    _notifyUpdates : function() {
	        this.setState(this._newState({
	            text : ''
	        }));
	        this.props.model.setFocused(true);
	    },
	    /** Returns a new state. */
	    _newState : function(options) {
	        var model = this.props.model;
	        return _.extend({
	            text : '',
	            values : model.getAll()
	        }, this.state, options);
	    },
	    /** Sets the specified value as a search criteria and activates search */
	    _addValue : function(value) {
	        if (value && value !== '') {
	            this.props.model.add(value);
	        }
	    },
	    /** Removes the last tag */
	    _removeLastValue : function() {
	        var model = this.props.model;
	        var all = model.getAll();
	        if (all && all.length) {
	            model.remove(all[all.length - 1]);
	        }
	    },
	    /**
	     * This handler is called when user clicks on the FilterBox DOM node to
	     * focus the input box.
	     */
	    _focusInput : function(ev) {
	        this.props.model.setFocused(true);
	        this.forceUpdate();
	    },
	    /**
	     * Handles input box focusing. Changes the visualization styles for the
	     * FilterBox.
	     */
	    _handleInputFocus : function(ev) {
	        this.props.model.setFocused(true);
	    },
	    /**
	     * Handles input box blurring. Changes the visualization styles for the
	     * FilterBox.
	     */
	    _handleInputBlur : function(ev) {
	        this._addValue(this.state.text);
	        this.props.model.setFocused(false, true);
	    },
	
	    /**
	     * Handles modifications of the input box.
	     */
	    _handleInputChange : function(ev) {
	        // ev.preventDefault();
	        // ev.stopPropagation();
	        var input = this.refs.input.getDOMNode();
	        var value = input.value;
	        var size = this._getInputSize(value);
	        input.size = size;
	        this.setState(this._newState({
	            text : value
	        }));
	    },
	    /**
	     * Handles events when user push keyboard button. It updates the text value
	     * when user press Enter.
	     */
	    _handleKeyDown : function(ev) {
	        var clear = false;
	        if (ev.which === 9) { // Tab
	            this._addValue(this.state.text);
	            this.props.model.setFocused(true);
	            clear = true;
	        } else if (ev.which === 8 && this.state.text === '') { // Del
	            this._removeLastValue();
	            clear = true;
	        } else if (ev.which === 13) { // Enter
	            this._addValue(this.state.text);
	            if (this.props.onSubmit) {
	                this.props.onSubmit(ev);
	            }
	            clear = true;
	        } else if (ev.which == 27) { // Esc
	            clear = true;
	        }
	        if (clear) {
	            this.setState(this._newState({
	                text : ''
	            }));
	            ev.preventDefault();
	            ev.stopPropagation();
	        }
	    },
	    /**
	     * This method is called when user clicks on already existing node.
	     */
	    _handleItemClick : function(item, ev) {
	        this.props.model.remove(item);
	        ev.preventDefault();
	        ev.stopPropagation();
	    },
	    /** Formats and returns all tags */
	    _formatTags : function() {
	        var model = this.props.model;
	        return _.map(model.getAll(), function(val) {
	            if (_.isFunction(val.format)) {
	                return val.format();
	            } else {
	                var className = 'item tag';
	                if (val.className) {
	                    className += ' ' + val.className;
	                }
	                return (React.DOM.a({
	                    key : _.uniqueId('id-'),
	                    href : "#",
	                    className : className,
	                    onClick : this._handleItemClick.bind(this, val),
	                }, val.label, React.DOM.span({
	                    key : _.uniqueId('id-'),
	                    className : 'cross',
	                    onClick : this._handleItemClick.bind(this, val),
	                })));
	                
	                
	                
	            }
	        }, this);
	    },
	    /** Main rendering method of this class. */
	    render : function() {
	        var app = this.props.app;
	        var cssClass = this.props.className || 'filter-box';
	        if (this.props.model.isFocused()) {
	            cssClass += ' focused';
	        }
	        var value = this.state.text;
	        var inputSize = this._getInputSize(value);
	        return (React.DOM.div(_.extend({}, this.props.options, {
	            onClick : this._focusInput,
	            className : cssClass
	        }), this._formatTags(), React.DOM.input(_.extend({
	            className : 'item'
	        }, this.props.inputOptions, {
	            ref : 'input',
	            size : inputSize,
	            type : 'text',
	            onFocus : this._handleInputFocus,
	            onBlur : this._handleInputBlur,
	            onChange : this._handleInputChange,
	            onKeyDown : this._handleKeyDown,
	            value : value
	        }))));
	    },
	    /** Returns the size of the input box. */
	    _getInputSize : function(value) {
	        value = value || '';
	        return Math.min(50, Math.max(value.length, 3));
	    }
	});


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var React = __webpack_require__(30);
	var Mosaic = __webpack_require__(1);
	var FilterBox = __webpack_require__(7);
	
	var SearchBoxMixinModel = FilterBox.extendModel({
	
	    /**
	     * Converts a search criteria object into a list of values accepted by the
	     * filter box.
	     */
	    _convertSearchToFilters : function(criteria) {
	        var values = [];
	        _.map(criteria, function(value, key) {
	            if (_.isArray(value)) {
	                _.each(value, function(val) {
	                    values.push(this.newFilterValue(val, key));
	                }, this);
	            } else {
	                values.push(this.newFilterValue(value, key));
	            }
	        }, this);
	        return values;
	    },
	
	    /** Converts filter box values in a search criteria object. */
	    convertFiltersToSearch : function(values) {
	        var result = {};
	        _.each(values, function(val) {
	            var key = val.key;
	            var criteria = this.newSearchValue(val, key);
	            if (!_.has(result, key)) {
	                result[key] = [ criteria ];
	            } else {
	                var arr = result[key];
	                arr.push(criteria);
	            }
	        }, this);
	        return result;
	    },
	
	    /**
	     * Creates and returns a new filter value object used by filter box to show
	     * values. This function overloads a method with the same name from the
	     * FilterBox.Model class.
	     */
	    newFilterValue : function(value, key) {
	        return {
	            key : key || this.getDefaultField(),
	            label : value
	        };
	    },
	
	    /**
	     * Converts a filter value to a search criteria.
	     */
	    newSearchValue : function(value, key) {
	        return value.label;
	    },
	
	    /**
	     * Returns the name of the default text search field.
	     */
	    getDefaultField : function() {
	        return this.textSearchField || 'q';
	    },
	
	});
	
	/**
	 * This mixin expects that the following methods and fields are implemented in
	 * the parent class: 1) '_onSearchCriteriaChanged' - this method is used to set
	 * changed search criteria object 2) 'this.state.textSearchField' should contain
	 * the name of the search field associated with the text entered by user. The
	 * following methods should be used to interact with the internal state of the
	 * filter box: 'setSearchCriteria' method should be used to update the search
	 * criteria; the 'getSearchCriteria' method returns all search criteria managed
	 * by the filter box; the 'renderSearchBox' returns a new rendered search box
	 */
	var SearchBoxMixin = {
	
	    Model : SearchBoxMixinModel,
	
	    /** Registers new filters the internal box model. */
	    componentWillMount : function() {
	        var model = this._getFilterBoxModel();
	        model.on('add', this._onFilterBoxChanged, this);
	        model.on('remove', this._onFilterBoxChanged, this);
	    },
	
	    /** Removes filter all listeners of the internal box model. */
	    componentDidUnmount : function() {
	        var model = this._getFilterBoxModel();
	        model.off('add', this._onFilterBoxChanged, this);
	        model.off('remove', this._onFilterBoxChanged, this);
	        delete this._model;
	    },
	    /**
	     * Converts a search criteria object into a list of values accepted by the
	     * filter box.
	     */
	    _convertSearchToFilters : function(criteria) {
	        var model = this._getFilterBoxModel();
	        return model._convertSearchToFilters(criteria);
	    },
	    /** Converts filter box values in a search criteria object. */
	    _convertFiltersToSearch : function(values) {
	        var model = this._getFilterBoxModel();
	        return model.convertFiltersToSearch(values);
	    },
	
	    /** Returns an underlying model keeping values for a filter box. */
	    _getFilterBoxModel : function() {
	        var that = this;
	        if (!that._model) {
	            if (_.isFunction(that._newFilterModel)) {
	                that._model = that._newFilterModel();
	            } else {
	                that._model = new SearchBoxMixinModel();
	            }
	        }
	        return that._model;
	    },
	    /** An internal method handling changes of values in the filter box. */
	    _onFilterBoxChanged : function() {
	        var criteria = this.getSearchCriteria();
	        this._onSearchCriteriaChanged(criteria);
	    },
	    /** Sets a new search criteria object to reflect in the filter box. */
	    setSearchCriteria : function(searchCriteria) {
	        var model = this._getFilterBoxModel();
	        var values = this._convertSearchToFilters(searchCriteria);
	        model.set(values);
	    },
	    /** Returns an object containing search criteria. */
	    getSearchCriteria : function() {
	        var model = this._getFilterBoxModel();
	        var values = model.getAll();
	        var criteria = this._convertFiltersToSearch(values);
	        return criteria;
	    },
	    /**
	     * This method renders and returns a filter box using the underlying model
	     * keeping the state of the search box.
	     */
	    renderSearchBox : function(options) {
	        var Factory = React.createFactory(FilterBox);
	        return Factory(_.extend({}, options, {
	            model : this._getFilterBoxModel()
	        }));
	    },
	};
	
	module.exports = SearchBoxMixin;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var React = __webpack_require__(30);
	var Mosaic = __webpack_require__(1);
	
	module.exports = React.createClass({
	    displayName : 'PaginatedListView',
	
	    getInitialState : function() {
	        return this._newState();
	    },
	
	    componentWillMount : function() {
	        this._updateState({
	            index : this.props.index,
	            reset : true
	        });
	    },
	
	    componentWillReceiveProps : function(props) {
	        this._updateState({
	            index : props.index,
	            reset : true
	        });
	    },
	
	    componentDidMount : function() {
	        this._refocus();
	    },
	
	    componentDidUpdate : function() {
	        this._refocus();
	    },
	
	    _refocus : function() {
	        if (this.state.reset) {
	            this._moveToItem(this.state.index || 0);
	        } else {
	            this._focusToIndex(this.state.index || this.state.itemsStartIndex);
	        }
	    },
	
	    _getPageSize : function() {
	        var pageSize = +this.props.pageSize || 50;
	        return pageSize;
	    },
	
	    _updateState : function(options) {
	        this.setState(this._newState(options));
	    },
	
	    update : function() {
	        var idx = this.state.index || this.state.itemsStartIndex || 0;
	        this._focusToIndex(idx);
	    },
	
	    _focusToIndex : function(index) {
	        var that = this;
	        setTimeout(function() {
	            if (!that.isMounted())
	                return;
	            index = Math.max(index || 0, 0);
	            var idx = Math.max(index - that.state.itemsStartIndex, 0);
	            var scrollerElm = that.getDOMNode();
	            var elm = that.refs.items.getDOMNode();
	            var topOffset = elm.offsetTop;
	            var children = elm.childNodes;
	            idx = Math.max(0, Math.min(idx, children.length - 1));
	            var child = children[idx];
	            var top = 0;
	            if (child) {
	                top = child.offsetTop;
	            }
	            scrollerElm.scrollTop = top;
	        }, 1);
	    },
	
	    _newState : function(options) {
	        return _.extend({
	            index : 0,
	            length : 0,
	            items : [],
	            itemsStartIndex : 0,
	            reset : true
	        }, this.state, options);
	    },
	
	    _setPage : function(pageId, ev) {
	        var pageSize = this._getPageSize();
	        var index = pageId * pageSize;
	        this._moveToItem(index);
	        if (ev) {
	            ev.stopPropagation();
	            ev.preventDefault();
	        }
	    },
	
	    _moveToItem : function(index) {
	        var that = this;
	        var length = 0;
	        var itemsStartIndex = 0;
	        return Mosaic.P.then(function() {
	            return that.props.getItemsNumber();
	        }).then(function(len) {
	            length = len || 0;
	            var idx = Math.max(0, Math.min(length - 1, index || 0));
	            var pageSize = that._getPageSize();
	            var from = Math.floor(idx / pageSize) * pageSize;
	            itemsStartIndex = from;
	            var to = Math.ceil(idx / pageSize) * pageSize;
	            if (from === to) {
	                to += pageSize;
	            }
	            to = Math.min(length - 1, to);
	            var num = to - from + 1;
	            return that.props.renderItems({
	                index : from,
	                length : num
	            });
	        }).then(function(items) {
	            that._updateState({
	                index : index,
	                items : items,
	                itemsStartIndex : itemsStartIndex,
	                length : length,
	                reset : false
	            });
	        });
	    },
	
	    _renderPagination : function() {
	        var pageSize = this._getPageSize();
	        var pageIndex = Math.floor(this.state.itemsStartIndex / pageSize);
	        var pageCount = Math.floor(this.state.length / pageSize) + 1;
	        var buttons = [];
	        if (pageCount <= 1) {
	            return React.DOM.nav();
	        }
	        var that = this;
	        function getButton(index, label, key, activeClass) {
	            var className;
	            if (pageIndex === index) {
	                className = activeClass;
	            }
	            return React.DOM.li({
	                key : key,
	                className : className
	            }, React.DOM.a({
	                href : '#',
	                onClick : that._setPage.bind(that, index)
	            }, label));
	        }
	        function getSpace(index) {
	            return getButton(index, '…', 'space-' + index);
	        }
	
	        var buttonsNumber = this.props.buttonsNumber || 5;
	
	        buttons.push(getButton(0, '«', 'prev', 'disabled'));
	        var from = Math.max(0, pageIndex - Math.floor(buttonsNumber / 2));
	        if (from + buttonsNumber >= pageCount) {
	            from = Math.max(0, pageCount - buttonsNumber);
	        }
	        var to = Math.min(pageCount, from + buttonsNumber);
	
	        if (from > 0) {
	            buttons.push(getSpace(Math.max(0, pageIndex - buttonsNumber)));
	        }
	        for (var i = from; i < to; i++) {
	            buttons.push(getButton(i, (i + 1) + '', 'item-' + i, 'active'));
	        }
	        if (to < pageCount) {
	            buttons.push(getSpace(Math.min(pageCount - 1, pageIndex + //
	            buttonsNumber)));
	        }
	        buttons.push(getButton(pageCount - 1, '»', 'next', 'disabled'));
	        var className = that.props.paginationClassName || 'pagination';
	        return React.DOM.nav({}, React.DOM.ul({
	            className : className
	        }, buttons));
	    },
	
	    _checkPagination : function(key, defaultValue) {
	        var value = this.props[key];
	        if (value === undefined || value === null) {
	            return defaultValue;
	        } else {
	            return !!value;
	        }
	    },
	
	    render : function() {
	        var topPagination;
	        if (this._checkPagination('topPagination', false)) {
	            topPagination = this._renderPagination();
	        }
	        var bottomPagination;
	        if (this._checkPagination('bottomPagination', true)) {
	            bottomPagination = this._renderPagination();
	        }
	        return React.DOM.div({
	            className : this.props.className
	        }, //
	        topPagination, //
	        React.DOM.div({
	            ref : 'items'
	        }, this.state.items),//
	        bottomPagination);
	    },
	
	});


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var React = __webpack_require__(30);
	
	var PopupPanel = React.createClass({
	    displayName : "PopupPanel",
	    statics : {
	        divStack : [],
	        closePopup : function(options) {
	            var div = this.divStack.pop();
	            if (!div)
	                return;
	            document.body.removeChild(div);
	            React.unmountComponentAtNode(div);
	        },
	        openPopup : function(options) {
	            var div = document.createElement('div');
	            document.body.appendChild(div);
	            this.divStack.push(div);
	            var panel = PopupPanel.apply(this, arguments);
	            React.render(panel, div);
	        },
	    },
	
	    componentDidMount : function() {
	        this._updatePopupHeight = _.bind(this._updatePopupHeight, this);
	        this._updatePopupHeight = _.debounce(this._updatePopupHeight, 10);
	        window.addEventListener('resize', this._updatePopupHeight);
	        document.addEventListener('keydown', this._onKeyDown);
	        this._updatePopupHeight();
	        if (_.isFunction(this.props.onOpen)) {
	            this.props.onOpen(this);
	        }
	        // Change the default Bootstrap settings
	        var elm = this.refs.dialog.getDOMNode();
	        elm.style.marginTop = '0px';
	        elm.style.marginBottom = '0px';
	    },
	    componentDidUpdate : function() {
	        this._updatePopupHeight();
	    },
	    componentWillUnmount : function() {
	        window.removeEventListener('resize', this._updatePopupHeight);
	        document.removeEventListener('keydown', this._onKeyDown);
	        if (_.isFunction(this.props.onClose)) {
	            this.props.onClose(this);
	        }
	    },
	    _onKeyDown : function(event) {
	        if (event.which == 27) { // ESC
	            PopupPanel.closePopup();
	        }
	    },
	    _updatePopupHeight : function() {
	        var containerElm = this.getDOMNode();
	        var innerBorderElm = this.refs.innerBorder.getDOMNode();
	        var outerBorderElm = this.refs.outerBorder.getDOMNode();
	        var containerHeight = containerElm.offsetHeight;
	        var outerHeight = outerBorderElm.offsetHeight;
	        var contentPosition = //
	        this._getPosition(innerBorderElm, outerBorderElm);
	        var contentHeight = innerBorderElm.offsetHeight;
	        var before = contentPosition.top;
	        var after = outerHeight - (before + contentHeight);
	        var margin = this.props.verticalMargin || 0;
	        var height = containerHeight - (before + after) - (margin * 2);
	        height = Math.max(height, 0);
	        if (this.props.maxHeight) {
	            height = Math.min(this.props.maxHeight, height);
	        }
	        if (!isNaN(height) && this.state.maxHeight !== height) {
	            innerBorderElm.style.maxHeight = height + 'px';
	            var that = this;
	            setTimeout(function() {
	                var containerHeight = containerElm.offsetHeight;
	                var dialogElm = that.refs.dialog.getDOMNode();
	                var dialogHeight = dialogElm.offsetHeight;
	                var pos = Math.round((containerHeight - dialogHeight) / 2);
	                pos = Math.max(pos, 0);
	                dialogElm.style.top = pos + 'px';
	            }, 1);
	        }
	    },
	    _newState : function(options) {
	        var state = _.extend({}, this.state, options);
	        return state;
	    },
	    getInitialState : function() {
	        return this._newState();
	    },
	    _handleClose : function(ev) {
	        ev.stopPropagation();
	        ev.preventDefault();
	        var onClose = this.props.onClose;
	        var close = true;
	        if (_.isFunction(onClose)) {
	            var result = onClose(ev);
	            close = (result !== false);
	        }
	        if (close) {
	            PopupPanel.closePopup({
	                app : this.props.app
	            });
	        }
	    },
	    _getPosition : function(el, parent) {
	        var _x = 0;
	        var _y = 0;
	        while (el && el !== parent && !isNaN(el.offsetLeft) && //
	        !isNaN(el.offsetTop)) {
	            _x += el.offsetLeft - el.scrollLeft;
	            _y += el.offsetTop - el.scrollTop;
	            el = el.offsetParent;
	        }
	        return {
	            top : _y,
	            left : _x
	        };
	    },
	    render : function() {
	        var className = this.props.className || '';
	        className = "modal-dialog " + className;
	        return (React.createElement("div", {
	            className : "modal in",
	            tabIndex : "-1",
	            role : "dialog",
	            ref : "container",
	            style : {
	                display : 'block'
	            }
	        }, //
	        React.createElement("div", {
	            className : "modal-backdrop in",
	            onClick : this._handleClose
	        }), //
	        React.createElement("div", {
	            className : className,
	            ref : "dialog"
	        }, //
	        React.createElement("div", {
	            className : "modal-content",
	            ref : "outerBorder"
	        },//
	        React.createElement("div", {
	            className : "modal-header"
	        }, //
	        React.createElement("button", {
	            type : "button",
	            className : "close",
	            onClick : this._handleClose
	        }, //
	        React.createElement("span", {
	            "aria-hidden" : "true"
	        }, "×"), //
	        React.createElement("span", {
	            className : "sr-only"
	        }, "Close") //
	        ), //
	        React.createElement("h4", {
	            className : "modal-title"
	        }, //
	        this.props.title)//
	        ), //
	        React.createElement("div", {
	            className : "modal-body",
	            ref : "innerBorder"
	        }, this.props.body), //
	        React.createElement("div", {
	            className : "modal-footer"
	        }, this.props.footer) //
	        ) //
	        ) //
	        ) //
	        );
	    }
	});
	
	module.exports = PopupPanel;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var React = __webpack_require__(30);
	var L = __webpack_require__(31);
	
	module.exports = React.createClass({
	    displayName : 'ReactMap',
	    render : function() {
	        return (React.DOM.div({
	            ref : 'container',
	            id : this.props.id,
	            className : this.props.className,
	            style : this.props.style || {}
	        }));
	    },
	    componentDidMount : function() {
	        var container = this.refs.container.getDOMNode();
	        this.map = this._newMap(container);
	        this.map.on('zoomend', this._updateZoomStyles, this);
	        if (this.props.onMapAdd) {
	            this.props.onMapAdd(this.map);
	        }
	        this._updateZoomStyles();
	    },
	    componentWillUnmount : function() {
	        if (this.props.onMapRemove) {
	            this.props.onMapRemove(this.map);
	        }
	        this.map.off('zoomend', this._updateZoomStyles, this);
	        this.map.remove();
	        delete this.map;
	    },
	    _newMap : function(container) {
	        var mapOptions = this.props.options || {};
	        var options = _.extend({}, mapOptions, {
	            zoomControl : false,
	            attributionControl : false,
	        });
	        var map = L.map(container, options);
	        options = _.extend({}, mapOptions.zoomControl);
	        options = _.defaults(options, {
	            position : 'topright'
	        });
	
	        // Set the initial view of this map
	        if (mapOptions.zoomControl !== false) {
	            var zoomControl = L.control.zoom(options);
	            map.addControl(zoomControl);
	        }
	
	        if (mapOptions.attributionControl !== false) {
	            var attributionControl = L.control.attribution(options);
	            map.addControl(attributionControl);
	        }
	
	        var center = mapOptions.center;
	        if (_.isArray(center)) {
	            center = L.latLng(center[1], center[0]);
	        }
	        var zoom = mapOptions.zoom;
	        if (center && zoom !== undefined) {
	            map.setView(center, zoom);
	        }
	        return map;
	    },
	    _updateZoomStyles : function() {
	        var node = this.getDOMNode();
	        var zoom = this.map.getZoom();
	        var cls = [];
	        for (var i = 0; i <= zoom; i++) {
	            cls.push('zoom-' + i);
	        }
	        var css = node.className;
	        css = css.replace(/zoom-\d+\s*/gim, '');
	        css += ' ' + cls.join(' ');
	        node.className = css;
	    }
	});


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var L = __webpack_require__(31);
	var Mosaic = __webpack_require__(1);
	
	var Config = Mosaic.Class.extend({
	
	    initialize : function(data, options) {
	        if (!options) {
	            options = data;
	            data = null;
	        }
	        this.data = data;
	        _.extend(this, options);
	        var methods = [ 'onClick', 'onMouseOver', 'onMouseOut', 'onDblClick',
	                'onMouseMove' ];
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
	
	    setEventBinder : function(method) {
	        this.bindEventHandlers = method;
	        return this;
	    },
	
	    bindEventHandlers : function(data, layer) {
	        var that = this;
	        _.each(that._handlers, function(handler, event) {
	            layer.on(event, function(ev) {
	                handler(data, ev);
	            });
	        });
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
	
	    build : function(data) {
	        var that = this;
	        data = data || that.data;
	        var geom = data.geometry;
	        if (that._isEmptyGeometry(geom)) {
	            return null;
	        }
	        var options = that.getOptions(data);
	        var marker;
	        var layer = L.GeoJSON.geometryToLayer(data, function(resource, latlng) {
	            marker = that.getMarker(resource, options);
	            if (marker === undefined) {
	                marker = new L.Marker(latlng, options);
	            }
	            return marker;
	        }, L.GeoJSON.coordsToLatLng, options);
	        if (layer && !marker) {
	            marker = that.getMarker(data, options);
	            if (marker) {
	                layer = L.featureGroup([ layer, marker ]);
	            }
	        }
	        this.bindEventHandlers(data, layer);
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
	
	module.exports = LeafletFeatureBuilder;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var L = __webpack_require__(31);
	var InteractionLayer = __webpack_require__(32);
	
	/**
	 * The code of this class was mostly copied from the leaflet.utfgrid Leaflet
	 * extension (MIT license, by David Leaver). The difference with the original
	 * implementation is that 1) this class delegates tiles
	 * loading/caching/canceling operations to an MapTilesLoader instance; 2) this
	 * class notifies about loading of tiles for each new screen using the
	 * "startLoading"/"endLoading" events; 3) it loads tiles starting from the
	 * center of the current screen.
	 */
	var UtfGrid = InteractionLayer.extend({
	
	    /** Initializes this layer */
	    initialize : function(options) {
	        var parent = InteractionLayer.prototype;
	        parent.initialize.call(this, options);
	        _.defaults(this.options, {
	            resolution : 4,
	            pointerCursor : true
	        });
	        this._loader = this.options.loader || //
	        new MapTilesLoader(this.options);
	    },
	    /**
	     * Returns an object from UTF grid corresponding to the coordinates of the
	     * mouse event.
	     */
	    _objectForEvent : function(e) {
	        var map = this._map;
	        var zoom = map.getZoom();
	        var point = map.project(e.latlng);
	        var pos = this._getTilePosition(point);
	
	        var tile = this._loader.getTile(zoom, pos);
	        var result;
	        if (tile) {
	            result = this._getTileObject(tile, point);
	        }
	
	        return {
	            latlng : e.latlng,
	            data : result
	        };
	    },
	
	    /**
	     * Returns an object from the specified tile corresponding to the given
	     * position.
	     */
	    _getTileObject : function(tile, point) {
	        var gridX = this._getTileShift(point.x);
	        var gridY = this._getTileShift(point.y);
	        var idx = this._utfDecode(tile.grid[gridY].charCodeAt(gridX));
	        var key = tile.keys[idx];
	        var result = this._processData(tile.data[key]);
	        return result;
	    },
	
	    /**
	     * Returns a list of all objects contained in the specified UTFGrid tile.
	     */
	    getTileObjects : function(tile) {
	        return tile && tile.data ? _.map(_.values(tile.data),
	                this._processData, this) : [];
	    },
	
	    /**
	     * Pre-process individual data object before returning it to the caller.
	     */
	    _processData : function(data) {
	        if (!data)
	            return data;
	        if (!this._processDataF) {
	            this._processDataF = this.options.processData || //
	            function(data) {
	                return data;
	            };
	        }
	        return this._processDataF(data);
	    },
	
	    /**
	     * Returns position of the specified coordinates in a tile
	     */
	    _getTileShift : function(val) {
	        var tileSize = this.options.tileSize;
	        var resolution = this.options.resolution;
	        return Math.floor((val - (Math.floor(val / tileSize) * tileSize)) / //
	        resolution);
	    },
	
	    /**
	     * Decodes the specified character and transforms it in an index
	     */
	    _utfDecode : function(ch) {
	        if (ch >= 93) {
	            ch--;
	        }
	        if (ch >= 35) {
	            ch--;
	        }
	        return ch - 32;
	    }
	
	});
	
	module.exports = UtfGrid;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var L = __webpack_require__(31);
	
	/**
	 * This class provides common utility methods to manage specific geographic zone
	 * as the main viewport. It means that all operations like fitBounds(bounds) or
	 * setView(latlng, zoom) will takes into account the specified map zone and not
	 * the whole map.
	 */
	var MapViewport = L.Class.extend({
	
	    /**
	     * Initializes this object.
	     * 
	     * @param options.map
	     *            the Leaflet map object
	     * @param options.viewport
	     *            a L.Bounds instance defining the main visible zone on the map;
	     *            see the #setViewport method
	     * @param options.focus
	     *            focus position on the map; when user uses #focusTo method then
	     *            the specified lat/lng point is moved in the given position on
	     *            the screen
	     */
	    initialize : function(options) {
	        L.setOptions(this, options);
	        var viewport = this.options.viewport;
	        if (viewport) {
	            this.setViewport(viewport);
	        }
	        if (this.options.focus) {
	            this.setFocusPosition(this.options.focus);
	        }
	    },
	
	    /**
	     * Returns the map managed by this class. By default this method returns the
	     * "options.map".
	     */
	    getMap : function() {
	        return this.options.map;
	    },
	
	    /**
	     * Defines the viewport for the map - the visible area of the map where data
	     * should be focused and fitted. If a focus position is not defined then
	     * this method sets the focus position to the center of the specified
	     * viewport area.
	     * 
	     * @param viewport
	     *            a L.Bounds instance defining the main visible zone on the map;
	     *            this object defines top, right, left and bottom shift of the
	     *            viewport on the visible map screen area
	     */
	    setViewport : function(viewport) {
	        this._viewport = L.bounds(viewport);
	        if (!this._focusPos) {
	            this._focusPos = this._viewport.getCenter();
	        }
	    },
	
	    /**
	     * Returns the current viewport for the underlying map
	     */
	    getViewport : function() {
	        if (this._viewport)
	            return this._viewport;
	        var map = this.getMap();
	        return L.bounds([ 0, 0 ], map.getSize());
	    },
	
	    /**
	     * Defines position on the map (in pixels) where map should be moved when
	     * user tries to set view or focus on a specific geographic position.
	     * 
	     * @param options.focus
	     *            focus position on the map; when user uses #focusTo method then
	     *            the specified lat/lng point is moved in the given position on
	     *            the screen
	     */
	    setFocusPosition : function(pos) {
	        this._focusPos = L.point(pos.left, pos.top);
	    },
	
	    /**
	     * Moves the map to the specified geographic position. If a focus position
	     * is specified the requested geographic position is moved in this pixel
	     * position on the map screen area. Otherwise the focus position defined by
	     * the "setFocusPosition" is used.
	     */
	    focusTo : function(coords, focusPos, callback) {
	        var that = this;
	        if (typeof focusPos === 'function') {
	            callback = focusPos;
	            focusPos = null;
	        }
	        callback = this._checkCallback(callback);
	        var map = this.getMap();
	        focusPos = focusPos || this._focusPos;
	        map.once('moveend', callback);
	        if (focusPos) {
	            var focus = map._getTopLeftPoint();
	            focus._add(focusPos);
	            var shift = map.project(coords).subtract(focus);
	            map.panBy(shift);
	        } else {
	            map.panTo(coords);
	        }
	    },
	
	    /**
	     * This method performs zoom (if necessary) and calls the specified callback
	     * method. It is useful to be sure that the callback is really invoked
	     * (which is not the case with the 'zoomend' Leaflet event).
	     */
	    zoomTo : function(zoom, focusPos, callback) {
	        if (typeof focusPos === 'function') {
	            callback = focusPos;
	            focusPos = null;
	        }
	        var map = this.getMap();
	        callback = this._checkCallback(callback);
	        focusPos = focusPos || this.getViewport().getCenter();
	        focusPos = map._getTopLeftPoint().add(focusPos);
	        var coords = map.unproject(focusPos);
	
	        var hasChanges = (map.getZoom() !== zoom) || //
	        (coords + '' !== map.getCenter() + '');
	        if (hasChanges) {
	            map.once('zoomend', callback);
	            map.setZoomAround(coords, zoom);
	        } else {
	            callback();
	        }
	    },
	
	    /**
	     * Zooms and moves the map viewport to fit in the specified geographic
	     * bounds.
	     */
	    panInsideBounds : function(bounds, callback) {
	        var that = this;
	        var map = that.getMap();
	        callback = that._checkCallback(callback);
	        var padding = that._getViewportPadding();
	        var zoom = map.getBoundsZoom(bounds, true, padding);
	        that.zoomTo(zoom, function() {
	            var focusPos = that._focusPos;
	            var newCenter = map._limitCenter(focusPos, zoom, bounds);
	            if (!center.equals(newCenter)) {
	                that.focusTo(newCenter, callback);
	            } else {
	                callback();
	            }
	        });
	    },
	
	    /**
	     * This method fits the specified geographic bounds in the currently defined
	     * viewport area.
	     */
	    fitBounds : function(bounds) {
	        var viewport = this.getViewport();
	        var padding = this._getViewportPadding();
	        var options = {};
	        options.paddingTopLeft = padding.min;
	        options.paddingBottomRight = padding.max;
	        var map = this.getMap();
	        map.fitBounds(bounds, options);
	    },
	
	    /** Checks the specified function and returns a non-empty callback. */
	    _checkCallback : function(callback) {
	        return callback || function() {
	        };
	    },
	
	    /**
	     * An internal utility method returning the distance from the map bounds and
	     * the viewport area.
	     */
	    _getViewportPadding : function() {
	        var viewport = this.getViewport();
	        var min = viewport.min;
	        var map = this.getMap();
	        var size = map.getSize();
	        var max = size.subtract(viewport.max);
	        return L.bounds(min, max);
	    },
	
	});
	
	module.exports = MapViewport;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var AbstractSet = __webpack_require__(17);
	var _ = __webpack_require__(28);
	
	/**
	 * This class represents a data set. Each dataset manages a set of objects with
	 * unique keys. The "setData" of this class accepts an array of objects and
	 * sends notifications about changes with this data set to the registered
	 * listener. This listener could be registered using the "setListener" method or
	 * it can be defined as a parameter of the class constructor.
	 */
	var DataSet = AbstractSet.extend({
	
	    /**
	     * Class constructor.
	     * 
	     * @param options.getId
	     *                this optional method is used to retrieve object
	     *                identifiers
	     */
	    initialize : function(options) {
	        AbstractSet.prototype.initialize.apply(this, arguments);
	        this._open = false;
	    },
	
	    /**
	     * Opens this data set - registeres data set listeners and sets the initial
	     * data.
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
	     * Sets a new array of objects and generates an "update" event containing
	     * the "enter", "exit" and "update" indexes; each index contains keys and
	     * the corresponding index entries with "key", "obj" and "idx" fields (where
	     * "key" is the key of the object; "obj" the object itself and "idx" the
	     * index of this object in the list). This method returns reference to this
	     * instance to allow methods call chaining.
	     */
	    setData : function(data) {
	        this.triggerMethod('update:begin');
	        var event = this._setObjects(data);
	        this.triggerMethod('update', event);
	        this.triggerMethod('update:end');
	        return this;
	    },
	
	    /**
	     * This method returns an object with the specified key or the full array of
	     * all objects if such a key is not defined.
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
	
	module.exports = DataSet;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var _ = __webpack_require__(28);
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
	
	    /** Returns path from this node to the specified top node. */
	    getPath : function(top) {
	        var path = '';
	        var node = this;
	        while (node && node != top) {
	            path = '/' + node.getKey() + path;
	            node = node.getParent();
	        }
	        return path;
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
	     * Adds the specified subnode to this tree node. If the subnode is not
	     * defined then a new one is created and returned.
	     */
	    add : function(key, node) {
	        var that = this;
	        if (!node && _.isObject(key)) {
	            node = key;
	        }
	        if (_.isFunction(key.getKey)) {
	            key = key.getKey();
	        }
	        that.remove(key);
	        if (!node) {
	            node = that._newChild(key);
	        }
	        node.parent = this;
	        that._children[key] = node;
	        node._notify('add', {});
	        return node;
	    },
	
	    /**
	     * Returns an child tree node corresponding to the specified key. If there
	     * is no such a sub-node and the flag "create" is true then a new subnode is
	     * created.
	     */
	    get : function(key, create) {
	        var that = this;
	        var result = this._children[key];
	        if (!result) {
	            var path = key.split('/');
	            result = this._getByPath(path, 0, create);
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
	     * Finds and returns a child in this node or in a sub-nodes corresponding to
	     * the specified key.
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
	     * Returns a node corresponding to the specified path.
	     * 
	     * @param path
	     *                an array of path segments to the required node
	     * @param idx
	     *                position of the current key in the path
	     * @param create
	     *                if this flag is <code>true</code> and there is no node
	     *                corresponding to the specified path then a new node is
	     *                created
	     */
	    _getByPath : function(path, idx, create) {
	        var key = idx >= 0 && idx < path.length ? path[idx] : null;
	        if (!key)
	            return;
	        var result = this._children[key];
	
	        if (!result && create) {
	            result = this.add(key);
	        }
	        if (!result)
	            return result;
	        return idx < path.length - 1 ? //
	        result._getByPath(path, idx + 1, create) : //
	        result;
	    },
	
	    /**
	     * Calls the specified callback for all slots corresponding to the given
	     * keys. If no keys are specified then this method iterates over all slots.
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
	     * Creates and returns a new tree node corresponding to the specified key
	     */
	    _newChild : function(key) {
	        var Type = this.getClass();
	        return new Type(_.extend({}, this.options, {
	            key : key
	        }));
	    },
	});
	
	/* -------------------------------------------------------------- */
	
	/**
	 * This mixin is used to add status management for Mosaic.TreeNode instances.
	 */
	var TreeNodeStatusMixin = {
	
	    /** Defaults status value */
	    _status : 'inactive',
	
	    /**
	     * Returns a "status" of this tree node. Status value reflects the state of
	     * this node which depends on the usage of this tree.
	     */
	    getStatus : function() {
	        return this._status || '';
	    },
	
	    /**
	     * Returns a "status" of this tree node. Status value reflects the state of
	     * this node which depends on the usage of this tree.
	     */
	    setStatus : function(status, options) {
	        var prevStatus = this._status;
	        var update = prevStatus != status || options && options.force;
	        if (update) {
	            this._status = status;
	            this._notify('status', _.extend({}, options, {
	                prevStatus : prevStatus
	            }));
	        }
	        return update;
	    },
	
	    /**
	     * Sets an exclusive mode for this node. It means that just one sub-node can
	     * be active at once. Already active sub-node is automatically deactivated
	     * if an another child is activated.
	     */
	    setExclusive : function(exclusive) {
	        this.options.exclusive = !!exclusive;
	    },
	
	    /**
	     * Returns <code>true</code> if just one sub-node can be active at once.
	     */
	    isExclusive : function() {
	        return this.options.mode == 'exclusive' || //
	        this.options.exclusive !== false;
	    },
	
	    /** Returns true if this node is active */
	    isActive : function() {
	        return this._status == 'active';
	    },
	
	    /**
	     * Activates this node.
	     */
	    activate : function(options) {
	        return this.setStatus('active', options);
	    },
	
	    /**
	     * Deactivates this node.
	     */
	    deactivate : function(options) {
	        return this.setStatus('inactive', options);
	    },
	
	    /** Activates inactive nodes and deactivates active ones. */
	    toggle : function(options) {
	        if (this.isActive()) {
	            return this.deactivate(options);
	        } else {
	            return this.activate(options);
	        }
	    },
	
	    /** Returns a list of all active direct children of this node. */
	    getActive : function() {
	        var list = this.getAll();
	        return _.map(list, function(n) {
	            return n.isActive();
	        });
	    },
	
	    /** Returns a first active direct child. */
	    getFirstActive : function() {
	        var list = this.getAll();
	        return _.find(list, function(n) {
	            return n.isActive();
	        });
	    },
	
	    /**
	     * Returns statistics about all states of child items. The returned object
	     * maps status to lists of child node keys.
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
	     * This method is notified when the status of a child node is changed. It
	     * checks this tree node is in the exclusive mode and in this case
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
	        // Deactivates all nodes before and after already active subnode
	        function activateAfter(child, stage) {
	            function addChildren(node, obj) {
	                _.each(obj, function(value, key) {
	                    if (key == '_') {
	                        node.setOptions(value);
	                        return;
	                    }
	                    var child = node.get(key, true);
	                    child.value = value;
	                    if (_.isObject(value)) {
	                        addChildren(child, value);
	                    }
	                });
	            }
	
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
	            } else if (that.isExclusive()) {
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
	
	var ActivationTree = TreeNode.extend(TreeNodeStatusMixin, {
	    initialize : function(options) {
	        var proto = TreeNode.prototype;
	        proto.initialize.call(this, options);
	        this.setOptions({
	            deactivateAll : true
	        });
	    }
	});
	
	module.exports = ActivationTree;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var _ = __webpack_require__(28);
	
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
	 * methods respectively. This class should be extended to add custom behaviour
	 * for each type of changes.
	 */
	var AbstractSet = Mosaic.Class.extend(//
	Mosaic.Events.prototype, Mosaic.Events, {
	
	    /**
	     * Class constructor.
	     * 
	     * @param options.getId
	     *                this optional method is used to retrieve object
	     *                identifiers
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
	     * methods for each entry; each index contains keys and the corresponding
	     * index entries with "key", "obj" and "idx" fields (where "key" is the key
	     * of the object; "obj" the object itself and "idx" the index of this object
	     * in the list). This method returns reference to this instance to allow
	     * methods call chaining.
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
	     * This method returns index entries containing the data, the corresponding
	     * key and position of the data object in the array.
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
	     * This method returns an index entry corresponding to the specified key.
	     */
	    _getIndexEntry : function(key) {
	        return this._index[key];
	    },
	
	    /**
	     * This method returns a key for the specified object. By default this
	     * method returns the object itself. To change this behaviour this method
	     * could be overloaded in subclasses or a "getKey" function can be set in
	     * the constructor parameters.
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
	     *                an index entry object containing the index, its position
	     *                and the corresponding key
	     */
	    _onEnter : function(entry) {
	        entry.emit('enter');
	        return entry;
	    },
	
	    /**
	     * This method is called when an object is removed from the index.
	     * 
	     * @param entry
	     *                an index entry object containing the index, its position
	     *                and the corresponding key
	     */
	    _onExit : function(entry) {
	        entry.emit('exit');
	        return entry;
	    },
	
	    /**
	     * This method is called to notify about updated (already existing in index)
	     * objects.
	     * 
	     * @param entry
	     *                an index entry object containing the index, its position
	     *                and the corresponding key
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
	
	module.exports = AbstractSet;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var Mosaic = __webpack_require__(1);
	var Class = Mosaic.Class;
	
	/**
	 * An adapter manager used to register/retrieve objects corresponding to the
	 * types of adaptable object and the types of the target object. This object is
	 * used by views to get view adapters.
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
	     *                the type of the adaptable object
	     * @param to
	     *                type of the target object
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
	     *                the type of the adaptable object
	     * @param to
	     *                type of the target object
	     * @param adapter
	     *                the adapter type
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
	     * registered adapter is a function then it is used as constructor to create
	     * a new object.
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
	     * Returns a normalized key used to put values in the internal index and in
	     * the cache.
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
	
	module.exports = AdapterManager;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var DataSet = __webpack_require__(15);
	
	/**
	 * This class is used to merge multiple datasets in one based on common data
	 * keys.
	 */
	var CompositeDataSet = DataSet.extend({
	
	    /**
	     * Constructor of this class.
	     * 
	     * @param options.getKey
	     *                an function returning the key in the merged results
	     * @param options.dataSets
	     *                a list of data sets used as a source of data objects
	     * @param options.merge
	     *                a function accepting an array of data entries from all
	     *                data sets corresponding to the same key
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
	     * Filters/merges individual index entries corresponding to the same key.
	     * 
	     * @param array
	     *                an array of index entries from all datasets corresponding
	     *                to the same key; each entry contains the "obj", "idx" and
	     *                "key" fields.
	     * @param key
	     *                the key of the data
	     */
	    _filterData : function(key, array) {
	        if (this._filter) {
	            return this._filter(key, array);
	        }
	        var args = [ {} ].concat(array);
	        return _.extend.call(null, args);
	    },
	
	    /**
	     * Overloads the parent "setData" method and rises an exception. This class
	     * should not accept direct data changes. It builds its data using parent
	     * data sets.
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
	     *                an array of objects from all datasets corresponding to the
	     *                same key
	     * @param key
	     *                the key of the data
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
	     *                an array of objects from all datasets corresponding to the
	     *                same key
	     * @param key
	     *                the key of the data
	     */
	    _filterData : function(key, array) {
	        var result = null;
	        return !_.find(array, function(val) {
	            result = val;
	            return !val;
	        }) ? result : null;
	    },
	});
	
	module.exports = CompositeDataSet;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var _ = __webpack_require__(28);
	var AbstractSet = __webpack_require__(17);
	
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
	     *                a mandatory data set object
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
	
	module.exports = DataSetView;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var _ = __webpack_require__(28);
	
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


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = __webpack_require__(1);
	var _ = __webpack_require__(28);
	var Dependencies = __webpack_require__(21);
	
	/**
	 * This class manages intents. Each intent is a deferred object containing the
	 * following fields and method: 1) "promise"
	 */
	var Intents = Mosaic.Class.extend({
	
	    /**
	     * Initializes and returns an "api" for the specified object. It replaces
	     * all methods marked with the "intentHandler" flag by an intent calls with
	     * the name of this method. The returned object contains all "public"
	     * methods (not started the with "_" symbol).
	     */
	    initApi : function(key, obj, methods) {
	        var api = {};
	        var that = this;
	        methods = methods || _.functions(obj);
	        _.each(methods, function(name) {
	            if (name[0] == '_') //
	                return;
	            var action = obj[name];
	            var addToApi = true;
	            if (action.intentHandler) {
	                var intentKey = name;
	                var idx = name.indexOf(':');
	                addToApi = false;
	                if (idx < 0) {
	                    addToApi = true;
	                    intentKey = key + ':' + name;
	                    // Add code to activate the intent; this code is called
	                    // instead of the original method
	                    obj[name] = function(options) {
	                        options = options || {};
	                        var intent = that.newIntent(intentKey, options);
	                        return intent.promise;
	                    };
	                }
	                // Register an intent handler
	                that.addIntentHandler(key, intentKey, function(intent) {
	                    return action.call(obj, intent);
	                });
	            }
	            obj[name] = _.bind(obj[name], obj);
	            if (addToApi) {
	                api[name] = obj[name];
	            }
	        });
	        return api;
	    },
	
	    /**
	     * Creates and propagates a new intent.
	     * 
	     * @param intentKey
	     *                key of the intent
	     * @param params
	     *                params of the intent
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
	     *                an optional key of a component registering handlers; this
	     *                key could be used to manage dependencies to wait intent
	     *                results
	     * @param handlers
	     *                a map containing intent keys and the corresponding
	     *                handlers
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
	     *                an optional key of a component registering handlers; this
	     *                key could be used to manage dependencies to wait intent
	     *                results
	     * @param intentKey
	     *                intent key
	     * @param handler
	     *                handler function to add
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
	     *                an optional key of a component registered handlers
	     * @param handlers
	     *                a map containing intent keys and the corresponding
	     *                handlers
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
	     *                an optional key of a component registered handlers
	     * @param intentKey
	     *                intent key
	     * @param handler
	     *                handler function to remove
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
	     * Checks the specified component key and returns a random unique one if the
	     * specified key is not defined.
	     */
	    _checkComponentKey : function(componentKey) {
	        return componentKey || _.uniqueId('$$cmp-');
	    },
	
	});
	
	/**
	 * Intents implementation. It has the following all fields of a deferred object
	 * (see Promises) and some specific fields like "intentKey":
	 * <ul>
	 * <li>"promise" - a promise field</li>
	 * <li>"resolve" - <code>function(result){...}</code> - a function resolving
	 * this intent </li>
	 * <li>"reject" - <code>function(err){...}</code> - a function rejecting this
	 * intent </li>
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
	     *                an array of component keys to wait
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
	     *                key of the component handler
	     * @param handler
	     *                handler function
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
	     * resolved nor rejected this intent then this method resolves the promise
	     * of this intent with an exception.
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
	            }).then(function(result) {
	                that._processed.resolve(result);
	                return result;
	            }, function(err) {
	                that._processed.reject(err);
	                throw err;
	            });
	        };
	        return that._deferred.promise.then(finalize, finalize);
	    }
	});
	
	/**
	 * A simple utility method marking the specified method with the "intentHandler"
	 * flag.
	 */
	Intents.handler = function(m) {
	    m.intentHandler = true;
	    return m;
	};
	
	module.exports = Intents;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var L = __webpack_require__(31);
	var DataSetView = __webpack_require__(20);
	
	/**
	 * A Leaflet layer providing automatic rendering of data from a dataset. This
	 * class uses the "onEnter", "onUpdate" and "onExit" callbacks to generate
	 * visible features on the map. Use the "LeafletFeatureBuilder" class to
	 * simplify creation of leaflet features in these callbacks.
	 */
	var LeafletDataSetView = DataSetView.extend({
	
	    initialize : function(options) {
	        DataSetView.prototype.initialize.apply(this, arguments);
	        // this._onZoomEnd = _.debounce(_.bind(this._onZoomEnd, this), 200);
	        this._onZoomEnd = _.bind(this._onZoomEnd, this);
	    },
	
	    /**
	     * This method is used by Leaflet when this layer is inserted in the map.
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
	     * method should be overloaded in subclasses to create real map entities.
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
	
	module.exports = LeafletDataSetView;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var DataSetView = __webpack_require__(20);
	
	/**
	 * This class manages entries of sub-sets of a data set. It does not add/remove
	 * features on the map, it just changes their representation.
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
	     * This method is used by Leaflet when this layer is inserted in the map.
	     */
	    onAdd : function(map) {
	        this.open();
	    },
	
	    /** This method is called by Leaflet to remove this layer from the map. */
	    onRemove : function(map) {
	        this.close();
	    }
	
	});
	
	module.exports = LeafletDataSubsetView;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	
	/**
	 * This is a common mixin used by React classes to add automatic binding for
	 * DataSets.
	 */
	module.exports = {
	
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


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var Mosaic = __webpack_require__(1);
	var AdapterManager = __webpack_require__(18);
	
	/**
	 * Instances of this type manage visual widgets for resources shown in various
	 * contexts. For example a person profile in a contact list has much less
	 * details than the same user profile shown on a separate page. So resource
	 * visualization depends on the <em>context</em> and on the <em>type</em> of
	 * each resource. This class manages adapters for resource types in their
	 * respective contexts.
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
	     * Registers visualization widget for all resources of the specified type
	     * shown in the contexts with the given viewType.
	     */
	    registerView : function(viewType, resourceType, View) {
	        this._adapterManager.registerAdapter(viewType, resourceType, View);
	    },
	
	    /** Creates and returns a new view for the specified resource type. */
	    newView : function(viewType, resourceType, options) {
	        return this._adapterManager.newAdapterInstance(viewType, resourceType,
	                options);
	    },
	
	    /** Returns <code>true</code> if there is a view. */
	    hasView : function(viewType, resourceType) {
	        var adapter = this._adapterManager.getAdapter(viewType, resourceType);
	        return !!adapter;
	    },
	
	    /**
	     * Returns the type of the specified object. This method should be
	     * overloaded in subclasses or in the constructor parameters.
	     */
	    getResourceType : function(d) {
	        return d.type || '';
	    },
	
	});
	
	module.exports = ViewManager;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* ================================================================== */
	/* URI */
	/* ================================================================== */
	
	URI.toURI = function(obj) {
	    return new URI(obj).toString();
	};
	URI.parse = function(str) {
	    return new URI(str);
	};
	
	/** Constructor */
	function URI(url) {
	    this.reset();
	    if (typeof (url) === 'string') {
	        this.setURI(url);
	    } else if (typeof (url) === 'object') {
	        URI._doCopy(url, this, true);
	    }
	}
	
	/* ----------------------------------------------------------------- */
	/* URI static utility methods */
	/* ----------------------------------------------------------------- */
	
	function isArray(obj) {
	    if (!obj)
	        return false;
	    if (Array.isArray) {
	        return Array.isArray(obj);
	    } else {
	        return Object.prototype.toString.call(obj) == '[object Array]';
	    }
	}
	
	/** Splits the given query string to an object */
	URI.splitQuery = function(query) {
	    var result = {};
	    if (query && query !== '') {
	        var array = query.split('&');
	        for (var i = 0; i < array.length; i++) {
	            var str = array[i];
	            var parts = str.split('=');
	            var key = decodeURIComponent(parts[0]);
	            var value = decodeURIComponent(parts[1]);
	            if (!(key in result)) {
	                result[key] = value;
	            } else {
	                var prev = result[key];
	                var values = prev;
	                if (!isArray(values)) {
	                    values = result[key] = [ prev ];
	                }
	                values.push(value);
	            }
	        }
	    }
	    return result;
	};
	
	/** Serializes the specified query object as a string */
	URI.serializeQuery = function(query) {
	    var result = '';
	    for ( var key in query) {
	        if (query.hasOwnProperty(key)) {
	            var value = query[key] || '';
	            var k = encodeURIComponent(key);
	            var array = value;
	            if (!isArray(array)) {
	                array = [ value ];
	            }
	            for (var i = 0; i < array.length; i++) {
	                if (result.length > 0) {
	                    result += '&';
	                }
	                var v = encodeURIComponent(array[i]);
	                result += k;
	                result += '=';
	                result += v;
	            }
	        }
	    }
	    return result;
	};
	
	function isEmptySegment(segment) {
	    return segment === '' || segment === '.' || segment === '..';
	}
	
	/** This method resolves all path segments in the specified array. */
	URI.resolvePathSegments = function(segments, skipTraling) {
	    // Resolve the merged path
	    var result = false;
	    var len = segments.length;
	    var before = isEmptySegment(segments[0]);
	    var after = isEmptySegment(segments[len - 1]);
	    for (var i = 0; i < len; i++) {
	        var segment = segments[i];
	        if (isEmptySegment(segment)) {
	            result = false;
	            segments.splice(i, 1);
	            len--;
	            i--;
	            if ('..' == segment && i >= 0) {
	                segments.splice(i, 1);
	                len--;
	                i--;
	            }
	        } else {
	            result = true;
	        }
	    }
	    if (before) {
	        segments.splice(0, 0, '');
	    }
	    if (after) {
	        segments = segments.push('');
	    }
	    return result;
	};
	
	URI._doCopy = function(from, to, deep) {
	    for ( var key in from) {
	        if (!from.hasOwnProperty(key))
	            continue;
	        var value = from[key];
	        if ((typeof (value) === 'object') && deep) {
	            value = URI._doCopy(value, {});
	        }
	        to[key] = value;
	    }
	    return to;
	};
	
	/* ----------------------------------------------------------------- */
	/* Main URI methods definition */
	/* ----------------------------------------------------------------- */
	
	/** Cleans up all internal fields */
	URI.prototype.reset = function(keepPath, keepDomain) {
	    if (!keepDomain) {
	        delete this.scheme;
	        delete this.authority;
	        delete this.domain;
	        delete this.port;
	    }
	    if (!keepPath) {
	        delete this.path;
	        delete this.query;
	        delete this.fragment;
	    }
	};
	
	/** Cleans up all fields but 'path', 'query' and 'fragment' */
	URI.prototype.resetDomain = function() {
	    this.reset(true);
	};
	
	/** Returns serialized JSON representation of this URI */
	URI.prototype.asJSON = function(spaces) {
	    return JSON.stringify(this, null, spaces);
	};
	
	/** Creates and returns a new copy of this object */
	URI.prototype.newCopy = function() {
	    var copy = this.newInstance();
	    URI._doCopy(this, copy, true);
	    return copy;
	};
	
	/** Creates and returns a new instance of this type */
	URI.prototype.newInstance = function() {
	    return new URI();
	};
	
	/**
	 * This method splits the given URI to individual URI parts
	 * <ul>
	 * <li>scheme</li>
	 * <li>authority part (user info + domain name)</li>
	 * <li>domain - in lower case</li>
	 * <li>port - a number; 0 - if the port is not defined</li>
	 * <li>path - starts with '/' or null if is not defined</li>
	 * <li>query</li>
	 * <li>fragment</li>
	 * </ul>
	 */
	URI.prototype.setURI = function(url) {
	    url = url || '';
	    url = url.replace(/[\\]/gi, '/');
	    var idx = url.lastIndexOf('#');
	    if (idx >= 0) {
	        this.fragment = url.substring(idx + 1);
	        url = url.substring(0, idx);
	    }
	    idx = url.indexOf('?');
	    if (idx >= 0) {
	        var str = url.substring(idx + 1);
	        this.query = URI.splitQuery(str);
	        url = url.substring(0, idx);
	    }
	
	    var hasDomain = false;
	    if (url.match(/^\/\//)) {
	        url = url.substring('//'.length);
	        hasDomain = true;
	    } else {
	        idx = url.indexOf('://');
	        if (idx >= 0) {
	            this.scheme = url.substring(0, idx);
	            url = url.substring(idx + '://'.length);
	            hasDomain = true;
	        }
	    }
	    if (hasDomain) {
	        idx = url.indexOf('/');
	        if (idx >= 0) {
	            this.path = url.substring(idx);
	            url = url.substring(0, idx);
	        }
	        idx = url.indexOf(':');
	        if (idx >= 0) {
	            try {
	                this.port = parseInt(url.substring(idx + 1));
	            } catch (e) {
	            }
	            url = url.substring(0, idx);
	        }
	        idx = url.indexOf('@');
	        if (idx >= 0) {
	            this.authority = url.substring(0, idx);
	            url = url.substring(0, idx);
	        }
	        this.domain = url.toLowerCase();
	    } else {
	        this.path = url;
	    }
	    return this;
	};
	
	function hasTrailingSeparator(str) {
	    if (!str || str === '')
	        return false;
	    if (str[str.length - 1] === '/')
	        return true;
	    return false;
	}
	
	/**
	 * This method resolves the specified URI object relative to this URI and
	 * returns a new resolved URI instance.
	 */
	URI.prototype.resolve = function(urlObj) {
	    if (typeof urlObj === 'string') {
	        urlObj = new URI(urlObj);
	    }
	    // Don't try to resolve absolute URIs
	    if (urlObj.domain && '' !== urlObj.domain)
	        return urlObj.newCopy();
	    var base = this.newCopy();
	    var urlPath = urlObj.path;
	    if (urlPath.indexOf('/') !== 0) {
	        var basePath = base.path;
	        var idx = basePath.lastIndexOf('/');
	        // Create a global array of segments containing base
	        // segments
	        // and
	        // URL path segments.
	        var segments = basePath.split(/[\/]/gi);
	        var baseTrailingSeparator = hasTrailingSeparator(basePath);
	        if (!baseTrailingSeparator) {
	            // Remove the last segment ('file name') of the base
	            // URL.
	            segments.pop();
	        }
	        var urlSegments = urlPath.split(/[\/]/gi);
	        for (var i = 0; i < urlSegments.length; i++) {
	            var segment = urlSegments[i];
	            segments.push(segment);
	        }
	        var before = segments[0] === '';
	        var after = segments.length > 0 && //
	        segments[segments.length - 1] === '';
	        URI.resolvePathSegments(segments, true);
	        base.path = segments.join('/');
	        // if (before) {
	        // base.path = '/' + base.path;
	        // }
	        // if (after) {
	        // base.path += '/';
	        // }
	    } else {
	        base.path = urlPath;
	    }
	    base.query = urlObj.query;
	    base.fragment = urlObj.fragment;
	    return base;
	};
	
	/**
	 * This method serializes the object containing individual parts of URIs.
	 */
	URI.prototype.toString = function() {
	    var result = '';
	    if (this.scheme) {
	        result = this.scheme;
	    }
	    if (this.authority || this.domain) {
	        if (result !== '') {
	            result += ':';
	        }
	        result += '//';
	    }
	    if (this.authority) {
	        result += this.authority;
	        result += '@';
	    }
	    if (this.domain) {
	        result += this.domain;
	    }
	    if (this.port) {
	        result += ':' + this.port;
	    }
	    if (this.path !== '') {
	        if (result.length > 0 && !this.path.match(/^[\/]/)) {
	            result += '/';
	        }
	        result += this.path;
	    }
	    if (this.query) {
	        var q = this.query;
	        if ((typeof q) != 'string') {
	            q = URI.serializeQuery(q);
	        }
	        result += '?' + q;
	    }
	    if (this.fragment) {
	        result += '#' + this.fragment;
	    }
	    return result;
	};
	
	module.exports = URI;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_28__;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_29__;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_30__;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_31__;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var L = __webpack_require__(31);
	var MapTiles = __webpack_require__(33);
	
	/**
	 * The code of this class was mostly copied from the leaflet.utfgrid Leaflet
	 * extension (MIT license, by David Leaver). The difference with the original
	 * implementation is that 1) this class loads tiles using _loadTiles method; 2)
	 * this class notifies about loading of tiles for each new screen using the
	 * "startLoading"/"endLoading" events; 3) it loads tiles starting from the
	 * center of the current screen.
	 */
	var InteractionLayer = L.Class.extend({
	
	    includes : L.Mixin.Events,
	
	    options : {
	        resolution : 4,
	        pointerCursor : true
	    },
	
	    /** Initializes this layer */
	    initialize : function(options) {
	        L.setOptions(this, options);
	        // this._move = _.throttle(this._move, 20);
	        // this._update = _.debounce(this._update, 10);
	    },
	
	    /**
	     * This method is called when this layer is added to the map.
	     */
	    onAdd : function(map) {
	        this._map = map;
	        this._container = this._map._container;
	        // this._update();
	        // map.on('click', this._click, this);
	        map.on('mousemove', this._move, this);
	        // map.on('moveend', this._update, this);
	    },
	
	    /**
	     * This method is called when this layer is removed from the map.
	     */
	    onRemove : function() {
	        var map = this._map;
	        map.off('click', this._click, this);
	        map.off('mousemove', this._move, this);
	        // map.off('moveend', this._update, this);
	        this._removeMouseCursorStyle();
	    },
	
	    /** Map click handler */
	    _click : function(e) {
	        var on = this._objectForEvent(e);
	        if (on.data) {
	            this.fire('click', on);
	        }
	    },
	
	    /** Map move handler */
	    _move : function(e) {
	        var on = this._objectForEvent(e);
	        if (on.data !== this._mouseOn) {
	            if (this._mouseOn) {
	                this.fire('mouseout', {
	                    latlng : e.latlng,
	                    data : this._mouseOn
	                });
	                this._removeMouseCursorStyle();
	            }
	            if (on.data) {
	                this.fire('mouseover', on);
	                this._setMouseCursorStyle();
	            }
	            this._mouseOn = on.data;
	        } else if (on.data) {
	            this.fire('mousemove', on);
	        }
	    },
	
	    /**
	     * Checks if the cursor style of the container should be changed to pointer
	     * cursor
	     */
	    _setMouseCursorStyle : function() {
	        if (!this.options.pointerCursor)
	            return;
	        if (!this._container._pointerCursorCount) {
	            this._container._pointerCursorCount = 1;
	            this._container.style.cursor = 'pointer';
	        } else {
	            this._container._pointerCursorCount++;
	        }
	    },
	
	    /** Removes cursor style from the container */
	    _removeMouseCursorStyle : function() {
	        if (!this.options.pointerCursor)
	            return;
	        if (this._container._pointerCursorCount) {
	            this._container._pointerCursorCount--;
	            if (this._container._pointerCursorCount === 0) {
	                this._container.style.cursor = '';
	                delete this._container._pointerCursorCount;
	            }
	        }
	    },
	
	    /**
	     * Returns an object from UTF grid corresponding to the coordinates of the
	     * mouse event.
	     */
	    _objectForEvent : function(e) {
	        throw new Error('This method should be implemented ' + //
	        'in subclasses.');
	    },
	
	});
	
	module.exports = InteractionLayer;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(28);
	var L = __webpack_require__(31);
	var Mosaic = __webpack_require__(1);
	
	/**
	 * Common superclass for all map layers loading tiles using an external loader
	 * object.
	 */
	module.exports = L.Class.extend({
	
	    includes : L.Mixin.Events,
	
	    /** Initializes this layer */
	    initialize : function(options) {
	        L.setOptions(this, options);
	        _.defaults(this.options, {
	            minZoom : 0,
	            maxZoom : 25,
	            tileSize : 256
	        });
	    },
	
	    /**
	     * This method is called when this layer is added to the map.
	     */
	    onAdd : function(map) {
	        this._map = map;
	        this._container = this._map._container;
	        this._update();
	    },
	
	    /**
	     * This method is called when this layer is removed from the map.
	     */
	    onRemove : function() {
	    },
	
	    /** Re-loads tiles for new map position */
	    _update : function() {
	        // Check if tiles should be loaded
	        var zoom = this._map.getZoom();
	        var tileSize = this.options.tileSize;
	        if (zoom > this.options.maxZoom || //
	        zoom < this.options.minZoom) {
	            return;
	        }
	
	        // Load tiles
	        var bounds = this._map.getPixelBounds();
	        var min = this._getTilePosition(bounds.min);
	        var max = this._getTilePosition(bounds.max);
	        var queue = this._getTilesReferencesFromCenterOut(min, max);
	
	        var evt = {
	            queue : queue
	        };
	        var that = this;
	        that.fire('startLoading', evt);
	        that.options.loadTiles(zoom, queue, function(err, tiles) {
	            if (err) {
	                evt.errors = err;
	            }
	            evt.tiles = tiles;
	            that.fire('endLoading', evt);
	        });
	
	        /**
	         * Loads tiles corresponding to points specified in the 'queue'
	         * parameter of this method and returns these tiles using the given
	         * callback method. The first parameter of this method is an error and
	         * the second one is the resulting tiles.
	         */
	        this.options.loadTiles = function(zoom, queue, callback) {
	            callback(new Error('Not implemented'));
	        };
	    },
	
	    /** Calculates order of tiles loading */
	    _getTilesReferencesFromCenterOut : function(min, max) {
	        var queue = [];
	        for (var j = min.y; j <= max.y; j++) {
	            for (var i = min.x; i <= max.x; i++) {
	                queue.push(this._newPoint(i, j));
	            }
	        }
	        if (queue.length) {
	            var that = this;
	            var center = this._newPoint((min.x + max.x) / 2,
	                    (min.y + max.y) / 2);
	            queue.sort(function(a, b) {
	                var delta = that._distance(a, center) - //
	                that._distance(b, center);
	                return delta;
	            });
	        }
	        return queue;
	    },
	
	    /**
	     * Creates and returns a new point object (containing X/Y coordinates).
	     */
	    _newPoint : function(x, y) {
	        if (x.length) {
	            y = x[1];
	            x = x[0];
	        }
	        return {
	            x : x,
	            y : y,
	            toString : function() {
	                return JSON.stringify(this, null, 2);
	            }
	        };
	    },
	
	    /**
	     * Calculates distance between two points. This method is used to calculate
	     * order of tiles loading.
	     */
	    _distance : function(a, b) {
	        var x = a.x - b.x;
	        var y = a.y - b.y;
	        return Math.sqrt(x * x + y * y);
	    },
	
	    /**
	     * Returns X/Y coordinates of the tile corresponding to the specified point
	     * on the map
	     */
	    _getTilePosition : function(point) {
	        var tileSize = this.options.tileSize;
	        return this._newPoint(Math.floor(point.x / tileSize), Math
	                .floor(point.y / tileSize));
	    },
	
	});


/***/ }
/******/ ])
});

//# sourceMappingURL=mosaic-core.js.map