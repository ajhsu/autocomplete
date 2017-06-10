var test = require('tape');
var utils = require('./utils');

test('utils.js', function(t) {
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
  t.end();
});
