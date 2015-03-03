var _ = require('underscore');
var React = require('react');

var PopupPanel = React.createClass({
    displayName : "PopupPanel",
    statics : {
        divStack : [],
        closePopup : function(options) {
            var div = this.divStack.pop();
            if (!div)
                return;
            var popupContainer = this.getPopupContainer();
            popupContainer.removeChild(div);
            React.unmountComponentAtNode(div);
        },
        openPopup : function(options) {
            var popupContainer = this.getPopupContainer();
            var div = document.createElement('div');
            popupContainer.appendChild(div);
            this.divStack.push(div);
            var panel = PopupPanel.apply(this, arguments);
            React.render(panel, div);
        },
        getPopupContainer : function(){
            console.log('this._popupContainer', this._popupContainer);
            if (!this._popupContainer){
                this._popupContainer = document.body;
            }
            return this._popupContainer;
        },
        setPopupContainer : function(container) {
            this._popupContainer = container;
            console.log('this.setPopupContainer', this._popupContainer);
        }
    },

    componentDidMount : function() {
        this._updatePopupHeight = _.bind(this._updatePopupHeight, this);
        this._updatePopupHeight = _.debounce(this._updatePopupHeight, 10);
        window.addEventListener('resize', this._updatePopupHeight);
        document.addEventListener('keydown', this._onKeyDown);
        var that = this;
        this.updateHeight(function() {
            if (_.isFunction(that.props.onOpen)) {
                that.props.onOpen(that);
            }
        });
        // Change the default Bootstrap settings
        var elm = this.refs.dialog.getDOMNode();
        elm.style.marginTop = '0px';
        elm.style.marginBottom = '0px';
    },
    componentDidUpdate : function() {
        this._updatePopupHeight();
    },
    componentWillUnmount : function() {
        window.removeEventListener('resize', this._updatePopupHeight);
        document.removeEventListener('keydown', this._onKeyDown);
        if (_.isFunction(this.props.onClose)) {
            this.props.onClose(this);
        }
    },
    _onKeyDown : function(event) {
        if (!this.props.disableEsc && event.which == 27) { // ESC
            PopupPanel.closePopup();
        }
    },
    _updatePopupHeight : function() {
        this.updateHeight();
    },

    updateHeight : function(callback) {
        var containerElm = this.getDOMNode();
        var innerBorderElm = this.refs.innerBorder.getDOMNode();
        var outerBorderElm = this.refs.outerBorder.getDOMNode();
        var containerHeight = containerElm.offsetHeight;
        var outerHeight = outerBorderElm.offsetHeight;
        var contentPosition = //
        this._getPosition(innerBorderElm, outerBorderElm);
        var contentHeight = innerBorderElm.offsetHeight;
        var before = contentPosition.top;
        var after = outerHeight - (before + contentHeight);
        var margin = this.props.verticalMargin || 0;
        var height = containerHeight - (before + after) - (margin * 2);
        height = Math.max(height, 0);
        if (this.props.maxHeight) {
            height = Math.min(this.props.maxHeight, height);
        }
        if (!isNaN(height) && this.state.maxHeight !== height) {
            innerBorderElm.style.maxHeight = height + 'px';
            var that = this;
            setTimeout(function() {
                var containerHeight = containerElm.offsetHeight;
                var dialogElm = that.refs.dialog.getDOMNode();
                var dialogHeight = dialogElm.offsetHeight;
                var pos = Math.round((containerHeight - dialogHeight) / 2);
                pos = Math.max(pos, 0);
                dialogElm.style.top = pos + 'px';
                if (callback) {
                    callback();
                }
            }, 1);
        } else {
            if (callback) {
                callback();
            }
        }
    },
    _newState : function(options) {
        var state = _.extend({}, this.state, options);
        return state;
    },
    getInitialState : function() {
        return this._newState();
    },
    _handleClose : function(force, ev) {
        ev.stopPropagation();
        ev.preventDefault();
        if (this.props.disableEsc && !force)
            return ;
        var onClose = this.props.onClose;
        var close = true;
        if (_.isFunction(onClose)) {
            var result = onClose(ev);
            close = (result !== false);
        }
        if (close) {
            PopupPanel.closePopup({
                app : this.props.app
            });
        }
    },
    _getPosition : function(el, parent) {
        var _x = 0;
        var _y = 0;
        while (el && el !== parent && !isNaN(el.offsetLeft) && //
        !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {
            top : _y,
            left : _x
        };
    },
    render : function() {
        var className = this.props.className || '';
        className = "modal-dialog " + className;
        return (React.createElement("div", {
            className : "modal in",
            tabIndex : "-1",
            role : "dialog",
            ref : "container",
            style : {
                display : 'block'
            }
        }, //
        React.createElement("div", {
            className : "modal-backdrop in",
            onClick : this._handleClose.bind(this, false)
        }), //
        React.createElement("div", {
            className : className,
            ref : "dialog"
        }, //
        React.createElement("div", {
            className : "modal-content",
            ref : "outerBorder"
        },//
        React.createElement("div", {
            className : "modal-header"
        }, //
        React.createElement("button", {
            type : "button",
            className : "close",
            onClick : this._handleClose.bind(this, true)
        }, //
        React.createElement("span", {
            "aria-hidden" : "true"
        }, "×"), //
        React.createElement("span", {
            className : "sr-only"
        }, "Close") //
        ), //
        React.createElement("h4", {
            className : "modal-title"
        }, //
        this.props.title)//
        ), //
        React.createElement("div", {
            className : "modal-body",
            ref : "innerBorder"
        }, this.props.body), //
        React.createElement("div", {
            className : "modal-footer"
        }, this.props.footer) //
        ) //
        ) //
        ) //
        );
    }
});

module.exports = PopupPanel;
