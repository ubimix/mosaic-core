if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', //
'./DataSetView', './TemplateView' ],

// Module
function(require) {
    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var DataSetView = require('./DataSetView');
    var TemplateView = require('./TemplateView');

    var TemplateDataSetView = DataSetView.extend(TemplateView.prototype, {
        initialize : function(options) {
            DataSetView.prototype.initialize.apply(this, arguments);
            TemplateView.prototype.initialize.apply(this, arguments);
        },

        onRenderBegin : function() {
            this.open();
        },

        onRemove : function() {
            this.close();
        },

        /**
         * Sets a new view corresponding to the specified key.
         */
        _setView : function(key, view) {
            var that = this;
            var oldView = that._getView(key);
            DataSetView.prototype._setView.apply(that, arguments);
            if (oldView) {
                oldView.remove();
            }
            view.render();
            var element = that.getElement();
            element.append(view.getElement());
            return that;
        },

        /** Sets a new view corresponding to the specified key. */
        _removeView : function(key, view) {
            DataSetView.prototype._removeView.apply(this, arguments);
            view.remove();
            return this;
        },

    });
    return TemplateDataSetView;
});