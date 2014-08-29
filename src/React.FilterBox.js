if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'react', 'mosaic-commons' ],
// Module
function(require) {

    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var React = require('react');

    /**
     * Allows to manage filtering boxes where filter criteria are added as tags
     * to the list. This class expects the following parameters in the
     * constructor:
     * 
     * @param model
     *            the model object with the following fields/methods:
     * @param model.getAll
     *            this method returns all values in this filter
     * @param model.add
     *            this method adds a new text value to the filter list
     * @param model.remove
     *            removes the specified object from the internal list
     * @param model.set
     *            sets a new values; new values replace the old one
     */
    return React.createClass({
        displayName : 'React.FilterBox',
        statics : {
            Model : Mosaic.Class.extend(Mosaic.Events.prototype, {
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
                /** Notifies subscribers about changes */
                _notify : function(evt) {
                    if (evt){
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
            })
        },
        /** Returns the initial state for this input box. */
        getInitialState : function() {
            return this._newState({
                focused : true
            });
        },
        /** This method registers an API listener. */
        componentWillMount : function() {
            this.props.model.addChangeListener(this._onUpdate);
        },
        /** Removes the registered API listener. */
        componentWillUnmount : function() {
            this.props.model.removeChangeListener(this._onUpdate);
        },
        componentDidMount : function() {
            this.componentDidUpdate();
        },
        componentDidUpdate : function() {
            var focused = !!this.state.focused;
            if (focused) {
                var input = this.refs.input;
                var node = input.getDOMNode();
                node.focus();
            }
        },
        /** Updates this view when model properties were changed. */
        _onUpdate : function() {
            this.setState(this._newState({
                focused : true,
                text : ''
            }));
        },
        /** Returns a new state. */
        _newState : function(options) {
            var model = this.props.model;
            return _.extend({
                focused : false,
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
            ev.preventDefault();
            ev.stopPropagation();
            this.setState(this._newState({
                focused : true
            }));
        },
        /**
         * Handles input box focusing. Changes the visualization styles for the
         * FilterBox.
         */
        _handleInputFocus : function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.setState(this._newState({
                focused : true
            }));
        },
        /**
         * Handles modifications of the input box.
         */
        _handleInputChange : function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var input = this.refs.input.getDOMNode();
            this.setState(this._newState({
                text : input.value
            }));
        },
        /**
         * Handles events when user push keyboard button. It updates the text
         * value when user press Enter.
         */
        _handleKeyDown : function(ev) {
            var clear = false;
            if (ev.which === 9) { // Tab
                this._addValue(this.state.text);
                this.setState(this._newState({
                    focused : true
                }));
                clear = true;
            } else if (ev.which === 8 && this.state.text == '') { // Del
                this._removeLastValue();
                clear = true;
            } else if (ev.which === 13) { // Enter
                this._addValue(this.state.text);
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
                    }, val.label));
                }
            }, this);
        },
        /** Main rendering method of this class. */
        render : function() {
            var app = this.props.app;
            var cssClass = this.props.className || 'filter-box';
            if (this.state.focused) {
                cssClass += ' focused';
            }
            return (React.DOM.div({
                key : this.props.key,
                className : cssClass,
                onClick : this._focusInput
            }, this._formatTags(), React.DOM.input({
                ref : 'input',
                size : 12,
                className : 'item',
                type : 'text',
                onFocus : this._handleInputFocus,
                onChange : this._handleInputChange,
                onKeyDown : this._handleKeyDown,
                value : this.state.text
            })));
        },
    });

});