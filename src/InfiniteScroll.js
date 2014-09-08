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

        /** The main rendering method. */
        render : function() {
            var items = this.state.items || [];
            var size = this._getSize();
            var h = this._getItemHeight();
            var blockPos = (this.state.index || 0) * h;
            var fullHeight = size * h;

            return React.DOM.div({
                id : this.props.id,
                className : this.props.className,
                style : this.props.style,
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
                    position : 'absolute',
                    left : '0px',
                    right : '0px',
                    bottom : 'auto'
                }
            }, items)));
        },

        // -------------------------------------------------------------------
        // React lifecycle methods
        /**
         * This method creates "debounced" versions of some methods to avoid to
         * frequent calls
         */
        componentWillMount : function(nextProps) {
            this._adjustPosition = _.debounce(this._adjustPosition, 5);
            this._setScrollPos = _.debounce(_.bind(this._setScrollPos, this),
                    30);
        },
        /** Initializes the scroll and set it in an initial position. */
        componentDidMount : function() {
            this._resetScrollPos(this.props);
        },
        /** Updates the position of the scroller. */
        componentWillReceiveProps : function(nextProps) {
            this._resetScrollPos(nextProps);
        },
        /**
         * This method is called after the component is rendered and it adjusts
         * position of the item block.
         */
        componentDidUpdate : function() {
            this._adjustPosition();
        },
        /** Creates and returns the inital state object for this component. */
        getInitialState : function() {
            return this._newState({
                index : 0,
                length : 0,
                items : [],
                scrollPos : 0
            });
        },

        // -------------------------------------------------------------------
        // Internal (private) methods

        /**
         * This is an internal method creating and returning a new state.
         */
        _newState : function(options) {
            return _.extend({}, this.state, options);
        },
        /**
         * This method returns the size of a "page" - size of block of items
         * loaded at once. By default this method returns the
         * "this.props.pageSize" value.
         */
        _getPageSize : function() {
            return this.props.pageSize || 4;
        },
        /**
         * Returns the total number of items to visualize in this scroll.
         */
        _getSize : function() {
            return this.props.length || 0;
        },
        /**
         * Returns an average size of each individual item in the list. This
         * value is used to calculate the total size of the scroll. By default
         * this method returns the "this.props.itemHeight" value.
         */
        _getItemHeight : function() {
            return this.props.itemHeight || 10;
        },
        /**
         * @param params.index
         *            start index of the item to load
         * @param params.length
         *            number of items to load
         * @param params.callback
         *            a callback method accepting the resulting items
         */
        _loadItems : function(params) {
            this.props.loadItems(params);
        },
        /**
         * Sets the scroll in initial position or in an already existing one if
         * the initial position is not defined.
         */
        _resetScrollPos : function(props) {
            props = props || this.props;
            var scrollPos = this.state.scrollPos;
            var focusedPos = props.focusedIndex;
            focusedPos = !isNaN(focusedPos) ? focusedPos : -1;
            var size = this._getSize();
            if (!isNaN(focusedPos) && focusedPos >= 0 && focusedPos < size) {
                var h = this._getItemHeight();
                scrollPos = focusedPos * h;
            }
            this._focusedItemIdx = focusedPos;
            this._setScrollPos(scrollPos, true);
        },
        /**
         * Adjust the absolute position of the items block to reflect exactly
         * the position of the scroller. This method is required because real
         * items sizes could be different from the average size returned by the
         * "_getItemHeight" method.
         */
        _adjustPosition : function() {
            var that = this;
            var container = that.getDOMNode();
            var scrollPos = container.scrollTop;

            var h = that._getItemHeight();
            var pos = scrollPos - that.state.index * h;
            var height = that.state.items.length * h;
            var blockNode = that.refs.block.getDOMNode();
            var blockHeight = blockNode.offsetHeight;

            var blockPos = scrollPos - blockHeight * (pos / height);
            blockPos = Math.round(blockPos);
            blockNode.style.top = blockPos + 'px';

            if (!isNaN(that._focusedItemIdx)) {
                delete that._focusedItemIdx;
                setTimeout(function() {
                    container.scrollTop = that.state.scrollPos;
                }, 30);
            }
        },
        /**
         * Sets the scroller in the specified position and updates the internal
         * state if the content should be re-loaded.
         */
        _setScrollPos : function(scrollPos, force) {
            var that = this;
            var pageSize = that._getPageSize();
            var h = that._getItemHeight();
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
            var params = {
                scrollPos : scrollPos,
                index : index,
                length : length
            };
            if (force || params.index != that.state.index || //
            params.length != that.state.length) {
                params.callback = function(items) {
                    params.items = items;
                    that.setState(that._newState(params));
                };
                that._loadItems(params);
            } else {
                that._adjustPosition();
            }
        },
        /** This handler is called when the scroller changes its position. */
        _onScroll : function(event) {
            this._setScrollPos(this.getDOMNode().scrollTop);
        },

    });

});