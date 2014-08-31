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
//            this.setState(this._newState(nextProps));
            this._setScrollPos(this.state.scrollPos);
        },
        getInitialState : function() {
            return this._newState({
                length : -1
            });
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
            // scrollTop = heightBefore + (nodePos - offset - blockPos)
            var heightBefore = container.scrollTop + blockPos - nodePos
                    + that.state.offset;

            var before = that.refs.before.getDOMNode();
            before.style.height = Math.max(0, heightBefore) + 'px';
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
                blockStart = that._findScrollPos(blockNode);
                blockEnd = blockStart + blockNode.offsetHeight;
                blockElements = blockNode.children;
            }

            // Estimate average height of an item
            var recordHeight = that.props.recordHeight;

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
            if (this.state.length >= 0) {
                length = Math.max(0, 
                        Math.min(this.state.length - startIndex, length));
            }

            if (startIndex != this.state.index
                    || length != blockElements.length) {
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
            this._setScrollPos(this.getDOMNode().scrollTop);
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
            console.log('CLASS:', this.props.className)
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