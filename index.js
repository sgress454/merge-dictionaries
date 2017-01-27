var _ = require('@sailshq/lodash');

module.exports = function(dictA, dictB) {
  return _.merge(dictA, dictB, function(a, b) {
    // For non-objects, arrays, and objects with no keys, just return the object reference.
    // This prevents arrays from being merged together (or with strings) with horrible results,
    // and prevents empty dictionary references from being broken.
    if (!_.isObject(b) || _.isArray(b) || _.keys(b).length === 0) {
      return b;
    }
    // Everything else will use the default merge strategy.  Things like functions, strings,
    // etc. already work nicely.
  });
};
