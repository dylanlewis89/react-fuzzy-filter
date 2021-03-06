[![npm version](https://badge.fury.io/js/react-fuzzy-filter.svg)](http://badge.fury.io/js/react-fuzzy-filter)
[![Build Status](https://secure.travis-ci.org/jdlehman/react-fuzzy-filter.svg?branch=master)](http://travis-ci.org/jdlehman/react-fuzzy-filter)
[![Dependency Status](https://david-dm.org/jdlehman/react-fuzzy-filter.svg)](https://david-dm.org/jdlehman/react-fuzzy-filter)

# react-fuzzy-filter

Fuzzy filter a list of data based on the search value typed in the input field. Each matching list item is rendered via a custom render function.

ReactFuzzyFilter is powered by [`fuse.js`](https://github.com/krisk/Fuse).

## Installation

```sh
npm install -S react-fuzzy-filter
```

## Example Usage

The default export of ReactFuzzyFilter is a factory function that returns two components, `InputFilter` and `FilterResults`. `FilterResults` receives the data typed into the `InputFilter` and uses it to fuzzy filter matches in its items. Each item is then rendered via a custom render function. Each invocation of the factory function creates two new "linked" components that can be used anywhere. The components do not need to live in the same component or part of the page.

```js
import React, {Component} from 'react';
import fuzzyFilterFactory from 'react-fuzzy-filter';

// these components share state and can even live in different components
const {InputFilter, FilterResults} = fuzzyFilterFactory();

class MyComponent extends Component {
  renderItem(item, index) {
    return <div key={item.meta}>{item.name}</div>;
  }

  render() {
    const items = [
      { name: 'first', meta: 'first|123', tag: 'a' },
      { name: 'second', meta: 'second|443', tag: 'b' },
      { name: 'third', meta: 'third|623', tag: 'a' },
    ];
    const fuseConfig = {
      keys: ['meta', 'tag']
    };
    return (
      <div>
        <InputFilter />
        <div>Any amount of content between</div>
        <FilterResults
          items={items}
          renderItem={this.renderItem}
          fuseConfig={fuseConfig}
        />
      </div>
    );
  }
}
```

## Components

# InputFilter

An input field that controls the state used to render the items in `FilterResults`.

## Props

### classPrefix

`classPrefix` is a string that is used to prefix the class names in the component. It defaults to `react-fuzzy-filter`. (`react-fuzzy-filter__input`)

### initialSearch

`initialSearch` is an optional string that can override the initial search state when the component is created.

### inputProps

`inputProps` is an object containing additional props to be passed to the input field.

### onChange

`onChange` is an optional callback function that is called BEFORE the value in the input field changes via an `onchange` event. It can optionally return a string, which will then be passed directly to `FilterResults` rather than the original string. This can be used to filter out special inputs (eg: `author:jdlehman`) from fuzzy searching. These special inputs could then be used to change the `items` being passed to `FilterResults`.


# FilterResults

Collection of fuzzy filtered items (filtered by the `InputFilter`'s value), each being rendered by the custom render function (`renderItem` prop).

## Props

### fuseConfig

`fuseConfig` is an object that specifies configuration for [`fuse.js`](https://github.com/krisk/Fuse), the library that is doing the fuzzy searching. The only required key in this object is `keys`, which is an array that specifies the key(s), in the objects to use for comparison. Check out all of the configuration [options](https://github.com/krisk/Fuse#options).

### renderItem

`renderItem` is a required function that defines how each match is rendered. It receives the item and the index as arguments and should return a React element.

### items

`items` is an array of the objects to be rendered. It defaults to an empty array.

### defaultAllItems

`defaultAllItems` is a boolean that determines whether all items should be shown if the search value is empty. It defaults to true (meaning all items are shown by default).

#### classPrefix

`classPrefix` is a string that is used to prefix the class names in the component. It defaults to `react-fuzzy-filter`. (`react-fuzzy-filter__results-container`)

### wrapper

`wrapper` is an optional component that will wrap the results if defined. This will be used as the wrapper around the items INSTEAD of `react-fuzzy-filter__results-container`.

### wrapperProps

`wrapperProps` is an optional object containing additional props to be passed to the `wrapper`.

### renderContainer

`renderContainer` is an alternative to using `wrapper` and `wrapperProps`. It is a function that is used as the render function for `FilterResults`. It receives two arguments, an array of React elements (the items after they have already been transformed by `renderItem`, as well as an array of the raw items. It should return a React element.
