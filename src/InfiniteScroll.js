if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', 'react' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');
    var React = require('react');
    function findPos(container, el) {
        var x = 0;
        var y = 0;
        while (el && el !== container) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return [ x, y ];
    }
    /**
     * This is an "infinite scroll" widget allowing to load elements by their
     * position.
     */
    return React.createClass({
        statics : {
            Model : Mosaic.Class.extend(Mosaic.Events.prototype, {
                initialize : function(options) {
                    this.items = [];
                    _.extend(this, options);
                },
                /** Number of items in one 'page'. */
                getPageSize : function() {
                    return this.pageSize || 4;
                },
                /** Returns average height of each item. */
                getItemHeight : function() {
                    return this.itemHeight || 30;
                },
                /** Returns the total number of items */
                getSize : function() {
                    return this.size;
                },
                /**
                 * Loads the specified number of items starting from the given
                 * position
                 */
                loadItems : function(startIndex, size, callback) {
                    throw new Error('Not implemented');
                },
                /** Public method to go to the specified position */
                goTo : function(pos) {
                    this.emit('updatePos', pos);
                },
                /**
                 * Adds a change position listener. This method is used
                 * internally by the widget itself.
                 */
                _addPositionListener : function(listener, context) {
                    this.on('updatePos', listener, context);
                    return this;
                },
                /** Removes a change listener */
                _removePositionListener : function(listener, context) {
                    this.off('updatePos', listener, context);
                    return this;
                },
            })
        },
        _newState : function(options) {
            return _.extend({}, this.state, options);
        },
        componentWillMount : function(nextProps) {
            this.props.model._addPositionListener(this._positionHandler, this);
            this._adjustPosition = _.debounce(this._adjustPosition, 5);
            this._setScrollPos = _.debounce(_.bind(this._setScrollPos, this),
                    30);
        },
        componentDidMount : function() {
            this._setScrollPos(this.state.scrollPos);
            // this.componentDidUpdate();
        },

        componentWillUnmount : function(nextProps) {
            this.props.model._removePositionListener(this._positionHandler,
                    this);
        },
        componentWillReceiveProps : function(nextProps) {
            console.log('I AM HERE!');
            this._setScrollPos(this.state.scrollPos, true);
        },
        getInitialState : function() {
            return this._newState({
                index : 0,
                length : 0,
                items : [],
                scrollPos : 0
            });
        },
        _positionHandler : function(pos) {
            var that = this;
            var model = that.props.model;
            var h = model.getItemHeight();
            var scrollPos = pos * h;
            that._setScrollPos(scrollPos, true);
        },
        _adjustPosition : function() {
            var that = this;
            var container = that.getDOMNode();
            var blockNode = that.refs.block.getDOMNode();
            var wrapperNode = that.refs.wrapper.getDOMNode();

            var scrollPos = container.scrollTop;
            var model = that.props.model;
            var h = model.getItemHeight();

            console.log('[BEFORE]: fullHeight:' + wrapperNode.offsetHeight,
                    'blockPos:' + findPos(container, blockNode)[1],
                    'blockHeight:' + blockNode.offsetHeight, 'scrollPos:'
                            + scrollPos);
            var size = model.getSize();
            var fullHeight = size * h;
            if (wrapperNode.offsetHeight != fullHeight) {
                console.log('!!!!!');
            }
            wrapperNode.style.height = fullHeight + 'px';

            var pos = scrollPos - that.state.index * h;
            var height = that.state.items.length * h;
            var blockHeight = blockNode.offsetHeight;
            var blockPos = scrollPos - blockHeight * (pos / height);
            blockPos = Math.round(blockPos);
            blockNode.style.top = blockPos + 'px';

            console.log(' [AFTER]: fullHeight:' + fullHeight, 'blockPos:'
                    + blockPos, 'blockHeight:' + blockHeight, 'scrollPos:'
                    + scrollPos);

        },
        componentDidUpdate : function() {
            // this._adjustPosition();
        },
        _getBlockInfo : function(scrollPos) {
            var that = this;
            var model = that.props.model;
            var pageSize = model.getPageSize();
            var h = model.getItemHeight();
            var container = that.getDOMNode();

            var windowHeight = container.offsetHeight;
            var delta = windowHeight / 4;

            var startPos = Math.max(scrollPos - delta, 0);
            var endPos = scrollPos + windowHeight + delta;

            var startItem = Math.floor(startPos / h);
            var endItem = Math.ceil((endPos + h - 1) / h);

            var startPage = Math.floor(startItem / pageSize);
            var endPage = Math.ceil((endItem + pageSize - 1) / pageSize);

            var index = startPage * pageSize;
            var length = (endPage - startPage) * pageSize;
            return {
                index : index,
                length : length
            };
        },
        _setScrollPos : function(scrollPos, force) {
            console.log('_setScrollPos', scrollPos, force);
            var that = this;
            var params = that._getBlockInfo(scrollPos);
            if (force || params.index != that.state.index
                    || params.length != that.state.length) {
                var model = that.props.model;
                model.loadItems(params.index, params.length, function(items) {
                    params.items = items;
                    that.setState(that._newState(params));
                });
            }
        },
        _onScroll : function(event) {
            this._setScrollPos(this.getDOMNode().scrollTop);
        },
        render : function() {
            console.log('render')
            var items = this.state.items || [];
            var model = this.props.model;

            var size = model.getSize();
            var h = model.getItemHeight();
            var blockPos = (this.state.index || 0) * h;
            var fullHeight = size * h;

            return React.DOM.div({
                id : this.props.id,
                className : this.props.className,
                onScroll : this._onScroll
            }, React.DOM.div({
                ref : 'wrapper',
                style : {
                    height : fullHeight + 'px',
                    position : 'relative',
                // overflow : 'hidden'
                }
            }, React.DOM.div({
                ref : 'block',
                style : {
                    top : blockPos + 'px',
                    position : 'absolute'
                }
            }, items)));
        }
    });

});