var _ = require('underscore');
var React = require('react');
var L = require('leaflet');

module.exports = React.createClass({
    displayName : 'ReactMap',
    render : function() {
        return (React.DOM.div({
            ref : 'container',
            id : this.props.id,
            className : this.props.className,
            style : this.props.style || {}
        }));
    },
    componentDidMount : function() {
        var container = this.refs.container.getDOMNode();
        this.map = this._newMap(container);
        this.map.on('zoomend', this._updateZoomStyles, this);
        if (this.props.onMapAdd) {
            this.props.onMapAdd(this.map);
        }
        this._updateZoomStyles();
    },
    componentWillUnmount : function() {
        if (this.props.onMapRemove) {
            this.props.onMapRemove(this.map);
        }
        this.map.off('zoomend', this._updateZoomStyles, this);
        this.map.remove();
        delete this.map;
    },
    _newMap : function(container) {
        var mapOptions = this.props.options || {};
        var options = _.extend({}, mapOptions, {
            zoomControl : false,
            attributionControl : false,
        });
        var map = L.map(container, options);
        options = _.extend({}, mapOptions.zoomControl);
        options = _.defaults(options, {
            position : 'topright'
        });

        // Set the initial view of this map
        if (mapOptions.zoomControl !== false) {
            var zoomControl = L.control.zoom(options);
            map.addControl(zoomControl);
        }

        if (mapOptions.tilesAttribution !== false) {
            var attributionControl = L.control.attribution(mapOptions.tilesAttribution);
            attributionControl.addAttribution(mapOptions.tilesAttribution.text);
            map.addControl(attributionControl);
        }

        var center = mapOptions.center;
        if (_.isArray(center)) {
            center = L.latLng(center[1], center[0]);
        }
        var zoom = mapOptions.zoom;
        if (center && zoom !== undefined) {
            map.setView(center, zoom);
        }
        return map;
    },
    _updateZoomStyles : function() {
        var node = this.getDOMNode();
        var zoom = this.map.getZoom();
        var cls = [];
        for (var i = 0; i <= zoom; i++) {
            cls.push('zoom-' + i);
        }
        var css = node.className;
        css = css.replace(/zoom-\d+\s*/gim, '');
        css += ' ' + cls.join(' ');
        node.className = css;
    }
});
