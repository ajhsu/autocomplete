# Auto-Complete Component

An auto-complete component with zero dependency, built in plain javascript.

[![Build status][travis-image]][travis-url]
[![License][license-image]][license-url]

## Demo
https://ajhsu.github.io/autocomplete/

## Usage
```html
<body>
  <script src="dist/index.bundle.js"></script>
  <link rel="stylesheet" href="dist/index.css"/>
  <input id="main"></input>
  <script>
    var container = document.querySelector('#target');
    var options = {};
    var instance = autocomplete(container, options);  
  </script>
</body>
```

## To-do list
  - [ ] Design component API
  - [ ] Compare with other similars
  - [ ] Well-documented
  - [ ] Gif for Demonstration

## Similar Components on Internet
 * GitHub's repository topic editor
 * Gmail's recipient input box

[travis-image]: https://img.shields.io/travis/ajhsu/autocomplete.svg
[travis-url]: https://travis-ci.org/ajhsu/autocomplete
[license-image]: https://img.shields.io/github/license/ajhsu/autocomplete.svg
[license-url]: LICENSE