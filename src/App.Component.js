
    var Mosaic = require('mosaic-commons');

    /**
     * An application component. It is the common superclass for all classes
     * using the application as an execution context.
     */
    module.exports = Mosaic.Class.extend(Mosaic.Events.prototype, {

        initialize : function(options) {
            this.setOptions(options);
            this.app = this.options.app;
        },

    });

