if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons', './DataSet', './CompositeDataSet',
        './DataSetView', './DataSubsetView', './LeafletDataSetView',
        './LeafletDataSubsetView', './LeafletFeatureBuilder',
        './TemplateDataSetView', './TemplateView' ],
// Module
function(require) {
    var Mosaic = require('mosaic-commons');
    Mosaic.Core = {
        DataSet : require('./DataSet'),
        CompositeDataSet : require('./CompositeDataSet'),
        DataSetView : require('./DataSetView'),
        DataSubsetView : require('./DataSubsetView'),
        LeafletDataSetView : require('./LeafletDataSetView'),
        LeafletDataSubsetView : require('./LeafletDataSubsetView'),
        LeafletFeatureBuilder : require('./LeafletFeatureBuilder'),
        TemplateDataSetView : require('./TemplateDataSetView'),
        TemplateView : require('./TemplateView')
    };
    return Mosaic.Core;

});
