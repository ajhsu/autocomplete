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
