var assert = require('assert');
var _ = require('@sailshq/lodash');
var mergeDictionaries = require('../');

describe('basic usage', function() {

  it('should do basic merges correctly', function() {

    var dictA = { foo: 'bar', nested: { owl: 'hoot', dog: 'woof' } };
    var dictB = { bleep: 'bloop', nested: { dog: 'arf', cat: 'meow', sounds: ['honk', 'squeak'], dict: {'abc': 123} } };
    var merged = mergeDictionaries(dictA, dictB);

    assert(_.isEqual(merged, { foo: 'bar', bleep: 'bloop', nested: { owl: 'hoot', dog: 'arf', cat: 'meow', sounds: ['honk', 'squeak'], dict: {'abc': 123} } }), 'Result of merge was incorrect.');

  });

  it('should maintain object references when merging modules together', function() {

    var dictA = { foo: 'bar' };
    var dictB = { nested: { empty: {} } };
    var empty = dictB.nested.empty;
    var merged = mergeDictionaries(dictA, dictB);

    assert(_.isEqual(merged, { foo: 'bar', nested: { empty: {} } }), 'Result of merge was incorrect.');
    assert(empty === merged.nested.empty, '`empty` should be direct reference to `merged.nested.empty`, but it\'s a different object!');

  });//</should maintain object references when merging modules together>

  it('should not attempt to merge arrays (it should replace array a with array b)', function() {

    var dictA = { foo: ['owl', 'snake', 'fish'] };
    var dictB = { foo: ['cat', 'dog']};
    var merged = mergeDictionaries(dictA, dictB);

    assert.equal(merged.foo.length, 2);
    assert.equal(merged.foo[0], 'cat');
    assert.equal(merged.foo[1], 'dog');

  });//</should not attempt to merge arrays>

  it('should not attempt to merge an array with a string (it should replace the string with the array)', function() {

    var dictA = { foo: 'abcde' };
    var dictB = { foo: ['cat', 'dog']};
    var merged = mergeDictionaries(dictA, dictB);

    assert.equal(merged.foo.length, 2);
    assert.equal(merged.foo[0], 'cat');
    assert.equal(merged.foo[1], 'dog');

  });//</should not attempt to merge an array with a string>

});
