if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons', '../src/AdapterManager',
        'expect.js' ],
// Module
function(require) {
    "use strict";
    var _ = require('underscore');
    var Mosaic = require('mosaic-commons');
    var AdapterManager = require('../src/AdapterManager');
    var expect = require('expect.js');
    var Class = Mosaic.Class;

    describe('AdapterManager', function() {

        it('should be able to register/remove static adapters', function() {
            var m = new AdapterManager();
            expect(!!m.getAdapter('a', 'b')).to.eql(false);
            m.registerAdapter('a', 'b', 'C');
            expect(m.getAdapter('a', 'b')).to.eql('C');
            m.removeAdapter('a', 'b');
            expect(!!m.getAdapter('a', 'b')).to.eql(false);
        });

        it('should be able to use static instance ' + //
        'in the newAdapterInstance method', function() {
            var m = new AdapterManager();
            var result = m.newAdapterInstance('a', 'b');
            expect(!!result).to.eql(false);
            var Type = Class.extend();
            m.registerAdapter('a', 'b', Type);
            result = m.newAdapterInstance('a', 'b');
            expect(!!result).to.eql(true);
            expect(Type.hasInstance(result)).to.eql(true);
        });

        it('should be able to register adapters for two types', function() {
            var m = new AdapterManager();
            var FirstType = Class.extend({});
            var SecondType = Class.extend({});
            var ThirdType = Class.extend({});

            expect(!!m.getAdapter(FirstType, SecondType)).to.eql(false);

            m.registerAdapter(FirstType, SecondType, ThirdType);

            expect(m.getAdapter(FirstType, SecondType)).to.eql(ThirdType);
            var result = m.newAdapterInstance(FirstType, SecondType);
            expect(!!result).to.eql(true);
            expect(ThirdType.hasInstance(result)).to.eql(true);

            m.removeAdapter(FirstType, SecondType);

            expect(!!m.getAdapter(FirstType, SecondType)).to.eql(false);
            result = m.newAdapterInstance(FirstType, SecondType);
            expect(!!result).to.eql(false);
        });

    });
});
