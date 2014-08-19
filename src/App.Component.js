if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'mosaic-commons' ],
// Module
function(require) {
    var Mosaic = require('mosaic-commons');

    /**
     * An application component. It is the common superclass for all classes
     * using the application as an execution context.
     */
    return Mosaic.Class.extend(Mosaic.Events.prototype, {

        initialize : function(options) {
            this.setOptions(options);
            this.app = this.options.app;
        },

    });

});