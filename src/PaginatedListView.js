var _ = require('underscore');
var React = require('react');
var Mosaic = require('mosaic-commons');

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
            var num = to - from;
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
