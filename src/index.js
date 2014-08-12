var Mosaic = require('mosaic-commons');
Mosaic.Core = module.exports = {
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
