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

    return React.createClass({
        _newState : function(options) {
            return _.extend({}, this.state, options);
        },
        componentDidMount : function() {
            this._setScrollPos(0);
        },
        componentWillMount : function(nextProps) {
            this._setScrollPos = _.debounce(_.bind(this._setScrollPos, this),
                    50);
            this._setScrollPos(this.state.scrollPos);
        },
        componentWillReceiveProps : function(nextProps) {
            this.setState(this._newState(nextProps));
            this._setScrollPos(this.state.scrollPos);
        },
        getInitialState : function() {
            return this._newState({});
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
            var node = that.refs.block.getDOMNode();
            var idx = that.state.offsetIndex - that.state.index;
            var children = node.children || [];
            var n = children[idx];
            var pos = that._findPos(n)[1] - that.state.offset;
            // that.scrollDisabled = true;
            var container = that.getDOMNode();
            container.scrollTop = pos;
            // that.scrollDisabled = false;
        },
        _setScrollPos : function(scrollPos) {
            var that = this;
            // Get the visible range ("window")
            var node = that.getDOMNode();
            var windowStart = scrollPos; // node.scrollTop;
            var windowHeight = node.offsetHeight;
            var windowEnd = windowStart + windowHeight;

            // Get the current block range
            var blockStart = 0;
            var blockEnd = 0;
            var blockStartIndex = that.state.index || 0;
            var block = that.refs.block;
            var blockElements = [];
            if (block) {
                var blockNode = block.getDOMNode();
                blockStart = that._findPos(blockNode)[1];
                blockEnd = blockStart + blockNode.offsetHeight;
                blockElements = blockNode.children;
            }

            // Estimate average height of an item
            var recordHeight = that.props.recordHeight;

            var startIndex;
            var length;
            var offset;
            var offsetIndex;

            if (windowEnd < blockStart || windowStart > blockEnd) {
                if (windowEnd < blockStart) {
                    startIndex = Math.floor(windowStart / recordHeight);
                } else if (windowStart > blockEnd) {
                    var indexInc = Math.floor((windowStart - blockEnd) / //
                    recordHeight);
                    startIndex = blockStartIndex + blockElements.length + //
                    indexInc;
                }
                length = Math.ceil(windowHeight / recordHeight);
                offsetIndex = startIndex;
                offset = -(windowStart % recordHeight);
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
                var delta = Math.ceil(Math.max(0, offset) / recordHeight);
                offsetIndex = startIndex;
                startIndex -= delta;
                length += delta;

                if (offset != 0) {
                    length++;
                }
                
                var minBlockLen = this.props.minBlockSize || 10;

                // Remove not visible items at the end
                for (var i = blockElements.length - 1; i >= 0
                        && length > minBlockLen; i--) {
                    var itemNode = blockElements[i];
                    var height = itemNode.offsetHeight;
                    if (blockEnd - height <= windowEnd) {
                        break;
                    }
                    blockEnd -= height;
                    length--;
                }
                // Add nodes at the end
                length += Math.ceil(Math.max(0, windowEnd - blockEnd)
                        / recordHeight);
            }

            if (startIndex != this.state.index || length != this.state.length) {
                // Load items
                that.props.loadItems(startIndex, length, function(result) {
                    var state = that._newState({
                        scrollPos : scrollPos,
                        index : startIndex,
                        items : result.items,
                        length : result.length,
                        offset : offset,
                        offsetIndex : offsetIndex
                    });
                    that.setState(state);
                });
            }
        },
        _onScroll : function(event) {
            // if (!this.scrollDisabled) {
            this._setScrollPos(this.getDOMNode().scrollTop);
            // }
        },
        render : function() {
            var items = this.state.items || [];
            var startIndex = (this.state.index || 0);
            var endIndex = startIndex + items.length;
            var length = this.state.length || 0;
            var recordHeight = this.props.recordHeight;
            // var offset = this.state.offset;
            var lengthBefore = (startIndex * recordHeight) + 'px';
            var lengthAfter = ''
                    + (Math.max(0, length - endIndex) * recordHeight) + 'px';
            return React.DOM.div({
                id : this.props.id,
                className : this.props.className,
                onScroll : this._onScroll
            },
            //
            React.DOM.div({
                ref : 'before',
                style : {
                    height : lengthBefore
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
                    height : lengthAfter
                }
            }));
        }
    });

});