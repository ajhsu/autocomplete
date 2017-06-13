(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AutoComplete = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var utils = require('./utils');
var dom = require('./dom-helper');
var Dropdown = require('./dropdown');

function AutoComplete(container, entries, opt) {
  var self = this;

  // Check params at first
  if (!container)
    throw new Error('You must assign an element to render on page!');
  if (!entries || entries.length === 0)
    throw new Error('Entries must be an non-empty array!');

  // Internal option object
  this._opt = {
    searchResultsToShow: (opt && opt.searchResultsToShow) || 5,
    onTagsUpdate: (opt && opt.onTagsUpdate) || function() {}
  };
  // Internal state object
  this._state = {
    tags: [],
    entries: entries
  };
  // Interval DOM references
  this.dom = {
    rootContainerNode: this._createRootContainer(),
    tagsContainerNode: this._createTagsContainer(),
    inputNode: this._createInputBox()
  };
  this.dom.rootContainerNode.appendChild(this.dom.tagsContainerNode);
  this.dom.rootContainerNode.appendChild(this.dom.inputNode);

  // Create dropdown menu
  this.dropdown = new Dropdown([], {
    onItemClick: function(item) {
      self._onTagSelect(item.value);
    }
  });

  this._initializeEventHandlers();

  // Replace target container with a brand new root-container
  dom.renderTo(this.dom.rootContainerNode, container);
  // Render dropdown to the input element
  this.dropdown.renderTo(this.dom.rootContainerNode);
}
AutoComplete.prototype._initializeEventHandlers = function() {
  var self = this;

  // Extend input click area to entire root-container
  this.dom.rootContainerNode.addEventListener('click', function(event) {
    if (event.target == this) {
      // Focus on inputbox when click hits on rootContainer
      self.dom.inputNode.focus();
    }
  });

  // Listen to input box's input event for typing callback
  this.dom.inputNode.addEventListener('input', function(event) {
    var text = event.currentTarget.value;
    if (text === '') {
      self.dropdown.hide();
      return;
    }
    var firstIndex = utils.findFirstElement(self._state.entries, text);
    if (firstIndex >= 0) {
      var itemsToShow = utils.getItemsFromArray(
        self._state.entries,
        firstIndex,
        self._opt.searchResultsToShow
      );
      self.dropdown.updateItems(itemsToShow);
      self.dropdown.show();
    }
  });
  // Listen to input box's keydown event for functional keys
  this.dom.inputNode.addEventListener('keydown', function(event) {
    switch (event.code) {
      case 'ArrowDown':
        self.dropdown.moveToNextItem();
        break;
      case 'ArrowUp':
        self.dropdown.moveToPrevItem();
        break;
      case 'Escape':
        self.dropdown.hide();
        break;
      case 'Enter':
        // Add new tag
        var item = self.dropdown.getCurrentItem();
        if (item) {
          var itemText = dom.getTextNodeFromElement(item);
          self._onTagSelect(itemText);
        }
        break;
    }
  });
};
AutoComplete.prototype._createRootContainer = function() {
  var divNode = dom.createElement('div', {
    class: 'autocomplete-root-container'
  });
  return divNode;
};
AutoComplete.prototype._createTagsContainer = function() {
  var ulNode = dom.createElement('ul', {
    class: 'autocomplete-tags-container'
  });
  return ulNode;
};
AutoComplete.prototype._createTag = function(text) {
  var self = this;
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
    var tagIdx = self._state.tags.indexOf(uuid);
    if (tagIdx >= 0) self._state.tags.splice(tagIdx, 1);
    // Invoke onTagsUpdate callback
    self._onTagsUpdate();
  });
  liNode.appendChild(closeButtonNode);
  return liNode;
};
AutoComplete.prototype._createInputBox = function() {
  var inputNode = dom.createElement('input', {
    class: 'autocomplete-input'
  });
  return inputNode;
};
AutoComplete.prototype._addTag = function(tagNode) {
  // Push UUID into state
  this._state.tags.push(dom.getElementUUID(tagNode));
  this.dom.tagsContainerNode.appendChild(tagNode);
  // Invoke onTagsUpdate callback
  this._onTagsUpdate();
};
AutoComplete.prototype._onTagSelect = function(itemText) {
  this._addTag(this._createTag(itemText));
  // Clean up inputbox
  this.dom.inputNode.value = '';
  // Reset dropdown menu
  this.dropdown.hide();
  this.dropdown.reset();
};
/** Return current tags label */
AutoComplete.prototype.getTags = function() {
  return this._state.tags.map(function(uuid) {
    return dom.getTextNodeFromElement(dom.findElementByUUID(uuid));
  });
};
AutoComplete.prototype._onTagsUpdate = function() {
  var tags = this.getTags();
  this._opt.onTagsUpdate.call(this, tags);
};
module.exports = AutoComplete;

},{"./dom-helper":2,"./dropdown":3,"./utils":5}],2:[function(require,module,exports){
var dom = {
  createElement: function(tagName, opt) {
    var node = document.createElement(tagName);
    if (opt && opt.class) node.className = opt.class;
    if (opt && opt.text) {
      var textNode = document.createTextNode(opt.text);
      node.appendChild(textNode);
    }
    return node;
  },
  insertAfter: function(newNode, referenceNode) {
    if (!newNode) throw new Error('newNode was not given.');
    if (!referenceNode) throw new Error('newNode was not given.');
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  },
  renderTo: function(newChild, oldChild) {
    if (!newChild) throw new Error('newChild was not given.');
    if (!oldChild) throw new Error('oldChild was not given.');
    oldChild.parentNode.replaceChild(newChild, oldChild);
  },
  getTextNodeFromElement: function(elem) {
    if (!elem) throw new Error('Unable to set UUID, element not exist.');
    if (!elem.childNodes || elem.childNodes.length <= 0) return '';
    return elem.childNodes[0].nodeValue;
  },
  /** Generate a UUID for current page */
  generateUUID: function() {
    var w = window || {};
    w.uuidCounter = w.uuidCounter || 0;
    w.uuidCounter++;
    return 'e.' + w.uuidCounter;
  },
  /** Set UUID onto element by manual */
  setElementUUID: function(elem, uuid) {
    if (!elem) throw new Error('Unable to set UUID, element not exist.');
    if (!elem.dataset) {
      // While is the environmen that doesn't support HTML5 custom data attribute (like jsdom),
      // We set the data-uuid attribute manually
      elem.setAttribute('data-uuid', uuid);
      return;
    }
    if (!uuid) throw new Error('Unable to set UUID, uuid was not given.');
    elem.dataset.uuid = uuid;
  },
  /** Get UUID onto element by manual */
  getElementUUID: function(elem) {
    if (!elem) throw new Error('Unable to get UUID, element not exist.');
    if (!elem.dataset)
      throw new Error('Unable to get UUID, element have no dataset attribute.');
    return elem.dataset.uuid;
  },
  /** Attach UUID onto element by auto-generated UUID */
  autoAttachUUID: function(elem) {
    var uuid = dom.generateUUID();
    dom.setElementUUID(elem, uuid);
    return uuid;
  },
  /** Find a element by given UUID */
  findElementByUUID: function(uuid) {
    return document.querySelector('[data-uuid="' + uuid + '"]');
  },
  removeElementByUUID: function(uuid) {
    var elem = dom.findElementByUUID(uuid);
    if (elem) elem.parentNode.removeChild(elem);
  }
};

module.exports = dom;

},{}],3:[function(require,module,exports){
var dom = require('./dom-helper');

function Dropdown(items, opt) {
  this._opt = {
    onItemClick: (opt && opt.onItemClick) || null
  };
  this._state = {
    indexOfFocusItem: -1,
    countOfItems: 0
  };
  this.dom = {
    ul: dom.createElement('ul', {
      class: 'autocomplete-dropdown'
    })
  };
  this.dom.ul.style.display = 'none';
}
Dropdown.prototype._renderFocus = function() {
  var index = this._state.indexOfFocusItem;
  for (var c = 0; c < this.dom.ul.children.length; c++) {
    if (index === c) {
      this.dom.ul.children[c].className = 'focus';
    } else {
      this.dom.ul.children[c].className = '';
    }
  }
};

Dropdown.prototype.show = function() {
  this.dom.ul.style.display = 'block';
};
Dropdown.prototype.hide = function() {
  this.dom.ul.style.display = 'none';
};
Dropdown.prototype.reset = function() {
  this._state.indexOfFocusItem = -1;
};
Dropdown.prototype.renderTo = function(refContainer) {
  var refContainerWidth = refContainer.offsetWidth;
  this.dom.ul.style.width = refContainerWidth + 'px;';
  dom.insertAfter(this.dom.ul, refContainer);
};
Dropdown.prototype.updateItems = function(items) {
  var self = this;
  // TODO: How to reuse liNodes?
  // TODO: How to create liNode in memory at first?
  if (!items) return;
  // Remove all existing li nodes
  this.dom.ul.innerHTML = '';
  var buffer = document.createDocumentFragment();
  for (var c = 0; c < items.length; c++) {
    var liNode = dom.createElement('li', {
      text: items[c]
    });
    dom.setElementUUID(liNode, 'm.' + c);
    // Event handlers for mouse pointer
    liNode.addEventListener('mouseover', function(event) {
      var target = event.currentTarget;
      var uuid = dom.getElementUUID(target);
      var index = parseInt(uuid.split('.')[1]);
      self._state.indexOfFocusItem = index;
      self._renderFocus();
    });
    liNode.addEventListener('mouseout', function(event) {
      self._state.indexOfFocusItem = -1;
      self._renderFocus();
    });
    liNode.addEventListener('click', function(event) {
      if (self._opt.onItemClick) {
        var item = self.getCurrentItem();
        self._opt.onItemClick({
          index: self._state.indexOfFocusItem,
          elem: item,
          value: dom.getTextNodeFromElement(item)
        });
      }
    });
    buffer.appendChild(liNode);
  }
  this.dom.ul.appendChild(buffer);
  this._state.countOfItems = items.length;
};
Dropdown.prototype.moveToNextItem = function() {
  if (this._state.indexOfFocusItem >= this._state.countOfItems - 1) {
    this._state.indexOfFocusItem = 0;
  } else {
    this._state.indexOfFocusItem++;
  }
  this._renderFocus();
};
Dropdown.prototype.moveToPrevItem = function() {
  if (this._state.indexOfFocusItem <= 0) {
    this._state.indexOfFocusItem = this._state.countOfItems - 1;
  } else {
    this._state.indexOfFocusItem--;
  }
  this._renderFocus();
};
Dropdown.prototype.getCurrentItem = function() {
  return this.dom.ul.children[this._state.indexOfFocusItem];
};
module.exports = Dropdown;

},{"./dom-helper":2}],4:[function(require,module,exports){
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

var AutoComplete = require('./autocomplete');
module.exports = AutoComplete;

},{"./autocomplete":1}],5:[function(require,module,exports){
module.exports = {
  /**
   * Find the first element (partially) matches text from an array
   */
  findFirstElement: function(arr, text, caseSensitive) {
    if (!arr || arr.length == 0 || !text || text === '') {
      return -1;
    }
    var compareLength = text.length;
    for (var arrIter = 0; arrIter < arr.length; arrIter++) {
      // If current item's first letter matches with target's first letter
      var firstLetterFromItem = caseSensitive
        ? arr[arrIter][0]
        : arr[arrIter][0].toLowerCase();
      var firstLetterFromTarget = caseSensitive
        ? text[0]
        : text[0].toLowerCase();
      if (firstLetterFromItem === firstLetterFromTarget) {
        // We got one match (first letter)
        var matchedCount = 1;
        // Checking following letters are match or not
        for (
          var textIter = 1;
          // It only need to iterate "Math.min(text.length, word.length)" times
          textIter < Math.min(compareLength, arr[arrIter].length);
          textIter++
        ) {
          var currentLetterFromItem = caseSensitive
            ? arr[arrIter][textIter]
            : arr[arrIter][textIter].toLowerCase();
          var currentLetterFromTarget = caseSensitive
            ? text[textIter]
            : text[textIter].toLowerCase();
          if (currentLetterFromItem === currentLetterFromTarget) matchedCount++;
        }
        // If current item matches all given letters, returns current index
        if (matchedCount === compareLength) return arrIter;
      }
    }
    return -1;
  },
  /**
   * Get N items from an array, start from startIndex
   */
  getItemsFromArray: function(arr, startIndex, length) {
    var resultArray = [];
    for (var c = 0; c < length; c++) {
      resultArray.push(arr[startIndex + c]);
    }
    return resultArray;
  }
};

},{}]},{},[4])(4)
});