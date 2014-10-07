if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'react', 'mosaic-commons', './React.FilterBox' ],
// Module
function(require) {

    var _ = require('underscore');
    var React = require('react');
    var Mosaic = require('mosaic-commons');
    var FilterBox = require('./React.FilterBox');

    var SearchBoxMixinModel = FilterBox.extendModel({

        /**
         * Converts a search criteria object into a list of values accepted by
         * the filter box.
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
         * Creates and returns a new filter value object used by filter box to
         * show values. This function overloads a method with the same name from
         * the FilterBox.Model class.
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
     * This mixin expects that the following methods and fields are implemented
     * in the parent class: 1) '_onSearchCriteriaChanged' - this method is used
     * to set changed search criteria object 2) 'this.state.textSearchField'
     * should contain the name of the search field associated with the text
     * entered by user. The following methods should be used to interact with
     * the internal state of the filter box: 'setSearchCriteria' method should
     * be used to update the search criteria; the 'getSearchCriteria' method
     * returns all search criteria managed by the filter box; the
     * 'renderSearchBox' returns a new rendered search box
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
         * Converts a search criteria object into a list of values accepted by
         * the filter box.
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
         * This method renders and returns a filter box using the underlying
         * model keeping the state of the search box.
         */
        renderSearchBox : function(options) {
            return (FilterBox(_.extend({}, options, {
                model : this._getFilterBoxModel()
            })));
        },
    };

    return SearchBoxMixin;

});