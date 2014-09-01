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
                getRecordHeight : function() {
                    return this.recordHeight || 30;
                },
                getFullLength : function() {
                    return this.fullLength || 1000000;
                },
                loadItems : function(startIndex, size, callback) {
                    throw new Error('Not implemented');
                },
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
        componentDidMount : function() {
            this._setScrollPos(0);
        },
        componentWillMount : function(nextProps) {
            this.props.model._addPositionListener(this._positionHandler, this);
            this._setScrollPos = _.debounce(_.bind(this._setScrollPos, this),
                    50);
            this._setScrollPos(this.state.scrollPos);
        },
        componentWillUnmount : function(nextProps) {
            this.props.model._removePositionListener(this._positionHandler,
                    this);
        },
        componentWillReceiveProps : function(nextProps) {
            // this.setState(this._newState(nextProps));
            this._setScrollPos(this.state.scrollPos);
        },
        getInitialState : function() {
            return this._newState({});
        },
        _removePositionListener : function(pos) {
            // TODO : scroll to the specified position
        },
        _findScrollPos : function(el) {
            return this._findPos(el)[1];
        },
        _findPos : function(el) {
            var x = 0;
            var y = 0;
            if (el) {
                var container = this.getDOMNode();
                while (el && el !== container) {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                    el = el.offsetParent;
                }
            }
            return [ x, y ];
        },
        componentDidUpdate : function() {
            var that = this;
            var blockNode = that.refs.block.getDOMNode();
            var blockPos = that._findScrollPos(blockNode);

            var children = blockNode.children || [];

            var idx = that.state.offsetIndex - that.state.index;
            var node = children[idx];
            var nodePos = that._findScrollPos(node);

            var container = that.getDOMNode();
            var step = 1; // Math.max(that.props.recordHeight / 10, 1);
            // scrollTop = heightBefore + (nodePos - offset - blockPos)
            var scrollTop = Math.ceil(container.scrollTop / step) * step;
            var heightBefore = Math.round(scrollTop + blockPos - //
            nodePos + that.state.offset);
            var before = that.refs.before.getDOMNode();

            if (before.offsetHeight != heightBefore) {
                before.style.height = Math.max(0, heightBefore) + 'px';
            }
            if (container.scrollTop !== scrollTop) {
                that._disableUpdates = true;
                setTimeout(function() {
                    container.scrollTop = scrollTop;
                    that._disableUpdates = false;
                }, 1);
            }
        },
        _setScrollPos : function(scrollPos) {
            var that = this;
            // Get the visible range ("window")
            var model = that.props.model;
            var node = that.getDOMNode();
            var windowHeight = node.offsetHeight;
            var windowStart = scrollPos; // node.scrollTop;
            var windowEnd = windowStart + windowHeight;

            // Get the current block range
            var blockStart = 0;
            var blockEnd = 0;
            var blockStartIndex = that.state.index || 0;
            var block = that.refs.block;
            var blockElements = [];
            if (block) {
                var blockNode = block.getDOMNode();
                blockStart = that._findScrollPos(blockNode);
                blockEnd = blockStart + blockNode.offsetHeight;
                blockElements = blockNode.children;
            }

            // Estimate average height of an item
            var recordHeight = model.getRecordHeight();

            var startIndex;
            var length;
            var offset;
            var offsetIndex;

            var k = 1.5;
            if (windowEnd < blockStart || windowStart > blockEnd) {
                if (windowEnd < blockStart) {
                    startIndex = Math.floor(windowStart / recordHeight);
                } else if (windowStart > blockEnd) {
                    var indexInc = Math.floor((windowStart - blockEnd) / //
                    recordHeight);
                    startIndex = blockStartIndex + blockElements.length + //
                    indexInc;
                }
                offset = -(windowStart % recordHeight);
                length = Math.ceil((windowHeight - offset) / recordHeight) * k;
                offsetIndex = startIndex;
            } else {
                startIndex = blockStartIndex;
                length = blockElements.length;
                // Remove not visible items at the beginning
                for (var i = 0; i < blockElements.length; i++) {
                    var itemNode = blockElements[i];
                    var height = itemNode.offsetHeight;
                    if (blockStart + height >= windowStart) {
                        break;
                    }
                    blockStart += height;
                    startIndex++;
                    length--;
                }
                offset = blockStart - windowStart;

                // Add nodes at the beginning
                var delta = Math.ceil(Math.abs(offset) / recordHeight);
                offsetIndex = startIndex;
                startIndex = Math.max(0, startIndex - delta);
                length += delta;

                var minBlockLen = this.props.minBlockSize || 10;

                // Remove not visible items at the end
                for (var i = blockElements.length - 1; i >= 0; i--) {
                    var itemNode = blockElements[i];
                    var height = itemNode.offsetHeight;
                    if (blockEnd - height - offset <= windowEnd) {
                        break;
                    }
                    blockEnd -= height;
                    length--;
                }
                // Add nodes at the end
                length += Math.ceil(Math.max(0, windowEnd - blockEnd - offset)
                        / recordHeight)
                        * k;
            }
            var fullLength = model.getFullLength();
            if (length >= 0) {
                length = Math.max(0, //
                Math.min(fullLength - startIndex, length));
            }
            if (offset !== 0) {
                length++;
            }

            // Load items
            model.loadItems(startIndex, length, function(items) {
                var state = that._newState({
                    scrollPos : scrollPos,
                    index : startIndex,
                    items : items,
                    offset : offset,
                    offsetIndex : offsetIndex
                });
                that.setState(state);
            });
        },
        _onScroll : function(event) {
            if (this._disableUpdates)
                return;
            this._setScrollPos(this.getDOMNode().scrollTop);
        },
        render : function() {
            var items = this.state.items || [];
            var startIndex = (this.state.index || 0);
            var endIndex = startIndex + items.length;
            var model = this.props.model;
            var fullLength = model.getFullLength();
            var recordHeight = model.getRecordHeight();
            var heightBefore = (startIndex * recordHeight) + 'px';
            var heightAfter = ''
                    + (Math.max(0, fullLength - endIndex) * recordHeight)
                    + 'px';
            return React.DOM.div({
                id : this.props.id,
                className : this.props.className,
                onScroll : this._onScroll
            },
            //
            React.DOM.div({
                ref : 'before',
                style : {
                    height : heightBefore
                }
            }),
            //
            React.DOM.div({
                ref : 'block',
            }, items),
            //
            React.DOM.div({
                ref : 'after',
                style : {
                    height : heightAfter
                }
            }));
        }
    });

});