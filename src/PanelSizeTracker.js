var _ = require('underscore');
var React = require('react');

/**
 * This class is responsible for automatic tracking and updating of vertical
 * panel sizes.
 */
var PanelSizeTracker = React.createClass({
    displayName : 'PanelSizeTracker',

    /** Updates the size of this zone */
    _resizeContent : function() {
        if (!this.isMounted())
            return;
        var container = this.props.container;
        if (_.isFunction(container)) {
            container = container();
        }
        var containerElm = container.getDOMNode();
        var elm = this.getDOMNode();
        var minSize = this.props.minSize || 10;
        var height = containerElm.offsetHeight;
        var top = 0;
        var e = elm;
        while (e && e !== containerElm) {
            top += e.offsetTop;
            e = e.parentNode;
        }
        var size = Math.max(minSize, Math.min(height - top));
        elm.style.height = size + 'px';
    },

    componentWillMount : function() {
        this._resizeContent = _.debounce(this._resizeContent, 1);
        window.addEventListener('resize', this._resizeContent);
    },

    /** Add resize listener for the window */
    componentDidMount : function() {
        this._resizeContent();
    },

    /** Resizes the element after content updates */
    componentDidUpdate : function() {
        this._resizeContent();
    },

    /** Removes resize listener for the window */
    componentWillUnmount : function() {
        window.removeEventListener('resize', this._resizeContent);
    },

    /**
     * Renders children and track the size of a child with the specified key.
     */
    render : function() {
        return React.Children.only(this.props.children);
    },

});

module.exports = PanelSizeTracker;
