/**
 * @jsx React.DOM
 */
define(
// Dependencies
[ 'require', 'underscore', 'react', 'leaflet' ],
// Module
function(require) {
    'use strict';
    var _ = require('underscore');
    var React = require('react');
    var L = require('leaflet');

    return React.createClass({
        displayName : 'ReactMap',
        render : function() {
            return (React.DOM.div({
                ref : 'container',
                id : this.props.id,
                className : this.props.className
            }));
        },
        componentDidMount : function() {
            var container = this.refs.container.getDOMNode();
            this.map = this._newMap(container);
            if (this.props.onMapAdd) {
                this.props.onMapAdd(this.map);
            }
        },
        componentWillUnmount : function() {
            if (this.props.onMapRemove) {
                this.props.onMapRemove(this.map);
            }
            this.map.remove();
            delete this.map;
        },
        _newMap : function(container) {
            var mapOptions = this.props.options || {};
            var map = L.map(container, {
                zoomControl : false
            });
            var options = _.extend({}, mapOptions.zoomControl);
            options = _.defaults(options, {
                position : 'topright'
            });

            // Set the initial view of this map
            var zoomControl = L.control.zoom(options);
            map.addControl(zoomControl);
            var center = mapOptions.center;
            if (_.isArray(center)) {
                center = L.latLng(center[1], center[0]);
            }
            var zoom = mapOptions.zoom;
            if (center && zoom !== undefined) {
                map.setView(center, zoom);
            }
            return map;
        }
    });

});
