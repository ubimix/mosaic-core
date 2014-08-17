if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', 'react' ],
// Module
function(require) {

    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var React = require('react');

    var ReactAdapter = React.createClass({

        componentWillMount : function() {
            var that = this;
            that._onUpdate = _.bind(that._onUpdate, that);
            that.props.view._setRedrawCallback(that._onUpdate);
            if (that.props.view.open) {
                that.props.view.open();
            }
        },

        componentWillUnmount : function() {
            var that = this;
            delete that.props.view._setRedrawCallback(null);
            if (that.props.view.close) {
                that.props.view.close();
            }
        },

        _onUpdate : function() {
            this.setState(this._newState());
        },

        getInitialState : function() {
            return this._newState();
        },

        _newState : function() {
            return {};
        },

        render : function() {
            var result = this.props.view.render();
            if (!result) {
                result = '';
            }
            if (_.isString(result)) {
                result = React.DOM.div(null, result);
            }
            return result;
        }
    });

    var ReactDataView = Mosaic.Class.extend({
        initialize : function(options) {
            this.setOptions(options);
            _.extend(this, this.options.methods);
            this.react = React;
            this._redrawCallback = null;
            if (this.options.render) {
                this.render = this.options.render;
            }
            this._el = new ReactAdapter({
                view : this
            });
        },
        update : function() {
            this._redraw();
        },
        _setRedrawCallback : function(callback) {
            this._redrawCallback = callback;
        },
        _redraw : function() {
            if (this._redrawCallback) {
                this._redrawCallback();
            }
        },
        getElement : function() {
            return this._el;
        },
        render : function() {
            return React.DOM.div(null);
        }
    });

    ReactDataView.renderComponent = function(view, el) {
        React.renderComponent(view.render(), el);
    };

    return ReactDataView;
});