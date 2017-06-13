/*
  Basic requirements:
  * Pure Javascript
  * Running on browser in localhost
  * Unit-Testable
    * Which means logic needs to be seperated from DOM manipulation
  * Re-usable

  Advanced requirements:
  * (Security) Should prevent from XSS with pre-defined options
    * Be aware of any XSS possibilities
  * (Performance) Should perform fleunt event with large mount of options
    * How to search within options efficiently?
  * (Performance) Avoiding memory consuming for long-time usage
    * How to minimize memory usage?
    - Avoiding reference to dom nodes, trying to use uuid instead (like reactid)
*/
var entries = require('../dictionary.json').data;
var utils = require('./utils');
var dom = require('./dom-helper');
var Dropdown = require('./dropdown');

var autocomplete = function(container, opt) {
  var autocompleteInstance = {
    state: {
      tags: []
    }
  };
  /* 
    Expected flow:
    * Get input DOM element
    * Listening to element's text changed event
    * Finding matches with input text
    * Showing Drop-down UI when text matches any options
    * Add tags only when text matches one of options

    Besides:
    * Should be work both on mouse and keyboard
  */
  var createRootContainer = function() {
    var divNode = dom.createElement('div', {
      class: 'autocomplete-root-container'
    });
    return divNode;
  };
  var createTagsContainer = function() {
    var ulNode = dom.createElement('ul', {
      class: 'autocomplete-tags-container'
    });
    return ulNode;
  };
  var createTag = function(text) {
    var createCloseButton = function() {
      var buttonNode = dom.createElement('button', {
        class: 'autocomplete-tag-close-button',
        text: 'X'
      });
      return buttonNode;
    };
    var liNode = dom.createElement('li', {
      class: 'autocomplete-tag',
      text: text || ''
    });
    var uuid = dom.autoAttachUUID(liNode);
    var closeButtonNode = createCloseButton();
    // Close button's onClick event handler
    closeButtonNode.addEventListener('click', function(event) {
      dom.removeElementByUUID(uuid);
      // Remove UUID from state
      var tagIdx = autocompleteInstance.state.tags.indexOf(uuid);
      if (tagIdx >= 0) autocompleteInstance.state.tags.splice(tagIdx, 1);
    });
    liNode.appendChild(closeButtonNode);
    return liNode;
  };
  var createInputBox = function() {
    var inputNode = dom.createElement('input', {
      class: 'autocomplete-input'
    });
    return inputNode;
  };
  var addTag = function(tagNode) {
    // Push UUID into state
    autocompleteInstance.state.tags.push(dom.getElementUUID(tagNode));
    tagsContainerNode.appendChild(tagNode);
  };
  /** Return current tags label */
  var getTags = function() {
    return autocompleteInstance.state.tags.map(function(uuid) {
      return dom.getTextNodeFromElement(dom.findElementByUUID(uuid));
    });
  };

  var rootContainerNode = createRootContainer();
  var tagsContainerNode = createTagsContainer();
  var inputNode = createInputBox();

  rootContainerNode.appendChild(tagsContainerNode);
  rootContainerNode.appendChild(inputNode);

  // Extend input click area to entire root-container
  rootContainerNode.addEventListener('click', function(event) {
    if (event.target == this) {
      // Focus on inputbox when click hits on rootContainer
      inputNode.focus();
    }
  });

  var onTagSelect = function(itemText) {
    addTag(createTag(itemText));
    // Clean up inputbox
    inputNode.value = '';
    // Reset dropdown menu
    dropdown.hide();
    dropdown.reset();
  };

  // Create dropdown menu
  var dropdown = new Dropdown([], {
    onItemClick: function(item) {
      onTagSelect(item.value);
    }
  });

  // Listen to input box's input event for typing callback
  inputNode.addEventListener('input', function(event) {
    var text = event.currentTarget.value;
    if (text === '') {
      dropdown.hide();
      return;
    }
    var firstIndex = utils.findFirstElement(entries, text);
    if (firstIndex >= 0) {
      var itemsToShow = utils.getItemsFromArray(entries, firstIndex, 25);
      dropdown.updateItems(itemsToShow);
      dropdown.show();
    }
  });
  // Listen to input box's keydown event for functional keys
  inputNode.addEventListener('keydown', function(event) {
    switch (event.code) {
      case 'ArrowDown':
        dropdown.moveToNextItem();
        break;
      case 'ArrowUp':
        dropdown.moveToPreviousItem();
        break;
      case 'Escape':
        dropdown.hide();
        break;
      case 'Enter':
        // Add new tag
        var item = dropdown.getCurrentItem();
        if (item) {
          var itemText = dom.getTextNodeFromElement(item);
          onTagSelect(itemText);
        }
        break;
    }
  });

  // Replace target container with a brand new root-container
  dom.renderTo(rootContainerNode, container);
  // Render dropdown to the input element
  dropdown.renderTo(rootContainerNode);

  // Attach public methods
  autocompleteInstance.getTags = getTags;
  return autocompleteInstance;
};

module.exports = autocomplete;
