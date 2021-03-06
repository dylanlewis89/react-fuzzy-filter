import expect from 'expect';
import {mount} from 'enzyme';
import React, {PropTypes} from 'react';
import fuzzyFilterFactory from '../src';

const items = [
  { name: 'one', searchData: 'hello' },
  { name: 'two', searchData: 'hello' },
  { name: 'three', searchData: 'goodbye' },
  { name: 'four', searchData: 'bonjour' }
];

const defaultFuseConfig = {
  keys: ['searchData']
};

function defaultRender({name}, index) {
  return <div key={name} className="my-item">{name}: {index}</div>;
}
defaultRender.propTypes = {
  name: PropTypes.string.isRequired
};

function componentFactory(inputFilterProps, filterResultsProps) {
  const {InputFilter, FilterResults} = fuzzyFilterFactory();
  function MyComponent() {
    return (
      <div>
        <h2>Separate Components</h2>
        <InputFilter {...inputFilterProps} />
        <h4>Any amount of content between</h4>
        <FilterResults {...filterResultsProps} />
      </div>
    );
  }

  return MyComponent;
}

describe('fuzzyFilterFactory', () => {
  it('returns FilterResults and InputFilter components', () => {
    const {InputFilter, FilterResults} = fuzzyFilterFactory();
    expect(typeof InputFilter).toEqual('function');
    expect(typeof FilterResults).toEqual('function');
    expect(FilterResults.displayName).toEqual('FilterResults');
    expect(InputFilter.displayName).toEqual('InputFilter');
  });

  it('input controls filter results', () => {
    const MyComponent = componentFactory(
      {placeholder: 'Search'},
      {items: items, fuseConfig: defaultFuseConfig, renderItem: defaultRender}
    );
    const component = mount(<MyComponent />);
    expect(component.find('.react-fuzzy-filter__results-container').length).toEqual(1);
    expect(component.find('.my-item').length).toEqual(4);

    component.find('input').simulate('change', {
      target: {value: 'ello'}
    });
    expect(component.find('.my-item').length).toEqual(2);

    component.find('input').simulate('change', {
      target: {value: 'gdbye'}
    });
    expect(component.find('.my-item').length).toEqual(1);
  });

  it('uses initialSearch', () => {
    const MyComponent = componentFactory(
      {placeholder: 'Search', initialSearch: 'gdbye'},
      {items: items, fuseConfig: defaultFuseConfig, renderItem: defaultRender}
    );
    const component = mount(<MyComponent />);
    expect(component.find('.react-fuzzy-filter__results-container').length).toEqual(1);
    expect(component.find('.my-item').length).toEqual(1);
  });
});
