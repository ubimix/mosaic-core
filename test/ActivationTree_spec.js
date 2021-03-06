var _ = require('underscore');
var ActivationTree = require('../src/ActivationTree');
var expect = require('expect.js');

describe('ActivationTree', function() {

    var TestTreeExclusive = ActivationTree.extend({});
    var TestTree = ActivationTree.extend({
        initialize : function() {
            ActivationTree.prototype.initialize.apply(this, arguments);
            this.setOptions({
                deactivateAll : false
            });
        }
    });

    it('should be able to find a sub-nodes by their keys', function() {
        var tree = createTree(TestTree);
        var item = tree.find('item1.3');
        expect(item).not.to.eql(undefined);
        expect(item.value).to.eql('Item 1.3');

        item = tree.find('item1.4.1');
        expect(item).not.to.eql(null);
        expect(item.value).to.eql('Item 1.4.1');

        item = tree.find('item1.4');
        expect(item).not.to.eql(null);
        expect(item.value).not.to.eql('Item 1.4');
    });

    it('a subtree should propagate event about new nodes', function() {
        var tree = createTree(TestTree);
        var addEvt = null;
        tree.on('add', function(e) {
            addEvt = e;
        });
        var node = tree.find('item1.4.1');
        var newItem = node.get('toto', true);
        expect(newItem).not.to.eql(null);
        expect(newItem.getKey()).to.eql('toto');
        expect(newItem.getParent()).to.eql(node);
        expect(addEvt).not.to.eql(null);
        expect(addEvt.node).to.eql(newItem);
    });

    it('a subtree should propagate its status to parents', function() {
        var tree = createTree(TestTree);
        var evt;
        tree.on('status', function(e) {
            evt = e;
        });
        var node = tree.find('item1.4.1');
        node.setStatus('active');
        expect(evt).not.eql(null);
        expect(evt.node).eql(node);
        expect(evt.node.getStatus()).to.eql('active');
        expect(evt.prevStatus).to.eql('inactive');
        node.setStatus('inactive');
        expect(evt).not.to.eql(null);
        expect(evt.node).to.eql(node);
        expect(evt.node.getStatus()).to.eql('inactive');
        expect(evt.prevStatus).to.eql('active');
    });

    it('should be able to active just one node at time', function() {
        var tree = createTree(TestTree);
        var item_1_4 = tree.find('item1.4');
        var item_1_4_1 = tree.find('item1.4.1');
        var item_1_4_2 = tree.find('item1.4.2');
        var item_1_2 = tree.find('item1.2');
        var item_1_2_1 = tree.find('item1.2.1');
        var item_1_2_2 = tree.find('item1.2.2');

        item_1_4_1.setStatus('active');
        expect(item_1_4.getStatus()).to.eql('active');
        expect(item_1_4_1.getStatus()).to.eql('active');
        expect(item_1_4_2.getStatus()).to.eql('inactive');
        expect(item_1_2.getStatus()).to.eql('inactive');
        expect(item_1_2_1.getStatus()).to.eql('inactive');
        expect(item_1_2_2.getStatus()).to.eql('inactive');

        item_1_4_2.setStatus('active');
        expect(item_1_4.getStatus()).to.eql('active');
        expect(item_1_4_1.getStatus()).to.eql('inactive');
        expect(item_1_4_2.getStatus()).to.eql('active');
        expect(item_1_2.getStatus()).to.eql('inactive');
        expect(item_1_2_1.getStatus()).to.eql('inactive');
        expect(item_1_2_2.getStatus()).to.eql('inactive');

        item_1_2_2.setStatus('active');
        expect(item_1_4.getStatus()).to.eql('inactive');
        expect(item_1_4_1.getStatus()).to.eql('inactive');
        expect(item_1_4_2.getStatus()).to.eql('active');
        expect(item_1_2.getStatus()).to.eql('active');
        expect(item_1_2_1.getStatus()).to.eql('inactive');
        expect(item_1_2_2.getStatus()).to.eql('active');

        item_1_2_1.setStatus('active');
        expect(item_1_4.getStatus()).to.eql('inactive');
        expect(item_1_4_1.getStatus()).to.eql('inactive');
        expect(item_1_4_2.getStatus()).to.eql('active');
        expect(item_1_2.getStatus()).to.eql('active');
        expect(item_1_2_1.getStatus()).to.eql('active');
        expect(item_1_2_2.getStatus()).to.eql('inactive');
    });

    it('test1 - should be able to deactivate all subnodes', function() {
        var tree = createTree(TestTreeExclusive);
        var item_1_4_1 = tree.find('item1.4.1');
        var item_1_2_1 = tree.find('item1.2.1');

        item_1_4_1.setStatus('active');
        expect(item_1_4_1.getStatus()).to.eql('active');
        expect(item_1_2_1.getStatus()).to.eql('inactive');

        item_1_2_1.setStatus('active');
        expect(item_1_4_1.getStatus()).to.eql('inactive');
        expect(item_1_2_1.getStatus()).to.eql('active');
    });

    it('test2 - should be able to deactivate all subnodes', function() {
        var tree = newTree(TestTreeExclusive, {
            'A' : {}, //
            'B' : {}, // 
            'C' : {}, //
            'D' : { // 
                'E' : { // 
                    'F' : {}, // 
                    'G' : {}, // 
                    'H' : {}, // 
                    'I' : {}, // 
                    'J' : {}
                },
                'K' : { // 
                    'L' : {}, // 
                    'M' : {}, // 
                    'N' : {}, // 
                    'O' : {}, //
                }
            }
        });
        // 
        expect(tree.find('L').isActive()).to.eql(false);
        expect(tree.find('N').isActive()).to.eql(false);
        expect(tree.find('K').isActive()).to.eql(false);
        expect(tree.find('D').isActive()).to.eql(false);
        expect(tree.isActive()).to.eql(false);
        tree.find('N').activate();
        expect(tree.find('L').isActive()).to.eql(false);
        expect(tree.find('N').isActive()).to.eql(true);
        expect(tree.find('K').isActive()).to.eql(true);
        expect(tree.find('D').isActive()).to.eql(true);
        expect(tree.isActive()).to.eql(true);

        var list = [];
        tree.on('status', function(evt) {
            list.push(evt.node.getKey());
        });
        // printTestTree(tree);
        tree.deactivate({
            force : true
        });
        // printTestTree(tree);
        expect(list).to.eql([ 'root', 'N', 'K', 'D' ]);
    });

});

