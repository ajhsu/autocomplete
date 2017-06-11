var test = require('tape');
var utils = require('./utils');

test('utils - findFirstElement()', function(t) {
  var dic = require('../dictionary.json');
  t.equal(
    utils.findFirstElement(dic.data, 'z'),
    368711,
    'should found index of first matches'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'ze'),
    368932,
    'should found index of first matches'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'zeb'),
    368958,
    'should found index of first matches'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'zebr'),
    368963,
    'should found index of first matches'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'zebra'),
    368963,
    'should found index of first matches'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'zzzzzzzzzzzzzzzzzzzzebra'),
    -1,
    'should not throw exception when target text length is larger than any words in dictionary.'
  );
  t.equal(
    utils.findFirstElement(dic.data, 'Zebra', true),
    -1,
    'should not found when case-sensitive is on.'
  );
  t.equal(
    utils.findFirstElement(dic.data, '', true),
    -1,
    'should not found when given text is empty'
  );
  t.equal(
    utils.findFirstElement(dic.data, undefined, true),
    -1,
    'should not found when text is not provided'
  );
  t.equal(
    utils.findFirstElement([], 'zebra', true),
    -1,
    'should not found when given array is empty'
  );
  t.equal(
    utils.findFirstElement(undefined, 'zebra', true),
    -1,
    'should not found when array is not provided'
  );
  t.end();
});

test('utils - getItemsFromArray()', function(t) {
  t.same(
    utils.getItemsFromArray([1, 2, 3, 4, 5], 0, 3),
    [1, 2, 3],
    'should return expected array elements'
  );
  t.same(
    utils.getItemsFromArray([1, 2, 3, 4, 5], 2, 3),
    [3, 4, 5],
    'should return expected array elements'
  );
  t.same(
    utils.getItemsFromArray([1, 2, 3, 4, 5], 2, 5),
    [3, 4, 5, undefined, undefined],
    'should return expected array elements'
  );
  t.end();
});
