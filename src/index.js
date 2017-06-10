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
var autocomplete = function(selector) {
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
  findMatchedEntries(dataset, text);
  renderDropDown(entries);
  addTag();
  removeTag();
};
