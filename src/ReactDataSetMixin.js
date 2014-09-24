

    var _ = require('underscore');

    /**
     * This is a common mixin used by React classes to add automatic binding for
     * DataSets.
     */
    module.exports = {

        getDataSet : function() {
            return this.props.dataSet;
        },

        componentWillMount : function() {
            var dataSet = this.getDataSet();
            dataSet.on('update:end', this._onUpdate);
        },

        componentWillUnmount : function() {
            var dataSet = this.getDataSet();
            dataSet.off('update:end', this._onUpdate);
        },

        _onUpdate : function() {
            var that = this;
            that.setState(that._newState());
        },

        getInitialState : function() {
            return this._newState();
        },

        _newState : function() {
            return {};
        },

        renderChildren : function() {
            var dataSet = this.getDataSet();
            var list = _.map(dataSet._getIndexEntries(), function(entry) {
                return this.renderChild(entry);
            }, this);
            return list;
        },

    };
