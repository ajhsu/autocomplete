var test = require('tape');
var jsdom = require('jsdom');
var dom = require('./dom-helper');

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

    t.throws(
      function() {
        dom.insertAfter();
      },
      Error,
      'should throw Error when none of params were given'
    );

    t.throws(
      function() {
        dom.insertAfter(dom.createElement('div', { class: 'new' }));
      },
      Error,
      'should throw Error when reference node was not given'
    );

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
  test('dom.renderTo()', function(t) {
    // Setup HTML body
    document.body.innerHTML = '<div class="old"></div>';

    t.throws(
      function() {
        dom.renderTo();
      },
      Error,
      'should throw Error when none of params were given'
    );

    t.throws(
      function() {
        dom.renderTo(dom.createElement('div', { class: 'new' }));
      },
      Error,
      'should throw Error when old node was not given'
    );

    dom.renderTo(
      dom.createElement('div', { class: 'new' }),
      document.querySelector('.old')
    );
    t.equal(
      document.querySelector('body').childNodes.length,
      1,
      'should have one element on page'
    );
    t.equal(
      document.querySelector('body').childNodes[0].className,
      'new',
      'classname of 2nd element should match expected'
    );
    t.end();
  });
  test('dom.getTextNodeFromElement()', function(t) {
    document.body.innerHTML = '';
    t.throws(
      function() {
        dom.getTextNodeFromElement();
      },
      Error,
      'should throw error when no element was given'
    );
    t.equal(
      dom.getTextNodeFromElement(dom.createElement('div')),
      '',
      'should return empty string when given element have no text'
    );
    t.equal(
      dom.getTextNodeFromElement(
        dom.createElement('div', { text: 'This is a test' })
      ),
      'This is a test',
      'should return expected text value'
    );
    t.end();
  });
  test('dom.generateUUID()', function(t) {
    document.body.innerHTML = '';
    t.equal(dom.generateUUID(), 'e.1');
    t.equal(dom.generateUUID(), 'e.2');
    t.equal(dom.generateUUID(), 'e.3');
    t.end();
  });
  test('dom.setElementUUID()', function(t) {
    document.body.innerHTML = '';
    var d = dom.createElement('div');
    // While JSDOM is not support for dataset attribute,
    // we need to polyfill it manually at the moment.
    // read more at https://github.com/tmpvar/jsdom/issues/961
    d.dataset = {};
    t.throws(
      function() {
        dom.setElementUUID();
      },
      Error,
      'should throw error when none of params were given.'
    );
    t.throws(
      function() {
        dom.setElementUUID(d);
      },
      Error,
      'should throw error when uuid was not given.'
    );
    dom.setElementUUID(d, 'uuid-test');
    t.equal(d.dataset.uuid, 'uuid-test');
    t.end();
  });
  test('dom.getElementUUID()', function(t) {
    document.body.innerHTML = '';
    var d = dom.createElement('div');
    // While JSDOM is not support for dataset attribute,
    // we need to polyfill it manually at the moment.
    // read more at https://github.com/tmpvar/jsdom/issues/961
    d.dataset = {};
    dom.setElementUUID(d, 'uuid-test');
    t.equal(dom.getElementUUID(d), 'uuid-test');
    t.end();
  });
  test('dom.autoAttachUUID()', function(t) {
    document.body.innerHTML = '';
    var d = dom.createElement('div');
    // While JSDOM is not support for dataset attribute,
    // we need to polyfill it manually at the moment.
    // read more at https://github.com/tmpvar/jsdom/issues/961
    d.dataset = {};
    t.equal(dom.getElementUUID(d), undefined);
    dom.autoAttachUUID(d);
    t.notEqual(dom.getElementUUID(d), undefined);
    t.end();
  });
  test('dom.findElementByUUID()', function(t) {
    document.body.innerHTML = '';
    var d = dom.createElement('div');
    dom.setElementUUID(d, 'uuid-find-test');
    document.body.appendChild(d);
    t.true(
      dom.findElementByUUID('uuid-find-test') instanceof HTMLDivElement,
      'findElementByUUID should return a HTMLDivElement when found matches'
    );
    t.equal(
      dom.findElementByUUID('uuid-not-found-test'),
      null,
      'findElementByUUID should return null when not found'
    );
    t.end();
  });
  test('dom.removeElementByUUID()', function(t) {
    document.body.innerHTML = '';
    var d = dom.createElement('div');
    dom.setElementUUID(d, 'uuid-remove-test');
    document.body.appendChild(d);
    t.true(
      dom.findElementByUUID('uuid-remove-test') instanceof HTMLDivElement,
      'findElementByUUID should return a HTMLDivElement before we removed it'
    );
    dom.removeElementByUUID('uuid-remove-test');
    t.equal(
      dom.findElementByUUID('uuid-remove-test'),
      null,
      'findElementByUUID should return null when we removed it'
    );
    t.end();
  });
});
