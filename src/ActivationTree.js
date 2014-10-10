if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', 'underscore', 'mosaic-commons' ],
// Module
function(require) {

    var Mosaic = require('mosaic-commons');
    var _ = require('underscore');
    /* ------------------------------------------------- */

    /**
     * Tree structure.
     */
    var TreeNode = Mosaic.Class.extend(//
    Mosaic.Events.prototype, Mosaic.Events, {

        /** Initializes this class */
        initialize : function(options) {
            this.setOptions(options);
            this._children = {};
        },

        /** Returns path from this node to the specified top node. */
        getPath : function(top) {
            var path = '';
            var node = this;
            while (node && node != top) {
                path = '/' + node.getKey() + path;
                node = node.getParent();
            }
            return path;
        },

        /** Returns a parent for this node. */
        getParent : function() {
            return this.parent;
        },

        /** Returns a key associated with this tree node */
        getKey : function() {
            return this.options.key;
        },

        /**
         * Adds the specified subnode to this tree node. If the subnode is not
         * defined then a new one is created and returned.
         */
        add : function(key, node) {
            var that = this;
            if (!node && _.isObject(key)) {
                node = key;
            }
            if (_.isFunction(key.getKey)) {
                key = key.getKey();
            }
            that.remove(key);
            if (!node) {
                node = that._newChild(key);
            }
            node.parent = this;
            that._children[key] = node;
            node._notify('add', {});
            return node;
        },

        /**
         * Returns an child tree node corresponding to the specified key. If
         * there is no such a sub-node and the flag "create" is true then a new
         * subnode is created.
         */
        get : function(key, create) {
            var that = this;
            var result = this._children[key];
            if (!result) {
                var path = key.split('/');
                result = this._getByPath(path, 0, create);
            }
            return result;
        },

        /**
         * Returns all child nodes corresponding to the specified keys or all
         * children if keys are not defined.
         */
        getAll : function() {
            var that = this;
            var keys = _.toArray(arguments);
            var results = [];
            that._forEach(keys, function(child) {
                results.push(child);
            });
            return results;
        },

        /**
         * Returns keys of all children of this tree node. This method keeps the
         * internal order of elements.
         */
        getAllKeys : function() {
            var that = this;
            return _.keys(that._children);
        },

        /**
         * Returns true if this node is a parent of the specified tree node.
         */
        isParentOf : function(node, includeThis) {
            var n = includeThis !== false ? node : node.getParent();
            var result = false;
            while (n) {
                result = (n === this);
                if (result)
                    break;
                n = n.getParent();
            }
            return result;
        },

        /**
         * Finds and returns a child in this node or in a sub-nodes
         * corresponding to the specified key.
         */
        find : function(key) {
            var that = this;
            var thisKey = that.getKey();
            var result;
            if (key == thisKey) {
                result = that;
            } else {
                that._forEach([], function(child) {
                    result = child.find(key);
                    return !result;
                });
            }
            return result;
        },

        /**
         * Removes an item corresponding to the specified key from this group.
         */
        remove : function(key) {
            var that = this;
            var child = that._children[key];
            if (child) {
                child._notify('remove', {});
                delete that._children[key];
            }
            return child;
        },

        /**
         * Calls the specified callback for all nodes.
         */
        visit : function(visitor) {
            var that = this;
            var visit = true;
            if (_.isFunction(visitor.before)) {
                visit = visitor.before(that) !== false;
            }
            if (visit) {
                _.each(that._children, function(child) {
                    child.visit(visitor);
                });
            }
            if (_.isFunction(visitor.after)) {
                visitor.after(that);
            }
        },

        /**
         * Returns a node corresponding to the specified path.
         * 
         * @param path
         *            an array of path segments to the required node
         * @param idx
         *            position of the current key in the path
         * @param create
         *            if this flag is <code>true</code> and there is no node
         *            corresponding to the specified path then a new node is
         *            created
         */
        _getByPath : function(path, idx, create) {
            var key = idx >= 0 && idx < path.length ? path[idx] : null;
            if (!key)
                return;
            var result = this._children[key];

            if (!result && create) {
                result = this.add(key);
            }
            if (!result)
                return result;
            return idx < path.length - 1 ? //
            result._getByPath(path, idx + 1, create) : //
            result;
        },

        /**
         * Calls the specified callback for all slots corresponding to the given
         * keys. If no keys are specified then this method iterates over all
         * slots.
         */
        _forEach : function(keys, callback) {
            var index = 0;
            function visit(child) {
                var stop = false;
                if (child) {
                    var cont = callback.call(that, child, index);
                    stop = (cont === false);
                }
                index++;
                return stop;
            }
            var that = this;
            if (_.isFunction(keys)) {
                callback = keys;
                keys = [];
            }
            if (!keys || !keys.length) {
                _.find(that._children, visit);
            } else {
                _.find(keys, function(key) {
                    var child = that._children[key];
                    return visit(child);
                });
            }
        },

        /**
         * Notifies all listeners of this node and all parent nodes about the
         * specified event.
         */
        _notify : function(eventKey, event) {
            var node = this;
            event.node = node;
            while (node) {
                node.triggerMethod(eventKey, event);
                if (event.stopPropagation)
                    break;
                node = node.getParent();
            }
        },

        /**
         * Creates and returns a new tree node corresponding to the specified
         * key
         */
        _newChild : function(key) {
            var Type = this.getClass();
            return new Type(_.extend({}, this.options, {
                key : key
            }));
        },
    });

    /* -------------------------------------------------------------- */

    /**
     * This mixin is used to add status management for Mosaic.TreeNode
     * instances.
     */
    var TreeNodeStatusMixin = {

        /** Defaults status value */
        _status : 'inactive',

        /**
         * Returns a "status" of this tree node. Status value reflects the state
         * of this node which depends on the usage of this tree.
         */
        getStatus : function() {
            return this._status || '';
        },

        /**
         * Returns a "status" of this tree node. Status value reflects the state
         * of this node which depends on the usage of this tree.
         */
        setStatus : function(status, options) {
            var prevStatus = this._status;
            var update = prevStatus != status || options && options.force;
            if (update) {
                this._status = status;
                this._notify('status', _.extend({}, options, {
                    prevStatus : prevStatus
                }));
            }
            return update;
        },

        /**
         * Sets an exclusive mode for this node. It means that just one sub-node
         * can be active at once. Already active sub-node is automatically
         * deactivated if an another child is activated.
         */
        setExclusive : function(exclusive) {
            this.options.exclusive = !!exclusive;
        },

        /**
         * Returns <code>true</code> if just one sub-node can be active at
         * once.
         */
        isExclusive : function() {
            return this.options.mode == 'exclusive' || //
            this.options.exclusive !== false;
        },

        /** Returns true if this node is active */
        isActive : function() {
            return this._status == 'active';
        },

        /**
         * Activates this node.
         */
        activate : function(options) {
            return this.setStatus('active', options);
        },

        /**
         * Deactivates this node.
         */
        deactivate : function(options) {
            return this.setStatus('inactive', options);
        },

        /** Activates inactive nodes and deactivates active ones. */
        toggle : function(options) {
            if (this.isActive()) {
                return this.deactivate(options);
            } else {
                return this.activate(options);
            }
        },

        /** Returns a list of all active direct children of this node. */
        getActive : function() {
            var list = this.getAll();
            return _.map(list, function(n) {
                return n.isActive();
            });
        },

        /** Returns a first active direct child. */
        getFirstActive : function() {
            var list = this.getAll();
            return _.find(list, function(n) {
                return n.isActive();
            });
        },

        /**
         * Returns statistics about all states of child items. The returned
         * object maps status to lists of child node keys.
         */
        getStats : function() {
            var that = this;
            var result = {
                all : []
            };
            that._forEach([], function(child) {
                var key = child.getKey();
                result.all.push(key);
                var status = child.getStatus();
                var array = result[status] = result[status] || [];
                array.push(key);
            });
            return result;
        },

        /**
         * This method is notified when the status of a child node is changed.
         * It checks this tree node is in the exclusive mode and in this case
         * deactivates all other nodes.
         */
        onStatus : (function() {
            // Returns a new event with a flag that this is an
            // "internal"
            // event fired by this method; This flag is used to
            // avoid
            // infinite event loops.
            function newEvent() {
                return {
                    internal : true
                };
            }
            // Activates all node before and deactivates after
            // already
            // active subnode
            function activateBefore(child, stage) {
                if (stage == 'before') {
                    child.activate(newEvent());
                } else if (stage == 'after') {
                    child.deactivate(newEvent());
                }
            }
            // Deactivates all nodes before and after already active subnode
            function activateAfter(child, stage) {
                function addChildren(node, obj) {
                    _.each(obj, function(value, key) {
                        if (key == '_') {
                            node.setOptions(value);
                            return;
                        }
                        var child = node.get(key, true);
                        child.value = value;
                        if (_.isObject(value)) {
                            addChildren(child, value);
                        }
                    });
                }

                if (stage == 'before') {
                    child.deactivate(newEvent());
                } else if (stage == 'after') {
                    child.activate(newEvent());
                }
            }
            // Deactivate all subnodes but the already active one
            function exclusive(child, stage) {
                if (stage == 'before' || stage == 'after') {
                    child.deactivate(newEvent());
                }
            }
            // Activates/deactivates child nodes for this tree node
            function handleChildren(that, evt) {
                var checkMode;
                if (that.options.mode == 'activateBefore') {
                    checkMode = activateBefore;
                } else if (that.options.mode == 'activateAfter') {
                    checkMode = activateAfter;
                } else if (that.isExclusive()) {
                    checkMode = exclusive;
                }
                if (checkMode) {
                    var stage = 'before';
                    var f = function(child) {
                        if (stage == 'before' && //
                        child.isParentOf(evt.node, true)) {
                            stage = 'in';
                        }
                        checkMode(child, stage);
                        if (stage == 'in') {
                            stage = 'after';
                        }
                    };
                    that._forEach([], f);
                }
            }
            return function(evt) {
                var that = this;
                if (evt.node != that) {
                    // One of sub-nodes was activated
                    if (evt.node.isActive() && !evt.internal) {
                        handleChildren(that, evt);
                        that.activate();
                    }
                } else {
                    // Deactivating of this node
                    if (!that.isActive() && that.options.deactivateAll) {
                        that.visit({
                            after : function(child) {
                                child.deactivate(newEvent());
                            }
                        });
                    }
                }
            };
        })(),
    };

    var ActivationTree = TreeNode.extend(TreeNodeStatusMixin, {
        initialize : function(options) {
            var proto = TreeNode.prototype;
            proto.initialize.call(this, options);
            this.setOptions({
                deactivateAll : true
            });
        }
    });

    return ActivationTree;
});
