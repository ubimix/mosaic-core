if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons', './AbstractSet', './DataSet',
        './CompositeDataSet', './DataSetView', './LeafletDataSetView',
        './LeafletDataSubsetView', './LeafletFeatureBuilder',
        './TemplateDataSetView', './TemplateView', './TemplateViewManager',
        './AdapterManager' ],
// Module
function(require) {
    var Mosaic = require('mosaic-commons');
    Mosaic.Core = {
        DataSet : require('./DataSet'),
        AbstractSet : require('./AbstractSet'),
        AdapterManager : require('./AdapterManager'),
        CompositeDataSet : require('./CompositeDataSet'),
        DataSetView : require('./DataSetView'),
        LeafletDataSetView : require('./LeafletDataSetView'),
        LeafletDataSubsetView : require('./LeafletDataSubsetView'),
        LeafletFeatureBuilder : require('./LeafletFeatureBuilder'),
        TemplateDataSetView : require('./TemplateDataSetView'),
        TemplateView : require('./TemplateView'),
        TemplateViewManager : require('./TemplateViewManager'),
    };
    return Mosaic.Core;

});
