if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'underscore', '../src/DataSet', 'expect.js' ],
// Module
function(_, DataSet, expect) {

    describe('DataSet', function() {
        var event;
        var dataSet = new DataSet({});
        dataSet.on('update', function(e) {
            event = e;
        });
        function testDataSet(str, ent, upd, ext) {
            function split(s) {
                if (s === '')
                    return [];
                return _.toArray(s);
            }
            dataSet.setData(str);
            expect(event).to.eql({
                enter : split(ent),
                update : split(upd),
                exit : split(ext),
            });
        }
        it('should properly notify about data changes', function() {
            event = null;
            expect(!!dataSet).to.be(true);
            testDataSet('abc', 'abc', '', '');
            testDataSet('cdb', 'd', 'cb', 'a');
            testDataSet('acdb', 'a', 'cdb', '');
        });
    });

});