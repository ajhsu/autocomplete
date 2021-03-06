var utils = require('./utils');
var dom = require('./dom-helper');
var Dropdown = require('./dropdown');

function AutoComplete(container, dataset, opt) {
  var self = this;
  // Check params at first
  if (!container)
    throw new Error('You must assign an element to render on page!');
  if (!dataset || dataset.length === 0)
    throw new Error('dataset must be an non-empty array!');
  // Internal option object
  this._opt = {
    searchResultsToShow: (opt && opt.searchResultsToShow) || 5,
    onTagsUpdate: (opt && opt.onTagsUpdate) || function() {}
  };
  // Internal state object
  this._state = {
    tags: [],
    // Make a copy of dataset because we'll sort it in order
    dataset: dataset.slice().sort()
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
    // Reset the dropdown focus when typing
    self.dropdown.reset();
    // Collapse dropdown when text is emptied
    if (text === '') {
      self.dropdown.hide();
      return;
    }
    // Search for the index of first matches,
    // then render into dropdown items
    var firstIndex = utils.findFirstElement(self._state.dataset, text);
    if (firstIndex >= 0) {
      var itemsToShow = utils.getItemsFromArray(
        self._state.dataset,
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
AutoComplete.prototype._onTagsUpdate = function() {
  var tags = this.getTags();
  this._opt.onTagsUpdate.call(this, tags);
};
AutoComplete.prototype.getTags = function() {
  return this._state.tags.map(function(uuid) {
    return dom.getTextNodeFromElement(dom.findElementByUUID(uuid));
  });
};
module.exports = AutoComplete;
