if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons', './App', './App.Actions', './App.Api',
        './App.Component', './App.Store', './AbstractSet', './DataSet',
        './CompositeDataSet', './DataSetView', './LeafletDataSetView',
        './LeafletReactMap', './LeafletDataSubsetView',
        './LeafletFeatureBuilder', './Leaflet.UtfGrid', './LeafletMapViewport',
        './React.FilterBox', './React.SearchBoxMixin',
        // './TemplateDataSetView', './TemplateView', './TemplateViewManager',
        './AdapterManager', './Dependencies', './Intents', './ViewManager',
        './ActivationTree', './ReactDataSetMixin', './InfiniteScroll',

        './URI' ],
// Module
function(require) {
    var Mosaic = require('mosaic-commons');
    Mosaic.App = require('./App');
    Mosaic.App.Actions = require('./App.Actions');
    Mosaic.App.Api = require('./App.Api');
    Mosaic.App.Component = require('./App.Component');
    Mosaic.App.Store = require('./App.Store');

    Mosaic.React = {
        FilterBox : require('./React.FilterBox'),
        SearchBoxMixin : require('./React.SearchBoxMixin')
    };

    Mosaic.Leaflet = {
        ReactMap : require('./LeafletReactMap'),
        FeatureBuilder : require('./LeafletFeatureBuilder'),
        UtfGrid : require('./Leaflet.UtfGrid'),
        MapViewport : require('./LeafletMapViewport')
    };

    Mosaic.Core = {
        DataSet : require('./DataSet'),
        ActivationTree : require('./ActivationTree'),

        InfiniteScroll : require('./InfiniteScroll'),
        AbstractSet : require('./AbstractSet'),
        AdapterManager : require('./AdapterManager'),
        CompositeDataSet : require('./CompositeDataSet'),
        DataSetView : require('./DataSetView'),
        Dependencies : require('./Dependencies'),
        Intents : require('./Intents'),
        LeafletDataSetView : require('./LeafletDataSetView'),
        LeafletDataSubsetView : require('./LeafletDataSubsetView'),
        LeafletFeatureBuilder : require('./LeafletFeatureBuilder'),
        // TemplateDataSetView : require('./TemplateDataSetView'),
        // TemplateView : require('./TemplateView'),
        // TemplateViewManager : require('./TemplateViewManager'),

        ReactDataSetMixin : require('./ReactDataSetMixin'),
        ViewManager : require('./ViewManager'),

        URI : require('./URI')

    };
    return Mosaic.Core;

});
