/**
 * @jsx React.DOM
 */
'use strict';
var _ = require('underscore');
var React = require('react');

var PopupPanel = React.createClass({
     displayName : "PopupPanel",
     statics : {
        divStack : [],
        closePopup : function(options){
            var div = this.divStack.pop();
            if (!div)
                return ;
            document.body.removeChild(div);
            React.unmountComponentAtNode(div);
        },
        openPopup : function(options){
            var div = document.createElement('div');
            document.body.appendChild(div);
            this.divStack.push(div);
            var panel = PopupPanel.apply(this, arguments);
            React.render(panel, div);
        },
     },
       
    componentDidMount : function(){
        this._updatePopupHeight = _.bind(this._updatePopupHeight, this);
        this._updatePopupHeight = _.debounce(this._updatePopupHeight, 10);
        window.addEventListener('resize', this._updatePopupHeight);
        document.addEventListener('keydown', this._onKeyDown);
        this._updatePopupHeight();
        if (_.isFunction(this.props.onOpen)) {
            this.props.onOpen(this);
        }
        // Change the default Bootstrap settings
        var elm = this.refs.dialog.getDOMNode();
        elm.style.marginTop = '0px';
        elm.style.marginBottom = '0px';
    },
    componentDidUpdate : function(){
        this._updatePopupHeight();
    },
    componentWillUnmount : function(){
        window.removeEventListener('resize', this._updatePopupHeight);
        document.removeEventListener('keydown', this._onKeyDown);
        if (_.isFunction(this.props.onClose)) {
            this.props.onClose(this);
        }
    },
    _onKeyDown : function(event) {
        if (event.which == 27) { // ESC
            PopupPanel.closePopup();
        }
    },
    _updatePopupHeight : function(){
        var containerElm = this.getDOMNode();
        var innerBorderElm = this.refs.innerBorder.getDOMNode();
        var outerBorderElm = this.refs.outerBorder.getDOMNode();
        var containerHeight = containerElm.offsetHeight;
        var dialogHeight = outerBorderElm.offsetHeight;
        var contentPosition = this._getPosition(innerBorderElm, outerBorderElm);
        var contentHeight = innerBorderElm.offsetHeight;
        var before = contentPosition.top;
        var after = dialogHeight - (before + contentHeight);
        var height = containerHeight - (before + after);
        height = Math.max(height, 0);
        if (this.props.maxHeight) {
            height = Math.min(this.props.maxHeight, height);
        }
        if (!isNaN(height) && this.state.maxHeight !== height){
            innerBorderElm.style.maxHeight = height + 'px';
            var that = this;
            setTimeout(function(){
                var containerHeight = containerElm.offsetHeight;
                var dialogHeight = outerBorderElm.offsetHeight;
                var pos = Math.round((containerHeight - dialogHeight) / 2);
                pos = Math.max(pos, 0);
                outerBorderElm.style.top = pos + 'px';
            }, 1);
        }
    },
    _newState : function(options){
        var state = _.extend({}, this.state, options);
        return state;
    },
    getInitialState : function(){
        return this._newState();
    },
     _handleClose : function(ev){
         ev.stopPropagation();
         ev.preventDefault();
         var onClose = this.props.onClose;
         var close = true;
         if (_.isFunction(onClose)){
             var result = onClose(ev);
             close = !(result === false);
         }
         if (close){
             PopupPanel.closePopup({app : this.props.app});
         }
     },
     _getPosition : function(el, parent) {
         var _x = 0;
         var _y = 0;
         while (el && el !== parent && !isNaN(el.offsetLeft) &&
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
     render : function(){
         var className = this.props.className||'';
         className = "modal-dialog " + className;
         return (
         React.createElement("div", {className: "modal in", tabIndex: "-1", role: "dialog", ref: "container", style: {display: 'block'}}, //
             React.createElement("div", {className: "modal-backdrop in", onClick: this._handleClose}), //
             React.createElement("div", {className: className, ref: "dialog"},  //
                 React.createElement("div", {className: "modal-content", ref: "outerBorder"},// 
                     React.createElement("div", {className: "modal-header"}, //
                         React.createElement("button", {type: "button", className: "close", onClick: this._handleClose}, // 
                             React.createElement("span", {"aria-hidden": "true"}, "×"), //
                             React.createElement("span", {className: "sr-only"}, "Close") //
                         ), //
                         React.createElement("h4", {className: "modal-title"}, // 
                             this.props.title 
                         )//
                     ), //
                     React.createElement("div", {className: "modal-body", ref: "innerBorder"},  
                         this.props.body
                     ), //
                     React.createElement("div", {className: "modal-footer"}, 
                         this.props.footer
                     ) //
                 ) //
             ) //
         ) //
         );
     }
});

module.exports= PopupPanel;
 