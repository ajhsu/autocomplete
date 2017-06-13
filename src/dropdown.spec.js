var test = require('tape');
var jsdom = require('jsdom');
var dom = require('./dom-helper');
var Dropdown = require('./dropdown');

// Create a browser-like environment for testing
var htmlString = '<html><body></body></html>';
jsdom.env(htmlString, function(err, window) {
  // Expose window and document in global environment
  global.window = window;
  global.document = window.document;

  // Reference all properties from window to global
  Object.getOwnPropertyNames(window).map(function(prop) {
    global[prop] = window[prop];
  });

  test('Dropdown', function(t) {
    document.body.innerHTML = '';
    var dropdown = new Dropdown(['apple', 'banana', 'candy']);
    t.end();
  });
});
