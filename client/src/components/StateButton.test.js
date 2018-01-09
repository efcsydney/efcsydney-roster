import React from 'react';
import { mount } from 'enzyme';
import StateButton from './StateButton';

describe('<StateButton />', () => {
  it('should render an <button> tag', () => {
    const renderedComponent = mount(<StateButton />);
    expect(renderedComponent.find('button').length).toEqual(0);
  });

  it('should have a className attribute', () => {
    const renderedComponent = mount(<StateButton />);
    expect(renderedComponent.find('button').prop('className')).toBeDefined();
  });

  it('should adopt attributes', () => {
    const type = 'submit';
    const renderedComponent = mount(<StateButton type={type} />);
    expect(renderedComponent.find('button').prop('type')).toBeDefined();
  });

  it(`should have spinner icon when kind prop is 'loading'`, () => {
    const renderedComponent = mount(<StateButton kind="loading" />);
    expect(renderedComponent.find('FaSpinner').length).toEqual(1);
  });

  it(`should have success icon when kind prop is 'success'`, () => {
    const renderedComponent = mount(<StateButton kind="success" />);
    expect(renderedComponent.find('FaCheck').length).toEqual(1);
  });

  it(`should have failed icon when kind prop is 'failed'`, () => {
    const renderedComponent = mount(<StateButton kind="failed" />);
    expect(renderedComponent.find('FaClose').length).toEqual(1);
  });
});
