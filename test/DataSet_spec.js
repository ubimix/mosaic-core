var _ = require('underscore');
var DataSet = require('../src/DataSet');
var expect = require('expect.js');

describe('DataSet', function() {
    var event;
    var begin = false;
    var end = false;
    var dataSet = new DataSet({});
    dataSet.on('update:begin', function() {
        begin = true;
    });
    dataSet.on('update:end', function() {
        end = true;
    });
    dataSet.on('update', function(e) {
        event = {
            enter : _.keys(e.enter),
            update : _.keys(e.update),
            exit : _.keys(e.exit),
        };
    });
    function testDataSet(str, ent, upd, ext) {
        function split(s) {
            if (s === '')
                return [];
            return _.toArray(s);
        }
        begin = false;
        end = false;
        dataSet.setData(str);
        expect(begin).to.eql(true);
        expect(end).to.eql(true);
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
