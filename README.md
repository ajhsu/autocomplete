# Auto-Complete Component

An auto-complete tagging input with zero dependency, built in plain javascript.

[![Build status][travis-image]][travis-url]
[![License][license-image]][license-url]

![Demo](https://raw.githubusercontent.com/ajhsu/autocomplete/master/demo.gif)

## Demo
https://ajhsu.github.io/autocomplete/

## Example
```html
<body>
  <script src="dist/index.min.js"></script>
  <link rel="stylesheet" href="dist/index.css"/>
  <input id="main"></input>
  <script>
    var container = document.querySelector('#target');
    var options = {
      searchResultsToShow: 10
    };
    var instance = new AutoComplete(container, options);  
  </script>
</body>
```

## API

### `new AutoComplete(container, dataset, [options]);`

Create an auto-complete component and render on given container.

#### container

Type: `HTMLElement`

An existing element for rendering auto-complete component on page.

#### dataset

Type: `Array`

A non-empty JavaScript that contains a set of data can be searched by auto-completion.

#### options
 * `searchResultsToShow` - ***Integer***, determine how many of search result you'd like to show.
 * `onTagsUpdate` - ***Function***, which will invoked when tag updates.

## Similar Components on Internet
 * GitHub's repository topic editor
 * Gmail's recipient input box

[travis-image]: https://img.shields.io/travis/ajhsu/autocomplete.svg
[travis-url]: https://travis-ci.org/ajhsu/autocomplete
[license-image]: https://img.shields.io/github/license/ajhsu/autocomplete.svg
[license-url]: LICENSE

## License

[MIT](LICENSE)