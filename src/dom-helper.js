var dom = {
  createElement: function(tagName, opt) {
    var node = document.createElement(tagName);
    if (opt.class) node.className = opt.class;
    if (opt.text) {
      var textNode = document.createTextNode(opt.text);
      node.appendChild(textNode);
    }
    return node;
  },
  insertAfter: function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  },
  renderTo: function(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
  },
  getTextNodeFromElement: function(elem) {
    if (!elem) throw new Error('Unable to set UUID, element not exist.');
    if (!elem.childNodes || elem.childNodes.length <= 0)
      throw new Error('Unable to get text node.');
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
    if (!elem.dataset)
      throw new Error('Unable to set UUID, element have no dataset attribute.');
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
