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
            that.props.view._updateCallback = that._onUpdate;
            console.log('ReactAdapter#componentWillMount');
            if (that.props.view.open) {
                that.props.view.open();
            }
        },

        componentWillUnmount : function() {
            var that = this;
            delete that.props.view._updateCallback;
            console.log('ReactAdapter#componentWillUnmount');
            if (that.props.view.close) {
                that.props.view.close();
            }
        },

        _onUpdate : function() {
            console.log('ReactAdapter#_onUpdate');
            this.setState(this._newState());
        },

        getInitialState : function() {
            return this._newState();
        },

        _newState : function() {
            return {};
        },

        render : function() {
            var result = this.props.view._doRender();
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
            this._el = new ReactAdapter({
                view : this
            });
            this._updateCallback = null;
        },
        update : function() {
            console.log('ReactDataView#update');
            if (this._updateCallback) {
                this._updateCallback();
            }
        },
        getElement : function() {
            return this._el;
        },
        _doRender : function() {
            return React.DOM.div(null);
        },
        render : function() {
            return this._el;
        }
    });

    ReactDataView.renderComponent = function(view, el) {
        React.renderComponent(view.render(), el);
    };

    return ReactDataView;
});