function createTree(Type) {
    return newTree(Type, {
        'item1' : 'Item One',
        'item2' : {
            'item1.1' : 'Item 1.1',
            'item1.2' : {
                'item1.2.1' : 'Item 1.2.1',
                'item1.2.2' : 'Item 1.2.2',
                'item1.2.3' : 'Item 1.2.3',
            },
            'item1.3' : 'Item 1.3',
            'item1.4' : {
                'item1.4.1' : 'Item 1.4.1',
                'item1.4.2' : 'Item 1.4.2',
                'item1.4.3' : 'Item 1.4.3',
            },
        },
        'item3' : 'Item Three',
    });
}
function newTree(Type, obj) {
    var tree = new Type({
        key : 'root'
    });
    addChildren(tree, obj);
    return tree;
}
function addChildren(node, obj) {
    _.each(obj, function(value, key) {
        var child = node.get(key, true);
        child.value = value;
        if (_.isObject(value)) {
            addChildren(child, value);
        }
    });
}
function printTestTree(root) {
    root.visit({
        print : function(node, msg) {
            var n = node;
            var str = '';
            while (n) {
                str += '  ';
                n = n.getParent();
            }
            console.log(str + msg);
        },
        before : function(node) {
            this.print(node, '<' + node.getKey() + //
            ' status="' + node._status + '">');
        },
        after : function(node) {
            this.print(node, '</' + node.getKey() + '>');
        }
    });
}
