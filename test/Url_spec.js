if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ '../src/URI', 'expect.js' ],
// Module
function(URI, expect) {
    describe('URI', function() {
        it('should be able to parse and serialize URIs', function() {
            var str = 'http://www.foo.bar:23/hello/world' + //
            '?param1=value1&param2=value2#abc';
            var url = new URI(str);
            expect(url.scheme).to.eql('http');
            expect(url.port).to.eql(23);
            expect(url.path).to.eql('/hello/world');
            expect(url.query).to.eql({
                param1 : 'value1',
                param2 : 'value2'
            });
            expect(url.fragment).to.eql('abc');
            expect(url + '').to.eql(str);
            url.port = null;
            expect(url + '').to.eql('http://www.foo.bar/hello/world' + //
            '?param1=value1&param2=value2#abc');
        });
        it('should be able to parse and serialize ' + //
        'multiple query parameters with the same name', function() {
            var str = 'http://www.foo.bar:23/hello/world' + //
            '?a=A&b=B1&b=B2&b=B3&c=C#abc';
            var url = new URI(str);
            expect(url.scheme).to.eql('http');
            expect(url.port).to.eql(23);
            expect(url.path).to.eql('/hello/world');
            expect(url.query).to.eql({
                a : 'A',
                b : [ 'B1', 'B2', 'B3' ],
                c : 'C'
            });
            expect(url.fragment).to.eql('abc');
            expect(url + '').to.eql(str);
            url.port = null;
            expect(url + '').to.eql('http://www.foo.bar/hello/world' + //
            '?a=A&b=B1&b=B2&b=B3&c=C#abc');
        });
        function test(first, second, control) {
            var a = new URI(first);
            var b = new URI(second);
            var t = a.resolve(b);
            expect('' + t).to.eql(control);
            t = a.resolve(second);
            expect('' + t).to.eql(control);
        }
        it('should resolve URLs properly', function() {
            test('/abc/', './cde', '/abc/cde');
            test('/abc/', './cde/', '/abc/cde/');
            test('/abc/', './', '/abc/');
            test('/abc/', '.', '/abc/');
            test('/abc/', '..', '/');
            test('/abc/', '../cde', '/cde');
            test('/abc/', '../cde/', '/cde/');
            test('/abc/', '../cde/', '/cde/');
        });
    });
});
