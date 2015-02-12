var Mosaic = require('mosaic-commons');
Mosaic.App = require('./App');
Mosaic.App.Actions = require('./App.Actions');
Mosaic.App.Api = require('./App.Api');
Mosaic.App.Component = require('./App.Component');
Mosaic.App.Store = require('./App.Store');

Mosaic.React = {
    FilterBox : require('./React.FilterBox'),
    SearchBoxMixin : require('./React.SearchBoxMixin'),
    PaginatedListView : require('./PaginatedListView'),
    PopupPanel : require('./PopupPanel')
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
module.exports = Mosaic;
