var dom = require('./dom-helper');

function Dropdown(items, opt) {
  // Internal option object
  this._opt = {
    onItemClick: (opt && opt.onItemClick) || null
  };
  // Internal state object
  this._state = {
    indexOfFocusItem: -1,
    countOfItems: 0
  };
  // Interval DOM references
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
