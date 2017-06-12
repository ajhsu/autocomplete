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
*/
var entries = require('../dictionary.json').data;
var utils = require('./utils');
var dom = require('./dom-helper');

var autocomplete = function(inputElem) {
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

  var createDropdown = function(items, options) {
    var dropdownInstance = {
      state: {
        indexOfFocusItem: -1
      }
    };

    var ulNode = document.createElement('ul');
    ulNode.className = 'autocomplete-dropdown';
    ulNode.style.display = 'none';

    var show = function() {
      ulNode.style.display = 'block';
    };
    var hide = function() {
      ulNode.style.display = 'none';
    };
    var moveFocusTo = function(itemIdex) {};
    var renderTo = function(refContainer) {
      var refContainerWidth = refContainer.offsetWidth;
      ulNode.style.width = refContainerWidth + 'px;';
      dom.insertAfter(ulNode, refContainer);
    };
    var updateItems = function(items) {
      // TODO: How to reuse liNodes?
      // TODO2: How to create liNode in memory at first?
      if (!items) return;
      // Remove all existing li nodes
      ulNode.innerHTML = '';
      for (var c = 0; c < items.length; c++) {
        var liNode = document.createElement('li');
        var liContent = document.createTextNode(items[c]);
        liNode.appendChild(liContent);
        liNode.addEventListener('mouseover', function(event) {});
        liNode.addEventListener('mouseout', function(event) {});
        ulNode.appendChild(liNode);
      }
    };
    var onSelectItem = function() {};
    var renderFocus = function() {
      var index = dropdownInstance.state.indexOfFocusItem;
      for (var c = 0; c < ulNode.children.length; c++) {
        if (index === c) {
          ulNode.children[c].className = 'focus';
        } else {
          ulNode.children[c].className = '';
        }
      }
    };
    var moveToNextItem = function() {
      if (dropdownInstance.state.indexOfFocusItem >= 25 - 1) {
        dropdownInstance.state.indexOfFocusItem = 0;
      } else {
        dropdownInstance.state.indexOfFocusItem++;
      }
      renderFocus();
    };
    var moveToPreviousItem = function() {
      if (dropdownInstance.state.indexOfFocusItem == 0) {
        dropdownInstance.state.indexOfFocusItem = 25 - 1;
      } else {
        dropdownInstance.state.indexOfFocusItem--;
      }
      renderFocus();
    };

    updateItems(items);

    dropdownInstance.show = show;
    dropdownInstance.hide = hide;
    dropdownInstance.moveFocusTo = moveFocusTo;
    dropdownInstance.renderTo = renderTo;
    dropdownInstance.updateItems = updateItems;
    dropdownInstance.onSelectItem = onSelectItem;
    dropdownInstance.moveToNextItem = moveToNextItem;
    dropdownInstance.moveToPreviousItem = moveToPreviousItem;
    return dropdownInstance;
  };

  // Create dropdown menu
  var dropdown = createDropdown();
  // Render dropdown to the input element
  dropdown.renderTo(inputElem);

  var typingCallback = function(event) {
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
  };
  var functionalKeyCallback = function(event) {
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
        break;
    }
  };

  // Listen to input box's input event for typing callback
  inputElem.addEventListener('input', typingCallback);
  // Listen to input box's keydown event for functional keys
  inputElem.addEventListener('keydown', functionalKeyCallback);
};

module.exports = autocomplete;
