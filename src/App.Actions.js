if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', './App.Component' ],
// Module
function(require) {
    var _ = require('underscore');
    var AppComponent = require('./App.Component');

    /** Common superclass for all stores */
    return AppComponent.extend({

    });
});
