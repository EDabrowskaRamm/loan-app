import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

describe('App', () => {

  it('Snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});