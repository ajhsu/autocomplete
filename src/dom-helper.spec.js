var test = require('tape');
var jsdom = require('jsdom');
var dom = require('./dom-helper');

var htmlString = '<html><body></body></html>';
jsdom.env(htmlString, function(err, window) {
  // Expose window and document in global environment
  global.window = window;
  global.document = window.document;

  // Reference all properties from window to global
  Object.getOwnPropertyNames(window).map(function(prop) {
    global[prop] = window[prop];
  });

  test('dom.createElement()', function(t) {
    document.body.innerHTML = '<div id="main"></div>';
    t.true(
      dom.createElement('div') instanceof HTMLDivElement,
      "createElement('div') should created a HTMLDivElement"
    );

    t.equal(
      dom.createElement('div', { class: 'test' }).className,
      'test',
      'createElement should set classname with class option'
    );

    var e = dom.createElement('div', { text: 'Test' });
    t.equal(
      e.childNodes[0].nodeName,
      '#text',
      'createElement should create a text node with text option'
    );
    t.equal(
      e.childNodes[0].nodeValue,
      'Test',
      'createElement should set text value with text option'
    );
    t.end();
  });
  test('dom.insertAfter()', function(t) {
    // Setup HTML body
    document.body.innerHTML = '<div class="old"></div>';

    dom.insertAfter(
      dom.createElement('div', { class: 'new' }),
      document.querySelector('.old')
    );
    t.equal(
      document.querySelector('body').childNodes.length,
      2,
      'should have two elements on page'
    );
    t.equal(
      document.querySelector('body').childNodes[0].className,
      'old',
      'classname of 1st element should match expected'
    );
    t.equal(
      document.querySelector('body').childNodes[1].className,
      'new',
      'classname of 2nd element should match expected'
    );
    t.end();
  });
});
