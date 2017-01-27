# merge-dictionaries

A wrapper around the Lodash 3 `.merge()` function that addresses some issues with arrays and empty dictionaries.

### Usage

```
npm install merge-dictionaries
```

```
var mergeDictionaries = require('merge-dictionaries');
mergeDictionaries(dictA, dictB);
```

### What&rsquo;s the problem that this solves?

The `.merge()` function works great in most cases, but the default behavior has two problems:

First, array values in the second argument are merged weirdly with values in the first argument.  Examples:

```
// Two arrays are "merged" together by replacing values in the first array with values from
// second, by index:
var dictA = { foo: ['owl', 'snake', 'fish' };
var dictB = { foo: ['cat', 'dog']};
_.merge(dictA, dictB);

// Results in:
// { foo: ['cat', 'dog', 'fish'] }


// Merging an array into a string causes the string to be busted up into an array of characters,
// which is then merged on-top-of as above:
var dictA = { foo: 'abcde' };
var dictB = { foo: ['cat', 'dog']};
_.merge(dictA, dictB);

// Results in:
// { foo: ['cat', 'dog', 'c', 'd', 'e'] }
```

Second, dictionaries in the second argument that do not have corresponding values in the first argument are copied over by reference, _unless_ the dictionary is empty:

```
// Non-empty dictionary object references are maintained:
var dictA = { foo: 'bar' };
var dictB = { owl: 'hoot'};
var owl = dictB.owl;
var merged = _.merge(dictA, dictB);

// Results in:
// { foo: 'bar', owl: 'hoot' }

console.log(owl === merged.owl);
// Results in:
// true

// But empty dictionary object references are NOT maintained, even nested ones:
var dictA = { foo: 'bar' };
var dictB = { nested: { empty: {} } };
var empty = dictB.nested.empty;
var merged = _.merge(dictA, dictB);

// Results in:
// { foo: 'bar', nested: { empty: {} } }

console.log(empty === merged.merged);
// Results in:
// false
```

This might not seem like a big issue, but it can be a real problem when merging dictionaries that contain references to objects created by another module.  For example imagine:

```
var configA = { someConfigValue: 'some default value' };
var configB = { someConfigValue: 'a custom value',  someModule: require('my-module') };
var mergedObj = _.merge(configA, configB);
```

where `my-module` looks like:

```
module.exports = ( function() {
  // Declare the public data dictionary exposed by this module.
  var publicData = {};
  return {
    // Expose the public data to the outside world.
    somePublicData: {}
    // Declare a function for initializing the module.
    init: function() {
      somePublicData.foo = 'bar';
    }
  }
} )()
```

If you call `mergedObj.someModule.init()` later, you might expect `mergedObj.someModule.somePublicData` to be set to `{foo: 'bar'}`, but it&rsquo;ll still just be an empty dictionary, because a _different `somePublicData` dictionary_ was copied into the merged object.

### What&rsquo;s the solution?

The solution is very simple, because the `_.merge()` function can take a third argument that allows you to customize the merge behavior.  We can use this to tell `_.merge()` to _only_ do its regular thing on objects that are _not_ arrays and that have keys.  The default behavior already works fine with regular expressions, functions, Buffers and other weird objects, so handling these two cases is all we need.  The actual code boils down to:

```
return _.merge(dictA, dictB, function(a, b) {
  if (!_.isObject(b) || _.isArray(b) || _.keys(b).length === 0) {
    return b;
  }
});
```
