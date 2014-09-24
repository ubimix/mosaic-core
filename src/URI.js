
    "use strict";

    /* ================================================================== */
    /* URI */
    /* ================================================================== */

    URI.toURI = function(obj) {
        return new URI(obj).toString();
    };
    URI.parse = function(str) {
        return new URI(str);
    };

    /** Constructor */
    function URI(url) {
        this.reset();
        if (typeof (url) === 'string') {
            this.setURI(url);
        } else if (typeof (url) === 'object') {
            URI._doCopy(url, this, true);
        }
    }

    /* ----------------------------------------------------------------- */
    /* URI static utility methods */
    /* ----------------------------------------------------------------- */

    /** Splits the given query string to an object */
    URI.splitQuery = function(query) {
        var result = {};
        if (query && query !== '') {
            var array = query.split('&');
            for (var i = 0; i < array.length; i++) {
                var str = array[i];
                var parts = str.split('=');
                var key = decodeURIComponent(parts[0]);
                var value = decodeURIComponent(parts[1]);
                result[key] = value;
            }
        }
        return result;
    };

    /** Serializes the specified query object as a string */
    URI.serializeQuery = function(query) {
        var result = '';
        for ( var key in query) {
            if (query.hasOwnProperty(key)) {
                var value = query[key] || '';
                var k = encodeURIComponent(key);
                var v = encodeURIComponent(value);
                if (result.length > 0) {
                    result += '&';
                }
                result += k;
                result += '=';
                result += v;
            }
        }
        return result;
    };

    function isEmptySegment(segment) {
        return segment === '' || segment === '.' || segment === '..';
    }

    /** This method resolves all path segments in the specified array. */
    URI.resolvePathSegments = function(segments, skipTraling) {
        // Resolve the merged path
        var result = false;
        var len = segments.length;
        var before = isEmptySegment(segments[0]);
        var after = isEmptySegment(segments[len - 1]);
        for (var i = 0; i < len; i++) {
            var segment = segments[i];
            if (isEmptySegment(segment)) {
                result = false;
                segments.splice(i, 1);
                len--;
                i--;
                if ('..' == segment && i >= 0) {
                    segments.splice(i, 1);
                    len--;
                    i--;
                }
            } else {
                result = true;
            }
        }
        if (before) {
            segments.splice(0, 0, '');
        }
        if (after) {
            segments = segments.push('');
        }
        return result;
    };

    URI._doCopy = function(from, to, deep) {
        for ( var key in from) {
            if (!from.hasOwnProperty(key))
                continue;
            var value = from[key];
            if ((typeof (value) === 'object') && deep) {
                value = URI._doCopy(value, {});
            }
            to[key] = value;
        }
        return to;
    };

    /* ----------------------------------------------------------------- */
    /* Main URI methods definition */
    /* ----------------------------------------------------------------- */

    /** Cleans up all internal fields */
    URI.prototype.reset = function(keepPath, keepDomain) {
        if (!keepDomain){
            delete this.scheme;
            delete this.authority;
            delete this.domain;
            delete this.port;
        }
        if (!keepPath){
            delete this.path;
            delete this.query;
            delete this.fragment;
        }
    };

    /** Cleans up all fields but 'path', 'query' and 'fragment' */
    URI.prototype.resetDomain = function() {
        this.reset(true);
    };

    /** Returns serialized JSON representation of this URI */
    URI.prototype.asJSON = function(spaces) {
        return JSON.stringify(this, null, spaces);
    };

    /** Creates and returns a new copy of this object */
    URI.prototype.newCopy = function() {
        var copy = this.newInstance();
        URI._doCopy(this, copy, true);
        return copy;
    };

    /** Creates and returns a new instance of this type */
    URI.prototype.newInstance = function() {
        return new URI();
    };

    /**
     * This method splits the given URI to individual URI parts
     * <ul>
     * <li>scheme</li>
     * <li>authority part (user info + domain name)</li>
     * <li>domain - in lower case</li>
     * <li>port - a number; 0 - if the port is not defined</li>
     * <li>path - starts with '/' or null if is not defined</li>
     * <li>query</li>
     * <li>fragment</li>
     * </ul>
     */
    URI.prototype.setURI = function(url) {
        url = url || '';
        url = url.replace(/[\\]/gi, '/');
        var idx = url.lastIndexOf('#');
        if (idx >= 0) {
            this.fragment = url.substring(idx + 1);
            url = url.substring(0, idx);
        }
        idx = url.indexOf('?');
        if (idx >= 0) {
            var str = url.substring(idx + 1);
            this.query = URI.splitQuery(str);
            url = url.substring(0, idx);
        }

        var hasDomain = false;
        if (url.match(/^\/\//)) {
            url = url.substring('//'.length);
            hasDomain = true;
        } else {
            idx = url.indexOf('://');
            if (idx >= 0) {
                this.scheme = url.substring(0, idx);
                url = url.substring(idx + '://'.length);
                hasDomain = true;
            }
        }
        if (hasDomain) {
            idx = url.indexOf('/');
            if (idx >= 0) {
                this.path = url.substring(idx);
                url = url.substring(0, idx);
            }
            idx = url.indexOf(':');
            if (idx >= 0) {
                try {
                    this.port = parseInt(url.substring(idx + 1));
                } catch (e) {
                }
                url = url.substring(0, idx);
            }
            idx = url.indexOf('@');
            if (idx >= 0) {
                this.authority = url.substring(0, idx);
                url = url.substring(0, idx);
            }
            this.domain = url.toLowerCase();
        } else {
            this.path = url;
        }
        return this;
    };

    function hasTrailingSeparator(str) {
        if (!str || str === '')
            return false;
        if (str[str.length - 1] === '/')
            return true;
        return false;
    }

    /**
     * This method resolves the specified URI object relative to this URI and
     * returns a new resolved URI instance.
     */
    URI.prototype.resolve = function(urlObj) {
        if (typeof urlObj === 'string') {
            urlObj = new URI(urlObj);
        }
        // Don't try to resolve absolute URIs
        if (urlObj.domain && '' !== urlObj.domain)
            return urlObj.newCopy();
        var base = this.newCopy();
        var urlPath = urlObj.path;
        if (urlPath.indexOf('/') !== 0) {
            var basePath = base.path;
            var idx = basePath.lastIndexOf('/');
            // Create a global array of segments containing base
            // segments
            // and
            // URL path segments.
            var segments = basePath.split(/[\/]/gi);
            var baseTrailingSeparator = hasTrailingSeparator(basePath);
            if (!baseTrailingSeparator) {
                // Remove the last segment ('file name') of the base
                // URL.
                segments.pop();
            }
            var urlSegments = urlPath.split(/[\/]/gi);
            for (var i = 0; i < urlSegments.length; i++) {
                var segment = urlSegments[i];
                segments.push(segment);
            }
            var before = segments[0] === '';
            var after = segments.length > 0 && //
            segments[segments.length - 1] === '';
            URI.resolvePathSegments(segments, true);
            base.path = segments.join('/');
            // if (before) {
            // base.path = '/' + base.path;
            // }
            // if (after) {
            // base.path += '/';
            // }
        } else {
            base.path = urlPath;
        }
        base.query = urlObj.query;
        base.fragment = urlObj.fragment;
        return base;
    };

    /**
     * This method serializes the object containing individual parts of URIs.
     */
    URI.prototype.toString = function() {
        var result = '';
        if (this.scheme) {
            result = this.scheme;
        }
        if (this.authority || this.domain) {
            if (result !== '') {
                result += ':';
            }
            result += '//';
        }
        if (this.authority) {
            result += this.authority;
            result += '@';
        }
        if (this.domain) {
            result += this.domain;
        }
        if (this.port) {
            result += ':' + this.port;
        }
        if (this.path !== '') {
            if (result.length > 0 && !this.path.match(/^[\/]/)) {
                result += '/';
            }
            result += this.path;
        }
        if (this.query) {
            var q = this.query;
            if ((typeof q) != 'string') {
                q = URI.serializeQuery(q);
            }
            result += '?' + q;
        }
        if (this.fragment) {
            result += '#' + this.fragment;
        }
        return result;
    };

    module.exports = URI;
