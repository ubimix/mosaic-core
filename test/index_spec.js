var expect = require('expect.js');
var mosaicCore = require('..');
describe('mosaic-core', function() {
    it('should say hello', function() {
        expect(!!mosaicCore.sayHello).to.be(true);
        expect(mosaicCore.sayHello()).to.eql('Hello, mosaic-core!');
    });
});